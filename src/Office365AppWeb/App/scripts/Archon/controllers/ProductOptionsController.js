/* DocumentOptionsController */
(function () {
    'use strict';

    angular.module("Archon")
        .controller("ProductOptionsController", ["$scope", "$filter", "businessLogic", 'storageService',
            function ($scope, $filter, businessLogic, storageService) {
            var filter = $filter("filter");
            var comparisonQuantity = 1;
            var vm = this;
            vm.base = businessLogic.appSettings().BaseScriptsDirectory;
            vm.selections = {
                Name: "",
                Options: [],
                Price: 0
            };
            vm.quantity = 1;
            vm.gettingPriceClass = "";
            vm.maxQuantity = 100; // TODO: if this changes for any reason, must update the error message in errorService.js //
            vm.storageService = storageService;
            // public functions
            vm.setOption = setOption;
            vm.setQuantity = setQuantity;
            vm.quantityBlur = quantityBlur;
            vm.setOptionsPackage = setOptionsPackage
            vm.getOptionValue = getOptionValue;
            vm.incrementQuantity = incrementQuantity;
            vm.decrementQuantity = decrementQuantity;
            vm.next = next;

            // init
            // TODO Remove dependency to MasterController $parent here
            /*  TODO: Add document size detection service
            *   requires 1 of 2 things:
            *   1. upload document at app open to get the dimension requirements, which means reflowing the account creation logic
            *   2. using documentService pdfBytes to regex your way through the document and divide the MediaBox pixels by 72dpi to get the inches
            *   Finally, we must propegate that information to the businessLogic to get the correct price from the optionsPackage pricing service
            *   TODO: write an optionsPackage pricing service :)
            */
            //businessLogic.isDocumentValidSize()
            //.then(function (data) {
            var productUrl = businessLogic.appSettings().ProductUrl;
            businessLogic.getProduct(productUrl)
                .then(function() {
                    businessLogic.getNumOfPages()
                        .then(function(data) {
                            businessLogic.getProductOptions(productUrl)
                                .then(function () {
                                    businessLogic.checkIfAllPageSizesAreLetterSize(false);
                                    getOptionsPackages();
                                });
                        });
                })
                .catch(function(error) {
                    businessLogic.error(error);
                });
            var error;
            if ((typeof InstallTrigger !== "undefined") || (navigator.userAgent.indexOf("Firefox") !== -1)) {
                error = {
                    exDescription: "Firefox is not supported",
                    data: { Code: "ISFF" }
                };
                //businessLogic.error(error);
            }

            //#AZ: Commented  below
            //if (!businessLogic.isInsupportedCountry()) {
            //    error = {
            //        exDescription: "Local country is not supported",
            //        data: { Code: "NNA" }
            //    };
            //    businessLogic.error(error);
            //}
            
            function getOptionsPrice() {
                vm.gettingPriceClass = "data-loading";
                businessLogic.getOptionsPrice(vm.selections.Options)
                    .then(function(response) {
                        vm.selections.Options = response.Options;
                        vm.gettingPriceClass = "";
                    })
                    .catch(function(error) {
                        businessLogic.error(error);
                    });
            }

            function getOptionsPackages() {
                vm.packages = businessLogic.getOptionsPackages();
                setOptionsPackage(vm.packages[0]);
            }

            function setOption(option, value) {
                getOptionValue(option.Key);
            }

            function setOptionsPackage(optPackage) {
                vm.selections.Options = optPackage.Options;
                vm.selections.Name = optPackage.Name;
                businessLogic.trackPage({ url: "/print-options/" + encodeURIComponent(optPackage.Name) });
                getOptionValue("Quantity").Key = vm.quantity;
                getOptionsPrice();
            }

            function getOptionValue(optionName) {
                if (vm.selections.Name !== "") {
                    var option = filter(vm.selections.Options, { Key: optionName })[0];
                    return option.Value;
                } else {
                    return false;
                }
            }

            function setQuantity(nullCheck) {
                if (isQuantityValid(nullCheck)) {
                    comparisonQuantity = vm.quantity;
                    getOptionValue("Quantity").Key = vm.quantity;
                    getOptionsPrice();
                }
            }

            function quantityBlur() {
                // prevents api call if quantity has not changed
                if (vm.quantity !== comparisonQuantity) {
                    setQuantity(true);
                }
            }

            function incrementQuantity() {
                vm.quantity++;
                setQuantity();
            }

            function decrementQuantity() {
                vm.quantity--;
                setQuantity();
            }

            function isQuantityValid(nullCheck) {
                //console.log("isQuantityValid " + vm.quantity + " " + nullCheck);
                if (vm.quantity === null) {
                    if (nullCheck === true) {
                        // nullCheck added here to prevent constant checking and manipulating of user data
                        // that might get annoying if user is simply deleting the quantity to enter a value
                        // Only need to check on Next btn anyway
                        businessLogic.error({ data: { Code: "T101" } });
                        vm.quantity = 1;
                        return false;
                    }
                    return false;
                } else if (vm.quantity > vm.maxQuantity) {
                    businessLogic.error({ data: { Code: "T103" } });
                    vm.quantity = vm.maxQuantity;
                    return true;
                } else if (vm.quantity < 1) {
                    businessLogic.error({ data: { Code: "T102" } });
                    vm.quantity = 1;
                    return true;
                } else if (typeof vm.quantity === "undefined") {
                    businessLogic.error({ data: { Code: "T101" } });
                    vm.quantity = 1;
                    return true;
                } else {
                    return true;
                }
            }

            function next(packageName) {
                storageService.set("PackageName", packageName);
                if (isQuantityValid(true)) {
                    businessLogic.next();
                }
            }
        }
    ]);
})();