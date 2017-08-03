(function () {
    'use strict';

    angular.module("Archon")
        .service("appService", ["$q", "$http", "productSizeService", "office365DocumentService", appService]);

    function appService($q, $http, productSizeService, office365DocumentService) {
        var ApiSessionToken = null;
        var appSettings = {
            // This version has to be in sync with the version in AngularTemplateBundle            
            ApiClientKey: window.appSettings.ApiClientKey,
            AppName: window.appSettings.AppName,
            AppContextId: window.appSettings.AppContextId,
            albumData: {
                Name: "Print At Staples"
            },
            ApiUrl: window.appSettings.ApiUrl,
            Environment: window.appSettings.Environment,
            ProductUrl: window.appSettings.ApiUrl + "products/" + window.appSettings.ProductId,
            GeocodeUrl: window.appSettings.GeocodeUrl,
            GeocodeApiKey: window.appSettings.GeocodeApiKey,
            MapApiKey: window.appSettings.MapApiKey,
            MapUrl: window.appSettings.MapUrl,
            MapWidth: parseInt(window.appSettings.MapWidth),
            MapHeight: parseInt(window.appSettings.MapHeight),
            MapZoomLevel: parseInt(window.appSettings.MapZoomLevel),
            TemplateVersion: window.appSettings.TemplateVersion,
            BaseScriptsDirectory: window.appSettings.BaseScriptsDirectory,
            RetailerId: window.appSettings.RetailerId,
            RetailerCode: window.appSettings.RetailerCode,
            RecommendationServiceUrl: window.appSettings.RecommendationServiceUrl,
            UpperLimit: window.appSettings.UpperLimit,
            LowerLimit: window.appSettings.LowerLimit,
            productType: "Document"
        };

        return {
            appSettings: appSettings,
            http: http,
            initialize: initialize,
            isHostedInWord: isHostedInWord,
            isDocumentValidSize: isDocumentValidSize,
            getDocumentRecommendedSize: getDocumentRecommendedSize,
            getLocationMap: getLocationMap,
            getPageCount: getPageCount,
            getOptionsPackages: getOptionsPackages,
            setApiSessionToken: setApiSessionToken,
            uploadDocument: uploadDocument,
            getTemplateUrl: getTemplateUrl
        };


        function initialize() {
            Office.initialize = function (reason) {
                officeApp.initialize();
            };
            return appSettings;
        }

        function getTemplateUrl(templateName) {
            return appSettings.BaseScriptsDirectory + "partials/" + templateName + "?v=" + appSettings.TemplateVersion;
            //return appSettings.BaseScriptsDirectory + "partials/" + templateName;
        }

        function http(httpOptions) {
            // using deferred object here instead of $http promise to
            // force use of .then instead of .success, incase the implementation 
            // of a call needs to change (GAScripts for eg)
            var deferred = $q.defer();
            $http(httpOptions)
                .then(function (data) {
                    deferred.resolve(data.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function getLocationMap(position) {
            var mapUrl = appSettings.MapUrl + position.Latitude + "," + position.Longitude + "/" + appSettings.MapZoomLevel + "?mapSize=" + appSettings.MapWidth + "," + appSettings.MapHeight + "&pushpin=" + position.Latitude + "," + position.Longitude + "&key=" + appSettings.MapApiKey;
            return $q.when(mapUrl);
        }

        function getPageCount(success) {
            office365DocumentService.getPageCount(success);
        }
        function isDocumentValidSize(success) {
            office365DocumentService.isDocumentValidSize(success);
        }

        function getDocumentRecommendedSize(mediaData) {
            if (mediaData.PageSizeInInches.length !== 1) {
                return $q.reject({ data: { Code: "T001" } });
            }
            var pdfSize = mediaData.PageSizeInInches[0];
            return productSizeService.getRecommendation(pdfSize)
                .then(function (acceptedSizes) {
                    if (acceptedSizes.length > 0) {
                        return $q.when(acceptedSizes);
                    } else {
                        return $q.reject({ data: { Code: "T001" } });
                    }
                });

        }

        function getOptionsPackages() {
            var packages = [
                {
                    Name: "Economy",
                    Options: [{ "Key": "DocumentPaperSize", "Name": "Document: Paper Size", "OptionType": "Select", "Value": { "Key": "Letter", "Value": "8.5x11 Letter", "Source": "request" } }, { "Key": "DocumentPrintColor", "Name": "Document: Print Color", "OptionType": "Select", "Value": { "Key": "BlackAndWhite", "Value": "Black And White", "Source": "request" } }, { "Key": "DocumentSided", "Name": "Document: Sided", "OptionType": "Select", "Value": { "Key": "DoubleSided", "Value": "Double Sided", "Source": "request" } }, { "Key": "DocumentOrientation", "Name": "Document: Orientation", "OptionType": "Select", "Value": { "Key": "Portrait", "Value": "Portrait", "Source": "request" } }, { "Key": "DocumentCover", "Name": "Document: Cover", "OptionType": "Select", "Value": { "Key": "None", "Value": "None", "Source": "request" } }, { "Key": "DocumentSheetAttachement", "Name": "Document: Sheet Attachement", "OptionType": "Select", "Value": { "Key": "None", "Value": "None", "Source": "request" } }, { "Key": "DocumentPaperStock", "Name": "Document: Paper Stock", "OptionType": "Select", "Value": { "Key": "24LbStandard", "Value": "24 Lb Standard", "Source": "request" } }, { "Key": "NumOfPages", "Name": "NumOfPages", "OptionType": "Text", "Value": { "Key": "1", "Value": "1", "Source": "default" } }, { "Key": "Quantity", "Name": "Quantity", "OptionType": "Text", "Value": { "Key": "1", "Value": "1", "Source": "default" } }]
                },
                {
                    Name: "Standard",
                    Options: [{ "Key": "DocumentPaperSize", "Name": "Document: Paper Size", "OptionType": "Select", "Value": { "Key": "Letter", "Value": "8.5x11 Letter", "Source": "request" } }, { "Key": "DocumentPrintColor", "Name": "Document: Print Color", "OptionType": "Select", "Value": { "Key": "BlackAndWhite", "Value": "Black And White", "Source": "request" } }, { "Key": "DocumentSided", "Name": "Document: Sided", "OptionType": "Select", "Value": { "Key": "DoubleSided", "Value": "Double Sided", "Source": "request" } }, { "Key": "DocumentOrientation", "Name": "Document: Orientation", "OptionType": "Select", "Value": { "Key": "Portrait", "Value": "Portrait", "Source": "request" } }, { "Key": "DocumentCover", "Name": "Document: Cover", "OptionType": "Select", "Value": { "Key": "None", "Value": "None", "Source": "request" } }, { "Key": "DocumentSheetAttachement", "Name": "Document: Sheet Attachement", "OptionType": "Select", "Value": { "Key": "StaplingTopLeft", "Value": "Stapling: Top Left", "Source": "request" } }, { "Key": "DocumentPaperStock", "Name": "Document: Paper Stock", "OptionType": "Select", "Value": { "Key": "24LbStandard", "Value": "24 Lb Standard", "Source": "request" } }, { "Key": "NumOfPages", "Name": "NumOfPages", "OptionType": "Text", "Value": { "Key": "1", "Value": "1", "Source": "default" } }, { "Key": "Quantity", "Name": "Quantity", "OptionType": "Text", "Value": { "Key": "1", "Value": "1", "Source": "default" } }]
                },
                {
                    Name: "Premium",
                    Options: [{ "Key": "DocumentPaperSize", "Name": "Document: Paper Size", "OptionType": "Select", "Value": { "Key": "Letter", "Value": "8.5x11 Letter", "Source": "request" } }, { "Key": "DocumentPrintColor", "Name": "Document: Print Color", "OptionType": "Select", "Value": { "Key": "Color", "Value": "Color", "Source": "request" } }, { "Key": "DocumentSided", "Name": "Document: Sided", "OptionType": "Select", "Value": { "Key": "SingleSided", "Value": "Single Sided", "Source": "request" } }, { "Key": "DocumentOrientation", "Name": "Document: Orientation", "OptionType": "Select", "Value": { "Key": "Portrait", "Value": "Portrait", "Source": "request" } }, { "Key": "DocumentCover", "Name": "Document: Cover", "OptionType": "Select", "Value": { "Key": "ClearPlasticBlackVinyl", "Value": "Clear Plastic/Black Vinyl", "Source": "request" } }, { "Key": "DocumentSheetAttachement", "Name": "Document: Sheet Attachement", "OptionType": "Select", "Value": { "Key": "BindingCover", "Value": "Binding: Cover", "Source": "request" } }, { "Key": "DocumentPaperStock", "Name": "Document: Paper Stock", "OptionType": "Select", "Value": { "Key": "24LbStandard", "Value": "24 Lb Standard", "Source": "request" } }, { "Key": "NumOfPages", "Name": "NumOfPages", "OptionType": "Text", "Value": { "Key": "1", "Value": "1", "Source": "default" } }, { "Key": "Quantity", "Name": "Quantity", "OptionType": "Text", "Value": { "Key": "1", "Value": "1", "Source": "default" } }]
                },
                {
                    Name: "Executive",
                    Options: [{ "Key": "DocumentPaperSize", "Name": "Document: Paper Size", "OptionType": "Select", "Value": { "Key": "Letter", "Value": "8.5x11 Letter", "Source": "request" } }, { "Key": "DocumentPrintColor", "Name": "Document: Print Color", "OptionType": "Select", "Value": { "Key": "Color", "Value": "Color", "Source": "request" } }, { "Key": "DocumentSided", "Name": "Document: Sided", "OptionType": "Select", "Value": { "Key": "SingleSided", "Value": "Single Sided", "Source": "request" } }, { "Key": "DocumentOrientation", "Name": "Document: Orientation", "OptionType": "Select", "Value": { "Key": "Portrait", "Value": "Portrait", "Source": "request" } }, { "Key": "DocumentCover", "Name": "Document: Cover", "OptionType": "Select", "Value": { "Key": "ClearPlasticBlackVinyl", "Value": "Clear Plastic/Black Vinyl", "Source": "request" } }, { "Key": "DocumentSheetAttachement", "Name": "Document: Sheet Attachement", "OptionType": "Select", "Value": { "Key": "BindingCoil", "Value": "Binding: Coil", "Source": "request" } }, { "Key": "DocumentPaperStock", "Name": "Document: Paper Stock", "OptionType": "Select", "Value": { "Key": "28LbPremium", "Value": "28 Lb Premium", "Source": "request" } }, { "Key": "NumOfPages", "Name": "NumOfPages", "OptionType": "Text", "Value": { "Key": "1", "Value": "1", "Source": "default" } }, { "Key": "Quantity", "Name": "Quantity", "OptionType": "Text", "Value": { "Key": "1", "Value": "1", "Source": "default" } }]
                }
            ];

            return packages;
        }

        function setApiSessionToken(token) {
            ApiSessionToken = token;
        }

        function isHostedInWord() {
            if (!Office)
                return false;
            // Office 2016 support
            var hostInfo = sessionStorage['hostInfoValue'];
            if (hostInfo) {
                var values = hostInfo.split('$');
                if (!values[2]) {
                    values = hostInfo.split('|');
                }
                return (values[0] == 'Word');
            }
            // Office 2013 support
            else if (!Office.context || !Office.context.requirements || !Office.context.requirements.isSetSupported)
                return false;
            return Office.context.requirements.isSetSupported("ooxmlcoercion");
        }

        function readDocumentAsPdf() {
            var deferred = $q.defer();

            office365DocumentService.readDocumentAsPdf(function (pdfByteArray) {
                deferred.resolve(pdfByteArray);
            });
            return deferred.promise;
        }

        function uploadDocument(media, progress, error, tokens, account) {
            var deferred = $q.defer();
            var uploadComplete = function (filesize, encMediaFileId) {
                deferred.resolve({
                    Status: "Complete",
                    encMediaFileId: encMediaFileId,
                    filesize: filesize
                });
            }
            fullUpload(media, uploadComplete, progress, error, tokens, account);

            return deferred.promise;
        }

        function fullUpload(media, uploadComplete, progress, error, tokens, account) {
            var url = media.Links["upload-push"];
            readDocumentAsPdf()
                .then(function (pdfByteArray) {
                    /*
                     * Here we use XHR to prevent the transformation of the post data - which is a default action by angular with $http()
                    */
                    var sliceBuffer = new Uint8Array(pdfByteArray);

                    var xhr = new XMLHttpRequest;

                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                uploadComplete(JSON.parse(xhr.response));
                            } else {
                                error();
                            }
                        }
                    }

                    xhr.open("POST", url, true);
                    xhr.setRequestHeader(
                        "api-client-key",
                        tokens.ApiClientKey);
                    xhr.setRequestHeader(
                        "api-session-token",
                        tokens.ApiSessionToken);
                    xhr.setRequestHeader(
                        "Content-Type",
                        "application/pdf");
                    xhr.setRequestHeader("Accept", "application/json");
                    xhr.setRequestHeader(
                        "Content-Disposition",
                        "form-data; name=\"imagefile\"; filename=\"office.pdf\"");

                    xhr.timeout = (3 * 60) * 1000;      // timeout = 3 minute ?
                    xhr.ontimeout = error;
                    xhr.onerror = error;
                    xhr.send(sliceBuffer);
                });
        }
    }
})();