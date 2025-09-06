/*******************************************************************************
 * Tab Colors Module
 * 
 * Handles color creation and interpolation for monthly tabs:
 * - Creates a gradient of colors between start and end colors
 * - Manages color creation in the document
 * - Provides color utilities for tab creation
 *******************************************************************************/

var TabColors = (function() {
    /**
     * Creates a set of interpolated colors for the 12 months
     * @param {Document} doc - The InDesign document
     * @param {Array} startColor - CMYK values for first month [C,M,Y,K]
     * @param {Array} endColor - CMYK values for last month [C,M,Y,K]
     * @param {Array} [middleColor] - Optional CMYK values for middle month [C,M,Y,K]
     * @param {Boolean} [useThreeColorMode] - Whether to use three-color interpolation
     * @returns {Array} Array of color names created for each month
     */
    function createMonthlyTabColors(doc, startColor, endColor, middleColor, useThreeColorMode) {
        var monthNames = ["January", "February", "March", "April", "May", "June", 
                          "July", "August", "September", "October", "November", "December"];
        var colorNames = [];
        
        // Create color for each month
        for (var i = 0; i < 12; i++) {
            var cmykValues;
            
            if (useThreeColorMode && middleColor) {
                // Three color interpolation
                if (i < 6) {
                    // First half: interpolate between start and middle
                    cmykValues = interpolateColor(startColor, middleColor, i / 5); // i/5 goes from 0 to 1
                } else {
                    // Second half: interpolate between middle and end
                    cmykValues = interpolateColor(middleColor, endColor, (i - 6) / 5); // (i-6)/5 goes from 0 to 1
                }
            } else {
                // Standard two color interpolation
                cmykValues = interpolateColor(startColor, endColor, i / 11); // i/11 goes from 0 to 1
            }
            
            // Create color name
            var colorName = "Tab_" + monthNames[i];
            
            // Create or update the color
            createOrUpdateColor(doc, colorName, cmykValues);
            
            colorNames.push(colorName);
        }
        
        // Create a color for the text
        var textColorName = "Tab_Text";
        createOrUpdateColor(doc, textColorName, [0, 0, 0, 100]); // Black by default
        
        return colorNames;
    }
    
    /**
     * Interpolates between two CMYK colors
     * @param {Array} color1 - Starting CMYK values [C,M,Y,K]
     * @param {Array} color2 - Ending CMYK values [C,M,Y,K]
     * @param {Number} ratio - Interpolation ratio (0 to 1)
     * @returns {Array} Interpolated CMYK values
     */
    function interpolateColor(color1, color2, ratio) {
        // Ensure ratio is between 0 and 1
        ratio = Math.max(0, Math.min(1, ratio));
        
        var result = [];
        
        // Interpolate each CMYK component
        for (var i = 0; i < 4; i++) {
            result[i] = color1[i] + ((color2[i] - color1[i]) * ratio);
            // Round to one decimal place
            result[i] = Math.round(result[i] * 10) / 10;
        }
        
        return result;
    }
    
    /**
     * Creates or updates a color in the document
     * @param {Document} doc - The InDesign document
     * @param {String} colorName - Name for the color
     * @param {Array} cmykValues - CMYK values [C,M,Y,K]
     */
    function createOrUpdateColor(doc, colorName, cmykValues) {
        try {
            // Check if color already exists
            var color = doc.colors.itemByName(colorName);
            
            if (!color.isValid) {
                // Create new color
                doc.colors.add({
                    name: colorName,
                    model: ColorModel.PROCESS,
                    colorValue: cmykValues
                });
            } else {
                // Update existing color
                color.colorValue = cmykValues;
            }
        } catch (e) {
            // Try to create the color anyway
            try {
                doc.colors.add({
                    name: colorName,
                    model: ColorModel.PROCESS,
                    colorValue: cmykValues
                });
            } catch (colorError) {
                throw new Error("Failed to create color '" + colorName + "': " + colorError.message);
            }
        }
    }
    
    /**
     * Creates a color for tab text in the document
     * @param {Document} doc - The InDesign document
     * @param {Array} cmykValues - CMYK values for the text color [C,M,Y,K]
     * @returns {String} Name of the created text color
     */
    function createTextColor(doc, cmykValues) {
        var colorName = "Tab_Text";
        createOrUpdateColor(doc, colorName, cmykValues);
        return colorName;
    }
    
    // Return public interface
    return {
        createMonthlyTabColors: createMonthlyTabColors,
        createTextColor: createTextColor,
        interpolateColor: interpolateColor
    };
})();