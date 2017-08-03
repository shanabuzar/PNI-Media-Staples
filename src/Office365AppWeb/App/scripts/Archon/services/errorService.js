(function () {
    'use strict';

    angular.module("Archon")
        .service("errorService", ["$q", "$rootScope", errorService]);

    function errorService($q, $rootScope) {
        var localization = "en";

        var errorCodes = {
            "gen": {
                en: {
                    title: "Bad Request",
                    long: "Our bad! There was an internal error. Please try your request again. If this error persists, please try the service again later.",
                    short: "Connection Error. Please try again later.",
                    hideClose: false
                }
            },
            "T001": {
                en: {
                    title: "Document Size",
                    short: "Please adjust all page sizes to be consistent, and standard (Letter, Legal, or Ledger sizes).",
                    long: "No suitable page print size can be determined for this document. Please adjust the document so that all pages are the same dimension and orientation, and are standard Letter (8.5 x 11\"), Legal (8.5 x 14\"), or Ledger (11 x 17\") sizes.",
                    hideClose: false
                }
            },

            "T201": {
                en: {
                    title: "Sorry!",
                    short: "Can't geocode that location",
                    long: "We couldn't understand the address that was entered. Please try another one.",
                    hideClose: false
                }
            },
            "T101": {
                en: {
                    title: "Oops",
                    short: "Enter the number of copies you need",
                    long: "Please enter the number of copies you need for this document.",
                    hideClose: false
                }
            },
            "T102": {
                en: {
                    title: "Oops",
                    short: "Enter one or more copies.",
                    long: "Please enter a number greater than zero for quantity.",
                    hideClose: false
                }
            },
            // TODO: If the maximum quantity is changed in the ProductOptionsController, the maximum value displayed in an error is not reflected
            // Should have some way of connecting these two values across controllers so the value does not get confused.
            "T103": {
                en: {
                    title: "Oops",
                    short: "Enter fewer than 100 copies.",
                    long: "Please enter a number less than 100 for quantity. For more than that, please run two orders",
                    hideClose: false
                }
            },
            "T501": {
                en: {
                    title: "API Error",
                    short: "Internal server error.",
                    long: "An error occurred on the server. It has been logged for someone to look into. In the mean time, please try your request again.",
                    hideClose: false
                }
            },
            "08003": {
                en: {
                    title: "Sorry!",
                    short: "Too many pages to bind document.",
                    long: "There are too many pages for that type of binding. Please select another Print Option",
                    hideClose: false
                }
            },
            "ISFF": {
                en: {
                    title: "Sorry!",
                    short: "Browser not supported.",
                    long: "Firefox is not supported, please use Chrome, Safari or Internet Explorer 11+.",
                    hideClose: true
                }
            },
            "NNA": {
                en: {
                    title: "Sorry!",
                    short: "Service not available for your country",
                    long: "You must be in USA or Canada to use this service.",
                    hideClose: true
                }
            }
        }
        return {
            "throw": throwError
        };

        function localizeError(error) {
            var localizedError = {
                title: error[localization].title,
                short: error[localization].short,
                long: error[localization].long,
                hideClose: error[localization].hideClose,
                data: {
                    ExceptionMessage: "A generic error occurred."
                }
            }
            return localizedError;
        }
        function throwError(error) {
            var errorObj = localizeError(errorCodes["gen"]);;
            console.log("Error");
            console.log(error);
            try {
                errorObj = localizeError(errorCodes[error.data.Code]);
            } catch (err) {
                // Custom error not written for this error code, return the API's error //
                try {
                    errorObj = {
                        title: error.statusText,
                        short: error.data.Message,
                        long: error.data.Message,
                        hideClose: false
                    }
                } catch (err2) {
                    // Not an API error (or error message was poorly formed)
                    // stick with the generic error message generated above. Let finally block handle
                }
            } finally {
                $rootScope.$broadcast("error", errorObj);
                $rootScope.$broadcast("trackPage", { url: "/" + encodeURIComponent(errorObj.long) });
            }
        }
    }
})();