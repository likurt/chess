import * as THREE from 'three';
import { COLORS, ANIMATION } from '../utils/Constants.js';

export class ParticleSystem {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.effectsGroup = new THREE.Group();
    this.activeEffects = [];

    sceneManager.add(this.effectsGroup);
    sceneManager.onUpdate((delta) => this.update(delta));
  }

  // 기물 파괴 이펙트 (깨지는 효과)
  explodePiece(position, geometry, color) {
    const isWhite = color === 'w';
    const baseColor = isWhite ? COLORS.PARTICLE_WHITE : COLORS.PARTICLE_BLACK;

    // 1. Geometry를 삼각형 조각으로 분할
    this.createFragments(position, geometry, baseColor);

    // 2. 작은 파티클 스파크
    this.createSparks(position, baseColor);

    // 3. 바닥 충격파
    this.createShockwave(position, baseColor);
  }

  createFragments(center, geometry, color) {
    const posAttr = geometry.attributes.position;
    const indexAttr = geometry.index;
    const fragmentCount = Math.min(ANIMATION.CAPTURE_PARTICLE_COUNT, Math.floor((indexAttr ? indexAttr.count : posAttr.count) / 3));

    const usedTriangles = new Set();

    for (let i = 0; i < fragmentCount; i++) {
      // 랜덤 삼각형 선택
      let triIdx;
      const maxTri = Math.floor((indexAttr ? indexAttr.count : posAttr.count) / 3);
      do {
        triIdx = Math.floor(Math.random() * maxTri);
      } while (usedTriangles.has(triIdx) && usedTriangles.size < maxTri);
      usedTriangles.add(triIdx);

      // 삼각형의 3개 정점
      const vertices = new Float32Array(9);
      for (let v = 0; v < 3; v++) {
        const idx = indexAttr ? indexAttr.getX(triIdx * 3 + v) : triIdx * 3 + v;
        vertices[v * 3] = posAttr.getX(idx);
        vertices[v * 3 + 1] = posAttr.getY(idx);
        vertices[v * 3 + 2] = posAttr.getZ(idx);
      }

      const fragGeo = new THREE.BufferGeometry();
      fragGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      fragGeo.computeVertexNormals();

      // 약간의 색상 변화
      const colorVariation = new THREE.Color(color);
      colorVariation.offsetHSL(
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.15
      );

      const fragMat = new THREE.MeshStandardMaterial({
        color: colorVariation,
        roughness: 0.3,
        metalness: 0.6,
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide,
      });

      const fragMesh = new THREE.Mesh(fragGeo, fragMat);
      fragMesh.position.copy(center);

      // 물리 속성
      const direction = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        Math.random() * 2 + 1,
        (Math.random() - 0.5) * 2
      ).normalize();

      const speed = 1.5 + Math.random() * 2.5;

      const fragment = {
        mesh: fragMesh,
        velocity: direction.multiplyScalar(speed),
        rotationSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        ),
        life: ANIMATION.CAPTURE_DURATION + Math.random() * 0.3,
        maxLife: ANIMATION.CAPTURE_DURATION + Math.random() * 0.3,
        gravity: -9.8,
        scale: 0.8 + Math.random() * 0.6,
      };

      fragMesh.scale.setScalar(fragment.scale);
      this.effectsGroup.add(fragMesh);
      this.activeEffects.push(fragment);
    }
  }

  createSparks(center, color) {
    const sparkCount = ANIMATION.CAPTURE_SPARK_COUNT;
    const positions = new Float32Array(sparkCount * 3);
    const colors = new Float32Array(sparkCount * 3);
    const sizes = new Float32Array(sparkCount);

    const sparkColor = new THREE.Color(COLORS.PARTICLE_SPARK);
    const baseColorObj = new THREE.Color(color);
    const glowColor = new THREE.Color(COLORS.PARTICLE_GLOW);

    const velocities = [];

    for (let i = 0; i < sparkCount; i++) {
      positions[i * 3] = center.x;
      positions[i * 3 + 1] = center.y + 0.3;
      positions[i * 3 + 2] = center.z;

      // 색상 믹스 (기물 색 + 스파크 + 글로우)
      const mixColor = new THREE.Color();
      const r = Math.random();
      if (r < 0.3) mixColor.copy(sparkColor);
      else if (r < 0.6) mixColor.copy(glowColor);
      else mixColor.copy(baseColorObj);

      colors[i * 3] = mixColor.r;
      colors[i * 3 + 1] = mixColor.g;
      colors[i * 3 + 2] = mixColor.b;

      sizes[i] = 0.02 + Math.random() * 0.06;

      velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 4,
        Math.random() * 4 + 1,
        (Math.random() - 0.5) * 4
      ));
    }

    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    sparkGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    sparkGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const sparkMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const sparkPoints = new THREE.Points(sparkGeo, sparkMat);
    this.effectsGroup.add(sparkPoints);

    const spark = {
      mesh: sparkPoints,
      velocities,
      positions: sparkGeo.attributes.position,
      life: ANIMATION.CAPTURE_DURATION,
      maxLife: ANIMATION.CAPTURE_DURATION,
      isSpark: true,
      gravity: -6,
    };

    this.activeEffects.push(spark);
  }

  createShockwave(center, color) {
    const geo = new THREE.RingGeometry(0.01, 0.05, 32);
    const mat = new THREE.MeshBasicMaterial({
      color: COLORS.PARTICLE_GLOW,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const ring = new THREE.Mesh(geo, mat);
    ring.position.set(center.x, 0.07, center.z);
    ring.rotation.x = -Math.PI / 2;

    this.effectsGroup.add(ring);

    const shockwave = {
      mesh: ring,
      life: 0.5,
      maxLife: 0.5,
      isShockwave: true,
      maxRadius: 1.5,
    };

    this.activeEffects.push(shockwave);
  }

  update(delta) {
    this.activeEffects = this.activeEffects.filter(effect => {
      effect.life -= delta;
      const t = 1 - (effect.life / effect.maxLife);

      if (effect.life <= 0) {
        this.removeEffect(effect);
        return false;
      }

      if (effect.isShockwave) {
        // 충격파 확장
        const radius = effect.maxRadius * easeOutQuad(t);
        const innerRadius = radius * 0.8;
        effect.mesh.scale.setScalar(radius / 0.05);
        effect.mesh.material.opacity = 0.8 * (1 - t);
        return true;
      }

      if (effect.isSpark) {
        // 스파크 파티클 업데이트
        const posArr = effect.positions.array;
        for (let i = 0; i < effect.velocities.length; i++) {
          const vel = effect.velocities[i];
          vel.y += effect.gravity * delta;
          posArr[i * 3] += vel.x * delta;
          posArr[i * 3 + 1] += vel.y * delta;
          posArr[i * 3 + 2] += vel.z * delta;
        }
        effect.positions.needsUpdate = true;
        effect.mesh.material.opacity = 1 - easeInQuad(t);
        return true;
      }

      // 조각 파티클 업데이트
      effect.velocity.y += effect.gravity * delta;
      effect.mesh.position.x += effect.velocity.x * delta;
      effect.mesh.position.y += effect.velocity.y * delta;
      effect.mesh.position.z += effect.velocity.z * delta;

      // 바닥 바운스
      if (effect.mesh.position.y < 0.05) {
        effect.mesh.position.y = 0.05;
        effect.velocity.y *= -0.3;
        effect.velocity.x *= 0.7;
        effect.velocity.z *= 0.7;
      }

      // 회전
      effect.mesh.rotation.x += effect.rotationSpeed.x * delta;
      effect.mesh.rotation.y += effect.rotationSpeed.y * delta;
      effect.mesh.rotation.z += effect.rotationSpeed.z * delta;

      // 페이드아웃 + 축소
      const fadeStart = 0.5;
      if (t > fadeStart) {
        const fadeT = (t - fadeStart) / (1 - fadeStart);
        effect.mesh.material.opacity = 1 - easeInQuad(fadeT);
        effect.mesh.scale.setScalar(effect.scale * (1 - fadeT * 0.7));
      }

      return true;
    });
  }

  removeEffect(effect) {
    this.effectsGroup.remove(effect.mesh);
    if (effect.mesh.geometry) effect.mesh.geometry.dispose();
    if (effect.mesh.material) effect.mesh.material.dispose();
  }

  clearAll() {
    this.activeEffects.forEach(effect => this.removeEffect(effect));
    this.activeEffects = [];
  }
}

function easeOutQuad(t) {
  return t * (2 - t);
}

function easeInQuad(t) {
  return t * t;
}
