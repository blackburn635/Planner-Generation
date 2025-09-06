/*******************************************************************************
 * Color Manager Module
 * 
 * Handles the creation and management of colors for the planner.
 * - Creates and manages colors based on user preferences
 * - Ensures colors are properly set up before use
 * - Provides utilities for color application
 *******************************************************************************/

var ColorManager = (function() {
    /**
     * Setup colors in the document based on user preferences
     * @param {Document} doc - The InDesign document
     * @param {Object} userPrefs - User preferences object
     */
    function setupColors(doc, userPrefs) {
        try {
            // Check if color already exists
            var headerColor = doc.colors.itemByName(userPrefs.headerColorName);
            if (!headerColor.isValid) {
                // Create new color if it doesn't exist
                headerColor = doc.colors.add({
                    name: userPrefs.headerColorName,
                    model: ColorModel.PROCESS,
                    colorValue: userPrefs.headerColorValues
                });
            } else {
                // If color exists but we want to update it with new values
                headerColor.colorValue = userPrefs.headerColorValues;
            }
            
            // Ensure we have the standard colors available
            ensureStandardColors(doc);
            
        } catch (e) {
            // Create color if any error occurred checking for it
            try {
                headerColor = doc.colors.add({
                    name: userPrefs.headerColorName,
                    model: ColorModel.PROCESS,
                    colorValue: userPrefs.headerColorValues
                });
            } catch (colorError) {
                throw new Error("Failed to create color: " + colorError.message);
            }
        }
    }
    
    /**
     * Ensures that standard colors like Black and Paper exist in the document
     * @param {Document} doc - The InDesign document
     */
    function ensureStandardColors(doc) {
        // These colors should exist by default, but just in case
        try {
            // Check for Black
            var blackColor = doc.colors.itemByName("Black");
            if (!blackColor.isValid) {
                doc.colors.add({
                    name: "Black",
                    model: ColorModel.PROCESS,
                    colorValue: [0, 0, 0, 100]
                });
            }
            
            // Check for Paper
            var paperColor = doc.colors.itemByName("Paper");
            if (!paperColor.isValid) {
                doc.colors.add({
                    name: "Paper",
                    model: ColorModel.PROCESS,
                    colorValue: [0, 0, 0, 0]
                });
            }
        } catch (e) {
            // If there's an error, we'll continue anyway as these are just backup checks
            $.writeln("Warning: Failed to ensure standard colors: " + e.message);
        }
    }
    
    /**
     * Gets a list of all available colors in the document
     * @param {Document} doc - The InDesign document
     * @returns {Array} Array of color names
     */
    function getAvailableColors(doc) {
        var colors = [];
        for (var i = 0; i < doc.colors.length; i++) {
            if (doc.colors[i].name !== "None" && 
                doc.colors[i].name !== "Registration") {
                colors.push(doc.colors[i].name);
            }
        }
        return colors;
    }
    
    /**
     * Creates a color with the specified values or returns existing one
     * @param {Document} doc - The InDesign document
     * @param {String} name - Name for the color
     * @param {Array} cmykValues - Array of [C,M,Y,K] values (0-100)
     * @returns {Color} The created or existing color
     */
    function createOrGetColor(doc, name, cmykValues) {
        try {
            var color = doc.colors.itemByName(name);
            if (!color.isValid) {
                color = doc.colors.add({
                    name: name,
                    model: ColorModel.PROCESS,
                    colorValue: cmykValues
                });
            }
            return color;
        } catch (e) {
            throw new Error("Failed to create or get color '" + name + "': " + e.message);
        }
    }
    
    /**
     * Creates a lighter variant of an existing color
     * @param {Document} doc - The InDesign document
     * @param {String} baseName - Base color name
     * @param {Number} percentLighter - Percentage to lighten (0-100)
     * @returns {Color} The created lighter color
     */
    function createLighterVariant(doc, baseName, percentLighter) {
        try {
            var baseColor = doc.colors.itemByName(baseName);
            if (!baseColor.isValid) {
                throw new Error("Base color '" + baseName + "' does not exist");
            }
            
            var newName = baseName + "_" + percentLighter + "pct";
            var existingVariant = doc.colors.itemByName(newName);
            
            if (existingVariant.isValid) {
                return existingVariant;
            }
            
            // Get base color values
            var baseValues = baseColor.colorValue;
            var lighterValues = [];
            
            // Calculate lighter values (reduce by percentage)
            for (var i = 0; i < baseValues.length; i++) {
                lighterValues[i] = baseValues[i] * (1 - (percentLighter / 100));
            }
            
            // Create and return the new color
            return doc.colors.add({
                name: newName,
                model: baseColor.space,
                colorValue: lighterValues
            });
            
        } catch (e) {
            throw new Error("Failed to create lighter variant: " + e.message);
        }
    }
    
    // Return public interface
    return {
        setupColors: setupColors,
        getAvailableColors: getAvailableColors,
        createOrGetColor: createOrGetColor,
        createLighterVariant: createLighterVariant
    };
})();