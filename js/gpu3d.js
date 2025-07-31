/**
 * GPU 3D Model Viewer - NVIDIA GeForce 8800 GT
 * Versão melhorada com performance otimizada e recursos avançados
 */

class GPU3DModel {
  constructor(options = {}) {
    // Configurações padrão
    this.config = {
      canvasId: 'gpu3dCanvas',
      modelPath: window.GPU3DConfig ? window.GPU3DConfig.modelPath : '3d/gpu8800gt.glb',
      backgroundColor: window.GPU3DConfig ? window.GPU3DConfig.backgroundColor : 0x0a0a0a,
      primaryColor: window.GPU3DConfig ? window.GPU3DConfig.primaryColor : 0x00ff41,
      rotationSpeed: window.GPU3DConfig ? window.GPU3DConfig.rotationSpeed : 0.01,
      wobbleSpeed: window.GPU3DConfig ? window.GPU3DConfig.wobbleSpeed : 0.001,
      wobbleAmplitude: window.GPU3DConfig ? window.GPU3DConfig.wobbleAmplitude : 0.08,
      scale: window.GPU3DConfig ? window.GPU3DConfig.scale : 5,
      cameraDistance: window.GPU3DConfig ? window.GPU3DConfig.cameraDistance : 7,
      fov: window.GPU3DConfig ? window.GPU3DConfig.fov : 60,
      ...options
    };

    // Propriedades da cena
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.gpu = null;
    this.animationId = null;
    this.isInitialized = false;
    this.isLoading = false;
    this.loadingProgress = 0;
    
    // Controles
    this.controls = {
      autoRotate: true,
      wobble: true,
      shadows: true
    };

    // Performance
    this.frameCount = 0;
    this.lastTime = 0;
    this.fps = 60;

    // Bind methods para preservar contexto
    this.animate = this.animate.bind(this);
    this.onWindowResize = this.debounce(this.onWindowResize.bind(this), 100);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);

    this.init();
  }

  /**
   * Inicialização da cena 3D
   */
  init() {
    try {
      // Verificar se Three.js está disponível
      if (typeof THREE === 'undefined') {
        throw new Error('Three.js não está carregado');
      }

      // Verificar se GLTFLoader está disponível
      if (typeof THREE.GLTFLoader === 'undefined') {
        throw new Error('GLTFLoader não está carregado');
      }

      const canvas = document.getElementById(this.config.canvasId);
      if (!canvas) {
        throw new Error(`Canvas com ID '${this.config.canvasId}' não encontrado`);
      }

      console.log('Iniciando configuração da cena 3D...');
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

  /**
   * Configuração da cena
   */
  setupScene(canvas) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.config.backgroundColor);
    
    // Adicionar fog para profundidade
    this.scene.fog = new THREE.Fog(this.config.backgroundColor, 2, 10);
  }

  /**
   * Configuração da câmera
   */
  setupCamera(canvas) {
    const aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera = new THREE.PerspectiveCamera(
      this.config.fov, 
      aspect, 
      0.1, 
      100
    );
    this.camera.position.set(0, 0.2, this.config.cameraDistance);
  }

  /**
   * Configuração do renderer
   */
  setupRenderer(canvas) {
    this.renderer = new THREE.WebGLRenderer({ 
      canvas, 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limitar pixel ratio para performance
    this.renderer.shadowMap.enabled = this.controls.shadows;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
  }

  /**
   * Configuração da iluminação
   */
  setupLighting() {
    // Luz ambiente
    const ambientLight = new THREE.AmbientLight(0x404040, 0.7);
    this.scene.add(ambientLight);

    // Luz direcional principal
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

    // Luz de preenchimento
    const fillLight = new THREE.DirectionalLight(this.config.primaryColor, 0.4);
    fillLight.position.set(-3, -2, -5);
    this.scene.add(fillLight);

    // Luz de destaque
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
    rimLight.position.set(0, 5, -3);
    this.scene.add(rimLight);
  }

  /**
   * Configuração dos event listeners
   */
  setupEventListeners() {
    window.addEventListener('resize', this.onWindowResize);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    
    // Pausar animação quando a aba não está visível
    if ('hidden' in document) {
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }
  }

  /**
   * Carregamento do modelo 3D
   */
  async loadModel() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.showLoadingMessage();

    console.log('Iniciando carregamento do modelo...');
    
    const loader = new THREE.GLTFLoader();
    
    // Verificar se estamos em um servidor local ou se o arquivo pode ser acessado
    const isLocalFile = window.location.protocol === 'file:';
    
    if (isLocalFile) {
      console.warn('Arquivo aberto diretamente - usando modelo fallback');
      this.createFallbackModel();
      return;
    }
    
    try {
      // Tentar encontrar o modelo usando a configuração
      let modelPath = this.config.modelPath;
      
      if (window.GPU3DConfig && window.GPU3DConfig.findAvailableModel) {
        const availablePath = await window.GPU3DConfig.findAvailableModel();
        if (availablePath) {
          modelPath = availablePath;
        }
      }
      
      console.log('Tentando carregar modelo de:', modelPath);
      
      // Verificar se o arquivo existe antes de tentar carregar
      const response = await fetch(modelPath, { method: 'HEAD' });
      
      if (!response.ok) {
        throw new Error(`Arquivo não encontrado: ${modelPath}`);
      }
      
      console.log('Arquivo encontrado, iniciando carregamento...');
      
      loader.load(
        modelPath,
        (gltf) => this.onModelLoaded(gltf),
        (xhr) => this.onProgress(xhr),
        (error) => this.onError(error)
      );
      
    } catch (error) {
      console.error('Erro ao verificar arquivo:', error);
      
      // Se for erro de CORS ou fetch, usar modelo fallback
      if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
        console.log('Erro de CORS detectado - usando modelo fallback');
        this.createFallbackModel();
      } else {
        this.onError(error);
      }
    }
  }

  /**
   * Callback quando o modelo é carregado
   */
  onModelLoaded(gltf) {
    try {
      this.gpu = gltf.scene;
      
      // Configurar sombras e materiais
      this.gpu.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = this.controls.shadows;
          child.receiveShadow = this.controls.shadows;
          
          // Melhorar materiais
          if (child.material) {
            child.material.envMapIntensity = 0.5;
            child.material.needsUpdate = true;
          }
        }
      });

      // Posicionar e escalar o modelo
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

  /**
   * Criar modelo fallback caso o GLB não carregue
   */
  createFallbackModel() {
    try {
      console.log('Criando modelo fallback...');
      
      // Criar geometria básica da GPU
      const geometry = new THREE.BoxGeometry(2, 0.5, 1.5);
      const material = new THREE.MeshPhongMaterial({ 
        color: 0x333333,
        shininess: 100
      });
      
      this.gpu = new THREE.Mesh(geometry, material);
      this.gpu.castShadow = this.controls.shadows;
      this.gpu.receiveShadow = this.controls.shadows;
      
      // Adicionar detalhes
      const fanGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 8);
      const fanMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
      const fan = new THREE.Mesh(fanGeometry, fanMaterial);
      fan.position.set(0, 0.3, 0);
      fan.rotation.x = Math.PI / 2;
      this.gpu.add(fan);
      
      // Adicionar conectores
      const connectorGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.3);
      const connectorMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });
      
      for (let i = 0; i < 3; i++) {
        const connector = new THREE.Mesh(connectorGeometry, connectorMaterial);
        connector.position.set(-0.8 + i * 0.8, -0.2, 0.6);
        this.gpu.add(connector);
      }
      
      // Posicionar o modelo corretamente
      this.gpu.position.set(0, 0, 0);
      this.gpu.rotation.x = 0;
      
      this.scene.add(this.gpu);
      this.hideLoadingMessage();
      this.isLoading = false;
      
      // Forçar uma renderização imediata
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
      
      console.log('Modelo fallback criado com sucesso');
    } catch (error) {
      console.error('Erro ao criar modelo fallback:', error);
      this.onError(error);
    }
  }

  /**
   * Callback de progresso do carregamento
   */
  onProgress(xhr) {
    if (xhr.lengthComputable) {
      this.loadingProgress = (xhr.loaded / xhr.total) * 100;
      this.updateLoadingMessage();
    }
  }

  /**
   * Callback de erro
   */
  onError(error) {
    console.error('Erro ao carregar modelo:', error);
    
    // Tentar criar modelo fallback primeiro
    if (!this.gpu) {
      console.log('Tentando criar modelo fallback...');
      this.createFallbackModel();
      return;
    }
    
    this.hideLoadingMessage();
    
    let errorMessage = 'Erro ao carregar o modelo 3D';
    
    if (error.message) {
      errorMessage += `: ${error.message}`;
    }
    
    if (error.type === 'error' && error.target && error.target.status) {
      errorMessage += ` (Status: ${error.target.status})`;
    }
    
    this.showError(errorMessage);
    this.isLoading = false;
  }

  /**
   * Mostrar mensagem de carregamento
   */
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

  /**
   * Atualizar mensagem de carregamento
   */
  updateLoadingMessage() {
    const progressEl = document.querySelector('.loading-progress');
    if (progressEl) {
      progressEl.textContent = `${this.loadingProgress.toFixed(0)}%`;
    }
  }

  /**
   * Esconder mensagem de carregamento
   */
  hideLoadingMessage() {
    const loadingMsg = document.getElementById('gpu3d-loading-msg');
    if (loadingMsg) {
      loadingMsg.remove();
    }
  }

  /**
   * Mostrar mensagem de erro
   */
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

  /**
   * Loop de animação otimizado
   */
  animate(currentTime = 0) {
    if (!this.isInitialized) return;

    this.animationId = requestAnimationFrame(this.animate);
    
    // Calcular FPS
    this.frameCount++;
    if (currentTime - this.lastTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = currentTime;
      
      // Debug: mostrar FPS no console
      if (this.fps < 30) {
        console.warn(`FPS baixo: ${this.fps}`);
      }
    }

    // Animar modelo
    if (this.gpu && this.controls.autoRotate) {
      this.gpu.rotation.y += this.config.rotationSpeed;
      
      if (this.controls.wobble) {
        this.gpu.rotation.x = Math.PI / 2 + Math.sin(currentTime * this.config.wobbleSpeed) * this.config.wobbleAmplitude;
      }
    }

    // Renderizar cena
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    } else {
      console.warn('Renderer, scene ou camera não disponíveis');
    }
  }

  /**
   * Redimensionamento responsivo
   */
  onWindowResize() {
    if (!this.isInitialized) return;

    const canvas = this.renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * Gerenciar visibilidade da página
   */
  handleVisibilityChange() {
    if (document.hidden) {
      this.pause();
    } else {
      this.resume();
    }
  }

  /**
   * Pausar animação
   */
  pause() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Retomar animação
   */
  resume() {
    if (!this.animationId && this.isInitialized) {
      this.animate();
    }
  }

  /**
   * Alternar rotação automática
   */
  toggleAutoRotate() {
    this.controls.autoRotate = !this.controls.autoRotate;
  }

  /**
   * Alternar efeito wobble
   */
  toggleWobble() {
    this.controls.wobble = !this.controls.wobble;
  }

  /**
   * Definir velocidade de rotação
   */
  setRotationSpeed(speed) {
    this.config.rotationSpeed = Math.max(0, Math.min(0.1, speed));
  }

  /**
   * Obter estatísticas de performance
   */
  getStats() {
    return {
      fps: this.fps,
      isInitialized: this.isInitialized,
      isLoading: this.isLoading,
      loadingProgress: this.loadingProgress
    };
  }

  /**
   * Função debounce para otimizar performance
   */
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

  /**
   * Limpeza de recursos
   */
  dispose() {
    this.pause();
    
    // Remover event listeners
    window.removeEventListener('resize', this.onWindowResize);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    
    // Limpar cena
    if (this.scene) {
      this.scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    }
    
    // Limpar renderer
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    this.isInitialized = false;
    console.log('GPU 3D Model recursos liberados');
  }
}

// Inicialização será feita pelo script no HTML após verificação das dependências

// Limpeza quando a página for descarregada
window.addEventListener('beforeunload', () => {
  if (window.gpu3DModel) {
    window.gpu3DModel.dispose();
  }
});
