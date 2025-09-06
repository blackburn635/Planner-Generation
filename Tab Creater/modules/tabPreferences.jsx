/*******************************************************************************
 * Tab Preferences Module
 * 
 * Handles user preferences for the tab creation:
 * - Creates and manages the preferences dialog
 * - Stores user preferences for tab width, colors, and fonts
 * - Provides defaults when preferences aren't specified
 *******************************************************************************/

var TabPreferences = (function() {
    /**
     * Creates a dialog box to get user preferences for the monthly tabs
     * @param {Document} doc - The InDesign document
     * @returns {Object} User preferences or null if canceled
     */
    function getUserPreferences(doc) {
        // Create a dialog for tab preferences
        var dialog = app.dialogs.add({name: "Monthly Tab Preferences"});
        
        // Get all available fonts
        var fontArray = [];
        try {
            fontArray = app.fonts.everyItem().name;
        } catch (e) {
            // Fallback to basic fonts if we can't get the list
            fontArray = ["Minion Pro", "Myriad Pro", "Arial", "Helvetica", "Times New Roman", "Georgia"];
        }
        
        // Build the dialog
        try {
            // Create column for dialog
            var column = dialog.dialogColumns.add();
            
            // FONT SECTION
            column.staticTexts.add({staticLabel: "--- FONT OPTIONS ---"});
            
            // Tab Font
            column.staticTexts.add({staticLabel: "Tab Font:"});
            var tabFontDropdown = column.dropdowns.add({
                stringList: fontArray,
                selectedIndex: 0
            });
            
            // Font size
            column.staticTexts.add({staticLabel: "Font Size:"});
            var fontSizeField = column.realEditboxes.add({editValue: 10});
            
            // Font color
            column.staticTexts.add({staticLabel: "Font Color (CMYK):"});
            
            var row1 = column.dialogRows.add();
            row1.staticTexts.add({staticLabel: "C %:"});
            var fontCyanField = row1.realEditboxes.add({editValue: 0});
            
            var row2 = column.dialogRows.add();
            row2.staticTexts.add({staticLabel: "M %:"});
            var fontMagentaField = row2.realEditboxes.add({editValue: 0});
            
            var row3 = column.dialogRows.add();
            row3.staticTexts.add({staticLabel: "Y %:"});
            var fontYellowField = row3.realEditboxes.add({editValue: 0});
            
            var row4 = column.dialogRows.add();
            row4.staticTexts.add({staticLabel: "K %:"});
            var fontBlackField = row4.realEditboxes.add({editValue: 100});
            
            // Spacer
            column.staticTexts.add({staticLabel: " "});
            column.staticTexts.add({staticLabel: "--- TAB COLOR OPTIONS ---"});
            
            // Color Interpolation Mode
            column.staticTexts.add({staticLabel: "Color Interpolation Mode:"});
            var radioGroup = column.radiobuttonGroups.add();
            var twoColorOption = radioGroup.radiobuttonControls.add({staticLabel: "Two Colors", checkedState: true});
            var threeColorOption = radioGroup.radiobuttonControls.add({staticLabel: "Three Colors", checkedState: false});

            // First tab color (CMYK)
            column.staticTexts.add({staticLabel: "First Tab Color (CMYK):"});
            
            var row6 = column.dialogRows.add();
            row6.staticTexts.add({staticLabel: "C %:"});
            var startCyanField = row6.realEditboxes.add({editValue: 85});
            
            var row7 = column.dialogRows.add();
            row7.staticTexts.add({staticLabel: "M %:"});
            var startMagentaField = row7.realEditboxes.add({editValue: 10});
            
            var row8 = column.dialogRows.add();
            row8.staticTexts.add({staticLabel: "Y %:"});
            var startYellowField = row8.realEditboxes.add({editValue: 100});
            
            var row9 = column.dialogRows.add();
            row9.staticTexts.add({staticLabel: "K %:"});
            var startBlackField = row9.realEditboxes.add({editValue: 0});
            
            // Middle tab color (CMYK) - initially hidden, will be shown when three-color option is selected
            var middleColorGroup = column.dialogRows.add();
            var middleColorLabel = middleColorGroup.staticTexts.add({staticLabel: "Middle Tab Color (CMYK):"});
            
            var row10 = column.dialogRows.add();
            row10.staticTexts.add({staticLabel: "C %:"});
            var middleCyanField = row10.realEditboxes.add({editValue: 50});
            
            var row11 = column.dialogRows.add();
            row11.staticTexts.add({staticLabel: "M %:"});
            var middleMagentaField = row11.realEditboxes.add({editValue: 70});
            
            var row12 = column.dialogRows.add();
            row12.staticTexts.add({staticLabel: "Y %:"});
            var middleYellowField = row12.realEditboxes.add({editValue: 80});
            
            var row13 = column.dialogRows.add();
            row13.staticTexts.add({staticLabel: "K %:"});
            var middleBlackField = row13.realEditboxes.add({editValue: 0});
            
            // Last tab color (CMYK)
            column.staticTexts.add({staticLabel: "Last Tab Color (CMYK):"});
            
            var row14 = column.dialogRows.add();
            row14.staticTexts.add({staticLabel: "C %:"});
            var endCyanField = row14.realEditboxes.add({editValue: 75});
            
            var row15 = column.dialogRows.add();
            row15.staticTexts.add({staticLabel: "M %:"});
            var endMagentaField = row15.realEditboxes.add({editValue: 5});
            
            var row16 = column.dialogRows.add();
            row16.staticTexts.add({staticLabel: "Y %:"});
            var endYellowField = row16.realEditboxes.add({editValue: 5});
            
            var row17 = column.dialogRows.add();
            row17.staticTexts.add({staticLabel: "K %:"});
            var endBlackField = row17.realEditboxes.add({editValue: 0});
            
        
            
            
            
            // Spacer
            column.staticTexts.add({staticLabel: " "});
            column.staticTexts.add({staticLabel: "--- TAB SIZE OPTIONS ---"});
            
            // Tab width
            var row18 = column.dialogRows.add();
            row18.staticTexts.add({staticLabel: "Tab Width (points):"});
            var tabWidthField = row18.realEditboxes.add({editValue: 72}); // 1 inch default
            
            // Tab corner radius
            var row19 = column.dialogRows.add();
            row19.staticTexts.add({staticLabel: "Corner Radius (points):"});
            var cornerRadiusField = row19.realEditboxes.add({editValue: 12});
            
            // Tab margin from edges
            var row20 = column.dialogRows.add();
            row20.staticTexts.add({staticLabel: "Tab Margin from Edges (points):"});
            var tabMarginField = row20.realEditboxes.add({editValue: 36}); // 0.5 inch default
            
            // Show the dialog
            if (dialog.show()) {
                // User clicked OK - gather the values
                var prefs = {
                    tabFont: fontArray[tabFontDropdown.selectedIndex],
                    fontSize: fontSizeField.editValue,
                    fontColor: [
                        fontCyanField.editValue,
                        fontMagentaField.editValue,
                        fontYellowField.editValue,
                        fontBlackField.editValue
                    ],
                    useThreeColorMode: threeColorOption.checkedState,
                    startColor: [
                        startCyanField.editValue,
                        startMagentaField.editValue,
                        startYellowField.editValue,
                        startBlackField.editValue
                    ],
                    middleColor: [
                        middleCyanField.editValue,
                        middleMagentaField.editValue,
                        middleYellowField.editValue,
                        middleBlackField.editValue
                    ],
                    endColor: [
                        endCyanField.editValue,
                        endMagentaField.editValue,
                        endYellowField.editValue,
                        endBlackField.editValue
                    ],
                    tabWidth: tabWidthField.editValue,
                    cornerRadius: cornerRadiusField.editValue,
                    tabMargin: tabMarginField.editValue
                };
                
                dialog.destroy();
                
                // Store preferences for future use
                storePreferences(doc, prefs);
                
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
            throw new Error("Error creating preferences dialog: " + e.message + "\nLine: " + e.line);
        }
    }
    
    /**
     * Stores user preferences in document label
     * @param {Document} doc - The InDesign document
     * @param {Object} prefs - Preferences object to store
     */
    function storePreferences(doc, prefs) {
        try {
            // Convert preferences to JSON string
            var prefsJson = JSON.stringify(prefs);
            
            // Store in document label
            doc.insertLabel("MonthlyTabPreferences", prefsJson);
        } catch (e) {
            $.writeln("Warning: Could not store preferences: " + e.message);
            // Continue without storing - not a critical error
        }
    }
    
    /**
     * Retrieves stored preferences from document
     * @param {Document} doc - The InDesign document
     * @returns {Object|null} Retrieved preferences or null if not found
     */
    function retrievePreferences(doc) {
        try {
            // Check if preferences label exists
            if (doc.extractLabel("MonthlyTabPreferences") !== "") {
                // Get stored preferences JSON
                var prefsJson = doc.extractLabel("MonthlyTabPreferences");
                
                // Parse and return
                return JSON.parse(prefsJson);
            }
            return null;
        } catch (e) {
            $.writeln("Warning: Could not retrieve preferences: " + e.message);
            return null;
        }
    }
    
    /**
     * Gets default preferences
     * @returns {Object} Default preferences
     */
    function getDefaultPreferences() {
        return {
            tabFont: "Myriad Pro",
            fontSize: 10,
            fontColor: [0, 0, 0, 100], // Black
            useThreeColorMode: false,
            startColor: [85, 10, 100, 0], // Green
            middleColor: [50, 70, 80, 0], // Orange/Red
            endColor: [75, 5, 5, 0], // Blue
            tabWidth: 72, // 1 inch
            cornerRadius: 12,
            tabMargin: 36 // 0.5 inch
        };
    }
    
    // Return public interface
    return {
        getUserPreferences: getUserPreferences,
        retrievePreferences: retrievePreferences,
        getDefaultPreferences: getDefaultPreferences
    };
})();