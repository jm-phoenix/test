# Sprint_Viewer_01_Foundation.md

# GuideOS Viewer Sprint 01 — Foundation

Version: **1.0**

Status: **Approved**

---

# Purpose

Build the complete foundation for the Guide Viewer.

At the end of this Sprint, the Viewer shall provide a production-quality application shell capable of loading in any modern browser, supporting desktop and mobile devices, and ready for future Guide rendering.

No GuideSpec files will be rendered during this Sprint.

---

# Scope

This Sprint establishes the infrastructure of the Viewer.

It focuses exclusively on the application framework.

No business logic related to Guides is implemented.

---

# Objectives

Build the Viewer application shell.

Implement responsive layout.

Create the Theme Engine.

Create the Settings Engine.

Create the Storage abstraction.

Implement Dark Mode.

Implement Manufacturer Theme support.

Create the mobile navigation.

Prepare the application for future rendering.

---

# Out of Scope

This Sprint shall NOT implement

* Guide loading
* Guide rendering
* JSON parsing
* Validation
* Entities
* Localization
* AI Context
* Search
* Progress tracking
* Personal Notes
* QR handling

Those features belong to future Sprints.

---

# Deliverables

The Sprint shall produce

* Functional Viewer
* Responsive layout
* Sidebar
* Header
* Content container
* Footer
* Theme Engine
* Settings persistence
* LocalStorage abstraction
* Mobile navigation
* Light/Dark toggle
* Manufacturer Theme toggle

---

# Files Created

```text
viewer/

guide.html
guide.css
guide.js

shared/

storage.js
theme.js
utils.js
dialogs.js
```

---

# Files Modified

None.

---

# Viewer Layout

The Viewer shall contain

```text
+------------------------------------------------------+

Header

+----------------+-------------------------------------+

Sidebar          Main Content

|                |

|                |

|                |

|                |

+----------------+-------------------------------------+

Footer
```

---

# Sidebar

Contains

GuideOS logo

Application version

Navigation placeholder

Theme controls

Unit System selector (disabled)

AI Provider selector (disabled)

Future modules placeholder

Sidebar shall be collapsible on mobile.

---

# Header

Contains

Guide title placeholder

Guide subtitle placeholder

Dark Mode toggle

Manufacturer Theme toggle

No Guide information is displayed yet.

---

# Main Content

Contains

Welcome screen

Project version

Placeholder card

Development information

Future loading indicator

---

# Footer

Contains

Viewer version

GuideSpec version

Copyright

---

# Responsive Requirements

Desktop

Permanent sidebar.

Tablet

Collapsible sidebar.

Mobile

Hidden sidebar.

Hamburger button.

Animated transitions.

Minimum width

320 px.

---

# Theme Engine

Implement

Light Theme

Dark Theme

Manufacturer Theme

Manufacturer Theme shall support

* Primary Color
* Secondary Color
* Accent Color
* Logo
* Background Color
* Surface Color
* Text Color
* Warning Color
* Danger Color
* Success Color
* Information Color

Dark Mode shall continue to function correctly.

---

# Theme Rules

Every color shall use hexadecimal notation.

Example

```text
#0054A6
```

Never use

rgb()

rgba()

named colors

---

# CSS Variables

Viewer shall use CSS custom properties.

Examples

```css
--background-color
--text-color
--primary-color
--secondary-color
--accent-color
--border-color
--card-background
```

No hardcoded colors outside the theme definition.

---

# Storage Engine

Implement

save()

load()

remove()

exists()

clear()

Storage module is the only module allowed to access LocalStorage directly.

---

# Settings

Persist

Dark Mode

Manufacturer Theme

Sidebar collapsed state

Preferred unit system (placeholder)

Preferred AI provider (placeholder)

Settings restore automatically.

---

# Dialog Module

Create reusable dialog infrastructure.

Support

Information

Warning

Confirmation

Error

Actual dialogs will be implemented later.

---

# Utilities

Create

debounce()

throttle()

generateId()

formatDate()

copyText()

No business-specific utilities.

---

# JavaScript Bootstrap

guide.js shall

Initialize application.

Load settings.

Initialize Theme Engine.

Restore UI state.

Attach event listeners.

Display Welcome screen.

---

# Accessibility

Keyboard navigation.

Visible focus.

ARIA labels.

Touch targets ≥44 px.

Reduced motion support.

---

# Performance

Single initial render.

No unnecessary DOM updates.

Avoid repeated queries.

Cache reusable elements.

---

# UI Style

Modern industrial appearance.

Minimalistic.

Flat design.

Rounded corners.

Soft shadows.

Readable typography.

Comfortable spacing.

Professional appearance.

No skeuomorphic elements.

---

# Public APIs

theme.js

```javascript
initialize()

setTheme()

toggleDarkMode()

toggleManufacturerTheme()

getCurrentTheme()
```

---

storage.js

```javascript
save()

load()

remove()

exists()

clear()
```

---

dialogs.js

```javascript
alert()

confirm()

warning()

error()
```

---

utils.js

```javascript
debounce()

throttle()

copyText()

generateId()

formatDate()
```

---

# Functional Requirements

Viewer starts without errors.

Theme changes immediately.

Dark Mode persists.

Manufacturer Theme persists.

Sidebar state persists.

Responsive layout works.

No console errors.

No global variables.

---

# Coding Requirements

Follow

PROJECT_SPEC.md

GUIDE_SPEC.md

ARCHITECTURE.md

GuideOS Project Structure.md

CODING_STANDARD.md

GUIDEOS_DSL.md

No deviations permitted.

---

# Acceptance Tests

Must pass

A001

A002

A004

V009

T001

T002

T003

T004

ACC001

ACC002

ACC004

PERF001

PERF002

SEC005

---

# Manual Test Procedure

Open guide.html.

Verify layout loads.

Resize browser.

Verify responsive behavior.

Enable Dark Mode.

Refresh page.

Verify persistence.

Enable Manufacturer Theme.

Refresh page.

Verify persistence.

Collapse sidebar.

Refresh page.

Verify persistence.

Open browser console.

Verify no errors.

---

# Exit Criteria

Sprint 01 is complete only when

* Viewer shell is functional.
* Theme Engine operates correctly.
* Settings persist.
* Responsive layout is complete.
* Accessibility requirements are met.
* Acceptance Tests pass.
* No known critical defects remain.

---

# Notes for Future Sprints

Sprint 02 will introduce

* Guide Loader
* GuideSpec parser
* Validation Engine integration
* Rendering pipeline
* Phase rendering
* Step rendering

No structural changes to this Sprint shall be required.
