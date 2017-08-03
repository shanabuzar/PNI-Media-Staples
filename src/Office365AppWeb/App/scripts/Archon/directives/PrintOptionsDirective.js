(function () {
    'use strict';
 angular.module("Archon")
   
        .directive("pniPrintOptions", [
            "appService", function(appService) {
                return {
                    restrict: "E",
                    scope: {
                        ngError: "@",
                    },
                    controller: "ProductOptionsController",
                    controllerAs: "product",
                    templateUrl: appService.getTemplateUrl("print-options.html")
                }
            }
        ]);
})();