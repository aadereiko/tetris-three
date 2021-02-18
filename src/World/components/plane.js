import { BoxGeometry, DoubleSide, Mesh, MeshPhongMaterial, MirroredRepeatWrapping } from "three";

import { textureLoader } from '../systems/textureLoader';
const name = 'Plane';

function createPlane() {
    const geometry = new BoxGeometry(500, 450, 4);


    const floor = textureLoader.load('assets/textures/floor.jpg');
    
    floor.wrapS = MirroredRepeatWrapping;
    floor.wrapT = MirroredRepeatWrapping;

    floor.repeat.set(5, 5);

    const material = new MeshPhongMaterial({ map: floor, side: DoubleSide, visible: true });

    const plane = new Mesh(geometry, material);
    plane.receiveShadow = true;
    plane.rotateX(Math.PI / 2);
    plane.position.y = -475;
    plane.position.x = -25;
    plane.name = name;
    return plane;
}

export {
    createPlane, 
};