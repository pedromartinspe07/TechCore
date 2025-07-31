class TechCoreTerminal {
  constructor() {
    this.output = document.getElementById('terminalOutput');
    this.input = document.getElementById('terminalInput');
    this.commandHistory = [];
    this.historyIndex = -1;
    this.isMatrixMode = false;
    this.isHackerMode = false;
    
    this.commands = {
      help: () => this.showHelp(),
      home: () => this.navigateTo('index.html'),
      cpu: () => this.navigateTo('processadores.html'),
      gpu: () => this.navigateTo('gpus.html'),
      ram: () => this.navigateTo('memoria.html'),
      about: () => this.navigateTo('sobre.html'),
      clear: () => this.clearTerminal(),
      exit: () => this.exitTerminal(),
      matrix: () => this.toggleMatrixMode(),
      hack: () => this.toggleHackerMode(),
      ls: () => this.listFiles(),
      pwd: () => this.showCurrentDirectory(),
      whoami: () => this.showUserInfo(),
      date: () => this.showDate(),
      top: () => this.showSystemStats(),
      neofetch: () => this.showSystemInfo()
    };
    
    this.init();
  }
  
  init() {
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.executeCommand();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigateHistory('up');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.navigateHistory('down');
      }
    });
    
    this.input.focus();
  }
  
  executeCommand() {
    const command = this.input.value.trim().toLowerCase();
    if (command === '') return;
    
    this.addToHistory(command);
    this.printCommand(command);
    
    if (this.commands[command]) {
      this.commands[command]();
    } else {
      this.printError(`Comando não encontrado: ${command}`);
      this.printText('Digite "help" para ver os comandos disponíveis.');
    }
    
    this.input.value = '';
    this.scrollToBottom();
  }
  
  printCommand(command) {
    const line = document.createElement('div');
    line.className = 'output-line';
    line.innerHTML = `<span class="prompt">root@techcore:~$</span> <span class="command">${command}</span>`;
    this.output.appendChild(line);
  }
  
  printText(text, className = 'text') {
    const line = document.createElement('div');
    line.className = 'output-line';
    line.innerHTML = `<span class="${className}">${text}</span>`;
    this.output.appendChild(line);
  }
  
  printError(text) {
    this.printText(text, 'error');
  }
  
  printSuccess(text) {
    this.printText(text, 'success');
  }
  
  printWarning(text) {
    this.printText(text, 'warning');
  }
  
  addToHistory(command) {
    this.commandHistory.push(command);
    this.historyIndex = this.commandHistory.length;
  }
  
  navigateHistory(direction) {
    if (direction === 'up' && this.historyIndex > 0) {
      this.historyIndex--;
      this.input.value = this.commandHistory[this.historyIndex];
    } else if (direction === 'down' && this.historyIndex < this.commandHistory.length - 1) {
      this.historyIndex++;
      this.input.value = this.commandHistory[this.historyIndex];
    } else if (direction === 'down' && this.historyIndex === this.commandHistory.length - 1) {
      this.historyIndex = this.commandHistory.length;
      this.input.value = '';
    }
  }
  
  scrollToBottom() {
    this.output.scrollTop = this.output.scrollHeight;
  }
  
  showHelp() {
    this.printText('TechCore Terminal v1.0 - Sistema de Navegação');
    this.printText('Comandos disponíveis:');
    this.printText('  help     - Mostra esta ajuda');
    this.printText('  home     - Navega para página inicial');
    this.printText('  cpu      - Informações sobre processadores');
    this.printText('  gpu      - Informações sobre GPUs');
    this.printText('  ram      - Informações sobre memória');
    this.printText('  about    - Sobre o projeto');
    this.printText('  clear    - Limpa o terminal');
    this.printText('  exit     - Sair do terminal');
    this.printText('  matrix   - Efeito Matrix');
    this.printText('  hack     - Modo hacker');
    this.printText('  ls       - Lista arquivos');
    this.printText('  pwd      - Mostra diretório atual');
    this.printText('  whoami   - Informações do usuário');
    this.printText('  date     - Data e hora atual');
    this.printText('  top      - Estatísticas do sistema');
    this.printText('  neofetch - Informações do sistema');
  }
  
  navigateTo(page) {
    this.printSuccess(`Navegando para ${page}...`);
    setTimeout(() => {
      window.location.href = page;
    }, 1000);
  }
  
  clearTerminal() {
    this.output.innerHTML = '';
    this.printSuccess('Terminal limpo.');
  }
  
  exitTerminal() {
    this.printWarning('Saindo do terminal...');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  }
  
  toggleMatrixMode() {
    this.isMatrixMode = !this.isMatrixMode;
    if (this.isMatrixMode) {
      this.printSuccess('Modo Matrix ativado!');
      this.startMatrixEffect();
    } else {
      this.printSuccess('Modo Matrix desativado.');
      this.stopMatrixEffect();
    }
  }
  
  toggleHackerMode() {
    this.isHackerMode = !this.isHackerMode;
    const terminal = document.querySelector('.terminal-container');
    
    if (this.isHackerMode) {
      this.printSuccess('Modo Hacker ativado!');
      terminal.classList.add('hacker-mode');
      this.simulateHacking();
    } else {
      this.printSuccess('Modo Hacker desativado.');
      terminal.classList.remove('hacker-mode');
    }
  }
  
  startMatrixEffect() {
    const terminal = document.querySelector('.terminal-body');
    const matrixDiv = document.createElement('div');
    matrixDiv.className = 'matrix-effect';
    matrixDiv.id = 'matrixEffect';
    terminal.appendChild(matrixDiv);
    
    this.matrixInterval = setInterval(() => {
      this.createMatrixChar();
    }, 100);
  }
  
  stopMatrixEffect() {
    const matrixEffect = document.getElementById('matrixEffect');
    if (matrixEffect) {
      matrixEffect.remove();
    }
    if (this.matrixInterval) {
      clearInterval(this.matrixInterval);
    }
  }
  
  createMatrixChar() {
    const matrixEffect = document.getElementById('matrixEffect');
    if (!matrixEffect) return;
    
    const char = document.createElement('div');
    char.className = 'matrix-char';
    char.textContent = String.fromCharCode(0x30A0 + Math.random() * 96);
    char.style.left = Math.random() * 100 + '%';
    char.style.animationDuration = (Math.random() * 2 + 1) + 's';
    
    matrixEffect.appendChild(char);
    
    setTimeout(() => {
      if (char.parentNode) {
        char.remove();
      }
    }, 3000);
  }
  
  simulateHacking() {
    const hackingMessages = [
      'Acessando sistema principal...',
      'Bypassando firewall...',
      'Decriptando dados...',
      'Injetando payload...',
      'Sistema comprometido!',
      'Dados extraídos com sucesso!'
    ];
    
    let i = 0;
    const hackInterval = setInterval(() => {
      if (i < hackingMessages.length) {
        this.printText(hackingMessages[i], 'warning');
        i++;
      } else {
        clearInterval(hackInterval);
        this.printSuccess('Hack concluído!');
      }
    }, 800);
  }
  
  listFiles() {
    this.printText('Listando arquivos do sistema:');
    this.printText('  index.html          - Página principal');
    this.printText('  processadores.html  - Análise de CPUs');
    this.printText('  gpus.html          - Análise de GPUs');
    this.printText('  memoria.html       - Guia de memória');
    this.printText('  sobre.html         - Sobre o projeto');
    this.printText('  terminal.html      - Terminal interativo');
    this.printText('  css/               - Estilos CSS');
    this.printText('  js/                - Scripts JavaScript');
    this.printText('  img/               - Imagens');
    this.printText('  3d/                - Modelos 3D');
  }
  
  showCurrentDirectory() {
    this.printText('/home/techcore/website');
  }
  
  showUserInfo() {
    this.printText('Usuário: root');
    this.printText('Grupo: admin');
    this.printText('UID: 0');
    this.printText('Sistema: TechCore v1.0');
  }
  
  showDate() {
    const now = new Date();
    this.printText(now.toLocaleString('pt-BR'));
  }
  
  showSystemStats() {
    this.printText('=== Estatísticas do Sistema ===');
    this.printText('CPU: Intel Core i7-12700K @ 3.60GHz');
    this.printText('RAM: 32GB DDR4-3200');
    this.printText('GPU: NVIDIA RTX 3080 Ti');
    this.printText('Storage: 1TB NVMe SSD');
    this.printText('Network: 1Gbps Ethernet');
    this.printText('Uptime: 7 dias, 3 horas, 45 minutos');
  }
  
  showSystemInfo() {
    this.printText('╔══════════════════════════════════════╗');
    this.printText('║             TechCore v1.0            ║');
    this.printText('╠══════════════════════════════════════╣');
    this.printText('║ OS: TechCore Linux 2025.1           ║');
    this.printText('║ Kernel: 5.15.0-rc1                 ║');
    this.printText('║ Shell: bash 5.1.16                 ║');
    this.printText('║ Terminal: xterm-256color            ║');
    this.printText('║ CPU: Intel Core i7-12700K (16) @ 3.6GHz ║');
    this.printText('║ GPU: NVIDIA GeForce RTX 3080 Ti     ║');
    this.printText('║ Memory: 32GB / 32GB (100%)         ║');
    this.printText('║ Disk: 1TB / 1TB (100%)             ║');
    this.printText('║ Uptime: 7 days, 3 hours, 45 minutes ║');
    this.printText('╚══════════════════════════════════════╝');
  }
}

// Inicializar terminal quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
  new TechCoreTerminal();
}); 
