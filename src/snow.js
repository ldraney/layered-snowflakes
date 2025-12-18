import * as THREE from 'three';

const SNOW_COUNT = 3000;
const SNOW_AREA = { width: 3.5, height: 4, depth: 2 };
const WINDOW_CENTER = { x: 0, y: 2.2, z: -4 };

export function createSnowSystem() {
  const group = new THREE.Group();

  // Create snowflake texture procedurally
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  // Soft radial gradient for snowflake
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.9)');
  gradient.addColorStop(0.5, 'rgba(240, 248, 255, 0.5)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const snowTexture = new THREE.CanvasTexture(canvas);

  // Create particles
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(SNOW_COUNT * 3);
  const sizes = new Float32Array(SNOW_COUNT);
  const velocities = new Float32Array(SNOW_COUNT * 3);
  const phases = new Float32Array(SNOW_COUNT);

  for (let i = 0; i < SNOW_COUNT; i++) {
    const i3 = i * 3;

    // Position snowflakes behind the window
    positions[i3] = WINDOW_CENTER.x + (Math.random() - 0.5) * SNOW_AREA.width;
    positions[i3 + 1] = WINDOW_CENTER.y + (Math.random() - 0.5) * SNOW_AREA.height * 2;
    positions[i3 + 2] = WINDOW_CENTER.z - Math.random() * SNOW_AREA.depth;

    // Varied sizes - larger particles
    const depthFactor = (positions[i3 + 2] - (WINDOW_CENTER.z - SNOW_AREA.depth)) / SNOW_AREA.depth;
    sizes[i] = 0.03 + depthFactor * 0.05 + Math.random() * 0.03;

    // Velocities
    velocities[i3] = (Math.random() - 0.5) * 0.08;
    velocities[i3 + 1] = -(0.2 + Math.random() * 0.3);
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

    phases[i] = Math.random() * Math.PI * 2;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const snowData = { velocities, phases };

  // Simpler, more visible material
  const material = new THREE.PointsMaterial({
    size: 0.08,
    map: snowTexture,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: THREE.NormalBlending,
    sizeAttenuation: true,
    color: 0xffffff
  });

  const points = new THREE.Points(geometry, material);
  group.add(points);

  function update(delta, elapsed) {
    const positions = geometry.attributes.position.array;

    for (let i = 0; i < SNOW_COUNT; i++) {
      const i3 = i * 3;

      // Apply velocity
      positions[i3] += snowData.velocities[i3] * delta;
      positions[i3 + 1] += snowData.velocities[i3 + 1] * delta;
      positions[i3 + 2] += snowData.velocities[i3 + 2] * delta;

      // Sinusoidal drift
      const phase = snowData.phases[i];
      positions[i3] += Math.sin(elapsed * 0.5 + phase) * 0.003;
      positions[i3] += Math.sin(elapsed * 1.5 + phase * 2) * 0.002;

      // Reset if fallen too far
      if (positions[i3 + 1] < WINDOW_CENTER.y - SNOW_AREA.height * 1.5) {
        positions[i3 + 1] = WINDOW_CENTER.y + SNOW_AREA.height;
        positions[i3] = WINDOW_CENTER.x + (Math.random() - 0.5) * SNOW_AREA.width;
        positions[i3 + 2] = WINDOW_CENTER.z - Math.random() * SNOW_AREA.depth;
      }

      // Horizontal bounds
      const halfWidth = SNOW_AREA.width / 2;
      if (positions[i3] < WINDOW_CENTER.x - halfWidth) {
        positions[i3] = WINDOW_CENTER.x + halfWidth;
      } else if (positions[i3] > WINDOW_CENTER.x + halfWidth) {
        positions[i3] = WINDOW_CENTER.x - halfWidth;
      }
    }

    geometry.attributes.position.needsUpdate = true;
  }

  return { group, update };
}
