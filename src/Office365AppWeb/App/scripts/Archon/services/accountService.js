(function () {
    'use strict';

    angular.module("Archon")
        .service("accountService", ["$q", "appService", "errorService", "httpService", accountService]);

    function accountService($q, appService, errorService, httpService) {
        var _account = null;
        
        function get() {
            if (!_account) {
                errorService.throw({ data: { Code: "0901", Message: "Account has not been created" } });
                return undefined;
            }
            return _account;
        }
        function create() {
            if (_account) {
                return $q.when(_account);
            }

            var url = appService.appSettings.ApiUrl + "accounts/retailer/" + appService.appSettings.RetailerCode;
            var data = {
                account: ""
            };

            return httpService.post(url, data)
                .then(function (acct) {
                    _account = acct;
                    httpService.setToken(_account.ApiSessionToken);
                    return _account;
                });
        }
        function addresses() {
            return httpService.get(_account.Links.addresses);
        }
        function cart() {
            return httpService.get(_account.Links.cart);
        }
        function orders() {
            return httpService.get(_account.Links.orders);
        }
        function medialibraries() {
            return httpService.get(_account.Links.medialibraries);
        }

        return {
            get: get,
            addresses: addresses,
            create: create,
            cart: cart,
            orders: orders,
            medialibraries: medialibraries,
        }
    }
})();
