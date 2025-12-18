import * as THREE from 'three';
import { EffectComposer, RenderPass, BloomEffect, EffectPass, VignetteEffect } from 'postprocessing';
import { createRoom } from './room.js';
import { createSnowSystem } from './snow.js';
import { createLighting } from './lighting.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);
scene.fog = new THREE.Fog(0x1a1a2e, 8, 20);

// Camera - positioned to view the cozy room
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.5, 6);
camera.lookAt(0, 1, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'high-performance'
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.body.appendChild(renderer.domElement);

// Post-processing
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomEffect = new BloomEffect({
  intensity: 0.5,
  luminanceThreshold: 0.6,
  luminanceSmoothing: 0.3,
  mipmapBlur: true
});

const vignetteEffect = new VignetteEffect({
  darkness: 0.4,
  offset: 0.3
});

composer.addPass(new EffectPass(camera, bloomEffect, vignetteEffect));

// Build the scene
const room = createRoom();
scene.add(room);

const lighting = createLighting();
scene.add(lighting);

const snowSystem = createSnowSystem();
scene.add(snowSystem.group);

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  // Update snow
  snowSystem.update(delta, elapsed);

  // Subtle camera breathing
  camera.position.y = 1.5 + Math.sin(elapsed * 0.3) * 0.02;

  composer.render();
}

animate();
