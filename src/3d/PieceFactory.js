import * as THREE from 'three';
import { PieceModels } from './PieceModels.js';
import { COLORS, BOARD_SIZE, SQUARE_SIZE, BOARD_OFFSET, FILES, RANKS } from '../utils/Constants.js';

export class PieceFactory {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.piecesGroup = new THREE.Group();
    this.pieces = new Map(); // square -> mesh
    this.geometryCache = new Map(); // type -> geometry

    sceneManager.add(this.piecesGroup);
  }

  getGeometry(type) {
    if (!this.geometryCache.has(type)) {
      this.geometryCache.set(type, PieceModels.getGeometry(type));
    }
    return this.geometryCache.get(type);
  }

  createPieceMesh(type, color) {
    const geometry = this.getGeometry(type);
    const isWhite = color === 'w';

    const material = new THREE.MeshStandardMaterial({
      color: isWhite ? COLORS.WHITE_PIECE : COLORS.BLACK_PIECE,
      roughness: isWhite ? 0.3 : 0.25,
      metalness: isWhite ? 0.6 : 0.7,
      emissive: isWhite ? 0x404850 : 0x8B6914,
      emissiveIntensity: 0.15,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
  }

  squareToPosition(square) {
    const col = FILES.indexOf(square[0]);
    const row = RANKS.indexOf(square[1]);
    return new THREE.Vector3(
      col * SQUARE_SIZE - BOARD_OFFSET,
      0.05,
      (BOARD_SIZE - 1 - row) * SQUARE_SIZE - BOARD_OFFSET
    );
  }

  placeAllPieces(board) {
    this.clearAllPieces();

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const piece = board[row][col];
        if (piece) {
          const square = FILES[col] + RANKS[BOARD_SIZE - 1 - row];
          this.placePiece(piece.type, piece.color, square);
        }
      }
    }
  }

  placePiece(type, color, square) {
    const mesh = this.createPieceMesh(type, color);
    const pos = this.squareToPosition(square);
    mesh.position.copy(pos);

    mesh.userData = { type, color, square, isPiece: true };
    this.pieces.set(square, mesh);
    this.piecesGroup.add(mesh);

    return mesh;
  }

  removePiece(square) {
    const mesh = this.pieces.get(square);
    if (mesh) {
      this.piecesGroup.remove(mesh);
      mesh.material.dispose();
      this.pieces.delete(square);
      return mesh;
    }
    return null;
  }

  movePiece(from, to) {
    const mesh = this.pieces.get(from);
    if (!mesh) return null;

    // 대상 위치에 기물이 있으면 제거
    this.removePiece(to);

    // 위치 업데이트
    const pos = this.squareToPosition(to);
    mesh.position.copy(pos);
    mesh.userData.square = to;

    this.pieces.delete(from);
    this.pieces.set(to, mesh);

    return mesh;
  }

  getPieceMesh(square) {
    return this.pieces.get(square);
  }

  getAllPieceMeshes() {
    return Array.from(this.pieces.values());
  }

  clearAllPieces() {
    this.pieces.forEach((mesh) => {
      this.piecesGroup.remove(mesh);
      mesh.material.dispose();
    });
    this.pieces.clear();
  }

  // 프로모션: 기물 교체
  promotePiece(square, newType, color) {
    this.removePiece(square);
    return this.placePiece(newType, color, square);
  }

  // 기물 메시의 geometry를 반환 (파티클 파괴용)
  getPieceGeometry(square) {
    const mesh = this.pieces.get(square);
    if (mesh) {
      return mesh.geometry;
    }
    return null;
  }

  // 기물 메시의 원래 geometry (캐시에서)를 반환
  getOriginalGeometry(type) {
    return this.getGeometry(type);
  }
}
