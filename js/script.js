// Configuração de tema escuro para Chart.js
Chart.defaults.color = '#00ff41';
Chart.defaults.borderColor = '#00ff41';
Chart.defaults.backgroundColor = 'rgba(0, 255, 65, 0.1)';

const years = Array.from({length: 22}, (_, i) => 2004 + i);

const desktopData = {
  labels: years,
  datasets: [
    {
      label: "Intel",
      data: [80, 82, 83, 82, 80, 78, 76, 75, 72, 70, 68, 65, 60, 58, 55, 53, 50, 47, 45, 43, 40, 38],
      borderColor: "#0071c5",
      backgroundColor: "rgba(0, 113, 197, 0.1)",
      fill: true,
      tension: 0.4,
      borderWidth: 3,
    },
    {
      label: "AMD",
      data: [20, 18, 17, 18, 20, 22, 24, 25, 27, 29, 32, 35, 38, 40, 43, 45, 47, 50, 53, 55, 57, 59],
      borderColor: "#ff4c00",
      backgroundColor: "rgba(255, 76, 0, 0.1)",
      fill: true,
      tension: 0.4,
      borderWidth: 3,
    },
    {
      label: "Apple",
      data: Array(22).fill(0),
      borderColor: "#888888",
      borderDash: [5, 5],
      fill: false,
      borderWidth: 2,
    },
    {
      label: "Qualcomm",
      data: Array(18).fill(0).concat([1, 1.5, 2, 2.5]),
      borderColor: "#34c759",
      backgroundColor: "rgba(52, 199, 89, 0.1)",
      fill: true,
      tension: 0.4,
      borderWidth: 2,
    },
  ],
};

const laptopData = {
  labels: years,
  datasets: [
    {
      label: "Intel",
      data: [85, 86, 87, 87, 86, 85, 83, 82, 80, 77, 75, 72, 70, 67, 63, 60, 57, 54, 50, 47, 45, 42],
      borderColor: "#0071c5",
      backgroundColor: "rgba(0, 113, 197, 0.1)",
      fill: true,
      tension: 0.4,
      borderWidth: 3,
    },
    {
      label: "AMD",
      data: [15, 14, 13, 13, 14, 15, 17, 18, 20, 23, 25, 28, 30, 32, 34, 35, 37, 38, 40, 42, 43, 44],
      borderColor: "#ff4c00",
      backgroundColor: "rgba(255, 76, 0, 0.1)",
      fill: true,
      tension: 0.4,
      borderWidth: 3,
    },
    {
      label: "Apple",
      data: Array(16).fill(0).concat([5, 10, 15, 20, 25, 30]),
      borderColor: "#000000",
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      fill: true,
      tension: 0.4,
      borderWidth: 3,
    },
  ],
};

// Configurações comuns para os gráficos
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#00ff41',
        font: {
          family: 'Courier New',
          size: 12,
          weight: 'bold'
        },
        usePointStyle: true,
        padding: 20
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      titleColor: '#00ff41',
      bodyColor: '#ffffff',
      borderColor: '#00ff41',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      titleFont: {
        family: 'Courier New',
        size: 14,
        weight: 'bold'
      },
      bodyFont: {
        family: 'Courier New',
        size: 12
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(0, 255, 65, 0.2)',
        borderColor: '#00ff41'
      },
      ticks: {
        color: '#00ff41',
        font: {
          family: 'Courier New',
          size: 11
        }
      }
    },
    y: {
      grid: {
        color: 'rgba(0, 255, 65, 0.2)',
        borderColor: '#00ff41'
      },
      ticks: {
        color: '#00ff41',
        font: {
          family: 'Courier New',
          size: 11
        },
        callback: function(value) {
          return value + '%';
        }
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index'
  },
  elements: {
    point: {
      radius: 4,
      hoverRadius: 6,
      backgroundColor: '#00ff41'
    }
  }
};

// Criar gráfico de desktop
new Chart(document.getElementById("desktopChart"), {
  type: "line",
  data: desktopData,
  options: {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        display: true,
        text: "Participação de Mercado - Processadores para Desktop",
        color: '#00ff41',
        font: {
          family: 'Courier New',
          size: 16,
          weight: 'bold'
        },
        padding: 20
      },
    },
  },
});

// Criar gráfico de laptop
new Chart(document.getElementById("laptopChart"), {
  type: "line",
  data: laptopData,
  options: {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        display: true,
        text: "Participação de Mercado - Processadores para Laptops",
        color: '#00ff41',
        font: {
          family: 'Courier New',
          size: 16,
          weight: 'bold'
        },
        padding: 20
      },
    },
  },
});

// Efeito de digitação para títulos
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = '';
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Aplicar efeito de digitação aos títulos quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
  const titles = document.querySelectorAll('h1, h2');
  titles.forEach((title, index) => {
    const originalText = title.textContent;
    setTimeout(() => {
      typeWriter(title, originalText, 50);
    }, index * 500);
  });
  
  // Adicionar efeito de hover nos cards
  const cards = document.querySelectorAll('.info-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
});

// Animação de scroll suave para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

const toggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

toggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});
