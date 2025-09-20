// Planner-Format-01/lib/components/header.jsx

/*******************************************************************************
 * Enhanced Header Component - With Binding-Aware Margins
 * 
 * Creates headers for weekly and monthly spreads, including:
 * - Week date range headers
 * - Monthly calendar headers with year display
 * 
 * ENHANCED IN V03:
 * - Uses granular "Page Title Headers" font settings
 * - Supports user-defined font sizes
 * - Maintains backward compatibility
 * - Enhanced error handling and formatting
 * - NEW: Supports binding-aware margins when pageMetrics contains effective margins
 *******************************************************************************/

var Header = (function() {
    /**
     * Creates the header showing the week's date range
     * @param {Page} page - The page to add the header to
     * @param {Date} startDate - First day of the week
     * @param {Date} endDate - Last day of the week
     * @param {Object} pageMetrics - Page size and margin information (now supports binding-aware margins)
     * @param {Object} userPrefs - Enhanced user preferences with granular font settings
     * @param {Justification} justification - Text justification for the header
     */
    function createWeekHeader(page, startDate, endDate, pageMetrics, userPrefs, justification) {
        try {
            var headerText = page.textFrames.add({
                geometricBounds: [
                    pageMetrics.margins.top - 20, // Move up to create space
                    page.bounds[1] + pageMetrics.margins.left, // Uses binding-aware left margin
                    pageMetrics.margins.top,
                    page.bounds[1] + pageMetrics.width - pageMetrics.margins.right // Uses binding-aware right margin
                ],
                contents: "Week of " + Utils.formatDate(startDate) + " - " + Utils.formatDate(endDate)
            });
            
            // Apply enhanced formatting using Page Title Headers settings
            try {
                // NEW IN V03: Use granular Page Title Headers font settings
                var font = userPrefs.pageTitleFont || userPrefs.titleFont || "Minion Pro";
                var color = userPrefs.pageTitleColor || userPrefs.titleFontColor || "Black";
                var size = userPrefs.pageTitleSize || 14; // Default to 14pt for week headers if not specified
                
                // Apply font and color
                Utils.applyTextFormatting(headerText.texts.item(0), font, color);
                
                // Apply point size
                headerText.texts.item(0).pointSize = size;
                
                // Apply center alignment
                headerText.texts.item(0).justification = justification || Justification.CENTER_ALIGN;
                
                // Try to apply bold formatting if available, otherwise skip it
                try {
                    headerText.texts.item(0).fontStyle = "Bold";
                } catch (styleError) {
                    // Font style not available, continue without changing style
                    $.writeln("[Header] Bold style not available for font: " + font);
                }
                
            } catch (formatError) {
                throw new Error("Error applying week header formatting: " + formatError.message);
            }
            
            // Set up text frame properties for proper vertical centering
            Utils.setupTextFrame(headerText);
            
            $.writeln("[Header] Week header created with font: " + 
                     (userPrefs.pageTitleFont || userPrefs.titleFont) + 
                     ", size: " + (userPrefs.pageTitleSize || 14) + "pt");
            
        } catch (e) {
            throw new Error("Error creating week header: " + e.message);
        }
    }
    
    /**
     * Creates headers for a monthly spread
     * @param {Page} leftPage - Left page of the spread
     * @param {Page} rightPage - Right page of the spread
     * @param {Date} monthDate - First day of the month
     * @param {Object} leftPageMetrics - Page size and margin information for left page (binding-aware)
     * @param {Object} rightPageMetrics - Page size and margin information for right page (binding-aware)
     * @param {Object} userPrefs - Enhanced user preferences with granular font settings
     */
    function createMonthHeader(leftPage, rightPage, monthDate, leftPageMetrics, rightPageMetrics, userPrefs) {
        // Handle both old and new function signatures for backward compatibility
        if (arguments.length === 5 && typeof leftPageMetrics === 'object' && !rightPageMetrics) {
            // Old signature: (leftPage, rightPage, monthDate, pageMetrics, userPrefs)
            rightPageMetrics = leftPageMetrics; // Use same metrics for both pages
            userPrefs = arguments[4];
        }
        
        try {
            var monthNames = ["January", "February", "March", "April", "May", "June", 
                              "July", "August", "September", "October", "November", "December"];
            var monthName = monthNames[monthDate.getMonth()];
            var yearText = monthDate.getFullYear().toString();
            var fullHeaderText = monthName + " " + yearText;
            
            // NEW IN V03: Use granular Page Title Headers font settings
            var font = userPrefs.pageTitleFont || userPrefs.titleFont || "Minion Pro";
            var color = userPrefs.pageTitleColor || userPrefs.titleFontColor || "Black";
            var size = userPrefs.pageTitleSize || 18; // Default to 18pt for month headers if not specified
            
            // Create month and year text centered on left page (using left page metrics)
            var leftMonthText = leftPage.textFrames.add({
                geometricBounds: [
                    leftPageMetrics.margins.top - 20,
                    leftPage.bounds[1] + leftPageMetrics.margins.left, // Uses binding-aware left margin
                    leftPageMetrics.margins.top,
                    leftPage.bounds[1] + leftPageMetrics.width - leftPageMetrics.margins.right // Uses binding-aware right margin
                ],
                contents: fullHeaderText
            });
            
            // Apply enhanced formatting to left page header
            try {
                Utils.applyTextFormatting(leftMonthText.texts.item(0), font, color);
                leftMonthText.texts.item(0).pointSize = size;
                leftMonthText.texts.item(0).justification = Justification.LEFT_ALIGN;
                
                // Try to apply bold formatting if available
                try {
                    leftMonthText.texts.item(0).fontStyle = "Bold";
                } catch (styleError) {
                    $.writeln("[Header] Bold style not available for font: " + font);
                }
                
                Utils.setupTextFrame(leftMonthText);
                
            } catch (leftFormatError) {
                throw new Error("Error formatting left month header: " + leftFormatError.message);
            }
            
            // Create month and year text centered on right page (using right page metrics)
            var rightMonthText = rightPage.textFrames.add({
                geometricBounds: [
                    rightPageMetrics.margins.top - 20,
                    rightPage.bounds[1] + rightPageMetrics.margins.left, // Uses binding-aware left margin
                    rightPageMetrics.margins.top,
                    rightPage.bounds[1] + rightPageMetrics.width - rightPageMetrics.margins.right // Uses binding-aware right margin
                ],
                contents: fullHeaderText
            });
            
            // Apply enhanced formatting to right page header
            try {
                Utils.applyTextFormatting(rightMonthText.texts.item(0), font, color);
                rightMonthText.texts.item(0).pointSize = size;
                rightMonthText.texts.item(0).justification = Justification.RIGHT_ALIGN;
                
                // Try to apply bold formatting if available
                try {
                    rightMonthText.texts.item(0).fontStyle = "Bold";
                } catch (styleError) {
                    $.writeln("[Header] Bold style not available for font: " + font);
                }
                
                Utils.setupTextFrame(rightMonthText);
                
            } catch (rightFormatError) {
                throw new Error("Error formatting right month header: " + rightFormatError.message);
            }
            
            $.writeln("[Header] Month headers created for " + fullHeaderText + 
                     " with font: " + font + ", size: " + size + "pt");
            
        } catch (e) {
            throw new Error("Error creating month header: " + e.message);
        }
    }
    
    /**
     * NEW IN V03: Helper function to get effective font settings with fallbacks
     * @param {Object} userPrefs - Enhanced user preferences
     * @param {String} defaultFont - Default font to use as final fallback
     * @param {String} defaultColor - Default color to use as final fallback
     * @param {Number} defaultSize - Default size to use as final fallback
     * @returns {Object} Object with font, color, and size properties
     */
    function getEffectiveFontSettings(userPrefs, defaultFont, defaultColor, defaultSize) {
        return {
            font: userPrefs.pageTitleFont || userPrefs.titleFont || defaultFont,
            color: userPrefs.pageTitleColor || userPrefs.titleFontColor || defaultColor,
            size: userPrefs.pageTitleSize || defaultSize
        };
    }
    
    /**
     * NEW IN V03: Creates a header with enhanced formatting options
     * @param {Page} page - The page to add the header to
     * @param {String} content - The text content for the header
     * @param {Array} bounds - Geometric bounds for the header [y1, x1, y2, x2]
     * @param {Object} userPrefs - Enhanced user preferences
     * @param {Object} options - Additional formatting options
     * @returns {TextFrame} The created header text frame
     */
    function createEnhancedHeader(page, content, bounds, userPrefs, options) {
        options = options || {};
        
        try {
            var headerText = page.textFrames.add({
                geometricBounds: bounds,
                contents: content
            });
            
            // Get effective font settings
            var fontSettings = getEffectiveFontSettings(
                userPrefs, 
                options.defaultFont || "Minion Pro",
                options.defaultColor || "Black",
                options.defaultSize || 16
            );
            
            // Apply formatting
            Utils.applyTextFormatting(headerText.texts.item(0), fontSettings.font, fontSettings.color);
            headerText.texts.item(0).pointSize = fontSettings.size;
            headerText.texts.item(0).justification = options.justification || Justification.CENTER_ALIGN;
            
            // Apply bold if requested and available
            if (options.bold !== false) { // Default to true unless explicitly set to false
                try {
                    headerText.texts.item(0).fontStyle = "Bold";
                } catch (styleError) {
                    $.writeln("[Header] Bold style not available for font: " + fontSettings.font);
                }
            }
            
            Utils.setupTextFrame(headerText);
            
            return headerText;
            
        } catch (e) {
            throw new Error("Error creating enhanced header: " + e.message);
        }
    }
    
    // Return public interface
    return {
        createWeekHeader: createWeekHeader,
        createMonthHeader: createMonthHeader,
        createEnhancedHeader: createEnhancedHeader,
        getEffectiveFontSettings: getEffectiveFontSettings
    };
})();