import * as THREE from 'three';
import { BOARD_SIZE, SQUARE_SIZE, BOARD_OFFSET, COLORS, FILES, RANKS } from '../utils/Constants.js';

export class BoardRenderer {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.boardGroup = new THREE.Group();
    this.squareMeshes = new Map();
    this.sceneManager.add(this.boardGroup);
  }

  render() {
    this.clearBoard();
    this.createBoard();
    this.createFrame();
    this.createLabels();
    this.createGround();
  }

  createBoard() {
    const squareGeo = new THREE.BoxGeometry(SQUARE_SIZE, 0.1, SQUARE_SIZE);

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const isLight = (row + col) % 2 === 0;
        const color = isLight ? COLORS.LIGHT_SQUARE : COLORS.DARK_SQUARE;

        const material = new THREE.MeshStandardMaterial({
          color,
          roughness: 0.7,
          metalness: 0.05,
        });

        const mesh = new THREE.Mesh(squareGeo, material);
        mesh.position.set(
          col * SQUARE_SIZE - BOARD_OFFSET,
          0,
          (BOARD_SIZE - 1 - row) * SQUARE_SIZE - BOARD_OFFSET
        );
        mesh.receiveShadow = true;

        // 체스 좌표 저장
        const file = FILES[col];
        const rank = RANKS[row];
        const square = file + rank;
        mesh.userData = { square, row, col };

        this.squareMeshes.set(square, mesh);
        this.boardGroup.add(mesh);
      }
    }
  }

  createFrame() {
    const borderWidth = 0.6;
    const innerSize = BOARD_SIZE * SQUARE_SIZE + 0.1;
    const outerSize = innerSize + borderWidth * 2;
    const frameHeight = 0.15;

    const frameMaterial = new THREE.MeshStandardMaterial({
      color: COLORS.BOARD_FRAME,
      roughness: 0.5,
      metalness: 0.1,
    });

    const createFramePiece = (width, depth, x, z) => {
      const geo = new THREE.BoxGeometry(width, frameHeight, depth);
      const mesh = new THREE.Mesh(geo, frameMaterial);
      mesh.position.set(x, -frameHeight / 2, z);
      mesh.receiveShadow = true;
      this.boardGroup.add(mesh);
    };

    // 상하 (전체 폭)
    const edgeOffset = innerSize / 2 + borderWidth / 2;
    createFramePiece(outerSize, borderWidth, 0, -edgeOffset);
    createFramePiece(outerSize, borderWidth, 0, edgeOffset);
    // 좌우 (안쪽 높이만)
    createFramePiece(borderWidth, innerSize, -edgeOffset, 0);
    createFramePiece(borderWidth, innerSize, edgeOffset, 0);
  }

  createLabels() {
    // 보드 칸 모서리에 직접 레이블을 표시 (패널에 가려지지 않도록)
    const createCornerLabel = (text, x, z, alignX, alignZ) => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');

      ctx.clearRect(0, 0, 64, 64);
      ctx.fillStyle = '#d4c4a0';
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = alignX === 'left' ? 'left' : alignX === 'right' ? 'right' : 'center';
      ctx.textBaseline = alignZ === 'top' ? 'top' : alignZ === 'bottom' ? 'bottom' : 'middle';
      const tx = alignX === 'left' ? 4 : alignX === 'right' ? 60 : 32;
      const ty = alignZ === 'top' ? 4 : alignZ === 'bottom' ? 60 : 32;
      ctx.fillText(text, tx, ty);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;

      const geo = new THREE.PlaneGeometry(0.3, 0.3);
      const mat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(x, 0.06, z);
      this.boardGroup.add(mesh);
    };

    // 파일 레이블 (a-h) - 1랭크(앞쪽) 칸 하단 모서리에 표시
    const frontRowZ = (BOARD_SIZE - 1) * SQUARE_SIZE - BOARD_OFFSET; // rank 1 z position
    for (let i = 0; i < BOARD_SIZE; i++) {
      const x = i * SQUARE_SIZE - BOARD_OFFSET;
      createCornerLabel(FILES[i], x + 0.2, frontRowZ + 0.2, 'right', 'bottom');
    }

    // 랭크 레이블 (1-8) - a파일(왼쪽) 칸 왼쪽 모서리에 표시
    const leftColX = -BOARD_OFFSET; // a file x position
    for (let i = 0; i < BOARD_SIZE; i++) {
      const z = (BOARD_SIZE - 1 - i) * SQUARE_SIZE - BOARD_OFFSET;
      createCornerLabel(RANKS[i], leftColX - 0.2, z - 0.2, 'left', 'top');
    }
  }

  createGround() {
    const groundGeo = new THREE.PlaneGeometry(30, 30);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a1a,
      roughness: 0.9,
      metalness: 0.0,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.08;
    ground.receiveShadow = true;
    this.boardGroup.add(ground);
  }

  getSquareMesh(square) {
    return this.squareMeshes.get(square);
  }

  getSquarePosition(square) {
    const col = FILES.indexOf(square[0]);
    const row = RANKS.indexOf(square[1]);
    return new THREE.Vector3(
      col * SQUARE_SIZE - BOARD_OFFSET,
      0.05,
      (BOARD_SIZE - 1 - row) * SQUARE_SIZE - BOARD_OFFSET
    );
  }

  getSquareFromPosition(position) {
    const col = Math.round((position.x + BOARD_OFFSET) / SQUARE_SIZE);
    const row = BOARD_SIZE - 1 - Math.round((position.z + BOARD_OFFSET) / SQUARE_SIZE);
    if (col < 0 || col >= BOARD_SIZE || row < 0 || row >= BOARD_SIZE) return null;
    return FILES[col] + RANKS[row];
  }

  clearBoard() {
    while (this.boardGroup.children.length > 0) {
      const child = this.boardGroup.children[0];
      this.boardGroup.remove(child);
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    }
    this.squareMeshes.clear();
  }
}
