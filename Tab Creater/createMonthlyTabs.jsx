/*******************************************************************************
 * InDesign Monthly Tab Creator Script
 * 
 * Creates monthly tabs for planner layouts with customizable colors and positioning.
 * This is designed to be modular and separate from the main planner generator.
 * 
 * Features:
 * - Creates master page spreads for each month's tabs
 * - Front tabs (right page edge) and back tabs (left page edge)
 * - Color gradient across months (interpolating between two colors)
 * - Customizable tab width, font, and colors
 * - Evenly distributed tab positions
 *******************************************************************************/

// @targetengine "session"

// Import required modules
//@include "modules/tabPreferences.jsx"
//@include "modules/tabCreator.jsx"
//@include "modules/tabColors.jsx"

// Initialize the script with error handling
try {
    main();
    alert("Monthly tabs creation complete!");
} catch (e) {
    alert("Error: " + e.message + "\nLine: " + (e.line || "unknown"));
}

/**
 * Main function that orchestrates the tab creation process
 */
function main() {
    // Check for open document
    if (app.documents.length === 0) {
        throw new Error("Please open a document before running this script.");
    }
    
    var doc = app.activeDocument;
    
    // Check for facing pages - critical for proper tab layout
    if (!doc.documentPreferences.facingPages) {
        throw new Error("This script requires a document with facing pages enabled. Please enable facing pages in Document Setup and try again.");
    }
    
    // Get user preferences using dialog
    var userPrefs = TabPreferences.getUserPreferences(doc);
    
    // If user canceled the dialog, exit the script
    if (!userPrefs) {
        return;
    }
    
    // Create colors for tabs
    var tabColors = TabColors.createMonthlyTabColors(
        doc, 
        userPrefs.startColor, 
        userPrefs.endColor, 
        userPrefs.middleColor, 
        userPrefs.useThreeColorMode
    );
    
    // Calculate tab heights based on document size and number of tabs
    var pageHeight = doc.documentPreferences.pageHeight;
    var tabHeight = (pageHeight - (2 * userPrefs.tabMargin)) / 12;
    
    // Create master spreads for tabs
    TabCreator.createMonthlyTabs(doc, userPrefs, tabColors, tabHeight);
}