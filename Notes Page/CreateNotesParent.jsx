// InDesign Script: Create Notes Master Page
// This script creates a master page with "Notes" header and horizontal ruled lines

if (app.documents.length == 0) {
    alert("Please open a document first.");
} else {
    var doc = app.activeDocument;
    
    // Create new master page
    var masterPage;
    try {
        masterPage = doc.masterSpreads.add();
        // Set the name properly using namePrefix and baseName
        masterPage.namePrefix = "N";
        masterPage.baseName = "Notes";
    } catch (e) {
        alert("Error creating master page: " + e.message);
        exit();
    }
    
    // Get the first page of the master spread
    var page = masterPage.pages[0];
    
    // Get page dimensions and margins
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
    
    // Calculate actual content area
    var contentTop = pageTop + marginTop;
    var contentLeft = pageLeft + marginLeft;
    var contentBottom = pageBottom - marginBottom;
    var contentRight = pageRight - marginRight;
    
    // Create "Notes" header text frame
    var headerHeight = 24; // points
    var headerFrame = page.textFrames.add();
    headerFrame.geometricBounds = [contentTop, contentLeft, contentTop + headerHeight, contentRight];
    headerFrame.contents = "Notes";
    
    // Format the header text
    headerFrame.parentStory.paragraphs[0].appliedParagraphStyle = doc.paragraphStyles.item("[No Paragraph Style]");
    headerFrame.parentStory.characters.everyItem().appliedCharacterStyle = doc.characterStyles.item("[None]");
    headerFrame.parentStory.characters.everyItem().pointSize = 18;
    //headerFrame.parentStory.characters.everyItem().fontStyle = "Bold";
    headerFrame.parentStory.paragraphs[0].justification = Justification.CENTER_ALIGN;
    
    // Create color swatch for light gray lines
    var grayColor;
    try {
        grayColor = doc.colors.item("Light Gray Lines");
    } catch (e) {
        grayColor = doc.colors.add();
        grayColor.name = "Light Gray Lines";
        grayColor.model = ColorModel.PROCESS;
        grayColor.colorValue = [0, 0, 0, 20]; // 20% black (light gray)
    }
    
    // Calculate starting position for lines (below header)
    var linesStartY = contentTop + headerHeight + 36; // 36 points spacing after header
    var lineSpacing = 0.28 * 72; // Convert 0.28 inches to points (72 points per inch)
    
    // Calculate how many lines we can fit
    var availableHeight = contentBottom - linesStartY;
    var numberOfLines = Math.floor(availableHeight / lineSpacing);
    
    // Create horizontal lines
    for (var i = 0; i < numberOfLines; i++) {
        var lineY = linesStartY + (i * lineSpacing);
        
        // Create the line
        var line = page.graphicLines.add();
        line.geometricBounds = [lineY, contentLeft, lineY, contentRight];
        
        // Style the line
        line.strokeWeight = 0.5; // Half point stroke
        line.strokeColor = grayColor;
        line.strokeType = doc.strokeStyles.item("Solid");
    }
    
    // Set the new master page as active
    try {
        app.activeWindow.activePage = masterPage.pages[0];
    } catch (e) {
        // If setting active page fails, just continue
    }
    
    alert("Notes master page created successfully!\n" + 
          "Master page name: " + masterPage.name + "\n" + 
          "Lines created: " + numberOfLines + "\n" + 
          "Line spacing: 0.28 inches");
}