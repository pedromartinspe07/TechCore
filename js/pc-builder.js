// Dados de exemplo para cada categoria
const cpus = [
  { id: 'r5-5500', name: 'AMD Ryzen 5 5500', img: 'img/cpu/ryzen-5-5500.jpg' },
  { id: 'r5-5600', name: 'AMD Ryzen 5 5600', img: 'img/cpu/ryzen-5-5600.jpeg' },
  { id: 'i5-10400f', name: 'Intel Core i5-10400F', img: 'img/cpu/i5-10400f.jpg' },
  { id: 'i5-12400f', name: 'Intel Core i5-12400F', img: 'img/cpu/i5-12400f.jpg' }
];
const gpus = [
  { id: 'gtx1660', name: 'NVIDIA GTX 1660', img: 'img/gpu/gtx1660.jpeg' },
  { id: 'rtx3060', name: 'NVIDIA RTX 3060', img: 'img/gpu/rtx3060.jpg' },
  { id: 'rx570', name: 'AMD RX 570', img: 'img/gpu/rx570.jpg' },
  { id: 'rx6600', name: 'AMD RX 6600', img: 'img/gpu/rx6600.png' }
];
const motherboards = [
  { id: 'b450', name: 'ASUS B450M', img: 'img/mb/b450m.png' },
  { id: 'b550', name: 'Gigabyte B550M', img: 'img/mb/b550m.jpg' },
  { id: 'h510', name: 'ASRock H510M', img: 'img/mb/h510m.jpg' },
  { id: 'b660', name: 'MSI B660M', img: 'img/mb/b660m.png' }
];
const rams = [
  { id: '8gb', name: '8GB DDR4 3200MHz', img: 'img/ram/8gb.png' },
  { id: '16gb', name: '16GB DDR4 3200MHz', img: 'img/ram/16gb.png' },
  { id: '32gb', name: '32GB DDR4 3200MHz', img: 'img/ram/32gb.png' }
];
const storages = [
  { id: 'hdd', name: '1TB HDD', img: 'img/storage/hdd.jpg' },
  { id: 'ssd', name: '480GB SSD', img: 'img/storage/ssd.jpg' },
  { id: 'nvme', name: '500GB NVMe', img: 'img/storage/nvme.jpg' }
];

const steps = [
  { key: 'cpu', label: 'Processador', list: cpus },
  { key: 'gpu', label: 'Placa de Vídeo', list: gpus },
  { key: 'motherboard', label: 'Placa-mãe', list: motherboards },
  { key: 'ram', label: 'Memória RAM', list: rams },
  { key: 'storage', label: 'Armazenamento', list: storages }
];

let selections = {};
let currentStep = 0;

function renderStep() {
  const step = steps[currentStep];
  const main = document.getElementById('pc-builder-main');
  main.innerHTML = `
    <h1>Monte seu PC</h1>
    <div class="pc-section">
      <h2>Escolha o(a) ${step.label}:</h2>
      <div class="pc-list">
        ${step.list.map(item => `
          <div class="pc-card${selections[step.key] === item.id ? ' selected' : ''}" data-id="${item.id}">
            <img src="${item.img}" alt="${item.name}" />
            <div>
              <span class="pc-type" style="color:#bfffc1; font-size:0.98em;">${step.label}</span><br>
              <span class="pc-label">${item.name}</span>
            </div>
          </div>
        `).join('')}
      </div>
      <button class="pc-next-btn" ${selections[step.key] ? '' : 'disabled'}>${currentStep < steps.length - 1 ? 'Próximo' : 'Finalizar'}</button>
    </div>
  `;
  document.querySelectorAll('.pc-card').forEach(card => {
    card.onclick = () => {
      selections[step.key] = card.getAttribute('data-id');
      renderStep();
    };
  });
  document.querySelector('.pc-next-btn').onclick = () => {
    if (currentStep < steps.length - 1) {
      currentStep++;
      renderStep();
    } else {
      showFPSResult();
    }
  };
}

function showFPSResult() {
  // Simulação simples baseada em combinações
  const cpu = selections.cpu;
  const gpu = selections.gpu;
  const ram = selections.ram;
  const storage = selections.storage;
  let baseFps = 60;
  if (cpu === 'r5-5500' && gpu === 'rtx3060') baseFps = 160;
  else if (cpu === 'i5-10400f' && gpu === 'gtx1660') baseFps = 110;
  else if (cpu === 'r5-5600' && gpu === 'rx6600') baseFps = 140;
  else if (cpu && gpu) baseFps = 80;
  if (ram === '8gb') baseFps *= 0.8;
  if (ram === '32gb') baseFps *= 1.1;
  if (storage === 'nvme') baseFps *= 1.05;
  if (storage === 'hdd') baseFps *= 0.95;
  const games = [
    { name: 'CS:GO', factor: 1.0 },
    { name: 'GTA V', factor: 0.8 },
    { name: 'Fortnite', factor: 0.9 },
    { name: 'Cyberpunk 2077', factor: 0.45 },
    { name: 'Valorant', factor: 1.1 }
  ];
  let html = `<h1>Resultado</h1><div class="fps-result"><b>Estimativa de FPS em jogos populares:</b><br><ul style="margin:12px 0 0 0; padding:0; list-style:none;">`;
  games.forEach(g => {
    const fps = Math.round(baseFps * g.factor);
    html += `<li><b>${g.name}:</b> ${fps} FPS</li>`;
  });
  html += '</ul></div>';
  html += '<button class="pc-next-btn" onclick="location.reload()">Montar outro PC</button>';
  document.getElementById('pc-builder-main').innerHTML = html;
}

document.addEventListener('DOMContentLoaded', renderStep);