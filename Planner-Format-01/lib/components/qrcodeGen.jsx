/*******************************************************************************
 * QR Code Generation Component
 * 
 * Handles the creation and placement of QR codes throughout the planner.
 * - Generates QR codes with date information
 * - Places QR codes on planner pages
 * - Formats and styles QR code display
 * 
 * Depends on the external qrcode.jsx library for the actual QR code generation.
 *******************************************************************************/

var QRCodeGen = (function() {
    /**
     * Creates and places a QR code for a planner page using numeric format
     * @param {Page} page - The page to add the QR code to
     * @param {Date} startDate - First day displayed on the page
     * @param {Date} endDate - Last day displayed on the page (unused in new format)
     * @param {String} pageType - Type of page (e.g., "LEFT_WEEKDAY", "RIGHT_WEEKEND")
     * @param {Object} pageMetrics - Page size and margin information
     * @param {Object} userPrefs - User preferences for fonts and colors
     * @returns {PageItem} The placed QR code item
     */
    $.writeln("QRCodeGen Called");
    function createQRCode(page, startDate, endDate, pageType, pageMetrics, userPrefs) {
        try {
            var templateCode = "01";
            var pageTypeDigit = (pageType.indexOf("LEFT") >= 0) ? "0" : "1";
            
            // Format date as YYYYMMDD
            var dateStr = startDate.getFullYear().toString() + 
                        Utils.padZero(startDate.getMonth() + 1) + 
                        Utils.padZero(startDate.getDate());
            
            var qrContent = templateCode + pageTypeDigit + dateStr;
            
            var fileName = "planner_qr_" + pageType + "_" + dateStr;
            var qrFile = generateQRCodeSVG(qrContent, fileName, {
                typeNumber: 1,
                errorCorrectionLevel: 'L',
                margin: 1,
                cellSize: 3
            });
            
            if (!qrFile) return null;
            
            // Better QR code positioning
            var qrSize = 30; // Smaller size (was 40)
            var boundaryPadding = 3; // Smaller padding (was 5)
            var footerY = pageMetrics.height - pageMetrics.margins.bottom;
            
            // Position the QR code relative to the footer text
            // For left pages, position toward left side
            // For right pages, position toward right side
            var qrX, qrY;
            
            qrY = footerY - 0; // Position below the footer text (was +5)
            
            

            if (pageType.indexOf("LEFT") >= 0) {
                qrX = page.bounds[1] + pageMetrics.margins.left + (pageMetrics.usable.width * 0.5) - (qrSize / 2);
            } else {
                qrX = page.bounds[1] + pageMetrics.margins.left + (pageMetrics.usable.width * 0.5) - (qrSize / 2);
            }
            
            // Create boundary box with white/paper fill
            var boundaryBox = page.rectangles.add({
                geometricBounds: [
                    qrY - boundaryPadding,
                    qrX - boundaryPadding,
                    qrY + qrSize + boundaryPadding,
                    qrX + qrSize + boundaryPadding
                ],
                fillColor: "Paper",
                strokeColor: userPrefs && userPrefs.headerColorName ? userPrefs.headerColorName : "Black",
                strokeWeight: 0.5
            });
            
            // Place the QR code
            var placedQR = placeQRCode(page, qrFile, qrX, qrY, qrSize);
            
            // Bring QR code to front
            if (placedQR) {
                try {
                    placedQR.move(LocationOptions.AT_END);
                } catch (moveError) {
                    try {
                        placedQR.zOrder(ZOrderOptions.BRING_TO_FRONT);
                    } catch (zOrderError) {
                        $.writeln("Warning: Could not bring QR code to front: " + moveError.message);
                    }
                }
            }
            
            return placedQR;
        } catch (e) {
            $.writeln("Error creating QR code: " + e + "\nLine: " + e.line);
            return null;
        }
    }

    /**
     * Generates a QR code SVG file using the external qrcode.jsx library
     * @param {String} content - The content to encode in the QR code
     * @param {String} fileName - Base name for the temporary file (without extension)
     * @param {Object} options - Optional parameters for QR code generation
     * @returns {File} The temporary file containing the SVG QR code
     */
    function generateQRCodeSVG(content, fileName, options) {
        // Default options
        var opts = options || {};
        var typeNumber = opts.typeNumber || 0; // 0 = auto, 1 = Version 1 (21x21)
        var errorCorrectionLevel = opts.errorCorrectionLevel || 'L'; // L, M, Q, H
        var margin = opts.margin !== undefined ? opts.margin : 1;
        var cellSize = opts.cellSize || 3;
        
        try {
            // Create QR code using the external library
            var qr = qrcode(typeNumber, errorCorrectionLevel);
            qr.addData(content);
            qr.make();
            
            // Get the QR code as SVG
            var svgData = qr.createSvgTag({
                scalable: true,
                margin: margin,
                cellSize: cellSize
            });
            
            // Save SVG to temporary file
            var tempFile = new File(Folder.temp + "/" + fileName + ".svg");
            tempFile.open("w");
            tempFile.write(svgData);
            tempFile.close();
            
            return tempFile;
        } catch (e) {
            // If Version 1 fails due to content size, fall back to auto detection
            if (typeNumber === 1 && content.length > 25) {
                $.writeln("Content too large for Version 1 QR code, falling back to auto-sizing");
                opts.typeNumber = 0;
                return generateQRCodeSVG(content, fileName, opts);
            }
            
            $.writeln("Error generating QR code: " + e);
            return null;
        }
    }

    /**
     * Places a QR code on the specified page
     * @param {Page} page - The page to add the QR code to
     * @param {File} qrFile - The SVG file containing the QR code
     * @param {Number} x - X coordinate for placement
     * @param {Number} y - Y coordinate for placement
     * @param {Number} size - Size of the QR code in points
     * @returns {PageItem} The placed QR code item
     */
    function placeQRCode(page, qrFile, x, y, size) {
    try {
        // Adjust coordinates for InDesign's coordinate system
        x = x - page.bounds[1];
        y = y - page.bounds[0]; // Add this line to adjust Y coordinate as well
        
        // Place the SVG in the InDesign document
        var placedItem = page.place(qrFile, [x, y])[0];
        
        // Resize the placed QR code to our desired size
        placedItem.resize(
            CoordinateSpaces.INNER_COORDINATES,
            AnchorPoint.TOP_LEFT_ANCHOR,
            ResizeMethods.REPLACING_CURRENT_DIMENSIONS_WITH,
            [size, size]
        );
        
        return placedItem;
        } catch (e) {
            $.writeln("Error placing QR code: " + e);
            return null;
        }
    }
    
    /**
     * Test function to verify QR code generation is working properly
     * @param {Document} doc - InDesign document to add test QR code to
     */
    function testQRCode(doc) {
        if (!doc) {
            if (app.documents.length === 0) {
                alert("Please open a document first.");
                return;
            }
            doc = app.activeDocument;
        }
        
        var page = doc.pages[0];
        
        // Create test dates
        var startDate = new Date();
        var endDate = new Date();
        endDate.setDate(endDate.getDate() + 4);
        
        // Get page metrics for positioning
        var pageMetrics = {
            width: doc.documentPreferences.pageWidth,
            height: doc.documentPreferences.pageHeight,
            margins: {
                left: doc.marginPreferences.left,
                right: doc.marginPreferences.right,
                top: doc.marginPreferences.top,
                bottom: doc.marginPreferences.bottom
            }
        };
        
        // Generate test QR code
        createQRCode(page, startDate, endDate, "TEST", pageMetrics);
        
        alert("QR code test complete!");
    }
    
    // Return public interface
    return {
        createQRCode: createQRCode,
        testQRCode: testQRCode
    };
})();