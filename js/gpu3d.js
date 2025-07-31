/**
 * GPU 3D Model Viewer - NVIDIA GeForce 8800 GT
 * Versão otimizada, robusta e expansível
 */

class GPU3DModel {
  constructor(options = {}) {
    // Configurações padrão
    this.config = {
      canvasId: 'gpu3dCanvas',
      modelPath: window.GPU3DConfig?.modelPath || '3d/gpu8800gt.glb',
      backgroundColor: window.GPU3DConfig?.backgroundColor || 0x0a0a0a,
      primaryColor: window.GPU3DConfig?.primaryColor || 0x00ff41,
      rotationSpeed: window.GPU3DConfig?.rotationSpeed || 0.01,
      wobbleSpeed: window.GPU3DConfig?.wobbleSpeed || 0.001,
      wobbleAmplitude: window.GPU3DConfig?.wobbleAmplitude || 0.08,
      scale: window.GPU3DConfig?.scale || 5,
      cameraDistance: window.GPU3DConfig?.cameraDistance || 7,
      fov: window.GPU3DConfig?.fov || 60,
      ...options
    };

    // Estado do modelo
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.gpu = null;
    this.animationId = null;
    this.isInitialized = false;
    this.isLoading = false;
    this.loadingProgress = 0;

    // Controles
    this.controls = { autoRotate: true, wobble: true, shadows: true };

    // Performance
    this.frameCount = 0;
    this.lastTime = 0;
    this.fps = 60;

    // Bindings
    this.animate = this.animate.bind(this);
    this.onWindowResize = this.debounce(this.onWindowResize.bind(this), 100);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);

    this.init();
  }

  // Inicialização principal
  init() {
    try {
      if (typeof THREE === 'undefined') throw new Error('Three.js não está carregado');
      if (typeof THREE.GLTFLoader === 'undefined') throw new Error('GLTFLoader não está carregado');
      const canvas = document.getElementById(this.config.canvasId);
      if (!canvas) throw new Error(`Canvas com ID '${this.config.canvasId}' não encontrado`);

      this.setupScene(canvas);
      this.setupCamera(canvas);
      this.setupRenderer(canvas);
      this.setupLighting();
      this.setupEventListeners();
      this.loadModel();
      this.animate();

      this.isInitialized = true;
      console.log('GPU 3D Model inicializado com sucesso');
    } catch (error) {
      console.error('Erro na inicialização:', error);
      this.showError(`Erro ao inicializar o visualizador 3D: ${error.message}`);
    }
  }

  // Cena 3D
  setupScene(canvas) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.config.backgroundColor);
    this.scene.fog = new THREE.Fog(this.config.backgroundColor, 2, 10);
  }

  // Câmera
  setupCamera(canvas) {
    const aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera = new THREE.PerspectiveCamera(
      this.config.fov, aspect, 0.1, 100
    );
    this.camera.position.set(0, 0.2, this.config.cameraDistance);
  }

  // Renderizador
  setupRenderer(canvas) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = this.controls.shadows;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
  }

  // Iluminação
  setupLighting() {
    this.scene.add(new THREE.AmbientLight(0x404040, 0.7));
    const mainLight = new THREE.DirectionalLight(this.config.primaryColor, 1.2);
    mainLight.position.set(3, 5, 5);
    mainLight.castShadow = this.controls.shadows;
    if (this.controls.shadows) {
      mainLight.shadow.mapSize.width = 2048;
      mainLight.shadow.mapSize.height = 2048;
      mainLight.shadow.camera.near = 0.5;
      mainLight.shadow.camera.far = 50;
    }
    this.scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(this.config.primaryColor, 0.4);
    fillLight.position.set(-3, -2, -5);
    this.scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
    rimLight.position.set(0, 5, -3);
    this.scene.add(rimLight);
  }

  // Listeners
  setupEventListeners() {
    window.addEventListener('resize', this.onWindowResize);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  // Carregar modelo 3D
  async loadModel() {
    if (this.isLoading) return;
    this.isLoading = true;
    this.showLoadingMessage();

    const loader = new THREE.GLTFLoader();
    const isLocalFile = window.location.protocol === 'file:';

    if (isLocalFile) {
      console.warn('Arquivo aberto diretamente - usando modelo fallback');
      this.createFallbackModel();
      return;
    }

    try {
      let modelPath = this.config.modelPath;
      if (window.GPU3DConfig?.findAvailableModel) {
        const availablePath = await window.GPU3DConfig.findAvailableModel();
        if (availablePath) modelPath = availablePath;
      }
      const response = await fetch(modelPath, { method: 'HEAD' });
      if (!response.ok) throw new Error(`Arquivo não encontrado: ${modelPath}`);

      loader.load(
        modelPath,
        (gltf) => this.onModelLoaded(gltf),
        (xhr) => this.onProgress(xhr),
        (error) => this.onError(error)
      );
    } catch (error) {
      console.error('Erro ao verificar arquivo:', error);
      this.createFallbackModel();
    }
  }

  // Modelo carregado
  onModelLoaded(gltf) {
    try {
      this.gpu = gltf.scene;
      this.gpu.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = this.controls.shadows;
          child.receiveShadow = this.controls.shadows;
          if (child.material) {
            child.material.envMapIntensity = 0.5;
            child.material.needsUpdate = true;
          }
        }
      });
      this.gpu.position.set(0, 0, 0);
      this.gpu.scale.setScalar(this.config.scale);
      this.gpu.rotation.x = 0;
      this.scene.add(this.gpu);
      this.hideLoadingMessage();
      this.isLoading = false;
      console.log('Modelo 3D carregado com sucesso');
    } catch (error) {
      console.error('Erro ao processar modelo:', error);
      this.createFallbackModel();
    }
  }

  // Modelo fallback
  createFallbackModel() {
    try {
      const geometry = new THREE.BoxGeometry(2, 0.5, 1.5);
      const material = new THREE.MeshPhongMaterial({ color: 0x333333, shininess: 100 });
      this.gpu = new THREE.Mesh(geometry, material);
      this.gpu.castShadow = this.controls.shadows;
      this.gpu.receiveShadow = this.controls.shadows;

      // Fan
      const fanGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 8);
      const fanMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
      const fan = new THREE.Mesh(fanGeometry, fanMaterial);
      fan.position.set(0, 0.3, 0);
      fan.rotation.x = Math.PI / 2;
      this.gpu.add(fan);

      // Conectores
      const connectorGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.3);
      const connectorMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });
      for (let i = 0; i < 3; i++) {
        const connector = new THREE.Mesh(connectorGeometry, connectorMaterial);
        connector.position.set(-0.8 + i * 0.8, -0.2, 0.6);
        this.gpu.add(connector);
      }

      this.gpu.position.set(0, 0, 0);
      this.gpu.rotation.x = 0;
      this.scene.add(this.gpu);
      this.hideLoadingMessage();
      this.isLoading = false;
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
      console.log('Modelo fallback criado com sucesso');
    } catch (error) {
      console.error('Erro ao criar modelo fallback:', error);
      this.onError(error);
    }
  }

  // Progresso de carregamento
  onProgress(xhr) {
    if (xhr.lengthComputable) {
      this.loadingProgress = (xhr.loaded / xhr.total) * 100;
      this.updateLoadingMessage();
    }
  }

  // Erro de carregamento
  onError(error) {
    console.error('Erro ao carregar modelo:', error);
    if (!this.gpu) {
      this.createFallbackModel();
      return;
    }
    this.hideLoadingMessage();
    let errorMessage = 'Erro ao carregar o modelo 3D';
    if (error.message) errorMessage += `: ${error.message}`;
    if (error.type === 'error' && error.target?.status) errorMessage += ` (Status: ${error.target.status})`;
    this.showError(errorMessage);
    this.isLoading = false;
  }

  // Mensagens de carregamento/erro
  showLoadingMessage() {
    const container = document.querySelector('.gpu-3d-container');
    if (!container) return;
    const loadingMsg = document.createElement('div');
    loadingMsg.id = 'gpu3d-loading-msg';
    loadingMsg.className = 'gpu3d-loading';
    loadingMsg.innerHTML = `
      <div class="loading-spinner"></div>
      <div class="loading-text">Carregando modelo 3D...</div>
      <div class="loading-progress">0%</div>
    `;
    container.appendChild(loadingMsg);
  }
  updateLoadingMessage() {
    const progressEl = document.querySelector('.loading-progress');
    if (progressEl) progressEl.textContent = `${this.loadingProgress.toFixed(0)}%`;
  }
  hideLoadingMessage() {
    const loadingMsg = document.getElementById('gpu3d-loading-msg');
    if (loadingMsg) loadingMsg.remove();
  }
  showError(message) {
    const container = document.querySelector('.gpu-3d-container');
    if (!container) return;
    const errorMsg = document.createElement('div');
    errorMsg.className = 'gpu3d-error';
    errorMsg.innerHTML = `
      <div class="error-icon">⚠️</div>
      <div class="error-text">${message}</div>
      <button class="error-retry" onclick="location.reload()">Tentar Novamente</button>
    `;
    container.appendChild(errorMsg);
  }

  // Animação principal
  animate(currentTime = 0) {
    if (!this.isInitialized) return;
    this.animationId = requestAnimationFrame(this.animate);

    // FPS
    this.frameCount++;
    if (currentTime - this.lastTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = currentTime;
      if (this.fps < 30) console.warn(`FPS baixo: ${this.fps}`);
    }

    // Animação do modelo
    if (this.gpu && this.controls.autoRotate) {
      this.gpu.rotation.y += this.config.rotationSpeed;
      if (this.controls.wobble) {
        this.gpu.rotation.x = Math.PI / 2 + Math.sin(currentTime * this.config.wobbleSpeed) * this.config.wobbleAmplitude;
      }
    }

    // Renderizar
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  // Responsividade
  onWindowResize() {
    if (!this.isInitialized) return;
    const canvas = this.renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  // Visibilidade da página
  handleVisibilityChange() {
    if (document.hidden) this.pause();
    else this.resume();
  }

  // Controle de animação
  pause() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
  resume() {
    if (!this.animationId && this.isInitialized) this.animate();
  }
  toggleAutoRotate() {
    this.controls.autoRotate = !this.controls.autoRotate;
  }
  toggleWobble() {
    this.controls.wobble = !this.controls.wobble;
  }
  setRotationSpeed(speed) {
    this.config.rotationSpeed = Math.max(0, Math.min(0.1, speed));
  }
  getStats() {
    return {
      fps: this.fps,
      isInitialized: this.isInitialized,
      isLoading: this.isLoading,
      loadingProgress: this.loadingProgress
    };
  }

  // Debounce utilitário
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Limpeza de recursos
  dispose() {
    this.pause();
    window.removeEventListener('resize', this.onWindowResize);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    if (this.scene) {
      this.scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) object.material.forEach(m => m.dispose());
          else object.material.dispose();
        }
      });
    }
    if (this.renderer) this.renderer.dispose();
    this.isInitialized = false;
    console.log('GPU 3D Model recursos liberados');
  }
}

// Limpeza ao descarregar a página
window.addEventListener('beforeunload', () => {
  if (window.gpu3DModel) window.gpu3DModel.dispose();
});