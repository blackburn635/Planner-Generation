/*******************************************************************************
 * Tab Testing Script
 * 
 * A test script to verify tab creation functionality before integration
 * with the main planner generation script.
 * 
 * This script:
 * - Asks for tab preferences using a dialog
 * - Creates a sample tab on the current page
 * - Tests tab appearance and positioning
 *******************************************************************************/

// @targetengine "session"

// Import required modules
//@include "tabPreferences.jsx"
//@include "tabCreator.jsx"

// Initialize the script with error handling
try {
    main();
    alert("Tab creation test complete!");
} catch (e) {
    alert("Error: " + e.message);
}

/**
 * Main function that handles the tab testing
 */
function main() {
    // Check for open document
    if (app.documents.length === 0) {
        throw new Error("Please open a document before running this script.");
    }
    
    var doc = app.activeDocument;
    
    // Get the tab preferences using a dialog
    var tabPrefs = TabPreferences.getTabPreferences(doc);
    
    // If user canceled the dialog, exit the script
    if (!tabPrefs) {
        return;
    }
    
    // Get the current page
    if (doc.pages.length === 0) {
        throw new Error("Document has no pages.");
    }
    
    var currentPage = doc.layoutWindows[0].activePage;
    if (!currentPage) {
        currentPage = doc.pages[0];
    }
    
    // Let's start with a single tab for testing
    try {
        $.writeln("\n--- Testing Single Tab Creation ---");
        
        // Get tab color for January
        var tabColor = TabPreferences.getMonthTabColor(doc, 0, tabPrefs);
        
        // Create a single test tab at the center of the right edge
        var testTab = TabCreator.createTab(
            currentPage,
            "January", // Just test with January
            0.5,       // Center position
            tabPrefs,
            tabColor,
            false      // right side
        );
        
        // If the single tab works, try multiple tabs
        if (testTab) {
            $.writeln("Single tab created successfully, trying multiple tabs...");
            createAllMonthTabs(doc, currentPage, tabPrefs);
        }
    } catch (e) {
        $.writeln("Error creating single tab: " + e.message);
        throw new Error("Error creating test tabs: " + e.message);
    }
}

/**
 * Creates test tabs for all months
 */
function createAllMonthTabs(doc, page, tabPrefs) {
    // Test right-side tabs with month names
    var monthNames = ["January", "February", "March", "April", "May", "June", 
                     "July", "August", "September", "October", "November", "December"];
    
    try {
        // Create tabs for 3 months at first, not all 12
        var months = 3;
        
        for (var i = 0; i < months; i++) {
            // Calculate vertical position (distribute evenly)
            var position = i / (months - 1);
            
            // Get tab color for this month
            var tabColor = TabPreferences.getMonthTabColor(doc, i, tabPrefs);
            
            $.writeln("Creating tab for " + monthNames[i] + " at position " + position);
            
            // Create tab on the right side
            var tab = TabCreator.createTab(
                page,
                monthNames[i],
                position,
                tabPrefs,
                tabColor,
                false // right side
            );
            
            if (tab) {
                $.writeln(monthNames[i] + " tab created successfully");
            }
        }
        
        // Create a sample tab on the left side for comparison
        TabCreator.createTab(
            page,
            "Left Tab",
            0.5, // Center position
            tabPrefs,
            tabColor,
            true // left side
        );
        
    } catch (e) {
        $.writeln("Error in createAllMonthTabs: " + e.message);
        throw e;
    }
}