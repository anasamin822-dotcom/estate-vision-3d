# System Architecture & Technical Flow Document (`Architecture.md`)

## 1. High-Level App Architecture
The **EstateVision 3D** application follows a modular, client-side, single-page application (SPA) architecture built entirely with Vanilla Frontend technologies (HTML5, CSS3, ES6 JavaScript) and CDN-based 3D/animation libraries.
+-----------------------------------------------------------------------+
|                             USER BROWSER                              |
+-----------------------------------------------------------------------+
|
v
+-----------------------------------------------------------------------+
|                          index.html (DOM)                             |
+-----------------------------------------------------------------------+
|                         |                        |
v                         v                        v
+-----------------+       +------------------+     +--------------------+
|   main.css      |       |    app.js        |     |   three-scene.js   |
| (Styles & Grid) |       | (DOM Logic & UI) |     |  (3D Canvas Scene) |
+-----------------+       +------------------+     +--------------------+
|                        |
v                        v
+------------------+     +--------------------+
|     gsap.js      |     |  Three.js / Orbit  |
| (Scroll Trigger) |     |   (GLTF Loader)    |
+------------------+     +--------------------+


---

## 2. Directory & File Structure
```text
estate-vision-3d/
│
├── index.html              # Main Single Page App Entry Point
│
├── assets/
│   ├── models/
│   │   └── modern_house.gltf # 3D Model File for Property Showcase
│   ├── images/
│   │   ├── hero-bg.jpg
│   │   └── properties/     # Property Gallery Images
│   └── icons/              # SVG Icons for Amenities
│
├── css/
│   ├── variables.css       # Design System CSS Variables (Colors, Fonts, Spacing)
│   ├── style.css           # Core Layouts & Utility Styles
│   └── components.css      # Cards, Modals, Sliders, and Buttons Styling
│
├── js/
│   ├── three-scene.js      # Three.js 3D Canvas Initialization, Lighting & Model Load
│   ├── animation.js        # GSAP & ScrollTrigger Animations Setup
│   ├── calculator.js       # Interactive EMI & Mortgage Calculator Logic
│   ├── filter.js           # Dynamic Property Search & Filter Engine
│   └── app.js              # Main Script Initializer & Modal Event Handlers
│
│
└── docs/
    ├── PRD.md              # Product Requirements Document
    ├── Architecture.md     # App Flow, Architecture & File Structure
    ├── Rules.md            # Coding Standards & Guidelines for AI
    ├── Phases.md           # Step-by-Step Development Phases
    ├── Design.md           # Color Theme & Design System Specification
    └── Memory.md           # Project Progress & Context Memory Tracker
3. Core Tech Stack Specifications
HTML5: Semantic HTML (<header>, <main>, <section>, <article>, <footer>) for maximum SEO optimization and accessibility.

CSS3: Custom CSS Variables for easy theme switching, Flexbox & CSS Grid for dynamic layouts, CSS Backdrop-filter for Glassmorphism.

JavaScript (ES6+): Modular JS code using Event Delegation, Array methods (filter, reduce), and Async/Await for API/Assets loading.

3D Engine: Three.js + GLTFLoader + OrbitControls imported via Cloudflare / jsDelivr CDNs.

Animation Library: GSAP 3.x + ScrollTrigger plugin via CDN for smooth scroll-driven UI reveals.
4. Data Flow & Interactivity
Initial Page Load: Browser parses index.html, loads styles, and executes CDN scripts for Three.js & GSAP.

3D Canvas Render: three-scene.js initializes the WebGLRenderer, sets up PerspectiveCamera and Lights, and loads modern_house.gltf.

User Interaction (Filter): User selects filter criteria (e.g., Price/BHK) -> filter.js intercept events -> filters properties array -> updates DOM dynamically.

Calculations: User adjusts sliders in EMI calculator -> calculator.js calculates monthly breakdown in real-time -> updates DOM text.