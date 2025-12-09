#!/usr/bin/env node

// Simple development server for SPA with proper routing
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  // Parse URL to remove query string for file lookup
  let urlPath = req.url.split('?')[0];
  
  // Strip /learn-cisco-devices prefix for local development
  if (urlPath.startsWith('/learn-cisco-devices')) {
    urlPath = urlPath.substring('/learn-cisco-devices'.length) || '/';
  }
  
  // Determine file path
  let filePath = path.join(ROOT_DIR, urlPath);
  
  // If path is a directory or doesn't exist, serve index.html (SPA routing)
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    // For SPA routing, serve index.html for non-existent routes
    // Special case: Media proxy routes are SPA routes for analytics tracking
    // - /media/ (legacy)
    // - /videos/, /images/ (simplified and hierarchical with type prefix)
    // - /{deployment}/{device}/{file.ext} (new hierarchical without type prefix)
    // - /{deployment}/{device}/{name} (extension-less, auto-detects file type)
    const ext = path.extname(urlPath);
    const isLegacyMediaProxy = urlPath.startsWith('/media/');
    const isTypePrefixMediaProxy = urlPath.startsWith('/videos/') || urlPath.startsWith('/images/');
    
    // Check if this is a new hierarchical media route: /{deployment}/{device}/{file.ext}
    // Pattern: /mtr/navigator/filename.webm
    const isNewHierarchicalMedia = ext && (ext === '.webm' || ext === '.mp4' || ext === '.png' || 
                                            ext === '.jpg' || ext === '.jpeg' || ext === '.gif') &&
                                   urlPath.split('/').length === 4; // /deployment/device/file.ext
    
    // Check if this is an extension-less media route: /{deployment}/{device}/{name}
    // Pattern: /mtr/navigator/schedule_teams (no extension)
    const pathParts = urlPath.split('/').filter(p => p);
    const isExtensionlessMedia = !ext && pathParts.length === 3 && 
                                  !['index.html', 'config', 'shared', 'deployments', 'docs'].includes(pathParts[0]);
    
    const isMediaProxyRoute = isLegacyMediaProxy || isTypePrefixMediaProxy || isNewHierarchicalMedia || isExtensionlessMedia;
    
    if (!ext || ext === '.html' || isMediaProxyRoute) {
      filePath = path.join(ROOT_DIR, 'index.html');
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
  }
  
  // Determine content type
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  
  // Read and serve file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
      return;
    }
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Development server running at http://localhost:${PORT}/`);
  console.log('Press Ctrl+C to stop');
});
