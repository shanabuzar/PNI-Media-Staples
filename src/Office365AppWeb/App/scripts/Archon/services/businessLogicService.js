(function () {
    'use strict';

    angular.module("Archon")
        .service("businessLogic", ["$q", "$rootScope", "$filter", "appService", "errorService", "locationService", "pniApiService", "office365DocumentService", "messagePopupService", "$timeout",'storageService', businessLogic]);

    function businessLogic($q, $rootScope, $filter, appService, errorService, locationService, pniApiService, office365DocumentService, messagePopupService, $timeout, storageService) {
        var skipTheLetterCheck = false;
        // business objects
        var products,
            product,
            productOptions,
            optionsPackage,
            filter = $filter("filter"),
            position,
            numOfPages = null,
            location;
        var service;
        return service = {
            options: {},
            price: 0,
            appSettings: appSettings,
            back: back,
            consolidateHours: consolidateHours,
            error: error,
            isDocumentValidSize: isDocumentValidSize,
            isInsupportedCountry: isInsupportedCountry,
            findLocations: findLocations,
            getLocationMap: getLocationMap,
            getPosition: getPosition,
            getProducts: getProducts,
            getProduct: getProduct,
            getProductOptions: getProductOptions,
            getOptionsPackages: getOptionsPackages,
            getOptionsPrice: getOptionsPrice,
            getNumOfPages: getNumOfPages,
            next: next,
            setFileUpload: setFileUpload,
            selectLocation: selectLocation,
            submitOrder: submitOrder,
            trackPage: trackPage,
            checkIfAllPageSizesAreLetterSize: checkIfAllPageSizesAreLetterSize,
            OrderDetailForPreview: OrderDetailForPreview
        }

        function isLoading(bool) {
            $timeout(function () { $rootScope.$broadcast("loading", bool); }, 0);
        }

        function error(err) {
            isLoading(false);
            errorService.throw(err);
        }

        function appSettings() {
            return appService.appSettings;
        }

        function checkIfAllPageSizesAreLetterSize(allowCancel) {
            var deferred = $q.defer();
            if (!appService.isHostedInWord() || skipTheLetterCheck)
                deferred.resolve(true);
            else {
                isLoading(true);
                office365DocumentService.checkIfAllPageSizesAreLetterSize(function (result) {
                    isLoading(false);
                    if (!result) {
                        var dialogResult = messagePopupService.show("Currently we only support printing on Letter paper size. <br/><br/>Click \"OK\" for us to continue printing on 8.5'' x 11'' (Letter Size)", allowCancel);
                        dialogResult.then(function (result) {
                            // if we do not allow to cancel - just resolve
                            if (!allowCancel || result) {
                                skipTheLetterCheck = true;
                                deferred.resolve(true);
                            }
                            // otherwise resolve with dialog result
                            deferred.reject();
                        });
                    }
                    else
                        // if all pages are fine - resolve
                        deferred.resolve(true);
                });
            }
            return deferred.promise;
        }

        function consolidateHours(location) {
            if (location.Hours.length < 1) {
                error({});
                return [];
            }

            var i = 1;
            var evalDay;
            var len = location.Hours.length;
            var hours = location.Hours[0].OpeningTime + location.Hours[0].ClosingTime;
            var days = [location.Hours[0]];
            var tempHours = [];
            for (i; i < len; i++) {
                evalDay = location.Hours[i];
                if (hours == evalDay.OpeningTime + evalDay.ClosingTime) {
                    days.push(evalDay);
                } else {
                    tempHours.push(days);
                    days = [];
                    hours = evalDay.OpeningTime + evalDay.ClosingTime;
                    days.push(evalDay);
                }
            }
            tempHours.push(days);

            var k = 0;
            len = tempHours.length;
            var newHours = [];
            for (k; k < len; k++) {
                if (tempHours[k].length === 1) {
                    newHours.push(tempHours[k][0]);
                } else if (tempHours[k].length > 1) {
                    var open = tempHours[k][0];
                    var close = tempHours[k][tempHours[k].length - 1];
                    newHours.push({
                        OpeningTime: open.OpeningTime,
                        ClosingTime: open.ClosingTime,
                        DayOfWeek: open.DayOfWeek + " - " + close.DayOfWeek,
                    });
                }
            }

            return newHours;
        }

        function findLocations(pos) {
            position = pos;
            return pniApiService.locations.nearby(position)
                .then(function (data) {
                    isLoading(false);
                    return data;
                });
        }

        function getPosition(query) {
            isLoading(true);
            return locationService.getPositionByQuery(query);
        }

        function getLocationMap(location) {
            return appService.getLocationMap(location);
        }

        function getProducts() {
            if (products) {
                return $q.when(products);
            }
            isLoading(true);
            return pniApiService.product.all()
                .then(function (data) {
                    products = data;
                    isLoading(false);
                });
        }

        function getProduct(productUrl) {
            isLoading(true);
            //if (product != null) {
            //    $q.when(product);
            //}
            // TODO: could rename this to product
            return pniApiService.product.get(productUrl)
                .then(function (data) {
                    product = data;
                    productOptions = undefined;
                });
        }

        function getProductOptions() {
            if (productOptions) {
                return $q.when(productOptions);
            }
            if (!product) {
                return $q.reject("Error, no product set");
            }
            isLoading(true);
            return pniApiService.merchandising(product.FulfillmentOptions[0].Links.merchandising)
                .then(function (options) {
                    productOptions = options;
                    isLoading(false);
                    return options;
                });
        }

        function getOptionsPackages() {
            return appService.getOptionsPackages();
        }

        function getNumOfPages() {
            var deferred = $q.defer();
            appService.getPageCount(function (data) {
                numOfPages = data;
                deferred.resolve(numOfPages);
            });
            return deferred.promise;
        }

        function isDocumentValidSize() {
            var deferred = $q.defer();
            appService.isDocumentValidSize(function (success) {
                if (!success) {
                    deferred.reject({ data: { Code: "T001" } });
                } else {
                    deferred.resolve(success);
                }
            });
            return deferred.promise;
        }

        function setOptionValue(options, optionName, optionValue) {
            var option = filter(options, { Key: optionName })[0];
            option.Value.Key = optionValue;
        }

        function getOptionsPrice(_optionsPackage) {
            optionsPackage = _optionsPackage;
            var priceUrl = (product.Name === "Document") ? productOptions.OptionPricing.Href : productOptions.Pricing[0].Href;
            // This is a non-essential pricing maneuver, called here as the price is always updated when
            // an option or quantity is changed.
            // Purpose: to facilitate getting values from the document options, eg quantity //
            service.options = {};
            // numOfPages set in getNumOfPages function called before this function, so keep this line
            setOptionValue(optionsPackage, "NumOfPages", numOfPages);
            return pniApiService.product.pricing(optionsPackage, priceUrl)
                .then(function (response) {
                    response.Options.reduce(function (result, currentItem) {
                        result[currentItem.Key] = currentItem.Value.Key;
                        return result;
                    }, service.options);
                    service.price = response.Price;
                    return response;
                });
        }

        function setFileUpload(file) {
            appService.setFileUpload(file);
        }

        function selectLocation(loc) {
            location = loc;
        }

        function trackPage(url) {
            $rootScope.$broadcast("trackPage", url);
        }

        function next() {
            $rootScope.$broadcast("nextScreen");
        }
        function back() {
            $rootScope.$broadcast("backScreen");
        }

        function submitOrder(user) {
            isLoading(true);
            var pickup = {
                user: {
                    PickupInfo: user,
                    DeliveryMethod: "InStorePickup",
                    PickupMethod: "InHours"
                },
                location: {
                    PickupLocationIdentifier: location.Links.self
                }
            }

            var item = {
                ExternalItemId: "Office365 Document",
                Name: "Office Document",
                Quantity: this.options.Quantity,
                ProductInstance: {
                    MerchandisedProductIdentifier: product.FulfillmentOptions[0].Links.merchandising,
                    Options: optionsPackage,
                    PrintSurfaces: [{
                        Surface: "Primary",
                        MediaIdentifier: ""
                    }]
                }
            }
            try {
                var progress = function (prog) {
                }
                // if it succeeds, then Office.context.document is available, thus we are likely in 
                var createAccount = function () {
                    return pniApiService.createAccount();
                }
                var putPickupUser = function () {
                    return pniApiService.cart.user(pickup.user);
                }
                var putPickupLocation = function () {
                    return pniApiService.cart.location(pickup.location);
                }
                var createAlbum = function (data) {
                    return pniApiService.album.create();
                }
                var createUploadContainer = function (data) {
                    return pniApiService.createUploadContainer();
                }
                var getOrderDetails = function (order) {
                    return pniApiService.order.get(order);
                }
                var uploadDocument = function (data) {
                    return pniApiService.upload(data, progress, service.error);
                }
                var getDocumentRecommendedSize = function (data) {
                    return pniApiService.getDocumentRecommendedSize();
                }
                var postItemToCart = function (sizeArray) {
                    setOptionValue(optionsPackage, "DocumentPaperSize", sizeArray[0].DocumentPaperSize);
                    setOptionValue(optionsPackage, "DocumentOrientation", sizeArray[0].DocumentOrientation);
                    return pniApiService.cart.add(item);
                }
                var placeOrder = function () {
                    return pniApiService.cart.checkout();
                }

                checkIfAllPageSizesAreLetterSize(true).then(function () {
                    isDocumentValidSize().then(function () { isLoading(true); })
                        .then(createAccount)
                        .then(putPickupUser)
                        .then(putPickupLocation)
                        .then(createAlbum)
                        .then(createUploadContainer)
                        .then(uploadDocument)
                        .then(getDocumentRecommendedSize)
                        .then(postItemToCart)
                        .then(placeOrder)
                        .then(getOrderDetails)
                        .then(function (orderDetails) {
                            next();
                            isLoading(false);
                            $rootScope.$broadcast("checkout", orderDetails);
                        })
                        .catch(function (err) {
                            service.error(err);
                        });
                });
            } catch (ex) {
                isLoading(false);
                error(ex);
                return;
            }
        }

        function OrderDetailForPreview(user) {
         
            var orderPreview = {
                user: user,
                PackageOptions: this.options,
                NoOfPages: this.options.NumOfPages ,
                Quantity: this.options.Quantity,
                Name: "Office Document",
                PackageName: storageService.get("PackageName"),
                PickUpLoaction: location

            }   
            return orderPreview;
        }
        function isInsupportedCountry() {
            //The time-zone offset is the difference, in minutes, between UTC and local time. 
            //Note that this means that the offset is positive if the local timezone is behind UTC and negative if it is ahead.
            var d = new Date();
            var offset = d.getTimezoneOffset() / 60;
            return offset >= 4 && offset <= 8;  // us/canada
        }
    }
})();