/*******************************************************************************
 * Tab Creator Module
 * 
 * Handles the creation of index tabs for the planner:
 * - Creates tabs with configurable dimensions and appearance
 * - Places tabs at appropriate positions along page edge
 * - Manages tab labels and text rotation
 *******************************************************************************/

var TabCreator = (function() {
    /**
     * Creates a tab on a page at a specific position
     * @param {Page} page - The page to add the tab to
     * @param {String} tabText - The text to display on the tab
     * @param {Number} tabPosition - Vertical position from 0 (top) to 1 (bottom)
     * @param {Object} tabPrefs - Tab preferences object
     * @param {Color} tabColor - The color to use for the tab
     * @param {Boolean} leftSide - Whether tab is on left side (otherwise right side)
     * @returns {PageItem} The created tab (polygon or group)
     */
    function createTab(page, tabText, tabPosition, tabPrefs, tabColor, leftSide) {
        // Ensure tabPrefs has default values
        tabPrefs = tabPrefs || {};
        var tabWidth = tabPrefs.tabWidth || 60;
        var tabIndent = tabPrefs.tabIndent || 0;
        var tabAngle = tabPrefs.tabAngle || 15;
        var cornerRadius = tabPrefs.cornerRadius || 0;
        var fontSize = tabPrefs.fontSize || 10;
        var textRotation = tabPrefs.textRotation || 90;
        var textColor = tabPrefs.textColor || "Paper";
        var tabFont = tabPrefs.tabFont || "Minion Pro";
        
        // Default to right side if not specified
        leftSide = leftSide || false;
        
        try {
            $.writeln("[TabCreator] Creating tab: " + tabText + " at position " + tabPosition);
            
            // Get page dimensions
            var pageWidth = page.bounds[3] - page.bounds[1];
            var pageHeight = page.bounds[2] - page.bounds[0];
            
            // Calculate tab vertical position
            var tabCenterY = page.bounds[0] + (pageHeight * tabPosition);
            
            // Calculate tab height (dynamically calculated based on page size)
            // For now, let's use 10% of page height for testing
            var tabHeight = pageHeight * 0.1;
            
            // Calculate tab x position (at the edge of the page)
            var tabX;
            if (leftSide) {
                // Tab will extend outward from left edge of page
                tabX = page.bounds[1]; // This is the left edge of the page
            } else {
                // Tab will extend outward from right edge of page
                tabX = 2*page.bounds[3]; // This is the right edge of the page
            }
            
            // Calculate tab y positions (centered at tabCenterY)
            var tabY1 = tabCenterY - (tabHeight / 2);
            var tabY2 = tabCenterY + (tabHeight / 2);
            
            // Calculate the angled edges based on tab angle
            // Note: We invert the angle for correct orientation
            var angleOffset = Math.tan(-tabAngle * Math.PI / 180) * (tabHeight / 2);
            
            // Create temporary elements that we'll group later
            var tabElements = [];
            
            // Define the points for the tab polygon
            var points = [];
            
            if (leftSide) {
                // Left side tab points - extending outward from left page edge
                points.push([tabX, tabY1]); // Top-left at page edge
                points.push([tabX, tabY2]); // Bottom-left at page edge
                points.push([tabX - tabWidth, tabY2 + angleOffset]); // Bottom-right with angle (extends left)
                points.push([tabX - tabWidth, tabY1 - angleOffset]); // Top-right with angle (extends left)
            } else {
                // Right side tab points - extending outward from right page edge
                points.push([tabX, tabY1]); // Top-left at page edge
                points.push([tabX, tabY2]); // Bottom-left at page edge
                points.push([tabX + tabWidth, tabY2 + angleOffset]); // Bottom-right with angle (extends right)
                points.push([tabX + tabWidth, tabY1 - angleOffset]); // Top-left with angle (extends right)
            }
            
            // Debug: Log the points we're trying to create
            $.writeln("[TabCreator] Tab polygon points:");
            for (var p = 0; p < points.length; p++) {
                $.writeln("  Point " + p + ": [" + points[p][0] + ", " + points[p][1] + "]");
            }
            
            // Create tab shape with polygon
            try {
                var tabPolygon = page.polygons.add();
                
                // Set the path points
                tabPolygon.paths.item(0).entirePath = points;
                tabElements.push(tabPolygon);
                
                // Apply fill color to the tab
                if (tabColor) {
                    tabPolygon.fillColor = tabColor;
                    tabPolygon.strokeColor = "None";
                } else {
                    // Use a default color if none provided
                    tabPolygon.fillColor = "Black";
                    tabPolygon.strokeColor = "None";
                }
                
                // Apply corner radius if specified
                if (cornerRadius > 0) {
                    try {
                        // Only attempt to set cornerRadius if it's available
                        if (typeof tabPolygon.cornerRadius !== 'undefined') {
                            tabPolygon.cornerRadius = cornerRadius;
                        }
                    } catch (cornerError) {
                        $.writeln("[TabCreator] Warning: Could not apply corner radius: " + cornerError.message);
                    }
                }
            } catch (polyError) {
                $.writeln("[TabCreator] Error creating polygon: " + polyError.message);
                throw polyError;
            }

            // Create text frame for the tab label
            var textFrame;
            try {
                // Calculate text bounds properly positioned on the tab
                var textBounds;
                if (leftSide) {
                    // Text bounds for left-side tab (extending left from page edge)
                    textBounds = [
                        tabY1 + 4,                  // Top
                        tabX - tabWidth + 4,        // Left (inset from far edge of tab)
                        tabY2 - 4,                  // Bottom
                        tabX - 4                    // Right (inset from page edge)
                    ];
                } else {
                    // Text bounds for right-side tab (extending right from page edge)
                    textBounds = [
                        tabY1 + 4,                  // Top
                        tabX + 4,                   // Left (inset from page edge)
                        tabY2 - 4,                  // Bottom
                        tabX + tabWidth - 4         // Right (inset from far edge of tab)
                    ];
                }
                
                // Debug: Log text frame bounds
                $.writeln("[TabCreator] Text frame bounds: [" + 
                          textBounds[0] + ", " + textBounds[1] + ", " + 
                          textBounds[2] + ", " + textBounds[3] + "]");
                
                // Create the text frame
                textFrame = page.textFrames.add({geometricBounds: textBounds});
                tabElements.push(textFrame);
                
                // Add text content
                textFrame.contents = tabText;
                
                // Apply text formatting
                if (textFrame.texts.length > 0) {
                    var theText = textFrame.texts[0];
                    
                    // Apply font
                    theText.appliedFont = tabFont;
                    
                    // Apply font size
                    theText.pointSize = fontSize;
                    
                    // Apply text color
                    try {
                        if (textColor === "Black") {
                            theText.fillColor = "Black";
                        } else if (textColor === "Paper") {
                            theText.fillColor = "Paper";
                        } else {
                            // Try to use the color name directly
                            theText.fillColor = textColor;
                        }
                    } catch (colorError) {
                        $.writeln("[TabCreator] Warning: Could not apply text color: " + colorError.message);
                        // Default to Paper (white) if there's any error
                        theText.fillColor = "Paper";
                    }
                    
                    // Apply text rotation
                    if (textRotation === 90) {
                        // Vertical text
                        try {
                            textFrame.rotationAngle = 90;
                        } catch(rotateError) {
                            $.writeln("[TabCreator] Warning: Could not rotate text: " + rotateError.message);
                        }
                        theText.justification = Justification.CENTER_ALIGN;
                    } else if (textRotation !== 0) {
                        // Custom rotation
                        try {
                            textFrame.rotationAngle = textRotation;
                        } catch(rotateError) {
                            $.writeln("[TabCreator] Warning: Could not rotate text: " + rotateError.message);
                        }
                        theText.justification = Justification.CENTER_ALIGN;
                    } else {
                        // Horizontal text
                        theText.justification = Justification.CENTER_ALIGN;
                    }
                    
                    // Center text vertically
                    textFrame.textFramePreferences.firstBaselineOffset = FirstBaseline.CAP_HEIGHT;
                    textFrame.textFramePreferences.verticalJustification = VerticalJustification.CENTER_ALIGN;
                }
            } catch (textError) {
                $.writeln("[TabCreator] Error creating text frame: " + textError.message);
                throw textError;
            }
            
            // If we have created at least the polygon successfully, return it
            // Even if text frame creation fails, the tab will still be visible
            if (tabElements.length > 0) {
                // Try to group elements if there are multiple
                if (tabElements.length > 1) {
                    try {
                        // Clear any existing selection
                        app.selection = null;
                        
                        // Select our elements
                        for (var i = 0; i < tabElements.length; i++) {
                            tabElements[i].select(SelectionOptions.ADD_TO);
                        }
                        
                        // Group the selection if more than one element is selected
                        if (app.selection.length > 1) {
                            var tabGroup = app.activeDocument.groups.add(app.selection);
                            return tabGroup;
                        }
                    } catch(groupError) {
                        $.writeln("[TabCreator] Warning: Could not group elements: " + groupError.message);
                    }
                }
                
                // If grouping failed or we only have one element, return the polygon
                return tabPolygon;
            }
            
            // If no elements were created, throw an error
            throw new Error("Failed to create any tab elements");
            
        } catch (e) {
            $.writeln("[TabCreator] Error in createTab function: " + e.message);
            throw new Error("Error creating tab: " + e.message);
        }
    }
    
    /**
     * Creates all month tabs for the year
     * @param {Document} doc - The InDesign document
     * @param {Object} tabPrefs - Tab preferences
     * @param {Array} monthPages - Array of page objects for monthly tabs
     */
    function createMonthTabs(doc, tabPrefs, monthPages) {
        var monthNames = ["January", "February", "March", "April", "May", "June", 
                         "July", "August", "September", "October", "November", "December"];
        
        // Create tabs for each month
        for (var i = 0; i < monthNames.length; i++) {
            if (i < monthPages.length) {
                try {
                    // Get tab color for this month
                    var tabColor = TabPreferences.getMonthTabColor(doc, i, tabPrefs);
                    
                    // Calculate vertical position (distribute evenly)
                    var position = i / (monthNames.length - 1);
                    
                    // Determine if the tab should be on the left side
                    // For even page numbers (left pages in spread), tabs should be on the left side
                    // For odd page numbers (right pages in spread), tabs should be on the right side
                    var pageNum = monthPages[i].documentOffset + 1; // +1 because DocumentOffset is 0-based
                    var leftSide = (pageNum % 2 === 0); // Even page numbers are left pages
                    
                    $.writeln("[TabCreator] Creating tab for " + monthNames[i] + " on page " + pageNum + 
                              " (leftSide: " + leftSide + ") at position " + position);
                    
                    // Create tab on the page
                    createTab(
                        monthPages[i],
                        monthNames[i],
                        position,
                        tabPrefs,
                        tabColor,
                        leftSide // Dynamically determined based on page number
                    );
                } catch (e) {
                    $.writeln("[TabCreator] Error creating tab for " + monthNames[i] + ": " + e.message);
                    // Continue with other tabs even if one fails
                }
            }
        }
    }
    
    /**
     * Calculates staggered positions for tabs so they don't overlap
     * @param {Number} numTabs - Number of tabs
     * @returns {Array} Array of positions from 0 to 1
     */
    function calculateTabPositions(numTabs) {
        var positions = [];
        
        // Calculate positions based on number of tabs
        for (var i = 0; i < numTabs; i++) {
            positions.push(i / (numTabs - 1));
        }
        
        return positions;
    }
    
    // Return public interface
    return {
        createTab: createTab,
        createMonthTabs: createMonthTabs,
        calculateTabPositions: calculateTabPositions
    };
})();