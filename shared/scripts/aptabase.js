// Note: Consider hosting Aptabase locally or using SRI hash for better security
import { init as initializeAptabase, trackEvent as aptaEvent } from 'https://cdn.jsdelivr.net/npm/@aptabase/web@0.4.3/+esm';

let IS_DEBUG_SESSION = false;

async function _handleAptaEvent(eventName, properties) {
    try {
        aptaEvent(eventName, properties);
    } catch (e) {
        console.error('[Aptabase] Failed to track event:', eventName, e);
    }
}

// Make the function globally available
window.aptabaseEvent = _handleAptaEvent;

document.addEventListener('DOMContentLoaded', async () => {
    const host = window.location.hostname;
    IS_DEBUG_SESSION = host === '127.0.0.1' || host === 'localhost';

    // Helper to fetch JSON with graceful failure
    const fetchJson = async (url) => {
        try {
            const res = await fetch(url, { cache: 'no-store' });
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
            return await res.json();
        } catch (e) {
            return null;
        }
    };

    try {
        // Determine repo base path for GitHub Pages (e.g., '/learn-cisco-devices')
        const repoBase = (window.SPA_CONFIG && window.SPA_CONFIG.REPO_NAME) ? window.SPA_CONFIG.REPO_NAME : '';
        const basePath = repoBase.startsWith('/') ? repoBase : `/${repoBase}`;

        // Try local manifest first (ignored by git), then default manifest
        const localManifest = await fetchJson(`${basePath}/manifest.local.json`);
        const manifest = localManifest || (await fetchJson(`${basePath}/manifest.json`)) || {};

        const version = manifest.Version || 'dev';
        let aptaKey = manifest.Aptabase || 'aptabase_api_key_placeholder';

        // For local development, use environment-based detection
        if (IS_DEBUG_SESSION && aptaKey === 'aptabase_api_key_placeholder') {
            // In local development, analytics are disabled by default
            // Use a proper local development setup instead of URL parameters
            return;
        }

        if (aptaKey === 'aptabase_api_key_placeholder' || !aptaKey) {
            // Aptabase key not available (placeholder). Skipping analytics init.
            return;
        }


        initializeAptabase(aptaKey, {
            isDebug: IS_DEBUG_SESSION,
            appVersion: version
        });
        window.aptabaseReady = true;

        // Track initial page load
        const pageLoadProps = {
            page: window.location.pathname,
            hostname: window.location.hostname,
            user_agent: navigator.userAgent
        };
        
        // Detect if this is a media proxy route and add extra properties
        const pathname = window.location.pathname;
        const cleanPath = pathname.startsWith(basePath) ? pathname.substring(basePath.length) : pathname;
        const mediaMatch = cleanPath.match(/^\/media\/([^\/]+)\/(images|videos)\/(.+)$/);
        
        if (mediaMatch) {
            const [, deployment, mediaType, filename] = mediaMatch;
            const urlParams = new URLSearchParams(window.location.search);
            pageLoadProps.media_proxy = true;
            pageLoadProps.deployment = deployment;
            pageLoadProps.media_type = mediaType;
            pageLoadProps.filename = filename;
            pageLoadProps.source = urlParams.get('source') || 'direct';
            pageLoadProps.referrer = document.referrer || 'none';
        }
        
        window.aptabaseEvent('page_loaded', pageLoadProps);

    } catch (error) {
        console.error('Failed to initialize Aptabase:', error);
    }
});
