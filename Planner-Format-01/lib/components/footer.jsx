// Planner-Format-01/lib/components/footer.jsx

/*******************************************************************************
 * Enhanced Footer Component - Simplified Binding-Aware Support
 * 
 * Creates footers for the weekly spreads, including:
 * - Week number display
 * - Month and year display for monthly spreads
 * - Integration with QR codes
 * 
 * ENHANCED IN V03:
 * - Uses "Page Title Headers" font settings but reduced by 2 points
 * - Maintains visual hierarchy with headers while ensuring consistency
 * - Enhanced error handling and formatting options
 * - Supports user-defined font sizes with automatic reduction
 * - FIXED: Simple binding-aware margin support
 *******************************************************************************/

var Footer = (function() {
    /**
     * Creates the footer showing the week number and inserts QR codes
     * @param {Page} leftPage - Left page of the spread
     * @param {Page} rightPage - Right page of the spread
     * @param {Number} weekNumber - Current week number
     * @param {Object} leftPageMetrics - Page metrics for left page (binding-aware)
     * @param {Object} rightPageMetrics - Page metrics for right page (binding-aware) 
     * @param {Object} userPrefs - Enhanced user preferences with granular font settings
     * @param {Date} startDate - Start date of the week
     * @param {Date} endDate - End date of the week
     */
    function createWeekFooter(leftPage, rightPage, weekNumber, leftPageMetrics, rightPageMetrics, userPrefs, startDate, endDate) {
        // Handle both old signature (with single pageMetrics) and new signature
        if (arguments.length === 7 && typeof leftPageMetrics === 'object' && !leftPageMetrics.margins) {
            // Old signature: (leftPage, rightPage, weekNumber, pageMetrics, userPrefs, startDate, endDate)
            var pageMetrics = leftPageMetrics;  // 4th argument is actually pageMetrics
            userPrefs = rightPageMetrics;       // 5th argument is actually userPrefs
            startDate = arguments[5];
            endDate = arguments[6];
            
            // Use same metrics for both pages
            leftPageMetrics = pageMetrics;
            rightPageMetrics = pageMetrics;
        }
        
        try {
            // Check if required arguments are provided
            if (!leftPage || !rightPage || !leftPageMetrics || !userPrefs || !startDate || !endDate) {
                throw new Error("Invalid arguments: One or more required parameters are undefined.");
            }
    
            // NEW IN V03: Get footer font settings (header font but 2 points smaller)
            var footerFontSettings = getFooterFontSettings(userPrefs);
            
            var leftFooterY = leftPageMetrics.height - leftPageMetrics.margins.bottom;
            var rightFooterY = rightPageMetrics.height - rightPageMetrics.margins.bottom;
            var weekText = "Week " + weekNumber;
    
            // Add week number to left page footer - LEFT JUSTIFIED (using left page metrics)
            var leftFooter = leftPage.textFrames.add({
                geometricBounds: [
                    leftFooterY + 2,  // Smaller gap (was +5)
                    leftPage.bounds[1] + leftPageMetrics.margins.left, // Uses binding-aware left margin
                    leftFooterY + 20, // Shorter height (was +25)
                    leftPage.bounds[1] + leftPageMetrics.width - leftPageMetrics.margins.right // Uses binding-aware right margin
                ],
                contents: weekText
            });
    
            // NEW IN V03: Apply enhanced footer font formatting
            try {
                Utils.applyTextFormatting(leftFooter.texts.item(0), footerFontSettings.font, footerFontSettings.color);
                leftFooter.texts.item(0).pointSize = footerFontSettings.size;
                leftFooter.texts.item(0).justification = Justification.LEFT_ALIGN;
                Utils.setupTextFrame(leftFooter);
                
                $.writeln("[Footer] Left week footer created: '" + weekText + "' with font: " + 
                         footerFontSettings.font + ", size: " + footerFontSettings.size + "pt");
                
            } catch (leftFormatError) {
                throw new Error("Error formatting left week footer: " + leftFormatError.message);
            }
    
            // Add week number to right page footer - RIGHT JUSTIFIED (using right page metrics)
            var rightFooter = rightPage.textFrames.add({
                geometricBounds: [
                    rightFooterY + 2,  // Smaller gap (was +5)
                    rightPage.bounds[1] + rightPageMetrics.margins.left, // Uses binding-aware left margin
                    rightFooterY + 20, // Shorter height (was +25)
                    rightPage.bounds[1] + rightPageMetrics.width - rightPageMetrics.margins.right // Uses binding-aware right margin
                ],
                contents: weekText
            });
    
            // NEW IN V03: Apply enhanced footer font formatting
            try {
                Utils.applyTextFormatting(rightFooter.texts.item(0), footerFontSettings.font, footerFontSettings.color);
                rightFooter.texts.item(0).pointSize = footerFontSettings.size;
                rightFooter.texts.item(0).justification = Justification.RIGHT_ALIGN;
                Utils.setupTextFrame(rightFooter);
                
                $.writeln("[Footer] Right week footer created: '" + weekText + "' with font: " + 
                         footerFontSettings.font + ", size: " + footerFontSettings.size + "pt");
                
            } catch (rightFormatError) {
                throw new Error("Error formatting right week footer: " + rightFormatError.message);
            }
    
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
     * @param {Object} leftPageMetrics - Page metrics for left page (binding-aware)
     * @param {Object} rightPageMetrics - Page metrics for right page (binding-aware)
     * @param {Object} userPrefs - Enhanced user preferences with granular font settings
     */
    function createMonthFooter(leftPage, rightPage, monthDate, leftPageMetrics, rightPageMetrics, userPrefs) {
        // Handle both old signature (with single pageMetrics) and new signature
        if (arguments.length === 5 && typeof leftPageMetrics === 'object' && !leftPageMetrics.margins) {
            // Old signature: (leftPage, rightPage, monthDate, pageMetrics, userPrefs)
            var pageMetrics = leftPageMetrics;  // 4th argument is actually pageMetrics
            userPrefs = rightPageMetrics;       // 5th argument is actually userPrefs
            
            // Use same metrics for both pages
            leftPageMetrics = pageMetrics;
            rightPageMetrics = pageMetrics;
        }
        
        try {
            // NEW IN V03: Get footer font settings (header font but 2 points smaller)
            var footerFontSettings = getFooterFontSettings(userPrefs);
            
            var leftFooterY = leftPageMetrics.height - leftPageMetrics.margins.bottom;
            var rightFooterY = rightPageMetrics.height - rightPageMetrics.margins.bottom;
            var monthNames = ["January", "February", "March", "April", "May", "June", 
                              "July", "August", "September", "October", "November", "December"];
            var monthName = monthNames[monthDate.getMonth()];
            var footerText = monthName + " " + monthDate.getFullYear();
            
            // Add month name to left page footer - LEFT JUSTIFIED (using left page metrics)
            var leftFooter = leftPage.textFrames.add({
                geometricBounds: [
                    leftFooterY + 5,  // Adjust position to be below content area
                    leftPage.bounds[1] + leftPageMetrics.margins.left, // Uses binding-aware left margin
                    leftFooterY + 25,
                    leftPage.bounds[1] + leftPageMetrics.width - leftPageMetrics.margins.right // Uses binding-aware right margin
                ],
                contents: footerText
            });

            // NEW IN V03: Apply enhanced footer font formatting
            try {
                Utils.applyTextFormatting(leftFooter.texts.item(0), footerFontSettings.font, footerFontSettings.color);
                leftFooter.texts.item(0).pointSize = footerFontSettings.size;
                leftFooter.texts.item(0).justification = Justification.LEFT_ALIGN;
                Utils.setupTextFrame(leftFooter);
                
            } catch (leftFormatError) {
                throw new Error("Error formatting left month footer: " + leftFormatError.message);
            }

            // Add month name to right page footer - RIGHT JUSTIFIED (using right page metrics)
            var rightFooter = rightPage.textFrames.add({
                geometricBounds: [
                    rightFooterY + 5,  // Adjust position to be below content area
                    rightPage.bounds[1] + rightPageMetrics.margins.left, // Uses binding-aware left margin
                    rightFooterY + 25,
                    rightPage.bounds[1] + rightPageMetrics.width - rightPageMetrics.margins.right // Uses binding-aware right margin
                ],
                contents: footerText
            });

            // NEW IN V03: Apply enhanced footer font formatting
            try {
                Utils.applyTextFormatting(rightFooter.texts.item(0), footerFontSettings.font, footerFontSettings.color);
                rightFooter.texts.item(0).pointSize = footerFontSettings.size;
                rightFooter.texts.item(0).justification = Justification.RIGHT_ALIGN;
                Utils.setupTextFrame(rightFooter);
                
            } catch (rightFormatError) {
                throw new Error("Error formatting right month footer: " + rightFormatError.message);
            }
            
            $.writeln("[Footer] Month footers created for " + footerText + 
                     " with font: " + footerFontSettings.font + ", size: " + footerFontSettings.size + "pt");
            
        } catch (e) {
            throw new Error("Error creating month footer: " + e.message);
        }
    }
    
    /**
     * NEW IN V03: Get effective font settings for footers (header font but 2 points smaller)
     * @param {Object} userPrefs - Enhanced user preferences
     * @returns {Object} Object with font, color, and size properties
     */
    function getFooterFontSettings(userPrefs) {
        // Use the same font and color as page title headers
        var headerFont = userPrefs.pageTitleFont || userPrefs.titleFont || "Minion Pro";
        var headerColor = userPrefs.pageTitleColor || userPrefs.titleFontColor || "Black";
        var headerSize = userPrefs.pageTitleSize || 18; // Default page title size
        
        // Reduce size by 2 points for footer hierarchy
        var footerSize = Math.max(6, headerSize - 2); // Minimum 6pt, but typically headerSize - 2
        
        return {
            font: headerFont,
            color: headerColor,
            size: footerSize
        };
    }
    
    /**
     * NEW IN V03: Creates an enhanced footer with additional formatting options
     * @param {Page} page - The page to add the footer to
     * @param {String} content - The text content for the footer
     * @param {Array} bounds - Geometric bounds for the footer [y1, x1, y2, x2]
     * @param {Object} userPrefs - Enhanced user preferences
     * @param {Object} options - Additional formatting options
     * @returns {TextFrame} The created footer text frame
     */
    function createEnhancedFooter(page, content, bounds, userPrefs, options) {
        options = options || {};
        
        try {
            var footerText = page.textFrames.add({
                geometricBounds: bounds,
                contents: content
            });
            
            // Get effective font settings
            var fontSettings = getFooterFontSettings(userPrefs);
            
            // Allow options to override the calculated settings
            if (options.fontSize) {
                fontSettings.size = options.fontSize;
            }
            if (options.fontColor) {
                fontSettings.color = options.fontColor;
            }
            if (options.fontFamily) {
                fontSettings.font = options.fontFamily;
            }
            
            // Apply formatting
            Utils.applyTextFormatting(footerText.texts.item(0), fontSettings.font, fontSettings.color);
            footerText.texts.item(0).pointSize = fontSettings.size;
            footerText.texts.item(0).justification = options.justification || Justification.LEFT_ALIGN;
            
            Utils.setupTextFrame(footerText);
            
            return footerText;
            
        } catch (e) {
            throw new Error("Error creating enhanced footer: " + e.message);
        }
    }
    
    /**
     * NEW IN V03: Helper function to calculate footer size based on header size
     * @param {Object} userPrefs - Enhanced user preferences
     * @param {Number} sizeReduction - Points to reduce from header size (default: 2)
     * @returns {Number} The calculated footer font size
     */
    function calculateFooterSize(userPrefs, sizeReduction) {
        sizeReduction = sizeReduction || 2;
        var headerSize = userPrefs.pageTitleSize || 18;
        return Math.max(6, headerSize - sizeReduction); // Minimum 6pt font size
    }
    
    // Return public interface
    return {
        createWeekFooter: createWeekFooter,
        createMonthFooter: createMonthFooter,
        createEnhancedFooter: createEnhancedFooter,
        getFooterFontSettings: getFooterFontSettings,
        calculateFooterSize: calculateFooterSize
    };
})();