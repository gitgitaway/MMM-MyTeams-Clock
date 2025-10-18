# Changelog

All notable changes to the MMM-MyTeams-Clock module will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.1] - 2025-10-17

### Added

#### Expanded Club Crests Database
- **Enhanced Crest Coverage**: Added 184 new football club crests from Wikipedia and verified sources
- **Database Coverage**: Increased from 57.1% (222 teams) to **92.6% (479 of 517 teams)** across major football leagues
- **Regional Support**: Crests now cover **50+ countries** including:
  - Scottish Premiership: 20+ teams
  - English Premier League: Full team roster
  - German Bundesliga: Major clubs
  - Spanish La Liga: Major clubs
  - Italian Serie A: Major clubs
  - European cups and international leagues from Czech Republic, Poland, Croatia, Portugal, Denmark, Sweden, Iceland, Turkey, and many more

#### Crest Collection Details
- **Total Assets**: 480+ high-quality crest images (PNG/JPG formats)
- **Quality**: All images validated and optimized for circular masking
- **Organization**: Crests libary can be found organized by country then team name in the `images/crests` folder. 
 - Copy your club crest from the `images/crests` folder to the 'clubCrest` folder for easy reference and output to the moduke.
- **Compatibility**: All crests tested with circular CSS border-radius masking. Square wrapper also available for irregular shaped vrests.

### Technical Details
- **No Breaking Changes**: All existing configurations remain fully compatible
- **No Dependencies Added**: Continued use of zero external dependencies
- **Performance**: No impact on module load time or rendering performance
- **Browser Support**: All new crests work across all browsers supported by MagicMirror

### Known Limitations
- 38 teams (7.4%) remain without crests - primarily small regional clubs with limited English Wikipedia presence
- You can add different versions of your club crest to the `clubCrest` folder for testing and ongoing use.
- Some teams with special characters in names may require manual URL mapping in future versions

---

## [1.2.0] - 2025-01-XX

### Added

#### Clock Hand Border Customization
- **Hour Hand Borders**: Added `hourHandBorderColor`, `hourHandBorderWidth`, and `hourHandBorderRadius` config options for fully customizable hour hand borders
- **Minute Hand Borders**: Added `minuteHandBorderColor`, `minuteHandBorderWidth`, and `minuteHandBorderRadius` config options for fully customizable minute hand borders
- **Border Rendering**: Enhanced `drawHand()` function to support optional border rendering with configurable color, width, and rounded/square ends
- **Visual Depth**: Clock hands can now have outlined borders for improved visibility and visual depth against any crest background

#### Enhanced Drawing Function
- **Dual-Layer Rendering**: Border drawn first as wider stroke, then main hand drawn on top for clean outline effect
- **Configurable Line Caps**: Border can use rounded (`lineCap: "round"`) or square (`lineCap: "butt"`) ends based on `borderRadius` setting
- **Null Border Support**: Setting `borderColor` to `null` disables border rendering for that hand (backward compatible)
- **JSDoc Documentation**: Added comprehensive function documentation with parameter descriptions

### Changed
- **drawHand() Signature**: Updated to accept optional `borderOptions` parameter object containing `borderColor`, `borderWidth`, and `borderRadius`
- **Default Border Settings**: Borders disabled by default (`borderColor: null`) to maintain backward compatibility with existing configurations

### Technical Implementation
- **Border Width Calculation**: Border width added to both sides of hand (`width + borderWidth * 2`) for symmetric outline
- **Rendering Order**: Border rendered before main hand to ensure proper layering and visual effect
- **Conditional Rendering**: Border only drawn when `borderOptions` object exists and `borderColor` is not null

---

## [1.1.0] - 2025-09-19

### Added

#### Wrapper Position Control
- **Wrapper Offset Configuration**: Added `wrapperOffsetX` and `wrapperOffsetY` config options to move the entire module wrapper horizontally and vertically
- **Offset Clamping**: Optional `clampWrapperOffsets` feature to limit wrapper offsets within safe boundaries
- **Configurable Clamp Limits**: `clampMaxAbsOffset` parameter (default: 2000px) to define maximum allowed offset magnitude
- **Transform Optimization**: Added `willChange: transform` CSS hint for smoother animations and better browser optimization

#### Visual Toggles
- **Rim Toggle**: `showRim` config option to hide/show the outer clock rim (useful for non-circular crests)
- **Marks Toggle**: `showMarks` config option to hide/show both hour and minute marks (useful when marks don't align well with irregular crests)

#### Debug & Alignment Tools
- **Debug Outline**: `debugOutline` config option to draw a visual border around the wrapper for easier alignment
- **Customizable Debug Styling**: `debugOutlineColor` and `debugOutlineWidth` options to customize the debug border appearance
- **Enhanced Console Warnings**: Improved validation messages for offset clamping and invalid numeric values

#### Theme Customization
- **Dark/Light Mode Override**: `darkMode` config option (null=auto, true=force dark, false=force light)
- **Font Color Override**: `fontColorOverride` option to force specific text colors (e.g., "#FFFFFF")
- **Opacity Override**: `opacityOverride` option to control overall module transparency (0.0 to 1.0)
- **Dynamic CSS Injection**: Theme overrides applied via `_applyThemeOverrides()` method without modifying CSS files

#### Robustness Improvements
- **Safer Numeric Handling**: Enhanced validation for all numeric config parameters with fallback to sensible defaults
- **Finite Number Checks**: Added `Number.isFinite()` checks throughout to prevent NaN/Infinity issues
- **Error Boundaries**: Try-catch blocks around critical operations with informative console warnings
- **Graceful Degradation**: Module continues to function even with invalid configuration values

### Changed
- **Wrapper Sizing Logic**: Improved calculation to ensure wrapper is always at least `2 × crestRadius` while respecting `wrapperSizeFactor`
- **Default Wrapper Size Factor**: Changed from 2.4 to 1.0 for more predictable sizing behavior
- **Transform Application**: Wrapper offsets now applied via CSS `transform: translate()` for better performance

### Technical Implementation
- **HiDPI/Retina Support**: Canvas automatically scales by `devicePixelRatio` for sharp rendering on high-DPI displays
- **Resize Handling**: Added `handleResize` event listener to maintain sharpness when window size or device orientation changes
- **Lifecycle Management**: Proper cleanup in `suspend()` and `stop()` methods to remove event listeners and clear timers
- **Resume Support**: `resume()` method restarts timers and re-attaches event listeners after suspension

---

## [1.0.0] - 2025-09-19

### Added

#### Core Features
- **Analog Clock Overlay**: Fully functional analog clock with hour, minute, and second hands
- **Circular Crest Display**: Football club crest rendered as a perfect circle using CSS `border-radius` and `background-image`
- **Non-Square Image Support**: Robust handling of non-square crest images via circular masking without distortion
- **Centered Clock Alignment**: Clock precisely centered over crest with configurable fine-tuning offsets

#### Canvas Rendering
- **HiDPI/Retina Sharpness**: Canvas scaled by `devicePixelRatio` for crisp lines on high-resolution displays
- **Real-Time Updates**: Clock updates every second with smooth hand movements
- **Efficient Drawing**: Canvas cleared and redrawn each frame for accurate time display
- **2D Context Scaling**: Proper context transformation to maintain CSS pixel units while using physical pixels

#### Customization Options
- **Crest Selection**: `crestImage` config to choose from multiple club crests in `clubCrest` folder - additional club crests can be easily copied from [thesportsdb.com](https://www.thesportsdb.com/sport/leagues),
  - `crestRadius` to set crest circle radius (default: 260px)
  - `clockRadius` to set clock overlay radius (default: 100px)
  - `wrapperSizeFactor` to control wrapper square size (default: 1.0)
- **Fine-Tuning Offsets**:
  - `offsetX` for horizontal clock adjustment (default: 0)
  - `offsetY` for vertical clock adjustment (default: -17)
- **Opacity Control**: `opacity` config for crest transparency (0.0 to 1.0, default: 1.0)

#### Color Customization
- **Rim Color**: `rimColor` for outer clock circle (default: "#444444")
- **Hour Mark Color**: `hourMarkColor` for 12 major tick marks (default: "#444444")
- **Minute Mark Color**: `minuteMarkColor` for 60 minor tick marks (default: "#444444")
- **Hour Hand Color**: `hourHandColor` (default: "#018749" - Celtic green)
- **Minute Hand Color**: `minuteHandColor` (default: "#018749" - Celtic green)
- **Second Hand Color**: `secondHandColor` (default: "#ffffff")
- **Center Dot Color**: `centerDotColor` for clock center (default: "#018749" - Celtic green)

#### Visual Elements
- **Clock Rim**: 2px stroke circle at clock radius
- **Hour Marks**: 12 bold marks (3px width) at 30° intervals, extending from radius-12 to radius-2
- **Minute Marks**: 60 thin marks (1px width) at 6° intervals (excluding hour positions), extending from radius-8 to radius-2
- **Hour Hand**: 60% of clock radius, 8px width, rounded cap
- **Minute Hand**: 80% of clock radius, 6px width, rounded cap
- **Second Hand**: 90% of clock radius, 2px width, rounded cap
- **Center Dot**: 6px radius filled circle at clock center

#### Module Integration
- **MagicMirror² Lifecycle**: Proper `start()`, `getDom()`, `suspend()`, `resume()`, and `stop()` methods
- **CSS Styling**: External stylesheet (`MMM-MyTeams-Clock.css`) for base styles
- **File Helper**: Uses `this.file()` helper to load crest images from module directory
- **Position Flexibility**: Works in any MagicMirror region (top_center, top_left, etc.)

#### Included Assets
- **Multiple Club Crests**: Pre-included crests for:
  - Celtic FC (6 variations: Celtic-01 through Celtic-06)
  - Scottish Premiership teams (Aberdeen, Dundee, Dundee United, Falkirk, Hearts, Hibernian, Kilmarnock, Livingston, Motherwell, Rangers, St Mirren, Alloa)
  - European clubs (Barcelona, Bayern München, Borussia Dortmund, Club Brugge)
  - English clubs (Manchester City, Manchester United, Newcastle)
 

#### Technical Details
- **Canvas Footprint**: 2 × crestRadius in both width and height
- **Wrapper Sizing**: Square container with minimum size of `crestRadius × wrapperSizeFactor`, always at least `2 × crestRadius`
- **Absolute Positioning**: Crest and canvas absolutely positioned within wrapper, centered via `transform: translate(-50%, -50%)`
- **Z-Index Layering**: Crest at z-index 1, canvas at z-index 2
- **Pointer Events**: Canvas has `pointer-events: none` to allow clicks to pass through
- **Background Sizing**: Crest uses `background-size: cover` and `background-position: center` for optimal image display

#### Browser Compatibility
- **Modern Canvas API**: Uses standard HTML5 Canvas 2D context
- **CSS3 Features**: Border-radius, transforms, flexbox
- **ES6 JavaScript**: Arrow functions, const/let, template literals
- **MagicMirror Electron**: Optimized for Chromium-based MagicMirror environment

### Configuration Example

```javascript
{
  module: "MMM-MyTeams-Clock",
  position: "top_center",
  config: {
    // Basic settings
    crestImage: "Celtic-01.png",   // File in clubCrest folder
    crestRadius: 260,              // Crest circle radius (px)
    clockRadius: 100,              // Clock overlay radius (px)
    wrapperSizeFactor: 1.0,        // Wrapper size multiplier

    // Fine-tuning offsets (internal clock positioning)
    offsetX: 0,                    // Horizontal adjustment (px)
    offsetY: -17,                  // Vertical adjustment (px)

    // Wrapper position offsets (move entire module)
    wrapperOffsetX: 0,             // Horizontal wrapper offset (px)
    wrapperOffsetY: 0,             // Vertical wrapper offset (px)
    clampWrapperOffsets: false,    // Enable offset clamping
    clampMaxAbsOffset: 2000,       // Maximum offset magnitude (px)

    // Debug tools
    debugOutline: false,           // Show wrapper border for alignment
    debugOutlineColor: "#ff00ff",  // Debug border color
    debugOutlineWidth: 1,          // Debug border width (px)

    // Colors (Celtic FC theme)
    rimColor: "#444444",
    hourMarkColor: "#444444",
    minuteMarkColor: "#444444",
    hourHandColor: "#018749",      // Celtic green
    minuteHandColor: "#018749",    // Celtic green
    secondHandColor: "#ffffff",
    centerDotColor: "#018749",     // Celtic green

    // Visual toggles
    showRim: true,                 // Show/hide clock rim
    showMarks: true,               // Show/hide hour/minute marks

    // Crest appearance
    opacity: 1.0,                  // Crest opacity (0.0-1.0)

    // Theme overrides
    darkMode: null,                // null=auto, true=dark, false=light
    fontColorOverride: null,       // Force text color (e.g., "#FFFFFF")
    opacityOverride: null          // Force module opacity (0.0-1.0)
  }
}
```

### Dependencies
- **None**: Module uses only standard browser APIs (Canvas 2D, CSS3)
- **MagicMirror²**: Requires MagicMirror² v2.x framework
- **Node.js**: Node helper included but performs no operations (placeholder for future features)

### Known Issues
- **Non-Circular Crests**: Some irregular-shaped crests may require manual adjustment of `offsetX`, `offsetY`, and `clockRadius` for optimal alignment
- **Wrapper Positioning**: In some MagicMirror regions, fine-tuning `wrapperOffsetX/Y` may be needed for perfect placement
- **Clock Marks on Irregular Crests**: Hour/minute marks may not align aesthetically with non-circular crests (use `showMarks: false` to hide)
- **Rangers Crest**: Crest is broken and clock is stuck in the past at 00:00 12th July 1690.[The Banter Years](https://www.pieandbovril.com/forum/index.php?/topic/249121-the-chronicles-of-the-banter-years-2012-%E2%88%9E/0)

### Future Enhancements
- [ ] Auto-scaling to fit region constraints
- [ ] Date display option
- [ ] Multiple timezone support
- [ ] Animated transitions between crests
- [ ] Custom hand shapes/styles
- [ ] Roman numeral hour marks option
- [ ] Glow/shadow effects for hands
- [ ] Configuration presets for popular clubs

---

## Release Notes

### Version 1.1.0 - Enhanced Customization & Alignment

This release focuses on improving module positioning, visual customization, and alignment tools for users with non-standard crest images or specific layout requirements.

**Highlights:**
- **Wrapper Offsets**: Move the entire module precisely where you need it with `wrapperOffsetX/Y`
- **Visual Toggles**: Hide rim and marks for cleaner look on irregular crests
- **Debug Tools**: Visual outline helps perfect your alignment
- **Theme Overrides**: Force dark/light mode and custom colors
- **Safer Configuration**: Enhanced validation prevents crashes from invalid config values

**Perfect For:**
- Users with non-circular club crests
- Custom MagicMirror layouts requiring precise positioning
- Multi-module setups where alignment is critical
- Developers testing different visual configurations

### Version 1.0.0 - Initial Release

The inaugural release of MMM-MyTeams-Clock brings an analog clock overlay onto your favorite football club's crest to MagicMirror².

**Highlights:**
- **Minimal Configuration Required**: Works out-of-box with Celtic FC crest as default, Change the image path and customise colors to suit.
- **HiDPI Sharp**: Crystal-clear rendering on Retina displays
- **Highly Customizable**: 15+ color and sizing options
- **Multiple Crests Included**: 30+ club crests ready to use
- **Lightweight**: Pure canvas rendering, no external dependencies

**Perfect For:**
- Football fans wanting team-branded clock displays
- MagicMirror users seeking unique visual elements
- Celtic FC supporters (default theme)
- Anyone wanting an elegant analog clock with personal branding

**Part of the MyTeams Suite:**
This is the first module in the Celtic-themed MagicMirror collection:
1. **MMM-MyTeams-Clock** - Team-branded analog clock (this module)
2. [MMM-MyTeams-LeagueTable](https://github.com/gitgitaway/MMM-MyTeams-LeagueTable) - League standings display
3. [MMM-MyTeams-Fixtures](https://github.com/gitgitaway/MMM-MyTeams-Fixtures) - Upcoming fixtures tracker
4. [MMM-JukeBox](https://github.com/gitgitaway/MMM-JukeBox) - Audio player with playlist management

---

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and patterns
- Test with multiple crest images (circular and non-circular)
- Verify HiDPI rendering on high-resolution displays
- Test in different MagicMirror regions (top_center, top_left, etc.)
- Update README.md if adding configuration options
- Include comments for complex canvas drawing logic
- Ensure proper cleanup in lifecycle methods (suspend/stop)

### Adding New Crests
1. Place image file in `clubCrest/` folder for use in display output - add a copy to the relevant country folder for consistency
2. Recommended formats: PNG (transparent background preferred), JPG
3. Recommended size: 500×500px or larger for best quality
4. Test with both `showRim: true` and `showRim: false`
5. Test with both `circle` and `square` wrapper options
6. Document any required offset adjustments in PR for specific crests

---

## Acknowledgments

Special thanks to:
- **MagicMirror² Community** for inspiration and guidance
- **Clock Module Developers** whose excellent modules inspired this project
- **Football Clubs** for their iconic crests (property of respective owners)
- **Canvas API Contributors** for comprehensive documentation
- **Celtic Football Club** for giving me some of my highest highs and lowest lows of my life and allowing me to walk on with hope in my heart.
- **Football fans who travel home and away supporting their team. Win, Lose or Draw.** " FOOTBALL WITHOUT FANS IS NOTHING" 

---

## Usage Tips

### Aligning Non-Circular Crests
1. Start with default settings
2. Enable `debugOutline: true` to see wrapper boundaries
3. Adjust `offsetY` first (most common adjustment needed)
4. Fine-tune `offsetX` if needed
5. Adjust `clockRadius` to match crest size
6. If marks don't align well, set `showMarks: false`
7. Disable debug outline when satisfied

### Positioning in MagicMirror Regions
- **top_center**: Usually works perfectly with defaults
- **top_left/top_right**: May need `wrapperOffsetX` adjustment
- **middle_center**: Consider increasing `wrapperSizeFactor` for better spacing
- **bottom regions**: Test with `wrapperOffsetY` for optimal placement

### Color Scheme Recommendations
- **Celtic FC**: Green (#018749), White (FFFFFF) and gold (#FFD700)
- **Rangers FC**: Blue (#0000FF) and red (#FF0000)
- **Barcelona**: Blue (#004D98) and red (#A50044)
- **Bayern München**: Red (#DC052D) and blue (#0066B2)
- **Monochrome**: Use grays (#444444, #888888, #CCCCCC) for subtle look

### Performance Optimization
- Module updates every 1 second (1000ms)
- Canvas only redraws when visible (automatic via lifecycle)
- Resize handler uses efficient event listener pattern
- Transform-based positioning uses GPU acceleration

---

## License

MIT License - See LICENSE file for details

---

## Support

- **Issues**: [GitHub Issues](https://github.com/gitgitaway/MMM-MyTeams-Clock/issues)
- **Discussions**: [GitHub Discussions](https://github.com/gitgitaway/MMM-MyTeams-Clock/discussions)
- **Documentation**: [README.md](README.md)

---

## Version History Summary

| Version | Date       | Key Features |
|---------|------------|--------------|
| 1.1.0   | 2025-10-06 | Wrapper offsets, visual toggles, debug tools, theme overrides |
| 1.0.0   | 2025-09-19 | Initial release with analog clock overlay on club crests |

---

*Last Updated: 2025-10-07*