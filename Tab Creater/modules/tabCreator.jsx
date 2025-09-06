/*******************************************************************************
 * Tab Creator Module
 * 
 * Handles the creation of monthly tabs:
 * - Creates master page spreads for each month
 * - Creates front and back tabs with correct positioning
 * - Applies formatting and text to tabs
 *******************************************************************************/

var TabCreator = (function() {
    // Month names array
    var monthNames = ["January", "February", "March", "April", "May", "June", 
                     "July", "August", "September", "October", "November", "December"];
    
    /**
     * Creates master page spreads with monthly tabs
     * @param {Document} doc - The InDesign document
     * @param {Object} userPrefs - User preferences
     * @param {Array} tabColors - Array of color names for each month
     * @param {Number} tabHeight - Height of each tab
     */
    function createMonthlyTabs(doc, userPrefs, tabColors, tabHeight) {
        // Create text color
        var textColorName = TabColors.createTextColor(doc, userPrefs.fontColor);
        
        // Get document properties
        var pageWidth = doc.documentPreferences.pageWidth;
        var pageHeight = doc.documentPreferences.pageHeight;
        
        // Calculate tab positions (vertically distributed)
        var tabPositions = calculateTabPositions(pageHeight, userPrefs.tabMargin, tabHeight);
        
        // Create master spreads for each month
        for (var i = 0; i < 12; i++) {
            var prefix = String.fromCharCode(66 + i); // "B" to "M"
            var baseName = monthNames[i];
            var masterName = prefix + "-" + monthNames[i];
            
            // Check if master spread already exists
            var existingMaster = doc.masterSpreads.itemByName(masterName);
            if (existingMaster.isValid) {
                // If it exists, remove it so we can recreate it
                existingMaster.remove();
            }
            
            // Create a new master spread
            var masterSpread = doc.masterSpreads.add();
            try {
                // We need to set the name properly, not directly
                masterSpread.namePrefix = prefix;
                masterSpread.baseName = baseName;       
            } catch (e) {
                $.writeln("Warning: Could not set master name: " + e.message);
                // This is not critical, so we continue
            }
            
            // Ensure we have two pages in the spread
            while (masterSpread.pages.length < 2) {
                masterSpread.pages.add();
            }
            
            // Get the left and right pages in the spread - being careful with page order
            var leftPage, rightPage;
            
            // Master pages should be in order, but let's make sure by checking the side property
            if (masterSpread.pages.length === 2) {
                if (masterSpread.pages[0].side === PageSideOptions.LEFT_HAND) {
                    leftPage = masterSpread.pages[0];
                    rightPage = masterSpread.pages[1];
                } else {
                    leftPage = masterSpread.pages[1];
                    rightPage = masterSpread.pages[0];
                }
            } else {
                // If we don't have exactly 2 pages, add or remove as needed
                while (masterSpread.pages.length < 2) {
                    masterSpread.pages.add();
                }
                while (masterSpread.pages.length > 2) {
                    masterSpread.pages[masterSpread.pages.length-1].remove();
                }
                // Try again to get the pages
                leftPage = masterSpread.pages[0].side === PageSideOptions.LEFT_HAND ? 
                           masterSpread.pages[0] : masterSpread.pages[1];
                rightPage = masterSpread.pages[0].side === PageSideOptions.RIGHT_HAND ? 
                            masterSpread.pages[0] : masterSpread.pages[1];
            }
            
            // Calculate the tab position for this month
            var tabTop = tabPositions[i];
            
            // Create front tab (on right page)
            createFrontTab(rightPage, pageWidth, tabTop, tabHeight, userPrefs, tabColors[i], textColorName, monthNames[i]);
            
            // Create back tab (on left page)
            createBackTab(leftPage, pageWidth, tabTop, tabHeight, userPrefs, tabColors[i], textColorName, monthNames[i]);
        }
    }
    
    /**
     * Calculates vertical positions for tabs, evenly distributed
     * @param {Number} pageHeight - Height of the page
     * @param {Number} margin - Margin from top and bottom of page
     * @param {Number} tabHeight - Height of each tab
     * @returns {Array} Array of top positions for each tab
     */
    function calculateTabPositions(pageHeight, margin, tabHeight) {
        var positions = [];
        var availableHeight = pageHeight - (2 * margin);
        var spacing = (availableHeight - (12 * tabHeight)) / 11; // Space between tabs
        
        for (var i = 0; i < 12; i++) {
            var topPosition = margin + (i * (tabHeight + spacing));
            positions.push(topPosition);
        }
        
        return positions;
    }
    
    /**
     * Creates a front tab on the right page
     * @param {Page} page - The right page of the spread
     * @param {Number} pageWidth - Width of the page
     * @param {Number} tabTop - Top position of the tab
     * @param {Number} tabHeight - Height of the tab
     * @param {Object} userPrefs - User preferences
     * @param {String} tabColorName - Name of the color to use
     * @param {String} textColorName - Name of the text color
     * @param {String} monthName - Name of the month for this tab
     */
    function createFrontTab(page, pageWidth, tabTop, tabHeight, userPrefs, tabColorName, textColorName, monthName) {
        // Calculate tab position
        // For right page, tab extends from right edge of the page
        // Get actual page bounds
        var pageRight = page.bounds[3]; // Right edge
        var tabRight = pageRight; // Tab aligns with right edge of page
        var tabLeft = tabRight + userPrefs.tabWidth;
        var tabBottom = tabTop + tabHeight;
        
        // Create tab rectangle with rounded corners
        var tabRect = page.rectangles.add({
            geometricBounds: [tabTop, tabLeft, tabBottom, tabRight],
            fillColor: tabColorName,
            strokeColor: "None",
            cornerRadius: userPrefs.cornerRadius
        });
        // Set corner radius for only top-right and bottom-right
        tabRect.topLeftCornerOption = CornerOptions.NONE;
        tabRect.topRightCornerOption = CornerOptions.ROUNDED_CORNER;
        tabRect.bottomLeftCornerOption = CornerOptions.NONE;
        tabRect.bottomRightCornerOption = CornerOptions.ROUNDED_CORNER;

        // Apply the corner radius value
        tabRect.topRightCornerRadius = userPrefs.cornerRadius;
        tabRect.bottomRightCornerRadius = userPrefs.cornerRadius;

        //calculates the textbox to account for rotation-- the bottom left corner that serves as the pivot when rotated
        var textBoxTop = tabTop; // - userPrefs.tabWidth; 
        var textBoxLeft = tabRight + userPrefs.tabWidth;
        var textBoxBottom = tabTop + userPrefs.tabWidth;
        var textBoxRight = tabRight + userPrefs.tabWidth + tabHeight;


        // Add month name text
        var tabText = page.textFrames.add({
            geometricBounds: [textBoxTop,textBoxLeft,textBoxBottom, textBoxRight],
            contents: monthName
        });
        
        // Format text
        var text = tabText.texts[0];
        text.appliedFont = userPrefs.tabFont;
        text.pointSize = userPrefs.fontSize;
        text.fillColor = textColorName;
        text.justification = Justification.CENTER_ALIGN;
        
        // Set up vertical centering
        tabText.textFramePreferences.firstBaselineOffset = FirstBaseline.CAP_HEIGHT;
        tabText.textFramePreferences.verticalJustification = VerticalJustification.CENTER_ALIGN;
        
        // Rotate text 90 degrees (vertical text)
        tabText.rotationAngle = -90;
    }
    
    /**
     * Creates a back tab on the left page
     * @param {Page} page - The left page of the spread
     * @param {Number} pageWidth - Width of the page
     * @param {Number} tabTop - Top position of the tab
     * @param {Number} tabHeight - Height of the tab
     * @param {Object} userPrefs - User preferences
     * @param {String} tabColorName - Name of the color to use
     * @param {String} textColorName - Name of the text color
     * @param {String} monthName - Name of the month for this tab
     */
    function createBackTab(page, pageWidth, tabTop, tabHeight, userPrefs, tabColorName, textColorName, monthName) {
        // Calculate tab position
        // For left page, tab extends from left edge of the page
        // Get actual page bounds
        var pageLeft = page.bounds[1]; // Left edge
        var tabLeft = pageLeft - userPrefs.tabWidth; // Tab extends to the left
        var tabRight = pageLeft; // Tab aligns with left edge of page
        var tabBottom = tabTop + tabHeight;
        
        // Create tab rectangle with rounded corners
        var tabRect = page.rectangles.add({
            geometricBounds: [tabTop, tabLeft, tabBottom, tabRight],
            fillColor: tabColorName,
            strokeColor: "None",
            cornerRadius: userPrefs.cornerRadius
        });
        
        // Set corner radius for only top-right and bottom-right
        tabRect.topLeftCornerOption = CornerOptions.ROUNDED_CORNER;
        tabRect.topRightCornerOption = CornerOptions.NONE;
        tabRect.bottomLeftCornerOption = CornerOptions.ROUNDED_CORNER;
        tabRect.bottomRightCornerOption = CornerOptions.NONE;

        // Apply the corner radius value
        tabRect.topLeftCornerRadius = userPrefs.cornerRadius;
        tabRect.bottomLeftCornerRadius = userPrefs.cornerRadius;

        //calculates the textbox to account for rotation-- the bottom left corner that serves as the pivot when rotated
        var textBoxTop = tabBottom; 
        var textBoxLeft = pageLeft-userPrefs.tabWidth;
        var textBoxBottom = tabBottom + userPrefs.tabWidth;
        var textBoxRight = textBoxLeft + tabHeight;


        // Add month name text
        var tabText = page.textFrames.add({
            geometricBounds: [textBoxTop,textBoxLeft,textBoxBottom, textBoxRight],
            contents: monthName
        });
        
        // Format text
        var text = tabText.texts[0];
        text.appliedFont = userPrefs.tabFont;
        text.pointSize = userPrefs.fontSize;
        text.fillColor = textColorName;
        text.justification = Justification.CENTER_ALIGN;
        
        // Set up vertical centering
        tabText.textFramePreferences.firstBaselineOffset = FirstBaseline.CAP_HEIGHT;
        tabText.textFramePreferences.verticalJustification = VerticalJustification.CENTER_ALIGN;
        
        // Rotate text -90 degrees (vertical text in opposite direction)
        tabText.rotationAngle = 90;
    }
    
    // Return public interface
    return {
        createMonthlyTabs: createMonthlyTabs
    };
})();