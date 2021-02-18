import { Color, Scene } from 'three';
import { Fog } from 'three/build/three.module';

function createScene() {
  const scene = new Scene();
  scene.background = new Color('skyblue');
  return scene;
}

export { createScene };
