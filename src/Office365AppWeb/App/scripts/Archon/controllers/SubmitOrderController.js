/* ContactInfoController */

(function () {
    'use strict';

    angular.module("Archon")
        .controller("SubmitOrderController", ['$scope','$rootScope', 'businessLogic', 'storageService',
            function ($scope, $rootScope, businessLogic, storageService) {
            var vm = this;
            vm.back = back;
            vm.next=next;
            vm.user;
            vm.submitForm = submitForm;
            vm.logic = businessLogic;
            vm.storageService = storageService;
            vm.storageSupported = storageService.isSupported();
            //vm.estimatedPrice = 
            function savePickupInfomation() {
                if (storageService.isSupported()) {
                    storageService.set("rememberMe", vm.rememberMe);
                    if (vm.rememberMe)
                        storageService.set("pickupInfo", vm.user);
                }
            }

            function loadPickupInformation() {
                if (storageService.isSupported()) {
                    var rememberMe = storageService.get("rememberMe");
                    if (rememberMe)
                        vm.user = storageService.get("pickupInfo");
                    vm.rememberMe = rememberMe===false?false:true;
                }
            }

            function submitForm(valid) {
                savePickupInfomation();
                businessLogic.submitOrder(vm.user);
                $scope.$parent.orderComplete = true;
            }

            function back() {
                businessLogic.back();
            }
            function next() {
                var orderPreviewDetail = businessLogic.OrderDetailForPreview(vm.user);
                businessLogic.next();
                $rootScope.$broadcast("checkout",orderPreviewDetail);
               
            }

            loadPickupInformation();
        }
    ])
})();