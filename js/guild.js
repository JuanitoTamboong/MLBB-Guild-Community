      (function () {
            const indicator = document.getElementById('wifiIndicator');
            if (!indicator) return;

            // Use the browser Network Information API when available.
            // Otherwise fall back to navigator.onLine (poor-quality fallback).
            const setQuality = (quality) => {
                indicator.dataset.quality = quality;
            };

            try {
                const nav = navigator;
                const conn = nav && nav.connection ? nav.connection : nav.mozConnection || nav.webkitConnection;

                if (conn && typeof conn.addEventListener === 'function') {
                    const compute = () => {
                        // Common values: 'slow-2g', '2g', '3g', '4g'
                        const type = conn.effectiveType || '';
                        const down = typeof conn.downlink === 'number' ? conn.downlink : null;

                        // Map to: high=green, medium=yellow, else=red.
                        if (type === '4g') return 'high';
                        if (type === '3g') return 'medium';
                        if (type === '2g') return 'low';
                        if (type === 'slow-2g') return 'low';

                        // Extra heuristic if downlink exists (rough thresholds)
                        if (down != null) {
                            if (down >= 4) return 'high';
                            if (down >= 1.5) return 'medium';
                            return 'low';
                        }

                        // Fallback to online/offline
                        return nav.onLine ? 'medium' : 'low';
                    };

                    setQuality(compute());
                    conn.addEventListener('change', () => setQuality(compute()));
                } else {
                    setQuality(navigator.onLine ? 'medium' : 'low');
                }
            } catch (e) {
                // Last resort
                setQuality(navigator.onLine ? 'medium' : 'low');
            }
        })();