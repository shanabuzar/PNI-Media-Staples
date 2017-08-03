(function () {
    'use strict';

    angular.module("Archon")
        .directive("pniOrderPreview", [
            "appService", function(appService) {
                return {
                    restrict: "E",
                    scope: {
                        ngError: "@",
                    },
                    controller: "OrderPreviewController",
                    controllerAs: "preview",
                    templateUrl: appService.getTemplateUrl("order-preview.html")
                }
            }
        ]);
})();