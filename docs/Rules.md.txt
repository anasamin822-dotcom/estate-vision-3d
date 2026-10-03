# Project Coding Rules & AI Guidelines (`Rules.md`)

## 1. Core Mandates (What to Use)
- **Vanilla Tech Stack Only:** Strictly use HTML5, CSS3, and ES6+ JavaScript. No frameworks like React, Next.js, or Vue for code implementation.
- **CDN Imports:** Import Three.js, GSAP, and FontAwesome directly via fast CDNs inside `index.html`.
- **Modular JavaScript:** Keep JS code modular and cleanly separated (`three-scene.js`, `calculator.js`, `filter.js`, `app.js`).
- **Semantic HTML:** Always use semantic elements (`<header>`, `<nav>`, `<section>`, `<article>`, `<main>`, `<footer>`).
- **CSS Custom Properties:** Define all colors, fonts, shadows, and spacing inside `variables.css` for clean design system maintenance.
- **Responsive First:** Write CSS using Flexbox and CSS Grid, ensuring full responsiveness across mobile (320px+), tablet, and desktop screens.

## 2. Strict Restrictions (What to Avoid)
- **NO Heavy Frameworks:** Do NOT install or generate code using React, Vue, Angular, or Tailwind CLI.
- **NO Inline CSS or Styles:** Avoid inline `style="..."` attributes in HTML unless dynamically required by JavaScript (e.g., 3D canvas sizing).
- **NO Monolithic JS Files:** Do NOT put 3D scene logic, UI logic, and calculator math in a single massive file.
- **NO External Build Tools Required:** The project must run directly by opening `index.html` in a browser or serving via Live Server without npm/webpack builds.

## 3. Performance & 3D Boundaries
- **Optimized 3D Assets:** 3D GLTF models must be under 5MB to ensure fast loading times over mobile networks.
- **FPS Optimization:** Render Three.js animation loops efficiently using `requestAnimationFrame` and clean up unused geometries/materials.
- **Graceful Fallbacks:** If WebGL is not supported on a device, display a high-res static hero image fallback automatically.

## 4. Code Quality & Error Handling
- **Event Delegation:** Use event delegation for dynamic list items (e.g., property cards filtering).
- **Form & Input Validation:** Validate all input fields in the EMI calculator and contact form with clear user feedback.
- **Clean Console Log:** Remove debug `console.log()` calls before finalizing files.
