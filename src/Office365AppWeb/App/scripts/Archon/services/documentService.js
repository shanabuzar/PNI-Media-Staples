(function () {
    "use strict";

    var app = angular.module("Archon");

    app.factory("office365DocumentService", ["$timeout",
        function ($timeout) {

            function readDocumentAsPdf(success, error, retryCount) {
                if (typeof (retryCount) !== "number") {
                    retryCount = 0;
                }
                if (typeof (error) !== "function") {
                    error = (function (ex) { throw new Error(ex); });
                }

                if (typeof Office.context.document === "undefined") {
                    if (retryCount < 5) {
                        $timeout(function () { readDocumentAsPdf(success, error, retryCount + 1) }, 1000);
                    } else {
                        error(new Error("Office.context.document is undefined"));
                    }
                    return;
                }

                Office.context.document.getFileAsync("pdf", { sliceSize: 65536 }, function (fileResult) {
                    function isErrorResult(officeFile, result) {
                        if (result.status !== Office.AsyncResultStatus.Succeeded) {
                            if (officeFile) officeFile.closeAsync();
                            error(result.error);
                            return true;
                        }
                        return false;
                    }

                    if (isErrorResult(undefined, fileResult)) return;

                    var resultPdfBytes = [];
                    
                    function readAndAppendNextSlice(officeFile, sliceIndex) {
                        officeFile.getSliceAsync(sliceIndex, function (sliceResult) {
                            if (isErrorResult(officeFile, sliceResult)) return;
                            resultPdfBytes = resultPdfBytes.concat(sliceResult.value.data);
                            if (sliceIndex + 1 >= officeFile.sliceCount) {
                                officeFile.closeAsync();
                                if (success) {
                                    success(resultPdfBytes);
                                }
                            } else {
                                readAndAppendNextSlice(officeFile, sliceIndex + 1);
                            }
                        });
                    }

                    readAndAppendNextSlice(fileResult.value, 0);
                });
            }

            function getPageCount(success) {
                readDocumentAsPdf(function (pdfBuffer) {
                    var count = 1;
                    try {
                        count = PdfUtils.getPageCountFromPdfBytes(pdfBuffer);
                    } catch (err) {
                        console.error("failed to get page count from pdf");
                        console.error(err);
                        count = 1;
                    } finally {
                        if (success) success(count);
                    }
                });
            }

            function getPageSizes(success) {
                var sizes = [];
                readDocumentAsPdf(function (pdfBuffer) {
                    try {
                        sizes = PdfUtils.getPageSizesFromPdfBytes(pdfBuffer);
                    } finally {
                        success(sizes);
                    }
                });
            }

            function checkIfAllPageSizesAreLetterSize(success) {
                getPageSizes(function (sizes) {
                    var result = true;
                    try {
                        for (var i = 0; i < sizes.length; i++) {
                            var pageSize = sizes[i];
                            if (Math.max(pageSize.width, pageSize.height) !== 792 || Math.min(pageSize.width, pageSize.height) !== 612) {
                                result = false;
                                break;
                            }
                        }
                    } finally {
                        success(result);
                    }
                });
            }

            /*  
            *   TODO 
            *   isDocumentValidSize uses regex to test the dimensions of each page to ensure continuity
            *   Information on PDF traversal is here: https://blog.idrsolutions.com/2009/07/what-is-pdf-pagesize/
            *   This is done as a preflight check here so that an upload is not wasted.
            */
            function isDocumentValidSize(success) {
                getPageSizes(function (sizes) {
                    var docwidth = null;
                    var docheight = null;
                    var valid = true;
                    try {
                        for (var i = 0; i < sizes.length; i++) {
                            var pageSize = sizes[i];
                            if (docwidth === null && docheight === null) {
                                docwidth = pageSize.width;
                                docheight = pageSize.height;
                            } else {
                                if (docwidth !== pageSize.width || docheight !== pageSize.height) {
                                    // this document changes orientation or page size half way through
                                    // this is unsupported
                                    valid = false;
                                    break;
                                }
                            }
                        }
                    } catch (err) {
                        valid = true;
                    } finally {
                        success(valid);
                    }
                });
            }

            return {
                readDocumentAsPdf: readDocumentAsPdf,
                getPageCount: getPageCount,
                isDocumentValidSize: isDocumentValidSize,
                checkIfAllPageSizesAreLetterSize: checkIfAllPageSizesAreLetterSize
            };
        }
    ]);
})();
