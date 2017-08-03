/* LocationFinderController */

(function () {
    'use strict';

    angular.module("Archon")
    .controller("LocationSelectionController", ['$scope', 'businessLogic',
        function ($scope, businessLogic) {
            var img_showMore = "chevron-right.png";
            var img_showLess = "chevron-down.png";
            var cssmod_baseline = {
                height: "0px"
            }
            var cssmod_selected = {
                height: "190px"
            }
            var cssmod_expanded = {
                height: "320px"
            }

            var vm = this;
            vm.base = businessLogic.appSettings().BaseScriptsDirectory;
            vm.query;
            vm.results = {};
            vm.results.show = false;
            vm.findLocations = findLocations;
            vm.selectLocation = selectLocation;
            vm.next = next;
            vm.back = back;
            vm.selectedLocation = false;
            vm.showMoreInformation = showMoreInformation;
            vm.caratImg = img_showMore;
            vm.clearSearch = clearSearch;   //#AZ: Added this line.
            
            function findLocations() {
                if (vm.query !== "") {
                    businessLogic.trackPage({ url: "/address/" + encodeURIComponent(vm.query) });
                    businessLogic.getPosition(vm.query)
                        // use of .then instead of success because returning a defer.promise
                        // instead of an $http object (which has the success function)
                        .then(function(position) {
                            businessLogic.findLocations(position)
                                .then(function(data) {
                                    vm.results.locations = data;
                                    vm.results.show = true;
                                    var i, loc, len = vm.results.locations.length;
                                    for (i = 0; i < len; i++) {
                                        loc = vm.results.locations[i];
                                        loc.cssmod = cssmod_baseline;
                                        loc.expanded = false;
                                        loc.HoursConsolidated = businessLogic.consolidateHours(loc);
                                        loc.distance = getDistanceFromLatLonInMi(position.coords.latitude, position.coords.longitude, loc.Latitude, loc.Longitude);
                                        (function(location) {
                                            businessLogic.getLocationMap(location)
                                                .then(function(mapUrl) {
                                                    location.map = mapUrl;
                                                });
                                        })(loc);
                                    }
                                    if (data.length > 0) {
                                        selectLocation(vm.results.locations[0]);
                                    }
                                });
                        })
                        .catch(function(err) {
                            businessLogic.error(err);
                        });
                }
            }

            function selectLocation(location) {
                vm.caratImg = img_showMore;
                var i, loc, len = vm.results.locations.length;
                for (i = 0; i < len; i++) {
                    loc = vm.results.locations[i];
                    loc.selected = false;
                    loc.icon = "unselected";
                    loc.cssmod = cssmod_baseline
                }
                location.cssmod = {
                    height: "" + getMoreInformationHeight(location) + "px"
                }
                location.selected = true;
                location.icon = "selected";
                vm.selectedLocation = location;
                vm.buttonText = "Next";
            }

            function getMoreInformationHeight(location) {
                // This is so tightly coupled to the front end
                // that javascript cries when it's called
                // TODO: decouple
                var itemMargin = 12;
                var paragraphHeight = 17;
                var px = businessLogic.appSettings().MapHeight + itemMargin
                px += paragraphHeight + itemMargin
                var i = 0;
                try {
                    var len = location.HoursConsolidated.length
                    for (i; i < len; i++) {
                        px += paragraphHeight;
                    }
                } catch (error) {
                    // probably nothing going on here
                } finally {
                    return px;
                }
            }

            function showMoreInformation(location) {
                location.cssmod = location.expanded ? cssmod_selected : cssmod_expanded;
                vm.caratImg = location.expanded ? img_showMore : img_showLess;
                location.expanded = !location.expanded;
            }

            function next() {
                businessLogic.selectLocation(vm.selectedLocation);
                businessLogic.next();
            }
            function back() {
                businessLogic.back();
            }

            function getDistanceFromLatLonInMi(lat1, lon1, lat2, lon2) {
                var kmToMi = 0.621371;
                var R = 6371; // Radius of the earth in km
                var dLat = deg2rad(lat2 - lat1);  // deg2rad below
                var dLon = deg2rad(lon2 - lon1);
                var a =
                  Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2)
                ;
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var d = R * c * kmToMi; // Distance in km
                return d;
            }

            function deg2rad(deg) {
                return deg * (Math.PI / 180)
            }

            //#AZ Added below function
            function clearSearch() {
                if (vm.query == "") {
                    vm.results = {};
                    vm.results.show = false;
                    vm.selectedLocation = false;
                }
            }
        }
    ]);
})();