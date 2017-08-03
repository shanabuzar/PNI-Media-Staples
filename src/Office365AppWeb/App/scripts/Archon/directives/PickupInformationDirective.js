(function () {
    'use strict';

    angular.module("Archon")
        .directive("pniPickupInformation", [
            "appService", function(appService) {
                return {
                    restrict: "E",
                    scope: {
                        ngError: "@",
                    },
                    controller: "SubmitOrderController",
                    controllerAs: "contact",
                    templateUrl: appService.getTemplateUrl("pickup-information.html")
                }
            }
        ]);
})();