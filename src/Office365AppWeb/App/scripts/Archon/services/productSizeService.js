(function () {
    'use strict';

    angular.module("Archon")
    .service("productSizeService", ["$q",service]);

    /*

    * TODO: This service should be replaced by the API service so that changes to a retailers abilities are reflected in one place only
    * This was implemented here to save time: The service did not implement CORS support, nor did it allow the preflight OPTIONS method
    * that angular does for JSON Content Types.

    */
    function service($q) {

        var ProductSizes =  [
            {
                "Key": {
                    DocumentPaperSize: "Letter",
                    DocumentOrientation: "Portrait"
                },
                "Size": {
                    "Unit": "Inch",
                    "Width": 8.5,
                    "Height": 11
                }
            },
            {
                "Key": {
                    DocumentPaperSize: "Letter",
                    DocumentOrientation: "Landscape"
                },
                "Size": {
                    "Unit": "Inch",
                    "Width": 11,
                    "Height": 8.5
                }
            },
            {
                "Key": {
                    DocumentPaperSize: "Legal",
                    DocumentOrientation: "Portrait"
                },
                "Size": {
                    "Unit": "Inch",
                    "Width": 8.5,
                    "Height": 14
                }
            },
            {
                "Key": {
                    DocumentPaperSize: "Legal",
                    DocumentOrientation: "Landscape"
                },
                "Size": {
                    "Unit": "Inch",
                    "Width": 14,
                    "Height": 8.5
                }
            },
            {
                "Key": {
                    DocumentPaperSize: "Ledger",
                    DocumentOrientation: "Portrait"
                },
                "Size": {
                    "Unit": "Inch",
                    "Width": 11,
                    "Height": 17
                }
            },
            {
                "Key": {
                    DocumentPaperSize: "Ledger",
                    DocumentOrientation: "Landscape"
                },
                "Size": {
                    "Unit": "Inch",
                    "Width": 17,
                    "Height": 11
                }
            }
        ];

        return {
            getRecommendation: getRecommendation,
        }

        function getRecommendation(pdfSize) {
            var upperLimit = parseInt(window.appSettings.UpperLimit);
            var lowerLimit = parseInt(window.appSettings.LowerLimit);
            var delta = 0.1;
            var acceptedSizes = [];
            try {
                for (var i = 0; i < ProductSizes.length; i++) {
                    console.log((pdfSize.Width - ProductSizes[i].Size.Width) <= upperLimit + delta);
                    console.log((pdfSize.Height - ProductSizes[i].Size.Height) <= upperLimit + delta)
                    console.log((ProductSizes[i].Size.Width - pdfSize.Width) <= lowerLimit + delta)
                    console.log((ProductSizes[i].Size.Height - pdfSize.Height) <= lowerLimit + delta)
                    if ((pdfSize.Width - ProductSizes[i].Size.Width) <= upperLimit + delta &&
                        (pdfSize.Height - ProductSizes[i].Size.Height) <= upperLimit + delta &&
                        (ProductSizes[i].Size.Width - pdfSize.Width) <= lowerLimit + delta &&
                        (ProductSizes[i].Size.Height - pdfSize.Height) <= lowerLimit + delta) {
                        acceptedSizes.push(ProductSizes[i].Key);
                    }
                }
                return $q.when(acceptedSizes);
            } catch (error) {
                return $q.reject({data:{Code:"T001"}})
            }
        }
    }
})()