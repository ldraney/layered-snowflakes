import { Container, Graphics } from 'pixi.js';

export function createBackground(width, height) {
  const container = new Container();

  // Dark gradient background (night sky feel)
  const gradient = new Graphics();

  // Simulate gradient with horizontal bands
  const bands = 30;
  for (let i = 0; i < bands; i++) {
    const t = i / bands;
    // Dark blue at top, slightly warmer dark at bottom
    const r = Math.floor(13 + t * 15);
    const g = Math.floor(17 + t * 10);
    const b = Math.floor(23 + t * 8);
    const color = (r << 16) | (g << 8) | b;

    gradient.rect(0, (i / bands) * height, width, height / bands + 1);
    gradient.fill(color);
  }
  container.addChild(gradient);

  // Warm bokeh lights (out of focus background lights suggesting cozy interior)
  const bokeh = new Graphics();

  // Create several warm, glowing circles at different positions
  const bokehLights = [
    { x: width * 0.15, y: height * 0.7, size: 120, color: 0xffa726, alpha: 0.08 },
    { x: width * 0.85, y: height * 0.6, size: 150, color: 0xffcc80, alpha: 0.06 },
    { x: width * 0.5, y: height * 0.8, size: 200, color: 0xffe0b2, alpha: 0.05 },
    { x: width * 0.3, y: height * 0.4, size: 80, color: 0xffab91, alpha: 0.07 },
    { x: width * 0.7, y: height * 0.3, size: 100, color: 0xffcc80, alpha: 0.06 },
    { x: width * 0.1, y: height * 0.2, size: 60, color: 0xffa726, alpha: 0.05 },
    { x: width * 0.9, y: height * 0.85, size: 180, color: 0xffab91, alpha: 0.04 },
  ];

  for (const light of bokehLights) {
    // Soft radial glow (concentric circles with decreasing alpha)
    const steps = 5;
    for (let i = steps; i >= 0; i--) {
      const radius = light.size * ((i + 1) / (steps + 1));
      const alpha = light.alpha * (1 - i / (steps + 1));
      bokeh.circle(light.x, light.y, radius);
      bokeh.fill({ color: light.color, alpha });
    }
  }
  container.addChild(bokeh);

  // Subtle vignette effect
  const vignette = new Graphics();

  // Dark corners using radial-ish gradient from center
  const cx = width / 2;
  const cy = height / 2;
  const maxDist = Math.sqrt(cx * cx + cy * cy);

  // Create vignette with concentric ellipses
  const vignetteSteps = 10;
  for (let i = 0; i < vignetteSteps; i++) {
    const t = i / vignetteSteps;
    const alpha = t * t * 0.4; // Quadratic falloff, max 0.4 at edges

    // Draw a full-screen rect and cut out an ellipse (inverse)
    // Instead, we'll draw rings that get more opaque toward edges
    const innerScale = 1 - t * 0.3;
    const outerScale = 1 - (t - 0.1) * 0.3;

    if (i > 0) {
      vignette.ellipse(cx, cy, cx * (1.3 - t * 0.3), cy * (1.3 - t * 0.3));
      vignette.fill({ color: 0x000000, alpha: alpha * 0.15 });
    }
  }
  container.addChild(vignette);

  return container;
}
