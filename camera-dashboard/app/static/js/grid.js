/**
 * Grid polling: periodically fetch /status and update stream img src
 * for cameras transitioning from down to up.
 */

(function() {
    // Track previous status to detect transitions
    let previousStatus = {};

    /**
     * Poll /status every 5000ms (5 seconds).
     * For each camera transitioning from "down" to "up",
     * force reload the img src with a cache-buster query parameter.
     */
    function pollStatus() {
        fetch('/status')
            .then(response => {
                if (!response.ok) {
                    console.error('Failed to fetch /status:', response.status);
                    return null;
                }
                return response.json();
            })
            .then(currentStatus => {
                if (!currentStatus) return;

                // Check each camera for status transitions
                for (const cameraId in currentStatus) {
                    const current = currentStatus[cameraId];
                    const previous = previousStatus[cameraId] || 'unknown';

                    // Transition from down -> up: force reload
                    if (previous === 'down' && current === 'up') {
                        const img = document.querySelector(`img[src*="/stream/${cameraId}"]`);
                        if (img) {
                            // Force reload with cache-buster timestamp
                            img.src = `/stream/${cameraId}?t=${Date.now()}`;
                        }
                    }
                }

                // Update previous status for next poll
                previousStatus = currentStatus;
            })
            .catch(error => {
                console.error('Error polling /status:', error);
            });
    }

    // Start polling when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setInterval(pollStatus, 5000);
        });
    } else {
        // DOM already loaded
        setInterval(pollStatus, 5000);
    }
})();
