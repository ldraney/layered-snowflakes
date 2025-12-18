import * as THREE from 'three';

export function createRoom() {
  const group = new THREE.Group();

  // Materials
  const woodMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b5a2b,
    roughness: 0.8,
    metalness: 0.1
  });

  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0x2d3436,
    roughness: 0.9,
    metalness: 0
  });

  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a3728,
    roughness: 0.7,
    metalness: 0
  });

  const windowGlassMaterial = new THREE.MeshStandardMaterial({
    color: 0x88ccff,
    roughness: 0.05,
    metalness: 0.1,
    transparent: true,
    opacity: 0.15
  });

  const windowFrameMaterial = new THREE.MeshStandardMaterial({
    color: 0x5d4e37,
    roughness: 0.6,
    metalness: 0.1
  });

  // Floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    floorMaterial
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  floor.receiveShadow = true;
  group.add(floor);

  // Back wall
  const backWall = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 6),
    wallMaterial
  );
  backWall.position.set(0, 3, -3);
  backWall.receiveShadow = true;
  group.add(backWall);

  // Side walls
  const leftWall = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 6),
    wallMaterial
  );
  leftWall.position.set(-5, 3, 0);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.receiveShadow = true;
  group.add(leftWall);

  const rightWall = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 6),
    wallMaterial
  );
  rightWall.position.set(5, 3, 0);
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.receiveShadow = true;
  group.add(rightWall);

  // Window frame
  const windowWidth = 3;
  const windowHeight = 2.5;
  const frameThickness = 0.15;
  const frameDepth = 0.2;

  // Window background (night sky) - pushed back so snow is visible
  const windowBg = new THREE.Mesh(
    new THREE.PlaneGeometry(windowWidth * 2, windowHeight * 2),
    new THREE.MeshBasicMaterial({ color: 0x0a0a1a })
  );
  windowBg.position.set(0, 2.2, -6);
  group.add(windowBg);

  // Window glass
  const windowGlass = new THREE.Mesh(
    new THREE.PlaneGeometry(windowWidth - 0.1, windowHeight - 0.1),
    windowGlassMaterial
  );
  windowGlass.position.set(0, 2.2, -2.85);
  group.add(windowGlass);

  // Frame pieces
  const createFramePiece = (width, height, x, y) => {
    const piece = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, frameDepth),
      windowFrameMaterial
    );
    piece.position.set(x, y, -2.9);
    piece.castShadow = true;
    piece.receiveShadow = true;
    return piece;
  };

  // Top frame
  group.add(createFramePiece(windowWidth + frameThickness * 2, frameThickness, 0, 2.2 + windowHeight / 2 + frameThickness / 2));
  // Bottom frame
  group.add(createFramePiece(windowWidth + frameThickness * 2, frameThickness, 0, 2.2 - windowHeight / 2 - frameThickness / 2));
  // Left frame
  group.add(createFramePiece(frameThickness, windowHeight, -windowWidth / 2 - frameThickness / 2, 2.2));
  // Right frame
  group.add(createFramePiece(frameThickness, windowHeight, windowWidth / 2 + frameThickness / 2, 2.2));
  // Center vertical
  group.add(createFramePiece(frameThickness * 0.7, windowHeight, 0, 2.2));
  // Center horizontal
  group.add(createFramePiece(windowWidth, frameThickness * 0.7, 0, 2.2));

  // Window sill
  const sill = new THREE.Mesh(
    new THREE.BoxGeometry(windowWidth + 0.6, 0.1, 0.4),
    woodMaterial
  );
  sill.position.set(0, 2.2 - windowHeight / 2 - 0.05, -2.7);
  sill.castShadow = true;
  sill.receiveShadow = true;
  group.add(sill);

  // Desk
  const deskTop = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.08, 1),
    woodMaterial
  );
  deskTop.position.set(-1.5, 0.75, -1.5);
  deskTop.castShadow = true;
  deskTop.receiveShadow = true;
  group.add(deskTop);

  // Desk legs
  const legGeometry = new THREE.BoxGeometry(0.08, 0.75, 0.08);
  const legPositions = [
    [-2.6, 0.375, -1.9],
    [-0.4, 0.375, -1.9],
    [-2.6, 0.375, -1.1],
    [-0.4, 0.375, -1.1]
  ];
  legPositions.forEach(pos => {
    const leg = new THREE.Mesh(legGeometry, woodMaterial);
    leg.position.set(...pos);
    leg.castShadow = true;
    leg.receiveShadow = true;
    group.add(leg);
  });

  // Lamp on desk
  const lampBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.12, 0.05, 16),
    new THREE.MeshStandardMaterial({ color: 0x2d3436, roughness: 0.3, metalness: 0.7 })
  );
  lampBase.position.set(-1.5, 0.82, -1.7);
  group.add(lampBase);

  const lampArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8),
    new THREE.MeshStandardMaterial({ color: 0x2d3436, roughness: 0.3, metalness: 0.7 })
  );
  lampArm.position.set(-1.5, 1.12, -1.7);
  group.add(lampArm);

  const lampShade = new THREE.Mesh(
    new THREE.ConeGeometry(0.15, 0.2, 16, 1, true),
    new THREE.MeshStandardMaterial({
      color: 0xffeaa7,
      roughness: 0.9,
      metalness: 0,
      side: THREE.DoubleSide,
      emissive: 0xffd89b,
      emissiveIntensity: 0.3
    })
  );
  lampShade.position.set(-1.5, 1.4, -1.7);
  lampShade.rotation.x = Math.PI;
  group.add(lampShade);

  // Books on desk
  const bookColors = [0x8e44ad, 0x2980b9, 0xc0392b, 0x27ae60];
  bookColors.forEach((color, i) => {
    const book = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.25, 0.04 + Math.random() * 0.02),
      new THREE.MeshStandardMaterial({ color, roughness: 0.8 })
    );
    book.position.set(-2.3 + i * 0.18, 0.92, -1.6);
    book.rotation.z = (Math.random() - 0.5) * 0.1;
    book.castShadow = true;
    group.add(book);
  });

  // Coffee mug
  const mugBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.045, 0.12, 16),
    new THREE.MeshStandardMaterial({ color: 0xecf0f1, roughness: 0.4 })
  );
  mugBody.position.set(-0.8, 0.85, -1.4);
  group.add(mugBody);

  // Cozy rug
  const rug = new THREE.Mesh(
    new THREE.PlaneGeometry(2.5, 1.8),
    new THREE.MeshStandardMaterial({
      color: 0x6c5ce7,
      roughness: 1,
      metalness: 0
    })
  );
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(0.5, 0.01, 1.5);
  group.add(rug);

  // Couch
  const couchMaterial = new THREE.MeshStandardMaterial({
    color: 0x636e72,
    roughness: 0.9,
    metalness: 0
  });

  // Couch base
  const couchBase = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.4, 0.8),
    couchMaterial
  );
  couchBase.position.set(1.5, 0.25, 1);
  couchBase.castShadow = true;
  couchBase.receiveShadow = true;
  group.add(couchBase);

  // Couch back
  const couchBack = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.6, 0.2),
    couchMaterial
  );
  couchBack.position.set(1.5, 0.65, 0.65);
  couchBack.castShadow = true;
  group.add(couchBack);

  // Couch cushions
  const cushionMaterial = new THREE.MeshStandardMaterial({
    color: 0x74b9ff,
    roughness: 0.95
  });
  [-0.5, 0.5].forEach(offset => {
    const cushion = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.35, 0.1),
      cushionMaterial
    );
    cushion.position.set(1.5 + offset, 0.55, 0.7);
    cushion.rotation.x = -0.2;
    group.add(cushion);
  });

  // Plant in corner
  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.12, 0.25, 16),
    new THREE.MeshStandardMaterial({ color: 0xd35400, roughness: 0.7 })
  );
  pot.position.set(3, 0.125, -2);
  group.add(pot);

  // Plant leaves (simple spheres for now)
  const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x27ae60, roughness: 0.8 });
  [0, 0.1, -0.1, 0.05].forEach((offset, i) => {
    const leaf = new THREE.Mesh(
      new THREE.SphereGeometry(0.12 + i * 0.02, 8, 8),
      leafMaterial
    );
    leaf.position.set(3 + offset, 0.35 + i * 0.08, -2 + (i % 2) * 0.05);
    leaf.scale.y = 1.3;
    group.add(leaf);
  });

  return group;
}
