(function () {
    'use strict';

    angular.module("Archon")
        .service("httpService", ["$q", "appService", httpService]);

    function httpService($q, appService) {
        var ApiClientKey = appService.appSettings.ApiClientKey;
        var ApiSessionToken = "";
        var headers = {
            "Api-Client-Key": ApiClientKey,
            "Api-Session-Token": ApiSessionToken,
            "Content-Type": "application/json"
        }
        return {
            setToken: setToken,
            getTokens: getTokens,
            get: get,
            post: post,
            put: put,
            appendParameters: appendParameters,
        }

        function setToken(token) {
            ApiSessionToken = token;
            headers = {
                "Api-Client-Key": ApiClientKey,
                "Api-Session-Token": ApiSessionToken,
                "Content-Type": "application/json"
            }
        }
        function getTokens() {
            return { ApiClientKey: ApiClientKey, ApiSessionToken: ApiSessionToken };
        }
        /* * RESTFUL CALLS * */
        function get(url) {
            var httpOptions = {
                url: url,
                headers: headers,
                method: "GET",
            }
            return appService.http(httpOptions);
        }
        function post(url, data) {
            var httpOptions = {
                url: url,
                method: "POST",
                headers: headers,
                data: data
            }
            return appService.http(httpOptions);
        }
        function put(url, data) {
            var httpOptions = {
                url: url,
                method: "PUT",
                headers: headers,
                data: data
            }
            return appService.http(httpOptions);
        }

        function appendParameters(url, parameters) {
            var params = "?";
            for (var param in parameters) {
                if (!parameters.hasOwnProperty(param)) {
                    continue;
                }
                params += param + "=" + parameters[param] + "&";
            }
            params = params.slice(0, -1);
            return url + params;
        }
    }
})();