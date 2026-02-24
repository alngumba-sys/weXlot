import '../styles/index.css';
import AppWithAdmin from './components/AppWithAdmin';
import { useEffect } from 'react';

export default function App() {
  // Add resource hints for faster loading
  useEffect(() => {
    // Preconnect to Supabase for faster API calls
    const preconnectLink = document.createElement('link');
    preconnectLink.rel = 'preconnect';
    preconnectLink.href = 'https://mtfsrlsccbmrekzthvmw.supabase.co';
    document.head.appendChild(preconnectLink);

    // Preconnect to Google Fonts
    const fontsPreconnect = document.createElement('link');
    fontsPreconnect.rel = 'preconnect';
    fontsPreconnect.href = 'https://fonts.googleapis.com';
    document.head.appendChild(fontsPreconnect);

    const fontsGstaticPreconnect = document.createElement('link');
    fontsGstaticPreconnect.rel = 'preconnect';
    fontsGstaticPreconnect.href = 'https://fonts.gstatic.com';
    fontsGstaticPreconnect.crossOrigin = 'anonymous';
    document.head.appendChild(fontsGstaticPreconnect);
  }, []);

  return <AppWithAdmin />;
}