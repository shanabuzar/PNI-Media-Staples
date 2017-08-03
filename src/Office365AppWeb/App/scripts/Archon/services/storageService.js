(function() {
    'use strict';

    angular.module("Archon")
        .service("storageService", ["$window",service]);

    function service($window) {
        var storage = (typeof $window.localStorage === 'undefined') ? undefined : $window.localStorage;
        var isSupported = (typeof storage !== 'undefined');

        return {
            isSupported: function () {
                return isSupported;
            },
            get: !isSupported?angular.noop:function (key) {
                if (!isSupported)
                    return null;
                return angular.fromJson(storage.getItem(key));
            },
            set: !isSupported?angular.noop:function (key, value) {
                storage.setItem(key, angular.toJson(value));
            },
            remove: !isSupported?angular.noop:function(key) {
                storage.removeItem(key);
            }
        }
    }
})();