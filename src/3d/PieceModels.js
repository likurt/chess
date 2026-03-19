import * as THREE from 'three';

// LatheGeometry를 위한 프로파일 포인트 생성 유틸
function createLathePoints(profile) {
  return profile.map(([x, y]) => new THREE.Vector2(x, y));
}

// 기물 공통 베이스 (원형 받침대)
function createBase(radius = 0.3, height = 0.08) {
  return new THREE.CylinderGeometry(radius, radius + 0.03, height, 24);
}

// 모든 기물의 Geometry를 반환하는 팩토리
export class PieceModels {

  static createKing() {
    const group = new THREE.Group();

    // 베이스
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.33, 0.1, 24));
    base.position.y = 0.05;
    group.add(base);

    // 기둥 하단
    const lowerBody = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.15, 20));
    lowerBody.position.y = 0.175;
    group.add(lowerBody);

    // 몸체 (LatheGeometry)
    const bodyProfile = createLathePoints([
      [0, 0], [0.22, 0], [0.2, 0.05], [0.14, 0.15],
      [0.12, 0.3], [0.14, 0.4], [0.17, 0.45],
      [0.15, 0.5], [0.1, 0.55], [0, 0.55]
    ]);
    const body = new THREE.Mesh(new THREE.LatheGeometry(bodyProfile, 24));
    body.position.y = 0.25;
    group.add(body);

    // 링 장식
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.025, 8, 24));
    ring.position.y = 0.68;
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    // 십자가 - 세로
    const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.2, 0.04));
    crossV.position.y = 0.85;
    group.add(crossV);

    // 십자가 - 가로
    const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.04, 0.04));
    crossH.position.y = 0.88;
    group.add(crossH);

    return PieceModels.mergeGroup(group);
  }

  static createQueen() {
    const group = new THREE.Group();

    // 베이스
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.33, 0.1, 24));
    base.position.y = 0.05;
    group.add(base);

    // 기둥 하단
    const lowerBody = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.15, 20));
    lowerBody.position.y = 0.175;
    group.add(lowerBody);

    // 몸체
    const bodyProfile = createLathePoints([
      [0, 0], [0.22, 0], [0.2, 0.05], [0.13, 0.15],
      [0.11, 0.3], [0.13, 0.4], [0.16, 0.45],
      [0.14, 0.5], [0.08, 0.52], [0, 0.52]
    ]);
    const body = new THREE.Mesh(new THREE.LatheGeometry(bodyProfile, 24));
    body.position.y = 0.25;
    group.add(body);

    // 왕관 (톱니 모양)
    const crownProfile = createLathePoints([
      [0, 0], [0.12, 0], [0.15, 0.04], [0.12, 0.06],
      [0.16, 0.1], [0.11, 0.12], [0.05, 0.14], [0, 0.14]
    ]);
    const crown = new THREE.Mesh(new THREE.LatheGeometry(crownProfile, 8));
    crown.position.y = 0.73;
    group.add(crown);

    // 구슬 (꼭대기)
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 12));
    ball.position.y = 0.9;
    group.add(ball);

    return PieceModels.mergeGroup(group);
  }

  static createBishop() {
    const group = new THREE.Group();

    // 베이스
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.3, 0.1, 24));
    base.position.y = 0.05;
    group.add(base);

    // 기둥 하단
    const lowerBody = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.25, 0.12, 20));
    lowerBody.position.y = 0.16;
    group.add(lowerBody);

    // 몸체
    const bodyProfile = createLathePoints([
      [0, 0], [0.19, 0], [0.17, 0.05], [0.12, 0.15],
      [0.1, 0.25], [0.12, 0.35], [0.11, 0.4],
      [0.06, 0.45], [0, 0.45]
    ]);
    const body = new THREE.Mesh(new THREE.LatheGeometry(bodyProfile, 24));
    body.position.y = 0.22;
    group.add(body);

    // 미트라 (모자)
    const mitre = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.2, 16));
    mitre.position.y = 0.73;
    group.add(mitre);

    // 구슬 (꼭대기)
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 8));
    ball.position.y = 0.85;
    group.add(ball);

    return PieceModels.mergeGroup(group);
  }

  static createKnight() {
    const group = new THREE.Group();

    // 베이스
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.3, 0.1, 24));
    base.position.y = 0.05;
    group.add(base);

    // 기둥 하단
    const lowerBody = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.25, 0.12, 20));
    lowerBody.position.y = 0.16;
    group.add(lowerBody);

    // 말 머리 (Shape으로 2D 실루엣 -> ExtrudeGeometry)
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0.1, 0);
    shape.lineTo(0.12, 0.08);
    shape.lineTo(0.14, 0.18);
    shape.lineTo(0.12, 0.3);
    shape.lineTo(0.06, 0.38);
    shape.lineTo(0.02, 0.45);
    shape.lineTo(-0.03, 0.5);
    shape.lineTo(-0.08, 0.52);
    shape.lineTo(-0.14, 0.48);
    shape.lineTo(-0.15, 0.42);
    shape.lineTo(-0.13, 0.38);
    shape.lineTo(-0.1, 0.33);
    // 귀
    shape.lineTo(-0.12, 0.42);
    shape.lineTo(-0.08, 0.48);
    shape.lineTo(-0.03, 0.5);
    shape.lineTo(-0.06, 0.45);
    shape.lineTo(-0.04, 0.38);

    // 얼굴 라인
    shape.lineTo(0, 0.35);
    shape.lineTo(0.04, 0.3);
    shape.lineTo(0.06, 0.22);
    // 입 부분
    shape.lineTo(0.1, 0.18);
    shape.lineTo(0.12, 0.14);
    shape.lineTo(0.1, 0.08);
    shape.lineTo(0.06, 0.04);
    shape.lineTo(0, 0);

    const extrudeSettings = {
      depth: 0.14,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3
    };

    const headGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const head = new THREE.Mesh(headGeo);
    head.position.set(-0.07, 0.22, -0.07);
    head.scale.set(1.2, 1.2, 1.2);
    group.add(head);

    return PieceModels.mergeGroup(group);
  }

  static createRook() {
    const group = new THREE.Group();

    // 베이스
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.3, 0.1, 24));
    base.position.y = 0.05;
    group.add(base);

    // 몸체 하단
    const lowerBody = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 0.08, 20));
    lowerBody.position.y = 0.14;
    group.add(lowerBody);

    // 몸체 (직선 타워)
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.35, 20));
    tower.position.y = 0.355;
    group.add(tower);

    // 상단 플랫폼
    const platform = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.16, 0.06, 20));
    platform.position.y = 0.56;
    group.add(platform);

    // 성벽 크레넬레이션 (사각 돌출)
    const crenelGeo = new THREE.BoxGeometry(0.1, 0.1, 0.08);
    const positions = [
      [0.14, 0.64, 0],
      [-0.14, 0.64, 0],
      [0, 0.64, 0.14],
      [0, 0.64, -0.14],
    ];
    positions.forEach(([x, y, z]) => {
      const crenel = new THREE.Mesh(crenelGeo);
      crenel.position.set(x, y, z);
      crenel.lookAt(0, y, 0);
      group.add(crenel);
    });

    return PieceModels.mergeGroup(group);
  }

  static createPawn() {
    const group = new THREE.Group();

    // 베이스
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.08, 20));
    base.position.y = 0.04;
    group.add(base);

    // 몸체
    const bodyProfile = createLathePoints([
      [0, 0], [0.16, 0], [0.14, 0.04], [0.09, 0.12],
      [0.08, 0.2], [0.09, 0.25], [0.07, 0.28], [0, 0.28]
    ]);
    const body = new THREE.Mesh(new THREE.LatheGeometry(bodyProfile, 20));
    body.position.y = 0.08;
    group.add(body);

    // 머리 (구)
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 12));
    head.position.y = 0.42;
    group.add(head);

    return PieceModels.mergeGroup(group);
  }

  // 그룹의 모든 메시를 하나의 BufferGeometry로 병합
  static mergeGroup(group) {
    const geometries = [];
    group.updateMatrixWorld(true);

    group.traverse((child) => {
      if (child.isMesh) {
        const cloned = child.geometry.clone();
        cloned.applyMatrix4(child.matrixWorld);
        geometries.push(cloned);
      }
    });

    if (geometries.length === 0) return new THREE.BufferGeometry();

    const merged = this.mergeBufferGeometries(geometries);

    // 정리
    geometries.forEach(g => g.dispose());

    return merged;
  }

  static mergeBufferGeometries(geometries) {
    let totalVertices = 0;
    let totalIndices = 0;

    // 인덱스가 없는 geometry는 인덱스 생성
    const processedGeometries = geometries.map(geo => {
      if (!geo.index) {
        const posCount = geo.attributes.position.count;
        const indices = [];
        for (let i = 0; i < posCount; i++) indices.push(i);
        geo.setIndex(indices);
      }
      totalVertices += geo.attributes.position.count;
      totalIndices += geo.index.count;
      return geo;
    });

    const mergedPositions = new Float32Array(totalVertices * 3);
    const mergedNormals = new Float32Array(totalVertices * 3);
    const mergedIndices = new Uint32Array(totalIndices);

    let vertexOffset = 0;
    let indexOffset = 0;
    let vertexCount = 0;

    for (const geo of processedGeometries) {
      const positions = geo.attributes.position.array;
      mergedPositions.set(positions, vertexOffset * 3);

      if (geo.attributes.normal) {
        const normals = geo.attributes.normal.array;
        mergedNormals.set(normals, vertexOffset * 3);
      } else {
        geo.computeVertexNormals();
        mergedNormals.set(geo.attributes.normal.array, vertexOffset * 3);
      }

      const indices = geo.index.array;
      for (let i = 0; i < indices.length; i++) {
        mergedIndices[indexOffset + i] = indices[i] + vertexCount;
      }

      vertexOffset += geo.attributes.position.count;
      indexOffset += indices.length;
      vertexCount += geo.attributes.position.count;
    }

    const merged = new THREE.BufferGeometry();
    merged.setAttribute('position', new THREE.BufferAttribute(mergedPositions, 3));
    merged.setAttribute('normal', new THREE.BufferAttribute(mergedNormals, 3));
    merged.setIndex(new THREE.BufferAttribute(mergedIndices, 1));
    merged.computeVertexNormals();

    return merged;
  }

  static getGeometry(type) {
    switch (type) {
      case 'k': return PieceModels.createKing();
      case 'q': return PieceModels.createQueen();
      case 'r': return PieceModels.createRook();
      case 'b': return PieceModels.createBishop();
      case 'n': return PieceModels.createKnight();
      case 'p': return PieceModels.createPawn();
      default: return PieceModels.createPawn();
    }
  }
}
