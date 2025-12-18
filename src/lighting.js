import * as THREE from 'three';

export function createLighting() {
  const group = new THREE.Group();

  // Ambient light - soft blue for night atmosphere
  const ambient = new THREE.AmbientLight(0x4a5568, 0.3);
  group.add(ambient);

  // Main warm light from inside the room (lamp on desk)
  const lampLight = new THREE.PointLight(0xffd89b, 1.5, 8);
  lampLight.position.set(-1.5, 2, 0);
  lampLight.castShadow = true;
  lampLight.shadow.mapSize.width = 1024;
  lampLight.shadow.mapSize.height = 1024;
  lampLight.shadow.radius = 4;
  group.add(lampLight);

  // Secondary warm light (maybe from fireplace or another lamp)
  const secondaryLight = new THREE.PointLight(0xff9f43, 0.8, 6);
  secondaryLight.position.set(1.5, 0.5, 1);
  secondaryLight.castShadow = true;
  secondaryLight.shadow.mapSize.width = 512;
  secondaryLight.shadow.mapSize.height = 512;
  group.add(secondaryLight);

  // Cold light from window - moonlight/snow reflection
  const windowLight = new THREE.SpotLight(0x8ecae6, 0.6, 10, Math.PI / 4, 0.5);
  windowLight.position.set(0, 3, -3);
  windowLight.target.position.set(0, 0, 2);
  group.add(windowLight);
  group.add(windowLight.target);

  // Rim light for depth
  const rimLight = new THREE.DirectionalLight(0x6699cc, 0.3);
  rimLight.position.set(-3, 2, -2);
  group.add(rimLight);

  return group;
}
