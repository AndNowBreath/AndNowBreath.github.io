### AI Coding Agent Prompt: Interactive 3D Soft Body Balloon Simulation

**Objective:**

Create an interactive, single-page 3D application using `three.js` that demonstrates a realistic soft-body physics simulation of a balloon using `ammo.js`.

**Core Technologies:**

- **3D Rendering:** `three.js`
- **Physics Engine:** `ammo.js` (WASM version recommended for performance)
- **Asset Loading:** `GLTFLoader` for `three.js`.

**Detailed Requirements:**

**1. Scene and Physics World Setup:**
_ Initialize a standard `three.js` scene with a camera, renderer, and basic lighting (e.g., an `AmbientLight` and a `DirectionalLight`).
_ Set up the `ammo.js` physics world. Configure gravity (e.g., `(0, -9.8, 0)`). \* Create a static ground plane in both `three.js` (visible) and `ammo.js` (for collision).

**2. The Balloon:**
_ **Model:** Load a GLTF model of a balloon (e.g., `low-poly_balloon.glb`). The mesh from this model will define the visual shape and the physics body.
_ **Physics Body:**
_ Create an `ammo.js` soft body that accurately represents the balloon's mesh. The vertices of the `three.js` mesh should map directly to the nodes of the `ammo.js` soft body.
_ Configure the soft body's properties to simulate a balloon filled with air:
_ Set appropriate `pressure` to make it resist deformation.
_ Adjust `kDF` (dynamic friction), `kDP` (damping), and other relevant soft body constants for a "bouncy" and realistic feel.
_ Set the total mass for the balloon.
_ **Positioning:** The balloon should initially be positioned slightly above the scene's origin `(0, 0, 0)`. \* **Updating:** In the animation loop, the `three.js` balloon mesh's vertices must be updated with the positions of the corresponding nodes from the `ammo.js` soft body.

**3. The Rope:**
_ **Visual Representation:** Create a visual representation for the rope in `three.js`. This could be a simple `Line` object, a `TubeGeometry`, or another loaded model.
_ **Physics Constraint:**
_ Implement an `ammo.js` rope constraint (or a similar constraint like a `btPoint2PointConstraint` with some slack if a direct rope isn't straightforward).
_ **Anchors:** 1. The first anchor point should be fixed to the world at the scene origin `(0, 0, 0)`. 2. The second anchor point should be attached to one of the bottom nodes/vertices of the balloon's soft body. \* **Behavior:** The rope should be flexible but have a maximum length, preventing the balloon from floating away while allowing it to drift and move within the rope's range.

**4. Environmental Forces:**
_ Simulate a gentle, persistent, and slightly varying breeze.
_ This can be achieved by applying a small, continuous force to the nodes of the balloon's soft body in the animation loop. The direction and magnitude of this force should change subtly over time (e.g., using a sine wave or Perlin noise) to mimic natural wind.

**5. Interactivity and Collisions:**
_ **Deformation:**
_ Implement a way to "poke" the balloon (e.g., on a mouse click). This should apply a temporary force to the nearest soft body node, causing a visible, temporary indentation in the balloon mesh.
_ **Collision with Rigid Bodies:**
_ Create a function that can "throw" a rigid body sphere (`three.js` `SphereGeometry` + `ammo.js` `btSphereShape`) at the balloon.
_ When the sphere collides with the balloon, the balloon's soft body should deform at the point of impact.
_ The sphere, being a rigid body, should realistically bounce off the balloon due to the balloon's internal pressure and material properties. The sphere should then fall to the ground plane subject to gravity.

**6. Code Structure:**
_ Organize the code into a clear, modular structure. For example, a main `App` class that handles initialization and the animation loop, and perhaps separate helper functions or classes for setting up the `three.js` scene and the `ammo.js` world.
_ Ensure to handle the asynchronous loading of `ammo.js` and the GLTF model before starting the simulation.

**Summary of Expected Final Result:**
A 3D scene where a soft-body balloon is tethered to the ground by a rope. The balloon gently sways and drifts in a simulated breeze. It realistically deforms when poked by the user or struck by other physics objects, which then bounce off it.
