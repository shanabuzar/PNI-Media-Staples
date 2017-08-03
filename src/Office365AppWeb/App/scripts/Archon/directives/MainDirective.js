(function () {
    'use strict';

    angular.module("Archon")
        .directive("main", [
            "appService", function(appService) {
                return {
                    restrict: "E",
                    templateUrl: appService.getTemplateUrl("allHtml.html")
                }
            }
        ]);
})();