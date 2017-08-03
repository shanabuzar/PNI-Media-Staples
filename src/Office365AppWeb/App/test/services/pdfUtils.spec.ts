/// <reference path="../../node_modules/@types/jasmine/index.d.ts"/>
/// <reference path="../../scripts/Archon/services/pdfUtils.ts"/>
/// <reference path="pdf.samples.ts"/>

function convertStrToByteArray(str: string): ReadonlyArray<number> {
    const result = new Array(str.length);
    for (let i = 0; i < str.length; i++) {
        result[i] = str.charCodeAt(i);
    }
    return result;
}

describe("PDF Utilities", () => {
    
    it("gets the page count for a single page empty PDF", () => {
        const pdfAsBytes = convertStrToByteArray(pdfSampleEmptySinglePage);
        const pageCount = PdfUtils.getPageCountFromPdfBytes(pdfAsBytes);
        expect(pageCount).toBe(1);
    });
    
    it("gets the page count for a single page empty PDF saved from Word", () => {
        const pdfAsBytes = convertStrToByteArray(pdfSampleEmptySinglePageSavedFromWord);
        const pageCount = PdfUtils.getPageCountFromPdfBytes(pdfAsBytes);
        expect(pageCount).toBe(1);
    });

    it("gets the page count for a multi page empty PDF saved from Word", () => {
        const pdfAsBytes = convertStrToByteArray(pdfSampleEmptyThreePageMixedSizesSavedFromWord);
        const pageCount = PdfUtils.getPageCountFromPdfBytes(pdfAsBytes);
        expect(pageCount).toBe(3);
    });

    it("gets the page size for a single page empty PDF", () => {
        const pdfAsBytes = convertStrToByteArray(pdfSampleEmptySinglePage);
        const pageSizes = PdfUtils.getPageSizesFromPdfBytes(pdfAsBytes);
        expect(pageSizes.length).toBe(1);
        expect(pageSizes[0].width).toBe(612);
        expect(pageSizes[0].height).toBe(792);
    });
    
    it("gets the page sizes for three page with mixed sizes empty PDF saved from word", () => {
        const pdfAsBytes = convertStrToByteArray(pdfSampleEmptyThreePageMixedSizesSavedFromWord);
        const pageSizes = PdfUtils.getPageSizesFromPdfBytes(pdfAsBytes);

        expect(pageSizes.length).toBe(3);

        expect(pageSizes[0].width).toBe(612);
        expect(pageSizes[0].height).toBe(792);

        expect(pageSizes[1].width).toBe(792);
        expect(pageSizes[1].height).toBe(612);

        expect(pageSizes[2].width).toBe(297.36);
        expect(pageSizes[2].height).toBe(684);
    });

});
