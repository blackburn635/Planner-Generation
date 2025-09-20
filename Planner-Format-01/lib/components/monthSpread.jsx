// Planner-Format-01/lib/components/monthSpread.jsx

/*******************************************************************************
 * Enhanced Month Spread Component - With Binding-Aware Margins
 * 
 * Creates a 2-page spread showing a full month calendar.
 * - Left page: Sunday-Wednesday (4 columns)
 * - Right page: Thursday-Saturday (3 columns) + Notes and mini calendars
 * - Headers showing year and month
 * 
 * ENHANCED IN V03:
 * - Uses "Mini-Calendar Titles" font for day headers (Sunday, Monday, etc.)
 * - Uses "Monthly Spread Calendar Dates" font for main calendar dates
 * - Uses "Weekly Spread Content" font for notes section content
 * - Uses "Mini-Calendar" fonts for next month preview calendars
 * - Supports user-defined font sizes for all text elements
 * - Enhanced error handling and modular structure
 * - Maintains backward compatibility
 * - NEW: Uses binding-aware margins when pageMetrics contains effective margins
 *******************************************************************************/

var MonthSpread = (function() {
    /**
     * Creates a two-page spread for a month
     * @param {Document} doc - The InDesign document
     * @param {Date} monthDate - First day of the month
     * @param {Number} startPageIndex - Index of the first available page
     * @param {Object} pageMetrics - Page size and margin information (now supports binding-aware margins)
     * @param {Object} userPrefs - Enhanced user preferences with granular font settings
     * @returns {Number} The next available page index
     */
    function createMonthSpread(doc, monthDate, startPageIndex, pageMetrics, userPrefs) {
        // Skip creation if user has disabled monthly spreads
        if (userPrefs.includeMonthly === false) {
            return startPageIndex;
        }
        
        try {
            // NEW IN V03: Get font settings for different components
            var miniTitleFontSettings = getMiniCalendarTitleFontSettings(userPrefs);
            var monthlyCalendarFontSettings = getMonthlyCalendarFontSettings(userPrefs);
            var weeklyContentFontSettings = getWeeklyContentFontSettings(userPrefs);
            
            // Calculate page indices for this spread
            var leftPageIndex = startPageIndex;
            var rightPageIndex = startPageIndex + 1;
            
            // Add pages if needed
            while (doc.pages.length <= rightPageIndex) {
                doc.pages.add();
            }
            
            // Get references to both pages of the spread
            var leftPage = doc.pages.item(leftPageIndex);
            var rightPage = doc.pages.item(rightPageIndex);
            
            // NEW: Calculate page-specific metrics for binding-aware margins
            var leftPageMetrics = Layout.calculatePageMetricsForPage ? Layout.calculatePageMetricsForPage(doc, leftPage) : pageMetrics;
            var rightPageMetrics = Layout.calculatePageMetricsForPage ? Layout.calculatePageMetricsForPage(doc, rightPage) : pageMetrics;
            
            $.writeln("[MonthSpread] Creating month spread for " + 
                     (monthDate.getMonth() + 1) + "/" + monthDate.getFullYear() + 
                     " with enhanced font settings");
            
            // Create month header (year left-justified on left page, right-justified on right page)
            // Check if Header.createMonthHeader supports separate page metrics
            if (Header.createMonthHeader.length >= 6) {
                // New signature that supports separate page metrics
                Header.createMonthHeader(leftPage, rightPage, monthDate, leftPageMetrics, rightPageMetrics, userPrefs);
            } else {
                // Legacy signature - use original pageMetrics
                Header.createMonthHeader(leftPage, rightPage, monthDate, pageMetrics, userPrefs);
            }
            
            // Create calendar grid - days of week row
            var headerHeight = createEnhancedDaysOfWeekRow(leftPage, rightPage, leftPageMetrics, rightPageMetrics, userPrefs, weeklyContentFontSettings);
            
            // Create the calendar grid cells for the month
            createEnhancedMonthGrid(leftPage, rightPage, monthDate, leftPageMetrics, rightPageMetrics, userPrefs, monthlyCalendarFontSettings, headerHeight);
            
            // Create month footer
            // Check if Footer.createMonthFooter supports separate page metrics
            if (Footer.createMonthFooter.length >= 6) {
                // New signature that supports separate page metrics
                Footer.createMonthFooter(leftPage, rightPage, monthDate, leftPageMetrics, rightPageMetrics, userPrefs);
            } else {
                // Legacy signature - use original pageMetrics
                Footer.createMonthFooter(leftPage, rightPage, monthDate, pageMetrics, userPrefs);
            }
            
            $.writeln("[MonthSpread] Month spread completed for " + 
                     (monthDate.getMonth() + 1) + "/" + monthDate.getFullYear());
            
            // Return the next available page index
            return rightPageIndex + 1;
            
        } catch (e) {
            throw new Error("Error creating month spread: " + e.message);
        }
    }
    
    /**
     * NEW IN V03: Creates enhanced days of week row on both pages
     * @param {Page} leftPage - Left page of the spread
     * @param {Page} rightPage - Right page of the spread
     * @param {Object} leftPageMetrics - Page metrics for left page (binding-aware)
     * @param {Object} rightPageMetrics - Page metrics for right page (binding-aware)
     * @param {Object} userPrefs - Enhanced user preferences
     * @param {Object} miniTitleFontSettings - Font settings for day headers
     * @returns {Number} Height of the header row
     */
    function createEnhancedDaysOfWeekRow(leftPage, rightPage, leftPageMetrics, rightPageMetrics, userPrefs, miniTitleFontSettings) {
        try {
            // Left page: Sunday-Wednesday
            var leftDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday'];
            
            // Calculate top position for headers row (after the general header)
            var headerY = leftPageMetrics.margins.top + 10;
            var headerHeight = 30;
            var leftColumnWidth = leftPageMetrics.usable.width / 4; // 4 columns on left page
            var rightColumnWidth = rightPageMetrics.usable.width / 4; // 4 columns on right page
            
            // Create colored header row for day names on left page (using left page metrics)
            var leftHeaderBox = leftPage.rectangles.add({
                geometricBounds: [
                    headerY,
                    leftPage.bounds[1] + leftPageMetrics.margins.left, // Uses binding-aware left margin
                    headerY + headerHeight,
                    leftPage.bounds[1] + leftPageMetrics.width - leftPageMetrics.margins.right // Uses binding-aware right margin
                ],
                fillColor: userPrefs.headerColorName,
                strokeColor: "None"
            });
            
            // Add day name headers for left page
            for (var i = 0; i < leftDays.length; i++) {
                createDayHeader(leftPage, leftDays[i], headerY, headerHeight, i, leftColumnWidth, leftPageMetrics, miniTitleFontSettings);
            }
            
            // Right page: Thursday-Saturday + Notes
            var rightDays = ['Thursday', 'Friday', 'Saturday', 'Notes'];
            
            // Create colored header row for day names on right page (using right page metrics)
            var rightHeaderBox = rightPage.rectangles.add({
                geometricBounds: [
                    headerY,
                    rightPage.bounds[1] + rightPageMetrics.margins.left, // Uses binding-aware left margin
                    headerY + headerHeight,
                    rightPage.bounds[1] + rightPageMetrics.width - rightPageMetrics.margins.right // Uses binding-aware right margin
                ],
                fillColor: userPrefs.headerColorName,
                strokeColor: "None"
            });
            
            // Add day name headers for right page
            for (var i = 0; i < rightDays.length; i++) {
                createDayHeader(rightPage, rightDays[i], headerY, headerHeight, i, rightColumnWidth, rightPageMetrics, miniTitleFontSettings);
            }
            
            $.writeln("[MonthSpread] Days of week headers created with font: " + 
                     miniTitleFontSettings.font + ", size: " + miniTitleFontSettings.size + "pt");
            
            return headerY + headerHeight; // Return the Y position after the headers
            
        } catch (e) {
            throw new Error("Error creating days of week row: " + e.message);
        }
    }
    
    /**
     * NEW IN V03: Creates a single day header with enhanced font settings
     * @param {Page} page - The page to add the header to
     * @param {String} dayName - Name of the day
     * @param {Number} headerY - Y position of header
     * @param {Number} headerHeight - Height of header
     * @param {Number} columnIndex - Column index
     * @param {Number} columnWidth - Width of column
     * @param {Object} pageMetrics - Page metrics (binding-aware)
     * @param {Object} miniTitleFontSettings - Font settings for day headers
     */
    function createDayHeader(page, dayName, headerY, headerHeight, columnIndex, columnWidth, pageMetrics, miniTitleFontSettings) {
        try {
            var dayHeader = page.textFrames.add({
                geometricBounds: [
                    headerY + 2,
                    page.bounds[1] + pageMetrics.margins.left + (columnIndex * columnWidth), // Uses binding-aware margins
                    headerY + headerHeight - 2,
                    page.bounds[1] + pageMetrics.margins.left + ((columnIndex + 1) * columnWidth) // Uses binding-aware margins
                ],
                contents: dayName
            });
            
            // NEW IN V03: Apply mini calendar title font settings (Paper color for visibility on colored background)
            Utils.applyTextFormatting(dayHeader.texts.item(0), miniTitleFontSettings.font, "Paper");
            dayHeader.texts.item(0).pointSize = miniTitleFontSettings.size;
            dayHeader.texts.item(0).justification = Justification.CENTER_ALIGN;
            Utils.setupTextFrame(dayHeader);
            
        } catch (e) {
            $.writeln("[MonthSpread] Error creating day header '" + dayName + "': " + e.message);
            // Continue with other headers rather than failing
        }
    }
    
    /**
     * NEW IN V03: Creates enhanced calendar grid cells for the month
     * @param {Page} leftPage - Left page of the spread
     * @param {Page} rightPage - Right page of the spread
     * @param {Date} monthDate - First day of the month
     * @param {Object} leftPageMetrics - Page metrics for left page (binding-aware)
     * @param {Object} rightPageMetrics - Page metrics for right page (binding-aware)
     * @param {Object} userPrefs - Enhanced user preferences
     * @param {Object} monthlyCalendarFontSettings - Font settings for calendar dates
     * @param {Number} headerBottom - Y position after the day headers
     */
    function createEnhancedMonthGrid(leftPage, rightPage, monthDate, leftPageMetrics, rightPageMetrics, userPrefs, monthlyCalendarFontSettings, headerBottom) {
        try {
            // Calculate dates for current month
            var monthDates = Utils.getMonthDates(monthDate);
            var allDates = monthDates.prevMonthDates.concat(monthDates.currentMonthDates, monthDates.nextMonthDates);
            
            // Calculate grid dimensions using left page metrics as base (they should be similar for height calculations)
            var gridTop = headerBottom + 5;
            var footerSpace = 30; // Reserve space for footer
            var availableHeight = leftPageMetrics.height - gridTop - leftPageMetrics.margins.bottom - footerSpace;
            var numRows = monthDates.rows;
            var rowHeight = availableHeight / numRows;
            var leftColumnWidth = leftPageMetrics.usable.width / 4; // 4 columns on left page
            var rightColumnWidth = rightPageMetrics.usable.width / 4; // 4 columns on right page
            
            // Create calendar cells for each week
            for (var row = 0; row < numRows; row++) {
                createCalendarRow(leftPage, rightPage, row, allDates, monthDate, gridTop, rowHeight, leftColumnWidth, rightColumnWidth, leftPageMetrics, rightPageMetrics, userPrefs, monthlyCalendarFontSettings);
            }
            
            // Create enhanced notes section and mini calendars on right page
            createEnhancedNotesAndMiniCalendars(rightPage, gridTop, availableHeight, rightColumnWidth, rightPageMetrics, userPrefs, monthDate);
            
            $.writeln("[MonthSpread] Calendar grid created with font: " + 
                     monthlyCalendarFontSettings.font + ", size: " + monthlyCalendarFontSettings.size + "pt");
            
        } catch (e) {
            throw new Error("Error creating month grid: " + e.message);
        }
    }
    
    /**
     * NEW IN V03: Creates a single row of calendar cells
     * @param {Page} leftPage - Left page
     * @param {Page} rightPage - Right page
     * @param {Number} row - Row index
     * @param {Array} allDates - All dates for the month
     * @param {Date} monthDate - Month being displayed
     * @param {Number} gridTop - Top of grid area
     * @param {Number} rowHeight - Height of each row
     * @param {Number} leftColumnWidth - Width of left page columns
     * @param {Number} rightColumnWidth - Width of right page columns
     * @param {Object} leftPageMetrics - Page metrics for left page (binding-aware)
     * @param {Object} rightPageMetrics - Page metrics for right page (binding-aware)
     * @param {Object} userPrefs - User preferences
     * @param {Object} monthlyCalendarFontSettings - Font settings for dates
     */
    function createCalendarRow(leftPage, rightPage, row, allDates, monthDate, gridTop, rowHeight, leftColumnWidth, rightColumnWidth, leftPageMetrics, rightPageMetrics, userPrefs, monthlyCalendarFontSettings) {
        try {
            var rowTop = gridTop + (row * rowHeight);
            var rowBottom = rowTop + rowHeight;
            
            // Create cells for each day of the week
            for (var col = 0; col < 7; col++) {
                var dateIndex = (row * 7) + col;
                if (dateIndex >= allDates.length) continue;
                
                var currentDate = allDates[dateIndex];
                var isCurrentMonth = currentDate.getMonth() === monthDate.getMonth();
                
                // Determine which page and column this day goes in
                var page, columnWidth, pageMetrics, x;
                if (col < 4) {
                    // Sunday-Wednesday on left page
                    page = leftPage;
                    columnWidth = leftColumnWidth;
                    pageMetrics = leftPageMetrics;
                    x = page.bounds[1] + pageMetrics.margins.left + (col * columnWidth); // Uses binding-aware margins
                } else {
                    // Thursday-Saturday on right page
                    page = rightPage;
                    columnWidth = rightColumnWidth;
                    pageMetrics = rightPageMetrics;
                    x = page.bounds[1] + pageMetrics.margins.left + ((col - 4) * columnWidth); // Uses binding-aware margins
                }
                
                createMonthCalendarCell(page, currentDate, isCurrentMonth, rowTop, rowBottom, x, columnWidth, userPrefs, monthlyCalendarFontSettings);
            }
        } catch (e) {
            $.writeln("[MonthSpread] Error creating calendar row " + row + ": " + e.message);
            // Continue with other rows
        }
    }
    
    /**
     * NEW IN V03: Creates a single calendar cell
     * @param {Page} page - Page to create cell on
     * @param {Date} currentDate - Date for this cell
     * @param {Boolean} isCurrentMonth - Whether date is in current month
     * @param {Number} rowTop - Top of row
     * @param {Number} rowBottom - Bottom of row
     * @param {Number} x - X position
     * @param {Number} columnWidth - Width of column
     * @param {Object} userPrefs - User preferences
     * @param {Object} monthlyCalendarFontSettings - Font settings
     */
    function createMonthCalendarCell(page, currentDate, isCurrentMonth, rowTop, rowBottom, x, columnWidth, userPrefs, monthlyCalendarFontSettings) {
        try {
            // Create the day cell rectangle
            var cellRect = page.rectangles.add({
                geometricBounds: [rowTop, x, rowBottom, x + columnWidth],
                fillColor: "None",
                strokeColor: "Black",
                strokeWeight: 0.5,
                strokeTint: isCurrentMonth ? 100 : 50
            });
            
            // Create date number in top-left corner
            var dateNumFrame = page.textFrames.add({
                geometricBounds: [rowTop + 2, x + 2, rowTop + 15, x + 20],
                contents: currentDate.getDate().toString()
            });
            
            // NEW IN V03: Apply monthly calendar font settings
            Utils.applyTextFormatting(dateNumFrame.texts.item(0), monthlyCalendarFontSettings.font, monthlyCalendarFontSettings.color);
            dateNumFrame.texts.item(0).pointSize = monthlyCalendarFontSettings.size;
            
            if (!isCurrentMonth) {
                // Style dates from other months differently
                try {
                    dateNumFrame.texts.item(0).fillTint = 50; // Make text lighter
                } catch (tintError) {
                    $.writeln("[MonthSpread] Could not apply tint to adjacent month date");
                }
            }
            
        } catch (e) {
            $.writeln("[MonthSpread] Error creating calendar cell for " + currentDate.toDateString() + ": " + e.message);
        }
    }
    
    /**
     * NEW IN V03: Creates enhanced notes section and mini calendars with proper font settings
     * @param {Page} rightPage - Right page of spread
     * @param {Number} gridTop - Top of grid area
     * @param {Number} availableHeight - Available height for content
     * @param {Number} rightColumnWidth - Width of right page columns
     * @param {Object} pageMetrics - Page metrics (binding-aware)
     * @param {Object} userPrefs - User preferences
     * @param {Date} monthDate - Current month date
     */
    function createEnhancedNotesAndMiniCalendars(rightPage, gridTop, availableHeight, rightColumnWidth, pageMetrics, userPrefs, monthDate) {
        try {
            var weeklyContentFontSettings = getWeeklyContentFontSettings(userPrefs);
            var miniTitleFontSettings = getMiniCalendarTitleFontSettings(userPrefs);
            
            // Create notes section in 4th column on right page (all rows) using binding-aware margins
            var notesX = rightPage.bounds[1] + pageMetrics.margins.left + (3 * rightColumnWidth);
            var notesWidth = rightColumnWidth;
            
            // Calculate fixed row heights for 4th column (always dividing into 5 rows)
            var fixedRowHeight = availableHeight / 5;
            
            // Create main notes area (first 3 rows)
            var notesHeight = fixedRowHeight * 3;
            var notesRect = rightPage.rectangles.add({
                geometricBounds: [
                    gridTop,
                    notesX,
                    gridTop + notesHeight,
                    notesX + notesWidth
                ],
                fillColor: "None",
                strokeColor: "Black",
                strokeWeight: 0.5
            });
            
            // Add ruling lines for notes using weekly content font size for proper spacing
            createNotesRulingLines(rightPage, gridTop, notesHeight, notesX, notesWidth, weeklyContentFontSettings);
            
            // Create mini calendars for next months
            createNextMonthMiniCalendars(rightPage, monthDate, gridTop, fixedRowHeight, notesX, notesWidth, pageMetrics, userPrefs, miniTitleFontSettings);
            
            $.writeln("[MonthSpread] Notes section and mini calendars created with enhanced font settings");
            
        } catch (e) {
            throw new Error("Error creating notes and mini calendars: " + e.message);
        }
    }
    
    /**
     * NEW IN V03: Creates ruling lines for notes section based on content font size
     * @param {Page} page - Page to add lines to
     * @param {Number} gridTop - Top of grid
     * @param {Number} notesHeight - Height of notes area
     * @param {Number} notesX - X position of notes
     * @param {Number} notesWidth - Width of notes area
     * @param {Object} weeklyContentFontSettings - Font settings for spacing calculation
     */
    function createNotesRulingLines(page, gridTop, notesHeight, notesX, notesWidth, weeklyContentFontSettings) {
        try {
            // Calculate line spacing based on font size (font size + 2 points for comfortable spacing)
            var lineSpacing = weeklyContentFontSettings.size + 2;
            var linesPerSection = Math.floor(notesHeight / lineSpacing);
            
            for (var i = 0; i < linesPerSection; i++) {
                var lineY = gridTop + 4 + (i * lineSpacing);
                var line = page.graphicLines.add({
                    strokeWeight: 0.25,
                    strokeColor: "Black",
                    strokeTint: 20
                });
                line.paths.item(0).entirePath = [
                    [notesX + 2, lineY],
                    [notesX + notesWidth - 2, lineY]
                ];
            }
        } catch (e) {
            $.writeln("[MonthSpread] Error creating notes ruling lines: " + e.message);
        }
    }
    
    /**
     * NEW IN V03: Creates mini calendars for next months with enhanced font settings
     * @param {Page} page - Page to add calendars to
     * @param {Date} monthDate - Current month
     * @param {Number} gridTop - Top of grid
     * @param {Number} fixedRowHeight - Height of each row
     * @param {Number} notesX - X position
     * @param {Number} notesWidth - Width available
     * @param {Object} pageMetrics - Page metrics (binding-aware)
     * @param {Object} userPrefs - User preferences
     * @param {Object} miniTitleFontSettings - Font settings for calendar titles
     */
    function createNextMonthMiniCalendars(page, monthDate, gridTop, fixedRowHeight, notesX, notesWidth, pageMetrics, userPrefs, miniTitleFontSettings) {
        try {
            var monthNames = ["January", "February", "March", "April", "May", "June", 
                              "July", "August", "September", "October", "November", "December"];
            
            // Create mini calendar for next month (row 4)
            var nextMonthDate = new Date(monthDate);
            nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
            
            var miniCalY = gridTop + (fixedRowHeight * 3) + 5;
            var miniCalHeight = fixedRowHeight - 10;
            
            // Add header for next month mini calendar
            var nextMonthHeader = page.textFrames.add({
                geometricBounds: [
                    miniCalY,
                    notesX + 2,
                    miniCalY + 15,
                    notesX + notesWidth - 2
                ],
                contents: monthNames[nextMonthDate.getMonth()] + " " + nextMonthDate.getFullYear()
            });
            
            // NEW IN V03: Apply mini calendar title font settings
            Utils.applyTextFormatting(nextMonthHeader.texts.item(0), miniTitleFontSettings.font, miniTitleFontSettings.color);
            nextMonthHeader.texts.item(0).pointSize = miniTitleFontSettings.size;
            nextMonthHeader.texts.item(0).justification = Justification.CENTER_ALIGN;
            
            // Create mini calendar using CalendarGrid component (handles mini calendar date fonts automatically)
            CalendarGrid.createMiniMonthCalendar(
                page,
                miniCalY + 15,
                notesX + 5,
                notesWidth - 10,
                nextMonthDate,
                0, // No week to highlight
                pageMetrics,
                userPrefs
            );
            
            // Create mini calendar for month after next (row 5)
            var nextNextMonthDate = new Date(monthDate);
            nextNextMonthDate.setMonth(nextNextMonthDate.getMonth() + 2);
            
            var miniCal2Y = gridTop + (fixedRowHeight * 4) + 5;
            
            // Add header for month after next mini calendar
            var nextNextMonthHeader = page.textFrames.add({
                geometricBounds: [
                    miniCal2Y,
                    notesX + 2,
                    miniCal2Y + 15,
                    notesX + notesWidth - 2
                ],
                contents: monthNames[nextNextMonthDate.getMonth()] + " " + nextNextMonthDate.getFullYear()
            });
            
            // NEW IN V03: Apply mini calendar title font settings
            Utils.applyTextFormatting(nextNextMonthHeader.texts.item(0), miniTitleFontSettings.font, miniTitleFontSettings.color);
            nextNextMonthHeader.texts.item(0).pointSize = miniTitleFontSettings.size;
            nextNextMonthHeader.texts.item(0).justification = Justification.CENTER_ALIGN;
            
            // Create mini calendar using CalendarGrid component
            CalendarGrid.createMiniMonthCalendar(
                page,
                miniCal2Y + 15,
                notesX + 5,
                notesWidth - 10,
                nextNextMonthDate,
                0, // No week to highlight
                pageMetrics,
                userPrefs
            );
            
        } catch (e) {
            $.writeln("[MonthSpread] Error creating mini calendars: " + e.message);
        }
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
            size: userPrefs.miniCalendarTitleSize || 9 // Default to 9pt for mini calendar titles
        };
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
    
    // Return public interface
    return {
        createMonthSpread: createMonthSpread,
        getMiniCalendarTitleFontSettings: getMiniCalendarTitleFontSettings,
        getMonthlyCalendarFontSettings: getMonthlyCalendarFontSettings,
        getWeeklyContentFontSettings: getWeeklyContentFontSettings
    };
})();