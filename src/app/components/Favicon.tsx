import { useEffect } from 'react';

export function Favicon() {
  useEffect(() => {
    // Create a custom WeXlot favicon with gradient blue background and white double chevrons
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" fill="url(#bgGradient)" rx="4"/>
        <g transform="translate(8, 16)">
          <path d="M 0 -6 L 4 0 L 0 6" 
                stroke="white" 
                stroke-width="2.5" 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                fill="none"/>
          <path d="M 5 -6 L 9 0 L 5 6" 
                stroke="white" 
                stroke-width="2.5" 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                fill="none"/>
        </g>
      </svg>
    `;
    
    const faviconDataUri = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    
    // Remove any existing favicons
    const existingLinks = document.querySelectorAll('link[rel*="icon"]');
    existingLinks.forEach(link => link.remove());
    
    // Add new favicon using the custom logo
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = faviconDataUri;
    document.head.appendChild(link);
    
    // Add Apple touch icon
    const appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    appleTouchIcon.href = faviconDataUri;
    document.head.appendChild(appleTouchIcon);
    
    // Update page title if needed
    if (!document.title || document.title === 'Vite App') {
      document.title = 'WeXlot - Integrated Business Platforms';
    }
  }, []);
  
  return null;
}