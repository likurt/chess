import * as THREE from 'three';
import { COLORS, CAMERA } from '../utils/Constants.js';

export class SceneManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.clock = new THREE.Clock();
    this.updateCallbacks = [];

    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initLights();
    this.handleResize();

    window.addEventListener('resize', () => this.handleResize());
  }

  initScene() {
    this.scene = new THREE.Scene();

    // 배경 그라데이션
    const bgCanvas = document.createElement('canvas');
    bgCanvas.width = 2;
    bgCanvas.height = 512;
    const ctx = bgCanvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, '#16213e');
    gradient.addColorStop(0.5, '#1a1a2e');
    gradient.addColorStop(1, '#0f3460');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 2, 512);
    const bgTexture = new THREE.CanvasTexture(bgCanvas);
    this.scene.background = bgTexture;

    // 안개 (멀리 있는 것들을 부드럽게)
    this.scene.fog = new THREE.FogExp2(0x1a1a2e, 0.02);
  }

  initCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(CAMERA.FOV, aspect, CAMERA.NEAR, CAMERA.FAR);
    this.camera.position.set(CAMERA.INITIAL_POSITION.x, CAMERA.INITIAL_POSITION.y, CAMERA.INITIAL_POSITION.z);
    this.camera.lookAt(CAMERA.LOOK_AT.x, CAMERA.LOOK_AT.y, CAMERA.LOOK_AT.z);
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
  }

  initLights() {
    // 앰비언트 라이트
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambient);

    // 메인 디렉셔널 라이트 (태양)
    const dirLight = new THREE.DirectionalLight(0xfff5e6, 1.0);
    dirLight.position.set(5, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 30;
    dirLight.shadow.camera.left = -8;
    dirLight.shadow.camera.right = 8;
    dirLight.shadow.camera.top = 8;
    dirLight.shadow.camera.bottom = -8;
    dirLight.shadow.bias = -0.001;
    this.scene.add(dirLight);

    // 보조 포인트 라이트
    const pointLight1 = new THREE.PointLight(0xe94560, 0.3, 20);
    pointLight1.position.set(-6, 5, -6);
    this.scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x0f3460, 0.3, 20);
    pointLight2.position.set(6, 5, 6);
    this.scene.add(pointLight2);

    // 반대편 따뜻한 조명
    const fillLight = new THREE.DirectionalLight(0xffe4b5, 0.3);
    fillLight.position.set(-5, 6, -5);
    this.scene.add(fillLight);
  }

  handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  onUpdate(callback) {
    this.updateCallbacks.push(callback);
    return () => {
      const idx = this.updateCallbacks.indexOf(callback);
      if (idx !== -1) this.updateCallbacks.splice(idx, 1);
    };
  }

  startRenderLoop() {
    const animate = () => {
      requestAnimationFrame(animate);
      const delta = this.clock.getDelta();
      const elapsed = this.clock.getElapsedTime();

      for (const cb of this.updateCallbacks) {
        cb(delta, elapsed);
      }

      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  add(object) {
    this.scene.add(object);
  }

  remove(object) {
    this.scene.remove(object);
  }
}
