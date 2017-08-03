/* OrderController */

(function () {
    'use strict';
    angular.module("Archon")
    .controller("OrderCompleteController", ['$scope', 'businessLogic',
        function ($scope, businessLogic) {
            var vm = this;
            vm.base = businessLogic.appSettings().BaseScriptsDirectory;
            $scope.$on("checkout", function (event, orderDetails) {
                vm.orderDetails = orderDetails;
            })
        }
    ]);
})();

(function () {
    angular.module("Archon")
    .filter('datetime', ['$sce', '$filter', function ($sce, $filter) {
        return function (input) {
            if (input == null) { return ""; }
            var _date = $filter('date')(new Date(input),
                                  'MMMM dd, yyyy<br/>h:mm a');
            return $sce.trustAsHtml(_date);
        };
    }]);
})();
