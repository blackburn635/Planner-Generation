/*******************************************************************************
 * Month Spread Component
 * 
 * Creates a 2-page spread showing a full month calendar.
 * - Left page: Sunday-Wednesday (4 columns)
 * - Right page: Thursday-Saturday (3 columns) + Notes and mini calendars
 * - Headers showing year and month
 *******************************************************************************/

var MonthSpread = (function() {
    /**
     * Creates a two-page spread for a month
     * @param {Document} doc - The InDesign document
     * @param {Date} monthDate - First day of the month
     * @param {Number} startPageIndex - Index of the first available page
     * @param {Object} pageMetrics - Page size and margin information
     * @param {Object} userPrefs - User preferences for fonts and colors
     * @returns {Number} The next available page index
     */
    function createMonthSpread(doc, monthDate, startPageIndex, pageMetrics, userPrefs) {
        // Skip creation if user has disabled monthly spreads
        if (userPrefs.includeMonthly === false) {
            return startPageIndex;
        }
        
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
        
        // Create month header (year left-justified on left page, right-justified on right page)
        Header.createMonthHeader(leftPage, rightPage, monthDate, pageMetrics, userPrefs);
        
        // Create calendar grid - days of week row
        createDaysOfWeekRow(leftPage, rightPage, pageMetrics, userPrefs);
        
        // Create the calendar grid cells for the month
        // Left page: Sunday-Wednesday (4 columns)
        // Right page: Thursday-Saturday (3 columns) + Notes/Mini calendars
        createMonthGrid(leftPage, rightPage, monthDate, pageMetrics, userPrefs);
        
        // Create month footer
        Footer.createMonthFooter(leftPage, rightPage, monthDate, pageMetrics, userPrefs);
        
        // Return the next available page index
        return rightPageIndex + 1;
    }
    
    /**
     * Creates the days of week row on both pages
     * @param {Page} leftPage - Left page of the spread
     * @param {Page} rightPage - Right page of the spread
     * @param {Object} pageMetrics - Page metrics information
     * @param {Object} userPrefs - User preferences
     */
    function createDaysOfWeekRow(leftPage, rightPage, pageMetrics, userPrefs) {
        // Left page: Sunday-Wednesday
        var leftDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday'];
        
        // Calculate top position for headers row (after the general header)
        var headerY = pageMetrics.margins.top + 10;
        var headerHeight = 30;
        var columnWidth = pageMetrics.usable.width / 4; // 4 columns on left page
        
        // Create colored header row for day names on left page
        var leftHeaderBox = leftPage.rectangles.add({
            geometricBounds: [
                headerY,
                leftPage.bounds[1] + pageMetrics.margins.left,
                headerY + headerHeight,
                leftPage.bounds[1] + pageMetrics.width - pageMetrics.margins.right
            ],
            fillColor: userPrefs.headerColorName,
            strokeColor: "None"
        });
        
        // Add day name headers for left page
        for (var i = 0; i < leftDays.length; i++) {
            var dayHeader = leftPage.textFrames.add({
                geometricBounds: [
                    headerY + 2,
                    leftPage.bounds[1] + pageMetrics.margins.left + (i * columnWidth),
                    headerY + headerHeight - 2,
                    leftPage.bounds[1] + pageMetrics.margins.left + ((i + 1) * columnWidth)
                ],
                contents: leftDays[i]
            });
            
            // Apply formatting (Paper color for text on colored background)
            Utils.applyTextFormatting(dayHeader.texts.item(0), userPrefs.titleFont, "Paper");
            dayHeader.texts.item(0).justification = Justification.CENTER_ALIGN;
            Utils.setupTextFrame(dayHeader);
        }
        
        // Right page: Thursday-Saturday + Notes
        var rightDays = ['Thursday', 'Friday', 'Saturday', 'Notes'];
        var rightColumnWidth = pageMetrics.usable.width / 4; // 4 columns on right page
        
        // Create colored header row for day names on right page
        var rightHeaderBox = rightPage.rectangles.add({
            geometricBounds: [
                headerY,
                rightPage.bounds[1] + pageMetrics.margins.left,
                headerY + headerHeight,
                rightPage.bounds[1] + pageMetrics.width - pageMetrics.margins.right
            ],
            fillColor: userPrefs.headerColorName,
            strokeColor: "None"
        });
        
        // Add day name headers for right page
        for (var i = 0; i < rightDays.length; i++) {
            var dayHeader = rightPage.textFrames.add({
                geometricBounds: [
                    headerY + 2,
                    rightPage.bounds[1] + pageMetrics.margins.left + (i * rightColumnWidth),
                    headerY + headerHeight - 2,
                    rightPage.bounds[1] + pageMetrics.margins.left + ((i + 1) * rightColumnWidth)
                ],
                contents: rightDays[i]
            });
            
            // Apply formatting (Paper color for text on colored background)
            Utils.applyTextFormatting(dayHeader.texts.item(0), userPrefs.titleFont, "Paper");
            dayHeader.texts.item(0).justification = Justification.CENTER_ALIGN;
            Utils.setupTextFrame(dayHeader);
        }
        
        return headerY + headerHeight; // Return the Y position after the headers
    }
    
    /**
     * Creates the calendar grid cells for the month
     * @param {Page} leftPage - Left page of the spread
     * @param {Page} rightPage - Right page of the spread
     * @param {Date} monthDate - First day of the month
     * @param {Object} pageMetrics - Page metrics information
     * @param {Object} userPrefs - User preferences
     */
    function createMonthGrid(leftPage, rightPage, monthDate, pageMetrics, userPrefs) {
        // Calculate dates for current month
        var monthDates = Utils.getMonthDates(monthDate);
        var allDates = monthDates.prevMonthDates.concat(monthDates.currentMonthDates, monthDates.nextMonthDates);
        
        // Calculate top position for grid (after the headers)
        var headerY = pageMetrics.margins.top + 10;
        var headerHeight = 30;
        var gridTop = headerY + headerHeight + 5;
        
        // Calculate available height for grid
        var footerSpace = 30; // Reserve space for footer
        var availableHeight = pageMetrics.height - gridTop - pageMetrics.margins.bottom - footerSpace;
        
        // Calculate rows needed (usually 5 or 6)
        var numRows = monthDates.rows;
        var rowHeight = availableHeight / numRows;
        
        // Calculate column widths
        var leftColumnWidth = pageMetrics.usable.width / 4; // 4 columns on left page
        var rightColumnWidth = pageMetrics.usable.width / 4; // 4 columns on right page
        
        // For each week in the month
        for (var row = 0; row < numRows; row++) {
            // Calculate Y positions for this row
            var rowTop = gridTop + (row * rowHeight);
            var rowBottom = rowTop + rowHeight;
            
            // For each day of the week
            for (var col = 0; col < 7; col++) {
                var dateIndex = (row * 7) + col;
                if (dateIndex >= allDates.length) continue;
                
                var currentDate = allDates[dateIndex];
                var isCurrentMonth = currentDate.getMonth() === monthDate.getMonth();
                
                // Determine which page and column this day goes in
                var page, columnWidth, x;
                if (col < 4) {
                    // Sunday-Wednesday on left page
                    page = leftPage;
                    columnWidth = leftColumnWidth;
                    x = page.bounds[1] + pageMetrics.margins.left + (col * columnWidth);
                } else {
                    // Thursday-Saturday on right page
                    page = rightPage;
                    columnWidth = rightColumnWidth;
                    x = page.bounds[1] + pageMetrics.margins.left + ((col - 4) * columnWidth);
                }
                
                // Create the day cell
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
                
                // Style date text based on whether it's current month or not
                Utils.applyTextFormatting(
                    dateNumFrame.texts.item(0), 
                    userPrefs.calendarFont, 
                    userPrefs.calendarFontColor
                );
                
                if (!isCurrentMonth) {
                    // Style dates from other months differently
                    try {
                        dateNumFrame.texts.item(0).fillTint = 50; // Make text lighter
                    } catch (e) {
                        // Ignore errors in styling
                    }
                }
            }
        }
        
        // Create notes section in 4th column on right page (all rows)
        var notesX = rightPage.bounds[1] + pageMetrics.margins.left + (3 * rightColumnWidth);
        var notesWidth = rightColumnWidth;
        
        // Calculate fixed row heights for 8th column (always dividing into 5 rows)
        var fixedRowHeight = availableHeight / 5;
        
        // Create main notes area (first 3 rows) - REMOVED THE TITLE AND EXTENDED THE AREA
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
        
        // Add ruling lines for notes - Starting from the top of the notes area
        var linesPerSection = Math.floor(notesHeight / 12); // 12pt line spacing
        var lineSpacing = notesHeight / linesPerSection;
        
        for (var i = 0; i < linesPerSection; i++) {
            var lineY = gridTop + 4 + (i * lineSpacing); // Start closer to the top
            var line = rightPage.graphicLines.add({
                strokeWeight: 0.25,
                strokeColor: "Black",
                strokeTint: 20
            });
            line.paths.item(0).entirePath = [
                [notesX + 2, lineY],
                [notesX + notesWidth - 2, lineY]
            ];
        }
        
        // Create mini calendar for next month (row 4) - always in the same position
        var nextMonthDate = new Date(monthDate);
        nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
        
        // Fixed position for first mini calendar (row 4)
        var miniCalY = gridTop + (fixedRowHeight * 3) + 5;
        var miniCalHeight = fixedRowHeight - 10;
        
        // Add header for next month mini calendar
        var monthNames = ["January", "February", "March", "April", "May", "June", 
                          "July", "August", "September", "October", "November", "December"];
        var nextMonthHeader = rightPage.textFrames.add({
            geometricBounds: [
                miniCalY,
                notesX + 2,
                miniCalY + 15,
                notesX + notesWidth - 2
            ],
            contents: monthNames[nextMonthDate.getMonth()] + " " + nextMonthDate.getFullYear()
        });
        
        Utils.applyTextFormatting(nextMonthHeader.texts.item(0), userPrefs.calendarFont, userPrefs.calendarFontColor);
        nextMonthHeader.texts.item(0).justification = Justification.CENTER_ALIGN;
        
        // Create mini calendar using CalendarGrid component
        CalendarGrid.createMiniMonthCalendar(
            rightPage,
            miniCalY + 15,
            notesX + 5,
            notesWidth - 10,
            nextMonthDate,
            0, // No week to highlight
            pageMetrics,
            userPrefs
        );
        
        // Create mini calendar for month after next (row 5) - always in the same position
        var nextNextMonthDate = new Date(monthDate);
        nextNextMonthDate.setMonth(nextNextMonthDate.getMonth() + 2);
        
        // Fixed position for second mini calendar (row 5)
        var miniCal2Y = gridTop + (fixedRowHeight * 4) + 5;
        
        // Add header for month after next mini calendar
        var nextNextMonthHeader = rightPage.textFrames.add({
            geometricBounds: [
                miniCal2Y,
                notesX + 2,
                miniCal2Y + 15,
                notesX + notesWidth - 2
            ],
            contents: monthNames[nextNextMonthDate.getMonth()] + " " + nextNextMonthDate.getFullYear()
        });
        
        Utils.applyTextFormatting(nextNextMonthHeader.texts.item(0), userPrefs.calendarFont, userPrefs.calendarFontColor);
        nextNextMonthHeader.texts.item(0).justification = Justification.CENTER_ALIGN;
        
        // Create mini calendar using CalendarGrid component
        CalendarGrid.createMiniMonthCalendar(
            rightPage,
            miniCal2Y + 15,
            notesX + 5,
            notesWidth - 10,
            nextNextMonthDate,
            0, // No week to highlight
            pageMetrics,
            userPrefs
        );
    }
    
    // Return public interface
    return {
        createMonthSpread: createMonthSpread
    };
})();