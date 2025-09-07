// Planner-Format-01/lib/components/calendarGrid.jsx

/*******************************************************************************
 * Enhanced Calendar Grid Component
 * 
 * Handles the creation of calendar grids throughout the planner:
 * - Creates full month calendar grids for month spreads
 * - Creates mini calendars for 3-month overviews in weekly spreads
 * - Manages styling and layout of calendar elements
 * 
 * ENHANCED IN V03:
 * - Uses "Monthly Spread Calendar Dates" font settings for full calendars
 * - Uses "Mini-Calendar Titles" font settings for day headers (S M T W T F S)
 * - Uses "Mini-Calendar Dates" font settings for mini calendar dates
 * - Supports user-defined font sizes for all calendar elements
 * - Enhanced error handling and modular structure
 * - Maintains backward compatibility
 *******************************************************************************/

var CalendarGrid = (function() {
    /**
     * Creates a calendar grid for a month (full-size for monthly spreads)
     * @param {Page} page - The page to add the calendar to
     * @param {Object} bounds - The bounds for the grid {x, y, width, height}
     * @param {Date} monthDate - First day of the month
     * @param {Object} options - Options for grid display
     * @param {Object} userPrefs - Enhanced user preferences with granular font settings
     */
    function createCalendarGrid(page, bounds, monthDate, options, userPrefs) {
        options = options || {};
        
        try {
            // NEW IN V03: Get font settings for monthly calendar dates
            var fontSettings = getMonthlyCalendarFontSettings(userPrefs);
            
            // Get month information
            var monthInfo = Layout.calculateMonthGrid(bounds, monthDate);
            
            // Calculate cell dimensions
            var cellWidth = bounds.width / 7;
            var cellHeight = bounds.height / monthInfo.rows;
            
            // Get all dates for the calendar (including those from adjacent months)
            var monthDates = Utils.getMonthDates(monthDate);
            var allDates = monthDates.prevMonthDates.concat(monthDates.currentMonthDates, monthDates.nextMonthDates);
            
            $.writeln("[CalendarGrid] Creating full calendar grid for " + 
                     (monthDate.getMonth() + 1) + "/" + monthDate.getFullYear() + 
                     " with font: " + fontSettings.font + ", size: " + fontSettings.size + "pt");
            
            // Create grid cells
            for (var row = 0; row < monthInfo.rows; row++) {
                for (var col = 0; col < 7; col++) {
                    var dayIndex = (row * 7) + col;
                    
                    if (dayIndex < allDates.length) {
                        createFullCalendarCell(page, allDates[dayIndex], row, col, cellWidth, cellHeight, bounds, monthDate, fontSettings, options, userPrefs);
                    }
                }
            }
            
        } catch (e) {
            throw new Error("Error creating calendar grid: " + e.message);
        }
    }
    
    /**
     * NEW IN V03: Creates a single cell for the full calendar grid
     * @param {Page} page - The page to add the cell to
     * @param {Date} currentDate - The date for this cell
     * @param {Number} row - Row position
     * @param {Number} col - Column position
     * @param {Number} cellWidth - Width of the cell
     * @param {Number} cellHeight - Height of the cell
     * @param {Object} bounds - Grid bounds
     * @param {Date} monthDate - The month being displayed
     * @param {Object} fontSettings - Font settings to apply
     * @param {Object} options - Display options
     * @param {Object} userPrefs - User preferences
     */
    function createFullCalendarCell(page, currentDate, row, col, cellWidth, cellHeight, bounds, monthDate, fontSettings, options, userPrefs) {
        try {
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
            
            // NEW IN V03: Apply enhanced text styling for monthly calendar dates
            try {
                var effectiveColor = options.fontColor || fontSettings.color;
                Utils.applyTextFormatting(dateText.texts[0], fontSettings.font, effectiveColor);
                dateText.texts[0].pointSize = fontSettings.size;
                
                // If not current month, make text lighter
                if (!isCurrentMonth) {
                    try {
                        dateText.texts[0].fillTint = 50;
                    } catch (tintError) {
                        $.writeln("[CalendarGrid] Could not apply tint to adjacent month date");
                    }
                }
                
                // Additional styling options
                if (options.highlightWeekend && (col === 0 || col === 6)) {
                    // Weekend styling
                    try {
                        cellRect.fillColor = userPrefs.headerColorName;
                        cellRect.fillTint = 20;
                    } catch (weekendError) {
                        $.writeln("[CalendarGrid] Could not apply weekend styling");
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
                    } catch (highlightError) {
                        $.writeln("[CalendarGrid] Could not apply date highlighting");
                    }
                }
                
            } catch (textError) {
                throw new Error("Error formatting calendar date text: " + textError.message);
            }
            
        } catch (e) {
            $.writeln("[CalendarGrid] Error creating calendar cell for " + currentDate.toDateString() + ": " + e.message);
            // Continue with other cells rather than failing completely
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
     * @param {Object} userPrefs - Enhanced user preferences with granular font settings
     * @param {Number} heightRatio - Ratio of height to width (optional, default 0.85)
     */
    function createMiniMonthCalendar(page, top, left, width, monthDate, currentWeek, pageMetrics, userPrefs, heightRatio) {
        // Default height ratio if not provided
        heightRatio = heightRatio || 0.85;
        
        try {
            // NEW IN V03: Get font settings for mini calendar components
            var titleFontSettings = getMiniCalendarTitleFontSettings(userPrefs);
            var dateFontSettings = getMiniCalendarDateFontSettings(userPrefs);
            
            // Create calendar bounds
            var bounds = {
                x: left,
                y: top,
                width: width,
                height: width * heightRatio // Height proportional to width
            };
            
            $.writeln("[CalendarGrid] Creating mini calendar for " + 
                     (monthDate.getMonth() + 1) + "/" + monthDate.getFullYear() + 
                     " with title font: " + titleFontSettings.font + " (" + titleFontSettings.size + "pt)" +
                     ", date font: " + dateFontSettings.font + " (" + dateFontSettings.size + "pt)");
            
            // Get month information
            var monthInfo = Utils.getMonthDates(monthDate);
            var allDates = monthInfo.prevMonthDates.concat(monthInfo.currentMonthDates, monthInfo.nextMonthDates);
            
            // Add day name headers (S M T W T F S)
            var headerHeight = createMiniCalendarHeaders(page, bounds, titleFontSettings);
            
            // Calculate cell height for the dates
            var calendarHeight = bounds.height - headerHeight;
            var rows = Math.ceil(allDates.length / 7);
            var cellHeight = calendarHeight / rows;
            var cellWidth = bounds.width / 7;
            
            // Create calendar cells
            for (var i = 0; i < allDates.length; i++) {
                createMiniCalendarCell(page, allDates[i], i, bounds, headerHeight, cellWidth, cellHeight, monthDate, currentWeek, dateFontSettings, userPrefs);
            }
            
            // Add border around the entire calendar
            createMiniCalendarBorder(page, bounds, headerHeight);
            
        } catch (e) {
            throw new Error("Error creating mini month calendar: " + e.message);
        }
    }
    
    /**
     * NEW IN V03: Creates day headers for mini calendar (S M T W T F S)
     * @param {Page} page - The page to add headers to
     * @param {Object} bounds - Calendar bounds
     * @param {Object} titleFontSettings - Font settings for headers
     * @returns {Number} Height of the header area
     */
    function createMiniCalendarHeaders(page, bounds, titleFontSettings) {
        var dayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        var headerHeight = 15;
        var cellWidth = bounds.width / 7;
        
        try {
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
                
                // NEW IN V03: Apply mini calendar title font settings
                Utils.applyTextFormatting(dayHeader.texts[0], titleFontSettings.font, titleFontSettings.color);
                dayHeader.texts[0].pointSize = titleFontSettings.size;
                dayHeader.texts[0].justification = Justification.CENTER_ALIGN;
                
                // Set up vertical centering of text
                Utils.setupTextFrame(dayHeader);
            }
        } catch (e) {
            $.writeln("[CalendarGrid] Error creating mini calendar headers: " + e.message);
        }
        
        return headerHeight;
    }
    
    /**
     * NEW IN V03: Creates a single cell for mini calendar
     * @param {Page} page - The page to add the cell to
     * @param {Date} currentDate - Date for this cell
     * @param {Number} dateIndex - Index in the dates array
     * @param {Object} bounds - Calendar bounds
     * @param {Number} headerHeight - Height of the header area
     * @param {Number} cellWidth - Width of each cell
     * @param {Number} cellHeight - Height of each cell
     * @param {Date} monthDate - The month being displayed
     * @param {Number} currentWeek - Week to highlight
     * @param {Object} dateFontSettings - Font settings for dates
     * @param {Object} userPrefs - User preferences
     */
    function createMiniCalendarCell(page, currentDate, dateIndex, bounds, headerHeight, cellWidth, cellHeight, monthDate, currentWeek, dateFontSettings, userPrefs) {
        try {
            var row = Math.floor(dateIndex / 7);
            var col = dateIndex % 7;
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
            
            // NEW IN V03: Apply mini calendar date font settings
            Utils.applyTextFormatting(dateText.texts[0], dateFontSettings.font, dateFontSettings.color);
            dateText.texts[0].pointSize = dateFontSettings.size;
            dateText.texts[0].justification = Justification.CENTER_ALIGN;
            
            // Set up vertical centering of text
            Utils.setupTextFrame(dateText);
            
            // If not current month, make text lighter
            if (!isCurrentMonth) {
                try {
                    dateText.texts[0].fillTint = 30;
                } catch (tintError) {
                    $.writeln("[CalendarGrid] Could not apply tint to mini calendar adjacent month date");
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
                    } catch (boldError) {
                        $.writeln("[CalendarGrid] Bold style not available for mini calendar font");
                    }
                } catch (highlightError) {
                    $.writeln("[CalendarGrid] Could not highlight current week in mini calendar");
                }
            }
            
        } catch (e) {
            $.writeln("[CalendarGrid] Error creating mini calendar cell for " + currentDate.toDateString() + ": " + e.message);
        }
    }
    
    /**
     * NEW IN V03: Creates border around mini calendar
     * @param {Page} page - The page to add border to
     * @param {Object} bounds - Calendar bounds
     * @param {Number} headerHeight - Height of header area
     */
    function createMiniCalendarBorder(page, bounds, headerHeight) {
        try {
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
        } catch (e) {
            $.writeln("[CalendarGrid] Could not create mini calendar border: " + e.message);
        }
    }
    
    /**
     * NEW IN V03: Get effective font settings for monthly calendar dates with fallbacks
     * @param {Object} userPrefs - Enhanced user preferences
     * @returns {Object} Object with font, color, and size properties
     */
    function getMonthlyCalendarFontSettings(userPrefs) {
        return {
            font: userPrefs.monthlyCalendarFont || userPrefs.calendarFont || "Myriad Pro",
            color: userPrefs.monthlyCalendarColor || userPrefs.calendarFontColor || "Black",
            size: userPrefs.monthlyCalendarSize || 10 // Default to 10pt for monthly calendar dates
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
            size: userPrefs.miniCalendarTitleSize || 8 // Default to 8pt for mini calendar day headers
        };
    }
    
    /**
     * NEW IN V03: Get effective font settings for mini calendar dates with fallbacks
     * @param {Object} userPrefs - Enhanced user preferences
     * @returns {Object} Object with font, color, and size properties
     */
    function getMiniCalendarDateFontSettings(userPrefs) {
        return {
            font: userPrefs.miniCalendarDateFont || userPrefs.calendarFont || "Myriad Pro",
            color: userPrefs.miniCalendarDateColor || userPrefs.calendarFontColor || "Black",
            size: userPrefs.miniCalendarDateSize || 7 // Default to 7pt for mini calendar dates
        };
    }
    
    // Return public interface
    return {
        createCalendarGrid: createCalendarGrid,
        createMiniMonthCalendar: createMiniMonthCalendar,
        getMonthlyCalendarFontSettings: getMonthlyCalendarFontSettings,
        getMiniCalendarTitleFontSettings: getMiniCalendarTitleFontSettings,
        getMiniCalendarDateFontSettings: getMiniCalendarDateFontSettings
    };
})();