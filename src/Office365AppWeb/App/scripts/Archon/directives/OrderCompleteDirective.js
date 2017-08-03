(function () {
    'use strict';

    angular.module("Archon")
        .directive("pniOrderComplete", [
            "appService", function(appService) {
                return {
                    restrict: "E",
                    scope: {
                        ngError: "@",
                    },
                    controller: "OrderCompleteController",
                    controllerAs: "complete",
                    templateUrl: appService.getTemplateUrl("order-complete.html")
                }
            }
        ]);
})();