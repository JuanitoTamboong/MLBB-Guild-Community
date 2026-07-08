// loading.js – LOADING SCREEN WITH PROGRESS ON PNG
(function() {
    'use strict';

    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const tipText = document.getElementById('tipText');
    const enterBtn = document.getElementById('enterBtn');

    const TARGET_URL = './login.html';

    if (!progressFill || !progressText || !tipText || !enterBtn) {
        return;
    }

    // Ancient loading tips
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
        enterBtn.style.zIndex = '2';
        // Hide the progress bar when complete
        document.querySelector('.progress-bar').style.opacity = '0';
    }

    function navigateToLogin() {
        window.location.href = TARGET_URL;
    }

    enterBtn.addEventListener('click', navigateToLogin);

    function updateProgress() {
        if (loadingFinished) return;

        progress += Math.random() * 2 + 0.5;

        if (progress >= 100) {
            revealEnter();
            return;
        }

        setProgress(progress);

        if (Math.floor(progress / 8) > tipIndex) {
            tipIndex = Math.floor(progress / 8);
            if (tipIndex < tips.length) {
                tipText.style.opacity = '0';
                setTimeout(() => {
                    tipText.textContent = tips[tipIndex];
                    tipText.style.opacity = '1';
                }, 300);
            }
        }

        const nextDelay = 80 + Math.random() * 200;
        setTimeout(updateProgress, nextDelay);
    }

    // Start loading
    setTimeout(() => {
        enterBtn.classList.remove('visible');
        document.querySelector('.progress-bar').style.opacity = '1';
        updateProgress();
    }, 500);

    // Particle effects
    function createLoadingParticles() {
        const container = document.querySelector('.loading-container');
        if (!container) return;

        const particleCount = 25;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${2 + Math.random() * 4}px;
                height: ${2 + Math.random() * 4}px;
                background: radial-gradient(circle, rgba(201,168,76,0.3), transparent);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: floatParticle ${5 + Math.random() * 10}s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
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
                    transform: translate(${-20 + Math.random() * 40}px, ${-30 + Math.random() * 60}px) scale(1.5);
                    opacity: 0.5;
                }
                50% {
                    transform: translate(${-40 + Math.random() * 80}px, ${-60 + Math.random() * 120}px) scale(0.8);
                    opacity: 0.25;
                }
                75% {
                    transform: translate(${-20 + Math.random() * 40}px, ${-30 + Math.random() * 60}px) scale(1.3);
                    opacity: 0.4;
                }
            }
        `;
        document.head.appendChild(style);
    }

    createLoadingParticles();

})();