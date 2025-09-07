// Planner-Format-01/lib/preferences.jsx

/*******************************************************************************
 * Enhanced Preferences Module
 * 
 * Handles enhanced user preferences for the planner application:
 * - Test mode (10 pages only)
 * - Flexible date range with duration
 * - Granular font control (5 categories)
 * - All existing functionality preserved
 *******************************************************************************/

var Preferences = (function() {
    /**
     * Creates enhanced dialog to get user preferences for the planner
     * @param {Document} doc - The InDesign document
     * @returns {Object} Enhanced user preferences or null if canceled
     */
    function getUserPreferences(doc) {
        var dialog = app.dialogs.add({name: "Enhanced Planner Preferences"});
        
        // Get all available fonts
        var fontArray = [];
        try {
            fontArray = app.fonts.everyItem().name;
        } catch (e) {
            fontArray = ["Minion Pro", "Myriad Pro", "Arial", "Helvetica", "Times New Roman", "Georgia"];
        }
        
        // Get existing document colors
        var docColors = [];
        try {
            for (var i = 0; i < doc.colors.length; i++) {
                if (doc.colors[i].name !== "None" && doc.colors[i].name !== "Registration") {
                    docColors.push(doc.colors[i].name);
                }
            }
        } catch (e) {
            // Ignore errors when getting colors
        }
        
        try {
            var column = dialog.dialogColumns.add();
            
            // =================================================================
            // TEST MODE PANEL
            // =================================================================
            var testModePanel = column.borderPanels.add();
            testModePanel.staticTexts.add({staticLabel: "TEST MODE"});
            var testModeCheckbox = testModePanel.checkboxControls.add({
                staticLabel: "Test Mode (Generate only 10 pages for testing)",
                checkedState: false
            });
            
            // =================================================================
            // DATE RANGE PANEL
            // =================================================================
            var datePanel = column.borderPanels.add();
            datePanel.staticTexts.add({staticLabel: "DATE RANGE"});
            
            var currentDate = new Date();
            var currentMonth = currentDate.getMonth();
            var currentYear = currentDate.getFullYear();
            
            datePanel.staticTexts.add({staticLabel: "Start Date:"});
            var monthNames = ["January", "February", "March", "April", "May", "June", 
                             "July", "August", "September", "October", "November", "December"];
            
            datePanel.staticTexts.add({staticLabel: "Month:"});
            var startMonthDropdown = datePanel.dropdowns.add({
                stringList: monthNames,
                selectedIndex: currentMonth
            });
            
            datePanel.staticTexts.add({staticLabel: "Year:"});
            var yearOptions = [];
            for (var i = currentYear - 5; i <= currentYear + 5; i++) {
                yearOptions.push(i.toString());
            }
            var startYearDropdown = datePanel.dropdowns.add({
                stringList: yearOptions,
                selectedIndex: 5
            });
            
            datePanel.staticTexts.add({staticLabel: "Day:"});
            var startDayField = datePanel.integerEditboxes.add({
                editValue: 1,
                minimumValue: 1,
                maximumValue: 31
            });
            
            datePanel.staticTexts.add({staticLabel: "Duration (months):"});
            var durationField = datePanel.integerEditboxes.add({
                editValue: 12,
                minimumValue: 1,
                maximumValue: 60
            });
            
            // =================================================================
            // FONT SETTINGS - SEPARATE PANELS FOR EACH CATEGORY
            // =================================================================
            var fontColors = ["Black", "Paper"].concat(docColors);
            
            // Page Title Headers Panel
            var pageTitlePanel = column.borderPanels.add();
            pageTitlePanel.staticTexts.add({staticLabel: "PAGE TITLE HEADERS"});
            pageTitlePanel.staticTexts.add({staticLabel: "Font:"});
            var pageTitleFontDropdown = pageTitlePanel.dropdowns.add({
                stringList: fontArray,
                selectedIndex: 0
            });
            pageTitlePanel.staticTexts.add({staticLabel: "Color:"});
            var pageTitleColorDropdown = pageTitlePanel.dropdowns.add({
                stringList: fontColors,
                selectedIndex: 0
            });
            pageTitlePanel.staticTexts.add({staticLabel: "Size (pt):"});
            var pageTitleSizeField = pageTitlePanel.realEditboxes.add({editValue: 18});
            
            // Weekly Content Panel
            var weeklyContentPanel = column.borderPanels.add();
            weeklyContentPanel.staticTexts.add({staticLabel: "WEEKLY SPREAD CONTENT"});
            weeklyContentPanel.staticTexts.add({staticLabel: "Font:"});
            var weeklyContentFontDropdown = weeklyContentPanel.dropdowns.add({
                stringList: fontArray,
                selectedIndex: Math.min(1, fontArray.length - 1)
            });
            weeklyContentPanel.staticTexts.add({staticLabel: "Color:"});
            var weeklyContentColorDropdown = weeklyContentPanel.dropdowns.add({
                stringList: fontColors,
                selectedIndex: 0
            });
            weeklyContentPanel.staticTexts.add({staticLabel: "Size (pt):"});
            var weeklyContentSizeField = weeklyContentPanel.realEditboxes.add({editValue: 12});
            
            // Monthly Calendar Panel
            var monthlyCalendarPanel = column.borderPanels.add();
            monthlyCalendarPanel.staticTexts.add({staticLabel: "MONTHLY CALENDAR DATES"});
            monthlyCalendarPanel.staticTexts.add({staticLabel: "Font:"});
            var monthlyCalendarFontDropdown = monthlyCalendarPanel.dropdowns.add({
                stringList: fontArray,
                selectedIndex: Math.min(1, fontArray.length - 1)
            });
            monthlyCalendarPanel.staticTexts.add({staticLabel: "Color:"});
            var monthlyCalendarColorDropdown = monthlyCalendarPanel.dropdowns.add({
                stringList: fontColors,
                selectedIndex: 0
            });
            monthlyCalendarPanel.staticTexts.add({staticLabel: "Size (pt):"});
            var monthlyCalendarSizeField = monthlyCalendarPanel.realEditboxes.add({editValue: 10});
            
            // Mini-Calendar Titles Panel
            var miniCalendarTitlePanel = column.borderPanels.add();
            miniCalendarTitlePanel.staticTexts.add({staticLabel: "MINI-CALENDAR TITLES"});
            miniCalendarTitlePanel.staticTexts.add({staticLabel: "Font:"});
            var miniCalendarTitleFontDropdown = miniCalendarTitlePanel.dropdowns.add({
                stringList: fontArray,
                selectedIndex: Math.min(1, fontArray.length - 1)
            });
            miniCalendarTitlePanel.staticTexts.add({staticLabel: "Color:"});
            var miniCalendarTitleColorDropdown = miniCalendarTitlePanel.dropdowns.add({
                stringList: fontColors,
                selectedIndex: 0
            });
            miniCalendarTitlePanel.staticTexts.add({staticLabel: "Size (pt):"});
            var miniCalendarTitleSizeField = miniCalendarTitlePanel.realEditboxes.add({editValue: 9});
            
            // Mini-Calendar Dates Panel
            var miniCalendarDatePanel = column.borderPanels.add();
            miniCalendarDatePanel.staticTexts.add({staticLabel: "MINI-CALENDAR DATES"});
            miniCalendarDatePanel.staticTexts.add({staticLabel: "Font:"});
            var miniCalendarDateFontDropdown = miniCalendarDatePanel.dropdowns.add({
                stringList: fontArray,
                selectedIndex: Math.min(1, fontArray.length - 1)
            });
            miniCalendarDatePanel.staticTexts.add({staticLabel: "Color:"});
            var miniCalendarDateColorDropdown = miniCalendarDatePanel.dropdowns.add({
                stringList: fontColors,
                selectedIndex: 0
            });
            miniCalendarDatePanel.staticTexts.add({staticLabel: "Size (pt):"});
            var miniCalendarDateSizeField = miniCalendarDatePanel.realEditboxes.add({editValue: 7});
            
            // =================================================================
            // HEADER COLOR PANEL
            // =================================================================
            var colorPanel = column.borderPanels.add();
            colorPanel.staticTexts.add({staticLabel: "HEADER COLOR (CMYK)"});
            
            colorPanel.staticTexts.add({staticLabel: "Cyan %:"});
            var cyanField = colorPanel.realEditboxes.add({editValue: 20});
            colorPanel.staticTexts.add({staticLabel: "Magenta %:"});
            var magentaField = colorPanel.realEditboxes.add({editValue: 40});
            colorPanel.staticTexts.add({staticLabel: "Yellow %:"});
            var yellowField = colorPanel.realEditboxes.add({editValue: 60});
            colorPanel.staticTexts.add({staticLabel: "Black %:"});
            var blackField = colorPanel.realEditboxes.add({editValue: 0});
            
            var useExistingCheckbox, colorDropdown;
            if (docColors.length > 0) {
                colorPanel.staticTexts.add({staticLabel: "OR USE EXISTING COLOR:"});
                useExistingCheckbox = colorPanel.checkboxControls.add({
                    staticLabel: "Use existing color instead",
                    checkedState: false
                });
                colorPanel.staticTexts.add({staticLabel: "Select color:"});
                colorDropdown = colorPanel.dropdowns.add({
                    stringList: docColors,
                    selectedIndex: 0
                });
            }
            
            // =================================================================
            // OPTIONS PANEL
            // =================================================================
            var optionsPanel = column.borderPanels.add();
            optionsPanel.staticTexts.add({staticLabel: "OPTIONS"});
            var includeMonthlyCheckbox = optionsPanel.checkboxControls.add({
                staticLabel: "Include monthly spreads",
                checkedState: true
            });
            
            // Show dialog
            if (dialog.show()) {
                // Calculate start and end dates
                var selectedStartMonth = startMonthDropdown.selectedIndex;
                var selectedStartYear = parseInt(yearOptions[startYearDropdown.selectedIndex]);
                var selectedStartDay = Math.max(1, Math.min(31, startDayField.editValue));
                var selectedDuration = Math.max(1, Math.min(60, durationField.editValue));
                
                var startDate = new Date(selectedStartYear, selectedStartMonth, selectedStartDay);
                if (startDate.getMonth() !== selectedStartMonth) {
                    startDate = new Date(selectedStartYear, selectedStartMonth + 1, 0);
                    alert("Invalid date corrected to: " + (startDate.getMonth() + 1) + "/" + startDate.getDate() + "/" + startDate.getFullYear());
                }
                
                var endDate = new Date(startDate);
                endDate.setMonth(endDate.getMonth() + selectedDuration);
                
                var prefs = {
                    // NEW: Test mode and duration
                    testMode: testModeCheckbox.checkedState,
                    startDate: startDate,
                    endDate: endDate,
                    durationMonths: selectedDuration,
                    
                    // NEW: Granular font settings
                    pageTitleFont: fontArray[pageTitleFontDropdown.selectedIndex],
                    pageTitleColor: fontColors[pageTitleColorDropdown.selectedIndex],
                    pageTitleSize: pageTitleSizeField.editValue,
                    
                    weeklyContentFont: fontArray[weeklyContentFontDropdown.selectedIndex],
                    weeklyContentColor: fontColors[weeklyContentColorDropdown.selectedIndex],
                    weeklyContentSize: weeklyContentSizeField.editValue,
                    
                    monthlyCalendarFont: fontArray[monthlyCalendarFontDropdown.selectedIndex],
                    monthlyCalendarColor: fontColors[monthlyCalendarColorDropdown.selectedIndex],
                    monthlyCalendarSize: monthlyCalendarSizeField.editValue,
                    
                    miniCalendarTitleFont: fontArray[miniCalendarTitleFontDropdown.selectedIndex],
                    miniCalendarTitleColor: fontColors[miniCalendarTitleColorDropdown.selectedIndex],
                    miniCalendarTitleSize: miniCalendarTitleSizeField.editValue,
                    
                    miniCalendarDateFont: fontArray[miniCalendarDateFontDropdown.selectedIndex],
                    miniCalendarDateColor: fontColors[miniCalendarDateColorDropdown.selectedIndex],
                    miniCalendarDateSize: miniCalendarDateSizeField.editValue,
                    
                    // EXISTING: Header color settings (preserved)
                    headerColorValues: [
                        cyanField.editValue,
                        magentaField.editValue,
                        yellowField.editValue,
                        blackField.editValue
                    ],
                    headerColorName: "HeaderColor",
                    useExistingColors: useExistingCheckbox ? useExistingCheckbox.checkedState : false,
                    selectedExistingColor: (colorDropdown && useExistingCheckbox && useExistingCheckbox.checkedState) 
                        ? docColors[colorDropdown.selectedIndex] : null,
                    
                    // EXISTING: Options (preserved)
                    includeMonthly: includeMonthlyCheckbox.checkedState,
                    
                    // LEGACY: Map new settings to old names for backward compatibility
                    titleFont: fontArray[pageTitleFontDropdown.selectedIndex],
                    titleFontColor: fontColors[pageTitleColorDropdown.selectedIndex],
                    contentFont: fontArray[weeklyContentFontDropdown.selectedIndex],
                    contentFontColor: fontColors[weeklyContentColorDropdown.selectedIndex],
                    calendarFont: fontArray[monthlyCalendarFontDropdown.selectedIndex],
                    calendarFontColor: fontColors[monthlyCalendarColorDropdown.selectedIndex]
                };
                
                dialog.destroy();
                
                // Store preferences for future use
                storePreferences(doc, prefs);
                
                return prefs;
            } else {
                dialog.destroy();
                return null;
            }
        } catch (e) {
            if (dialog && dialog.isValid) {
                dialog.destroy();
            }
            throw new Error("Error creating enhanced preferences dialog: " + e.message);
        }
    }
    
    /**
     * Stores user preferences in document label
     * @param {Document} doc - The InDesign document
     * @param {Object} prefs - Preferences object to store
     */
    function storePreferences(doc, prefs) {
        try {
            var prefsJson = JSON.stringify(prefs);
            doc.insertLabel("EnhancedPlannerPreferences", prefsJson);
        } catch (e) {
            $.writeln("Warning: Could not store preferences: " + e.message);
        }
    }
    
    /**
     * Retrieves stored preferences from document
     * @param {Document} doc - The InDesign document
     * @returns {Object|null} Retrieved preferences or null if not found
     */
    function retrievePreferences(doc) {
        try {
            if (doc.extractLabel("EnhancedPlannerPreferences") !== "") {
                var prefsJson = doc.extractLabel("EnhancedPlannerPreferences");
                return JSON.parse(prefsJson);
            }
            return null;
        } catch (e) {
            $.writeln("Warning: Could not retrieve preferences: " + e.message);
            return null;
        }
    }
    
    /**
     * Gets enhanced default preferences
     * @returns {Object} Default preferences with all new settings
     */
    function getDefaultPreferences() {
        var currentDate = new Date();
        var endDate = new Date(currentDate);
        endDate.setFullYear(endDate.getFullYear() + 1);
        
        return {
            // NEW: Test mode and duration
            testMode: false,
            startDate: currentDate,
            endDate: endDate,
            durationMonths: 12,
            
            // NEW: Granular font settings
            pageTitleFont: "Minion Pro",
            pageTitleColor: "Black",
            pageTitleSize: 18,
            
            weeklyContentFont: "Myriad Pro",
            weeklyContentColor: "Black", 
            weeklyContentSize: 12,
            
            monthlyCalendarFont: "Myriad Pro",
            monthlyCalendarColor: "Black",
            monthlyCalendarSize: 10,
            
            miniCalendarTitleFont: "Myriad Pro",
            miniCalendarTitleColor: "Black",
            miniCalendarTitleSize: 9,
            
            miniCalendarDateFont: "Myriad Pro",
            miniCalendarDateColor: "Black",
            miniCalendarDateSize: 7,
            
            // EXISTING: Header color and options
            headerColorValues: [20, 40, 60, 0],
            headerColorName: "HeaderColor",
            useExistingColors: false,
            includeMonthly: true,
            
            // LEGACY: Backward compatibility mappings
            titleFont: "Minion Pro",
            titleFontColor: "Black",
            contentFont: "Myriad Pro",
            contentFontColor: "Black",
            calendarFont: "Myriad Pro",
            calendarFontColor: "Black"
        };
    }
    
    /**
     * Gets preferences with enhanced options
     * @param {Document} doc - The InDesign document
     * @param {Boolean} forceDialog - If true, always show dialog regardless of stored prefs
     * @returns {Object} Enhanced preferences object
     */
    function getPreferences(doc, forceDialog) {
        var prefs = null;
        
        if (!forceDialog) {
            prefs = retrievePreferences(doc);
        }
        
        if (!prefs || forceDialog) {
            prefs = getUserPreferences(doc);
            
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