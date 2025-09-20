// Planner-Format-01/mainLetter-A4.jsx

/*******************************************************************************
 * InDesign Planner Generation Script - Enhanced Main Module v03 with Binding-Aware Margins
 * 
 * This is the main entry point for the enhanced planner generation script. 
 * It orchestrates the overall process and handles both weekly and monthly spreads.
 * 
 * NEW IN VERSION 03:
 * - Test mode: Generate only 10 pages for testing fonts/colors
 * - Flexible date range: User-defined start and end dates with custom duration
 * - Granular font control: 5 separate font categories with size and color control
 * - Enhanced preferences system with organized panels
 * - NEW: Binding-aware margins for coil binding support
 * 
 * Features:
 * - Weekly spreads with day sections and mini month views
 * - Monthly spreads at the beginning of each month
 * - QR codes on each page containing date information
 * - Customizable styles, colors, and layouts
 * - Test mode for preview and font/color testing
 * - Automatic binding-aware margin calculations for coil binding
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
//@include "lib/qrcode.jsx"  

// Initialize the script with error handling
try {
    // Check if QR code library is available and properly loaded
    if (typeof QRCodeGen.createQRCode !== "function") {
        throw new Error("QR code library not found or not properly initialized. Make sure qrcode.jsx is in the lib folder.");
    }
    
    main();
    alert("Enhanced planner generation complete!");
} catch (e) {
    alert("Error: " + e.message + "\nLine: " + (e.line || "unknown"));
}

/**
 * Main function that orchestrates the enhanced planner generation process
 */
function main() {
    // Check for open document
    if (app.documents.length === 0) {
        throw new Error("Please open a document before running this script.");
    }
    
    var myDocument = app.activeDocument;
    
    // Check for facing pages - critical for proper spread layout and binding-aware margins
    if (!myDocument.documentPreferences.facingPages) {
        throw new Error("This script requires a document with facing pages enabled. Please enable facing pages in Document Setup and try again.");
    }
    
    // Ensure minimum of 2 pages (page 1 for cover, start content on page 2)
    while (myDocument.pages.length < 2) {
        myDocument.pages.add();
    }

    // Get the enhanced user preferences using the new dialog system
    var userPrefs = Preferences.getUserPreferences(myDocument);
    
    // If user canceled the dialog, exit the script
    if (!userPrefs) {
        return;
    }
    
    // Calculate page metrics from the document (legacy format for backward compatibility)
    var pageMetrics = Layout.calculatePageMetrics(myDocument);
    
    // Check for binding-aware margin support and log the information
    var bindingInfo = checkBindingSupport(myDocument);
    $.writeln("[Main] " + bindingInfo.message);
    
    // Set up colors from user preferences if needed
    if (!userPrefs.useExistingColors) {
        ColorManager.setupColors(myDocument, userPrefs);
    }

    // NEW IN V03: Use the enhanced preferences with test mode and flexible date ranges
    if (userPrefs.testMode) {
        // Test mode: Generate only 10 pages for preview
        generateTestPlanner(myDocument, userPrefs.startDate, pageMetrics, userPrefs);
    } else {
        // Full mode: Generate planner from start date to end date
        generateEnhancedPlanner(myDocument, userPrefs.startDate, userPrefs.endDate, pageMetrics, userPrefs);
    }
}

/**
 * NEW: Checks document setup for binding-aware margin support
 * @param {Document} doc - The InDesign document
 * @returns {Object} Information about binding support
 */
function checkBindingSupport(doc) {
    try {
        if (doc.documentPreferences.facingPages) {
            // Try to access inside/outside margins
            var insideMargin = doc.marginPreferences.inside;
            var outsideMargin = doc.marginPreferences.outside;
            
            if (insideMargin !== outsideMargin) {
                return {
                    supported: true,
                    message: "Binding-aware margins detected - Inside: " + insideMargin + "pt, Outside: " + outsideMargin + "pt. Using coil binding layout."
                };
            } else {
                return {
                    supported: false,
                    message: "Equal inside/outside margins detected - Using standard layout. For coil binding, set different inside/outside margins."
                };
            }
        } else {
            return {
                supported: false,
                message: "Document does not have facing pages - Using standard layout."
            };
        }
    } catch (e) {
        // Fallback to left/right margin detection
        var leftMargin = doc.marginPreferences.left;
        var rightMargin = doc.marginPreferences.right;
        
        if (leftMargin !== rightMargin) {
            return {
                supported: true,
                message: "Asymmetric margins detected - Left: " + leftMargin + "pt, Right: " + rightMargin + "pt. Using binding-aware layout."
            };
        } else {
            return {
                supported: false,
                message: "Symmetric margins detected - Using standard layout."
            };
        }
    }
}

/**
 * NEW IN V03: Generates a test planner with only 10 pages for preview purposes
 * @param {Document} doc - The InDesign document
 * @param {Date} startDate - The date to start the planner from
 * @param {Object} pageMetrics - Page size and margin information
 * @param {Object} userPrefs - Enhanced user preferences
 */
function generateTestPlanner(doc, startDate, pageMetrics, userPrefs) {
    var currentPageIndex = 1; // Start on page 2 (index 1), assuming page 1 is cover
    var pagesGenerated = 0;
    var maxPages = 10;
    
    // Start from the first of the start month for consistency
    var currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    
    $.writeln("TEST MODE: Generating maximum " + maxPages + " pages for preview");
    
    // Generate one monthly spread (2 pages) and a few weekly spreads
    if (pagesGenerated < maxPages - 1) {
        // Create one monthly spread for testing
        currentPageIndex = MonthSpread.createMonthSpread(doc, currentDate, currentPageIndex, pageMetrics, userPrefs);
        pagesGenerated += 2; // Monthly spread uses 2 pages
        $.writeln("TEST MODE: Generated monthly spread, total pages: " + pagesGenerated);
    }
    
    // Find the first Monday on or after the first of the month
    var firstMonday = new Date(currentDate);
    while (firstMonday.getDay() !== 1) { // 1 = Monday
        firstMonday.setDate(firstMonday.getDate() + 1);
    }
    
    var weekStartDate = new Date(firstMonday);
    var weekNumber = Utils.getWeekNumber(weekStartDate);
    
    // Generate weekly spreads until we reach 10 pages or end of month
    while (pagesGenerated < maxPages - 1) {
        // Create weekly spread (2 pages)
        currentPageIndex = WeeklyView.createWeekSpread(doc, weekStartDate, weekNumber, currentPageIndex, pageMetrics, userPrefs);
        pagesGenerated += 2; // Weekly spread uses 2 pages
        $.writeln("TEST MODE: Generated weekly spread, total pages: " + pagesGenerated);
        
        // Move to next week
        weekStartDate.setDate(weekStartDate.getDate() + 7);
        weekNumber++;
        
        // Handle week numbers that wrap to next year
        if (weekNumber > 52) {
            weekNumber = 1;
        }
        
        // If we're near the page limit, stop
        if (pagesGenerated >= maxPages - 1) {
            break;
        }
    }
    
    $.writeln("TEST MODE: Completed with " + pagesGenerated + " pages generated");
}

/**
 * NEW IN V03: Generates enhanced planner with flexible date range and granular font settings
 * @param {Document} doc - The InDesign document
 * @param {Date} startDate - The date to start the planner from
 * @param {Date} endDate - The date to end the planner at
 * @param {Object} pageMetrics - Page size and margin information
 * @param {Object} userPrefs - Enhanced user preferences with granular font settings
 */
function generateEnhancedPlanner(doc, startDate, endDate, pageMetrics, userPrefs) {
    var currentPageIndex = 1; // Start on page 2 (index 1), assuming page 1 is cover
    
    // Start from the first of the start month for consistency
    var currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    
    $.writeln("FULL MODE: Generating planner from " + currentDate.toDateString() + " to " + endDate.toDateString());
    
    // Loop through months until we reach end date
    while (currentDate < endDate) {
        $.writeln("Processing month: " + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear());
        
        // Create monthly spread for the month if monthly spreads are enabled
        if (userPrefs.includeMonthly) {
            currentPageIndex = MonthSpread.createMonthSpread(doc, currentDate, currentPageIndex, pageMetrics, userPrefs);
        }
        
        // Find the first Monday on or after the first of the month
        var firstMonday = new Date(currentDate);
        while (firstMonday.getDay() !== 1) { // 1 = Monday
            firstMonday.setDate(firstMonday.getDate() + 1);
        }
        
        // Set our current working date to this Monday
        var weekStartDate = new Date(firstMonday);
        
        // Calculate the week number for this Monday
        var weekNumber = Utils.getWeekNumber(weekStartDate);
        
        // Create weekly spreads until we reach the next month or end date
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
    
    $.writeln("FULL MODE: Planner generation completed");
}