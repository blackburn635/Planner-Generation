/*******************************************************************************
 * Tab Preferences Module
 * 
 * Handles user preferences for planner tabs:
 * - Creates and manages the tab preferences dialog
 * - Stores tab font, color, and dimension preferences
 * - Calculates color interpolation between start and end colors
 *******************************************************************************/

var TabPreferences = (function() {
    /**
     * Creates a dialog box to get user preferences for tabs
     * @param {Document} doc - The InDesign document
     * @returns {Object} Tab preferences or null if canceled
     */
    function getTabPreferences(doc) {
        // Create the dialog
        var dialog = app.dialogs.add({name: "Tab Preferences"});
        
        // Get all available fonts
        var fontArray = [];
        try {
            fontArray = app.fonts.everyItem().name;
        } catch (e) {
            // Fallback to basic fonts if we can't get the list
            fontArray = ["Minion Pro", "Myriad Pro", "Arial", "Helvetica", "Times New Roman", "Georgia"];
        }
        
        // Get existing document colors for dropdown menus
        var docColors = [];
        try {
            for (var i = 0; i < doc.colors.length; i++) {
                if (doc.colors[i].name !== "None" && 
                    doc.colors[i].name !== "Registration") {
                    docColors.push(doc.colors[i].name);
                }
            }
        } catch (e) {
            // Ignore errors when getting colors
        }
        
        // Build the dialog
        try {
            // Create column for dialog
            var column = dialog.dialogColumns.add();
            
            // TAB DIMENSIONS SECTION
            column.staticTexts.add({staticLabel: "--- TAB DIMENSIONS ---"});
            
            // Tab width
            var row1 = column.dialogRows.add();
            row1.staticTexts.add({staticLabel: "Tab Width (points):"});
            var tabWidthField = row1.realEditboxes.add({editValue: 60});
            
            // Tab angle
            var row2 = column.dialogRows.add();
            row2.staticTexts.add({staticLabel: "Tab Side Angle (degrees):"});
            var tabAngleField = row2.realEditboxes.add({editValue: 15});
            
            // Tab corner radius
            var row3 = column.dialogRows.add();
            row3.staticTexts.add({staticLabel: "Corner Radius (points):"});
            var cornerRadiusField = row3.realEditboxes.add({editValue: 6});
            
            // Tab indent from edge
            var row4 = column.dialogRows.add();
            row4.staticTexts.add({staticLabel: "Tab Indent from Edge (points):"});
            var tabIndentField = row4.realEditboxes.add({editValue: 0});
            
            // Spacer
            column.staticTexts.add({staticLabel: " "});
            column.staticTexts.add({staticLabel: "--- TAB FONT OPTIONS ---"});
            
            // Tab text font
            column.staticTexts.add({staticLabel: "Tab Text Font:"});
            var tabFontDropdown = column.dropdowns.add({
                stringList: fontArray,
                selectedIndex: 0
            });
            
            // Tab text rotation
            var row5 = column.dialogRows.add();
            row5.staticTexts.add({staticLabel: "Text Rotation (90=vertical):"});
            var textRotationField = row5.realEditboxes.add({editValue: 90});
            
            // Tab font size
            var row6 = column.dialogRows.add();
            row6.staticTexts.add({staticLabel: "Font Size (points):"});
            var fontSizeField = row6.realEditboxes.add({editValue: 10});
            
            // Tab text color
            column.staticTexts.add({staticLabel: "Tab Text Color:"});
            var fontColors = ["Black", "Paper"].concat(docColors);
            var textColorDropdown = column.dropdowns.add({
                stringList: fontColors,
                selectedIndex: 1 // Default to "Paper" (white text)
            });
            
            // Spacer
            column.staticTexts.add({staticLabel: " "});
            column.staticTexts.add({staticLabel: "--- TAB COLOR OPTIONS ---"});
            
            // First tab color CMYK values
            column.staticTexts.add({staticLabel: "First Tab Color (January) CMYK values:"});
            
            var row7 = column.dialogRows.add();
            row7.staticTexts.add({staticLabel: "Cyan %:"});
            var firstCyanField = row7.realEditboxes.add({editValue: 85});
            
            var row8 = column.dialogRows.add();
            row8.staticTexts.add({staticLabel: "Magenta %:"});
            var firstMagentaField = row8.realEditboxes.add({editValue: 10});
            
            var row9 = column.dialogRows.add();
            row9.staticTexts.add({staticLabel: "Yellow %:"});
            var firstYellowField = row9.realEditboxes.add({editValue: 10});
            
            var row10 = column.dialogRows.add();
            row10.staticTexts.add({staticLabel: "Black %:"});
            var firstBlackField = row10.realEditboxes.add({editValue: 0});
            
            // Last tab color CMYK values
            column.staticTexts.add({staticLabel: "Last Tab Color (December) CMYK values:"});
            
            var row11 = column.dialogRows.add();
            row11.staticTexts.add({staticLabel: "Cyan %:"});
            var lastCyanField = row11.realEditboxes.add({editValue: 85});
            
            var row12 = column.dialogRows.add();
            row12.staticTexts.add({staticLabel: "Magenta %:"});
            var lastMagentaField = row12.realEditboxes.add({editValue: 85});
            
            var row13 = column.dialogRows.add();
            row13.staticTexts.add({staticLabel: "Yellow %:"});
            var lastYellowField = row13.realEditboxes.add({editValue: 0});
            
            var row14 = column.dialogRows.add();
            row14.staticTexts.add({staticLabel: "Black %:"});
            var lastBlackField = row14.realEditboxes.add({editValue: 0});
            
            // Show the dialog
            if (dialog.show()) {
                // User clicked OK - gather the values
                var prefs = {
                    // Tab dimensions
                    tabWidth: tabWidthField.editValue,
                    tabAngle: tabAngleField.editValue,
                    cornerRadius: cornerRadiusField.editValue,
                    tabIndent: tabIndentField.editValue,
                    
                    // Tab font options
                    tabFont: fontArray[tabFontDropdown.selectedIndex],
                    textRotation: textRotationField.editValue,
                    fontSize: fontSizeField.editValue,
                    textColor: fontColors[textColorDropdown.selectedIndex],
                    
                    // Tab color options
                    firstTabColor: [
                        firstCyanField.editValue,
                        firstMagentaField.editValue,
                        firstYellowField.editValue,
                        firstBlackField.editValue
                    ],
                    lastTabColor: [
                        lastCyanField.editValue,
                        lastMagentaField.editValue,
                        lastYellowField.editValue,
                        lastBlackField.editValue
                    ]
                };
                
                dialog.destroy();
                return prefs;
            } else {
                // User canceled
                dialog.destroy();
                return null;
            }
        } catch (e) {
            if (dialog) {
                dialog.destroy();
            }
            throw new Error("Error creating tab preferences dialog: " + e.message);
        }
    }
    
    /**
     * Calculates a color for a specific tab position based on interpolation
     * @param {Array} firstColor - CMYK values [C,M,Y,K] for first color
     * @param {Array} lastColor - CMYK values [C,M,Y,K] for last color
     * @param {Number} position - Position from 0 to 1 (0 = first, 1 = last)
     * @returns {Array} Interpolated CMYK values
     */
    function calculateTabColor(firstColor, lastColor, position) {
        // Ensure position is between 0 and 1
        position = Math.max(0, Math.min(1, position));
        
        // Interpolate between first and last color
        var interpolatedColor = [
            firstColor[0] + (lastColor[0] - firstColor[0]) * position,
            firstColor[1] + (lastColor[1] - firstColor[1]) * position,
            firstColor[2] + (lastColor[2] - firstColor[2]) * position,
            firstColor[3] + (lastColor[3] - firstColor[3]) * position
        ];
        
        // Round values (avoiding Array.map which isn't fully supported in ExtendScript)
        var roundedColor = [];
        for (var i = 0; i < interpolatedColor.length; i++) {
            roundedColor[i] = Math.round(interpolatedColor[i] * 10) / 10; // Round to 1 decimal place
        }
        
        return roundedColor;
    }
    
    /**
     * Creates or retrieves a color for a specific month tab
     * @param {Document} doc - The InDesign document
     * @param {Number} monthIndex - Month index (0-11)
     * @param {Object} tabPrefs - Tab preferences object
     * @returns {Color} The color for the specified month tab
     */
    function getMonthTabColor(doc, monthIndex, tabPrefs) {
        var monthNames = ["January", "February", "March", "April", "May", "June", 
                         "July", "August", "September", "October", "November", "December"];
        
        // Calculate position (0 for first month, 1 for last month)
        var position = monthIndex / 11; // 11 = December index
        
        // Calculate interpolated color
        var cmykValues = calculateTabColor(tabPrefs.firstTabColor, tabPrefs.lastTabColor, position);
        
        // Create color name
        var colorName = "TabColor_" + monthNames[monthIndex];
        
        // Check if color already exists
        var tabColor = doc.colors.itemByName(colorName);
        
        try {
            if (!tabColor.isValid) {
                // Create new color
                tabColor = doc.colors.add({
                    name: colorName,
                    model: ColorModel.PROCESS,
                    colorValue: cmykValues
                });
            } else {
                // Update existing color
                tabColor.colorValue = cmykValues;
            }
            
            return tabColor;
        } catch (e) {
            throw new Error("Failed to create tab color: " + e.message);
        }
    }
    
    // Return public interface
    return {
        getTabPreferences: getTabPreferences,
        calculateTabColor: calculateTabColor,
        getMonthTabColor: getMonthTabColor
    };
})();