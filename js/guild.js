(function () {
    const indicator = document.getElementById('wifiIndicator');
    if (!indicator) return;

    // Changes dataset properties dynamically based on data stream speed metrics
    const setQuality = (quality) => {
        indicator.dataset.quality = quality;
    };

    try {
        const nav = navigator;
        const conn = nav && nav.connection ? nav.connection : nav.mozConnection || nav.webkitConnection;

        if (conn && typeof conn.addEventListener === 'function') {
            const compute = () => {
                const type = conn.effectiveType || '';
                const down = typeof conn.downlink === 'number' ? conn.downlink : null;

                // Priority maps match requested visual specs
                if (type === '4g') return 'high';
                if (type === '3g') return 'medium';
                if (type === '2g' || type === 'slow-2g') return 'low';

                if (down != null) {
                    if (down >= 4) return 'high';
                    if (down >= 1.5) return 'medium';
                    return 'low';
                }

                return nav.onLine ? 'medium' : 'low';
            };

            setQuality(compute());
            conn.addEventListener('change', () => setQuality(compute()));
        } else {
            setQuality(navigator.onLine ? 'medium' : 'low');
        }
    } catch (e) {
        setQuality(navigator.onLine ? 'medium' : 'low');
    }
})();