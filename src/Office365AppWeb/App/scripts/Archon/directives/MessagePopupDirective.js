(function () {
    'use strict';

    angular.module("Archon")
        .directive("pniMessagePopup", [
            "appService","$sce", function(appService, $sce) {
                return {
                    restrict: "E",
                    controller: [
                        '$scope',
                        function ($scope) {
                            var vm = this;
                            if ($scope.errorObj) {
                                vm.errorObj = $scope.errorObj;
                            }
                            var defaultObj = {
                                show: false,
                                title: "",
                                short: "",
                                long: "",
                            }
/*
                            var testObj = defaultObj;
                            testObj.long = $sce.trustAsHtml("Currently we only support printing on Letter paper size. <br/><br/>Click \"OK\" for us to continue printing on 8.5'' x 11'' (Letter Size)");
                            testObj.show = true;
                            vm.errorObj = testObj;
*/
                            $scope.$on("error", function error(event, errorObj) {
                                vm.errorObj = errorObj;
                                // prep description for bind-html
                                vm.errorObj.long = $sce.trustAsHtml(vm.errorObj.long);
                                vm.errorObj.show = true;
                            });
                            vm.cancel = function() {
                                if (typeof (vm.errorObj.cancel)==="function")
                                    vm.errorObj.cancel();
                                vm.errorObj = defaultObj;
                            }
                            vm.close = function() {
                                if (typeof (vm.errorObj.hide) === "function")
                                    vm.errorObj.hide();

                                vm.errorObj = defaultObj;
                            }
                        }
                    ],
                    controllerAs: "msg",
                    link: function (scope, iElement, attrs) {
                        scope.attrs = attrs;
                    },
                    templateUrl: appService.getTemplateUrl("message-popup.html")
                }
            }
        ]);
})();