// loading.js – PROGRESS ANIMATION ON PNG
(function() {
    'use strict';

    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const tipText = document.getElementById('tipText');
    const enterBtn = document.getElementById('enterBtn');

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
        // Hide progress elements when complete
        const progressBarContainer = document.querySelector('.progress-bar-container');
        const loadingTips = document.querySelector('.loading-tips');
        const guildBadge = document.querySelector('.guild-badge-loading');
        if (progressBarContainer) progressBarContainer.style.opacity = '0';
        if (loadingTips) loadingTips.style.opacity = '0';
        if (guildBadge) guildBadge.style.opacity = '0';
    }

    function revealLoginView() {
        const audio = document.getElementById('bgMusic');

        // Sound: must be triggered by the click gesture before navigation.
        if (audio) {
            audio.volume = 0.9;
            audio.loop = true;

            const playPromise = audio.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => {
                    // Retry if browser still blocks autoplay.
                    const retry = () => {
                        audio.play().catch(() => {});
                        document.removeEventListener('click', retry);
                        document.removeEventListener('touchstart', retry);
                    };
                    document.addEventListener('click', retry, { passive: true, once: true });
                    document.addEventListener('touchstart', retry, { passive: true, once: true });
                });
            }
        }

        // Navigate to dedicated login page.
        window.location.href = './login.html';
    }

    enterBtn.addEventListener('click', revealLoginView);


    // MAIN PROGRESS UPDATE - SMOOTH AND NATURAL
    function updateProgress() {
        if (loadingFinished) return;

        // Increase progress with each step
        progress += Math.random() * 1.5 + 0.8;

        if (progress >= 100) {
            revealEnter();
            return;
        }

        // Update the UI
        setProgress(progress);

        // Update tip every ~6-8% progress
        const newTipIndex = Math.floor(progress / 6.5);
        if (newTipIndex > tipIndex && newTipIndex < tips.length) {
            tipIndex = newTipIndex;
            tipText.style.opacity = '0';
            setTimeout(() => {
                tipText.textContent = tips[tipIndex];
                tipText.style.opacity = '1';
            }, 200);
        }

        // Random delay for natural feel
        const nextDelay = 70 + Math.random() * 160;
        setTimeout(updateProgress, nextDelay);
    }

    // Start the loading animation
    setTimeout(() => {
        // Reset UI
        enterBtn.classList.remove('visible');
        const progressBarContainer = document.querySelector('.progress-bar-container');
        const loadingTips = document.querySelector('.loading-tips');
        const guildBadge = document.querySelector('.guild-badge-loading');
        if (progressBarContainer) progressBarContainer.style.opacity = '1';
        if (loadingTips) loadingTips.style.opacity = '1';
        if (guildBadge) guildBadge.style.opacity = '0.6';
        
        // Start the progress animation
        updateProgress();
    }, 500);

    // ============================================
    // PARTICLE EFFECTS - Subtle background
    // ============================================
    function createLoadingParticles() {
        const container = document.querySelector('.loading-container');
        if (!container) return;

        const particleCount = 25;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            const size = 2 + Math.random() * 3.5;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, rgba(201,168,76,0.25), transparent);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: floatParticle ${7 + Math.random() * 12}s ease-in-out infinite;
                animation-delay: ${Math.random() * 6}s;
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
                    opacity: 0.1;
                }
                25% {
                    transform: translate(${-10 + Math.random() * 20}px, ${-15 + Math.random() * 30}px) scale(1.5);
                    opacity: 0.4;
                }
                50% {
                    transform: translate(${-20 + Math.random() * 40}px, ${-30 + Math.random() * 60}px) scale(0.7);
                    opacity: 0.15;
                }
                75% {
                    transform: translate(${-10 + Math.random() * 20}px, ${-15 + Math.random() * 30}px) scale(1.3);
                    opacity: 0.3;
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