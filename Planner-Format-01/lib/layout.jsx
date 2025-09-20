/*******************************************************************************
 * Layout Module - Enhanced with Binding-Aware Margins
 * 
 * Handles calculations and management of page layout metrics
 * - Calculates usable page areas
 * - Provides consistent page metrics for all components
 * - Manages layout-related calculations
 * - NEW: Supports inside/outside margins for binding-aware layouts
 *******************************************************************************/

var Layout = (function() {
    /**
     * Calculates page metrics from document settings (LEGACY VERSION)
     * @param {Document} doc - The InDesign document
     * @returns {Object} Comprehensive page metrics object
     * @deprecated Use calculatePageMetricsForPage() for binding-aware layouts
     */
    function calculatePageMetrics(doc) {
        // Get page dimensions from the document
        var pageWidth = doc.documentPreferences.pageWidth;
        var pageHeight = doc.documentPreferences.pageHeight;
        
        // Get margin settings from the document
        var leftMargin = doc.marginPreferences.left;
        var rightMargin = doc.marginPreferences.right;
        var topMargin = doc.marginPreferences.top;
        var bottomMargin = doc.marginPreferences.bottom;
        
        // Calculate actual working area within margins
        var usableWidth = pageWidth - (leftMargin + rightMargin);
        var usableHeight = pageHeight - (topMargin + bottomMargin);
        
        // Create an object to store all page measurements for easy reference
        return {
            width: pageWidth,
            height: pageHeight,
            margins: {
                left: leftMargin,
                right: rightMargin,
                top: topMargin,
                bottom: bottomMargin
            },
            usable: {
                width: usableWidth,
                height: usableHeight
            }
        };
    }
    
    /**
     * NEW: Calculates page metrics with binding-aware margins
     * @param {Document} doc - The InDesign document
     * @param {Page} page - The specific page to calculate metrics for
     * @returns {Object} Comprehensive page metrics object with effective margins
     */
    function calculatePageMetricsForPage(doc, page) {
        // Get page dimensions from the document
        var pageWidth = doc.documentPreferences.pageWidth;
        var pageHeight = doc.documentPreferences.pageHeight;
        
        // Get top and bottom margins (these don't change)
        var topMargin = doc.marginPreferences.top;
        var bottomMargin = doc.marginPreferences.bottom;
        
        // Get binding-aware margins
        var effectiveMargins = getEffectiveMarginsForPage(doc, page);
        
        // Calculate actual working area within margins
        var usableWidth = pageWidth - (effectiveMargins.left + effectiveMargins.right);
        var usableHeight = pageHeight - (topMargin + bottomMargin);
        
        // Create an object to store all page measurements for easy reference
        return {
            width: pageWidth,
            height: pageHeight,
            margins: effectiveMargins,
            usable: {
                width: usableWidth,
                height: usableHeight
            }
        };
    }
    
    /**
     * NEW: Gets effective margins for a specific page based on binding
     * @param {Document} doc - The InDesign document
     * @param {Page} page - The specific page
     * @returns {Object} Effective margins {left, right, top, bottom}
     */
    function getEffectiveMarginsForPage(doc, page) {
        var topMargin = doc.marginPreferences.top;
        var bottomMargin = doc.marginPreferences.bottom;
        
        // Check if document has facing pages and different inside/outside margins
        if (doc.documentPreferences.facingPages) {
            var insideMargin, outsideMargin;
            
            try {
                // Try to use inside/outside properties if available
                insideMargin = doc.marginPreferences.inside;
                outsideMargin = doc.marginPreferences.outside;
            } catch (e) {
                // Fallback: detect from left/right margins
                var leftMargin = doc.marginPreferences.left;
                var rightMargin = doc.marginPreferences.right;
                
                // Assume the larger margin is the inside (binding) margin
                if (leftMargin > rightMargin) {
                    insideMargin = leftMargin;
                    outsideMargin = rightMargin;
                } else {
                    insideMargin = rightMargin;
                    outsideMargin = leftMargin;
                }
            }
            
            // Apply margins based on page side
            if (page.side === PageSideOptions.LEFT_HAND) {
                return {
                    left: outsideMargin,   // Outside edge (left side of left page)
                    right: insideMargin,   // Inside edge (binding side)
                    top: topMargin,
                    bottom: bottomMargin
                };
            } else { // RIGHT_HAND
                return {
                    left: insideMargin,    // Inside edge (binding side)
                    right: outsideMargin,  // Outside edge (right side of right page)
                    top: topMargin,
                    bottom: bottomMargin
                };
            }
        } else {
            // For non-facing pages, use standard left/right margins
            return {
                left: doc.marginPreferences.left,
                right: doc.marginPreferences.right,
                top: topMargin,
                bottom: bottomMargin
            };
        }
    }
    
    /**
     * Calculates grid dimensions for a month calendar
     * @param {Object} bounds - The bounding box for the calendar
     * @param {Number} numRows - Number of rows in the grid
     * @param {Number} numCols - Number of columns in the grid
     * @returns {Object} Grid information including cell dimensions
     */
    function calculateMonthGrid(bounds, numRows, numCols) {
        var gridWidth = bounds.x2 - bounds.x1;
        var gridHeight = bounds.y2 - bounds.y1;
        
        return {
            cellWidth: gridWidth / numCols,
            cellHeight: gridHeight / numRows,
            totalWidth: gridWidth,
            totalHeight: gridHeight,
            origin: {
                x: bounds.x1,
                y: bounds.y1
            }
        };
    }
    
    /**
     * Calculates the coordinates for a specific cell in a grid
     * @param {Object} gridInfo - Grid information from calculateMonthGrid
     * @param {Number} row - Row index (0-based)
     * @param {Number} col - Column index (0-based)
     * @returns {Object} Cell coordinates {x1, y1, x2, y2}
     */
    function calculateCellCoordinates(gridInfo, row, col) {
        var origin = gridInfo.origin;
        
        return {
            x1: origin.x + (col * gridInfo.cellWidth),
            y1: origin.y + (row * gridInfo.cellHeight),
            x2: origin.x + ((col + 1) * gridInfo.cellWidth),
            y2: origin.y + ((row + 1) * gridInfo.cellHeight)
        };
    }
    
    /**
     * Calculates coordinates for a text frame that's inset from a cell
     * @param {Object} cellCoords - Cell coordinates {x1, y1, x2, y2}
     * @param {Number} inset - Inset distance on all sides
     * @returns {Object} Inset coordinates {x1, y1, x2, y2}
     */
    function calculateInsetCoordinates(cellCoords, inset) {
        return {
            x1: cellCoords.x1 + inset,
            y1: cellCoords.y1 + inset,
            x2: cellCoords.x2 - inset,
            y2: cellCoords.y2 - inset
        };
    }
    
    /**
     * Creates an array of bounds for use with InDesign's geometricBounds
     * @param {Object} coords - Coordinates {x1, y1, x2, y2}
     * @returns {Array} Array of [y1, x1, y2, x2] for InDesign
     */
    function createGeometricBounds(coords) {
        return [coords.y1, coords.x1, coords.y2, coords.x2];
    }
    
    /**
     * Calculates section heights for weekly pages
     * @param {Object} pageMetrics - Page metrics information
     * @param {Number} numSections - Number of sections per page
     * @param {Number} headerFooterSpace - Space reserved for headers/footers
     * @returns {Number} Height of each section
     */
    function calculateSectionHeight(pageMetrics, numSections, headerFooterSpace) {
        headerFooterSpace = headerFooterSpace || 0;
        return (pageMetrics.usable.height - headerFooterSpace) / numSections;
    }
    
    // Return public interface
    return {
        calculatePageMetrics: calculatePageMetrics,                    // Legacy function
        calculatePageMetricsForPage: calculatePageMetricsForPage,      // NEW: Binding-aware function
        getEffectiveMarginsForPage: getEffectiveMarginsForPage,        // NEW: Helper function
        calculateMonthGrid: calculateMonthGrid,
        calculateCellCoordinates: calculateCellCoordinates,
        calculateInsetCoordinates: calculateInsetCoordinates,
        createGeometricBounds: createGeometricBounds,
        calculateSectionHeight: calculateSectionHeight
    };
})();