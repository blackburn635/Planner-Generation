/*******************************************************************************
 * Layout Module
 * 
 * Handles calculations and management of page layout metrics
 * - Calculates usable page areas
 * - Provides consistent page metrics for all components
 * - Manages layout-related calculations
 *******************************************************************************/

var Layout = (function() {
    /**
     * Calculates page metrics from document settings
     * @param {Document} doc - The InDesign document
     * @returns {Object} Comprehensive page metrics object
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
     * Calculates grid dimensions for a month calendar
     * @param {Object} bounds - The bounding box for the grid
     * @param {Date} monthDate - First day of the month
     * @returns {Object} Grid dimensions information
     */
    function calculateMonthGrid(bounds, monthDate) {
        // Get first day of month
        var firstDay = new Date(monthDate);
        
        // Get last day of month
        var lastDay = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
        
        // Calculate how many days to show from previous month
        var daysFromPrevMonth = firstDay.getDay();
        
        // Calculate total cells needed (previous month days + current month days)
        var totalCells = daysFromPrevMonth + lastDay.getDate();
        
        // Calculate rows needed (ceil to account for partial rows)
        var rows = Math.ceil(totalCells / 7);
        
        // Calculate cell dimensions
        var cellWidth = bounds.width / 7;
        var cellHeight = bounds.height / rows;
        
        return {
            rows: rows,
            columns: 7,
            cellWidth: cellWidth,
            cellHeight: cellHeight,
            daysFromPrevMonth: daysFromPrevMonth,
            totalDays: lastDay.getDate(),
            firstWeekday: firstDay.getDay()
        };
    }
    
    /**
     * Calculates coordinates for a specific cell in a grid
     * @param {Object} gridInfo - Grid dimensions information
     * @param {Object} origin - Top left origin point {x, y}
     * @param {Number} row - Row index (0-based)
     * @param {Number} column - Column index (0-based)
     * @returns {Object} Cell coordinates {x1, y1, x2, y2}
     */
    function calculateCellCoordinates(gridInfo, origin, row, column) {
        return {
            x1: origin.x + (column * gridInfo.cellWidth),
            y1: origin.y + (row * gridInfo.cellHeight),
            x2: origin.x + ((column + 1) * gridInfo.cellWidth),
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
        calculatePageMetrics: calculatePageMetrics,
        calculateMonthGrid: calculateMonthGrid,
        calculateCellCoordinates: calculateCellCoordinates,
        calculateInsetCoordinates: calculateInsetCoordinates,
        createGeometricBounds: createGeometricBounds,
        calculateSectionHeight: calculateSectionHeight
    };
})();