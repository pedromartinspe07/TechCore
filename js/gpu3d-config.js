/**
 * Configuração do Visualizador 3D da GPU
 * Ajuste estas configurações conforme necessário
 */

window.GPU3DConfig = {
  // Caminho do modelo 3D (ajuste conforme sua estrutura de arquivos)
  modelPath: '3d/gpu8800gt.glb',
  
  // Configurações visuais
  backgroundColor: 0x0a0a0a,
  primaryColor: 0x00ff41,
  
  // Configurações de animação
  rotationSpeed: 0.01,
  wobbleSpeed: 0.001,
  wobbleAmplitude: 0.08,
  
  // Configurações da câmera
  scale: 5,
  cameraDistance: 3.5,
  fov: 60,
  
  // Configurações de performance
  enableShadows: true,
  maxPixelRatio: 2,
  
  // Configurações de fallback
  useFallbackOnError: true,
  fallbackDelay: 1000, // ms para tentar carregar antes do fallback
  
  // URLs alternativas para o modelo (se a principal falhar)
  alternativePaths: [
    './3d/gpu8800gt.glb',
    '../3d/gpu8800gt.glb',
    '/3d/gpu8800gt.glb'
  ],
  
  // Configurações de debug
  debug: true,
  logLevel: 'info', // 'error', 'warn', 'info', 'debug'
  
  // Verificar se estamos em desenvolvimento
  isDevelopment: window.location.hostname === 'localhost' || 
                 window.location.hostname === '127.0.0.1' ||
                 window.location.protocol === 'file:',
  
  // Função para obter o caminho correto do modelo
  getModelPath: function() {
    // Se estiver em desenvolvimento, tentar caminhos alternativos
    if (this.isDevelopment) {
      console.log('Modo desenvolvimento detectado');
    }
    
    return this.modelPath;
  },
  
  // Função para verificar se o arquivo existe
  checkFileExists: async function(path) {
    try {
      const response = await fetch(path, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.warn(`Arquivo não encontrado: ${path}`, error.message);
      return false;
    }
  },
  
  // Função para encontrar o primeiro arquivo disponível
  findAvailableModel: async function() {
    const paths = [this.modelPath, ...this.alternativePaths];
    
    for (const path of paths) {
      console.log(`Verificando: ${path}`);
      if (await this.checkFileExists(path)) {
        console.log(`Modelo encontrado em: ${path}`);
        return path;
      }
    }
    
    console.warn('Nenhum modelo encontrado, usando fallback');
    return null;
  }
};

// Log de configuração
if (GPU3DConfig.debug) {
  console.log('GPU3D Config carregado:', GPU3DConfig);
} 
