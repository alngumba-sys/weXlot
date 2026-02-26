import { useEffect } from 'react';

export function Favicon() {
  useEffect(() => {
    // Create a custom WeXlot favicon with blue X and orange accents as SVG
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <rect width="32" height="32" fill="#1e3a8a"/>
        <path d="M8 8 L14 16 L8 24 M18 8 L24 16 L18 24" 
              stroke="#FF4F00" 
              stroke-width="3" 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              fill="none"/>
        <circle cx="16" cy="16" r="2" fill="#FF4F00"/>
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
