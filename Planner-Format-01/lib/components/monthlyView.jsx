/*******************************************************************************
 * Monthly View Component
 * 
 * Creates the 3-month mini calendar view that appears on the right page of weekly
 * spreads. This includes:
 * - A colored header for the 3-month section
 * - Three mini calendars showing current month plus next two months
 * - Month name headers above each mini calendar
 * - Highlighting of the current week in the calendar
 *******************************************************************************/

var MonthlyView = (function() {
    /**
     * Creates the monthly section with 3-month calendar view
     * @param {Page} page - The page to add the section to
     * @param {Number} sectionHeight - Height of each section
     * @param {Object} pageMetrics - Page size and margin information
     * @param {Object} userPrefs - User preferences for fonts and colors
     * @param {Date} sundayDate - Date of Sunday for this week
     * @param {Number} weekNumber - Current week number
     */
    function createMonthlySection(page, sectionHeight, pageMetrics, userPrefs, sundayDate, weekNumber) {
        // Calculate position to align with the fourth section
        var yPosition = pageMetrics.margins.top + (3 * sectionHeight); // Position after 3 day sections
        var headerHeight = 20;
        
        try {
            // Create colored header box
            var monthBox = page.rectangles.add({
                geometricBounds: [
                    yPosition,
                    page.bounds[1] + pageMetrics.margins.left,
                    yPosition + headerHeight,
                    page.bounds[1] + pageMetrics.width - pageMetrics.margins.right
                ],
                fillColor: userPrefs.headerColorName,
                strokeColor: "None"
            });

            // Add "3-Month Overview" text
            var monthText = page.textFrames.add({
                geometricBounds: [
                    yPosition + 2,
                    page.bounds[1] + pageMetrics.margins.left + 4,
                    yPosition + headerHeight - 2,
                    page.bounds[1] + pageMetrics.width - pageMetrics.margins.right - 4
                ],
                contents: "3-Month Overview"
            });
            
            // Apply formatting (Paper color for text on colored background)
            Utils.applyTextFormatting(monthText.texts.item(0), userPrefs.contentFont, "Paper");
            Utils.setupTextFrame(monthText);
            
            // Get dates for 3 months starting with the month containing Sunday's date
            var currentMonth = new Date(sundayDate.getFullYear(), sundayDate.getMonth(), 1);
            var nextMonth = new Date(sundayDate.getFullYear(), sundayDate.getMonth() + 1, 1);
            var thirdMonth = new Date(sundayDate.getFullYear(), sundayDate.getMonth() + 2, 1);
            
            // Calculate the width of each mini calendar
            var calendarWidth = (pageMetrics.usable.width - 20) / 3; // 20 = padding between calendars
            
            // Reduce the height proportion to prevent extension into footer
            var heightRatio = 0.80; // Reduced from the default 0.85 to make calendars 5pt shorter
            
            // Get month names for headers
            var monthNames = ["January", "February", "March", "April", "May", "June", 
                             "July", "August", "September", "October", "November", "December"];
            
            // Space for month name headers
            var monthNameHeight = 15;
            var contentY = yPosition + headerHeight + 5;
            
            // Add month name for first calendar
            var firstMonthName = page.textFrames.add({
                geometricBounds: [
                    contentY,
                    page.bounds[1] + pageMetrics.margins.left + 5,
                    contentY + monthNameHeight,
                    page.bounds[1] + pageMetrics.margins.left + 5 + calendarWidth - 5
                ],
                contents: monthNames[currentMonth.getMonth()]
            });
            
            Utils.applyTextFormatting(firstMonthName.texts.item(0), userPrefs.calendarFont, userPrefs.calendarFontColor);
            firstMonthName.texts.item(0).justification = Justification.CENTER_ALIGN;
            firstMonthName.texts.item(0).pointSize = 9;
            Utils.setupTextFrame(firstMonthName);
            
            // Add month name for second calendar
            var secondMonthName = page.textFrames.add({
                geometricBounds: [
                    contentY,
                    page.bounds[1] + pageMetrics.margins.left + calendarWidth + 10,
                    contentY + monthNameHeight,
                    page.bounds[1] + pageMetrics.margins.left + calendarWidth + 10 + calendarWidth - 5
                ],
                contents: monthNames[nextMonth.getMonth()]
            });
            
            Utils.applyTextFormatting(secondMonthName.texts.item(0), userPrefs.calendarFont, userPrefs.calendarFontColor);
            secondMonthName.texts.item(0).justification = Justification.CENTER_ALIGN;
            secondMonthName.texts.item(0).pointSize = 9;
            Utils.setupTextFrame(secondMonthName);
            
            // Add month name for third calendar
            var thirdMonthName = page.textFrames.add({
                geometricBounds: [
                    contentY,
                    page.bounds[1] + pageMetrics.margins.left + (calendarWidth * 2) + 15,
                    contentY + monthNameHeight,
                    page.bounds[1] + pageMetrics.margins.left + (calendarWidth * 2) + 15 + calendarWidth - 5
                ],
                contents: monthNames[thirdMonth.getMonth()]
            });
            
            Utils.applyTextFormatting(thirdMonthName.texts.item(0), userPrefs.calendarFont, userPrefs.calendarFontColor);
            thirdMonthName.texts.item(0).justification = Justification.CENTER_ALIGN;
            thirdMonthName.texts.item(0).pointSize = 9;
            Utils.setupTextFrame(thirdMonthName);
            
            // Adjust Y position for calendars to account for month name headers
            var calendarY = contentY + monthNameHeight + 2;
            
            // Create three mini calendars using the CalendarGrid component
            CalendarGrid.createMiniMonthCalendar(
                page, 
                calendarY,
                page.bounds[1] + pageMetrics.margins.left + 5,
                calendarWidth - 5,
                currentMonth,
                weekNumber,
                pageMetrics,
                userPrefs,
                heightRatio // Pass the height ratio to control vertical size
            );
            
            CalendarGrid.createMiniMonthCalendar(
                page, 
                calendarY,
                page.bounds[1] + pageMetrics.margins.left + calendarWidth + 10,
                calendarWidth - 5,
                nextMonth,
                weekNumber,
                pageMetrics,
                userPrefs,
                heightRatio // Pass the height ratio to control vertical size
            );
            
            CalendarGrid.createMiniMonthCalendar(
                page, 
                calendarY,
                page.bounds[1] + pageMetrics.margins.left + (calendarWidth * 2) + 15,
                calendarWidth - 5,
                thirdMonth,
                weekNumber,
                pageMetrics,
                userPrefs,
                heightRatio // Pass the height ratio to control vertical size
            );
            
        } catch (e) {
            throw new Error("Error creating monthly section: " + e.message);
        }
    }
    
    /**
     * Returns the relative coordinates for the Monthly section
     * This is useful for other scripts that need to add content to this area
     * @param {Page} page - The page to calculate coordinates for
     * @param {Object} pageMetrics - Page size and margin information
     * @returns {Object} Coordinates of the top left corner of the monthly section
     */
    function getMonthlyCoordinates(page, pageMetrics) {
        // Calculate section heights for consistency with the main planner script
        var numSections = 4;
        var sectionHeight = (pageMetrics.usable.height - 60) / numSections; // 60 = space for header/footer
        var headerHeight = 20;
        
        // Calculate position to align with the fourth section
        var yPosition = pageMetrics.margins.top + (3 * sectionHeight); // Position after 3 day sections
        
        // Return the coordinates of the start of the content area (after the header)
        return {
            x: page.bounds[1] + pageMetrics.margins.left,
            y: yPosition + headerHeight,
            headerY: yPosition, // Include the banner position for reference
            width: pageMetrics.usable.width,
            height: sectionHeight - headerHeight
        };
    }
    
    // Return public interface
    return {
        createMonthlySection: createMonthlySection,
        getMonthlyCoordinates: getMonthlyCoordinates
    };
})();