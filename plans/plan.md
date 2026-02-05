# Technical Scope for Interactive 3D Balloon Component

## 1. Project Goal

Create an interactive 3D component featuring three physics-based balloons for a React single-page application, using Three.js and its ecosystem. The component should be inspired by the interactive element on `https://www.davidtidman.com/`.

## 2. Core Technologies

- **React:** The application framework.
- **Three.js:** The core 3D rendering library.
- **@react-three/fiber:** A React renderer for Three.js, for creating declarative 3D scenes.
- **@react-three/drei:** A collection of useful helpers and abstractions for `@react-three/fiber`.
- **@react-three/postprocessing:** For advanced visual effects.
- **A physics engine:** such as `use-cannon` or integrating Ammo.js within the React ecosystem.

## 3. Component Breakdown

### 3.1. `Balloon` Component

- **Props:** This component should accept props for customization, such as `position`, `color`, and `modelUrl`.
- **Model Loading:** Use `@react-three/drei`'s `useGLTF` hook to load the `low-poly_balloon.glb` model.
- **Physics Body:**
  - Create a soft body physics representation of the balloon model.
  - The balloon should have a string attached to it, anchoring it to a specific point in the scene.
- **Interaction:**
  - On mouse hover, the balloon should have a subtle visual feedback (e.g., a glow or highlight).
  - On mouse click, a force should be applied to the balloon, making it react realistically.
- **Material:** Use a `MeshStandardMaterial` or a custom shader for a visually appealing balloon surface.

### 3.2. `Scene` Component

- **Instancing:** This component will render three instances of the `Balloon` component, each with a different position and color.
- **Lighting:**
  - **Ambient Light:** To provide basic illumination.
  - **Directional Light:** To create highlights and shadows.
  - **HDRI Environment:** Use `@react-three/drei`'s `Environment` component to set up an HDRI background for realistic reflections and lighting. The existing hdri files in `docs/hdri` can be used.
- **Physics World:** Set up the physics world with gravity and other global parameters.
- **Camera:** Use `@react-three/drei`'s `PerspectiveCamera` and `OrbitControls` for scene navigation.

## 4. Art and Assets

- **3D Model:** Use the existing `docs/low-poly_balloon.glb` file.
- **HDRI:** Use one of the HDRI images from the `docs/hdri` directory.

## 5. Implementation Plan

The coding AI agent should follow these steps:

1.  **Setup:** Install necessary dependencies (`@react-three/fiber`, `@react-three/drei`, a physics library).
2.  **Component Creation:** Create the `Balloon.js` and `Scene.js` component files.
3.  **Balloon Logic:** Implement the `Balloon` component, including model loading, physics, and interaction logic.
4.  **Scene Composition:** Implement the `Scene` component, instantiating the balloons and setting up the environment.
5.  **Integration:** Integrate the `Scene` component into the main `App.js` file.
6.  **Styling and Polish:** Fine-tune the visuals, physics, and interactions to match the reference website's quality.

---

# Prompt for the Coding AI Agent

"Your task is to create a reusable React component for an interactive 3D scene with three balloons using `@react-three/fiber`. You will find a technical scope document at `plans/plan.md` to guide you.

**Key Requirements:**

- Create a `Balloon` component that loads the `docs/low-poly_balloon.glb` model.
- Use a physics library (e.g., `use-cannon` or Ammo.js) to make the balloons soft bodies that are anchored by a string.
- Implement mouse interactions: a hover effect and a "push" force on click.
- Create a `Scene` component that renders three instances of the `Balloon` component.
- Set up realistic lighting and environment using an HDRI from the `docs/hdri` directory.
- Integrate the final `Scene` component into `src/App.js`.

Please refer to `plans/plan.md` for a more detailed breakdown of the components and implementation plan."
