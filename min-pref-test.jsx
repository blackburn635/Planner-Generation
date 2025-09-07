/*******************************************************************************
 * Basic Dialog Elements Test
 * 
 * Testing only the most fundamental dialog elements for compatibility
 *******************************************************************************/

// @targetengine "session"

try {
    testBasicDialogElements();
} catch (e) {
    alert("Error: " + e.message);
}

function testBasicDialogElements() {
    if (app.documents.length === 0) {
        alert("Please open a document to test basic dialog elements.");
        return;
    }
    
    var dialog = app.dialogs.add({name: "Basic Elements Test"});
    
    try {
        var column = dialog.dialogColumns.add();
        
        // Test 1: Basic static text
        column.staticTexts.add({staticLabel: "SECTION HEADER"});
        column.staticTexts.add({staticLabel: "Regular text label"});
        
        // Test 2: Border panel approach
        var panel = column.borderPanels.add();
        panel.staticTexts.add({staticLabel: "PANEL SECTION"});
        panel.staticTexts.add({staticLabel: "Text inside panel"});
        
        // Test 3: Checkbox (usually works everywhere)
        var checkbox = column.checkboxControls.add({
            staticLabel: "Checkbox option",
            checkedState: false
        });
        
        // Test 4: Try simple dropdown without row
        column.staticTexts.add({staticLabel: "Font selection:"});
        var dropdown = column.dropdowns.add({
            stringList: ["Arial", "Helvetica", "Times"],
            selectedIndex: 0
        });
        
        // Test 5: Try simple editbox without row
        column.staticTexts.add({staticLabel: "Size value:"});
        var editbox = column.realEditboxes.add({editValue: 12});
        
        if (dialog.show()) {
            alert("Test complete! Please tell me:\n\n" +
                  "1. Are the section headers left-aligned?\n" +
                  "2. Are the panel texts left-aligned?\n" +
                  "3. Are ALL texts still right-aligned?\n\n" +
                  "We'll use whatever approach works for your system.");
        }
        
    } catch (e) {
        alert("Error in basic test: " + e.message);
    } finally {
        if (dialog && dialog.isValid) {
            dialog.destroy();
        }
    }
}