import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CAMERA } from '../utils/Constants.js';

export class CameraController {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.camera = sceneManager.camera;
    this.initControls();
  }

  initControls() {
    this.controls = new OrbitControls(this.camera, this.sceneManager.renderer.domElement);

    this.controls.enableDamping = true;
    this.controls.dampingFactor = CAMERA.DAMPING_FACTOR;
    this.controls.enablePan = false;

    this.controls.minDistance = CAMERA.MIN_DISTANCE;
    this.controls.maxDistance = CAMERA.MAX_DISTANCE;
    this.controls.minPolarAngle = CAMERA.MIN_POLAR_ANGLE;
    this.controls.maxPolarAngle = CAMERA.MAX_POLAR_ANGLE;

    this.controls.target.set(0, 0, 0);

    // 렌더링 루프에 업데이트 추가
    this.sceneManager.onUpdate(() => {
      this.controls.update();
    });
  }

  // 백색 시점 (기본)
  setWhiteView(animate = true) {
    this.animateTo(
      { x: 0, y: CAMERA.INITIAL_POSITION.y, z: CAMERA.INITIAL_POSITION.z },
      { x: 0, y: 0, z: 0 },
      animate
    );
  }

  // 흑색 시점
  setBlackView(animate = true) {
    this.animateTo(
      { x: 0, y: CAMERA.INITIAL_POSITION.y, z: -CAMERA.INITIAL_POSITION.z },
      { x: 0, y: 0, z: 0 },
      animate
    );
  }

  // 탑뷰
  setTopView(animate = true) {
    this.animateTo(
      { x: 0, y: 12, z: 0.1 },
      { x: 0, y: 0, z: 0 },
      animate
    );
  }

  animateTo(position, target, animate = true) {
    if (!animate) {
      this.camera.position.set(position.x, position.y, position.z);
      this.controls.target.set(target.x, target.y, target.z);
      this.controls.update();
      return;
    }

    const startPos = { ...this.camera.position };
    const startTarget = { ...this.controls.target };
    const duration = 800;
    const startTime = performance.now();

    const animateStep = () => {
      const elapsed = performance.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic

      this.camera.position.set(
        startPos.x + (position.x - startPos.x) * eased,
        startPos.y + (position.y - startPos.y) * eased,
        startPos.z + (position.z - startPos.z) * eased
      );

      this.controls.target.set(
        startTarget.x + (target.x - startTarget.x) * eased,
        startTarget.y + (target.y - startTarget.y) * eased,
        startTarget.z + (target.z - startTarget.z) * eased
      );

      this.controls.update();

      if (t < 1) {
        requestAnimationFrame(animateStep);
      }
    };

    animateStep();
  }

  setEnabled(enabled) {
    this.controls.enabled = enabled;
  }
}
