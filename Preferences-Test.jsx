/*******************************************************************************
 * Enhanced Preferences Dialog - Left-Aligned Version
 * 
 * Using border panels to ensure left-aligned text on all systems
 *******************************************************************************/

// @targetengine "session"

try {
    testEnhancedPreferencesLeftAligned();
} catch (e) {
    alert("Error: " + e.message);
}

function testEnhancedPreferencesLeftAligned() {
    if (app.documents.length === 0) {
        alert("Please open a document to test the preferences dialog.");
        return;
    }
    
    var doc = app.activeDocument;
    var prefs = getEnhancedPreferencesLeftAligned(doc);
    
    if (prefs) {
        var result = "=== ENHANCED PREFERENCES COLLECTED ===\n\n";
        
        result += "TEST MODE: " + (prefs.testMode ? "ON (10 pages only)" : "OFF (full planner)") + "\n\n";
        
        result += "DATE RANGE:\n";
        result += "  Start: " + prefs.startDate.toDateString() + "\n";
        result += "  End: " + prefs.endDate.toDateString() + "\n";
        result += "  Duration: " + prefs.durationMonths + " months\n\n";
        
        result += "FONT SETTINGS:\n";
        result += "  Page Title Headers: " + prefs.pageTitleFont + " (" + prefs.pageTitleColor + ", " + prefs.pageTitleSize + "pt)\n";
        result += "  Weekly Content: " + prefs.weeklyContentFont + " (" + prefs.weeklyContentColor + ", " + prefs.weeklyContentSize + "pt)\n";
        result += "  Monthly Calendar Dates: " + prefs.monthlyCalendarFont + " (" + prefs.monthlyCalendarColor + ", " + prefs.monthlyCalendarSize + "pt)\n";
        result += "  Mini-Calendar Titles: " + prefs.miniCalendarTitleFont + " (" + prefs.miniCalendarTitleColor + ", " + prefs.miniCalendarTitleSize + "pt)\n";
        result += "  Mini-Calendar Dates: " + prefs.miniCalendarDateFont + " (" + prefs.miniCalendarDateColor + ", " + prefs.miniCalendarDateSize + "pt)\n\n";
        
        result += "HEADER COLOR: ";
        if (prefs.useExistingColors) {
            result += prefs.selectedExistingColor + " (existing)\n";
        } else {
            result += "CMYK(" + prefs.headerColorValues.join(", ") + ")\n";
        }
        
        result += "\nOPTIONS:\n";
        result += "  Include Monthly Spreads: " + (prefs.includeMonthly ? "YES" : "NO") + "\n";
        
        alert(result);
    } else {
        alert("Dialog was canceled.");
    }
}

function getEnhancedPreferencesLeftAligned(doc) {
    var dialog = app.dialogs.add({name: "Enhanced Planner Preferences"});
    
    var fontArray = [];
    try {
        fontArray = app.fonts.everyItem().name;
    } catch (e) {
        fontArray = ["Minion Pro", "Myriad Pro", "Arial", "Helvetica", "Times New Roman", "Georgia"];
    }
    
    var docColors = [];
    try {
        for (var i = 0; i < doc.colors.length; i++) {
            if (doc.colors[i].name !== "None" && doc.colors[i].name !== "Registration") {
                docColors.push(doc.colors[i].name);
            }
        }
    } catch (e) {
        // Ignore errors
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
            var selectedStartMonth = startMonthDropdown.selectedIndex;
            var selectedStartYear = parseInt(yearOptions[startYearDropdown.selectedIndex]);
            var selectedStartDay = Math.max(1, Math.min(31, startDayField.editValue));
            var selectedDuration = Math.max(1, Math.min(60, durationField.editValue));
            
            var startDate = new Date(selectedStartYear, selectedStartMonth, selectedStartDay);
            if (startDate.getMonth() !== selectedStartMonth) {
                startDate = new Date(selectedStartYear, selectedStartMonth + 1, 0);
            }
            
            var endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + selectedDuration);
            
            var prefs = {
                testMode: testModeCheckbox.checkedState,
                startDate: startDate,
                endDate: endDate,
                durationMonths: selectedDuration,
                
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
                
                includeMonthly: includeMonthlyCheckbox.checkedState
            };
            
            dialog.destroy();
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