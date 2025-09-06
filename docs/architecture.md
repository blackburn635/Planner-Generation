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
