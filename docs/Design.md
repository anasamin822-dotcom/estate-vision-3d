# Design System & UI/UX Experience Guidelines (`Design.md`)

## 1. Design Vision & Philosophy (Anti-Slop AI Protocol)
- **Goal:** Build an ultra-luxurious, non-generic, award-winning real estate landing page (`EstateVision 3D`) that looks 100% human-crafted and agency-grade.
- **Core Aesthetic:** Dark Luxe Minimalism, WebGL Interactive Glassmorphism, 3D Canvas Fusion, Fluid Mechanics, CRT Distortions, and High-Precision Typography.
- **Inspiration Sources & Skill References:**
  - `threeui.com` & `gsap.com`: Interactive 3D viewports, spatial WebGL lighting, and smooth inertia scroll.
  - `tasteskill.dev` & `21st.dev`: High-taste micro-components, crisp visual hierarchy, and polished design tokens.
  - `impeccable` & `emilkowalski/skills`: Fluid physics, spring-based interaction feedback, custom WebGL shaders, and ripple mouse trails.

---

## 2. Color Palette & Dark Luxe Theme Tokens

```css
:root {
  /* Surface & Background Colors */
  --bg-primary: #08090a;          /* Deep Obsidian Void */
  --bg-secondary: #0f1115;        /* Dark Slate Surface */
  --bg-glass: rgba(15, 17, 21, 0.65); /* Glassmorphism Overlay */
  
  /* Brand Accent Colors */
  --accent-gold: #e2b714;         /* Champagne Luxe Gold */
  --accent-cyan: #00f2fe;         /* Futuristic WebGL Cyan Light */
  --accent-emerald: #10b981;      /* Emerald Green for Pricing/Status */
  
  /* Typography & Borders */
  --text-primary: #f8fafc;        /* High-Contrast Crisp White */
  --text-secondary: #94a3b8;      /* Muted Metallic Silver */
  --text-dim: #475569;            /* Subtle Charcoal Labeling */
  --border-glass: rgba(255, 255, 255, 0.08);
  --border-glow: rgba(226, 183, 20, 0.3);
  
  /* Shadows & Shaders */
  --shadow-glow: 0 0 30px rgba(226, 183, 20, 0.15);
  --shadow-card: 0 20px 40px -15px rgba(0, 0, 0, 0.7);
}
3. Typography & Micro-Layout System
Primary Font (Headings & Hero): Syne, Plus Jakarta Sans, or Clash Display (Sans-serif, aggressive geometry, modern luxury).

Secondary Font (Body & UI Components): Inter or Space Grotesk (High readability, clean spacing).

Monospace Accent (Data, EMI Math, Coordinate Displays): JetBrains Mono or Fira Code.

4. Crazy UI/UX Interactions & WebGL Physics
A. Fluid & Water Ripple Mouse Distortion Mechanics
Interaction: WebGL Custom Fragment Shader on background canvas.

Effect: When the user moves the cursor across the luxury house showcase or property cards, a liquid/fluid distortion wave follows the mouse trail smoothly, giving a live interactive water refraction feel.
B. Interactive 3D Real Estate Viewport
Hero Canvas: Three.js GLTF Viewer loaded in high-contrast studio lighting.

Mouse Dynamics: Drag to orbit 360-degrees. On hover over specific house hot-spots (e.g., Swimming Pool, Master Suite, Solar Roof), an animated 3D SVG marker pulses and shows instant specs modal.

C. Retro-Futuristic CRT & Glass Overlay Option
Inspiration: threeui CRT / Scanline Shader mechanics.

Effect: Subtle scanline grain and chromatic aberration around luxury property detail modals to give an ultra-modern tech-agency aesthetic.

D. GSAP Scroll-Triggered Reveal Engine
Hero Text Split: Characters stagger up with spring physics as the page loads.

Scroll Pinning: As the user scrolls down, the 3D House model rotates smoothly along the Z-axis, transitioning from Hero Section -> Architecture Specs Section -> Dynamic Showcase.
5. Key Layout Components & Visual Rules
Glassmorphism Navbar:

Floating header with backdrop-filter: blur(20px) saturate(180%).

Live status badge: "🟢 3D Interactive Engine Active".

Property Cards (Interactive Grid):

Hover state: 3D tilt effect (transform: perspective(1000px) rotateX(...) rotateY(...)).

Image distortion slider transition on tab click.

Mortgage / EMI Calculator UI:

Smooth custom range sliders with glowing track trail.

Real-time updating counter animation for numbers.

Virtual Tour Modal:

Full-screen glass overlay with custom close cursor (×).
