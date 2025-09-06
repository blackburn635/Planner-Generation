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
