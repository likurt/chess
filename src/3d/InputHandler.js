import * as THREE from 'three';
import { eventBus } from '../utils/EventBus.js';
import { EVENTS } from '../utils/Constants.js';

export class InputHandler {
  constructor(sceneManager, pieceFactory) {
    this.sceneManager = sceneManager;
    this.pieceFactory = pieceFactory;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.enabled = true;
    this.selectedSquare = null;
    this.validMoves = [];
    this.onMoveCallback = null;

    this.bindEvents();
  }

  bindEvents() {
    const canvas = this.sceneManager.canvas;
    canvas.addEventListener('click', (e) => this.onClick(e));
    canvas.addEventListener('touchend', (e) => this.onTouch(e));
  }

  onClick(event) {
    if (!this.enabled) return;

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.processInput();
  }

  onTouch(event) {
    if (!this.enabled) return;
    if (event.changedTouches.length === 0) return;

    const touch = event.changedTouches[0];
    this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;

    this.processInput();
  }

  processInput() {
    this.raycaster.setFromCamera(this.mouse, this.sceneManager.camera);

    // 기물 또는 보드 칸 감지
    const allObjects = [
      ...this.pieceFactory.getAllPieceMeshes(),
      ...this.getSquareMeshes()
    ];

    const intersects = this.raycaster.intersectObjects(allObjects, true);
    if (intersects.length === 0) {
      this.deselect();
      return;
    }

    // 교차된 오브젝트에서 square 정보 추출
    let clickedSquare = null;
    let clickedObj = intersects[0].object;

    // 부모를 타고 올라가며 userData 확인
    while (clickedObj) {
      if (clickedObj.userData?.square) {
        clickedSquare = clickedObj.userData.square;
        break;
      }
      if (clickedObj.userData?.isPiece) {
        clickedSquare = clickedObj.userData.square;
        break;
      }
      clickedObj = clickedObj.parent;
    }

    if (!clickedSquare) {
      this.deselect();
      return;
    }

    this.handleSquareClick(clickedSquare);
  }

  handleSquareClick(square) {
    // 이미 기물이 선택된 상태
    if (this.selectedSquare) {
      // 같은 칸 클릭 -> 선택 해제
      if (square === this.selectedSquare) {
        this.deselect();
        return;
      }

      // 유효한 이동 목적지인지 확인
      const isValidTarget = this.validMoves.some(m => m.to === square);
      if (isValidTarget) {
        // 이동 실행
        if (this.onMoveCallback) {
          this.onMoveCallback(this.selectedSquare, square);
        }
        this.deselect();
        return;
      }

      // 같은 색 기물 클릭 -> 선택 전환
      const piece = this.pieceFactory.getPieceMesh(square);
      if (piece && piece.userData.color === this.pieceFactory.getPieceMesh(this.selectedSquare)?.userData?.color) {
        this.deselect();
        this.select(square);
        return;
      }

      // 그 외 -> 선택 해제
      this.deselect();
      return;
    }

    // 기물 선택
    const pieceMesh = this.pieceFactory.getPieceMesh(square);
    if (pieceMesh) {
      this.select(square);
    }
  }

  select(square) {
    this.selectedSquare = square;
    eventBus.emit(EVENTS.PIECE_SELECT, { square, validMoves: this.validMoves });
  }

  deselect() {
    if (this.selectedSquare) {
      this.selectedSquare = null;
      this.validMoves = [];
      eventBus.emit(EVENTS.PIECE_DESELECT, {});
    }
  }

  setValidMoves(moves) {
    this.validMoves = moves;
  }

  setOnMove(callback) {
    this.onMoveCallback = callback;
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    if (!enabled) {
      this.deselect();
    }
  }

  getSquareMeshes() {
    // BoardRenderer의 squareMeshes에 접근
    const meshes = [];
    this.sceneManager.scene.traverse((child) => {
      if (child.userData?.square && !child.userData?.isPiece) {
        meshes.push(child);
      }
    });
    return meshes;
  }
}
