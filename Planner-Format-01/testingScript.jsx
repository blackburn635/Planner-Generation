/*******************************************************************************
 * InDesign Planner Style Preview Script
 * 
 * This script creates a single sample of monthly and weekly spreads to preview
 * how your selected fonts and colors will look in the planner.
 * 
 * It uses the same preference dialog as the full planner generator but only
 * creates one month and one week instead of an entire year.
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
    // Check if QR code library is available
    if (typeof QRCodeGen !== "object" || typeof QRCodeGen.createQRCode !== "function") {
        $.writeln("Warning: QR code library not properly loaded. QR codes may not appear on the planner pages.");
    }
    
    main();
    alert("Style preview complete! A sample month and week have been created for your evaluation.");
} catch (e) {
    alert("Error: " + e.message + "\nLine: " + (e.line || "unknown"));
}

/**
 * Main function that handles the preview generation
 */
function main() {
    // Check for open document
    if (app.documents.length === 0) {
        // Create a new document with proper settings for planner
        var doc = app.documents.add();
        
        // Set up document properties for planner (letter size, facing pages)
        doc.documentPreferences.pageSize = "Letter";
        doc.documentPreferences.pageOrientation = PageOrientation.PORTRAIT;
        doc.documentPreferences.facingPages = true;
        
        // Set margins (0.5 inch all around)
        doc.marginPreferences.top = 36; // 0.5 inch = 36 points
        doc.marginPreferences.bottom = 36;
        doc.marginPreferences.left = 36;
        doc.marginPreferences.right = 36;
        
        // Ensure we have at least 4 pages (for month and week spreads)
        for (var i = 0; i < 3; i++) {
            doc.pages.add();
        }
    } else {
        var doc = app.activeDocument;
        
        // Check for facing pages - critical for proper spread layout
        if (!doc.documentPreferences.facingPages) {
            throw new Error("This script requires a document with facing pages enabled. Please enable facing pages in Document Setup and try again.");
        }
        
        // Ensure minimum of 4 pages
        while (doc.pages.length < 4) {
            doc.pages.add();
        }
    }

    // Calculate page metrics from the document
    var pageMetrics = Layout.calculatePageMetrics(doc);
    
    // Get the user preferences using the same dialog as the full planner
    var userPrefs = Preferences.getUserPreferences(doc);
    
    // If user canceled the dialog, exit the script
    if (!userPrefs) {
        return;
    }
    
    // Set up colors based on user preferences
    if (!userPrefs.useExistingColors) {
        ColorManager.setupColors(doc, userPrefs);
    }
    
    // Create an informational page at the beginning
    createInfoPage(doc, userPrefs);
    
    // Current date for the sample spreads
    var currentDate = new Date();
    
    // Create sample monthly spread
    // Reset to first day of current month
    var monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    var nextPageIndex = MonthSpread.createMonthSpread(doc, monthDate, 1, pageMetrics, userPrefs);
    
    // Calculate first Monday for weekly spread
    var firstMonday = new Date(monthDate);
    while (firstMonday.getDay() !== 1) { // 1 = Monday
        firstMonday.setDate(firstMonday.getDate() + 1);
    }
    
    // Calculate the week number for this Monday
    var weekNumber = Utils.getWeekNumber(firstMonday);
    
    // Create sample weekly spread
    WeeklyView.createWeekSpread(doc, firstMonday, weekNumber, nextPageIndex, pageMetrics, userPrefs);
}

/**
 * Creates an information page at the beginning with style details
 * @param {Document} doc - The InDesign document
 * @param {Object} userPrefs - User preferences for fonts and colors
 */
function createInfoPage(doc, userPrefs) {
    var infoPage = doc.pages.item(0);
    
    // Set up a large text frame for info
    var infoFrame = infoPage.textFrames.add({
        geometricBounds: [72, 72, 648, 540],
        contents: ""
    });
    
    // Build the content
    var infoText = "PLANNER STYLE PREVIEW\r\r";
    infoText += "This document shows a preview of how your selected styles will look in the planner.\r\r";
    
    infoText += "Selected Fonts:\r";
    infoText += "• Title Font: " + userPrefs.titleFont + "\r";
    infoText += "• Content Font: " + userPrefs.contentFont + "\r";
    infoText += "• Calendar Font: " + userPrefs.calendarFont + "\r\r";
    
    infoText += "Selected Colors:\r";
    infoText += "• Title Font Color: " + userPrefs.titleFontColor + "\r";
    infoText += "• Content Font Color: " + userPrefs.contentFontColor + "\r";
    infoText += "• Calendar Font Color: " + userPrefs.calendarFontColor + "\r";
    infoText += "• Header Color: " + (userPrefs.useExistingColors ? userPrefs.headerColorName : "Custom CMYK (" + 
        userPrefs.headerColorValues[0] + "C, " + 
        userPrefs.headerColorValues[1] + "M, " + 
        userPrefs.headerColorValues[2] + "Y, " + 
        userPrefs.headerColorValues[3] + "K)") + "\r\r";
    
    infoText += "The following pages contain:\r";
    infoText += "• Pages 2-3: Sample Monthly Spread\r";
    infoText += "• Pages 4-5: Sample Weekly Spread\r\r";
    
    infoText += "If you are satisfied with this preview, you can run the full planner generation script.";
    
    // Insert the content
    infoFrame.contents = infoText;
    
    // Style the text
    try {
        // Title styling
        infoFrame.paragraphs[0].appliedFont = userPrefs.titleFont;
        infoFrame.paragraphs[0].pointSize = 24;
        infoFrame.paragraphs[0].justification = Justification.CENTER_ALIGN;
        try { infoFrame.paragraphs[0].fillColor = userPrefs.headerColorName; } catch(e) {}
        
        // Apply content font to the rest
        for (var i = 1; i < infoFrame.paragraphs.length; i++) {
            infoFrame.paragraphs[i].appliedFont = userPrefs.contentFont;
            infoFrame.paragraphs[i].pointSize = 12;
        }
        
        // Show a color swatch for the header color
        var colorSwatch = infoPage.rectangles.add({
            geometricBounds: [250, 72, 280, 170],
            fillColor: userPrefs.headerColorName,
            strokeColor: "Black",
            strokeWeight: 0.5
        });
        
        // Add label for the swatch
        var swatchLabel = infoPage.textFrames.add({
            geometricBounds: [282, 72, 300, 170],
            contents: "Header Color"
        });
        
        swatchLabel.texts[0].appliedFont = userPrefs.contentFont;
        swatchLabel.texts[0].pointSize = 10;
        
    } catch (e) {
        // Continue even if styling fails
        $.writeln("Warning: Could not fully style the info page: " + e.message);
    }
}