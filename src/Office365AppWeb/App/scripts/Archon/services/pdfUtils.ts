
//
// Note: PDF utils are a conversion from code which did a PDF byte array transform to strings (very slowly) and 
//       used RegEx to query for data (page count, sizes, etc).  Following is implemented as a scan over the 
//       byte array which is not ideal either but is much faster.
// 

type PdfPageSize = { width: number; height: number; };

/**
 * A rectangle is written as an array of four numbers
 * giving the coordinates of a pair of diagonally opposite corners. Typically, the
 * array takes the form specifying the lower-left x, lower-left y, upper-right x,
 * and upper-right y coordinates of the rectangle, in that order.
 */
type PdfRectangle = { llx: number; lly: number; ulx: number; uly: number; };

class PdfUtils {

    /**
     * Gets the number of pages in the specified byte array representing a pdf document
     * @param pdfBytes pdf document as a byte array
     * @returns {} 
     */
    static getPageCountFromPdfBytes(pdfBytes: ReadonlyArray<number>): number {
        const typeNameBytes = this.convertStrToCharCodes("/Type");
        const pageNameBytes = this.convertStrToCharCodes("/Page");
        const escapeChar = "\\".charCodeAt(0);

        let index = 0;
        let pageCount = 0;

        while ((index = this.findIndexOfBytes(pdfBytes, typeNameBytes, index)) >= 0) {
            const isEscaped = pdfBytes[index - 1] === escapeChar;

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
    }

    /**
     * Gets the sizes of all pages (in points at 72 dpi) in the specified byte array representing a pdf document
     * @param pdfBytes pdf document as a byte array
     * @returns array of sizes (in points at 72 dpi), an entry for each page in the pdf
     */
    static getPageSizesFromPdfBytes(pdfBytes: ReadonlyArray<number>): PdfPageSize[] {
        const mediaboxBytes = this.convertStrToCharCodes("/MediaBox");
        const escapeChar = "\\".charCodeAt(0);
        const arrayOpenChar = "[".charCodeAt(0);
        const result: PdfPageSize[] = [];

        let index = 0;

        while ((index = this.findIndexOfBytes(pdfBytes, mediaboxBytes, index)) >= 0) {
            const isEscaped = pdfBytes[index - 1] === escapeChar;

            index += mediaboxBytes.length;

            if (isEscaped) {
                continue;
            }

            index = this.advanceWhiteSpace(pdfBytes, index);

            if (pdfBytes[index] !== arrayOpenChar) {
                continue;
            }
            
            const rect = this.parseRectangle(pdfBytes, index + 1);

            result.push({
                width: rect.ulx - rect.llx,
                height: rect.uly - rect.lly
            });
        }

        return result;
    }

    private static parseRectangle(pdfBytes: ReadonlyArray<number>, startIndex: number): PdfRectangle {

        //
        // A real value is written as one or more decimal digits with an optional sign and a
        // leading, trailing, or embedded period (decimal point): 
        //
        //   34.5 −3.62 +123.6 4. −.002 0.0
        //

        const isCharCodeNumeric = (code: number) => {
            return (
                code === 43 ||  // +
                code === 45 ||  // -
                code === 46 ||  // .
                (
                    code >= 48 && code <= 57    // 0-9
                ));
        };

        const values: number[] = [];

        while (values.length < 4) {
            startIndex = this.advanceWhiteSpace(pdfBytes, startIndex);
            let buffer = "";

            while (isCharCodeNumeric(pdfBytes[startIndex])) {
                buffer += String.fromCharCode(pdfBytes[startIndex]);
                startIndex++;
            }

            values.push(parseFloat(buffer));
        }
        
        const [llx, lly, ulx, uly] = values;
        return { llx, lly, ulx, uly };
    }

    /**
     * Returns true if the specified code is an EOL marker
     * 
     * Section 3.1, “Lexical Conventions.” Each line is terminated by an end-of-line
     * (EOL) marker, which may be a carriage return (character code 13), a line feed
     * (character code 10), or both.
     * 
     * @param code
     */
    private static isPdfEndOfLine(code: number): boolean {
        return code === 10 || code === 13;    // \n or \r
    }

    /**
     * Returns true if the specified code is a PDF whitespace character
     *
     * See TABLE 3.1 White-space characters in PDF reference
     * 
     * @param code
     */
    private static isPdfWhitespace(code: number): boolean {
        return code === 0 || code === 9 || code === 10 || code === 12 || code === 13 || code === 32;
    }

    /**
     * Returns true if the specified code is a PDF delimiter character
     *
     * The delimiter characters (, ), <, >, [, ], {, }, /, and % are special. They delimit
     * syntactic entities such as strings, arrays, names, and comments. Any of these
     * characters terminates the entity preceding it and is not included in the entity.
     * 
     * @param code
     */
    private static isPdfDelimiter(code: number): boolean {
        switch (code) {
            case 37:    // %
            case 40:    // (
            case 41:    // )
            case 47:    // /
            case 60:    // <
            case 62:    // >
            case 91:    // [
            case 93:    // ]
            case 123:   // {
            case 125:   // }
                return true;
            default:
                return false;
        }
    }

    private static convertStrToCharCodes(str: string): number[] {
        const result = new Array(str.length);
        for (let i = 0; i < str.length; i++) {
            result[i] = str.charCodeAt(i);
        }
        return result;
    }

    private static findIndexOfBytes(bytes: ReadonlyArray<number>, matchBytes: number[], startIndex: number): number {
        const end = bytes.length - matchBytes.length;
        for (let i = startIndex; i < end; i++) {
            let j = 0;
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
    }

    private static bytesMatchAt(srcBytes: ReadonlyArray<number>, srcStartIndex: number, matchBytes: number[]) {
        let j = 0;
        for (; j < matchBytes.length; j++) {
            if (srcBytes[srcStartIndex + j] !== matchBytes[j]) {
                break;
            }
        }
        return j === matchBytes.length;
    }

    private static advanceWhiteSpace(bytes: ReadonlyArray<number>, index: number): number {
        while (this.isPdfWhitespace(bytes[index])) {
            index++;
        }
        return index;
    }
}
