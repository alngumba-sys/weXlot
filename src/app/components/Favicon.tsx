import { useEffect } from 'react';

export function Favicon() {
  useEffect(() => {
    // WeXlot logo as SVG - white X with dot on dark background
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <rect width="32" height="32" fill="#0a0a0a"/>
        <g transform="translate(16, 16)">
          <path d="M -6 -6 L 6 6 M 6 -6 L -6 6" 
                stroke="white" 
                stroke-width="2.5" 
                stroke-linecap="round" 
                fill="none"/>
          <circle cx="0" cy="0" r="1.5" fill="white"/>
        </g>
      </svg>
    `;
    
    const faviconDataUri = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    
    // Remove any existing favicons
    const existingLinks = document.querySelectorAll('link[rel*="icon"]');
    existingLinks.forEach(link => link.remove());
    
    // Add new favicon using the custom WeXlot logo
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