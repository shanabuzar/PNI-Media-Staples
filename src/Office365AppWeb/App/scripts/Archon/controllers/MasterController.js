/* MasterController */

(function () {
    "use strict";

    angular.module("Archon")
    .controller('MasterController', ['$scope', '$anchorScroll', 'appService',
        function ($scope, $anchorScroll, appService) {
            var titles = ["Print Options", "Pickup Location", "Pickup Information","Order Preview", "Order Confirmation"];
            var pageUrls = ["/print-options", "/pickup-location", "/pickup-information", "/order-preview", "/order-confirmation"];
            var vm = this;
            vm.base = appService.appSettings.BaseScriptsDirectory;
            $scope.orderComplete = false;

            vm.currentScreen = 0;
            vm.steps = {
                titles: titles,
                index: 0,
                length: titles.length
            }
            vm.loading = false;
            vm.trackPage = trackPage;

            $scope.appSettings = appService.initialize();

            $scope.$on("loading", function show(event, loadingState) {
                vm.loading = loadingState;
            });
            $scope.$on("nextScreen", function () {
                $anchorScroll();
                vm.steps.index++;
                vm.trackPage(pageUrls[vm.steps.index]);
                vm.containerStyle = {
                    "margin-left": "-" + (300 * vm.steps.index) + "px"
                }
            });
            $scope.$on("backScreen", function () {
                $anchorScroll();
                vm.steps.index--;
                vm.trackPage(pageUrls[vm.steps.index]);
                if (vm.steps.index < 0) { vm.steps.index = 0; }

                vm.containerStyle = {
                    "margin-left": "-" + (300 * vm.steps.index) + "px"
                }
            });
            $scope.$on("trackPage", function (event, args) {
                vm.trackPage(args.url);
            });

            $scope.loading = function (bool) {
                vm.loading = bool;
            }

            $scope.previousScreen = function () {
                vm.steps.index--;
                if (vm.steps.index < 0) { vm.steps.index = 0; }

                vm.containerStyle = {
                    "margin-left": "-" + (300 * vm.steps.index) + "px"
                }
            }

            function trackPage(url) {
                // prefix environment: stg or prod
                url = "/" + appService.appSettings.Environment + url;
                window.ga("set", "page", url);
                window.ga('send', 'pageview');
            }
        }
    ]);
})();