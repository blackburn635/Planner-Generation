/*******************************************************************************
 * Calendar Grid Component
 * 
 * Handles the creation of calendar grids throughout the planner:
 * - Creates full month calendar grids for month spreads
 * - Creates mini calendars for 3-month overviews in weekly spreads
 * - Manages styling and layout of calendar elements
 *******************************************************************************/

var CalendarGrid = (function() {
    /**
     * Creates a calendar grid for a month
     * @param {Page} page - The page to add the calendar to
     * @param {Object} bounds - The bounds for the grid {x, y, width, height}
     * @param {Date} monthDate - First day of the month
     * @param {Object} options - Options for grid display
     * @param {Object} userPrefs - User preferences
     */
    function createCalendarGrid(page, bounds, monthDate, options, userPrefs) {
        options = options || {};
        
        // Get month information
        var monthInfo = Layout.calculateMonthGrid(bounds, monthDate);
        
        // Calculate cell dimensions
        var cellWidth = bounds.width / 7;
        var cellHeight = bounds.height / monthInfo.rows;
        
        // Get all dates for the calendar (including those from adjacent months)
        var monthDates = Utils.getMonthDates(monthDate);
        var allDates = monthDates.prevMonthDates.concat(monthDates.currentMonthDates, monthDates.nextMonthDates);
        
        // Create grid cells
        for (var row = 0; row < monthInfo.rows; row++) {
            for (var col = 0; col < 7; col++) {
                var dayIndex = (row * 7) + col;
                
                if (dayIndex < allDates.length) {
                    var currentDate = allDates[dayIndex];
                    var isCurrentMonth = currentDate.getMonth() === monthDate.getMonth();
                    
                    // Calculate cell coordinates
                    var cellCoords = Layout.calculateCellCoordinates(
                        {cellWidth: cellWidth, cellHeight: cellHeight},
                        {x: bounds.x, y: bounds.y},
                        row,
                        col
                    );
                    
                    // Create cell rectangle with styling based on current/adjacent month
                    var cellRect = page.rectangles.add({
                        geometricBounds: Layout.createGeometricBounds(cellCoords),
                        fillColor: "None",
                        strokeColor: "Black",
                        strokeWeight: 0.5,
                        strokeTint: isCurrentMonth ? 100 : 50
                    });
                    
                    // Calculate inset for text frame
                    var textCoords = Layout.calculateInsetCoordinates(cellCoords, 2);
                    
                    // Add date number
                    var dateText = page.textFrames.add({
                        geometricBounds: Layout.createGeometricBounds(textCoords),
                        contents: currentDate.getDate().toString()
                    });
                    
                    // Apply text styling
                    var fontColor = options.fontColor || userPrefs.calendarFontColor;
                    Utils.applyTextFormatting(dateText.texts[0], userPrefs.calendarFont, fontColor);
                    
                    // If not current month, make text lighter
                    if (!isCurrentMonth) {
                        try {
                            dateText.texts[0].fillTint = 50;
                        } catch (e) {
                            // Continue if tint setting fails
                        }
                    }
                    
                    // Additional styling options
                    if (options.highlightWeekend && (col === 0 || col === 6)) {
                        // Weekend styling
                        try {
                            cellRect.fillColor = userPrefs.headerColorName;
                            cellRect.fillTint = 20;
                        } catch (e) {
                            // Continue if styling fails
                        }
                    }
                    
                    // Highlight specific dates if needed
                    if (options.highlightDates && options.highlightDates.some(function(d) {
                        return Utils.isSameDay(d, currentDate);
                    })) {
                        try {
                            cellRect.fillColor = userPrefs.headerColorName;
                            cellRect.fillTint = 30;
                            dateText.texts[0].fontStyle = "Bold";
                        } catch (e) {
                            // Continue if styling fails
                        }
                    }
                }
            }
        }
    }
    
    /**
     * Creates a mini calendar for a month
     * @param {Page} page - The page to add the calendar to
     * @param {Number} top - Top position
     * @param {Number} left - Left position
     * @param {Number} width - Width of the calendar
     * @param {Date} monthDate - First day of the month to display
     * @param {Number} currentWeek - Week number to highlight (optional)
     * @param {Object} pageMetrics - Page metrics
     * @param {Object} userPrefs - User preferences
     * @param {Number} heightRatio - Ratio of height to width (optional, default 0.85)
     */
    function createMiniMonthCalendar(page, top, left, width, monthDate, currentWeek, pageMetrics, userPrefs, heightRatio) {
        // Default height ratio if not provided
        heightRatio = heightRatio || 0.85;
        
        // Create calendar bounds
        var bounds = {
            x: left,
            y: top,
            width: width,
            height: width * heightRatio // Height proportional to width, can be adjusted
        };
        
        // Get month information
        var monthInfo = Utils.getMonthDates(monthDate);
        var allDates = monthInfo.prevMonthDates.concat(monthInfo.currentMonthDates, monthInfo.nextMonthDates);
        
        // Add day name headers (S M T W T F S)
        var dayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        var headerHeight = 15;
        var cellWidth = bounds.width / 7;
        
        for (var i = 0; i < 7; i++) {
            var dayHeader = page.textFrames.add({
                geometricBounds: [
                    bounds.y,
                    bounds.x + (i * cellWidth),
                    bounds.y + headerHeight,
                    bounds.x + ((i + 1) * cellWidth)
                ],
                contents: dayLetters[i]
            });
            
            Utils.applyTextFormatting(dayHeader.texts[0], userPrefs.calendarFont, userPrefs.calendarFontColor);
            dayHeader.texts[0].justification = Justification.CENTER_ALIGN;
            dayHeader.texts[0].pointSize = 8;
            
            // Set up vertical centering of text
            Utils.setupTextFrame(dayHeader);
        }
        
        // Calculate cell height for the dates
        var calendarHeight = bounds.height - headerHeight;
        var rows = Math.ceil(allDates.length / 7);
        var cellHeight = calendarHeight / rows;
        
        // Create calendar cells
        for (var i = 0; i < allDates.length; i++) {
            var row = Math.floor(i / 7);
            var col = i % 7;
            var currentDate = allDates[i];
            var isCurrentMonth = currentDate.getMonth() === monthDate.getMonth();
            
            // Calculate week number of this date (for highlighting)
            var week = Utils.getWeekNumber(currentDate);
            var highlightWeek = (currentWeek && week === currentWeek);
            
            // Create text frame for date
            var dateText = page.textFrames.add({
                geometricBounds: [
                    bounds.y + headerHeight + (row * cellHeight),
                    bounds.x + (col * cellWidth),
                    bounds.y + headerHeight + ((row + 1) * cellHeight),
                    bounds.x + ((col + 1) * cellWidth)
                ],
                contents: currentDate.getDate().toString()
            });
            
            // Style the date text
            Utils.applyTextFormatting(dateText.texts[0], userPrefs.calendarFont, userPrefs.calendarFontColor);
            dateText.texts[0].justification = Justification.CENTER_ALIGN;
            dateText.texts[0].pointSize = 7;
            
            // Set up vertical centering of text
            Utils.setupTextFrame(dateText);
            
            // If not current month, make text lighter
            if (!isCurrentMonth) {
                try {
                    dateText.texts[0].fillTint = 30;
                } catch (e) {
                    // Continue if tint setting fails
                }
            }
            
            // Highlight current week with header color text instead of gray background
            if (highlightWeek) {
                try {
                    // Use header color for the current week
                    dateText.texts[0].fillColor = userPrefs.headerColorName;
                    dateText.texts[0].fillTint = 100;
                    
                    // Try to make text bold for current week
                    try {
                        dateText.texts[0].fontStyle = "Bold";
                    } catch (e) {
                        // Ignore if bold is not available
                    }
                } catch (e) {
                    // Continue if highlighting fails
                }
            }
        }
        
        // Add border around the entire calendar
        var calendarBorder = page.rectangles.add({
            geometricBounds: [
                bounds.y + headerHeight,
                bounds.x,
                bounds.y + bounds.height,
                bounds.x + bounds.width
            ],
            fillColor: "None",
            strokeColor: "Black",
            strokeWeight: 0.5
        });
    }
    
    // Return public interface
    return {
        createCalendarGrid: createCalendarGrid,
        createMiniMonthCalendar: createMiniMonthCalendar
    };
})();