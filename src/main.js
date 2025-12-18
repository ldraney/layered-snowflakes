import { Application, Container, BlurFilter } from 'pixi.js';
import { createSnowLayer, createIntricateLayer } from './snow.js';
import { createBackground } from './background.js';

async function init() {
  const app = new Application();

  await app.init({
    background: '#0d1117',
    resizeTo: window,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });

  document.body.appendChild(app.canvas);

  const width = app.screen.width;
  const height = app.screen.height;

  // Background with warm bokeh
  const background = createBackground(width, height);
  app.stage.addChild(background);

  // Snow layers (back to front)
  // Each layer: { count, sizeRange, speedRange, opacity, blur, drift }
  const layerConfigs = [
    { count: 40, sizeRange: [2, 4], speedRange: [15, 25], opacity: 0.3, blur: 0, drift: 0.3 },
    { count: 60, sizeRange: [3, 6], speedRange: [25, 40], opacity: 0.4, blur: 0, drift: 0.4 },
    { count: 80, sizeRange: [5, 10], speedRange: [40, 60], opacity: 0.6, blur: 0, drift: 0.5 },
    { count: 50, sizeRange: [10, 18], speedRange: [60, 90], opacity: 0.7, blur: 1, drift: 0.7 },
    { count: 25, sizeRange: [20, 35], speedRange: [90, 130], opacity: 0.5, blur: 3, drift: 1.0 },
  ];

  const snowLayers = [];

  for (const config of layerConfigs) {
    const layer = createSnowLayer(width, height, config);

    if (config.blur > 0) {
      layer.container.filters = [new BlurFilter({ strength: config.blur, quality: 3 })];
    }

    app.stage.addChild(layer.container);
    snowLayers.push(layer);
  }

  // === HERO LAYER: Intricate detailed snowflakes ===
  const intricateLayer = createIntricateLayer(width, height);
  app.stage.addChild(intricateLayer.container);

  // Handle resize
  window.addEventListener('resize', () => {
    // Layers will adapt on next frame
  });

  // Animation
  let elapsed = 0;
  app.ticker.add((ticker) => {
    elapsed += ticker.deltaTime / 60;

    for (const layer of snowLayers) {
      layer.update(elapsed, app.screen.width, app.screen.height);
    }

    // Update hero layer
    intricateLayer.update(elapsed, app.screen.width, app.screen.height);
  });
}

init().catch(console.error);
