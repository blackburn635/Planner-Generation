/*******************************************************************************
 * InDesign Color Picker Test
 * 
 * Testing what color selection options are available in InDesign dialogs
 *******************************************************************************/

// @targetengine "session"

try {
    testColorPickerOptions();
} catch (e) {
    alert("Error: " + e.message);
}

function testColorPickerOptions() {
    if (app.documents.length === 0) {
        alert("Please open a document to test color picker options.");
        return;
    }
    
    var dialog = app.dialogs.add({name: "Color Picker Test"});
    
    try {
        var column = dialog.dialogColumns.add();
        
        // Test 1: Check if there's a native color control
        var colorTestPanel = column.borderPanels.add();
        colorTestPanel.staticTexts.add({staticLabel: "NATIVE COLOR CONTROLS TEST"});
        
        try {
            // Try different possible color control names
            colorTestPanel.staticTexts.add({staticLabel: "Attempting colorControls:"});
            var colorControl1 = colorTestPanel.colorControls.add();
            colorTestPanel.staticTexts.add({staticLabel: "Success! colorControls exists"});
        } catch (e) {
            colorTestPanel.staticTexts.add({staticLabel: "colorControls not available"});
        }
        
        try {
            colorTestPanel.staticTexts.add({staticLabel: "Attempting colorPickers:"});
            var colorPicker1 = colorTestPanel.colorPickers.add();
            colorTestPanel.staticTexts.add({staticLabel: "Success! colorPickers exists"});
        } catch (e) {
            colorTestPanel.staticTexts.add({staticLabel: "colorPickers not available"});
        }
        
        try {
            colorTestPanel.staticTexts.add({staticLabel: "Attempting colorChoosers:"});
            var colorChooser1 = colorTestPanel.colorChoosers.add();
            colorTestPanel.staticTexts.add({staticLabel: "Success! colorChoosers exists"});
        } catch (e) {
            colorTestPanel.staticTexts.add({staticLabel: "colorChoosers not available"});
        }
        
        // Test 2: Create a preset color palette using radio buttons
        var palettePanel = column.borderPanels.add();
        palettePanel.staticTexts.add({staticLabel: "PRESET COLOR PALETTE"});
        palettePanel.staticTexts.add({staticLabel: "Choose a color scheme:"});
        
        var colorGroup = palettePanel.radiobuttonGroups.add();
        var blueScheme = colorGroup.radiobuttonControls.add({
            staticLabel: "Blue Scheme (C:85 M:10 Y:10 K:0)",
            checkedState: true
        });
        var redScheme = colorGroup.radiobuttonControls.add({
            staticLabel: "Red Scheme (C:15 M:85 Y:75 K:0)",
            checkedState: false
        });
        var greenScheme = colorGroup.radiobuttonControls.add({
            staticLabel: "Green Scheme (C:65 M:0 Y:85 K:0)",
            checkedState: false
        });
        var purpleScheme = colorGroup.radiobuttonControls.add({
            staticLabel: "Purple Scheme (C:75 M:85 Y:0 K:0)",
            checkedState: false
        });
        var orangeScheme = colorGroup.radiobuttonControls.add({
            staticLabel: "Orange Scheme (C:0 M:65 Y:85 K:0)",
            checkedState: false
        });
        var customScheme = colorGroup.radiobuttonControls.add({
            staticLabel: "Custom CMYK (enter below)",
            checkedState: false
        });
        
        // Test 3: Custom CMYK input (current method)
        var customPanel = column.borderPanels.add();
        customPanel.staticTexts.add({staticLabel: "CUSTOM CMYK INPUT"});
        customPanel.staticTexts.add({staticLabel: "Cyan %:"});
        var cyanField = customPanel.realEditboxes.add({editValue: 20});
        customPanel.staticTexts.add({staticLabel: "Magenta %:"});
        var magentaField = customPanel.realEditboxes.add({editValue: 40});
        customPanel.staticTexts.add({staticLabel: "Yellow %:"});
        var yellowField = customPanel.realEditboxes.add({editValue: 60});
        customPanel.staticTexts.add({staticLabel: "Black %:"});
        var blackField = customPanel.realEditboxes.add({editValue: 0});
        
        if (dialog.show()) {
            var result = "COLOR PICKER TEST RESULTS:\n\n";
            
            // Report which native controls worked
            try {
                if (colorControl1) result += "✓ colorControls available\n";
            } catch (e) {
                result += "✗ colorControls not available\n";
            }
            
            try {
                if (colorPicker1) result += "✓ colorPickers available\n";
            } catch (e) {
                result += "✗ colorPickers not available\n";
            }
            
            try {
                if (colorChooser1) result += "✓ colorChoosers available\n";
            } catch (e) {
                result += "✗ colorChoosers not available\n";
            }
            
            // Report selected color scheme
            result += "\nSelected Color Scheme: ";
            if (blueScheme.checkedState) {
                result += "Blue (C:85 M:10 Y:10 K:0)\n";
            } else if (redScheme.checkedState) {
                result += "Red (C:15 M:85 Y:75 K:0)\n";
            } else if (greenScheme.checkedState) {
                result += "Green (C:65 M:0 Y:85 K:0)\n";
            } else if (purpleScheme.checkedState) {
                result += "Purple (C:75 M:85 Y:0 K:0)\n";
            } else if (orangeScheme.checkedState) {
                result += "Orange (C:0 M:65 Y:85 K:0)\n";
            } else if (customScheme.checkedState) {
                result += "Custom CMYK (" + cyanField.editValue + "," + 
                         magentaField.editValue + "," + yellowField.editValue + 
                         "," + blackField.editValue + ")\n";
            }
            
            result += "\nWould you like to:\n";
            result += "A) Use preset color schemes (radio buttons)\n";
            result += "B) Keep custom CMYK input\n";
            result += "C) Combine both options\n";
            result += "D) Try a different approach if native color controls exist";
            
            alert(result);
        }
        
    } catch (e) {
        alert("Error in color picker test: " + e.message);
    } finally {
        if (dialog && dialog.isValid) {
            dialog.destroy();
        }
    }
}

/*
POTENTIAL COLOR PALETTE APPROACHES:

1. PRESET COLOR SCHEMES (Radio Buttons)
   - Professional Blue, Warm Red, Natural Green, etc.
   - Each with pre-defined CMYK values
   - Easy to choose, visually appealing names

2. DOCUMENT COLOR DROPDOWN (Already working)
   - Uses existing colors in the document
   - Good for maintaining consistency

3. CUSTOM CMYK INPUT (Current method)
   - Full control over exact values
   - Professional workflow

4. HYBRID APPROACH
   - Preset schemes + custom option
   - Best of both worlds

5. NATIVE COLOR PICKER (If available)
   - InDesign's built-in color selection
   - Most professional option
*/