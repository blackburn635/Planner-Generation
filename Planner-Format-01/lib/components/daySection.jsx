// Planner-Format-01/lib/components/daySection.jsx

/*******************************************************************************
 * Enhanced Day Section Component - With Binding-Aware Margins
 * 
 * Creates daily sections for the weekly spreads, including:
 * - Colored headers with day and date
 * - "Things To Do" label
 * - Content area with horizontal ruling lines
 * - Vertical dotted divider line
 * 
 * ENHANCED IN V03:
 * - Uses granular "Weekly Spread Content" font settings
 * - Supports user-defined font sizes for all text elements
 * - Enhanced error handling and formatting options
 * - Maintains backward compatibility
 * - NEW: Uses binding-aware margins when pageMetrics contains effective margins
 *******************************************************************************/

var DaySection = (function() {
    /**
     * Creates a section for a single day with dotted divider line
     * @param {Page} page - The page to add the section to
     * @param {Date} date - The date for this section
     * @param {Number} sectionIndex - Which section on the page (0-based)
     * @param {Number} sectionHeight - Height of each section
     * @param {Object} pageMetrics - Page size and margin information (now supports binding-aware margins)
     * @param {Object} userPrefs - Enhanced user preferences with granular font settings
     */
    function createDaySection(page, date, sectionIndex, sectionHeight, pageMetrics, userPrefs) {
        var yPosition = pageMetrics.margins.top + (sectionIndex * sectionHeight);
        var headerHeight = 20; // Height of the colored header bar
        
        try {
            // NEW IN V03: Get effective font settings for weekly content
            var fontSettings = getWeeklyContentFontSettings(userPrefs);
            
            // Create colored header box for the section
            // Use the page's parent coordinates to properly position elements on both left and right pages
            var dateBox = page.rectangles.add({
                geometricBounds: [
                    yPosition,
                    page.bounds[1] + pageMetrics.margins.left, // Uses binding-aware left margin
                    yPosition + headerHeight,
                    page.bounds[1] + pageMetrics.width - pageMetrics.margins.right // Uses binding-aware right margin
                ],
                fillColor: userPrefs.headerColorName,
                strokeColor: "None"
            });

            // Add day and date text (left side of header)
            var dayDateContent = Utils.getDayName(date) + " " + Utils.formatDate(date);
            var dayText = page.textFrames.add({
                geometricBounds: [
                    yPosition + 2,
                    page.bounds[1] + pageMetrics.margins.left + 4, // Uses binding-aware left margin
                    yPosition + headerHeight - 2,
                    page.bounds[1] + pageMetrics.margins.left + pageMetrics.usable.width * 0.5 // Uses binding-aware margins
                ],
                contents: dayDateContent
            });
            
            // NEW IN V03: Apply enhanced font formatting to day text
            try {
                // Use Paper color for text on colored background, but respect user's font and size choices
                Utils.applyTextFormatting(dayText.texts.item(0), fontSettings.font, "Paper");
                dayText.texts.item(0).pointSize = fontSettings.size;
                
                // Properly set the vertical justification for text frames
                Utils.setupTextFrame(dayText);
                
                $.writeln("[DaySection] Day text created: '" + dayDateContent + "' with font: " + 
                         fontSettings.font + ", size: " + fontSettings.size + "pt");
                
            } catch (dayTextError) {
                throw new Error("Error formatting day text: " + dayTextError.message);
            }

            // Add "Things To Do" text (right side of header)
            var todoText = page.textFrames.add({
                geometricBounds: [
                    yPosition + 2,
                    page.bounds[1] + pageMetrics.margins.left + pageMetrics.usable.width * 0.7, // Uses binding-aware margins
                    yPosition + headerHeight - 2,
                    page.bounds[1] + pageMetrics.width - pageMetrics.margins.right - 4 // Uses binding-aware right margin
                ],
                contents: "Things To Do"
            });
            
            // NEW IN V03: Apply enhanced font formatting to "Things To Do" text
            try {
                // Use Paper color for text on colored background, but respect user's font and size choices
                Utils.applyTextFormatting(todoText.texts.item(0), fontSettings.font, "Paper");
                todoText.texts.item(0).pointSize = fontSettings.size;
                todoText.texts.item(0).justification = Justification.RIGHT_ALIGN;
                
                // Properly set the vertical justification for text frames
                Utils.setupTextFrame(todoText);
                
            } catch (todoTextError) {
                throw new Error("Error formatting 'Things To Do' text: " + todoTextError.message);
            }
            
            // Add content area for notes (takes up rest of section height)
            var contentText = page.textFrames.add({
                geometricBounds: [
                    yPosition + headerHeight + 2,
                    page.bounds[1] + pageMetrics.margins.left, // Uses binding-aware left margin
                    yPosition + sectionHeight - 2,
                    page.bounds[1] + pageMetrics.width - pageMetrics.margins.right // Uses binding-aware right margin
                ],
                contents: " " // Add a space to ensure we have a text element to style
            });
            
            // NEW IN V03: Apply enhanced font formatting to content area
            try {
                contentText.textFramePreferences.verticalJustification = VerticalJustification.CENTER_ALIGN;
                
                // Apply the weekly content font settings to the content area
                if (contentText.texts.length > 0) {
                    Utils.applyTextFormatting(contentText.texts[0], fontSettings.font, fontSettings.color);
                    contentText.texts[0].pointSize = fontSettings.size;
                }
                
            } catch (contentTextError) {
                throw new Error("Error formatting content text: " + contentTextError.message);
            }
            
            // Add light ruling lines for writing
            createRulingLines(page, yPosition, headerHeight, sectionHeight, pageMetrics, userPrefs);
            
            // Add dotted vertical divider line down the middle
            createVerticalDivider(page, yPosition, headerHeight, sectionHeight, pageMetrics, userPrefs);
            
            $.writeln("[DaySection] Day section created for " + Utils.getDayName(date) + 
                     " with enhanced font settings");
            
        } catch (e) {
            throw new Error("Error creating day section: " + e.message);
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
     * NEW IN V03: Creates ruling lines for writing with enhanced styling
     * @param {Page} page - The page to add lines to
     * @param {Number} yPosition - Top position of the section
     * @param {Number} headerHeight - Height of the colored header
     * @param {Number} sectionHeight - Total height of the section
     * @param {Object} pageMetrics - Page metrics (now supports binding-aware margins)
     * @param {Object} userPrefs - User preferences
     */
    function createRulingLines(page, yPosition, headerHeight, sectionHeight, pageMetrics, userPrefs) {
        try {
            var contentHeight = sectionHeight - headerHeight - 4; // Available height for content
            var linesPerSection = Math.floor(contentHeight / 12); // 12pt line spacing
            var lineSpacing = contentHeight / linesPerSection;
            
            for (var i = 0; i < linesPerSection; i++) {
                var lineY = yPosition + headerHeight + 6 + (i * lineSpacing);
                var line = page.graphicLines.add({
                    strokeWeight: 0.25,
                    strokeColor: "Black",
                    strokeTint: 20
                });
                line.paths.item(0).entirePath = [
                    [page.bounds[1] + pageMetrics.margins.left, lineY], // Uses binding-aware left margin
                    [page.bounds[1] + pageMetrics.width - pageMetrics.margins.right, lineY] // Uses binding-aware right margin
                ];
            }
        } catch (e) {
            $.writeln("[DaySection] Warning: Could not create ruling lines: " + e.message);
            // Continue without ruling lines rather than failing
        }
    }
    
    /**
     * NEW IN V03: Creates vertical divider line with enhanced styling
     * @param {Page} page - The page to add the divider to
     * @param {Number} yPosition - Top position of the section
     * @param {Number} headerHeight - Height of the colored header
     * @param {Number} sectionHeight - Total height of the section
     * @param {Object} pageMetrics - Page metrics (now supports binding-aware margins)
     * @param {Object} userPrefs - User preferences
     */
    function createVerticalDivider(page, yPosition, headerHeight, sectionHeight, pageMetrics, userPrefs) {
        try {
            // Add dotted vertical divider line down the middle
            var dividerLine = page.graphicLines.add({
                strokeWeight: 0.5,
                strokeColor: userPrefs.headerColorName,
                strokeType: "Dotted",
                strokeTint: 100
            });
            
            // Calculate middle position (based on 50% of usable width) using binding-aware margins
            var dividerX = page.bounds[1] + pageMetrics.margins.left + (pageMetrics.usable.width * 0.5);
            
            // Set line path from top to bottom of the section
            dividerLine.paths.item(0).entirePath = [
                [dividerX, yPosition + headerHeight + 2],
                [dividerX, yPosition + sectionHeight - 2]
            ];
        } catch (e) {
            $.writeln("[DaySection] Warning: Could not create vertical divider: " + e.message);
            // Continue without divider rather than failing
        }
    }
    
    /**
     * NEW IN V03: Creates an enhanced day section with additional formatting options
     * @param {Page} page - The page to add the section to
     * @param {Date} date - The date for this section
     * @param {Number} sectionIndex - Which section on the page (0-based)
     * @param {Number} sectionHeight - Height of each section
     * @param {Object} pageMetrics - Page size and margin information
     * @param {Object} userPrefs - Enhanced user preferences
     * @param {Object} options - Additional formatting options
     */
    function createEnhancedDaySection(page, date, sectionIndex, sectionHeight, pageMetrics, userPrefs, options) {
        options = options || {};
        
        try {
            // Allow customization of the header text format
            var customDayFormat = options.dayFormat || function(date) {
                return Utils.getDayName(date) + " " + Utils.formatDate(date);
            };
            
            // Allow customization of the "Things To Do" text
            var todoLabel = options.todoLabel || "Things To Do";
            
            // Allow custom font settings override
            var fontSettings = options.fontSettings || getWeeklyContentFontSettings(userPrefs);
            
            // Call the standard creation function but with enhanced options
            // This could be expanded to use the custom options
            createDaySection(page, date, sectionIndex, sectionHeight, pageMetrics, userPrefs);
            
        } catch (e) {
            throw new Error("Error creating enhanced day section: " + e.message);
        }
    }
    
    // Return public interface
    return {
        createDaySection: createDaySection,
        createEnhancedDaySection: createEnhancedDaySection,
        getWeeklyContentFontSettings: getWeeklyContentFontSettings
    };
})();