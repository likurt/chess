import * as THREE from 'three';
import { ANIMATION } from '../utils/Constants.js';

export class AnimationManager {
  constructor() {
    this.activeAnimations = [];
    this.startAnimLoop();
  }

  startAnimLoop() {
    const animate = () => {
      requestAnimationFrame(animate);
      const now = performance.now();

      this.activeAnimations = this.activeAnimations.filter(anim => {
        const t = Math.min((now - anim.startTime) / anim.duration, 1);
        anim.update(t);
        if (t >= 1) {
          if (anim.onComplete) anim.onComplete();
          return false;
        }
        return true;
      });
    };
    animate();
  }

  // 기물 이동 애니메이션 (곡선 경로)
  animateMove(mesh, from, to, onComplete) {
    const startPos = from.clone();
    const endPos = to.clone();
    const duration = ANIMATION.MOVE_DURATION * 1000;
    const height = ANIMATION.MOVE_HEIGHT;

    return new Promise((resolve) => {
      const anim = {
        startTime: performance.now(),
        duration,
        update(t) {
          const eased = easeInOutCubic(t);

          // 수평 위치 보간
          mesh.position.x = startPos.x + (endPos.x - startPos.x) * eased;
          mesh.position.z = startPos.z + (endPos.z - startPos.z) * eased;

          // 수직: 포물선 경로
          const arch = Math.sin(t * Math.PI) * height;
          mesh.position.y = startPos.y + (endPos.y - startPos.y) * eased + arch;
        },
        onComplete() {
          mesh.position.copy(endPos);
          if (onComplete) onComplete();
          resolve();
        }
      };

      this.activeAnimations.push(anim);
    });
  }

  // 기물 제거 애니메이션 (아래로 사라짐)
  animateCapture(mesh, onComplete) {
    const startY = mesh.position.y;
    const duration = 200;

    return new Promise((resolve) => {
      const anim = {
        startTime: performance.now(),
        duration,
        update(t) {
          mesh.position.y = startY - t * 0.5;
          if (mesh.material) {
            mesh.material.opacity = 1 - t;
            mesh.material.transparent = true;
          }
          mesh.scale.setScalar(1 - t * 0.5);
        },
        onComplete() {
          if (onComplete) onComplete();
          resolve();
        }
      };
      this.activeAnimations.push(anim);
    });
  }

  // 기물 등장 애니메이션
  animateAppear(mesh) {
    const targetY = mesh.position.y;
    mesh.position.y = targetY + 1;
    mesh.scale.setScalar(0.01);
    const duration = 400;

    return new Promise((resolve) => {
      const anim = {
        startTime: performance.now(),
        duration,
        update(t) {
          const eased = easeOutBack(t);
          mesh.position.y = targetY + 1 * (1 - eased);
          mesh.scale.setScalar(eased);
        },
        onComplete() {
          mesh.position.y = targetY;
          mesh.scale.setScalar(1);
          resolve();
        }
      };
      this.activeAnimations.push(anim);
    });
  }

  // 흔들림 애니메이션 (잘못된 이동)
  animateShake(mesh) {
    const startX = mesh.position.x;
    const duration = 300;

    return new Promise((resolve) => {
      const anim = {
        startTime: performance.now(),
        duration,
        update(t) {
          const shake = Math.sin(t * Math.PI * 6) * 0.05 * (1 - t);
          mesh.position.x = startX + shake;
        },
        onComplete() {
          mesh.position.x = startX;
          resolve();
        }
      };
      this.activeAnimations.push(anim);
    });
  }

  isAnimating() {
    return this.activeAnimations.length > 0;
  }
}

// 이징 함수
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}
