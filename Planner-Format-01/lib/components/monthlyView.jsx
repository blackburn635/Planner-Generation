// Planner-Format-01/lib/components/monthlyView.jsx

/*******************************************************************************
 * Enhanced Monthly View Component
 * 
 * Creates the 3-month mini calendar view that appears on the right page of weekly
 * spreads. This includes:
 * - A colored header for the 3-month section
 * - Three mini calendars showing current month plus next two months
 * - Month name headers above each mini calendar
 * - Highlighting of the current week in the calendar
 * 
 * ENHANCED IN V03:
 * - Uses "Weekly Spread Content" font for section header (part of weekly spread)
 * - Uses "Mini-Calendar Titles" font for month names above calendars
 * - Uses "Mini-Calendar Dates" font for calendar dates (via CalendarGrid)
 * - Supports user-defined font sizes for all text elements
 * - Enhanced error handling and modular structure
 * - Maintains backward compatibility
 *******************************************************************************/

var MonthlyView = (function() {
    /**
     * Creates the monthly section with 3-month calendar view
     * @param {Page} page - The page to add the section to
     * @param {Number} sectionHeight - Height of each section
     * @param {Object} pageMetrics - Page size and margin information
     * @param {Object} userPrefs - Enhanced user preferences with granular font settings
     * @param {Date} sundayDate - Date of Sunday for this week
     * @param {Number} weekNumber - Current week number
     */
    function createMonthlySection(page, sectionHeight, pageMetrics, userPrefs, sundayDate, weekNumber) {
        // Calculate position to align with the fourth section
        var yPosition = pageMetrics.margins.top + (3 * sectionHeight); // Position after 3 day sections
        var headerHeight = 20;
        
        try {
            // NEW IN V03: Get font settings for different components
            var weeklyContentFontSettings = getWeeklyContentFontSettings(userPrefs);
            var miniTitleFontSettings = getMiniCalendarTitleFontSettings(userPrefs);
            
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

            // Add "3-Month Overview" text using weekly content font (since it's part of weekly spread)
            var monthText = page.textFrames.add({
                geometricBounds: [
                    yPosition + 2,
                    page.bounds[1] + pageMetrics.margins.left + 4,
                    yPosition + headerHeight - 2,
                    page.bounds[1] + pageMetrics.width - pageMetrics.margins.right - 4
                ],
                contents: "3-Month Overview"
            });
            
            // NEW IN V03: Apply weekly content font formatting (Paper color for visibility on colored background)
            try {
                Utils.applyTextFormatting(monthText.texts.item(0), weeklyContentFontSettings.font, "Paper");
                monthText.texts.item(0).pointSize = weeklyContentFontSettings.size;
                Utils.setupTextFrame(monthText);
                
                $.writeln("[MonthlyView] Section header created with font: " + 
                         weeklyContentFontSettings.font + ", size: " + weeklyContentFontSettings.size + "pt");
                
            } catch (headerTextError) {
                throw new Error("Error formatting monthly section header: " + headerTextError.message);
            }
            
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
            
            // Create month name headers and mini calendars
            createMonthNameAndCalendar(page, currentMonth, 0, calendarWidth, contentY, monthNameHeight, heightRatio, weekNumber, pageMetrics, userPrefs, monthNames, miniTitleFontSettings);
            createMonthNameAndCalendar(page, nextMonth, 1, calendarWidth, contentY, monthNameHeight, heightRatio, weekNumber, pageMetrics, userPrefs, monthNames, miniTitleFontSettings);
            createMonthNameAndCalendar(page, thirdMonth, 2, calendarWidth, contentY, monthNameHeight, heightRatio, weekNumber, pageMetrics, userPrefs, monthNames, miniTitleFontSettings);
            
            $.writeln("[MonthlyView] 3-month overview created with enhanced font settings");
            
        } catch (e) {
            throw new Error("Error creating monthly section: " + e.message);
        }
    }
    
    /**
     * NEW IN V03: Creates a month name header and corresponding mini calendar
     * @param {Page} page - The page to add elements to
     * @param {Date} monthDate - The month date
     * @param {Number} calendarIndex - Index of this calendar (0, 1, or 2)
     * @param {Number} calendarWidth - Width of each calendar
     * @param {Number} contentY - Y position for content
     * @param {Number} monthNameHeight - Height for month name
     * @param {Number} heightRatio - Height ratio for calendars
     * @param {Number} weekNumber - Current week number for highlighting
     * @param {Object} pageMetrics - Page metrics
     * @param {Object} userPrefs - User preferences
     * @param {Array} monthNames - Array of month names
     * @param {Object} miniTitleFontSettings - Font settings for month titles
     */
    function createMonthNameAndCalendar(page, monthDate, calendarIndex, calendarWidth, contentY, monthNameHeight, heightRatio, weekNumber, pageMetrics, userPrefs, monthNames, miniTitleFontSettings) {
        try {
            // Calculate X position for this calendar
            var calendarX = page.bounds[1] + pageMetrics.margins.left + (calendarIndex * (calendarWidth + 5)) + 5;
            
            // Add month name header
            var monthNameText = page.textFrames.add({
                geometricBounds: [
                    contentY,
                    calendarX,
                    contentY + monthNameHeight,
                    calendarX + calendarWidth - 5
                ],
                contents: monthNames[monthDate.getMonth()]
            });
            
            // NEW IN V03: Apply mini calendar title font settings
            try {
                Utils.applyTextFormatting(monthNameText.texts.item(0), miniTitleFontSettings.font, miniTitleFontSettings.color);
                monthNameText.texts.item(0).pointSize = miniTitleFontSettings.size;
                monthNameText.texts.item(0).justification = Justification.CENTER_ALIGN;
                Utils.setupTextFrame(monthNameText);
                
                $.writeln("[MonthlyView] Month name '" + monthNames[monthDate.getMonth()] + 
                         "' created with font: " + miniTitleFontSettings.font + 
                         ", size: " + miniTitleFontSettings.size + "pt");
                
            } catch (monthNameError) {
                throw new Error("Error formatting month name '" + monthNames[monthDate.getMonth()] + "': " + monthNameError.message);
            }
            
            // Adjust Y position for calendar to account for month name header
            var calendarY = contentY + monthNameHeight + 2;
            
            // Create mini calendar using the CalendarGrid component
            // CalendarGrid will handle the mini calendar date font settings automatically
            CalendarGrid.createMiniMonthCalendar(
                page, 
                calendarY,
                calendarX,
                calendarWidth - 5,
                monthDate,
                weekNumber,
                pageMetrics,
                userPrefs,
                heightRatio // Pass the height ratio to control vertical size
            );
            
        } catch (e) {
            $.writeln("[MonthlyView] Error creating month " + (calendarIndex + 1) + ": " + e.message);
            // Continue with other calendars rather than failing completely
        }
    }
    
    /**
     * NEW IN V03: Get effective font settings for weekly content with fallbacks
     * @param {Object} userPrefs - Enhanced user preferences
     * @returns {Object} Object with font, color, and size properties
     */
    function getWeeklyContentFontSettings(userPrefs) {
        return {
            font: userPrefs.weeklyContentFont || userPrefs.contentFont || "Myriad Pro",
            color: userPrefs.weeklyContentColor || userPrefs.contentFontColor || "Black",
            size: userPrefs.weeklyContentSize || 12 // Default to 12pt for weekly content
        };
    }
    
    /**
     * NEW IN V03: Get effective font settings for mini calendar titles with fallbacks
     * @param {Object} userPrefs - Enhanced user preferences
     * @returns {Object} Object with font, color, and size properties
     */
    function getMiniCalendarTitleFontSettings(userPrefs) {
        return {
            font: userPrefs.miniCalendarTitleFont || userPrefs.calendarFont || "Myriad Pro",
            color: userPrefs.miniCalendarTitleColor || userPrefs.calendarFontColor || "Black",
            size: userPrefs.miniCalendarTitleSize || 9 // Default to 9pt for mini calendar month titles
        };
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
    
    /**
     * NEW IN V03: Creates an enhanced monthly section with additional customization options
     * @param {Page} page - The page to add the section to
     * @param {Number} sectionHeight - Height of each section
     * @param {Object} pageMetrics - Page size and margin information
     * @param {Object} userPrefs - Enhanced user preferences
     * @param {Date} sundayDate - Date of Sunday for this week
     * @param {Number} weekNumber - Current week number
     * @param {Object} options - Additional customization options
     */
    function createEnhancedMonthlySection(page, sectionHeight, pageMetrics, userPrefs, sundayDate, weekNumber, options) {
        options = options || {};
        
        try {
            // Allow customization of the section title
            var sectionTitle = options.sectionTitle || "3-Month Overview";
            
            // Allow customization of number of months to show
            var monthsToShow = options.monthsToShow || 3;
            
            // Allow custom height ratio
            var heightRatio = options.heightRatio || 0.80;
            
            // For now, call the standard function but this could be expanded
            createMonthlySection(page, sectionHeight, pageMetrics, userPrefs, sundayDate, weekNumber);
            
        } catch (e) {
            throw new Error("Error creating enhanced monthly section: " + e.message);
        }
    }
    
    // Return public interface
    return {
        createMonthlySection: createMonthlySection,
        createEnhancedMonthlySection: createEnhancedMonthlySection,
        getMonthlyCoordinates: getMonthlyCoordinates,
        getWeeklyContentFontSettings: getWeeklyContentFontSettings,
        getMiniCalendarTitleFontSettings: getMiniCalendarTitleFontSettings
    };
})();