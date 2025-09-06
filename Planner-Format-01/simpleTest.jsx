/*******************************************************************************
 * Basic Tab Test Script
 * 
 * A very basic script to test tab creation with minimal configuration
 *******************************************************************************/

// @targetengine "session"

// Import required modules
//@include "tabPreferences.jsx"
//@include "tabCreator.jsx"

// Initialize the script with error handling
try {
    main();
    alert("Simple tab test complete!");
} catch (e) {
    alert("Error: " + e.message);
}

/**
 * Main function for simple tab testing
 */
function main() {
    // Check for open document
    if (app.documents.length === 0) {
        throw new Error("Please open a document before running this script.");
    }
    
    
    var doc = app.activeDocument;
    
    // Get the current page
    if (doc.pages.length === 0) {
        throw new Error("Document has no pages.");
    }
    
    var currentPage = doc.layoutWindows[0].activePage;
    if (!currentPage) {
        currentPage = doc.pages[0];
    }

    var Bound1 = currentPage.bounds[1];
    var Bound3 = currentPage.bounds[3];
    alert("pageBounds[1] = " + Bound1);
    alert("pageBounds[3] = " + Bound3);
    // Create tabs with minimal configuration - no preferences dialog
    try {
        // Define a simple CMYK color
        var tabColorValues = [100, 0, 0, 0]; // Cyan
        
        // Create color in the document
        var tabColor;
        try {
            tabColor = doc.colors.itemByName("SimpleTabColor");
            if (!tabColor.isValid) {
                tabColor = doc.colors.add({
                    name: "SimpleTabColor",
                    model: ColorModel.PROCESS,
                    colorValue: tabColorValues
                });
            }
        } catch (e) {
            // Create color if any error occurred
            tabColor = doc.colors.add({
                name: "SimpleTabColor",
                model: ColorModel.PROCESS,
                colorValue: tabColorValues
            });
        }
        
        // Minimal tab preferences
        var simpleTabPrefs = {
            tabWidth: 60,      // Width in points
            tabAngle: 10,      // Angle in degrees
            cornerRadius: 6,   // Corner radius in points
            tabIndent: 0,      // No indent from edge
            textRotation: 90,  // Vertical text
            fontSize: 12       // Font size
        };
        
        // Create a right-side tab
        var rightTab = TabCreator.createTab(
            currentPage,      // Current page
            "Right Tab",      // Tab text
            0.3,              // Position at 30% from top
            simpleTabPrefs,   // Tab preferences
            tabColor,         // Tab color
            false             // Right side
        );
        
        // Create a left-side tab
        var leftTab = TabCreator.createTab(
            currentPage,      // Current page
            "Left Tab",       // Tab text
            0.7,              // Position at 70% from top
            simpleTabPrefs,   // Tab preferences
            tabColor,         // Tab color
            true              // Left side
        );
        
        if ((rightTab && rightTab.isValid) || (leftTab && leftTab.isValid)) {
            alert("Tabs created successfully!");
        } else {
            alert("Tab creation failed!");
        }
    } catch (e) {
        throw new Error("Error creating test tab: " + e.message);
    }
}