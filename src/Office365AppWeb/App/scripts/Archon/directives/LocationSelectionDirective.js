(function () {
    'use strict';

    angular.module("Archon")
        .directive("pniLocationSelection", [
            "appService", function(appService) {
                return {
                    restrict: "E",
                    scope: {
                        ngError: "@",
                    },
                    controller: "LocationSelectionController",
                    controllerAs: "selector",
                    templateUrl: appService.getTemplateUrl("location-selection.html")
                }
            }
        ]);
})();