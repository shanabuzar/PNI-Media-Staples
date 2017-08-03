(function () {
    'use strict';

    angular.module("Archon")
        .service("pniApiService", ["$q", "accountService", "appService", "httpService", pniApiService]);

    function pniApiService($q, accountService, appService, httpService) {

        var validPricingOptions = ["DocumentPaperSize", "DocumentPrintColor", "DocumentSided", "DocumentCover", "DocumentPaperStock", "DocumentSheetAttachement", "NumOfPages", "DocumentOrientation", "Quantity"];
        var validCartOptions = ["DocumentPaperSize", "DocumentPrintColor", "DocumentSided", "DocumentCover", "DocumentPaperStock", "DocumentSheetAttachement", "DocumentOrientation"];
        var cart = {
            add: cartAddItem,
            cart: {},
            get: cartUpdate,
            checkout: cartCheckout,
            user: cartPutUser,
            location: cartPutLocation,
        }

        var _album = {};

        var media = {}

        var album = {
            self: {},
            media: {},
            create: albumCreate,
            createUploadContainer: createUploadContainer
        };

        var order = {
            get: orderGet
        };

        var product = {
            all: productsAll,
            get: productByUrl,
            pricing: productOptionsPricing,
            product: {}
        };

        var locations = {
            nearby: locationsNearby
        };

        return {
            album: album,
            createAccount: createAccount,
            createUploadContainer: createUploadContainer,
            cart: cart,
            order: order,
            getDocumentRecommendedSize: getDocumentRecommendedSize,
            locations: locations,
            product: product,
            merchandising: merchandising,
            upload: upload
        };

        /* * ACCOUNT * */
        function createAccount() {
            return accountService.create();
        }

        function accountMedialibraries() {
            return accountService.medialibraries();
        }

        /* * ALBUM * */
        function albumCreate() {
            var newAlbum = appService.appSettings.albumData;
            return accountService.medialibraries().then(function (medialibraries) {
                return httpService.post(medialibraries[0].Links.albums, newAlbum).then(function (album) {
                    _album = album;
                });
            });
        }

        function createUploadContainer() {
            var url = _album.Links.medias;
            var data = {
                Name: appService.appSettings.AppName + " Document",
                MimeType: "application/pdf",
                // TODO: Allow for other types of uploads
            }
            return httpService.post(url, data)
                .then(function (data) {
                    album.media = data;
                    return data;
                });
        }

        /* * PRODUCTS * */
        function productsAll() {
            return httpService.get(appService.appSettings.ApiUrl + "/products");
        }

        function productByUrl(url) {
            return httpService.get(url);
        }

        function productOptionsPricing(opts, url) {
            var i = 0, len = opts.length, params = "?";
            for (i; i < len; i++) {
                if (validPricingOptions.indexOf(opts[i].Key) > -1) {
                    params += opts[i].Key + "=" + opts[i].Value.Key + "&";
                }
            }
            params = params.slice(0, -1);

            return httpService.get(url + params);
        }

        /* * CART * */
        function cartCheckout() {
            return httpService.post(httpService.appendParameters(accountService.get().Links.cart, { action: "checkout" }, {}));
        }
        function cartPutUser(user) {
            return httpService.put(accountService.get().Links.cart, user);
        }
        function cartPutLocation(location) {
            return httpService.put(accountService.get().Links.cart, location);
        }
        function cartAddItem(item) {
            var i = 0, prodops = item.ProductInstance.Options, opts = [];
            for (i; i < prodops.length; i++) {
                if (validCartOptions.indexOf(prodops[i].Key) > -1) {
                    opts.push({
                        Key: prodops[i].Key,
                        Value: prodops[i].Value.Key
                    })
                }
            }
            item.ProductInstance.Options = opts;
            return httpService.get(_album.Links.medias).then(function (medias) {
                try {
                    item.ProductInstance.PrintSurfaces[0].MediaIdentifier = medias[0].Links.self;
                    return httpService.post(accountService.get().Links.cart, [item]).then(cartUpdate)
                } catch (error) {
                    $q.reject({ data: { Code: "T501" } });
                }
            })

        }
        function cartUpdate() {
            return accountService.cart();
        }


        function orderGet(order) {
            return httpService.get(order.Links.details);
        }

        /* * LOCATIONS * */
        function locationsNearby(position) {
            var params = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                radius: 30,
                take: 5
            }
            var url = httpService.appendParameters(appService.appSettings.ApiUrl + "locations/retailer/" + appService.appSettings.RetailerCode, params);
            return httpService.get(url);
        }


        function merchandising(url) {
            return httpService.get(url);
        }

        function getDocumentRecommendedSize() {
            return httpService.get(album.media.Links.self)
                .then(function (data) {
                    return appService.getDocumentRecommendedSize(data);
                });
        }

        /* * UPLOAD * */
        function upload(data, progress, error) {
            return appService.uploadDocument(data, progress, error, httpService.getTokens(), accountService.get());
        }
    }
})();