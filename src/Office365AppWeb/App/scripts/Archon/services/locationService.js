(function () {
    'use strict';

    angular.module("Archon")
    .service("locationService", ["$q", "appService", function ($q, appService) {

        return {
            getPositionByQuery: getPositionByQuery,
        }


        function getPositionByQuery(query) {
            var deferred = $q.defer();
            appService.http({
                url: appService.appSettings.GeocodeUrl + query, //+ "&key=" + appService.appSettings.GeocodeApiKey,
                method: "GET"
            })
            .then(function (data) {
                if (data.status == "OK") {
                    deferred.resolve(normalizeGoogleGeocodeObject(data));
                } else {
                    deferred.reject({
                        data: {
                            Code: "T201"
                        }});
                }
            })
            return deferred.promise;
        }
        function normalizeGoogleGeocodeObject(googleResponse) {
            if (googleResponse.results.length == 0) {
                alert("error geocoding address");
                // todo more robust error handling
                return [];
            }
            var position = {
                coords: {
                    latitude: googleResponse.results[0].geometry.location.lat,
                    longitude: googleResponse.results[0].geometry.location.lng
                }
            }
            return position;
        }
    }])
})();