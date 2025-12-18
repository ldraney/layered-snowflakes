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

// ============================================
// INTRICATE SNOWFLAKE - The showstopper
// ============================================
function createIntricateSnowflake(size, seed = Math.random()) {
  const g = new Graphics();
  const arms = 6;
  const armLength = size * 0.45;

  // Seeded random for consistent flake patterns
  const seededRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  // Flake style variations
  const style = Math.floor(seededRandom() * 4); // 0-3 different styles

  // Main stroke
  const mainWidth = size * 0.025;
  const thinWidth = size * 0.015;
  const tinyWidth = size * 0.008;

  // Draw each arm with full detail
  for (let i = 0; i < arms; i++) {
    const angle = (i / arms) * Math.PI * 2 - Math.PI / 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    // === MAIN ARM ===
    g.setStrokeStyle({ width: mainWidth, color: 0xffffff, cap: 'round' });
    g.moveTo(0, 0);
    g.lineTo(cos * armLength, sin * armLength);
    g.stroke();

    // === CENTER HEXAGON (style 0, 2) ===
    if ((style === 0 || style === 2) && i === 0) {
      const hexRadius = armLength * 0.15;
      g.setStrokeStyle({ width: thinWidth, color: 0xffffff });
      g.moveTo(hexRadius, 0);
      for (let h = 1; h <= 6; h++) {
        const ha = (h / 6) * Math.PI * 2;
        g.lineTo(Math.cos(ha) * hexRadius, Math.sin(ha) * hexRadius);
      }
      g.stroke();
    }

    // === PRIMARY BRANCHES (fernlike) ===
    const numBranches = 3 + Math.floor(seededRandom() * 3);
    for (let b = 0; b < numBranches; b++) {
      const branchPos = 0.25 + (b / numBranches) * 0.65;
      const branchLength = armLength * (0.35 - b * 0.05) * (0.8 + seededRandom() * 0.4);
      const branchAngleOffset = Math.PI / 6 + seededRandom() * 0.1;

      const bx = cos * armLength * branchPos;
      const by = sin * armLength * branchPos;

      // Branch on both sides (symmetrical)
      for (const side of [-1, 1]) {
        const branchAngle = angle + side * branchAngleOffset;
        const bcos = Math.cos(branchAngle);
        const bsin = Math.sin(branchAngle);

        g.setStrokeStyle({ width: thinWidth, color: 0xffffff, cap: 'round' });
        g.moveTo(bx, by);
        g.lineTo(bx + bcos * branchLength, by + bsin * branchLength);
        g.stroke();

        // === SUB-BRANCHES (on larger branches) ===
        if (branchLength > armLength * 0.25 && style !== 1) {
          const numSub = 2;
          for (let s = 0; s < numSub; s++) {
            const subPos = 0.4 + s * 0.35;
            const subLength = branchLength * 0.4 * (0.7 + seededRandom() * 0.3);
            const subAngleOffset = Math.PI / 5;

            const sx = bx + bcos * branchLength * subPos;
            const sy = by + bsin * branchLength * subPos;

            const subAngle = branchAngle + side * subAngleOffset;

            g.setStrokeStyle({ width: tinyWidth, color: 0xffffff, cap: 'round' });
            g.moveTo(sx, sy);
            g.lineTo(
              sx + Math.cos(subAngle) * subLength,
              sy + Math.sin(subAngle) * subLength
            );
            g.stroke();

            // === TINY TERTIARY BRANCHES ===
            if (style === 0 || style === 3) {
              const tx = sx + Math.cos(subAngle) * subLength * 0.6;
              const ty = sy + Math.sin(subAngle) * subLength * 0.6;
              const tinyLength = subLength * 0.5;
              const tinyAngle = subAngle + side * Math.PI / 6;

              g.setStrokeStyle({ width: tinyWidth * 0.6, color: 0xffffff, cap: 'round', alpha: 0.8 });
              g.moveTo(tx, ty);
              g.lineTo(
                tx + Math.cos(tinyAngle) * tinyLength,
                ty + Math.sin(tinyAngle) * tinyLength
              );
              g.stroke();
            }
          }
        }
      }
    }

    // === TIP DETAIL ===
    const tipX = cos * armLength;
    const tipY = sin * armLength;

    if (style === 0 || style === 2) {
      // Forked tip
      const forkLength = armLength * 0.15;
      const forkAngle = Math.PI / 8;

      g.setStrokeStyle({ width: thinWidth, color: 0xffffff, cap: 'round' });
      g.moveTo(tipX, tipY);
      g.lineTo(
        tipX + Math.cos(angle - forkAngle) * forkLength,
        tipY + Math.sin(angle - forkAngle) * forkLength
      );
      g.stroke();

      g.moveTo(tipX, tipY);
      g.lineTo(
        tipX + Math.cos(angle + forkAngle) * forkLength,
        tipY + Math.sin(angle + forkAngle) * forkLength
      );
      g.stroke();
    }

    if (style === 1 || style === 3) {
      // Diamond tip
      const dSize = armLength * 0.08;
      g.setStrokeStyle({ width: tinyWidth, color: 0xffffff });
      g.moveTo(tipX + cos * dSize, tipY + sin * dSize);
      g.lineTo(tipX + Math.cos(angle + Math.PI/2) * dSize * 0.5, tipY + Math.sin(angle + Math.PI/2) * dSize * 0.5);
      g.lineTo(tipX - cos * dSize * 0.3, tipY - sin * dSize * 0.3);
      g.lineTo(tipX + Math.cos(angle - Math.PI/2) * dSize * 0.5, tipY + Math.sin(angle - Math.PI/2) * dSize * 0.5);
      g.closePath();
      g.stroke();
    }

    // === INNER PLATE DETAILS (between arms) ===
    if (style === 2 || style === 3) {
      const plateAngle = angle + Math.PI / 6; // Halfway to next arm
      const plateRadius = armLength * 0.3;
      const plateLength = armLength * 0.15;

      g.setStrokeStyle({ width: tinyWidth, color: 0xffffff, cap: 'round', alpha: 0.7 });
      g.moveTo(
        Math.cos(plateAngle) * plateRadius,
        Math.sin(plateAngle) * plateRadius
      );
      g.lineTo(
        Math.cos(plateAngle) * (plateRadius + plateLength),
        Math.sin(plateAngle) * (plateRadius + plateLength)
      );
      g.stroke();
    }
  }

  // === CENTER DETAIL ===
  // Inner circle
  g.setStrokeStyle({ width: tinyWidth, color: 0xffffff });
  g.circle(0, 0, armLength * 0.08);
  g.stroke();

  // Center dot
  g.circle(0, 0, size * 0.02);
  g.fill({ color: 0xffffff, alpha: 0.9 });

  return g;
}

// Create the hero layer with intricate flakes
export function createIntricateLayer(screenWidth, screenHeight) {
  const container = new Container();

  const count = 8; // Few but stunning
  const sizeRange = [80, 150];
  const speedRange = [20, 40]; // Slow, majestic fall
  const opacity = 0.85;

  const snowflakes = [];

  for (let i = 0; i < count; i++) {
    const size = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);
    const flake = createIntricateSnowflake(size, Math.random() * 1000);

    flake.x = Math.random() * screenWidth;
    flake.y = Math.random() * screenHeight;
    flake.alpha = opacity * (0.8 + Math.random() * 0.2);

    flake.userData = {
      speed: speedRange[0] + Math.random() * (speedRange[1] - speedRange[0]),
      wobbleFreq: 0.2 + Math.random() * 0.3, // Slow, gentle wobble
      wobbleAmp: 30 + Math.random() * 50,
      phase: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.15, // Very slow rotation
      baseX: flake.x,
      shimmerPhase: Math.random() * Math.PI * 2,
    };

    container.addChild(flake);
    snowflakes.push(flake);
  }

  function update(elapsed, width, height) {
    for (const flake of snowflakes) {
      const data = flake.userData;

      // Slow majestic fall
      flake.y += data.speed * 0.016;

      // Gentle wobble
      flake.x = data.baseX + Math.sin(elapsed * data.wobbleFreq + data.phase) * data.wobbleAmp;

      // Slow rotation
      flake.rotation += data.rotationSpeed * 0.016;

      // Subtle shimmer (alpha variation)
      flake.alpha = 0.75 + Math.sin(elapsed * 2 + data.shimmerPhase) * 0.1;

      // Reset when off screen
      if (flake.y > height + 100) {
        flake.y = -150;
        data.baseX = Math.random() * width;
        flake.x = data.baseX;
      }

      // Wrap horizontally
      if (flake.x < -100) {
        data.baseX += width + 200;
        flake.x = data.baseX;
      } else if (flake.x > width + 100) {
        data.baseX -= width + 200;
        flake.x = data.baseX;
      }
    }
  }

  return { container, update };
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
