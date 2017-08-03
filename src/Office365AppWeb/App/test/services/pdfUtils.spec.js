/// <reference path="../../node_modules/@types/jasmine/index.d.ts"/>
/// <reference path="../../scripts/Archon/services/pdfUtils.ts"/>
/// <reference path="pdf.samples.ts"/>
function convertStrToByteArray(str) {
    var result = new Array(str.length);
    for (var i = 0; i < str.length; i++) {
        result[i] = str.charCodeAt(i);
    }
    return result;
}
describe("PDF Utilities", function () {
    it("gets the page count for a single page empty PDF", function () {
        var pdfAsBytes = convertStrToByteArray(pdfSampleEmptySinglePage);
        var pageCount = PdfUtils.getPageCountFromPdfBytes(pdfAsBytes);
        expect(pageCount).toBe(1);
    });
    it("gets the page count for a single page empty PDF saved from Word", function () {
        var pdfAsBytes = convertStrToByteArray(pdfSampleEmptySinglePageSavedFromWord);
        var pageCount = PdfUtils.getPageCountFromPdfBytes(pdfAsBytes);
        expect(pageCount).toBe(1);
    });
    it("gets the page count for a multi page empty PDF saved from Word", function () {
        var pdfAsBytes = convertStrToByteArray(pdfSampleEmptyThreePageMixedSizesSavedFromWord);
        var pageCount = PdfUtils.getPageCountFromPdfBytes(pdfAsBytes);
        expect(pageCount).toBe(3);
    });
    it("gets the page size for a single page empty PDF", function () {
        var pdfAsBytes = convertStrToByteArray(pdfSampleEmptySinglePage);
        var pageSizes = PdfUtils.getPageSizesFromPdfBytes(pdfAsBytes);
        expect(pageSizes.length).toBe(1);
        expect(pageSizes[0].width).toBe(612);
        expect(pageSizes[0].height).toBe(792);
    });
    it("gets the page sizes for three page with mixed sizes empty PDF saved from word", function () {
        var pdfAsBytes = convertStrToByteArray(pdfSampleEmptyThreePageMixedSizesSavedFromWord);
        var pageSizes = PdfUtils.getPageSizesFromPdfBytes(pdfAsBytes);
        expect(pageSizes.length).toBe(3);
        expect(pageSizes[0].width).toBe(612);
        expect(pageSizes[0].height).toBe(792);
        expect(pageSizes[1].width).toBe(792);
        expect(pageSizes[1].height).toBe(612);
        expect(pageSizes[2].width).toBe(297.36);
        expect(pageSizes[2].height).toBe(684);
    });
});
//# sourceMappingURL=pdfUtils.spec.js.map