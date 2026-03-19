import * as THREE from 'three';
import { COLORS, SQUARE_SIZE } from '../utils/Constants.js';
import { eventBus } from '../utils/EventBus.js';
import { EVENTS } from '../utils/Constants.js';

export class HighlightManager {
  constructor(sceneManager, boardRenderer) {
    this.sceneManager = sceneManager;
    this.boardRenderer = boardRenderer;
    this.highlightGroup = new THREE.Group();
    this.highlights = new Map();
    this.lastMoveHighlights = [];

    sceneManager.add(this.highlightGroup);

    this.bindEvents();
  }

  bindEvents() {
    eventBus.on(EVENTS.PIECE_DESELECT, () => {
      this.clearSelection();
    });
  }

  // 선택된 칸 표시
  showSelected(square) {
    this.clearSelection();
    this.addHighlight(square, COLORS.SELECTED, 0.4, 'selected');
  }

  // 유효 이동 칸 표시
  showValidMoves(moves) {
    moves.forEach(move => {
      if (move.captured) {
        // 잡기 가능 - 빨간 링
        this.addCaptureHighlight(move.to);
      } else {
        // 이동 가능 - 초록 점
        this.addMoveHighlight(move.to);
      }
    });
  }

  // 마지막 이동 표시
  showLastMove(from, to) {
    this.clearLastMove();
    const h1 = this.addHighlight(from, COLORS.LAST_MOVE, 0.25, 'lastMove');
    const h2 = this.addHighlight(to, COLORS.LAST_MOVE, 0.25, 'lastMove');
    this.lastMoveHighlights = [h1, h2];
  }

  // 체크 하이라이트
  showCheck(kingSquare) {
    this.addHighlight(kingSquare, COLORS.CHECK_HIGHLIGHT, 0.5, 'check');
  }

  // 힌트 하이라이트
  showHint(square) {
    this.addHighlight(square, COLORS.HINT_HIGHLIGHT, 0.5, 'hint');
  }

  addHighlight(square, color, opacity, category) {
    const pos = this.boardRenderer.getSquarePosition(square);
    if (!pos) return null;

    const geo = new THREE.PlaneGeometry(SQUARE_SIZE * 0.95, SQUARE_SIZE * 0.95);
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(pos.x, 0.06, pos.z);
    mesh.rotation.x = -Math.PI / 2;
    mesh.userData = { category, square };

    this.highlightGroup.add(mesh);

    if (!this.highlights.has(category)) {
      this.highlights.set(category, []);
    }
    this.highlights.get(category).push(mesh);

    return mesh;
  }

  addMoveHighlight(square) {
    const pos = this.boardRenderer.getSquarePosition(square);
    if (!pos) return;

    const geo = new THREE.CircleGeometry(SQUARE_SIZE * 0.15, 16);
    const mat = new THREE.MeshBasicMaterial({
      color: COLORS.VALID_MOVE,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(pos.x, 0.06, pos.z);
    mesh.rotation.x = -Math.PI / 2;
    mesh.userData = { category: 'validMove', square };

    this.highlightGroup.add(mesh);

    if (!this.highlights.has('validMove')) {
      this.highlights.set('validMove', []);
    }
    this.highlights.get('validMove').push(mesh);
  }

  addCaptureHighlight(square) {
    const pos = this.boardRenderer.getSquarePosition(square);
    if (!pos) return;

    const geo = new THREE.RingGeometry(SQUARE_SIZE * 0.35, SQUARE_SIZE * 0.45, 24);
    const mat = new THREE.MeshBasicMaterial({
      color: COLORS.CAPTURE_MOVE,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(pos.x, 0.06, pos.z);
    mesh.rotation.x = -Math.PI / 2;
    mesh.userData = { category: 'captureMove', square };

    this.highlightGroup.add(mesh);

    if (!this.highlights.has('captureMove')) {
      this.highlights.set('captureMove', []);
    }
    this.highlights.get('captureMove').push(mesh);
  }

  clearCategory(category) {
    const meshes = this.highlights.get(category);
    if (meshes) {
      meshes.forEach(m => {
        this.highlightGroup.remove(m);
        m.geometry.dispose();
        m.material.dispose();
      });
      this.highlights.delete(category);
    }
  }

  clearSelection() {
    this.clearCategory('selected');
    this.clearCategory('validMove');
    this.clearCategory('captureMove');
    this.clearCategory('check');
    this.clearCategory('hint');
  }

  clearLastMove() {
    this.clearCategory('lastMove');
    this.lastMoveHighlights = [];
  }

  clearAll() {
    this.highlights.forEach((meshes, category) => {
      meshes.forEach(m => {
        this.highlightGroup.remove(m);
        m.geometry.dispose();
        m.material.dispose();
      });
    });
    this.highlights.clear();
    this.lastMoveHighlights = [];
  }
}
