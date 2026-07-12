(function () {
    const indicator = document.getElementById('wifiIndicator');
    const msValueElement = document.getElementById('msValue');
    if (!indicator || !msValueElement) return;

    /**
     * Updates colors and text layout based on the network values.
     */
    const updateNetworkUI = (pingMs) => {
        msValueElement.textContent = `${pingMs} ms`;
        
        // Exact latency bracket thresholds matching classic game systems
        if (pingMs <= 60) {
            indicator.dataset.quality = "high";   // Green
        } else if (pingMs <= 150) {
            indicator.dataset.quality = "medium"; // Yellow
        } else {
            indicator.dataset.quality = "low";    // Red
        }
    };

    /**
     * Measures the true round-trip structural latency using the High-Resolution Performance Timeline.
     */
    const calculateRealPing = async () => {
        const startTime = performance.now();
        
        try {
            // Generates a unique parameter token to bypass internal browser caching
            const cacheBuster = `?t=${Date.now()}`;
            
            // Fires a lightweight header-only check to your index page to get real latency
            await fetch(`./index.html${cacheBuster}`, { 
                method: 'HEAD', 
                cache: 'no-store',
                signal: AbortSignal.timeout(2000)
            });

            const endTime = performance.now();
            const actualLatency = Math.round(endTime - startTime);
            updateNetworkUI(actualLatency);

        } catch (error) {
            // Handles connection drops or severe lag spikes smoothly
            msValueElement.textContent = "999 ms";
            indicator.dataset.quality = "low";
        }
    };

    // ---- Stabilization (prevents UI jitter/layout shift) ----
    // Smooth the displayed ping and avoid DOM updates for tiny changes.
    // This makes the wifi bar feel steady even if the network ping fluctuates.
    let displayedPing = null;
    let ema = null; // exponential moving average

    const SMOOTHING_ALPHA = 0.25; // lower = smoother
    const UPDATE_MIN_DELTA = 3;  // only update text if change >= 3ms

    // Wrap existing updater with smoothing + thresholded DOM writes.
    const updateNetworkUIStable = (rawPingMs) => {
        const pingMs = Number.isFinite(rawPingMs) ? rawPingMs : 999;

        // Initialize
        if (ema === null) {
            ema = pingMs;
            displayedPing = Math.round(ema);
            updateNetworkUI(displayedPing);
            return;
        }

        // EMA smoothing
        ema = (SMOOTHING_ALPHA * pingMs) + ((1 - SMOOTHING_ALPHA) * ema);
        const nextDisplayed = Math.round(ema);

        // Avoid frequent text changes that trigger reflow
        const prevDisplayed = displayedPing;
        if (prevDisplayed === null || Math.abs(nextDisplayed - prevDisplayed) >= UPDATE_MIN_DELTA) {
            displayedPing = nextDisplayed;
            updateNetworkUI(nextDisplayed);
        }
    };

    // Use stable updater by reusing the existing function body
    // (we keep calculateRealPing as const to avoid runtime errors)
    const calculateRealPingStable = async () => {
        const startTime = performance.now();
        try {
            const cacheBuster = `?t=${Date.now()}`;
            await fetch(`./index.html${cacheBuster}`, {
                method: 'HEAD',
                cache: 'no-store',
                signal: AbortSignal.timeout(2000)
            });
            const endTime = performance.now();
            const actualLatency = Math.round(endTime - startTime);
            updateNetworkUIStable(actualLatency);
        } catch (error) {
            msValueElement.textContent = '999 ms';
            indicator.dataset.quality = 'low';
        }
    };

    // Starts checking latency immediately and updates at a fixed interval
    // Use the stable version (no raw text updates on every measurement)
    calculateRealPingStable();
    setInterval(calculateRealPingStable, 2000);
})();
