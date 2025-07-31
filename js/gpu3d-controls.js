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
      if (!this.gpu3D) {
        console.warn('GPU 3D Model não encontrado após 10 segundos');
        if (document.querySelector('.gpu-3d-container')) {
          this.createBasicControls();
        }
      }
    }, 10000);
  }

  createBasicControls() {
    const container = document.querySelector('.gpu-3d-container');
    if (!container) return;
    this.removeOldControls(container);

    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'gpu3d-controls';
    controlsContainer.innerHTML = `
      <div class="controls-header">Controles 3D</div>
      <div class="controls-grid">
        <button id="reload-model" class="control-btn" title="Recarregar Modelo" tabindex="0">
          <span class="icon">🔄</span>
        </button>
        <button id="toggle-lights" class="control-btn active" title="Alternar Luzes" tabindex="0">
          <span class="icon">💡</span>
        </button>
      </div>
      <div class="stats-display">
        <span>Modelo Fallback Ativo</span>
      </div>
    `;
    container.appendChild(controlsContainer);

    document.getElementById('reload-model')?.addEventListener('click', () => location.reload());
  }

  createControls() {
    const container = document.querySelector('.gpu-3d-container');
    if (!container) return;
    this.removeOldControls(container);

    this.controlsContainer = document.createElement('div');
    this.controlsContainer.className = 'gpu3d-controls';
    this.controlsContainer.innerHTML = `
      <div class="controls-header">Controles 3D</div>
      <div class="controls-grid">
        <button id="toggle-rotation" class="control-btn active" title="Alternar Rotação" tabindex="0">
          <span class="icon">🔄</span>
        </button>
        <button id="toggle-wobble" class="control-btn active" title="Alternar Oscilação" tabindex="0">
          <span class="icon">📈</span>
        </button>
        <button id="pause-resume" class="control-btn" title="Pausar/Retomar" tabindex="0">
          <span class="icon">⏸️</span>
        </button>
        <button id="reset-view" class="control-btn" title="Resetar Visualização" tabindex="0">
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

  removeOldControls(container) {
    const oldControls = container.querySelector('.gpu3d-controls');
    if (oldControls) oldControls.remove();
  }

  setupEventListeners() {
    this.addBtnListener('toggle-rotation', () => {
      this.gpu3D.toggleAutoRotate();
      this.updateButtonState('toggle-rotation', this.gpu3D.controls.autoRotate);
    });
    this.addBtnListener('toggle-wobble', () => {
      this.gpu3D.toggleWobble();
      this.updateButtonState('toggle-wobble', this.gpu3D.controls.wobble);
    });
    this.addBtnListener('pause-resume', () => {
      if (this.gpu3D.animationId) {
        this.gpu3D.pause();
        this.updateButtonState('pause-resume', false);
      } else {
        this.gpu3D.resume();
        this.updateButtonState('pause-resume', true);
      }
    });
    this.addBtnListener('reset-view', () => this.resetView());

    // Controle de velocidade
    const speedSlider = document.getElementById('rotation-speed');
    if (speedSlider) {
      speedSlider.addEventListener('input', (e) => {
        const speed = (e.target.value / 100) * 0.1;
        this.gpu3D.setRotationSpeed(speed);
      });
    }
  }

  addBtnListener(id, handler) {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', handler);
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') handler();
      });
    }
  }

  updateButtonState(buttonId, isActive) {
    const button = document.getElementById(buttonId);
    if (button) {
      button.classList.toggle('active', isActive);
      if (buttonId === 'pause-resume') {
        const icon = button.querySelector('.icon');
        icon.textContent = isActive ? '⏸️' : '▶️';
      }
    }
  }

  resetView() {
    if (this.gpu3D && this.gpu3D.gpu) {
      this.gpu3D.gpu.rotation.set(0, 0, 0);
      this.gpu3D.gpu.rotation.x = 0;
      this.gpu3D.camera.position.set(0, 0.2, this.gpu3D.config.cameraDistance);
      this.gpu3D.camera.lookAt(0, 0, 0);
      this.gpu3D.controls.autoRotate = true;
      this.gpu3D.controls.wobble = true;
      this.updateButtonState('toggle-rotation', true);
      this.updateButtonState('toggle-wobble', true);
      this.updateButtonState('pause-resume', true);
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
      if (speedSlider) speedSlider.value = normalizedSpeed * 100;
    }
  }
  getStats() {
    return this.gpu3D ? this.gpu3D.getStats() : null;
  }
}

// Inicializar controles quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    window.gpu3DControls = new GPU3DControls();
  }, 500);
});

// Exemplo de uso via console
window.GPU3DExamples = {
  pause: () => window.gpu3DControls?.pause(),
  resume: () => window.gpu3DControls?.resume(),
  setSpeed: (speed) => window.gpu3DControls?.setSpeed(speed),
  getStats: () => window.gpu3DControls?.getStats(),
  reset: () => window.gpu3DControls?.resetView()
};