import { GridHelper, AxesHelper } from 'three';
import { MathUtils } from 'three/build/three.module';

function createHelpers() {
  const leftGridHelper = new GridHelper(1000, 20);
  leftGridHelper.rotateX(MathUtils.degToRad(90));
  leftGridHelper.rotateZ(MathUtils.degToRad(-45));

  const rightGridHelper = new GridHelper(1000, 20);
  rightGridHelper.rotateX(MathUtils.degToRad(90));
  rightGridHelper.rotateZ(MathUtils.degToRad(45));


  const axesHelper = new AxesHelper(2000);

  return { leftGridHelper, axesHelper, rightGridHelper };
}

export { createHelpers };