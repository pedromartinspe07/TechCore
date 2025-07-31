/**
 * Controles Avançados para o Visualizador 3D da GPU
 * Demonstra como usar a API pública do GPU3DModel
 */

class GPU3DControls {
  constructor() {
    this.gpu3D = null;
    this.controlsContainer = null;
    this.init();
  }

  init() {
    // Aguardar o modelo 3D estar disponível
    this.waitForGPU3D();
  }

  waitForGPU3D() {
    const checkInterval = setInterval(() => {
      if (window.gpu3DModel && window.gpu3DModel.isInitialized) {
        this.gpu3D = window.gpu3DModel;
        this.createControls();
        clearInterval(checkInterval);
        console.log('Controles 3D inicializados com sucesso');
      }
    }, 100);

    // Timeout de segurança
    setTimeout(() => {
      clearInterval(checkInterval);
      console.warn('GPU 3D Model não encontrado após 10 segundos');
      
      // Tentar criar controles mesmo sem o modelo
      if (document.querySelector('.gpu-3d-container')) {
        console.log('Criando controles básicos...');
        this.createBasicControls();
      }
    }, 10000);
  }

  createBasicControls() {
    const container = document.querySelector('.gpu-3d-container');
    if (!container) return;
    // Remover controles antigos se existirem
    const oldControls = container.querySelector('.gpu3d-controls');
    if (oldControls) oldControls.remove();

    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'gpu3d-controls';
    controlsContainer.innerHTML = `
      <div class="controls-header">Controles 3D</div>
      <div class="controls-grid">
        <button id="reload-model" class="control-btn" title="Recarregar Modelo">
          <span class="icon">🔄</span>
        </button>
        <button id="toggle-lights" class="control-btn active" title="Alternar Luzes">
          <span class="icon">💡</span>
        </button>
      </div>
      <div class="stats-display">
        <span>Modelo Fallback Ativo</span>
      </div>
    `;

    container.appendChild(controlsContainer);
    
    // Adicionar event listeners básicos
    document.getElementById('reload-model')?.addEventListener('click', () => {
      location.reload();
    });
  }

  createControls() {
    const container = document.querySelector('.gpu-3d-container');
    if (!container) return;
    // Remover controles antigos se existirem
    const oldControls = container.querySelector('.gpu3d-controls');
    if (oldControls) oldControls.remove();

    // Criar container de controles
    this.controlsContainer = document.createElement('div');
    this.controlsContainer.className = 'gpu3d-controls';
    this.controlsContainer.innerHTML = `
      <div class="controls-header">Controles 3D</div>
      <div class="controls-grid">
        <button id="toggle-rotation" class="control-btn active" title="Alternar Rotação">
          <span class="icon">🔄</span>
        </button>
        <button id="toggle-wobble" class="control-btn active" title="Alternar Oscilação">
          <span class="icon">📈</span>
        </button>
        <button id="pause-resume" class="control-btn" title="Pausar/Retomar">
          <span class="icon">⏸️</span>
        </button>
        <button id="reset-view" class="control-btn" title="Resetar Visualização">
          <span class="icon">🏠</span>
        </button>
      </div>
      <div class="speed-control">
        <label for="rotation-speed">Velocidade:</label>
        <input type="range" id="rotation-speed" min="0" max="100" value="50" title="Velocidade de Rotação">
      </div>
      <div class="stats-display">
        <span id="fps-display">FPS: --</span>
      </div>
    `;

    container.appendChild(this.controlsContainer);
    this.setupEventListeners();
    this.startStatsUpdate();
  }

  setupEventListeners() {
    // Toggle rotação automática
    document.getElementById('toggle-rotation').addEventListener('click', () => {
      this.gpu3D.toggleAutoRotate();
      this.updateButtonState('toggle-rotation', this.gpu3D.controls.autoRotate);
    });

    // Toggle efeito wobble
    document.getElementById('toggle-wobble').addEventListener('click', () => {
      this.gpu3D.toggleWobble();
      this.updateButtonState('toggle-wobble', this.gpu3D.controls.wobble);
    });

    // Pausar/retomar animação
    document.getElementById('pause-resume').addEventListener('click', () => {
      if (this.gpu3D.animationId) {
        this.gpu3D.pause();
        this.updateButtonState('pause-resume', false);
      } else {
        this.gpu3D.resume();
        this.updateButtonState('pause-resume', true);
      }
    });

    // Resetar visualização
    document.getElementById('reset-view').addEventListener('click', () => {
      this.resetView();
    });

    // Controle de velocidade
    const speedSlider = document.getElementById('rotation-speed');
    speedSlider.addEventListener('input', (e) => {
      const speed = (e.target.value / 100) * 0.1; // 0 a 0.1
      this.gpu3D.setRotationSpeed(speed);
    });
  }

  updateButtonState(buttonId, isActive) {
    const button = document.getElementById(buttonId);
    if (button) {
      button.classList.toggle('active', isActive);
      
      // Atualizar ícone do botão pause/resume
      if (buttonId === 'pause-resume') {
        const icon = button.querySelector('.icon');
        icon.textContent = isActive ? '⏸️' : '▶️';
      }
    }
  }

  resetView() {
    if (this.gpu3D && this.gpu3D.gpu) {
      // Resetar rotação
      this.gpu3D.gpu.rotation.set(0, 0, 0);
      this.gpu3D.gpu.rotation.x = 0;
      
      // Resetar posição da câmera
      this.gpu3D.camera.position.set(0, 0.2, this.gpu3D.config.cameraDistance);
      this.gpu3D.camera.lookAt(0, 0, 0);
      
      // Reativar animações
      this.gpu3D.controls.autoRotate = true;
      this.gpu3D.controls.wobble = true;
      
      // Atualizar botões
      this.updateButtonState('toggle-rotation', true);
      this.updateButtonState('toggle-wobble', true);
      this.updateButtonState('pause-resume', true);
      
      // Resetar velocidade
      const speedSlider = document.getElementById('rotation-speed');
      if (speedSlider) {
        speedSlider.value = 50;
        this.gpu3D.setRotationSpeed(0.01);
      }
    }
  }

  startStatsUpdate() {
    setInterval(() => {
      if (this.gpu3D) {
        const stats = this.gpu3D.getStats();
        const fpsDisplay = document.getElementById('fps-display');
        if (fpsDisplay) {
          fpsDisplay.textContent = `FPS: ${stats.fps}`;
          
          // Mudar cor baseado no FPS
          if (stats.fps < 30) {
            fpsDisplay.style.color = '#ff4444';
          } else if (stats.fps < 50) {
            fpsDisplay.style.color = '#ffaa00';
          } else {
            fpsDisplay.style.color = '#00ff41';
          }
        }
      }
    }, 1000);
  }

  // Métodos públicos para controle externo
  pause() {
    if (this.gpu3D) {
      this.gpu3D.pause();
      this.updateButtonState('pause-resume', false);
    }
  }

  resume() {
    if (this.gpu3D) {
      this.gpu3D.resume();
      this.updateButtonState('pause-resume', true);
    }
  }

  setSpeed(speed) {
    if (this.gpu3D) {
      const normalizedSpeed = Math.max(0, Math.min(1, speed));
      this.gpu3D.setRotationSpeed(normalizedSpeed * 0.1);
      
      const speedSlider = document.getElementById('rotation-speed');
      if (speedSlider) {
        speedSlider.value = normalizedSpeed * 100;
      }
    }
  }

  getStats() {
    return this.gpu3D ? this.gpu3D.getStats() : null;
  }
}

// Inicializar controles quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  // Aguardar um pouco para garantir que o modelo 3D seja inicializado
  setTimeout(() => {
    window.gpu3DControls = new GPU3DControls();
  }, 500);
});

// Exemplo de uso via console
window.GPU3DExamples = {
  // Pausar animação
  pause: () => {
    if (window.gpu3DControls) window.gpu3DControls.pause();
  },
  
  // Retomar animação
  resume: () => {
    if (window.gpu3DControls) window.gpu3DControls.resume();
  },
  
  // Definir velocidade (0-1)
  setSpeed: (speed) => {
    if (window.gpu3DControls) window.gpu3DControls.setSpeed(speed);
  },
  
  // Obter estatísticas
  getStats: () => {
    if (window.gpu3DControls) return window.gpu3DControls.getStats();
  },
  
  // Resetar visualização
  reset: () => {
    if (window.gpu3DControls) window.gpu3DControls.resetView();
  }
}; 
