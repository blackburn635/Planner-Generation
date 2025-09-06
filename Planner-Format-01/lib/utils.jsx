/*******************************************************************************
 * Utilities Module
 * 
 * Provides common utility functions used throughout the planner application:
 * - Date formatting and manipulation
 * - Text formatting
 * - Text frame setup
 * - Other helper functions
 *******************************************************************************/

var Utils = (function() {
    /**
     * Gets the week number for a date
     * @param {Date} date - The date to get the week number for
     * @returns {Number} The week number (1-53)
     */
    function getWeekNumber(date) {
        // Create a copy of the date to avoid modifying the original
        var d = new Date(date);
        
        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        
        // Get first day of year
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        
        // Calculate full weeks to nearest Thursday
        var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        
        return weekNo;
    }

    /**
     * Gets the name of the day for a given date
     * @param {Date} date - The date to get the day name for
     * @returns {String} The name of the day
     */
    function getDayName(date) {
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 
                    'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()];
    }

    /**
     * Gets abbreviated name of the day for a given date
     * @param {Date} date - The date to get the day name for
     * @returns {String} The abbreviated name of the day
     */
    function getShortDayName(date) {
        var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[date.getDay()];
    }

    /**
     * Formats a date as Month DD, YYYY
     * @param {Date} date - The date to format
     * @returns {String} The formatted date string
     */
    function formatDate(date) {
        var monthNames = ["January", "February", "March", "April", "May", "June", 
                        "July", "August", "September", "October", "November", "December"];
        return monthNames[date.getMonth()] + " " + date.getDate() + ", " + 
            date.getFullYear();
    }

    /**
     * Formats a date as MM/DD/YYYY
     * @param {Date} date - The date to format
     * @returns {String} The formatted date string
     */
    function formatShortDate(date) {
        return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
    }

    /**
     * Pads a number with leading zeros
     * @param {Number} num - The number to pad
     * @returns {String} The padded number as a string
     */
    function padZero(num) {
        return (num < 10) ? "0" + num : String(num);
    }

    /**
     * A utility function to apply text formatting consistently
     * @param {Text} textObj - The text object to format
     * @param {String} fontName - The font to apply
     * @param {String} fontColor - The color to apply
     */
    function applyTextFormatting(textObj, fontName, fontColor) {
        if (!textObj) return;
        
        try {
            // Apply font
            textObj.appliedFont = fontName;
            
            // Apply color with proper handling
            try {
                if (fontColor === "Black") {
                    textObj.fillColor = "Black";
                } else if (fontColor === "Paper") {
                    textObj.fillColor = "Paper";
                } else {
                    // Try to use the color name directly
                    textObj.fillColor = fontColor;
                }
            } catch (e) {
                // Default to Black if there's any error
                textObj.fillColor = "Black";
            }
        } catch (e) {
            // Silent error handling - don't stop the script for styling issues
        }
    }

    /**
     * A utility function to properly set up text frame properties for vertical centering
     * @param {TextFrame} frame - The text frame to set up
     */
    function setupTextFrame(frame) {
        if (!frame) return;
        
        try {
            // Set properties that help with vertical centering
            frame.textFramePreferences.firstBaselineOffset = FirstBaseline.CAP_HEIGHT;
            frame.textFramePreferences.verticalJustification = VerticalJustification.CENTER_ALIGN;
        } catch (e) {
            // Silent error handling
        }
    }
    
    /**
     * Creates a text frame with proper formatting
     * @param {Page} page - The page to create the frame on
     * @param {Array} bounds - Geometric bounds [y1, x1, y2, x2]
     * @param {String} content - Text content
     * @param {String} fontName - Font to apply
     * @param {String} fontColor - Color to apply
     * @param {Object} options - Additional options (justification, pointSize, etc.)
     * @returns {TextFrame} The created text frame
     */
    function createFormattedTextFrame(page, bounds, content, fontName, fontColor, options) {
        options = options || {};
        
        try {
            // Create the text frame
            var textFrame = page.textFrames.add({
                geometricBounds: bounds,
                contents: content
            });
            
            // Apply basic formatting
            applyTextFormatting(textFrame.texts[0], fontName, fontColor);
            
            // Set up frame properties
            setupTextFrame(textFrame);
            
            // Apply additional formatting if provided
            if (options.justification) {
                textFrame.texts[0].justification = options.justification;
            }
            
            if (options.pointSize) {
                textFrame.texts[0].pointSize = options.pointSize;
            }
            
            if (options.fontStyle) {
                try {
                    textFrame.texts[0].fontStyle = options.fontStyle;
                } catch (e) {
                    // Font style not available, continue without it
                }
            }
            
            return textFrame;
        } catch (e) {
            throw new Error("Failed to create text frame: " + e.message);
        }
    }
    
    /**
     * Gets the first day of the month
     * @param {Date} date - Any date in the month
     * @returns {Date} First day of the month
     */
    function getFirstDayOfMonth(date) {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    }
    
    /**
     * Gets the last day of the month
     * @param {Date} date - Any date in the month
     * @returns {Date} Last day of the month
     */
    function getLastDayOfMonth(date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }
    
    /**
     * Checks if two dates are the same day
     * @param {Date} date1 - First date
     * @param {Date} date2 - Second date
     * @returns {Boolean} True if dates represent the same day
     */
    function isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }
    
    /**
     * Gets an array of days in the week containing the specified date
     * @param {Date} date - A date in the week
     * @param {Boolean} startWithMonday - If true, weeks start on Monday; otherwise Sunday
     * @returns {Array} Array of Date objects for the week
     */
    function getDaysInWeek(date, startWithMonday) {
        var result = [];
        var dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        // Adjust for week starting with Monday if needed
        if (startWithMonday && dayOfWeek === 0) {
            dayOfWeek = 7; // Treat Sunday as day 7 if weeks start with Monday
        }
        
        // Find the first day of the week
        var firstDayOfWeek = new Date(date);
        var dayToSubtract = startWithMonday ? dayOfWeek - 1 : dayOfWeek;
        firstDayOfWeek.setDate(date.getDate() - dayToSubtract);
        
        // Add all days of the week
        for (var i = 0; i < 7; i++) {
            var currentDay = new Date(firstDayOfWeek);
            currentDay.setDate(firstDayOfWeek.getDate() + i);
            result.push(currentDay);
        }
        
        return result;
    }
    
    /**
     * Creates a line on the page
     * @param {Page} page - The page to add the line to
     * @param {Array} startPoint - Start point [x, y]
     * @param {Array} endPoint - End point [x, y]
     * @param {Object} options - Line options (strokeWeight, strokeColor, strokeType, strokeTint)
     * @returns {GraphicLine} The created line
     */
    function createLine(page, startPoint, endPoint, options) {
        options = options || {};
        
        try {
            var line = page.graphicLines.add({
                strokeWeight: options.strokeWeight || 0.5,
                strokeColor: options.strokeColor || "Black",
                strokeType: options.strokeType || "Solid",
                strokeTint: options.strokeTint !== undefined ? options.strokeTint : 100
            });
            
            line.paths.item(0).entirePath = [startPoint, endPoint];
            return line;
        } catch (e) {
            throw new Error("Failed to create line: " + e.message);
        }
    }
    
    /**
     * Cleans up temporary files created by the script
     * @param {File|Array} files - File or array of files to clean up
     */
    function cleanupTempFiles(files) {
        if (!files) return;
        
        if (files instanceof File) {
            // Single file
            try {
                if (files.exists) {
                    files.remove();
                }
            } catch (e) {
                $.writeln("Warning: Could not remove temp file: " + e.message);
            }
        } else if (files instanceof Array) {
            // Array of files
            for (var i = 0; i < files.length; i++) {
                if (files[i] instanceof File) {
                    try {
                        if (files[i].exists) {
                            files[i].remove();
                        }
                    } catch (e) {
                        $.writeln("Warning: Could not remove temp file: " + e.message);
                    }
                }
            }
        }
    }
    
    /**
     * Gets the dates for a month
     * @param {Date} monthDate - Any date in the month
     * @returns {Object} Month information including all dates
     */
    function getMonthDates(monthDate) {
        // First day of the month
        var firstDay = getFirstDayOfMonth(monthDate);
        
        // Last day of the month
        var lastDay = getLastDayOfMonth(monthDate);
        
        // Calculate previous month dates to show
        var prevMonthDays = firstDay.getDay(); // How many days from previous month to show
        
        // Get the last date of previous month
        var prevMonthLastDate = new Date(firstDay);
        prevMonthLastDate.setDate(0); // Last day of previous month
        
        // Calculate total days in this month
        var daysInMonth = lastDay.getDate();
        
        // Determine how many days from next month to show
        // We need enough days to fill a 6-row calendar (42 days)
        var nextMonthDays = 42 - (prevMonthDays + daysInMonth);
        if (nextMonthDays > 7) {
            // If we would show more than 7 days from next month,
            // reduce rows to 5 (35 days)
            nextMonthDays = 35 - (prevMonthDays + daysInMonth);
        }
        
        // Create arrays of dates
        var prevMonthDates = [];
        var currentMonthDates = [];
        var nextMonthDates = [];
        
        // Fill previous month dates
        for (var i = prevMonthDays - 1; i >= 0; i--) {
            var prevDate = new Date(firstDay);
            prevDate.setDate(prevDate.getDate() - (i + 1));
            prevMonthDates.push(prevDate);
        }
        
        // Fill current month dates
        for (var i = 1; i <= daysInMonth; i++) {
            var currentDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), i);
            currentMonthDates.push(currentDate);
        }
        
        // Fill next month dates
        for (var i = 1; i <= nextMonthDays; i++) {
            var nextDate = new Date(lastDay);
            nextDate.setDate(nextDate.getDate() + i);
            nextMonthDates.push(nextDate);
        }
        
        return {
            monthYear: monthDate.getFullYear(),
            monthNumber: monthDate.getMonth(),
            firstDay: firstDay,
            lastDay: lastDay,
            prevMonthDates: prevMonthDates,
            currentMonthDates: currentMonthDates,
            nextMonthDates: nextMonthDates,
            totalDaysInMonth: daysInMonth,
            firstDayOfWeek: firstDay.getDay(),
            rows: Math.ceil((prevMonthDays + daysInMonth + nextMonthDays) / 7)
        };
    }
    
    /**
     * Makes a rectangle on the page
     * @param {Page} page - The page to add the rectangle to
     * @param {Array} bounds - Rectangle bounds [y1, x1, y2, x2]
     * @param {Object} options - Rectangle options (fillColor, strokeColor, strokeWeight)
     * @returns {Rectangle} The created rectangle
     */
    function createRectangle(page, bounds, options) {
        options = options || {};
        
        try {
            var rect = page.rectangles.add({
                geometricBounds: bounds,
                fillColor: options.fillColor || "None",
                strokeColor: options.strokeColor || "None",
                strokeWeight: options.strokeWeight || 0
            });
            
            if (options.fillTint !== undefined) {
                rect.fillTint = options.fillTint;
            }
            
            if (options.strokeTint !== undefined) {
                rect.strokeTint = options.strokeTint;
            }
            
            return rect;
        } catch (e) {
            throw new Error("Failed to create rectangle: " + e.message);
        }
    }
    
    // Return public interface
    return {
        getWeekNumber: getWeekNumber,
        getDayName: getDayName,
        getShortDayName: getShortDayName,
        formatDate: formatDate,
        formatShortDate: formatShortDate,
        padZero: padZero,
        applyTextFormatting: applyTextFormatting,
        setupTextFrame: setupTextFrame,
        createFormattedTextFrame: createFormattedTextFrame,
        getFirstDayOfMonth: getFirstDayOfMonth,
        getLastDayOfMonth: getLastDayOfMonth,
        isSameDay: isSameDay,
        getDaysInWeek: getDaysInWeek,
        createLine: createLine,
        cleanupTempFiles: cleanupTempFiles,
        getMonthDates: getMonthDates,
        createRectangle: createRectangle
    };
})();