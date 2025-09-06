/*******************************************************************************
 * Header Component
 * 
 * Creates headers for weekly and monthly spreads, including:
 * - Week date range headers
 * - Monthly calendar headers with year display
 *******************************************************************************/

var Header = (function() {
    /**
     * Creates the header showing the week's date range
     * @param {Page} page - The page to add the header to
     * @param {Date} startDate - First day of the week
     * @param {Date} endDate - Last day of the week
     * @param {Object} pageMetrics - Page size and margin information
     * @param {Object} userPrefs - User preferences for fonts and colors
     */
    function createWeekHeader(page, startDate, endDate, pageMetrics, userPrefs) {
        try {
            var headerText = page.textFrames.add({
                geometricBounds: [
                    pageMetrics.margins.top - 20, // Move up to create space
                    page.bounds[1] + pageMetrics.margins.left,
                    pageMetrics.margins.top,
                    page.bounds[1] + pageMetrics.width - pageMetrics.margins.right
                ],
                contents: "Week of " + Utils.formatDate(startDate) + " - " + Utils.formatDate(endDate)
            });
            
            // Apply formatting using the titleFont
            try {
                // Apply title font and color
                Utils.applyTextFormatting(headerText.texts.item(0), userPrefs.titleFont, userPrefs.titleFontColor);
                
                // Apply formatting to make the header stand out
                headerText.texts.item(0).pointSize = 14;
                headerText.texts.item(0).justification = Justification.CENTER_ALIGN;
                
                // Try to apply bold formatting if available, otherwise skip it
                try {
                    headerText.texts.item(0).fontStyle = "Bold";
                } catch (e) {
                    // Font style not available, continue without changing style
                }
            } catch (e) {
                throw new Error("Error applying header formatting: " + e.message);
            }
            
            // Set up text frame properties
            Utils.setupTextFrame(headerText);
        } catch (e) {
            throw new Error("Error creating week header: " + e.message);
        }
    }
    
    /**
     * Creates headers for a monthly spread
     * @param {Page} leftPage - Left page of the spread
     * @param {Page} rightPage - Right page of the spread
     * @param {Date} monthDate - First day of the month
     * @param {Object} pageMetrics - Page size and margin information
     * @param {Object} userPrefs - User preferences for fonts and colors
     */
    function createMonthHeader(leftPage, rightPage, monthDate, pageMetrics, userPrefs) {
        try {
            var monthNames = ["January", "February", "March", "April", "May", "June", 
                              "July", "August", "September", "October", "November", "December"];
            var monthName = monthNames[monthDate.getMonth()];
            var yearText = monthDate.getFullYear().toString();
            
            // Create month and year text centered on left page
            var leftMonthText = leftPage.textFrames.add({
                geometricBounds: [
                    pageMetrics.margins.top - 20,
                    leftPage.bounds[1] + pageMetrics.margins.left,
                    pageMetrics.margins.top,
                    leftPage.bounds[1] + pageMetrics.width - pageMetrics.margins.right
                ],
                contents: monthName + " " + yearText  // Combine month and year
            });
            
            // Apply formatting
            Utils.applyTextFormatting(leftMonthText.texts.item(0), userPrefs.titleFont, userPrefs.titleFontColor);
            leftMonthText.texts.item(0).pointSize = 18;
            leftMonthText.texts.item(0).justification = Justification.CENTER_ALIGN;
            try {
                leftMonthText.texts.item(0).fontStyle = "Bold";
            } catch (e) {
                // Font style not available, continue without changing style
            }
            Utils.setupTextFrame(leftMonthText);
            
            // Create month and year text centered on right page
            var rightMonthText = rightPage.textFrames.add({
                geometricBounds: [
                    pageMetrics.margins.top - 20,
                    rightPage.bounds[1] + pageMetrics.margins.left,
                    pageMetrics.margins.top,
                    rightPage.bounds[1] + pageMetrics.width - pageMetrics.margins.right
                ],
                contents: monthName + " " + yearText  // Combine month and year
            });
            
            // Apply formatting
            Utils.applyTextFormatting(rightMonthText.texts.item(0), userPrefs.titleFont, userPrefs.titleFontColor);
            rightMonthText.texts.item(0).pointSize = 18;
            rightMonthText.texts.item(0).justification = Justification.CENTER_ALIGN;
            try {
                rightMonthText.texts.item(0).fontStyle = "Bold";
            } catch (e) {
                // Font style not available, continue without changing style
            }
            Utils.setupTextFrame(rightMonthText);
            
        } catch (e) {
            throw new Error("Error creating month header: " + e.message);
        }
    }
    
    // Return public interface
    return {
        createWeekHeader: createWeekHeader,
        createMonthHeader: createMonthHeader
    };
})();