const faqData = [
    {
      key: 'PROCESSADOR',
      questions: [
        {
          q: 'O que é um processador e qual a sua função?',
          a: 'O processador (CPU) é o cérebro do computador, responsável por executar tarefas e cálculos.'
        },
        {
          q: 'Quais são os tipos de processadores?',
          a: 'Existem processadores de diferentes núcleos, threads, arquiteturas e soquetes, como Intel e AMD.'
        },
        {
          q: 'Como escolher um processador de PC?',
          a: 'Considere o uso (jogos, trabalho), compatibilidade com placa-mãe e orçamento.'
        }
      ]
    },
    {
      key: 'PLACA MÃE',
      questions: [
        {
          q: 'O que é uma placa-mãe?',
          a: 'É o componente que conecta todos os outros, como CPU, RAM, GPU e armazenamento.'
        },
        {
          q: 'Como escolher a placa-mãe ideal?',
          a: 'Verifique o soquete do processador, tipo de memória suportada e recursos extras.'
        }
      ]
    },
    {
      key: 'PROCESSADOR',
      questions: [
        { q: 'O que é um processador e qual a sua função?', a: 'O processador (CPU) é o cérebro do computador, responsável por executar tarefas e cálculos.' },
        { q: 'Quais são os tipos de processadores?', a: 'Existem processadores de diferentes núcleos, threads, arquiteturas e soquetes, como Intel e AMD.' },
        { q: 'Como escolher um processador de PC?', a: 'Considere o uso (jogos, trabalho), compatibilidade com placa-mãe e orçamento.' }
      ]
    },
    {
      key: 'MEMÓRIA RAM',
      questions: [
        { q: 'O que é memória RAM?', a: 'É a memória temporária do computador, usada para armazenar dados de programas em uso.' },
        { q: 'Quanta RAM eu preciso?', a: 'Para uso básico, 8GB é suficiente. Para jogos e tarefas pesadas, 16GB ou mais é recomendado.' },
        { q: 'Qual a diferença entre DDR3, DDR4 e DDR5?', a: 'DDR4 e DDR5 são mais rápidas e eficientes que DDR3, mas verifique a compatibilidade com a placa-mãe.' }
      ]
    },
    {
      key: 'PLACA DE VÍDEO',
      questions: [
        { q: 'O que é uma placa de vídeo?', a: 'É o componente responsável por processar e exibir gráficos e imagens.' },
        { q: 'Qual a diferença entre placa de vídeo dedicada e integrada?', a: 'A dedicada tem memória e processamento próprios, a integrada usa recursos do processador.' },
        { q: 'Como escolher uma placa de vídeo?', a: 'Considere o tipo de uso (jogos, edição), quantidade de VRAM e compatibilidade com o sistema.' }
      ]
    },
    {
      key: 'SSD',
      questions: [
        { q: 'O que é um SSD?', a: 'É um dispositivo de armazenamento rápido, baseado em memória flash, muito mais veloz que HDs tradicionais.' },
        { q: 'Qual a diferença entre SSD SATA e NVMe?', a: 'NVMe é mais rápido, pois usa o barramento PCIe, enquanto SATA é mais acessível.' },
        { q: 'Vale a pena usar SSD?', a: 'Sim, o SSD acelera o carregamento do sistema e dos programas.' }
      ]
    },
    {
      key: 'HD',
      questions: [
        { q: 'O que é um HD?', a: 'É um disco rígido tradicional, usado para armazenar grandes volumes de dados.' },
        { q: 'Posso usar HD e SSD juntos?', a: 'Sim, use o SSD para o sistema e o HD para arquivos grandes.' }
      ]
    },
    {
      key: 'COOLER',
      questions: [
        { q: 'Para que serve o cooler?', a: 'O cooler resfria o processador e outros componentes, evitando superaquecimento.' },
        { q: 'Preciso de um cooler extra?', a: 'Se for fazer overclock ou se o processador esquentar muito, sim.' }
      ]
    },
    {
      key: 'FONTE',
      questions: [
        { q: 'O que é a fonte de alimentação?', a: 'É o componente que fornece energia elétrica para todo o PC.' },
        { q: 'Como escolher a fonte certa?', a: 'Verifique a potência necessária para seus componentes e escolha marcas confiáveis.' }
      ]
    },
    {
      key: 'GABINETE',
      questions: [
        { q: 'Qual a função do gabinete?', a: 'Abriga e protege todos os componentes do PC, além de ajudar na ventilação.' },
        { q: 'Como escolher o gabinete?', a: 'Considere o tamanho dos componentes, fluxo de ar e espaço para upgrades.' }
      ]
    },
    {
      key: 'FANS',
      questions: [
        { q: 'O que são fans?', a: 'São ventiladores que ajudam a manter o PC refrigerado.' },
        { q: 'Quantos fans devo usar?', a: 'Depende do gabinete e dos componentes, mas geralmente 2 a 4 são suficientes.' }
      ]
    },
    {
      key: 'ENERGIA',
      questions: [
        { q: 'Preciso de estabilizador ou no-break?', a: 'No-break é recomendado para proteger contra quedas de energia, estabilizador não é essencial para fontes modernas.' },
        { q: 'Como proteger meu PC de picos de energia?', a: 'Use filtros de linha ou no-breaks de qualidade.' }
      ]
    },
    {
      key: 'SISTEMA OPERACIONAL',
      questions: [
        { q: 'Qual sistema operacional escolher?', a: 'Windows é o mais comum para jogos, Linux para uso avançado, macOS só em Macs.' },
        { q: 'Posso instalar mais de um sistema operacional?', a: 'Sim, é possível fazer dual boot.' }
      ]
    },
    {
      key: 'SOFTWARES',
      questions: [
        { q: 'Quais softwares são essenciais?', a: 'Antivírus, navegador, pacote Office e programas de acordo com seu uso (edição, jogos, etc).' },
        { q: 'Como saber se um software é compatível?', a: 'Verifique os requisitos mínimos do programa e do sistema operacional.' }
      ]
    }
  ];
  
  let faqTabs = [...faqData];
  
  function renderFAQ() {
    const faqSection = document.getElementById('faq-section');
    faqSection.innerHTML = `
      <div class="faq-container">
        <h2>Perguntas frequentes</h2>
        <div class="faq-tabs" id="faq-tabs">
          ${faqTabs.map((tab, i) => `
            <div class="faq-tab${i === 0 ? ' active' : ''}" draggable="true" data-index="${i}">${tab.key}</div>
          `).join('')}
        </div>
        <div class="faq-content">
          ${faqTabs[0].questions.map(q => `
            <div class="faq-q">
              <div class="faq-q-title">${q.q}<span class="faq-arrow">▼</span></div>
              <div class="faq-q-body" style="display:none;">${q.a}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  
    // Drag and drop
    document.querySelectorAll('.faq-tab').forEach(tab => {
      tab.ondragstart = e => {
        e.dataTransfer.setData('text/plain', tab.dataset.index);
      };
      tab.ondragover = e => e.preventDefault();
      tab.ondrop = e => {
        e.preventDefault();
        const from = +e.dataTransfer.getData('text/plain');
        const to = +tab.dataset.index;
        if (from !== to) {
          const moved = faqTabs.splice(from, 1)[0];
          faqTabs.splice(to, 0, moved);
          renderFAQ();
        }
      };
      tab.onclick = () => {
        document.querySelectorAll('.faq-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const idx = +tab.dataset.index;
        const content = document.querySelector('.faq-content');
        content.innerHTML = faqTabs[idx].questions.map(q => `
          <div class="faq-q">
            <div class="faq-q-title">${q.q}<span class="faq-arrow">▼</span></div>
            <div class="faq-q-body" style="display:none;">${q.a}</div>
          </div>
        `).join('');
        addFAQExpand();
      };
    });
    addFAQExpand();
  }
  
  function addFAQExpand() {
    document.querySelectorAll('.faq-q-title').forEach(title => {
      title.onclick = () => {
        const body = title.nextElementSibling;
        const arrow = title.querySelector('.faq-arrow');
        if (body.style.display === 'none') {
          body.style.display = 'block';
          arrow.textContent = '▲';
        } else {
          body.style.display = 'none';
          arrow.textContent = '▼';
        }
      };
    });
  }
  
  document.addEventListener('DOMContentLoaded', renderFAQ);