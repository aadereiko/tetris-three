import { PerspectiveCamera } from 'three';

function createCamera() {
  const camera = new PerspectiveCamera(35, 1, 0.1, 10000);

  camera.position.set(0, 0, 3000);

  return camera;
}

export { createCamera };
