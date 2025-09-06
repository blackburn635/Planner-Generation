/*******************************************************************************
 * Preferences Module
 * 
 * Handles user preferences for the planner application:
 * - Creates and manages the preferences dialog
 * - Stores and retrieves user preferences
 * - Provides defaults when preferences aren't specified
 *******************************************************************************/

var Preferences = (function() {
    /**
     * Creates a dialog box to get user preferences for the planner
     * @param {Document} doc - The InDesign document
     * @returns {Object} User preferences or null if canceled
     */
    function getUserPreferences(doc) {
        // Let's create a dialog that works reliably with InDesign
        var dialog = app.dialogs.add({name: "Planner Preferences"});
        
        // Get all available fonts - this time using everyItem() which worked in the first version
        var fontArray = [];
        try {
            fontArray = app.fonts.everyItem().name;
        } catch (e) {
            // Fallback to basic fonts if we can't get the list
            fontArray = ["Minion Pro", "Myriad Pro", "Arial", "Helvetica", "Times New Roman", "Georgia"];
        }
        
        // Get existing document colors for dropdown menus
        var docColors = ColorManager.getAvailableColors(doc);
        
        // Build the dialog
        try {
            // Create column for dialog
            var column = dialog.dialogColumns.add();
            
            // FONT SECTION
            column.staticTexts.add({staticLabel: "--- FONT OPTIONS ---"});
            
            // Title Font
            column.staticTexts.add({staticLabel: "Title Font:"});
            var titleFontDropdown = column.dropdowns.add({
                stringList: fontArray,
                selectedIndex: 0
            });
            
            // Title font color selection
            column.staticTexts.add({staticLabel: "Title Font Color:"});
            var fontColors = ["Black", "Paper"].concat(docColors);
            var titleFontColorDropdown = column.dropdowns.add({
                stringList: fontColors,
                selectedIndex: 0
            });
            
            // Content Font
            column.staticTexts.add({staticLabel: "Content Font:"});
            var contentFontDropdown = column.dropdowns.add({
                stringList: fontArray,
                selectedIndex: 0
            });
            
            // Content font color selection
            column.staticTexts.add({staticLabel: "Content Font Color:"});
            var contentFontColorDropdown = column.dropdowns.add({
                stringList: fontColors,
                selectedIndex: 0
            });
            
            // Month Calendar Font
            column.staticTexts.add({staticLabel: "Month Calendar Font:"});
            var calendarFontDropdown = column.dropdowns.add({
                stringList: fontArray,
                selectedIndex: 0
            });
            
            // Month Calendar font color selection
            column.staticTexts.add({staticLabel: "Month Calendar Font Color:"});
            var calendarFontColorDropdown = column.dropdowns.add({
                stringList: fontColors,
                selectedIndex: 0
            });
            
            // Spacer
            column.staticTexts.add({staticLabel: " "});
            column.staticTexts.add({staticLabel: "--- COLOR OPTIONS ---"});
            
            // Header color CMYK values
            column.staticTexts.add({staticLabel: "Header Color (CMYK values):"});
            
            // Create a row for CMYK values
            var row1 = column.dialogRows.add();
            row1.staticTexts.add({staticLabel: "Cyan %:"});
            var cyanField = row1.realEditboxes.add({editValue: 20});
            
            var row2 = column.dialogRows.add();
            row2.staticTexts.add({staticLabel: "Magenta %:"});
            var magentaField = row2.realEditboxes.add({editValue: 40});
            
            var row3 = column.dialogRows.add();
            row3.staticTexts.add({staticLabel: "Yellow %:"});
            var yellowField = row3.realEditboxes.add({editValue: 60});
            
            var row4 = column.dialogRows.add();
            row4.staticTexts.add({staticLabel: "Black %:"});
            var blackField = row4.realEditboxes.add({editValue: 0});
            
            // Add option to use existing color if available
            if (docColors.length > 0) {
                column.staticTexts.add({staticLabel: " "});
                column.staticTexts.add({staticLabel: "--- OR USE EXISTING COLOR ---"});
                
                var row5 = column.dialogRows.add();
                var useExistingCheckbox = row5.checkboxControls.add({
                    staticLabel: "Use existing color instead:",
                    checkedState: false
                });
                
                var row6 = column.dialogRows.add();
                row6.staticTexts.add({staticLabel: "Select color:"});
                var colorDropdown = row6.dropdowns.add({
                    stringList: docColors,
                    selectedIndex: 0
                });
            }
            
            // Monthly spread options section
            column.staticTexts.add({staticLabel: " "});
            column.staticTexts.add({staticLabel: "--- MONTHLY SPREAD OPTIONS ---"});
            
            // Include monthly spreads option
            var row7 = column.dialogRows.add();
            var includeMonthlyCheckbox = row7.checkboxControls.add({
                staticLabel: "Include monthly spreads:",
                checkedState: true
            });
            
            // Show the dialog
            if (dialog.show()) {
                // User clicked OK - gather the values
                var prefs = {
                    titleFont: fontArray[titleFontDropdown.selectedIndex],
                    titleFontColor: fontColors[titleFontColorDropdown.selectedIndex],
                    contentFont: fontArray[contentFontDropdown.selectedIndex],
                    contentFontColor: fontColors[contentFontColorDropdown.selectedIndex],
                    calendarFont: fontArray[calendarFontDropdown.selectedIndex],
                    calendarFontColor: fontColors[calendarFontColorDropdown.selectedIndex],
                    headerColorValues: [
                        cyanField.editValue,
                        magentaField.editValue,
                        yellowField.editValue,
                        blackField.editValue
                    ],
                    includeMonthly: includeMonthlyCheckbox.checkedState
                };
                
                // Handle existing color selection if it was available
                if (docColors.length > 0) {
                    prefs.useExistingColors = useExistingCheckbox.checkedState;
                    if (prefs.useExistingColors) {
                        prefs.headerColorName = docColors[colorDropdown.selectedIndex];
                    } else {
                        prefs.headerColorName = "HeaderColor";
                    }
                } else {
                    prefs.useExistingColors = false;
                    prefs.headerColorName = "HeaderColor";
                }
                
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
            doc.insertLabel("PlannerPreferences", prefsJson);
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
            if (doc.extractLabel("PlannerPreferences") !== "") {
                // Get stored preferences JSON
                var prefsJson = doc.extractLabel("PlannerPreferences");
                
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
            titleFont: "Minion Pro",
            titleFontColor: "Black",
            contentFont: "Myriad Pro",
            contentFontColor: "Black",
            calendarFont: "Myriad Pro",
            calendarFontColor: "Black",
            headerColorValues: [20, 40, 60, 0],
            headerColorName: "HeaderColor",
            useExistingColors: false,
            includeMonthly: true
        };
    }
    
    /**
     * Gets preferences, either from user dialog, stored prefs, or defaults
     * @param {Document} doc - The InDesign document
     * @param {Boolean} forceDialog - If true, always show dialog regardless of stored prefs
     * @returns {Object} Preferences object
     */
    function getPreferences(doc, forceDialog) {
        // First try to get stored preferences
        var prefs = null;
        
        if (!forceDialog) {
            prefs = retrievePreferences(doc);
        }
        
        // If no stored preferences or dialog is forced, show dialog
        if (!prefs || forceDialog) {
            prefs = getUserPreferences(doc);
            
            // If user canceled dialog, use defaults
            if (!prefs) {
                prefs = getDefaultPreferences();
            }
        }
        
        return prefs;
    }
    
    // Return public interface
    return {
        getUserPreferences: getUserPreferences,
        getPreferences: getPreferences,
        getDefaultPreferences: getDefaultPreferences,
        storePreferences: storePreferences,
        retrievePreferences: retrievePreferences
    };
})();