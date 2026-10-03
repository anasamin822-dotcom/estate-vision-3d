# Project Context & Progress Memory (`Memory.md`)

## 1. Project Identity & Overview
- **Project Name:** EstateVision 3D
- **Objective:** High-impact, agency-grade real estate 3D landing page for developer portfolio.
- **Developer:** Md Anas Amin
- **Live Deployment URL:** https://developer-portfolio-khaki-nine.vercel.app/

## 2. Tech Stack Mandate
- **Core Stack:** HTML5, CSS3, Vanilla JavaScript (ES6+).
- **3D & Animation Libraries (via CDN):** Three.js (r128+), GLTFLoader, OrbitControls, GSAP (3.12+), ScrollTrigger, FontAwesome 6.
- **Styling Architecture:** Glassmorphism, Dark Luxe Obsidian Theme, Custom Shaders/Distortions, Responsive Grid/Flexbox.
- **Separation:** Strict zero inline CSS/JS. External stylesheets in `css/`, modular scripts in `js/`.

## 3. Phase Status Tracker
- [x] **Phase 1: Environment Setup & Document Boilerplate**
  - [x] Initialized folder structure (`assets/models/`, `assets/images/`, `assets/icons/`, `css/`, `js/`, `docs/`).
  - [x] Created `index.html` with zero inline CSS/JS and semantic layout.
  - [x] Created `css/variables.css` with 8-step type scale, button heights, and glow tokens.
- [x] **Phase 2: Core Layout & HTML/CSS Component Styling**
  - [x] Built Glassmorphism Navbar with live 3D engine status and mobile drawer.
  - [x] Built Hero Section layout with 3D canvas viewport, HUD controls, and luxury metrics.
  - [x] Built Architecture specs grid with organic card hover effects.
  - [x] Built Dynamic Properties Showcase grid with search, dropdowns, and active tag pills.
  - [x] Built Interactive EMI / Mortgage Calculator with real-time range sliders and bar visualization.
  - [x] Built VIP Viewing Booking consultation form with validation and feedback states.
  - [x] Built Virtual Tour Modal and Toast Notification components.
  - [x] Resolved all 10 usability heuristic issues (type scale, unified buttons, title casing, slider affordance, high-contrast like button, aligned filter toolbar, modal close anchor).
- [x] **Phase 3: Three.js 3D Scene Implementation**
  - [x] Integrated `GLTFLoader` with real-time progress track sync and graceful fallback to procedural architectural geometry.
  - [x] Implemented real-time 3D-to-2D screen-projected interactive hotspots anchored to architectural model features.
  - [x] Added dynamic pool water shader shimmer and ACES Filmic tonemapping.
  - [x] Added interactive camera focus animations when clicking architectural hotspots.
  - [x] Day/Night environmental lighting transitions and wireframe mode.
- [x] **Phase 4: Dynamic JavaScript Logic & Interactions**
  - [x] Real-time mortgage math with reactive track gradient fills for sliders.
  - [x] Dynamic client-side multi-filter engine (search, location, BHK, price) with event delegation.
  - [x] Interactive 3D Card Tilt physics on mousemove across property and spec cards.
  - [x] Fluid ambient glow mesh following cursor movements with lerp inertia.
  - [x] Animated statistics counters for metrics strip.
- [x] **Phase 5: GSAP Animations & Polish**
  - [x] GSAP ScrollTrigger 3D model rotation and vertical sync during scroll.
  - [x] Cohesive stagger reveals for cards and sections.
- [x] **Phase 6: Bespoke Agency-Grade Refactor & Anti-Slop Elevation**
  - [x] Extracted and synthesized guidelines from `emilkowalski/skills`, `taste-skill`, and `Not-Ai`.
  - [x] Redesigned design system tokens in `variables.css` (rich metallic gold `#d4a916`, deep void `#08090b`, non-linear type scale, custom spring ease curves `--ease-spring`).
  - [x] Eliminated AI smell in `style.css`: asymmetric layout grids (`1.4fr 1fr 1fr`), tactile SVG grain/noise overlay (`body::before`), deliberate viewport frame tilt, open editorial metrics strip.
  - [x] Upgraded component styling in `components.css`: physical Dark Luxe buttons with top highlights, hairline shimmer rules on cards, tabular numerals, monospaced micro-labels, and non-conflicting hover physics.
  - [x] Overhauled `animation.js`: velocity-tracked spring card tilt, magnetic nav/button interactions (`dx * 0.28`), clip-path reveals, and 3-point autonomous ambient glow follower.

- [x] **Phase 7: ThreeUI <KiboriLandingPage /> Integration & Aesthetic Harmonization**
  - [x] Integrated exact ThreeUI `KiboriLandingPage` component at `src/shaders/kibori-landing-page/KiboriLandingPage.tsx`.
  - [x] Sourced and deployed canonical runtime bundle at `landing-pages/kibori.html` and `public/landing-pages/kibori.html`.
  - [x] Localized all 17 assets and typography weights to `landing-pages/kibori-assets/` and `public/landing-pages/kibori-assets/`.
  - [x] Established `@designcodeio/threeui` module entrypoints in `src/index.ts` and `src/style.css`.
  - [x] Harmonized EstateVision 3D design system with Kibori's Kyoto Dark Luxe visual language: warm ash ground (`#0a0806`), terracotta fire accents (`#9d382c`), amber hairline highlights, and Instrument Serif editorial typography.

## 4. Current State & Verification
- **Local Server:** Running on `http://localhost:8080/index.html`.
- **Kibori Runtime:** Accessible at `http://localhost:8080/landing-pages/kibori.html` (200 OK).
- **Status:** All Phase 1 through 7 milestones completed, verified, and serving with 200 OK.