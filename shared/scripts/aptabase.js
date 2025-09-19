import { init as initializeAptabase, trackEvent as aptaEvent } from 'https://cdn.jsdelivr.net/npm/@aptabase/web@0.4.3/+esm';

let IS_DEBUG_SESSION = false;

async function _handleAptaEvent(eventName, properties) {
    aptaEvent(eventName, properties);
}

// Make the function globally available
window.aptabaseEvent = _handleAptaEvent;

document.addEventListener('DOMContentLoaded', async () => {
    IS_DEBUG_SESSION = window.location.hostname === '127.0.0.1';
    
    try {
        const manifest = await fetch('./manifest.json').then(r => r.json());
        const version = manifest.Version;
        const aptaKey = manifest.Aptabase;
        
        if (aptaKey === 'aptabase_api_key_placeholder') {
            console.warn('AptaKey Not Available - using placeholder');
            return;
        }
        
        console.log('Initializing Aptabase with version:', version, { isDebug: IS_DEBUG_SESSION });
        
        initializeAptabase(aptaKey, { 
            isDebug: IS_DEBUG_SESSION, 
            appVersion: version 
        });
        
        // Track initial page load
        window.aptabaseEvent('page_loaded', {
            'page': window.location.pathname,
            'hostname': window.location.hostname,
            'user_agent': navigator.userAgent
        });
        
    } catch (error) {
        console.error('Failed to initialize Aptabase:', error);
    }
});
