import { createCamera } from "./components/camera.js";
import { createLights } from "./components/lights.js";
import { createScene } from "./components/scene.js";
import { createHelpers } from "./components/helpers.js";

import { createOrbitControls } from "./systems/controls.js";
import { createRenderer } from "./systems/renderer.js";
import { Resizer } from "./systems/Resizer.js";
import { Loop } from "./systems/Loop.js";
import { tetrominoThree } from "./components/tetromino.js";
import { createPlane } from "./components/plane.js";

let camera;
let renderer;
let scene;
let loop;

class World {
  constructor(container) {
    camera = createCamera();
    renderer = createRenderer();
    scene = createScene();

    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);

    const orbitControls = createOrbitControls(camera, renderer.domElement);
    // orbitControls.enabled = false;
    const { directionalLight, ambientLight } = createLights();
    const plane = createPlane();

    // loop.updatables.push(orbitControls);
    loop.updatables.push(tetrominoThree);

    new Resizer(container, camera, renderer);
    const { axesHelper, leftGridHelper, rightGridHelper } = createHelpers();
    scene.add(axesHelper);
    scene.add(directionalLight, ambientLight);
    scene.add(...tetrominoThree.cells);
    scene.add(plane);
  }

  async init() {
  }

  render() {
    renderer.render(scene, camera);
  }

  start() {
    loop.start();
  }

  stop() {
    loop.stop();
  }
}

export { World };
