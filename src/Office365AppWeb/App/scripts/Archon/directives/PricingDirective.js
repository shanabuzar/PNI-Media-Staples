(function () {
    'use strict';

    angular.module("Archon")
        .directive("pniPricing", [
            "appService", function(appService) {
                return {
                    restrict: "E",
                    scope: true,
                    controller: [
                        '$scope', 'businessLogic',
                        function($scope, businessLogic) {
                            var vm = this;
                            vm.service = businessLogic;
                            vm.class = $scope.class;
                        }
                    ],
                    controllerAs: "price",
                    link: function(scope, iElement, attrs) {
                    },
                    templateUrl: appService.getTemplateUrl("pricing.html")
                }
            }
        ]);
})();