//
// Note: PDF utils are a conversion from code which did a PDF byte array transform to strings (very slowly) and 
//       used RegEx to query for data (page count, sizes, etc).  Following is implemented as a scan over the 
//       byte array which is not ideal either but is much faster.
// 
var PdfUtils = (function () {
    function PdfUtils() {
    }
    /**
     * Gets the number of pages in the specified byte array representing a pdf document
     * @param pdfBytes pdf document as a byte array
     * @returns {}
     */
    PdfUtils.getPageCountFromPdfBytes = function (pdfBytes) {
        var typeNameBytes = this.convertStrToCharCodes("/Type");
        var pageNameBytes = this.convertStrToCharCodes("/Page");
        var escapeChar = "\\".charCodeAt(0);
        var index = 0;
        var pageCount = 0;
        while ((index = this.findIndexOfBytes(pdfBytes, typeNameBytes, index)) >= 0) {
            var isEscaped = pdfBytes[index - 1] === escapeChar;
            index += typeNameBytes.length;
            if (isEscaped) {
                continue;
            }
            index = this.advanceWhiteSpace(pdfBytes, index);
            if (this.bytesMatchAt(pdfBytes, index, pageNameBytes) &&
                this.isPdfDelimiter(pdfBytes[index + pageNameBytes.length])) {
                pageCount++;
            }
            index += pageNameBytes.length;
        }
        return pageCount;
    };
    /**
     * Gets the sizes of all pages (in points at 72 dpi) in the specified byte array representing a pdf document
     * @param pdfBytes pdf document as a byte array
     * @returns array of sizes (in points at 72 dpi), an entry for each page in the pdf
     */
    PdfUtils.getPageSizesFromPdfBytes = function (pdfBytes) {
        var mediaboxBytes = this.convertStrToCharCodes("/MediaBox");
        var escapeChar = "\\".charCodeAt(0);
        var arrayOpenChar = "[".charCodeAt(0);
        var result = [];
        var index = 0;
        while ((index = this.findIndexOfBytes(pdfBytes, mediaboxBytes, index)) >= 0) {
            var isEscaped = pdfBytes[index - 1] === escapeChar;
            index += mediaboxBytes.length;
            if (isEscaped) {
                continue;
            }
            index = this.advanceWhiteSpace(pdfBytes, index);
            if (pdfBytes[index] !== arrayOpenChar) {
                continue;
            }
            var rect = this.parseRectangle(pdfBytes, index + 1);
            result.push({
                width: rect.ulx - rect.llx,
                height: rect.uly - rect.lly
            });
        }
        return result;
    };
    PdfUtils.parseRectangle = function (pdfBytes, startIndex) {
        //
        // A real value is written as one or more decimal digits with an optional sign and a
        // leading, trailing, or embedded period (decimal point): 
        //
        //   34.5 −3.62 +123.6 4. −.002 0.0
        //
        var isCharCodeNumeric = function (code) {
            return (code === 43 ||
                code === 45 ||
                code === 46 ||
                (code >= 48 && code <= 57 // 0-9
                ));
        };
        var values = [];
        while (values.length < 4) {
            startIndex = this.advanceWhiteSpace(pdfBytes, startIndex);
            var buffer = "";
            while (isCharCodeNumeric(pdfBytes[startIndex])) {
                buffer += String.fromCharCode(pdfBytes[startIndex]);
                startIndex++;
            }
            values.push(parseFloat(buffer));
        }
        var llx = values[0], lly = values[1], ulx = values[2], uly = values[3];
        return { llx: llx, lly: lly, ulx: ulx, uly: uly };
    };
    /**
     * Returns true if the specified code is an EOL marker
     *
     * Section 3.1, “Lexical Conventions.” Each line is terminated by an end-of-line
     * (EOL) marker, which may be a carriage return (character code 13), a line feed
     * (character code 10), or both.
     *
     * @param code
     */
    PdfUtils.isPdfEndOfLine = function (code) {
        return code === 10 || code === 13; // \n or \r
    };
    /**
     * Returns true if the specified code is a PDF whitespace character
     *
     * See TABLE 3.1 White-space characters in PDF reference
     *
     * @param code
     */
    PdfUtils.isPdfWhitespace = function (code) {
        return code === 0 || code === 9 || code === 10 || code === 12 || code === 13 || code === 32;
    };
    /**
     * Returns true if the specified code is a PDF delimiter character
     *
     * The delimiter characters (, ), <, >, [, ], {, }, /, and % are special. They delimit
     * syntactic entities such as strings, arrays, names, and comments. Any of these
     * characters terminates the entity preceding it and is not included in the entity.
     *
     * @param code
     */
    PdfUtils.isPdfDelimiter = function (code) {
        switch (code) {
            case 37: // %
            case 40: // (
            case 41: // )
            case 47: // /
            case 60: // <
            case 62: // >
            case 91: // [
            case 93: // ]
            case 123: // {
            case 125:
                return true;
            default:
                return false;
        }
    };
    PdfUtils.convertStrToCharCodes = function (str) {
        var result = new Array(str.length);
        for (var i = 0; i < str.length; i++) {
            result[i] = str.charCodeAt(i);
        }
        return result;
    };
    PdfUtils.findIndexOfBytes = function (bytes, matchBytes, startIndex) {
        var end = bytes.length - matchBytes.length;
        for (var i = startIndex; i < end; i++) {
            var j = 0;
            for (; j < matchBytes.length; j++) {
                if (bytes[i + j] !== matchBytes[j]) {
                    break;
                }
            }
            if (j === matchBytes.length) {
                return i;
            }
        }
        return -1;
    };
    PdfUtils.bytesMatchAt = function (srcBytes, srcStartIndex, matchBytes) {
        var j = 0;
        for (; j < matchBytes.length; j++) {
            if (srcBytes[srcStartIndex + j] !== matchBytes[j]) {
                break;
            }
        }
        return j === matchBytes.length;
    };
    PdfUtils.advanceWhiteSpace = function (bytes, index) {
        while (this.isPdfWhitespace(bytes[index])) {
            index++;
        }
        return index;
    };
    return PdfUtils;
}());
//# sourceMappingURL=pdfUtils.js.map