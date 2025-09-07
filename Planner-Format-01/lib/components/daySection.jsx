/*******************************************************************************
 * Day Section Component
 * 
 * Creates daily sections for the weekly spreads, including:
 * - Colored headers with day and date
 * - "Things To Do" label
 * - Content area with horizontal ruling lines
 * - Vertical dotted divider line
 *******************************************************************************/

var DaySection = (function() {
    /**
     * Creates a section for a single day with dotted divider line
     * @param {Page} page - The page to add the section to
     * @param {Date} date - The date for this section
     * @param {Number} sectionIndex - Which section on the page (0-based)
     * @param {Number} sectionHeight - Height of each section
     * @param {Object} pageMetrics - Page size and margin information
     * @param {Object} userPrefs - User preferences for fonts and colors
     */
    function createDaySection(page, date, sectionIndex, sectionHeight, pageMetrics, userPrefs) {
        var yPosition = pageMetrics.margins.top + (sectionIndex * sectionHeight);
        var headerHeight = 20; // Height of the colored header bar
        
        try {
            // Create colored header box for the section
            // Use the page's parent coordinates to properly position elements on both left and right pages
            var dateBox = page.rectangles.add({
                geometricBounds: [
                    yPosition,
                    page.bounds[1] + pageMetrics.margins.left, // Use page bounds for correct x position
                    yPosition + headerHeight,
                    page.bounds[1] + pageMetrics.width - pageMetrics.margins.right
                ],
                fillColor: userPrefs.headerColorName,
                strokeColor: "None"
            });

            // Add day and date text (left side of header)
            var dayText = page.textFrames.add({
                geometricBounds: [
                    yPosition + 2,
                    page.bounds[1] + pageMetrics.margins.left + 4,
                    yPosition + headerHeight - 2,
                    page.bounds[1] + pageMetrics.margins.left + pageMetrics.usable.width * 0.5
                ],
                contents: Utils.getDayName(date) + " " + Utils.formatDate(date)
            });
            
            // Apply font selection to day text (Paper color for text on colored background)
            Utils.applyTextFormatting(dayText.texts.item(0), userPrefs.contentFont, "Paper");
            
            // Properly set the vertical justification for text frames
            Utils.setupTextFrame(dayText);

            // Add "Things To Do" text (right side of header)
            var todoText = page.textFrames.add({
                geometricBounds: [
                    yPosition + 2,
                    page.bounds[1] + pageMetrics.margins.left + pageMetrics.usable.width * 0.7,
                    yPosition + headerHeight - 2,
                    page.bounds[1] + pageMetrics.width - pageMetrics.margins.right - 4
                ],
                contents: "Things To Do"
            });
            
            // Apply font selection to "Things To Do" text (Paper color for text on colored background)
            Utils.applyTextFormatting(todoText.texts.item(0), userPrefs.contentFont, "Paper");
            
            // ADD THIS LINE: Right-justify the "Things To Do" text
            todoText.texts.item(0).justification = Justification.RIGHT_ALIGN;

            // Properly set the vertical justification for text frames
            Utils.setupTextFrame(todoText);
            
            // Add content area for notes (takes up rest of section height)
            var contentText = page.textFrames.add({
                geometricBounds: [
                    yPosition + headerHeight + 2,
                    page.bounds[1] + pageMetrics.margins.left,
                    yPosition + sectionHeight - 2,
                    page.bounds[1] + pageMetrics.width - pageMetrics.margins.right
                ],
                contents: " " // Add a space to ensure we have a text element to style
            });
            contentText.textFramePreferences.verticalJustification = VerticalJustification.CENTER_ALIGN;
            
            // Apply the font to the text content
            if (contentText.texts.length > 0) {
                Utils.applyTextFormatting(contentText.texts[0], userPrefs.contentFont, userPrefs.contentFontColor);
            }
            
            // Add light ruling lines for writing
            var linesPerSection = Math.floor((sectionHeight - headerHeight - 4) / 12); // 12pt line spacing
            var lineSpacing = (sectionHeight - headerHeight - 4) / linesPerSection;
            
            for (var i = 0; i < linesPerSection; i++) {
                var lineY = yPosition + headerHeight + 6 + (i * lineSpacing);
                var line = page.graphicLines.add({
                    strokeWeight: 0.25,
                    strokeColor: "Black",
                    strokeTint: 20
                });
                line.paths.item(0).entirePath = [
                    [page.bounds[1] + pageMetrics.margins.left, lineY],
                    [page.bounds[1] + pageMetrics.width - pageMetrics.margins.right, lineY]
                ];
            }
            
            // Add dotted vertical divider line down the middle
            var dividerLine = page.graphicLines.add({
                strokeWeight: 0.5,
                strokeColor: userPrefs.headerColorName,
                strokeType: "Dotted",
                strokeTint: 100
            });
            
            // Calculate middle position (based on 50% of usable width)
            var dividerX = page.bounds[1] + pageMetrics.margins.left + (pageMetrics.usable.width * 0.5);
            
            // Set line path from top to bottom of the section
            dividerLine.paths.item(0).entirePath = [
                [dividerX, yPosition + headerHeight + 2],
                [dividerX, yPosition + sectionHeight - 2]
            ];
            
        } catch (e) {
            throw new Error("Error creating day section: " + e.message);
        }
    }
    
    // Return public interface
    return {
        createDaySection: createDaySection
    };
})();