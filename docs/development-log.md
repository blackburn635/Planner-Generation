# InDesign Planner Generator - Development Log

## Project Overview
The InDesign Planner Generator started as a monolithic script and evolved into a modular system for creating customizable yearly planners in Adobe InDesign.

## Timeline & Major Milestones

### Phase 1: Initial Development (February 2025)
**Objective**: Create basic planner generation functionality

#### v0.1 - Initial Script
- **Features**: Basic weekly layout generation
- **Implementation**: Single monolithic script
- **Layout**: Left page (Mon-Thu), Right page (Fri-Sun)
- **Limitations**: Hard-coded fonts and colors

#### v0.2 - User Preferences
- **Added**: Font and color selection dialog
- **Features**: 
  - Font dropdown menus for titles and content
  - CMYK color input for headers
  - Option to use existing document colors
- **Technical**: Enhanced dialog system with validation

#### v0.3 - Enhanced Customization
- **Added**: Separate font colors for different text types
- **Features**:
  - Title font and color selection
  - Content font and color selection  
  - Calendar font and color selection
- **Improvement**: Better visual hierarchy and readability

### Phase 2: Modularization (March 2025)
**Objective**: Break monolithic code into maintainable modules

#### v1.0 - Modular Architecture
- **Major Refactor**: Split code into logical modules
- **Structure**: 
  ```
  main.jsx + lib/ + components/
  ```
- **Benefits**: Improved maintainability, reusability, debugging
- **Files Created**:
  - `utils.jsx` - Date handling, formatting
  - `preferences.jsx` - User dialog management
  - `colors.jsx` - Color creation and management
  - `layout.jsx` - Page metrics and positioning
  - `components/` - Individual feature modules

#### v1.1 - Component System
- **Added**: Specialized component modules
- **Components**:
  - `header.jsx` - Week and month headers
  - `footer.jsx` - Week numbers and page info
  - `daySection.jsx` - Daily planning areas
  - `weeklyView.jsx` - Weekly spread coordination
  - `monthlyView.jsx` - 3-month overview
  - `calendarGrid.jsx` - Calendar generation

#### v1.2 - QR Code Integration
- **Added**: QR code generation and placement
- **Features**:
  - Unique QR codes per page with date data
  - SVG generation using external library
  - White background placement
  - Proper positioning system
- **Technical**: Integration with `qrcode.jsx` library

### Phase 3: Advanced Features (March 2025)
**Objective**: Add professional finishing touches

#### v1.3 - Monthly Spreads
- **Added**: Full monthly calendar spreads
- **Features**:
  - Left page: Sunday-Wednesday columns
  - Right page: Thursday-Saturday + Notes
  - Mini calendars for next months
  - Month navigation headers
- **Layout**: Consistent with weekly spread styling

#### v1.4 - Visual Enhancements
- **Added**: Visual improvements throughout
- **Features**:
  - Dotted divider lines in day sections
  - Improved spacing and alignment
  - Better text frame handling
  - Enhanced weekend highlighting
- **Polish**: Professional appearance improvements

#### v1.5 - Index Tab System (Separate Script)
- **Created**: `createMonthlyTabs.jsx` - Independent tab creation
- **Features**:
  - Parent page-based tab system
  - Color interpolation between start/end colors
  - Rounded corners and angled edges
  - Font and color customization
  - Automatic month labeling
- **Design**: Non-intrusive addition to main planner

### Phase 4: Testing & Refinement (March 2025)
**Objective**: Ensure reliability and user-friendliness

#### v1.6 - Testing Framework
- **Created**: Sample generation script for style testing
- **Features**:
  - Generate single monthly and weekly spread
  - Font and color evaluation
  - Style comparison capabilities
- **Purpose**: Preview styles before full generation

#### v1.7 - Date Selection Enhancement
- **Created**: `mainVersion02.jsx` with flexible start dates
- **Features**:
  - User-selectable calendar start date
  - Maintains all existing functionality
  - Enhanced date handling in UI
- **Improvement**: Greater flexibility for users

### Phase 5: Bug Fixes & Optimization (March 2025)
**Objective**: Address issues and optimize performance

#### Bug Fixes Implemented:
- **QR Code Positioning**: Fixed coordinate system issues
- **Page Side Detection**: Improved left/right page handling  
- **Color Creation**: Enhanced CMYK color management
- **Font Availability**: Better font fallback system
- **Text Frame Setup**: Improved vertical text alignment

#### Performance Optimizations:
- **Module Loading**: Optimized include statements
- **Error Handling**: Comprehensive try-catch implementation
- **Resource Management**: Better cleanup of temporary files
- **Memory Usage**: Reduced object creation overhead

## Technical Achievements

### Architecture Improvements
1. **Modular Design**: Transformed monolithic script into 12+ focused modules
2. **Component System**: Reusable components for layout elements
3. **Separation of Concerns**: Clear boundaries between functionality
4. **Error Isolation**: Failures in one component don't break others

### User Experience Enhancements
1. **Preference Dialogs**: Intuitive interface for customization
2. **Style Testing**: Preview capability before full generation
3. **Flexible Options**: Multiple ways to specify colors and fonts
4. **Professional Output**: Print-ready planner layouts

### Integration Features
1. **QR Code System**: Digital integration with embedded date data
2. **Index Tabs**: Professional binding-ready navigation
3. **Color Management**: Full CMYK workflow support
4. **Font System**: Comprehensive typography control

## Current State (September 2025)

### Active Scripts:
- **mainVersion01.jsx**: Primary planner generation (stable)
- **createMonthlyTabs.jsx**: Index tab creation (stable)
- **samplePlannerTest.jsx**: Style testing utility (stable)

### Supported Features:
- ✅ Weekly spreads with daily sections
- ✅ Monthly calendar spreads  
- ✅ 3-month overview on weekly pages
- ✅ QR codes with date information
- ✅ Index tabs with color gradients
- ✅ Full font and color customization
- ✅ Multiple page size support
- ✅ Professional print output

### Known Limitations:
- Requires InDesign CC 2018+
- Facing pages must be enabled
- QR code library dependency
- CMYK color model only

## Lessons Learned

### Technical Insights:
1. **Modular Architecture**: Essential for ExtendScript projects of this complexity
2. **Error Handling**: Critical in InDesign environment with many variables
3. **User Interface**: Dialog boxes need careful validation and fallbacks
4. **Coordinate Systems**: InDesign's coordinate system requires careful handling

### Development Process:
1. **Incremental Development**: Small, testable changes work better than big refactors
2. **User Feedback**: Testing with actual use cases revealed important issues
3. **Documentation**: Critical for maintaining complex codebases
4. **Version Control**: Separate scripts for major feature variations

## Future Considerations

### Potential Enhancements:
- **Template System**: Pre-built style templates
- **Export Options**: PDF generation automation
- **Layout Variations**: Additional planner layouts
- **Digital Integration**: Enhanced QR code functionality
- **Batch Processing**: Multiple document generation

### Architecture Evolution:
- **Plugin System**: Consider UXP migration for future InDesign versions
- **Configuration Files**: External config for advanced users
- **Automated Testing**: Scripted validation of output
- **Performance Profiling**: Optimize for large document generation

---

*Development log maintained through September 2025*

---

## Phase 6: Enhanced Preferences & Font System (December 2024)
*Updated: September 07, 2025 at 17:19*

**Objective**: Implement comprehensive font control and testing capabilities

### v1.8 - Enhanced Preferences System
- **Added**: Comprehensive preferences dialog with organized panels
- **Features**:
  - Test mode: Generate only 10 pages for font/color testing
  - Flexible date ranges: Custom start/end dates with duration control
  - Granular font control: 5 separate font categories with size control
- **Font Categories Implemented**:
  - Page Title Headers (main page titles)
  - Weekly Spread Content (day sections, notes)
  - Monthly Spread Calendar Dates (main calendar numbers)
  - Mini-Calendar Titles (month names, day headers)
  - Mini-Calendar Dates (date numbers in mini calendars)
- **Technical**: Complete preferences.jsx rewrite with fallback chains

### v1.9 - Component Integration
- **Updated**: All 7 core components to use enhanced font system
- **Components Updated**:
  - mainLetter-A4.jsx: Test mode and flexible date range support
  - header.jsx: Page Title Headers font category
  - daySection.jsx: Weekly Spread Content font category
  - calendarGrid.jsx: Both Monthly and Mini-Calendar font categories
  - footer.jsx: Page Title Headers font (size - 2pt) for hierarchy
  - monthlyView.jsx: Mixed font categories for different elements
  - monthSpread.jsx: All font categories used appropriately
- **Features**:
  - Automatic font size hierarchies (footers = headers - 2pt)
  - Font-aware spacing (notes lines based on content font size)
  - Enhanced error handling with detailed logging
  - Backward compatibility through comprehensive fallbacks

### Technical Achievements

#### Enhanced User Experience
1. **Test Mode**: 10-page preview for rapid font/color iteration
2. **Flexible Planning**: Custom date ranges from 1-60 months
3. **Typography Control**: Complete control over 5 font categories
4. **Visual Hierarchy**: Automatic size relationships (header/footer)

#### Architecture Improvements
1. **Modular Font System**: Clean separation of font categories
2. **Fallback Chains**: Backward compatibility with legacy settings
3. **Error Resilience**: Non-fatal error handling throughout
4. **Performance**: Test mode for faster iteration

#### Code Quality Enhancements
1. **Comprehensive Logging**: Detailed font application tracking
2. **Modular Structure**: Separated helper functions for font settings
3. **Error Isolation**: Component-level error handling
4. **Documentation**: Enhanced comments and function documentation

### Current State (December 2024)

#### Completed Features:
- ✅ Enhanced preferences with 5 granular font categories
- ✅ Test mode (10 pages) for rapid testing
- ✅ Flexible date ranges with custom duration
- ✅ All components updated with enhanced font support
- ✅ Automatic font hierarchy (footer = header - 2pt)
- ✅ Font-aware layout spacing
- ✅ Comprehensive error handling and logging
- ✅ Backward compatibility maintained

#### In Progress:
- 🔄 Week headers on both pages (deferred to next session)

#### Known Issues:
- None identified with enhanced font system
- All existing functionality preserved

### Lessons Learned

#### Technical Insights:
1. **Font Fallback Chains**: Essential for backward compatibility
2. **Modular Font Functions**: Cleaner code and easier maintenance
3. **Test Mode Value**: Dramatically speeds up design iteration
4. **Error Handling**: Non-fatal errors keep system working
5. **Logging Importance**: Critical for debugging font issues

#### Development Process:
1. **Comprehensive Planning**: Font category mapping crucial upfront
2. **Component-by-Component**: Safer than massive refactoring
3. **Fallback Strategy**: Legacy support prevents breaking changes
4. **User-Centric Design**: Test mode addresses real user needs

### Future Considerations

#### Immediate Next Steps:
- Week headers on both pages
- User testing of enhanced preferences
- Performance testing with complex font combinations

#### Long-term Enhancements:
- Font preview in preferences dialog
- Style templates using font combinations
- Export settings for font documentation


---

## Phase 6: Enhanced Preferences & Font System (December 2024)
*Updated: September 20, 2025 at 14:01*

**Objective**: Implement comprehensive font control and testing capabilities

### v1.8 - Enhanced Preferences System
- **Added**: Comprehensive preferences dialog with organized panels
- **Features**:
  - Test mode: Generate only 10 pages for font/color testing
  - Flexible date ranges: Custom start/end dates with duration control
  - Granular font control: 5 separate font categories with size control
- **Font Categories Implemented**:
  - Page Title Headers (main page titles)
  - Weekly Spread Content (day sections, notes)
  - Monthly Spread Calendar Dates (main calendar numbers)
  - Mini-Calendar Titles (month names, day headers)
  - Mini-Calendar Dates (date numbers in mini calendars)
- **Technical**: Complete preferences.jsx rewrite with fallback chains

### v1.9 - Component Integration
- **Updated**: All 7 core components to use enhanced font system
- **Components Updated**:
  - mainLetter-A4.jsx: Test mode and flexible date range support
  - header.jsx: Page Title Headers font category
  - daySection.jsx: Weekly Spread Content font category
  - calendarGrid.jsx: Both Monthly and Mini-Calendar font categories
  - footer.jsx: Page Title Headers font (size - 2pt) for hierarchy
  - monthlyView.jsx: Mixed font categories for different elements
  - monthSpread.jsx: All font categories used appropriately
- **Features**:
  - Automatic font size hierarchies (footers = headers - 2pt)
  - Font-aware spacing (notes lines based on content font size)
  - Enhanced error handling with detailed logging
  - Backward compatibility through comprehensive fallbacks

### Technical Achievements

#### Enhanced User Experience
1. **Test Mode**: 10-page preview for rapid font/color iteration
2. **Flexible Planning**: Custom date ranges from 1-60 months
3. **Typography Control**: Complete control over 5 font categories
4. **Visual Hierarchy**: Automatic size relationships (header/footer)

#### Architecture Improvements
1. **Modular Font System**: Clean separation of font categories
2. **Fallback Chains**: Backward compatibility with legacy settings
3. **Error Resilience**: Non-fatal error handling throughout
4. **Performance**: Test mode for faster iteration

#### Code Quality Enhancements
1. **Comprehensive Logging**: Detailed font application tracking
2. **Modular Structure**: Separated helper functions for font settings
3. **Error Isolation**: Component-level error handling
4. **Documentation**: Enhanced comments and function documentation

### Current State (December 2024)

#### Completed Features:
- ✅ Enhanced preferences with 5 granular font categories
- ✅ Test mode (10 pages) for rapid testing
- ✅ Flexible date ranges with custom duration
- ✅ All components updated with enhanced font support
- ✅ Automatic font hierarchy (footer = header - 2pt)
- ✅ Font-aware layout spacing
- ✅ Comprehensive error handling and logging
- ✅ Backward compatibility maintained

#### In Progress:
- 🔄 Week headers on both pages (deferred to next session)

#### Known Issues:
- None identified with enhanced font system
- All existing functionality preserved

### Lessons Learned

#### Technical Insights:
1. **Font Fallback Chains**: Essential for backward compatibility
2. **Modular Font Functions**: Cleaner code and easier maintenance
3. **Test Mode Value**: Dramatically speeds up design iteration
4. **Error Handling**: Non-fatal errors keep system working
5. **Logging Importance**: Critical for debugging font issues

#### Development Process:
1. **Comprehensive Planning**: Font category mapping crucial upfront
2. **Component-by-Component**: Safer than massive refactoring
3. **Fallback Strategy**: Legacy support prevents breaking changes
4. **User-Centric Design**: Test mode addresses real user needs

### Future Considerations

#### Immediate Next Steps:
- Week headers on both pages
- User testing of enhanced preferences
- Performance testing with complex font combinations

#### Long-term Enhancements:
- Font preview in preferences dialog
- Style templates using font combinations
- Export settings for font documentation


---

## Phase 6 Updates: Layout Refinements (December 2024)
*Updated: September 20, 2025 at 22:11*

### v1.9.1 - Mini Calendar Centering Implementation
- **Enhanced**: monthlyView.jsx with centered 3-month overview
- **Features**:
  - Mathematical centering of calendar group between margins
  - Increased spacing from 5pt to 10pt between calendars for better visual breathing room
  - Cleaned up width calculations by removing hardcoded adjustments
  - Maintained all existing functionality and font settings
- **Technical**: 
  - Modified calendar positioning calculation with centering offset
  - Improved spacing allocation: 5pt margins + 10pt gaps = perfect centering
  - Added calendarSpacing parameter for configurable gap control

### Technical Implementation Details

#### Centering Algorithm
- **Total spacing allocation**: `calendarSpacing * 3 = 30pt`
- **Margin distribution**: 5pt left + 10pt gap + 10pt gap + 5pt right = 30pt
- **Width calculation**: `(pageMetrics.usable.width - (calendarSpacing*3)) / 3`
- **Position formula**: `margins.left + (calendarIndex * (calendarWidth + calendarSpacing)) + (calendarSpacing/2)`

#### User-Centric Improvements
1. **Better Visual Balance**: Calendars now centered instead of left-aligned
2. **Enhanced Spacing**: 10pt gaps provide better visual separation than original 5pt
3. **Mathematical Precision**: Equal margins ensure perfect symmetry
4. **Preserved Functionality**: All existing calendar generation logic maintained

### Quality Assurance
- **Code Review**: Comprehensive comparison with original file confirmed no functionality lost
- **Mathematical Verification**: Centering calculations validated for various page widths
- **Error Handling**: All existing error handling and logging preserved
- **Backward Compatibility**: Changes maintain compatibility with existing preferences

### Development Process Insights
1. **User Implementation**: Client implemented elegant solution independently
2. **Clean Design**: Simpler approach than originally proposed centering offset method
3. **Improved Spacing**: 10pt gaps create better visual hierarchy than original 5pt
4. **Modular Changes**: Modifications isolated to positioning logic only

### Future Considerations
- Remove debug alert from monthlyView.jsx (added to backlog)
- Visual testing in actual InDesign output
- Consider applying similar centering logic to other layout components
- Evaluate spacing consistency across all planner sections

