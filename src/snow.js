import { Container, Graphics, RenderTexture, Sprite, Application } from 'pixi.js';

// Generate a procedural snowflake texture
function createSnowflakeGraphics(size, complexity = 6) {
  const g = new Graphics();
  const arms = 6;
  const armLength = size * 0.45;

  g.setStrokeStyle({ width: size * 0.08, color: 0xffffff, cap: 'round' });

  // Draw 6-fold symmetrical arms
  for (let i = 0; i < arms; i++) {
    const angle = (i / arms) * Math.PI * 2 - Math.PI / 2;

    // Main arm
    const endX = Math.cos(angle) * armLength;
    const endY = Math.sin(angle) * armLength;

    g.moveTo(0, 0);
    g.lineTo(endX, endY);

    // Side branches (vary by complexity)
    if (complexity > 3) {
      const branchPos = 0.5 + Math.random() * 0.2;
      const branchLength = armLength * (0.3 + Math.random() * 0.2);
      const branchAngle1 = angle - Math.PI / 6;
      const branchAngle2 = angle + Math.PI / 6;

      const bx = Math.cos(angle) * armLength * branchPos;
      const by = Math.sin(angle) * armLength * branchPos;

      g.moveTo(bx, by);
      g.lineTo(bx + Math.cos(branchAngle1) * branchLength, by + Math.sin(branchAngle1) * branchLength);

      g.moveTo(bx, by);
      g.lineTo(bx + Math.cos(branchAngle2) * branchLength, by + Math.sin(branchAngle2) * branchLength);
    }

    // Smaller secondary branches
    if (complexity > 5) {
      const branch2Pos = 0.75;
      const branch2Length = armLength * 0.2;

      const b2x = Math.cos(angle) * armLength * branch2Pos;
      const b2y = Math.sin(angle) * armLength * branch2Pos;

      g.moveTo(b2x, b2y);
      g.lineTo(b2x + Math.cos(angle - Math.PI / 5) * branch2Length, b2y + Math.sin(angle - Math.PI / 5) * branch2Length);

      g.moveTo(b2x, b2y);
      g.lineTo(b2x + Math.cos(angle + Math.PI / 5) * branch2Length, b2y + Math.sin(angle + Math.PI / 5) * branch2Length);
    }
  }

  g.stroke();

  // Center dot
  g.circle(0, 0, size * 0.06);
  g.fill(0xffffff);

  return g;
}

// Simple circle snowflake for small sizes
function createSimpleSnowflake(size) {
  const g = new Graphics();

  // Soft radial gradient effect using concentric circles
  const steps = 3;
  for (let i = steps; i >= 0; i--) {
    const radius = (size / 2) * ((i + 1) / (steps + 1));
    const alpha = 1 - (i / (steps + 1)) * 0.5;
    g.circle(0, 0, radius);
    g.fill({ color: 0xffffff, alpha });
  }

  return g;
}

export function createSnowLayer(screenWidth, screenHeight, config) {
  const container = new Container();
  const { count, sizeRange, speedRange, opacity, drift } = config;

  const snowflakes = [];

  for (let i = 0; i < count; i++) {
    const size = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);

    // Use detailed snowflakes for larger sizes, simple for small
    let flake;
    if (size > 12) {
      flake = createSnowflakeGraphics(size, 6);
    } else if (size > 6) {
      flake = createSnowflakeGraphics(size, 4);
    } else {
      flake = createSimpleSnowflake(size);
    }

    flake.x = Math.random() * screenWidth;
    flake.y = Math.random() * screenHeight;
    flake.alpha = opacity * (0.7 + Math.random() * 0.3);

    // Store animation data
    flake.userData = {
      speed: speedRange[0] + Math.random() * (speedRange[1] - speedRange[0]),
      wobbleFreq: 0.5 + Math.random() * 1.5,
      wobbleAmp: 20 + Math.random() * 40 * drift,
      phase: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.5,
      baseX: flake.x,
    };

    container.addChild(flake);
    snowflakes.push(flake);
  }

  function update(elapsed, width, height) {
    for (const flake of snowflakes) {
      const data = flake.userData;

      // Fall
      flake.y += data.speed * 0.016;

      // Wobble (sinusoidal drift)
      flake.x = data.baseX + Math.sin(elapsed * data.wobbleFreq + data.phase) * data.wobbleAmp;

      // Gentle rotation for detailed flakes
      flake.rotation += data.rotationSpeed * 0.016;

      // Reset when off screen
      if (flake.y > height + 50) {
        flake.y = -50;
        data.baseX = Math.random() * width;
        flake.x = data.baseX;
      }

      // Wrap horizontally
      if (flake.x < -50) {
        data.baseX += width + 100;
        flake.x = data.baseX;
      } else if (flake.x > width + 50) {
        data.baseX -= width + 100;
        flake.x = data.baseX;
      }
    }
  }

  return { container, update };
}
