/*******************************************************************************
 * Weekly View Component - Enhanced with Binding-Aware Margins
 * 
 * Handles the creation of weekly spreads throughout the planner.
 * - Creates two-page weekly spreads with day sections
 * - Coordinates the layout of different components on weekly pages
 * - Manages week numbers and date calculations
 * - NEW: Uses binding-aware margins for proper coil binding layout
 *******************************************************************************/

var WeeklyView = (function() {
    /**
     * Creates a two-page spread for a week
     * @param {Document} doc - The InDesign document
     * @param {Date} startDate - Monday of the week
     * @param {Number} weekNumber - Current week number
     * @param {Number} startPageIndex - Index of the first available page
     * @param {Object} pageMetrics - Page size and margin information (legacy - will be recalculated per page)
     * @param {Object} userPrefs - User preferences for fonts and colors
     * @returns {Number} The next available page index
     */
    function createWeekSpread(doc, startDate, weekNumber, startPageIndex, pageMetrics, userPrefs) {
        // Calculate page indices
        var leftPageIndex = startPageIndex;
        var rightPageIndex = startPageIndex + 1;
        
        // Add pages if needed for this spread
        while (doc.pages.length <= rightPageIndex) {
            doc.pages.add();
        }
        
        // Get references to both pages of the spread
        var leftPage = doc.pages.item(leftPageIndex);
        var rightPage = doc.pages.item(rightPageIndex);

        // Verify that we have the correct page sides
        if (leftPage.side !== PageSideOptions.LEFT_HAND) {
            $.writeln("Warning: Expected left page at index " + leftPageIndex + " but got " + leftPage.side);
        }
        if (rightPage.side !== PageSideOptions.RIGHT_HAND) {
            $.writeln("Warning: Expected right page at index " + rightPageIndex + " but got " + rightPage.side);
        }

        // NEW: Calculate page-specific metrics for binding-aware margins
        var leftPageMetrics = Layout.calculatePageMetricsForPage(doc, leftPage);
        var rightPageMetrics = Layout.calculatePageMetricsForPage(doc, rightPage);

        // Create week headers on both pages with different alignments
        var endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);

        // Left page header - left justified (using left page metrics)
        Header.createWeekHeader(leftPage, startDate, endDate, leftPageMetrics, userPrefs, Justification.LEFT_ALIGN);

        // Right page header - right justified (using right page metrics)
        Header.createWeekHeader(rightPage, startDate, endDate, rightPageMetrics, userPrefs, Justification.RIGHT_ALIGN);
                
        // Calculate section heights for left page (4 equal sections)
        var numSections = 4;
        var sectionHeight = Layout.calculateSectionHeight(leftPageMetrics, numSections);
        
        // Create Monday-Thursday sections on left page
        var currentDate = new Date(startDate);
        
        // Store the start and end dates for the left page
        var leftPageStartDate = new Date(currentDate);
        var leftPageEndDate = new Date(currentDate);
        leftPageEndDate.setDate(leftPageEndDate.getDate() + 3); // End date is Thursday
        
        for (var i = 0; i < 4; i++) {
            DaySection.createDaySection(leftPage, currentDate, i, sectionHeight, leftPageMetrics, userPrefs);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Create sections for Friday-Sunday plus monthly section on right page
        // Use same section height as left page for consistency
        var daySection = sectionHeight; // Keep the original section height for day sections
        
        // Store the start and end dates for the right page
        var rightPageStartDate = new Date(currentDate);
        var rightPageEndDate = new Date(currentDate);
        rightPageEndDate.setDate(rightPageEndDate.getDate() + 2); // End date is Sunday
        
        // Create Friday-Sunday sections (3 sections) using right page metrics
        for (var i = 0; i < 3; i++) {
            DaySection.createDaySection(rightPage, currentDate, i, daySection, rightPageMetrics, userPrefs);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Find Sunday date to use for the 3-month view
        var sundayDate = new Date(startDate);
        sundayDate.setDate(sundayDate.getDate() + 6); // Sunday is 6 days after Monday
        
        // Add monthly overview section in the remaining space (using right page metrics)
        MonthlyView.createMonthlySection(rightPage, daySection, rightPageMetrics, userPrefs, sundayDate, weekNumber);

        // Add week number to footer of both pages (using respective page metrics)
        Footer.createWeekFooter(leftPage, rightPage, weekNumber, leftPageMetrics, rightPageMetrics, userPrefs, startDate, endDate);
        
        try {
            // Add QR codes to both pages (using respective page metrics)
            QRCodeGen.createQRCode(leftPage, leftPageStartDate, leftPageEndDate, "LEFT_WEEKDAY", leftPageMetrics, userPrefs);
            QRCodeGen.createQRCode(rightPage, rightPageStartDate, rightPageEndDate, "RIGHT_WEEKEND", rightPageMetrics, userPrefs);
        } catch (e) {
            $.writeln("Warning: QR code generation failed: " + e.message);
            // Continue execution even if QR code generation fails
        }
        
        // Return the next available page index
        return rightPageIndex + 1;
    }
    
    /**
     * Determines if a week contains the first day of a month
     * @param {Date} weekStartDate - The Monday of the week
     * @returns {Boolean} True if week contains first day of month
     */
    function weekContainsMonthStart(weekStartDate) {
        var weekEndDate = new Date(weekStartDate);
        weekEndDate.setDate(weekEndDate.getDate() + 6); // Sunday
        
        // Check if any day in the week is the 1st of a month
        for (var i = 0; i <= 6; i++) {
            var currentDate = new Date(weekStartDate);
            currentDate.setDate(currentDate.getDate() + i);
            
            if (currentDate.getDate() === 1) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Gets the month that starts within this week, if any
     * @param {Date} weekStartDate - The Monday of the week
     * @returns {Date|null} Date object for the 1st of the month or null
     */
    function getMonthStartInWeek(weekStartDate) {
        var weekEndDate = new Date(weekStartDate);
        weekEndDate.setDate(weekEndDate.getDate() + 6); // Sunday
        
        // Check if any day in the week is the 1st of a month
        for (var i = 0; i <= 6; i++) {
            var currentDate = new Date(weekStartDate);
            currentDate.setDate(currentDate.getDate() + i);
            
            if (currentDate.getDate() === 1) {
                return currentDate;
            }
        }
        
        return null;
    }
    
    // Return public interface
    return {
        createWeekSpread: createWeekSpread,
        weekContainsMonthStart: weekContainsMonthStart,
        getMonthStartInWeek: getMonthStartInWeek
    };
})();