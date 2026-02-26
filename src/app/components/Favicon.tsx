import { useEffect } from 'react';
import faviconImage from 'figma:asset/8769fd9be3be6c7f16ca4842006ec1dea4465924.png';

export function Favicon() {
  useEffect(() => {
    // Remove any existing favicons
    const existingLinks = document.querySelectorAll('link[rel*="icon"]');
    existingLinks.forEach(link => link.remove());
    
    // Add new favicon using the custom logo
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