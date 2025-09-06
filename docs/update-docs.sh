#!/bin/bash

# InDesign Planner Generator Documentation Update Script
# This script creates and updates documentation files for the project

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOCS_DIR="$PROJECT_ROOT/docs"

echo -e "${BLUE}InDesign Planner Generator - Documentation Update${NC}"
echo "=================================================="
echo ""

# Create docs directory if it doesn't exist
if [ ! -d "$DOCS_DIR" ]; then
    echo -e "${YELLOW}Creating docs directory...${NC}"
    mkdir -p "$DOCS_DIR"
fi

# Function to create or update a documentation file
update_doc_file() {
    local filename="$1"
    local title="$2"
    local filepath="$DOCS_DIR/$filename"
    
    echo -e "${GREEN}Updating $filename...${NC}"
    
    # Backup existing file if it exists
    if [ -f "$filepath" ]; then
        cp "$filepath" "$filepath.backup.$(date +%Y%m%d_%H%M%S)"
        echo -e "${YELLOW}  - Backed up existing $filename${NC}"
    fi
}

# Update README.md
update_doc_file "README.md" "InDesign Planner Generator - Developer Guide"
cat > "$DOCS_DIR/README.md" << 'EOF'
# InDesign Planner Generator - Developer Guide

## Overview

The InDesign Planner Generator is a modular ExtendScript project that automates the creation of customizable yearly planners in Adobe InDesign. The system generates both weekly and monthly spreads with extensive customization options including fonts, colors, QR codes, and index tabs.

## Project Structure

```
~/Planner-Generator/
├── mainVersion01.jsx              # Main planner generation script
├── createMonthlyTabs.jsx          # Separate script for monthly index tabs
├── lib/
│   ├── qrcode.jsx                 # External QR code library
│   ├── polyfills.jsx             # JavaScript polyfills for InDesign
│   ├── utils.jsx                 # Utility functions (dates, formatting)
│   ├── preferences.jsx           # User preference dialogs
│   ├── colors.jsx                # Color management
│   ├── layout.jsx                # Layout calculations
│   └── components/
│       ├── header.jsx            # Week/month headers
│       ├── footer.jsx            # Footers with week numbers
│       ├── daySection.jsx        # Daily planning sections
│       ├── weeklyView.jsx        # Weekly spread coordination
│       ├── monthlyView.jsx       # 3-month mini calendar view
│       ├── monthSpread.jsx       # Full monthly calendar spreads
│       ├── calendarGrid.jsx      # Calendar grid generation
│       └── qrcodeGen.jsx         # QR code generation & placement
├── docs/                         # Project documentation
├── scripts/                      # Utility scripts
└── README.md                     # Main project readme
```

## Core Scripts

### 1. mainVersion01.jsx
The primary script that generates the complete planner:
- **Weekly Spreads**: Monday-Thursday on left page, Friday-Sunday + 3-month overview on right
- **Monthly Spreads**: Full month calendar with notes and mini calendars
- **QR Codes**: Unique codes on each page with embedded date information
- **Customization**: User dialog for fonts, colors, and layout options

### 2. createMonthlyTabs.jsx
Separate script for creating index tabs:
- **Parent Pages**: Creates tab templates for consistent application
- **Color Interpolation**: Automatically blends between start and end colors
- **Positioning**: Smart placement on page edges with rounded corners
- **Monthly Labels**: Automatic month name placement with custom fonts

## Key Features

### Modular Architecture
- **Component-Based**: Each feature is isolated in its own module
- **Reusable**: Components can be used independently or combined
- **Maintainable**: Easy to update individual features without affecting others

### User Customization
- **Font Selection**: Choose different fonts for titles, content, and calendars
- **Color Management**: CMYK color specification with document color integration
- **Layout Options**: Configurable margins, spacing, and element positioning
- **QR Code Integration**: Embedded date information for digital integration

### Layout System
- **Facing Pages**: Designed for proper spread layouts
- **Responsive**: Adapts to different page sizes and margin settings
- **Grid-Based**: Consistent alignment and spacing throughout

## Getting Started

### Prerequisites
- Adobe InDesign CC 2018 or later
- Document with facing pages enabled
- Minimum 2 pages (script will add more as needed)

### Basic Usage

1. **Open InDesign** and create a new document with facing pages enabled
2. **Run the main script**: File → Scripts → Other Script → Select `mainVersion01.jsx`
3. **Configure preferences** in the dialog:
   - Select fonts for titles, content, and calendars
   - Choose colors (CMYK values or existing document colors)
   - Set header color for section banners
4. **Generate planner**: Script creates all spreads automatically

### Adding Index Tabs

1. **After generating the main planner**, run `createMonthlyTabs.jsx`
2. **Configure tab preferences**:
   - Select font and color for tab labels
   - Choose start and end colors for gradient
   - Set tab width and corner radius
3. **Apply to document**: Script creates parent pages and applies to spreads

## Component Reference

### Core Components

#### DaySection
Creates individual day planning areas with:
- Colored headers with day/date
- "Things To Do" labels
- Ruled lines for writing
- Dotted divider lines

#### CalendarGrid
Generates calendar grids:
- Full month calendars for monthly spreads
- Mini calendars for weekly overview
- Week highlighting and date formatting

#### QRCodeGen
Handles QR code creation:
- Generates SVG QR codes with date data
- Places codes with white backgrounds
- Manages positioning and sizing

### Layout System

#### Layout Module
Calculates page metrics:
- Usable area within margins
- Section heights and widths
- Grid positioning coordinates

#### Utils Module
Provides utility functions:
- Date formatting and calculations
- Week number determination
- Text formatting helpers

## Development Guidelines

### Code Style
- **JSDoc Comments**: Document all functions with parameters and return values
- **Error Handling**: Wrap operations in try-catch blocks
- **Modular Design**: Keep functions focused and reusable
- **InDesign Integration**: Use proper ExtendScript patterns

### Adding New Features
1. **Create component module** in `/lib/components/`
2. **Export public interface** using module pattern
3. **Import in main script** using `//@include` directive
4. **Update documentation** in relevant files

### Testing
- **Use test script**: `samplePlannerTest.jsx` for style evaluation
- **Check multiple page sizes**: Test with different document dimensions
- **Verify facing pages**: Ensure proper left/right page handling

## Common Issues & Solutions

### QR Code Library Missing
**Error**: "QR code library not found"
**Solution**: Ensure `qrcode.jsx` is in the `/lib/` folder

### Facing Pages Required
**Error**: "This script requires a document with facing pages enabled"
**Solution**: Enable facing pages in Document Setup

### Font Not Available
**Issue**: Selected font not applying
**Solution**: Verify font is installed and accessible to InDesign

### Color Creation Errors
**Issue**: CMYK colors not creating properly
**Solution**: Check CMYK values are within 0-100 range

## Version History

See `development-log.md` for detailed version history and feature evolution.

## Contributing

1. **Follow modular architecture**: Keep changes within appropriate components
2. **Test thoroughly**: Verify changes don't break existing functionality
3. **Document updates**: Update relevant documentation files
4. **Use version control**: Commit logical chunks with descriptive messages

## Support

For questions about implementation or troubleshooting:
1. Check the development log for similar issues
2. Review component documentation
3. Test with the sample script first
4. Verify InDesign version compatibility

---

*Last updated: $(date)*
EOF

# Update development-log.md
update_doc_file "development-log.md" "Development Log"
cat > "$DOCS_DIR/development-log.md" << 'EOF'
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
EOF

# Update architecture.md
update_doc_file "architecture.md" "Architecture Documentation"
cat > "$DOCS_DIR/architecture.md" << 'EOF'
# InDesign Planner Generator - Architecture Documentation

## System Overview

The InDesign Planner Generator follows a modular, component-based architecture designed for maintainability, extensibility, and reliability within the Adobe InDesign ExtendScript environment.

## Architectural Principles

### 1. Modular Design
- **Separation of Concerns**: Each module handles a specific aspect of planner generation
- **Loose Coupling**: Modules interact through well-defined interfaces
- **High Cohesion**: Related functionality is grouped together

### 2. Component Architecture
- **Reusable Components**: UI elements that can be combined in different ways
- **Stateless Design**: Components don't maintain internal state between calls
- **Dependency Injection**: Components receive dependencies rather than creating them

### 3. Error Resilience
- **Graceful Degradation**: System continues working even if non-critical features fail
- **Comprehensive Error Handling**: Try-catch blocks around all InDesign operations
- **User-Friendly Messages**: Clear error reporting for troubleshooting

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface Layer                     │
├─────────────────────────────────────────────────────────────┤
│  Preferences Dialog  │  User Input Validation  │  Error UI   │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                   Orchestration Layer                       │
├─────────────────────────────────────────────────────────────┤
│     Main Script      │   WeeklyView    │   MonthSpread       │
│   (mainVersion01)    │   Coordinator   │   Coordinator       │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                    Component Layer                          │
├─────────────────────────────────────────────────────────────┤
│ DaySection │ Header │ Footer │ CalendarGrid │ MonthlyView    │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                    Service Layer                            │
├─────────────────────────────────────────────────────────────┤
│  Layout  │  Colors  │  Utils  │  QRCodeGen  │  Preferences   │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                   Foundation Layer                          │
├─────────────────────────────────────────────────────────────┤
│    Polyfills    │    External Libraries    │    InDesign API │
└─────────────────────────────────────────────────────────────┘
```

## Core Modules

### Main Orchestration

#### mainVersion01.jsx
**Purpose**: Primary entry point and process orchestration
**Responsibilities**:
- Document validation and setup
- User preference collection
- Year-long planner generation coordination
- Error handling and user notification

```javascript
// High-level flow
main() → validateDocument() → getUserPreferences() → generateYearPlanner()
```

### Service Layer

#### utils.jsx
**Purpose**: Core utility functions used throughout the system
**Key Functions**:
- `getWeekNumber(date)`: ISO week number calculation
- `formatDate(date)`: Consistent date formatting
- `getDayName(date)`: Localized day names
- `getMonthDates(monthDate)`: Calendar grid date arrays
- `applyTextFormatting()`: Consistent text styling

#### layout.jsx  
**Purpose**: Page layout calculations and coordinate management
**Key Functions**:
- `calculatePageMetrics(document)`: Extract page dimensions and margins
- `calculateSectionHeight()`: Determine optimal section sizing
- `createGeometricBounds()`: Convert coordinates to InDesign bounds
- `calculateCellCoordinates()`: Grid positioning logic

#### colors.jsx
**Purpose**: Color management and creation
**Key Functions**:
- `setupColors(document, preferences)`: Create color swatches
- `createCMYKColor()`: CMYK color object creation
- `interpolateColors()`: Color gradient generation
- `validateColorValues()`: Input validation

#### preferences.jsx
**Purpose**: User preference dialog and validation
**Key Functions**:
- `getUserPreferences(document)`: Display preference dialog
- `validateFontSelection()`: Ensure fonts are available
- `buildColorDropdowns()`: Populate color selection lists
- `createPreferenceDialog()`: UI construction

### Component Layer

#### daySection.jsx
**Purpose**: Individual day planning section creation
**Architecture**:
```javascript
DaySection.createDaySection(page, date, index, height, metrics, prefs)
```
**Elements Created**:
- Colored header rectangle
- Day/date text frame
- "Things To Do" label
- Content area with ruling lines
- Vertical dotted divider

#### calendarGrid.jsx
**Purpose**: Calendar grid generation for various contexts
**Key Methods**:
- `createCalendarGrid()`: Full-size monthly calendars
- `createMiniMonthCalendar()`: Compact overview calendars
**Features**:
- Adaptive row/column calculation
- Current month highlighting
- Week number integration
- Cross-month date handling

#### header.jsx & footer.jsx
**Purpose**: Consistent page headers and footers
**Integration Points**:
- Week number display
- Date range formatting
- QR code coordination
- Page identification

#### weeklyView.jsx
**Purpose**: Weekly spread coordination and layout
**Responsibilities**:
- Two-page spread management
- Component positioning
- Date range calculation
- QR code placement coordination

#### monthSpread.jsx
**Purpose**: Monthly calendar spread creation
**Layout Strategy**:
- Left page: Sunday-Wednesday columns
- Right page: Thursday-Saturday + Notes + Mini calendars
- Consistent header/footer integration

#### monthlyView.jsx
**Purpose**: 3-month overview section for weekly pages
**Features**:
- Current month + next 2 months
- Week highlighting
- Compact calendar grids
- Automatic month progression

#### qrcodeGen.jsx
**Purpose**: QR code generation and placement
**Dependencies**:
- External `qrcode.jsx` library
**Features**:
- Date-encoded QR content
- SVG generation
- Placement with white backgrounds
- Error handling for missing library

## Data Flow

### 1. Initialization Phase
```
User runs script → Document validation → Library checks → Main execution
```

### 2. Preference Collection
```
Display dialog → Validate inputs → Create preference object → Store settings
```

### 3. Generation Loop
```
For each month:
  Create monthly spread → Generate weekly spreads → Add QR codes
```

### 4. Component Creation
```
Calculate layout → Create elements → Apply styling → Position precisely
```

## Design Patterns

### Module Pattern
Each component uses the revealing module pattern:
```javascript
var ComponentName = (function() {
    // Private functions and variables
    function privateFunction() { }
    
    // Public interface
    return {
        publicMethod: publicMethod
    };
})();
```

### Dependency Injection
Components receive dependencies rather than creating them:
```javascript
DaySection.createDaySection(page, date, index, height, pageMetrics, userPrefs)
```

### Error Boundary Pattern
Operations are wrapped with appropriate error handling:
```javascript
try {
    // InDesign operations
} catch (e) {
    // Graceful degradation or user notification
}
```

### Factory Pattern
Complex object creation is abstracted:
```javascript
Layout.calculatePageMetrics(document) // Returns standardized metrics object
```

## State Management

### Stateless Architecture
- Components don't maintain state between calls
- All necessary data passed as parameters
- No global variables except for module definitions

### Data Flow
- Unidirectional data flow from main script to components
- Return values for coordination information
- Error propagation through exceptions

## Integration Points

### InDesign API Integration
- **Document Manipulation**: Pages, spreads, master pages
- **Typography**: Fonts, text frames, character formatting
- **Graphics**: Rectangles, lines, placed graphics
- **Color Management**: CMYK colors, swatches, tints

### External Dependencies
- **qrcode.jsx**: Third-party QR code generation library
- **Polyfills**: JavaScript compatibility layer for ExtendScript

## Performance Considerations

### Optimization Strategies
- **Batch Operations**: Minimize individual InDesign API calls
- **Coordinate Calculation**: Pre-calculate positions when possible
- **Object Reuse**: Reuse style objects and patterns
- **Memory Management**: Clean up temporary objects

### Scalability
- **Modular Loading**: Only load required components
- **Progressive Generation**: Create spreads incrementally
- **Error Recovery**: Continue processing after non-critical failures

## Security & Validation

### Input Validation
- **Font Availability**: Verify fonts exist before use
- **Color Values**: Validate CMYK ranges (0-100)
- **Document State**: Ensure proper document setup
- **Date Ranges**: Validate date calculations

### Error Handling
- **User-Friendly Messages**: Clear error descriptions
- **Graceful Degradation**: Continue with reduced functionality
- **Debug Information**: Technical details for troubleshooting

## Extensibility

### Adding New Components
1. Create component module in `/lib/components/`
2. Follow module pattern with public interface
3. Add include statement to main script
4. Update documentation

### Customization Points
- **Styling**: All visual elements configurable through preferences
- **Layout**: Modular layout system supports variations
- **Content**: Component-based system allows easy modifications
- **Integration**: QR codes and external data hooks available

## Testing Strategy

### Component Testing
- Individual module verification
- Error condition testing
- Parameter validation

### Integration Testing
- Full planner generation
- Multiple document sizes
- Various preference combinations

### User Acceptance Testing
- Real-world usage scenarios
- Style customization workflows
- Error recovery testing

---

*Architecture documentation current as of September 2025*
EOF

# Update backlog.md
update_doc_file "backlog.md" "Development Backlog"
cat > "$DOCS_DIR/backlog.md" << 'EOF'
# InDesign Planner Generator - Development Backlog

## Current Status
**Version**: 1.7 (mainVersion01.jsx stable)
**Last Updated**: September 2025
**Active Development**: Maintenance and enhancement mode

## Backlog Categories

### 🔥 High Priority (Next Release)

#### P1: Critical Bug Fixes
- [ ] **QR Code Library Error Handling**
  - Improve fallback when qrcode.jsx is missing
  - Add automatic library detection and user guidance
  - Consider embedding QR code functionality to eliminate dependency

- [ ] **Font Fallback System Enhancement**
  - Better detection of unavailable fonts
  - Automatic substitution with similar fonts
  - User notification when fonts are substituted

- [ ] **Memory Management Optimization**
  - Profile memory usage during large planner generation
  - Optimize object creation and cleanup
  - Reduce ExtendScript memory footprint

#### P2: User Experience Improvements
- [ ] **Enhanced Error Messages**
  - More specific error descriptions
  - Troubleshooting suggestions in error dialogs
  - Recovery options where possible

- [ ] **Progress Indicators**
  - Progress bar for long planner generation
  - Status messages during processing
  - Ability to cancel long operations

- [ ] **Preference Validation**
  - Real-time validation in preference dialogs
  - Preview of color selections
  - Font preview in selection dropdowns

### 🚀 Medium Priority (Future Releases)

#### Layout & Design Enhancements
- [ ] **Template System**
  - Pre-built style templates (Professional, Modern, Classic)
  - User-saveable custom templates
  - Template import/export functionality

- [ ] **Alternative Layout Options**
  - Vertical weekly layout option
  - Full-week single page layout
  - Academic year calendar (August-July)
  - Custom date range selection

- [ ] **Enhanced Typography**
  - Multiple font selection for different elements
  - Font size customization
  - Line spacing controls
  - Text style templates

#### Content & Features
- [ ] **Holiday Integration**
  - Country-specific holiday database
  - Holiday highlighting in calendars
  - Custom holiday addition interface

- [ ] **Enhanced QR Codes**
  - Custom QR code content options
  - Integration with digital calendar systems
  - QR code styling options (colors, borders)

- [ ] **Notes & Customization**
  - Custom page insertion between standard spreads
  - Note page templates (lined, dotted, graph)
  - Custom header/footer text options

#### Productivity Features
- [ ] **Batch Processing**
  - Multiple document generation
  - Batch style application
  - Automated file naming and saving

- [ ] **Export Automation**
  - Automatic PDF generation
  - Print-ready export presets
  - Digital sharing formats

### 🔧 Technical Improvements

#### Code Quality & Architecture
- [ ] **Unit Testing Framework**
  - Automated testing for core functions
  - Regression testing for layout calculations
  - Mock InDesign environment for testing

- [ ] **Performance Optimization**
  - Profile and optimize slow operations
  - Reduce redundant calculations
  - Improve large document handling

- [ ] **Code Documentation**
  - Complete JSDoc documentation for all functions
  - Architecture diagrams and flowcharts
  - Developer onboarding guide

#### Modern ExtendScript Features
- [ ] **UXP Migration Planning**
  - Evaluate UXP compatibility for future InDesign versions
  - Plan migration strategy for modern UI panels
  - Maintain backward compatibility

- [ ] **Configuration System**
  - External configuration files for advanced users
  - JSON-based preference storage
  - Configuration import/export

### 🌟 Long-term Vision

#### Platform Expansion
- [ ] **Web-based Companion Tool**
  - Online style preview and configuration
  - QR code content management
  - Digital integration dashboard

- [ ] **Mobile Integration**
  - QR code scanning for mobile calendar integration
  - Mobile-friendly digital companion
  - Sync with popular calendar apps

#### Advanced Features
- [ ] **Smart Layout**
  - AI-assisted layout optimization
  - Automatic font pairing suggestions
  - Intelligent color scheme generation

- [ ] **Collaboration Features**
  - Multi-user template sharing
  - Team calendar integration
  - Shared style libraries

## Technical Debt

### Code Maintenance
- [ ] **Legacy Code Cleanup**
  - Remove unused functions and variables
  - Standardize naming conventions
  - Consolidate duplicate code

- [ ] **Error Handling Standardization**
  - Consistent error handling patterns across modules
  - Standardized error message formats
  - Comprehensive error logging

- [ ] **Dependencies Management**
  - Document all external dependencies
  - Version control for third-party libraries
  - Fallback implementations for critical dependencies

### Performance Issues
- [ ] **Large Document Optimization**
  - Optimize for 500+ page planners
  - Memory usage optimization
  - Processing time improvements

- [ ] **Coordinate Calculation Efficiency**
  - Cache calculated values where appropriate
  - Reduce redundant geometry calculations
  - Optimize grid generation algorithms

## Bug Reports & Issues

### Known Issues
- [ ] **Issue #001**: QR codes occasionally mispositioned on rotated pages
  - **Priority**: Medium
  - **Workaround**: Ensure document rotation is 0°
  - **Root Cause**: Coordinate system transformation not handling rotation

- [ ] **Issue #002**: Large CMYK values (>100) cause color creation to fail
  - **Priority**: High  
  - **Workaround**: Validate input ranges in preference dialog
  - **Root Cause**: Missing input validation

- [ ] **Issue #003**: Font style "Bold" not available for some fonts
  - **Priority**: Low
  - **Workaround**: Script continues with regular weight
  - **Root Cause**: Font variant availability not checked

### User Feedback Integration
- [ ] **Feedback Analysis**
  - Review user feedback from beta testing
  - Prioritize requested features
  - Address common pain points

- [ ] **User Documentation**
  - Video tutorials for common workflows
  - FAQ for troubleshooting
  - Best practices guide

## Research & Development

### Emerging Technologies
- [ ] **InDesign API Evolution**
  - Monitor new InDesign features and APIs
  - Evaluate Server functionality for automation
  - Stay current with Creative Cloud updates

- [ ] **Industry Trends**
  - Research planner design trends
  - Evaluate competitor features
  - Identify market opportunities

### Proof of Concepts
- [ ] **Variable Data Integration**
  - Investigate InDesign Data Merge capabilities
  - Custom data source integration
  - Automated personalization features

- [ ] **Plugin Architecture**
  - Design system for third-party extensions
  - Plugin API specification
  - Community contribution framework

## Release Planning

### Next Minor Release (v1.8)
**Target**: Q4 2025
- Focus: Bug fixes and user experience improvements
- Key Features: Enhanced error handling, progress indicators
- Testing: Comprehensive regression testing

### Next Major Release (v2.0)
**Target**: Q2 2026
- Focus: Template system and layout alternatives
- Key Features: Pre-built templates, holiday integration
- Architecture: Potential UXP migration planning

### Long-term Roadmap (v3.0+)
**Target**: 2027+
- Focus: Platform expansion and advanced features
- Key Features: Web companion, AI-assisted features
- Platform: Multi-platform ecosystem

## Contribution Guidelines

### Community Contributions
- [ ] **Contributor Documentation**
  - Code style guidelines
  - Contribution workflow
  - Testing requirements

- [ ] **Feature Request Process**
  - Structured feature request template
  - Community voting system
  - Feature feasibility evaluation

### Open Source Considerations
- [ ] **Licensing Strategy**
  - Evaluate open source licensing options
  - Community governance model
  - Commercial use considerations

---

## Backlog Management

**Review Cycle**: Monthly backlog review and prioritization
**Stakeholders**: Development team, beta users, community feedback
**Criteria**: User impact, technical feasibility, resource requirements

*Backlog maintained through September 2025*
EOF

echo ""
echo -e "${GREEN}Documentation files created successfully!${NC}"
echo ""
echo -e "${BLUE}Files created/updated:${NC}"
echo "  - docs/README.md"
echo "  - docs/development-log.md" 
echo "  - docs/architecture.md"
echo "  - docs/backlog.md"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Review the generated documentation files"
echo "  2. Customize content based on your specific needs"
echo "  3. Run this script again to update documentation"
echo "  4. Consider adding this script to your development workflow"
echo ""
echo -e "${GREEN}Documentation update complete!${NC}"