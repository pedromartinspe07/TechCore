/**
 * Detector de WebGL e Alternativas
 * Verifica se o navegador suporta WebGL e oferece soluções
 */

class WebGLDetector {
  constructor() {
    this.isWebGLSupported = false;
    this.webGLContext = null;
    this.errorMessage = '';
    this.alternatives = [];
  }

  /**
   * Detectar suporte ao WebGL
   */
  detect() {
    try {
      // Tentar criar canvas
      const canvas = document.createElement('canvas');
      
      // Tentar obter contexto WebGL
      this.webGLContext = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (this.webGLContext) {
        this.isWebGLSupported = true;
        console.log('✅ WebGL suportado');
        return true;
      } else {
        this.errorMessage = 'WebGL não disponível neste navegador';
        console.warn('❌ WebGL não suportado');
        return false;
      }
    } catch (error) {
      this.errorMessage = `Erro ao detectar WebGL: ${error.message}`;
      console.error('❌ Erro WebGL:', error);
      return false;
    }
  }

  /**
   * Verificar capacidades específicas
   */
  checkCapabilities() {
    if (!this.webGLContext) return null;

    const capabilities = {
      maxTextureSize: this.webGLContext.getParameter(this.webGLContext.MAX_TEXTURE_SIZE),
      maxViewportDims: this.webGLContext.getParameter(this.webGLContext.MAX_VIEWPORT_DIMS),
      maxRenderbufferSize: this.webGLContext.getParameter(this.webGLContext.MAX_RENDERBUFFER_SIZE),
      vendor: this.webGLContext.getParameter(this.webGLContext.VENDOR),
      renderer: this.webGLContext.getParameter(this.webGLContext.RENDERER),
      version: this.webGLContext.getParameter(this.webGLContext.VERSION),
      shadingLanguageVersion: this.webGLContext.getParameter(this.webGLContext.SHADING_LANGUAGE_VERSION)
    };

    console.log('WebGL Capabilities:', capabilities);
    return capabilities;
  }

  /**
   * Sugerir alternativas
   */
  suggestAlternatives() {
    this.alternatives = [];

    // Verificar se é um navegador conhecido
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('chrome')) {
      this.alternatives.push({
        type: 'browser',
        title: 'Atualizar Chrome',
        description: 'Certifique-se de que está usando a versão mais recente do Chrome',
        action: 'https://www.google.com/chrome/'
      });
    } else if (userAgent.includes('firefox')) {
      this.alternatives.push({
        type: 'browser',
        title: 'Atualizar Firefox',
        description: 'Certifique-se de que está usando a versão mais recente do Firefox',
        action: 'https://www.mozilla.org/firefox/'
      });
    } else if (userAgent.includes('edge')) {
      this.alternatives.push({
        type: 'browser',
        title: 'Atualizar Edge',
        description: 'Certifique-se de que está usando a versão mais recente do Edge',
        action: 'https://www.microsoft.com/edge'
      });
    }

    // Alternativas gerais
    this.alternatives.push(
      {
        type: 'setting',
        title: 'Habilitar Aceleração de Hardware',
        description: 'Vá em Configurações > Sistema > Aceleração de Hardware',
        action: 'settings'
      },
      {
        type: 'setting',
        title: 'Verificar Drivers de Vídeo',
        description: 'Atualize os drivers da sua placa de vídeo',
        action: 'drivers'
      },
      {
        type: 'fallback',
        title: 'Usar Visualização 2D',
        description: 'Alternar para visualização em 2D',
        action: '2d'
      }
    );

    return this.alternatives;
  }

  /**
   * Criar interface de erro
   */
  createErrorInterface() {
    const container = document.querySelector('.gpu-3d-container');
    if (!container) return;

    const errorContainer = document.createElement('div');
    errorContainer.className = 'webgl-error';
    errorContainer.innerHTML = `
      <div class="error-header">
        <div class="error-icon">⚠️</div>
        <h3>WebGL Não Suportado</h3>
      </div>
      <div class="error-message">
        <p>${this.errorMessage}</p>
        <p>O visualizador 3D requer suporte a WebGL para funcionar.</p>
      </div>
      <div class="alternatives-list">
        <h4>Soluções Sugeridas:</h4>
        ${this.alternatives.map(alt => `
          <div class="alternative-item">
            <strong>${alt.title}</strong>
            <p>${alt.description}</p>
            ${alt.action !== '2d' ? `<a href="${alt.action}" target="_blank" class="alt-link">${alt.action === 'settings' ? 'Abrir Configurações' : alt.action === 'drivers' ? 'Verificar Drivers' : 'Saiba Mais'}</a>` : ''}
          </div>
        `).join('')}
      </div>
      <div class="fallback-actions">
        <button id="try-2d-view" class="fallback-btn">Tentar Visualização 2D</button>
        <button id="retry-webgl" class="retry-btn">Tentar Novamente</button>
      </div>
    `;

    container.appendChild(errorContainer);
    this.setupErrorEventListeners();
  }

  /**
   * Configurar event listeners para a interface de erro
   */
  setupErrorEventListeners() {
    // Botão de visualização 2D
    document.getElementById('try-2d-view')?.addEventListener('click', () => {
      this.create2DFallback();
    });

    // Botão de tentar novamente
    document.getElementById('retry-webgl')?.addEventListener('click', () => {
      if (this.detect()) {
        location.reload();
      } else {
        alert('WebGL ainda não está disponível. Tente as soluções sugeridas.');
      }
    });
  }

  /**
   * Criar visualização 2D como fallback
   */
  create2DFallback() {
    const container = document.querySelector('.gpu-3d-container');
    if (!container) return;

    // Remover interface de erro
    const errorContainer = container.querySelector('.webgl-error');
    if (errorContainer) {
      errorContainer.remove();
    }

    // Criar visualização 2D
    container.innerHTML = `
      <div class="gpu-2d-view">
        <div class="gpu-2d-model">
          <div class="gpu-body">
            <div class="gpu-fan"></div>
            <div class="gpu-connectors">
              <div class="connector"></div>
              <div class="connector"></div>
              <div class="connector"></div>
            </div>
          </div>
        </div>
        <div class="gpu-info">
          <h3>NVIDIA GeForce 8800 GT</h3>
          <p>Visualização 2D (WebGL não disponível)</p>
          <div class="gpu-specs">
            <div class="spec-item">
              <strong>Lançamento:</strong> 2007
            </div>
            <div class="spec-item">
              <strong>Processo:</strong> 65nm
            </div>
            <div class="spec-item">
              <strong>Memória:</strong> 512MB GDDR3
            </div>
            <div class="spec-item">
              <strong>Shader Units:</strong> 112
            </div>
          </div>
        </div>
      </div>
    `;

    // Adicionar CSS para a visualização 2D
    this.add2DStyles();
  }

  /**
   * Adicionar estilos para visualização 2D
   */
  add2DStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .gpu-2d-view {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 400px;
        background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
        border: 2px solid #00ff41;
        border-radius: 10px;
        padding: 20px;
        margin: 20px 0;
      }

      .gpu-2d-model {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .gpu-body {
        width: 200px;
        height: 100px;
        background: linear-gradient(45deg, #333 0%, #555 50%, #333 100%);
        border: 2px solid #00ff41;
        border-radius: 10px;
        position: relative;
        box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
        animation: glow 2s ease-in-out infinite alternate;
      }

      .gpu-fan {
        width: 60px;
        height: 60px;
        background: #666;
        border-radius: 50%;
        position: absolute;
        top: 20px;
        left: 70px;
        border: 2px solid #00ff41;
        animation: rotate 3s linear infinite;
      }

      .gpu-fan::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        background: #333;
        border-radius: 50%;
        transform: translate(-50%, -50%);
      }

      .gpu-connectors {
        position: absolute;
        bottom: -15px;
        left: 20px;
        display: flex;
        gap: 10px;
      }

      .connector {
        width: 15px;
        height: 30px;
        background: #222;
        border: 1px solid #00ff41;
        border-radius: 2px;
      }

      .gpu-info {
        flex: 1;
        padding: 20px;
        color: #00ff41;
      }

      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      @keyframes glow {
        from { box-shadow: 0 0 20px rgba(0, 255, 65, 0.3); }
        to { box-shadow: 0 0 30px rgba(0, 255, 65, 0.6); }
      }

      .webgl-error {
        background: rgba(255, 0, 0, 0.1);
        border: 2px solid #ff4444;
        border-radius: 10px;
        padding: 20px;
        margin: 20px 0;
        color: #ff4444;
      }

      .error-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 15px;
      }

      .error-icon {
        font-size: 2em;
      }

      .alternatives-list {
        margin: 20px 0;
      }

      .alternative-item {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid #00ff41;
        border-radius: 5px;
        padding: 10px;
        margin: 10px 0;
      }

      .alt-link {
        color: #00ff41;
        text-decoration: none;
        font-weight: bold;
      }

      .alt-link:hover {
        text-decoration: underline;
      }

      .fallback-actions {
        display: flex;
        gap: 10px;
        margin-top: 20px;
      }

      .fallback-btn, .retry-btn {
        padding: 10px 20px;
        border: 1px solid #00ff41;
        background: transparent;
        color: #00ff41;
        border-radius: 5px;
        cursor: pointer;
        font-family: 'Courier New', monospace;
      }

      .fallback-btn:hover, .retry-btn:hover {
        background: #00ff41;
        color: #000;
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Verificar se o navegador é muito antigo
   */
  isBrowserTooOld() {
    const userAgent = navigator.userAgent;
    
    // Verificar versões antigas
    if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) {
      return true; // Internet Explorer
    }
    
    // Verificar versão do Chrome
    const chromeMatch = userAgent.match(/Chrome\/(\d+)/);
    if (chromeMatch && parseInt(chromeMatch[1]) < 50) {
      return true;
    }
    
    // Verificar versão do Firefox
    const firefoxMatch = userAgent.match(/Firefox\/(\d+)/);
    if (firefoxMatch && parseInt(firefoxMatch[1]) < 45) {
      return true;
    }
    
    return false;
  }
}

// Exportar para uso global
window.WebGLDetector = WebGLDetector; 
