// InDesign Font Sample Generator Script - Individual Text Frames
// This script creates individual 50pt high text frames for each font sample

(function() {
    // Check if InDesign is running
    if (app.name !== "Adobe InDesign") {
        alert("This script must be run from Adobe InDesign.");
        return;
    }
    
    //set document as active document
    var myDocument = app.activeDocument;

    // Calculate page metrics from the document (legacy format for backward compatibility)
    //var pageMetrics = Layout.calculatePageMetrics(myDocument);

    //Script settings
    var FONT_SIZE = 14;
    var TEXT_FRAME_HEIGHT = 40;
    var SAMPLE_TEXT = " - ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789";
    
    try {
        
        // Get existing page metrics from the document
        var page = myDocument.pages[0];
        var pageBounds = page.bounds; // [top, left, bottom, right]
        var marginBounds = page.marginPreferences;
        
        var pageTop = pageBounds[0];
        var pageLeft = pageBounds[1];
        var pageBottom = pageBounds[2];
        var pageRight = pageBounds[3];
        
        var marginTop = marginBounds.top;
        var marginLeft = marginBounds.left;
        var marginBottom = marginBounds.bottom;
        var marginRight = marginBounds.right;

        // Calculate actual content area from existing document settings
        var contentTop = pageTop + marginTop;// InDesign Font Sample Generator Script - Individual Text Frames
// This script creates individual 50pt high text frames for each font sample

(function() {
    // Check if InDesign is running
    if (app.name !== "Adobe InDesign") {
        alert("This script must be run from Adobe InDesign.");
        return;
    }
    
    //set document as active document
    var myDocument = app.activeDocument;

    //Script settings
    var FONT_SIZE = 14;
    var TEXT_FRAME_HEIGHT = 50;
    var SAMPLE_TEXT = " - ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789";
    var INCLUDE_SYMBOL_FONTS = true; // Set to true if you want to include symbol/dingbat fonts
    var SEPARATE_SYMBOL_FONTS = true; // Set to true to process symbol fonts after regular fonts with a header
    var TEST_FONT_RENDERING = true; // Set to true to test if fonts actually render readable characters
    var USE_SKIP_LIST = true; // Set to true to skip fonts in the skip list
    
    // List of fonts to skip/omit
    var FONTS_TO_SKIP = [
        "Al Bayan", "Al Nile", "Al Tarikh", "Apple Braille", "Apple Color Emoji",
        "Arial Hebrew", "Beirut", "Corsiva", "Damascus", "DecoType", "Devanagari",
        "Diwan", "EmojiOne", "Farah", "Farisi", "GB18030Bitmap", "Geeza", "Gujarati",
        "Iowan", "ITF", "Jaini", "Kailasa", "Kohinoor", "Kokonor", "Kufi", "Lahore",
        "Mishafi", "Mshtakan", "Muna", "Nadeem", "New Peninim", "Noto", "Raanana",
        "Sama", "Sana", "STIXIntegrals", "STIXNonUnicode", "STIXSize", "STIXVariants",
        "Waseem", "STFangsong", "Songti", "Ayuthaya", "Baghdad"
    ];
    
    // Global variables for page management
    var currentPage;
    var currentFrameOnPage;
    var framesPerPage;
    var contentTop, contentLeft, contentRight;
    
    try {
        
        // Get existing page metrics from the document
        var page = myDocument.pages[0];
        var pageBounds = page.bounds; // [top, left, bottom, right]
        var marginBounds = page.marginPreferences;
        
        var pageTop = pageBounds[0];
        var pageLeft = pageBounds[1];
        var pageBottom = pageBounds[2];
        var pageRight = pageBounds[3];
        
        var marginTop = marginBounds.top;
        var marginLeft = marginBounds.left;
        var marginBottom = marginBounds.bottom;
        var marginRight = marginBounds.right;

        // Calculate actual content area from existing document settings
        contentTop = pageTop + marginTop;
        contentLeft = pageLeft + marginLeft;
        var contentBottom = pageBottom - marginBottom;
        contentRight = pageRight - marginRight;

        // Calculate usable Height
        var usableHeight = contentBottom - contentTop;
        
        // Calculate how many text frames fit per page
        framesPerPage = Math.floor(usableHeight / TEXT_FRAME_HEIGHT);
        
        // Get all fonts and sort them alphabetically
        var fonts = app.fonts.everyItem().getElements();
        fonts.sort(function(a, b) {
            return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        });
        
        currentPage = myDocument.pages[0];
        currentFrameOnPage = 0;
        var processedFonts = 0;
        var skippedSymbolFonts = 0;
        var processedSymbolFonts = 0;
        var skippedFromList = 0;
        
        // Separate fonts into regular and symbol fonts if separation is enabled
        if (SEPARATE_SYMBOL_FONTS && INCLUDE_SYMBOL_FONTS) {
            var regularFonts = [];
            var symbolFonts = [];
            
            // Sort fonts into two arrays
            for (var i = 0; i < fonts.length; i++) {
                var font = fonts[i];
                var fontName = font.name;
                
                // Skip problematic fonts
                if (fontName.indexOf("[No") === 0 || fontName === "" || fontName.indexOf("Missing") >= 0) {
                    continue;
                }
                
                // Skip fonts from the skip list
                if (USE_SKIP_LIST && shouldSkipFont(fontName)) {
                    skippedFromList++;
                    continue;
                }
                
                if (isSymbolFont(font, fontName)) {
                    symbolFonts.push(font);
                } else {
                    regularFonts.push(font);
                }
            }
            
            // Process regular fonts first
            if (regularFonts.length > 0) {
                addSectionHeader("REGULAR TEXT FONTS");
                processedFonts += processFontArray(regularFonts, false);
            }
            
            // Add separator and process symbol fonts
            if (symbolFonts.length > 0) {
                addSectionHeader("SYMBOL & DINGBAT FONTS");
                processedSymbolFonts = processFontArray(symbolFonts, true);
                processedFonts += processedSymbolFonts;
            }
            
        } else {
            // Original processing method - all fonts together
            processedFonts = processFontArray(fonts, false);
        }
        
        // Go to first page
        app.activeWindow.activePage = myDocument.pages[0];
        
        // Success message
        var symbolMessage = "";
        if (SEPARATE_SYMBOL_FONTS && INCLUDE_SYMBOL_FONTS) {
            symbolMessage = "\nRegular fonts: " + (processedFonts - processedSymbolFonts) + 
                           "\nSymbol fonts: " + processedSymbolFonts;
        } else if (!INCLUDE_SYMBOL_FONTS) {
            symbolMessage = "\nSkipped " + skippedSymbolFonts + " symbol/dingbat fonts";
        }
        
        alert("Font sample document created successfully!\n\n" + 
              "Total processed: " + processedFonts + " fonts\n" +
              "Pages created: " + myDocument.pages.length + "\n" +
              "Text frames per page: " + framesPerPage + "\n" +
              "Text frame height: " + TEXT_FRAME_HEIGHT + " points" +
              symbolMessage + "\n\n" +
              "Each font sample is in its own text frame spanning the usable page width.\n" +
              (SEPARATE_SYMBOL_FONTS ? "Symbol fonts are in a separate section with special characters.\n" : 
               "Set INCLUDE_SYMBOL_FONTS to true to include symbol fonts.\n") +
              (TEST_FONT_RENDERING ? "Fonts were tested for readable character rendering." : 
               "Font detection was name-based only."));
              
    } catch (error) {
        alert("An error occurred while creating the font sample document:\n" + error.toString());
    }
    
    /**
     * Process an array of fonts and create samples
     * @param {Array} fontArray - Array of fonts to process
     * @param {Boolean} isSymbolSection - Whether this is the symbol section
     * @returns {Number} Number of fonts processed
     */
    function processFontArray(fontArray, isSymbolSection) {
        var fontsProcessed = 0;
        
        // Process each font in the array
        for (var i = 0; i < fontArray.length; i++) {
            var font = fontArray[i];
            var fontName = font.name;
            
            // Skip problematic fonts
            if (fontName.indexOf("[No") === 0 || fontName === "" || fontName.indexOf("Missing") >= 0) {
                continue;
            }
            
            // Skip fonts from the skip list
            if (USE_SKIP_LIST && shouldSkipFont(fontName)) {
                continue;
            }
            
            // Skip symbol fonts if not including them and not in symbol section
            if (!INCLUDE_SYMBOL_FONTS && !isSymbolSection && isSymbolFont(font, fontName)) {
                continue;
            }
            
            // Check if we need a new page
            if (currentFrameOnPage >= framesPerPage) {
                currentPage = myDocument.pages.add();
                currentFrameOnPage = 0;
            }
            
            // Calculate Y position for this text frame
            var yPosition = contentTop + (currentFrameOnPage * TEXT_FRAME_HEIGHT);
            
            try {
                // Create individual text frame for this font sample
                var textFrame = currentPage.textFrames.add();
                
                textFrame.geometricBounds = [
                    yPosition,
                    contentLeft,
                    yPosition + TEXT_FRAME_HEIGHT,
                    contentRight
                ];
                
                // Create the sample text: Arial font name + actual font name + sample characters
                var sampleText = isSymbolSection ? 
                    " - !@#$%^&*()_+-=[]{}|;:,.<>? ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789" : 
                    SAMPLE_TEXT;
                
                // Format: "Arial Font Name - Actual Font: Font Name + sample text"
                var arialFontName = fontName + " - ";
                var actualFontText = fontName + sampleText;
                var fullSampleText = arialFontName + actualFontText;
                textFrame.contents = fullSampleText;
                
                // Apply fonts: Arial for first part, actual font for second part
                var textObj = textFrame.texts[0];
                
                // Apply Arial to the entire text first
                textObj.appliedFont = "Arial\tRegular";
                textObj.pointSize = FONT_SIZE;
                textObj.justification = Justification.LEFT_ALIGN;
                
                // Then apply the actual font to the second part (after the " - ")
                if (textObj.characters.length > arialFontName.length) {
                    try {
                        var actualFontRange = textObj.characters.itemByRange(
                            arialFontName.length, 
                            textObj.characters.length - 1
                        );
                        actualFontRange.appliedFont = font;
                    } catch (rangeError) {
                        // If range selection fails, just use Arial for everything
                        // This ensures we can always read the font name
                    }
                }
                
                textFrame.textFramePreferences.verticalJustification = VerticalJustification.CENTER_ALIGN;
                
                fontsProcessed++;
                currentFrameOnPage++;
                
            } catch (fontError) {
                // Create error note
                try {
                    var errorFrame = currentPage.textFrames.add();
                    errorFrame.geometricBounds = [
                        yPosition,
                        contentLeft,
                        yPosition + TEXT_FRAME_HEIGHT,
                        contentRight
                    ];
                    errorFrame.contents = fontName + " - (Error: Font could not be displayed)";
                    
                    var errorText = errorFrame.texts[0];
                    errorText.pointSize = FONT_SIZE;
                    errorText.fillColor = "Red";
                    errorFrame.textFramePreferences.verticalJustification = VerticalJustification.CENTER_ALIGN;
                    
                    currentFrameOnPage++;
                } catch (errorFrameError) {
                    // Skip if we can't create error frame
                }
                continue;
            }
            
            // Progress update every 50 fonts
            if (fontsProcessed % 50 === 0) {
                app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
                app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL;
            }
        }
        
        return fontsProcessed;
    }
    
    /**
     * Add a section header
     * @param {String} title - Title for the section
     */
    function addSectionHeader(title) {
        // Check if we need a new page for the header
        if (currentFrameOnPage >= framesPerPage - 2) { // Leave room for header and at least one font
            currentPage = myDocument.pages.add();
            currentFrameOnPage = 0;
        }
        
        var yPosition = contentTop + (currentFrameOnPage * TEXT_FRAME_HEIGHT);
        var headerHeight = TEXT_FRAME_HEIGHT * 1.5; // Make header taller
        
        try {
            var headerFrame = currentPage.textFrames.add();
            headerFrame.geometricBounds = [
                yPosition,
                contentLeft,
                yPosition + headerHeight,
                contentRight
            ];
            
            headerFrame.contents = "\n" + title + "\n" + createUnderline(title.length);
            
            var headerText = headerFrame.texts[0];
            headerText.appliedFont = "Arial\tRegular"; // Use Arial for headers
            headerText.pointSize = 16;
            headerText.fontStyle = "Bold";
            headerText.justification = Justification.CENTER_ALIGN;
            headerText.fillColor = "Black";
            
            headerFrame.textFramePreferences.verticalJustification = VerticalJustification.CENTER_ALIGN;
            
            // Reserve space for the header - increment by 2 to give extra spacing
            currentFrameOnPage += 2;
            
        } catch (headerError) {
            // If header creation fails, just continue but still increment position
            currentFrameOnPage += 2;
        }
    }
    /**
     * Function to test if a font actually renders readable characters
     * @param {Font} font - The InDesign font object
     * @param {String} fontName - The font name string
     * @returns {Boolean} True if the font produces rectangles/unreadable characters
     */
    function isSymbolFont(font, fontName) {
        // First do a quick name-based check for obvious symbol fonts
        var obviousSymbolKeywords = ["wingding", "webding", "zapf dingbat", "symbol", "marlett"];
        var lowerFontName = fontName.toLowerCase();
        
        for (var i = 0; i < obviousSymbolKeywords.length; i++) {
            if (lowerFontName.indexOf(obviousSymbolKeywords[i]) >= 0) {
                return true;
            }
        }
        
        // If testing is disabled, only use name-based detection
        if (!TEST_FONT_RENDERING) {
            return false;
        }
        
        // Now test if the font actually renders readable characters
        return testFontRendering(font);
    }
    
    /**
     * Test if a font renders readable characters by checking character support
     * @param {Font} font - The InDesign font object
     * @returns {Boolean} True if font produces rectangles/unreadable characters
     */
    function testFontRendering(font) {
        try {
            // Create a temporary text frame for testing
            var testFrame = currentPage.textFrames.add();
            
            // Position it off-page so it's not visible
            testFrame.geometricBounds = [-200, -200, -150, -50];
            
            // Test with basic characters that should render in any text font
            var testText = "ABCabc123";
            testFrame.contents = testText;
            
            // Apply the font
            var textObj = testFrame.texts[0];
            textObj.appliedFont = font;
            textObj.pointSize = 12;
            
            var isSymbolFont = false;
            
            // Method 1: Check if characters have reasonable widths
            try {
                // Get the story and check character widths
                var story = testFrame.parentStory;
                
                // Check if we can get individual character information
                var chars = story.characters;
                if (chars.length > 0) {
                    // Test if basic letters A, B, C have different widths (normal text fonts)
                    // or if they all have the same width (often indicates symbol fonts)
                    var widths = [];
                    var testChars = ['A', 'B', 'C', 'a', 'b', 'c', '1', '2', '3'];
                    
                    for (var i = 0; i < Math.min(testChars.length, chars.length); i++) {
                        try {
                            // Try to get character bounds or properties
                            var currentChar = chars[i];
                            if (currentChar.contents === testChars[i]) {
                                // Character matches what we expect - good sign
                                continue;
                            } else {
                                // Character doesn't match - possible symbol font
                                isSymbolFont = true;
                                break;
                            }
                        } catch (charError) {
                            // If we can't read character properties, might be symbol font
                            isSymbolFont = true;
                            break;
                        }
                    }
                }
            } catch (widthError) {
                // If we can't measure characters, assume it might be problematic
                isSymbolFont = true;
            }
            
            // Method 2: Check if the font supports basic ASCII range
            try {
                // Try to check font glyph availability for basic characters
                var basicChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                
                // Apply each character and see if it renders properly
                var problematicChars = 0;
                for (var j = 0; j < Math.min(10, basicChars.length); j++) {
                    try {
                        testFrame.contents = basicChars.charAt(j);
                        textObj.appliedFont = font;
                        
                        // If the character renders as the same character, it's probably okay
                        // This is hard to test directly, so we'll rely on other methods
                        
                    } catch (renderError) {
                        problematicChars++;
                    }
                }
                
                // If many characters failed to render, probably a symbol font
                if (problematicChars > 5) {
                    isSymbolFont = true;
                }
                
            } catch (glyphError) {
                // If glyph testing fails, might be symbol font
                isSymbolFont = true;
            }
            
            // Method 3: Check font family properties
            try {
                var fontFamily = font.fontFamily;
                var fontStyle = font.fontStyleName;
                
                // Some fonts have family names that indicate they're symbol fonts
                if (fontFamily && fontFamily.toLowerCase().indexOf("symbol") >= 0) {
                    isSymbolFont = true;
                }
                
                // Check for mathematical or technical font families
                if (fontFamily && (
                    fontFamily.toLowerCase().indexOf("math") >= 0 ||
                    fontFamily.toLowerCase().indexOf("technical") >= 0 ||
                    fontFamily.toLowerCase().indexOf("ornament") >= 0
                )) {
                    isSymbolFont = true;
                }
                
            } catch (familyError) {
                // Continue if family properties aren't available
            }
            
            // Clean up test frame
            testFrame.remove();
            
            return isSymbolFont;
            
        } catch (testError) {
            // If testing completely fails, default to including the font
            // Better to include a questionable font than exclude a good one
            return false;
        }
    }
    
    /**
     * Creates an underline of equal signs for headers
     * @param {Number} length - Length of the underline
     * @returns {String} String of equal signs
     */
    function createUnderline(length) {
        var underline = "";
        for (var i = 0; i < length; i++) {
            underline += "=";
        }
        return underline;
    }
    
    /**
     * Check if a font should be skipped based on the skip list
     * @param {String} fontName - The font name to check
     * @returns {Boolean} True if the font should be skipped
     */
    function shouldSkipFont(fontName) {
        if (!USE_SKIP_LIST) {
            return false;
        }
        
        // Check if font name contains any of the fonts to skip
        for (var i = 0; i < FONTS_TO_SKIP.length; i++) {
            if (fontName.indexOf(FONTS_TO_SKIP[i]) >= 0) {
                return true;
            }
        }
        
        return false;
    }
    
})();

// Additional utility function for debugging frame positions
function debugFramePosition(frame, fontName) {
    var bounds = frame.geometricBounds;
    $.writeln("Font: " + fontName + " - Frame bounds: [" + 
              bounds[0] + ", " + bounds[1] + ", " + bounds[2] + ", " + bounds[3] + "]");
}
        var contentLeft = pageLeft + marginLeft;
        var contentBottom = pageBottom - marginBottom;
        var contentRight = pageRight - marginRight;

        // Calculate usable Height
        var usableHeight = contentBottom - contentTop;
        
        // Calculate how many text frames fit per page
        var framesPerPage = Math.floor(usableHeight / TEXT_FRAME_HEIGHT);
        
        // Get all fonts and sort them alphabetically
        var fonts = app.fonts.everyItem().getElements();
        fonts.sort(function(a, b) {
            return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        });
        
        var currentPage = myDocument.pages[0];
        var currentFrameOnPage = 0;
        var processedFonts = 0;
        
        // Process each font
        for (var i = 0; i < fonts.length; i++) {
            var font = fonts[i];
            var fontName = font.name;
            
            // Skip problematic fonts
            if (fontName.indexOf("[No") === 0 || fontName === "" || fontName.indexOf("Missing") >= 0) {
                continue;
            }
            
            // Check if we need a new page
            if (currentFrameOnPage >= framesPerPage) {
                // Add new page
                currentPage = myDocument.pages.add();
                currentFrameOnPage = 0;
            }
            
            // Calculate Y position for this text frame
            var yPosition = contentTop + (currentFrameOnPage * TEXT_FRAME_HEIGHT);
            
            try {
                // Create individual text frame for this font sample
                var textFrame = currentPage.textFrames.add();
                
                // Set geometric bounds for 50pt high frame spanning usable width
                textFrame.geometricBounds = [
                    yPosition,                           // Top
                    contentLeft,                        // Left (left margin)
                    yPosition + TEXT_FRAME_HEIGHT,      // Bottom 
                    contentRight             // Right (right margin)
                ];
                
                // Create the sample text: font name + sample characters
                var fullSampleText = fontName + SAMPLE_TEXT;
                textFrame.contents = fullSampleText;
                
                // Apply the font to the entire text
                var textObj = textFrame.texts[0];
                textObj.appliedFont = font;
                textObj.pointSize = FONT_SIZE;
                textObj.justification = Justification.LEFT_ALIGN;
                
                // Set text frame preferences for better text positioning
                textFrame.textFramePreferences.verticalJustification = VerticalJustification.CENTER_ALIGN;
                //textFrame.textFramePreferences.firstBaselineOffset = FirstBaseline.CAP_HEIGHT;
                
                // Try to make font name bold if possible
                /*try {
                    var fontNameLength = fontName.length;
                    if (fontNameLength > 0) {
                        var fontNameRange = textFrame.texts[0].characters.itemByRange(0, fontNameLength - 1);
                        fontNameRange.fontStyle = "Bold";
                    }
                } catch (boldError) {
                    // Continue if bold style not available for this font
                }*/
                
                processedFonts++;
                currentFrameOnPage++;
                
            } catch (fontError) {
                // If there's an error with this font, create an error note
                try {
                    var errorFrame = currentPage.textFrames.add();
                    errorFrame.geometricBounds = [
                        yPosition,
                        contentLeft,
                        yPosition + TEXT_FRAME_HEIGHT,
                        contentRight
                    ];
                    errorFrame.contents = fontName + " - (Error: Font could not be displayed)";
                    
                    var errorText = errorFrame.texts[0];
                    errorText.pointSize = FONT_SIZE;
                    errorText.fillColor = "Red";
                    errorFrame.textFramePreferences.verticalJustification = VerticalJustification.CENTER_ALIGN;
                    
                    currentFrameOnPage++;
                } catch (errorFrameError) {
                    // If we can't even create the error frame, just skip this font
                }
                continue;
            }
            
            // Progress update every 50 fonts
            if (processedFonts % 50 === 0) {
                // Brief progress indication
                app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
                app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL;
            }
        }
        
        // Go to first page
        app.activeWindow.activePage = myDocument.pages[0];
        
        // Success message
        alert("Font sample document created successfully!\n\n" + 
              "Processed: " + processedFonts + " fonts\n" +
              "Pages created: " + myDocument.pages.length + "\n" +
              "Text frames per page: " + framesPerPage + "\n" +
              "Text frame height: " + TEXT_FRAME_HEIGHT + " points\n\n" +
              "Each font sample is in its own 50pt high text frame spanning the usable page width.");
              
    } catch (error) {
        alert("An error occurred while creating the font sample document:\n" + error.toString());
    }
})();

// Additional utility function for debugging frame positions
function debugFramePosition(frame, fontName) {
    var bounds = frame.geometricBounds;
    $.writeln("Font: " + fontName + " - Frame bounds: [" + 
              bounds[0] + ", " + bounds[1] + ", " + bounds[2] + ", " + bounds[3] + "]");
}