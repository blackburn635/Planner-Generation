/*******************************************************************************
 * Footer Component
 * 
 * Creates footers for the weekly spreads, including:
 * - Week number display
 * - Integration with QR codes
 *******************************************************************************/

var Footer = (function() {
    /**
     * Creates the footer showing the week number and inserts QR codes
     * @param {Page} leftPage - Left page of the spread
     * @param {Page} rightPage - Right page of the spread
     * @param {Number} weekNumber - Current week number
     * @param {Object} pageMetrics - Page size and margin information
     * @param {Object} userPrefs - User preferences for fonts and colors
     * @param {Date} startDate - Start date of the week
     * @param {Date} endDate - End date of the week
     */
    function createWeekFooter(leftPage, rightPage, weekNumber, pageMetrics, userPrefs, startDate, endDate) {
        try {
            // Check if required arguments are provided
            if (!leftPage || !rightPage || !pageMetrics || !userPrefs || !startDate || !endDate) {
                throw new Error("Invalid arguments: One or more required parameters are undefined.");
            }
    
            var footerY = pageMetrics.height - pageMetrics.margins.bottom;
    
            // Add week number to left page footer - LEFT JUSTIFIED
            var leftFooter = leftPage.textFrames.add({
                geometricBounds: [
                    footerY + 2,  // Smaller gap (was +5)
                    leftPage.bounds[1] + pageMetrics.margins.left,
                    footerY + 20, // Shorter height (was +25)
                    leftPage.bounds[1] + pageMetrics.width - pageMetrics.margins.right
                ],
                contents: "Week " + weekNumber
            });
    
            // Apply text formatting
            Utils.applyTextFormatting(leftFooter.texts.item(0), userPrefs.contentFont, userPrefs.contentFontColor);
            leftFooter.texts.item(0).justification = Justification.LEFT_ALIGN;
            Utils.setupTextFrame(leftFooter);
    
            // Add week number to right page footer - RIGHT JUSTIFIED
            var rightFooter = rightPage.textFrames.add({
                geometricBounds: [
                    footerY + 2,  // Smaller gap (was +5)
                    rightPage.bounds[1] + pageMetrics.margins.left,
                    footerY + 20, // Shorter height (was +25)
                    rightPage.bounds[1] + pageMetrics.width - pageMetrics.margins.right
                ],
                contents: "Week " + weekNumber
            });
    
            // Apply text formatting
            Utils.applyTextFormatting(rightFooter.texts.item(0), userPrefs.contentFont, userPrefs.contentFontColor);
            rightFooter.texts.item(0).justification = Justification.RIGHT_ALIGN;
            Utils.setupTextFrame(rightFooter);
    
            // Don't try to add QR codes here - let WeeklyView.jsx handle it
        } catch (e) {
            throw new Error("Error creating week footer: " + e.message);
        }
    }
    
    /**
     * Creates a footer for monthly spreads
     * @param {Page} leftPage - Left page of the spread
     * @param {Page} rightPage - Right page of the spread
     * @param {Date} monthDate - First day of the month
     * @param {Object} pageMetrics - Page size and margin information
     * @param {Object} userPrefs - User preferences for fonts and colors
     */
    function createMonthFooter(leftPage, rightPage, monthDate, pageMetrics, userPrefs) {
        try {
            var footerY = pageMetrics.height - pageMetrics.margins.bottom;
            var monthNames = ["January", "February", "March", "April", "May", "June", 
                              "July", "August", "September", "October", "November", "December"];
            var monthName = monthNames[monthDate.getMonth()];
            
            // Add month name to left page footer
            var leftFooter = leftPage.textFrames.add({
                geometricBounds: [
                    footerY + 5,  // Adjust position to be below content area
                    leftPage.bounds[1] + pageMetrics.margins.left,
                    footerY + 25,
                    leftPage.bounds[1] + pageMetrics.width - pageMetrics.margins.right
                ],
                contents: monthName + " " + monthDate.getFullYear()
            });

            // Apply text formatting
            Utils.applyTextFormatting(leftFooter.texts.item(0), userPrefs.contentFont, userPrefs.contentFontColor);
            leftFooter.texts.item(0).justification = Justification.LEFT_ALIGN;
            Utils.setupTextFrame(leftFooter);

            // Add month name to right page footer
            var rightFooter = rightPage.textFrames.add({
                geometricBounds: [
                    footerY + 5,  // Adjust position to be below content area
                    rightPage.bounds[1] + pageMetrics.margins.left,
                    footerY + 25,
                    rightPage.bounds[1] + pageMetrics.width - pageMetrics.margins.right
                ],
                contents: monthName + " " + monthDate.getFullYear()
            });

            // Apply text formatting
            Utils.applyTextFormatting(rightFooter.texts.item(0), userPrefs.contentFont, userPrefs.contentFontColor);
            rightFooter.texts.item(0).justification = Justification.RIGHT_ALIGN;
            Utils.setupTextFrame(rightFooter);
            
        } catch (e) {
            throw new Error("Error creating month footer: " + e.message);
        }
    }
    
    // Return public interface
    return {
        createWeekFooter: createWeekFooter,
        createMonthFooter: createMonthFooter
    };
})();