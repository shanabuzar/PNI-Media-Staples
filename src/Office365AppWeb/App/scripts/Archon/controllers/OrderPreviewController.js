/* previewController */

(function () {
    'use strict';
    angular.module("Archon")
        .controller("OrderPreviewController", ['$q','$rootScope','$scope', 'businessLogic', 'storageService',
            function ($q,$rootScope,$scope, businessLogic, storageService) {
                var vm = this;
                vm.base = businessLogic.appSettings().BaseScriptsDirectory;
                $scope.$on("checkout", function (event, orderPreviewDetail) {
                    vm.orderPreviewDetail = orderPreviewDetail;
                })
                vm.back = back;
                function back() {
                    businessLogic.back();
                }
            }
        ]);
})();


