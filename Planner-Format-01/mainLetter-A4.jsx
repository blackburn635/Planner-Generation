/*******************************************************************************
 * InDesign Planner Generation Script - Main Module v02
 * 
 * This is the main entry point for the planner generation script. It orchestrates
 * the overall process and handles both weekly and monthly spreads.
 * 
 * NEW IN VERSION 02:
 * - Added start date selection in preferences dialog
 * - User can choose any date to begin the calendar from
 * - Still generates full year from selected start date
 * 
 * Features:
 * - Weekly spreads with day sections and mini month views
 * - Monthly spreads at the beginning of each month
 * - QR codes on each page containing date information
 * - Customizable styles, colors, and layouts
 * - Custom start date selection
 *******************************************************************************/

// @targetengine "session"

// Import required modules
//@include "lib/polyfills.jsx"
//@include "lib/utils.jsx"
//@include "lib/preferences.jsx"
//@include "lib/colors.jsx"
//@include "lib/layout.jsx"
//@include "lib/components/header.jsx"
//@include "lib/components/footer.jsx"
//@include "lib/components/daySection.jsx"
//@include "lib/components/weeklyView.jsx"
//@include "lib/components/monthlyView.jsx"
//@include "lib/components/monthSpread.jsx"
//@include "lib/components/calendarGrid.jsx"
//@include "lib/components/qrcodeGen.jsx"

// Initialize the script with error handling
try {
    // Check if QR code library is available and properly loaded
    if (typeof QRCodeGen.createQRCode !== "function") {
        throw new Error("QR code library not found or not properly initialized. Make sure qrcode.jsx is in the lib folder.");
    }
    
    main();
    alert("Planner generation complete!");
} catch (e) {
    alert("Error: " + e.message + "\nLine: " + (e.line || "unknown"));
}

/**
 * Main function that orchestrates the planner generation process
 */
function main() {
    // Check for open document
    if (app.documents.length === 0) {
        throw new Error("Please open a document before running this script.");
    }
    
    var myDocument = app.activeDocument;
    
    // Check for facing pages - critical for proper spread layout
    if (!myDocument.documentPreferences.facingPages) {
        throw new Error("This script requires a document with facing pages enabled. Please enable facing pages in Document Setup and try again.");
    }
    
    // Ensure minimum of 2 pages (page 1 for cover, start content on page 2)
    while (myDocument.pages.length < 2) {
        myDocument.pages.add();
    }

    // Get the user preferences using a dialog - MODIFIED IN V02 to include start date
    var userPrefs = getUserPreferencesWithStartDate(myDocument);
    
    // If user canceled the dialog, exit the script
    if (!userPrefs) {
        return;
    }
    
    // Calculate page metrics from the document
    var pageMetrics = Layout.calculatePageMetrics(myDocument);
    
    // Set up colors from user preferences if needed
    if (!userPrefs.useExistingColors) {
        ColorManager.setupColors(myDocument, userPrefs);
    }

    // MODIFIED IN V02: Use the selected start date instead of current year
    var startDate = userPrefs.startDate;
    
    // Generate all spreads for the year starting from selected date
    generateYearPlanner(myDocument, startDate, pageMetrics, userPrefs);
}

/**
 * Enhanced version of Preferences.getUserPreferences that includes start date selection
 * This function mirrors the original but adds start date selection at the top
 * @param {Document} doc - The InDesign document
 * @returns {Object} User preferences including start date, or null if canceled
 */
function getUserPreferencesWithStartDate(doc) {
    // Let's create a dialog that works reliably with InDesign
    var dialog = app.dialogs.add({name: "Planner Preferences v02"});
    
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
        
        // START DATE SELECTION SECTION - NEW IN V02
        column.staticTexts.add({staticLabel: "--- START DATE SELECTION ---"});
        
        // Current date as default
        var currentDate = new Date();
        var currentMonth = currentDate.getMonth();
        var currentYear = currentDate.getFullYear();
        
        // Month selection
        var monthNames = ["January", "February", "March", "April", "May", "June", 
                         "July", "August", "September", "October", "November", "December"];
        column.staticTexts.add({staticLabel: "Start Month:"});
        var monthDropdown = column.dropdowns.add({
            stringList: monthNames,
            selectedIndex: currentMonth
        });
        
        // Year selection (current year +/- 5 years)
        var yearOptions = [];
        for (var i = currentYear - 5; i <= currentYear + 5; i++) {
            yearOptions.push(i.toString());
        }
        column.staticTexts.add({staticLabel: "Start Year:"});
        var yearDropdown = column.dropdowns.add({
            stringList: yearOptions,
            selectedIndex: 5 // Middle option (current year)
        });
        
        // Day selection
        column.staticTexts.add({staticLabel: "Start Day:"});
        var dayField = column.integerEditboxes.add({
            editValue: 1,
            minimumValue: 1,
            maximumValue: 31
        });
        
        // Add note about date validation
        column.staticTexts.add({staticLabel: "Note: Invalid dates will be auto-corrected"});
        
        // FONT SECTION - IDENTICAL TO ORIGINAL
        column.staticTexts.add({staticLabel: " "});
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
            selectedIndex: Math.min(1, fontArray.length - 1)
        });
        
        // Content font color
        column.staticTexts.add({staticLabel: "Content Font Color:"});
        var contentFontColorDropdown = column.dropdowns.add({
            stringList: fontColors,
            selectedIndex: 0
        });
        
        // Calendar Font
        column.staticTexts.add({staticLabel: "Calendar Font:"});
        var calendarFontDropdown = column.dropdowns.add({
            stringList: fontArray,
            selectedIndex: Math.min(1, fontArray.length - 1)
        });
        
        // Calendar font color
        column.staticTexts.add({staticLabel: "Calendar Font Color:"});
        var calendarFontColorDropdown = column.dropdowns.add({
            stringList: fontColors,
            selectedIndex: 0
        });
        
        // COLOR CREATION SECTION - IDENTICAL TO ORIGINAL
        column.staticTexts.add({staticLabel: " "});
        column.staticTexts.add({staticLabel: "--- HEADER COLOR (CMYK) ---"});
        
        // CMYK values with rows for better layout
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
        
        // Add option to use existing color if available - IDENTICAL TO ORIGINAL
        var useExistingCheckbox, colorDropdown;
        if (docColors.length > 0) {
            column.staticTexts.add({staticLabel: " "});
            column.staticTexts.add({staticLabel: "--- OR USE EXISTING COLOR ---"});
            
            var row5 = column.dialogRows.add();
            useExistingCheckbox = row5.checkboxControls.add({
                staticLabel: "Use existing color instead:",
                checkedState: false
            });
            
            var row6 = column.dialogRows.add();
            row6.staticTexts.add({staticLabel: "Select color:"});
            colorDropdown = row6.dropdowns.add({
                stringList: docColors,
                selectedIndex: 0
            });
        }
        
        // Monthly spread options section - IDENTICAL TO ORIGINAL
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
            
            // MODIFIED IN V02: Validate and create start date
            var selectedMonth = monthDropdown.selectedIndex;
            var selectedYear = parseInt(yearOptions[yearDropdown.selectedIndex]);
            var selectedDay = Math.max(1, Math.min(31, dayField.editValue));
            
            // Create the date and validate it
            var startDate = new Date(selectedYear, selectedMonth, selectedDay);
            
            // Auto-correct invalid dates (like February 31st -> February 28th/29th)
            if (startDate.getMonth() !== selectedMonth) {
                // Date was invalid, set to last day of intended month
                startDate = new Date(selectedYear, selectedMonth + 1, 0);
                alert("Invalid date corrected to: " + (startDate.getMonth() + 1) + "/" + startDate.getDate() + "/" + startDate.getFullYear());
            }
            
            var prefs = {
                // NEW IN V02: Start date selection
                startDate: startDate,
                
                // IDENTICAL TO ORIGINAL: All existing preferences
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
                headerColorName: "HeaderColor",
                useExistingColors: useExistingCheckbox ? useExistingCheckbox.checkedState : false,
                selectedExistingColor: (colorDropdown && useExistingCheckbox && useExistingCheckbox.checkedState) 
                    ? docColors[colorDropdown.selectedIndex] : null,
                includeMonthly: includeMonthlyCheckbox.checkedState
            };
            
            // Store these preferences - using original method name with v02 label
            try {
                var prefsJson = JSON.stringify(prefs);
                doc.insertLabel("PlannerPreferencesV02", prefsJson);
            } catch (e) {
                $.writeln("Warning: Could not store preferences: " + e.message);
            }
            
            return prefs;
            
        } else {
            // User canceled
            return null;
        }
        
    } catch (e) {
        alert("Error creating preferences dialog: " + e.message);
        return null;
    } finally {
        // Clean up dialog
        if (dialog && dialog.isValid) {
            dialog.destroy();
        }
    }
}

/**
 * Generates all spreads for a year, including both monthly and weekly spreads
 * MODIFIED IN V02: Now accepts start date instead of year parameter
 * @param {Document} doc - The InDesign document
 * @param {Date} startDate - The date to start the planner from (MODIFIED)
 * @param {Object} pageMetrics - Page size and margin information
 * @param {Object} userPrefs - User preferences for fonts and colors
 */
function generateYearPlanner(doc, startDate, pageMetrics, userPrefs) {
    var currentPageIndex = 1; // Start on page 2 (index 1), assuming page 1 is cover
    var currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1); // MODIFIED: Start from first of start month
    
    // MODIFIED IN V02: Calculate end date as one year from start date
    var endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);
    
    // MODIFIED IN V02: Loop through months until we reach end date instead of fixed 12 months
    while (currentDate < endDate) {
        // Create monthly spread for the month
        currentPageIndex = MonthSpread.createMonthSpread(doc, currentDate, currentPageIndex, pageMetrics, userPrefs);
        
        // Find the first Monday on or after the first of the month
        var firstMonday = new Date(currentDate);
        while (firstMonday.getDay() !== 1) { // 1 = Monday
            firstMonday.setDate(firstMonday.getDate() + 1);
        }
        
        // Set our current working date to this Monday
        var weekStartDate = new Date(firstMonday);
        
        // Calculate the week number for this Monday
        var weekNumber = Utils.getWeekNumber(weekStartDate);
        
        // Create weekly spreads until we reach the next month
        var currentMonth = currentDate.getMonth();
        while (weekStartDate.getMonth() === currentMonth && weekStartDate < endDate) {
            // Create weekly spread
            currentPageIndex = WeeklyView.createWeekSpread(doc, weekStartDate, weekNumber, currentPageIndex, pageMetrics, userPrefs);
            
            // Move to next week
            weekStartDate.setDate(weekStartDate.getDate() + 7);
            weekNumber++;
            
            // Handle week numbers that wrap to next year
            if (weekNumber > 52) {
                weekNumber = 1;
            }
        }
        
        // Move to next month
        currentDate.setMonth(currentDate.getMonth() + 1);
        currentDate.setDate(1);
    }
}