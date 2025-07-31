// Overclock Simulator JavaScript
class OverclockSimulator {
    constructor() {
        this.cpuMultiplier = 36;
        this.cpuVoltage = 1.25;
        this.gpuCoreOffset = 0;
        this.gpuMemoryOffset = 0;
        this.powerLimit = 100;
        
        this.baseCPUFreq = 3.6;
        this.baseGPUFreq = 1800;
        this.baseGPUMemoryFreq = 14000;
        
        this.cpuTemp = 45;
        this.gpuTemp = 60;
        this.systemStability = 100;
        
        this.profiles = [
            {
                name: "Balanced",
                cpuMultiplier: 40,
                cpuVoltage: 1.3,
                gpuCoreOffset: 50,
                gpuMemoryOffset: 200,
                powerLimit: 110
            },
            {
                name: "Performance",
                cpuMultiplier: 45,
                cpuVoltage: 1.35,
                gpuCoreOffset: 100,
                gpuMemoryOffset: 500,
                powerLimit: 120
            },
            {
                name: "Extreme",
                cpuMultiplier: 50,
                cpuVoltage: 1.4,
                gpuCoreOffset: 150,
                gpuMemoryOffset: 800,
                powerLimit: 130
            }
        ];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateAllValues();
        this.startMonitoring();
        this.loadProfiles();
    }
    
    setupEventListeners() {
        // CPU Controls
        document.getElementById('cpuMultiplier').addEventListener('input', (e) => {
            this.cpuMultiplier = parseInt(e.target.value);
            this.updateCPUValues();
        });
        
        document.getElementById('cpuVoltage').addEventListener('input', (e) => {
            this.cpuVoltage = parseFloat(e.target.value);
            this.updateCPUValues();
        });
        
        // GPU Controls
        document.getElementById('gpuCoreOffset').addEventListener('input', (e) => {
            this.gpuCoreOffset = parseInt(e.target.value);
            this.updateGPUValues();
        });
        
        document.getElementById('gpuMemoryOffset').addEventListener('input', (e) => {
            this.gpuMemoryOffset = parseInt(e.target.value);
            this.updateGPUValues();
        });
        
        document.getElementById('powerLimit').addEventListener('input', (e) => {
            this.powerLimit = parseInt(e.target.value);
            this.updatePowerValues();
        });
        
        // Action Buttons
        document.getElementById('applyOverclock').addEventListener('click', () => {
            this.applyOverclock();
        });
        
        document.getElementById('resetOverclock').addEventListener('click', () => {
            this.resetOverclock();
        });
        
        document.getElementById('saveProfile').addEventListener('click', () => {
            this.saveProfile();
        });
        
        document.getElementById('stressTest').addEventListener('click', () => {
            this.runStressTest();
        });
    }
    
    updateAllValues() {
        this.updateCPUValues();
        this.updateGPUValues();
        this.updatePowerValues();
        this.updateMonitoring();
    }
    
    updateCPUValues() {
        const currentFreq = (this.baseCPUFreq * this.cpuMultiplier / 36).toFixed(2);
        const currentVoltage = this.cpuVoltage.toFixed(3);
        
        document.getElementById('currentFreq').textContent = `${currentFreq} GHz`;
        document.getElementById('cpuMultiplierValue').textContent = `${this.cpuMultiplier}x`;
        document.getElementById('cpuVoltageValue').textContent = `${currentVoltage}V`;
        
        // Update CPU temperature based on voltage and multiplier
        this.cpuTemp = 45 + (this.cpuVoltage - 1.25) * 50 + (this.cpuMultiplier - 36) * 2;
        document.getElementById('cpuTemp').textContent = `${Math.round(this.cpuTemp)}°C`;
        
        this.addValueUpdateAnimation('currentFreq');
    }
    
    updateGPUValues() {
        const currentCoreFreq = this.baseGPUFreq + this.gpuCoreOffset;
        const currentMemoryFreq = this.baseGPUMemoryFreq + this.gpuMemoryOffset;
        
        document.getElementById('gpuCoreFreq').textContent = `${currentCoreFreq} MHz`;
        document.getElementById('gpuMemoryFreq').textContent = `${currentMemoryFreq} MHz`;
        document.getElementById('gpuCoreOffsetValue').textContent = `+${this.gpuCoreOffset} MHz`;
        document.getElementById('gpuMemoryOffsetValue').textContent = `+${this.gpuMemoryOffset} MHz`;
        
        // Update GPU temperature based on offsets
        this.gpuTemp = 60 + this.gpuCoreOffset * 0.1 + this.gpuMemoryOffset * 0.05;
        document.getElementById('gpuTemp').textContent = `${Math.round(this.gpuTemp)}°C`;
        
        this.addValueUpdateAnimation('gpuCoreFreq');
    }
    
    updatePowerValues() {
        document.getElementById('powerLimitValue').textContent = `${this.powerLimit}%`;
        
        // Calculate power consumption
        const powerConsumption = 150 + (this.powerLimit - 100) * 2;
        document.getElementById('powerConsumption').textContent = `${powerConsumption}W`;
    }
    
    updateMonitoring() {
        // Calculate performance score
        const cpuScore = this.cpuMultiplier * 100;
        const gpuScore = (this.gpuCoreOffset + this.gpuMemoryOffset) * 10;
        const totalScore = cpuScore + gpuScore;
        
        document.getElementById('performanceScore').textContent = totalScore.toLocaleString();
        
        // Update gauges
        this.updateGauge('cpuTempGauge', Math.min(this.cpuTemp / 100, 1));
        this.updateGauge('gpuTempGauge', Math.min(this.gpuTemp / 100, 1));
        this.updateGauge('stabilityGauge', this.systemStability / 100);
        
        // Update stability indicator
        this.updateStabilityIndicator();
        
        // Add critical warning for high temperatures
        this.checkCriticalValues();
    }
    
    updateGauge(gaugeId, value) {
        const gauge = document.getElementById(gaugeId);
        const degrees = value * 360;
        gauge.style.setProperty('--value', `${degrees}deg`);
        
        const gaugeValue = gauge.querySelector('.gauge-value');
        if (gaugeValue) {
            gaugeValue.textContent = `${Math.round(value * 100)}%`;
        }
    }
    
    updateStabilityIndicator() {
        const indicator = document.getElementById('stabilityIndicator');
        const stabilityText = document.getElementById('stabilityText');
        
        if (this.systemStability >= 80) {
            indicator.className = 'stability-indicator stable';
            stabilityText.textContent = 'ESTÁVEL';
        } else if (this.systemStability >= 50) {
            indicator.className = 'stability-indicator warning';
            stabilityText.textContent = 'ATENÇÃO';
        } else {
            indicator.className = 'stability-indicator danger';
            stabilityText.textContent = 'CRÍTICO';
        }
    }
    
    checkCriticalValues() {
        const cpuTempElement = document.getElementById('cpuTemp');
        const gpuTempElement = document.getElementById('gpuTemp');
        
        if (this.cpuTemp > 85) {
            cpuTempElement.classList.add('critical');
        } else {
            cpuTempElement.classList.remove('critical');
        }
        
        if (this.gpuTemp > 85) {
            gpuTempElement.classList.add('critical');
        } else {
            gpuTempElement.classList.remove('critical');
        }
    }
    
    addValueUpdateAnimation(elementId) {
        const element = document.getElementById(elementId);
        element.classList.add('value-update');
        setTimeout(() => {
            element.classList.remove('value-update');
        }, 500);
    }
    
    startMonitoring() {
        setInterval(() => {
            // Simulate temperature fluctuations
            this.cpuTemp += (Math.random() - 0.5) * 2;
            this.gpuTemp += (Math.random() - 0.5) * 1.5;
            
            // Calculate stability based on temperatures and voltages
            this.systemStability = 100;
            
            if (this.cpuTemp > 80) {
                this.systemStability -= (this.cpuTemp - 80) * 2;
            }
            
            if (this.gpuTemp > 80) {
                this.systemStability -= (this.gpuTemp - 80) * 1.5;
            }
            
            if (this.cpuVoltage > 1.4) {
                this.systemStability -= (this.cpuVoltage - 1.4) * 100;
            }
            
            this.systemStability = Math.max(0, Math.min(100, this.systemStability));
            
            this.updateMonitoring();
        }, 2000);
    }
    
    applyOverclock() {
        // Simulate applying overclock settings
        const applyBtn = document.getElementById('applyOverclock');
        const originalText = applyBtn.textContent;
        
        applyBtn.textContent = 'APLICANDO...';
        applyBtn.disabled = true;
        
        setTimeout(() => {
            applyBtn.textContent = 'APLICADO!';
            applyBtn.style.background = '#00ff41';
            applyBtn.style.color = '#000';
            
            setTimeout(() => {
                applyBtn.textContent = originalText;
                applyBtn.disabled = false;
                applyBtn.style.background = '';
                applyBtn.style.color = '';
            }, 2000);
        }, 1500);
    }
    
    resetOverclock() {
        // Reset all values to default
        this.cpuMultiplier = 36;
        this.cpuVoltage = 1.25;
        this.gpuCoreOffset = 0;
        this.gpuMemoryOffset = 0;
        this.powerLimit = 100;
        
        // Update sliders
        document.getElementById('cpuMultiplier').value = this.cpuMultiplier;
        document.getElementById('cpuVoltage').value = this.cpuVoltage;
        document.getElementById('gpuCoreOffset').value = this.gpuCoreOffset;
        document.getElementById('gpuMemoryOffset').value = this.gpuMemoryOffset;
        document.getElementById('powerLimit').value = this.powerLimit;
        
        this.updateAllValues();
        
        // Show reset confirmation
        const resetBtn = document.getElementById('resetOverclock');
        const originalText = resetBtn.textContent;
        resetBtn.textContent = 'RESETADO!';
        resetBtn.style.background = '#00ff41';
        resetBtn.style.color = '#000';
        
        setTimeout(() => {
            resetBtn.textContent = originalText;
            resetBtn.style.background = '';
            resetBtn.style.color = '';
        }, 2000);
    }
    
    saveProfile() {
        const profileName = prompt('Digite o nome do perfil:');
        if (profileName) {
            const newProfile = {
                name: profileName,
                cpuMultiplier: this.cpuMultiplier,
                cpuVoltage: this.cpuVoltage,
                gpuCoreOffset: this.gpuCoreOffset,
                gpuMemoryOffset: this.gpuMemoryOffset,
                powerLimit: this.powerLimit
            };
            
            this.profiles.push(newProfile);
            this.saveProfilesToStorage();
            this.loadProfiles();
            
            // Show save confirmation
            const saveBtn = document.getElementById('saveProfile');
            const originalText = saveBtn.textContent;
            saveBtn.textContent = 'SALVO!';
            saveBtn.style.background = '#00ff41';
            saveBtn.style.color = '#000';
            
            setTimeout(() => {
                saveBtn.textContent = originalText;
                saveBtn.style.background = '';
                saveBtn.style.color = '';
            }, 2000);
        }
    }
    
    loadProfile(profile) {
        this.cpuMultiplier = profile.cpuMultiplier;
        this.cpuVoltage = profile.cpuVoltage;
        this.gpuCoreOffset = profile.gpuCoreOffset;
        this.gpuMemoryOffset = profile.gpuMemoryOffset;
        this.powerLimit = profile.powerLimit;
        
        // Update sliders
        document.getElementById('cpuMultiplier').value = this.cpuMultiplier;
        document.getElementById('cpuVoltage').value = this.cpuVoltage;
        document.getElementById('gpuCoreOffset').value = this.gpuCoreOffset;
        document.getElementById('gpuMemoryOffset').value = this.gpuMemoryOffset;
        document.getElementById('powerLimit').value = this.powerLimit;
        
        this.updateAllValues();
    }
    
    deleteProfile(profileName) {
        if (confirm(`Tem certeza que deseja deletar o perfil "${profileName}"?`)) {
            this.profiles = this.profiles.filter(p => p.name !== profileName);
            this.saveProfilesToStorage();
            this.loadProfiles();
        }
    }
    
    loadProfiles() {
        const profilesGrid = document.getElementById('profilesGrid');
        profilesGrid.innerHTML = '';
        
        this.profiles.forEach(profile => {
            const profileCard = document.createElement('div');
            profileCard.className = 'profile-card';
            
            const cpuFreq = (this.baseCPUFreq * profile.cpuMultiplier / 36).toFixed(2);
            const gpuCoreFreq = this.baseGPUFreq + profile.gpuCoreOffset;
            
            profileCard.innerHTML = `
                <h4>${profile.name}</h4>
                <div class="profile-stats">
                    CPU: ${cpuFreq} GHz<br>
                    GPU: ${gpuCoreFreq} MHz<br>
                    Power: ${profile.powerLimit}%
                </div>
                <div class="profile-actions">
                    <button class="profile-btn" onclick="overclockSimulator.loadProfile(${JSON.stringify(profile).replace(/"/g, '&quot;')})">Carregar</button>
                    <button class="profile-btn delete" onclick="overclockSimulator.deleteProfile('${profile.name}')">Deletar</button>
                </div>
            `;
            
            profilesGrid.appendChild(profileCard);
        });
    }
    
    saveProfilesToStorage() {
        localStorage.setItem('overclockProfiles', JSON.stringify(this.profiles));
    }
    
    loadProfilesFromStorage() {
        const saved = localStorage.getItem('overclockProfiles');
        if (saved) {
            this.profiles = JSON.parse(saved);
        }
    }
    
    runStressTest() {
        const stressBtn = document.getElementById('stressTest');
        const originalText = stressBtn.textContent;
        
        stressBtn.textContent = 'TESTANDO...';
        stressBtn.disabled = true;
        
        // Simulate stress test
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            
            if (progress >= 100) {
                clearInterval(interval);
                stressBtn.textContent = 'COMPLETO!';
                stressBtn.style.background = '#00ff41';
                stressBtn.style.color = '#000';
                
                // Show results
                setTimeout(() => {
                    alert(`Teste de stress concluído!\n\nTemperatura CPU: ${Math.round(this.cpuTemp)}°C\nTemperatura GPU: ${Math.round(this.gpuTemp)}°C\nEstabilidade: ${Math.round(this.systemStability)}%\n\n${this.systemStability >= 80 ? 'Sistema estável!' : 'Sistema instável - reduza os valores!'}`);
                    
                    stressBtn.textContent = originalText;
                    stressBtn.disabled = false;
                    stressBtn.style.background = '';
                    stressBtn.style.color = '';
                }, 1000);
            }
        }, 500);
    }
}

// Initialize the overclock simulator when the page loads
let overclockSimulator;

document.addEventListener('DOMContentLoaded', () => {
    overclockSimulator = new OverclockSimulator();
    overclockSimulator.loadProfilesFromStorage();
});

// Add typing animation to title
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

// Initialize typing animation for the title
document.addEventListener('DOMContentLoaded', () => {
    const title = document.querySelector('.overclock-container h1');
    if (title) {
        typeWriter(title, 'OVERCLOCK SIMULATOR');
    }
}); 
