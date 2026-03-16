import { useEffect } from 'react';
import faviconImage from 'figma:asset/b3caa8ba645b5a07a6be2f2551285362bb332bc1.png';

export function Favicon() {
  useEffect(() => {
    // Remove any existing favicons
    const existingLinks = document.querySelectorAll('link[rel*="icon"]');
    existingLinks.forEach(link => link.remove());
    
    // Add new favicon using the custom WeXlot logo
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = faviconImage;
    document.head.appendChild(link);
    
    // Add Apple touch icon
    const appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    appleTouchIcon.href = faviconImage;
    document.head.appendChild(appleTouchIcon);
    
    // Update page title if needed
    if (!document.title || document.title === 'Vite App') {
      document.title = 'WeXlot - Integrated Business Platforms';
    }
  }, []);
  
  return null;
}