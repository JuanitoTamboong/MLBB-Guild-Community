// loading.js – PROGRESS ANIMATION ON PNG
(function() {
    'use strict';

    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const tipText = document.getElementById('tipText');
    const enterBtn = document.getElementById('enterBtn');
    const loadingImage = document.getElementById('loadingImage');

    const TARGET_URL = './login.html';

    if (!progressFill || !progressText || !tipText || !enterBtn) {
        return;
    }

    // Ancient loading tips - matches your image examples
    const tips = [
        '⚔ Summon your ancient power...',
        '🛡 Forging mystical weapons...',
        '✨ Channeling elder magic...',
        '📜 Decoding ancient runes...',
        '⚡ Awakening the guild spirits...',
        '🔥 Igniting the eternal flame...',
        '🌙 Aligning with the celestial forces...',
        '🗡 Sharpening legendary blades...',
        '🔮 Consulting the oracle...',
        '⚔ Preparing for battle...',
        '🛡 Reinforcing the guild walls...',
        '📜 Unlocking sacred knowledge...',
        '✨ Gathering mystical energy...',
        '⚡ Calling upon the ancients...',
        '🔥 Forging destiny...'
    ];

    let progress = 0;
    let tipIndex = 0;
    let loadingFinished = false;

    function setProgress(value) {
        const v = Math.max(0, Math.min(100, value));
        progressFill.style.width = v + '%';
        progressText.textContent = Math.floor(v) + '%';
    }

    function revealEnter() {
        if (loadingFinished) return;
        loadingFinished = true;
        setProgress(100);
        enterBtn.classList.add('visible');
        // Hide progress elements when complete
        document.querySelector('.progress-bar-container').style.opacity = '0';
        document.querySelector('.loading-tips').style.opacity = '0';
        document.querySelector('.guild-badge-loading').style.opacity = '0';
    }

    function navigateToLogin() {
        window.location.href = TARGET_URL;
    }

    enterBtn.addEventListener('click', navigateToLogin);

    // MAIN PROGRESS UPDATE FUNCTION - THIS IS WHAT MAKES IT MOVE
    function updateProgress() {
        if (loadingFinished) return;

        // Increase progress with each step
        progress += Math.random() * 1.8 + 0.6;

        if (progress >= 100) {
            revealEnter();
            return;
        }

        // Update the UI
        setProgress(progress);

        // Update tip every ~6-8% progress
        const newTipIndex = Math.floor(progress / 6);
        if (newTipIndex > tipIndex && newTipIndex < tips.length) {
            tipIndex = newTipIndex;
            tipText.style.opacity = '0';
            setTimeout(() => {
                tipText.textContent = tips[tipIndex];
                tipText.style.opacity = '1';
            }, 200);
        }

        // Random delay between 80-250ms for natural feel
        const nextDelay = 80 + Math.random() * 170;
        setTimeout(updateProgress, nextDelay);
    }

    // Start the loading animation after a short pause
    setTimeout(() => {
        // Reset UI
        enterBtn.classList.remove('visible');
        document.querySelector('.progress-bar-container').style.opacity = '1';
        document.querySelector('.loading-tips').style.opacity = '1';
        document.querySelector('.guild-badge-loading').style.opacity = '0.6';
        
        // Start the progress animation
        updateProgress();
    }, 600);

    // ============================================
    // PARTICLE EFFECTS
    // ============================================
    function createLoadingParticles() {
        const container = document.querySelector('.loading-container');
        if (!container) return;

        const particleCount = 30;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            const size = 2 + Math.random() * 4;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = 6 + Math.random() * 10;
            const delay = Math.random() * 5;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, rgba(201,168,76,0.35), transparent);
                border-radius: 50%;
                left: ${x}%;
                top: ${y}%;
                animation: floatParticle ${duration}s ease-in-out infinite;
                animation-delay: ${delay}s;
                pointer-events: none;
                z-index: 0;
            `;
            container.appendChild(particle);
        }

        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatParticle {
                0%, 100% {
                    transform: translate(0, 0) scale(1);
                    opacity: 0.15;
                }
                25% {
                    transform: translate(${-15 + Math.random() * 30}px, ${-20 + Math.random() * 40}px) scale(1.6);
                    opacity: 0.5;
                }
                50% {
                    transform: translate(${-30 + Math.random() * 60}px, ${-40 + Math.random() * 80}px) scale(0.7);
                    opacity: 0.2;
                }
                75% {
                    transform: translate(${-15 + Math.random() * 30}px, ${-20 + Math.random() * 40}px) scale(1.4);
                    opacity: 0.4;
                }
            }
        `;
        document.head.appendChild(style);
    }

    createLoadingParticles();

    // ============================================
    // PREVENT SCROLLING
    // ============================================
    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });

})();