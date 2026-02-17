import { useState, useEffect, useRef } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AdminPanel } from './AdminPanel';
import { getAllImages } from '../../lib/supabase';

export default function AppWithAdmin() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isContactDropdownOpen, setIsContactDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const contactDropdownRef = useRef<HTMLDivElement>(null);
  const whoWeAreRef = useRef<HTMLDivElement>(null);
  const whyUsRef = useRef<HTMLDivElement>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Default fallback image URLs
  const defaultImages = {
    workspaceImage: "https://images.unsplash.com/photo-1630283018262-d0df4afc2fef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2UlMjBidXNpbmVzcyUyMGRlc2t8ZW58MXx8fHwxNzcxMzIxODE3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    logo: "https://via.placeholder.com/67x67/FF4F00/FFFFFF?text=WeXlot",
    scissorUpLogo: "https://via.placeholder.com/199x79/666666/FFFFFF?text=ScissorUp",
    pillsUpLogo: "https://via.placeholder.com/161x79/666666/FFFFFF?text=PillsUp",
    smartLenderUpLogo: "https://via.placeholder.com/161x79/666666/FFFFFF?text=SmartLender",
    tillsUpLogo: "https://via.placeholder.com/128x79/666666/FFFFFF?text=TillsUp",
    philosophyImage: "https://images.unsplash.com/photo-1609619385076-36a873425636?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHRoaW5raW5nJTIwaW5ub3ZhdGlvbiUyMGxpZ2h0YnVsYnxlbnwxfHx8fDE3NzEzMjE4MTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  };

  // State for images - Initialize with cached images if available
  const [images, setImages] = useState(() => {
    // Try to load cached images from localStorage first
    const cached = localStorage.getItem('wexlot-images');
    if (cached) {
      try {
        const parsedCache = JSON.parse(cached);
        console.log('[CACHE] Loading images from localStorage:', parsedCache);
        return parsedCache;
      } catch (e) {
        console.error('[CACHE] Failed to parse cached images:', e);
      }
    }
    return defaultImages;
  });

  // Load images from Supabase on mount
  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    console.log('[' + new Date().toLocaleTimeString() + '] Loading images from Supabase...');
    const supabaseImages = await getAllImages();
    console.log('[' + new Date().toLocaleTimeString() + '] Loaded images from Supabase:', supabaseImages);
    
    const newImages = {
      workspaceImage: supabaseImages.workspaceImage || defaultImages.workspaceImage,
      logo: supabaseImages.logo || defaultImages.logo,
      scissorUpLogo: supabaseImages.scissorUpLogo || defaultImages.scissorUpLogo,
      pillsUpLogo: supabaseImages.pillsUpLogo || defaultImages.pillsUpLogo,
      smartLenderUpLogo: supabaseImages.smartLenderUpLogo || defaultImages.smartLenderUpLogo,
      tillsUpLogo: supabaseImages.tillsUpLogo || defaultImages.tillsUpLogo,
      philosophyImage: supabaseImages.philosophyImage || defaultImages.philosophyImage,
    };
    
    console.log('[' + new Date().toLocaleTimeString() + '] Setting images state to:', newImages);
    
    // Save to localStorage for instant loading on next visit
    try {
      localStorage.setItem('wexlot-images', JSON.stringify(newImages));
      console.log('[CACHE] Saved images to localStorage');
    } catch (e) {
      console.error('[CACHE] Failed to save images to localStorage:', e);
    }
    
    setImages(newImages);
  };

  const handleLogoClick = () => {
    setLogoClickCount(prev => prev + 1);
    
    // Clear previous timeout
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    
    // Reset counter after 2 seconds of no clicks
    clickTimeoutRef.current = setTimeout(() => {
      setLogoClickCount(0);
    }, 2000);
    
    // Open admin panel after 5 clicks
    if (logoClickCount + 1 >= 5) {
      setIsAdminOpen(true);
      setLogoClickCount(0);
    }
  };

  const handleImagesUpdated = () => {
    loadImages();
  };

  const platforms = [
    {
      name: 'Barbershop & Salons',
      logo: images.scissorUpLogo,
      url: 'https://scissorup.com/',
      logoClass: 'w-[120px]'
    },
    {
      name: 'Loans Platform',
      logo: images.smartLenderUpLogo,
      url: 'https://smartlenderup.com/',
      logoClass: 'w-[100px]'
    },
    {
      name: 'POS Platform',
      logo: images.tillsUpLogo,
      url: 'http://www.tillsup.com/',
      logoClass: 'w-[90px]'
    },
    {
      name: 'Pharmacy Platform',
      logo: images.pillsUpLogo,
      url: 'https://pillsup.com/',
      logoClass: 'w-[100px]'
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (contactDropdownRef.current && !contactDropdownRef.current.contains(event.target as Node)) {
        setIsContactDropdownOpen(false);
      }
    };

    if (isDropdownOpen || isContactDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, isContactDropdownOpen]);

  const scrollToWhoWeAre = () => {
    whoWeAreRef.current?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const scrollToWhyUs = () => {
    whyUsRef.current?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Admin Panel */}
      <AdminPanel 
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onImagesUpdated={handleImagesUpdated}
      />

      {/* Header */}
      <header className="flex justify-between items-center gap-4 px-4 sm:px-8 md:px-16 lg:px-24 py-3 relative">
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-[#868686] hover:text-[#FF4F00] transition-colors z-50"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex ml-auto items-center gap-6">
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="hover:text-[#FF4F00] transition-colors font-[Lexend] font-medium text-[#ff4f01] text-[14px]"
            >
              Book a Demo
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-64 z-50">
                <div className="px-4 py-2 text-sm text-[#999] font-[Lexend] border-b border-gray-100">
                  Select a platform:
                </div>
                {platforms.map((platform, index) => (
                  <a
                    key={index}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <div className="flex items-center justify-center w-24 h-12">
                      <ImageWithFallback 
                        src={platform.logo}
                        alt={platform.name}
                        className={`${platform.logoClass} h-auto object-contain`}
                      />
                    </div>
                    <span className="text-sm font-[Mallanna] text-[#666]">
                      {platform.name}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
          
          <button 
            onClick={scrollToWhoWeAre}
            className="text-[#868686] hover:text-[#FF4F00] transition-colors font-[Lexend] font-medium text-[14px]"
          >
            Who We Are
          </button>
          
          <button 
            onClick={scrollToWhyUs}
            className="text-[#868686] hover:text-[#FF4F00] transition-colors font-[Lexend] font-medium text-[14px]"
          >
            Why us
          </button>
          
          <div className="relative" ref={contactDropdownRef}>
            <button 
              onClick={() => setIsContactDropdownOpen(!isContactDropdownOpen)}
              className="text-[#868686] hover:text-[#FF2200] transition-colors font-[Lexend] font-medium text-[14px]"
            >
              Contact us
            </button>
            
            {isContactDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-3 w-80 z-50">
                <div className="px-4 py-2 text-sm text-[#999] font-[Lexend] border-b border-gray-100 mb-2">
                  Get in touch with us:
                </div>
                
                <div className="px-4 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#FF4F00] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="text-xs font-[Lexend] font-semibold text-[#666] mb-1">Telephone</p>
                      <a href="tel:+254712000000" className="text-sm font-[Mallanna] text-[#666] hover:text-[#FF4F00] transition-colors">
                        +254 712 000 000
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="px-4 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#FF4F00] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-xs font-[Lexend] font-semibold text-[#666] mb-1">Email</p>
                      <a href="mailto:info@wexlot.com" className="text-sm font-[Mallanna] text-[#666] hover:text-[#FF4F00] transition-colors">
                        info@wexlot.com
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="px-4 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#FF4F00] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-xs font-[Lexend] font-semibold text-[#666] mb-1">Location</p>
                      <p className="text-sm font-[Mallanna] text-[#666] leading-relaxed">
                        3rd Floor, 14 Riverside Drive,<br />
                        Cavendish block, Westlands
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="px-4 py-3 border-t border-gray-100 mt-2">
                  <p className="text-xs font-[Lexend] font-semibold text-[#666] mb-3">Follow Us</p>
                  <div className="flex gap-4">
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                      <svg className="w-5 h-5" fill="#0A66C2" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                      <svg className="w-5 h-5" fill="#1DA1F2" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                      <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <defs>
                          <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: '#FED576' }} />
                            <stop offset="25%" style={{ stopColor: '#F47133' }} />
                            <stop offset="50%" style={{ stopColor: '#BC3081' }} />
                            <stop offset="100%" style={{ stopColor: '#4C63D2' }} />
                          </linearGradient>
                        </defs>
                        <path fill="url(#instagram-gradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-white z-40 md:hidden overflow-y-auto">
            <div className="flex flex-col p-6 pt-16 space-y-6">
              <button 
                onClick={() => {
                  setIsDropdownOpen(!isDropdownOpen);
                }}
                className="text-[#ff4f01] font-[Lexend] font-medium text-[16px] text-left"
              >
                Book a Demo
              </button>
              
              {isDropdownOpen && (
                <div className="pl-4 space-y-4 border-l-2 border-[#FF4F00]">
                  {platforms.map((platform, index) => (
                    <a
                      key={index}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <div className="flex items-center justify-center w-16 h-10">
                        <ImageWithFallback 
                          src={platform.logo}
                          alt={platform.name}
                          className="w-full h-auto object-contain"
                        />
                      </div>
                      <span className="text-sm font-[Mallanna] text-[#666]">
                        {platform.name}
                      </span>
                    </a>
                  ))}
                </div>
              )}
              
              <button 
                onClick={scrollToWhoWeAre}
                className="text-[#868686] font-[Lexend] font-medium text-[16px] text-left"
              >
                Who We Are
              </button>
              
              <button 
                onClick={scrollToWhyUs}
                className="text-[#868686] font-[Lexend] font-medium text-[16px] text-left"
              >
                Why us
              </button>
              
              <div>
                <button 
                  onClick={() => setIsContactDropdownOpen(!isContactDropdownOpen)}
                  className="text-[#868686] font-[Lexend] font-medium text-[16px] text-left"
                >
                  Contact us
                </button>
                
                {isContactDropdownOpen && (
                  <div className="mt-4 pl-4 space-y-4 border-l-2 border-[#FF4F00]">
                    <div>
                      <p className="text-xs font-[Lexend] font-semibold text-[#666] mb-1">Telephone</p>
                      <a href="tel:+254712000000" className="text-sm font-[Mallanna] text-[#666]">
                        +254 712 000 000
                      </a>
                    </div>
                    
                    <div>
                      <p className="text-xs font-[Lexend] font-semibold text-[#666] mb-1">Email</p>
                      <a href="mailto:info@wexlot.com" className="text-sm font-[Mallanna] text-[#666]">
                        info@wexlot.com
                      </a>
                    </div>
                    
                    <div>
                      <p className="text-xs font-[Lexend] font-semibold text-[#666] mb-1">Location</p>
                      <p className="text-sm font-[Mallanna] text-[#666] leading-relaxed">
                        3rd Floor, 14 Riverside Drive,<br />
                        Cavendish block, Westlands
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Logo Section - Click 5 times to open admin */}
      <div className="flex justify-start px-4 sm:px-8 md:px-16 lg:px-24">
        <button
          onClick={handleLogoClick}
          className="cursor-pointer focus:outline-none"
          aria-label="WeXlot Logo"
        >
          <ImageWithFallback 
            key={images.logo}
            src={images.logo}
            alt="WeXlot Logo"
            className="w-[50px] sm:w-[60px] md:w-[67px] h-auto"
          />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-4 sm:px-8 md:px-16 lg:px-24 py-4 md:py-0">
        {/* Text Section */}
        <h1 className="leading-tight font-bold text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] font-[Lexend] text-[#C0C0C0] mt-4 md:mt-[-90px] mb-6 md:mb-[24px] text-center">
          hello,<br />
          we are WeXlot,<br />
          we build <span className="text-[#FF4F00]">platforms that actually<br />
          help businesses grow.</span>
        </h1>

        {/* Content Section with Logo and Image */}
        <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-8 lg:gap-12 items-start relative">
          {/* Left Side - ScissorUp and SmartLenderUp */}
          <div className="w-full lg:flex-shrink-0 lg:w-64 space-y-8 lg:space-y-12">
            <a 
              href="https://scissorup.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block cursor-pointer group transition-all"
            >
              <div className="w-full max-w-[199px] h-[79px] overflow-hidden">
                <ImageWithFallback 
                  key={images.scissorUpLogo}
                  src={images.scissorUpLogo}
                  alt="ScissorUp Logo"
                  className="w-[199px] h-auto object-contain grayscale group-hover:grayscale-0 transition-all"
                />
              </div>
              
              <h2 className="font-bold text-[#FF4F00] mt-2 mb-2 font-[Mallanna] text-[18px] sm:text-[20px]">
                Barbershop & Salons
              </h2>
              
              <p className="text-[#666] mb-3 leading-relaxed text-[12px] sm:text-[13px] font-[Mallanna] tracking-tight">
                Transform your appointment booking and client management with a stylish, easy-to-use interface.
              </p>
              
              <p className="text-[#666] text-[12px] sm:text-[13px] font-[Mallanna] tracking-tight">
                Online booking, Staff scheduling, Client history, SMS reminders
              </p>
            </a>

            <a 
              href="https://smartlenderup.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block cursor-pointer group transition-all"
            >
              <div className="w-full max-w-[199px] h-[79px] overflow-hidden flex items-center">
                <ImageWithFallback 
                  key={images.smartLenderUpLogo}
                  src={images.smartLenderUpLogo}
                  alt="SmartLenderUp Logo"
                  className="w-[161px] h-auto object-contain grayscale group-hover:grayscale-0 transition-all"
                />
              </div>
              
              <h2 className="font-bold text-[#FF4F00] mt-2 mb-2 font-[Mallanna] text-[18px] sm:text-[20px]">
                Loans Platform
              </h2>
              
              <p className="text-[#666] mb-3 leading-relaxed text-[12px] sm:text-[13px] font-[Mallanna] tracking-tight">
                Simplify the lending lifecycle from application to disbursement with intelligent risk assessment.
              </p>
              
              <p className="text-[#666] text-[12px] sm:text-[13px] font-[Mallanna] tracking-tight">
                Credit scoring, Document management, Payment tracking, Digital signatures
              </p>
            </a>
          </div>

          {/* Center - Workspace Image (Hidden on mobile) */}
          <div className="hidden lg:block flex-1 relative min-h-[400px]">
            <ImageWithFallback 
              key={images.workspaceImage}
              src={images.workspaceImage}
              alt="Business platform dashboard"
              className="w-full h-auto object-contain rounded-lg opacity-55 absolute left-1/2 -translate-x-1/2 top-8"
            />
          </div>

          {/* Right Side - TillsUp and PillsUp */}
          <div className="w-full lg:flex-shrink-0 lg:w-64 space-y-8 lg:space-y-12">
            <a 
              href="http://www.tillsup.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block cursor-pointer group transition-all"
            >
              <div className="w-full max-w-[199px] h-[79px] overflow-hidden">
                <ImageWithFallback 
                  key={images.tillsUpLogo}
                  src={images.tillsUpLogo}
                  alt="TillsUp Logo"
                  className="w-[128px] h-auto object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all mt-[12px]"
                />
              </div>
              
              <h2 className="font-bold text-[#FF4F00] font-[Mallanna] text-[18px] sm:text-[20px] mt-2 mb-2">
                POS Platform
              </h2>
              
              <p className="text-[#999] group-hover:text-[#666] mb-3 leading-relaxed text-[12px] sm:text-[13px] font-[Mallanna] tracking-tight transition-colors">
                Fast, reliable, and integrated point-of-sale system for modern retail and hospitality businesses.
              </p>
              
              <p className="text-[#999] group-hover:text-[#666] text-[12px] sm:text-[13px] font-[Mallanna] tracking-tight transition-colors">
                Offline mode, Multi-store support, Inventory sync, Loyalty programs
              </p>
            </a>

            <a 
              href="https://pillsup.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block cursor-pointer group transition-all"
            >
              <div className="w-full max-w-[199px] h-[79px] overflow-hidden">
                <ImageWithFallback 
                  key={images.pillsUpLogo}
                  src={images.pillsUpLogo}
                  alt="PillsUp Logo"
                  className="w-[161px] h-auto object-contain mt-[33px] grayscale group-hover:grayscale-0 transition-all"
                />
              </div>
              
              <h2 className="font-bold text-[#FF4F00] mt-2 mb-2 font-[Mallanna] text-[18px] sm:text-[20px]">
                Pharmacy Platform
              </h2>
              
              <p className="text-[#666] mb-3 leading-relaxed text-[12px] sm:text-[13px] font-[Mallanna] tracking-tight">
                Manage inventory, prescriptions, and patient records with a secure and compliant digital ecosystem.
              </p>
              
              <p className="text-[#666] text-[12px] sm:text-[13px] font-[Mallanna] tracking-tight">
                Stock alerts, E-prescription sync, HIPAA compliant, Supplier portal
              </p>
            </a>
          </div>
        </div>
      </div>

      {/* Who We Are Section */}
      <div ref={whoWeAreRef} className="bg-gradient-to-b from-white to-gray-50 py-12 sm:py-16 md:py-24 px-4 sm:px-8 md:px-16 lg:px-24 mt-16 sm:mt-24 md:mt-32">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-[28px] sm:text-[36px] md:text-[42px] font-bold font-[Lexend] text-[#FF4F00] mb-6 md:mb-8 text-center">
            Who We Are
          </h2>
          
          <div className="mt-8 md:mt-16">
            {/* Philosophy, Image, and Approach */}
            <div className="flex flex-col lg:flex-row justify-center items-start gap-6 md:gap-8 mt-8 md:mt-16 mb-8 md:mb-12">
              {/* Philosophy */}
              <div className="flex-1 max-w-md lg:text-right">
                <h3 className="text-[20px] sm:text-[22px] md:text-[24px] font-bold font-[Lexend] text-[#666] mb-3 md:mb-4">
                  Our Philosophy
                </h3>
                <p className="text-[#666] leading-relaxed font-[Mallanna] text-[14px] sm:text-[15px] md:text-[16px] mb-3 md:mb-4">
                  Born from years of witnessing businesses struggle with overcomplicated software, WeXlot was founded on a simple belief: technology should empower businesses, not complicate them. Our mission is to build platforms that are intuitive, scalable, and designed with real business needs in mind.
                </p>
                <p className="text-[#666] leading-relaxed font-[Mallanna] text-[14px] sm:text-[15px] md:text-[16px] mb-3 md:mb-4">
                  We focus on creating solutions that drive tangible results, helping our clients streamline operations, increase revenue, and deliver exceptional customer experiences.
                </p>
                <div className="space-y-2 mt-4">
                  <p className="text-[#FF4F00] font-[Lexend] font-semibold text-[13px] sm:text-[14px]">Our Core Values:</p>
                  <p className="text-[#666] font-[Mallanna] text-[13px] sm:text-[14px]"><span className="font-semibold">Transparency</span> - Clear communication at every step</p>
                  <p className="text-[#666] font-[Mallanna] text-[13px] sm:text-[14px]"><span className="font-semibold">Innovation</span> - Staying ahead of industry trends</p>
                  <p className="text-[#666] font-[Mallanna] text-[13px] sm:text-[14px]"><span className="font-semibold">Customer-First</span> - Your success is our priority</p>
                </div>
              </div>
              
              {/* Centered Image */}
              <ImageWithFallback 
                key={images.philosophyImage}
                src={images.philosophyImage}
                alt="Creative thinking and innovation"
                className="w-full max-w-[250px] sm:max-w-[280px] md:max-w-[320px] h-auto object-contain opacity-50 flex-shrink-0 mx-auto lg:mx-0"
              />
              
              {/* Approach */}
              <div className="flex-1 max-w-md">
                <h3 className="text-[20px] sm:text-[22px] md:text-[24px] font-bold font-[Lexend] text-[#666] mb-3 md:mb-4">
                  Our Approach
                </h3>
                <p className="text-[#666] leading-relaxed font-[Mallanna] text-[14px] sm:text-[15px] md:text-[16px] mb-4 md:mb-6">
                  Every business is unique, and we take a personalized approach to understanding your challenges and goals. We don't just build software—we partner with you to create platforms that evolve with your business.
                </p>
                <div className="space-y-3 mb-4 md:mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#FF4F00] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-[#666] font-[Mallanna] text-[14px] sm:text-[15px]">Industry-specific solutions tailored to your needs</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#FF4F00] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-[#666] font-[Mallanna] text-[14px] sm:text-[15px]">Continuous support and platform evolution</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#FF4F00] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-[#666] font-[Mallanna] text-[14px] sm:text-[15px]">Data-driven insights to maximize growth</p>
                  </div>
                </div>
                
                <div className="space-y-3 mt-4 md:mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#FF4F00] rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-[#666] font-[Mallanna] text-[14px] sm:text-[15px] font-semibold">Agile & Iterative</p>
                      <p className="text-[#666] font-[Mallanna] text-[12px] sm:text-[13px]">Flexible development cycles with continuous feedback</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#FF4F00] rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-[#666] font-[Mallanna] text-[14px] sm:text-[15px] font-semibold">Seamless Integration</p>
                      <p className="text-[#666] font-[Mallanna] text-[12px] sm:text-[13px]">Works with your existing systems and tools</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#FF4F00] rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-[#666] font-[Mallanna] text-[14px] sm:text-[15px] font-semibold">Comprehensive Training</p>
                      <p className="text-[#666] font-[Mallanna] text-[12px] sm:text-[13px]">Full onboarding and ongoing support for your team</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose WeXlot Section */}
          <div ref={whyUsRef} className="mt-12 md:mt-16 bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border border-gray-200">
            <h3 className="text-[22px] sm:text-[26px] md:text-[28px] font-bold font-[Lexend] text-[#333] mb-2 text-center">
              Why Choose WeXlot?
            </h3>
            <p className="text-[#666] font-[Mallanna] text-[13px] sm:text-[14px] text-center mb-6 md:mb-8 max-w-2xl mx-auto">
              Trusted by businesses worldwide to deliver exceptional results and measurable growth
            </p>
            
            {/* Statistics Grid - First Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 sm:p-6 text-center shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                <div className="text-[#FF4F00] text-[32px] sm:text-[36px] md:text-[40px] font-bold font-[Lexend] mb-2 leading-none">10+</div>
                <p className="text-[#333] font-[Lexend] font-semibold text-[13px] sm:text-[14px] mb-1">Years of Experience</p>
                <p className="text-[#999] font-[Mallanna] text-[11px] sm:text-[12px]">Proven industry expertise</p>
              </div>
              <div className="bg-white rounded-xl p-4 sm:p-6 text-center shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                <div className="text-[#FF4F00] text-[32px] sm:text-[36px] md:text-[40px] font-bold font-[Lexend] mb-2 leading-none">500+</div>
                <p className="text-[#333] font-[Lexend] font-semibold text-[13px] sm:text-[14px] mb-1">Businesses Empowered</p>
                <p className="text-[#999] font-[Mallanna] text-[11px] sm:text-[12px]">Across multiple industries</p>
              </div>
              <div className="bg-white rounded-xl p-4 sm:p-6 text-center shadow-md hover:shadow-xl transition-shadow border border-gray-100 sm:col-span-2 md:col-span-1">
                <div className="text-[#FF4F00] text-[32px] sm:text-[36px] md:text-[40px] font-bold font-[Lexend] mb-2 leading-none">24/7</div>
                <p className="text-[#333] font-[Lexend] font-semibold text-[13px] sm:text-[14px] mb-1">Support Available</p>
                <p className="text-[#999] font-[Mallanna] text-[11px] sm:text-[12px]">Always here when you need us</p>
              </div>
            </div>
            
            {/* Second Row of Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
              <div className="bg-white rounded-xl text-center shadow-md hover:shadow-xl transition-shadow border border-gray-100 px-3 py-2 sm:px-4 sm:py-3">
                <div className="text-[#FF4F00] font-bold font-[Lexend] mb-1 leading-none text-[20px] sm:text-[22px] md:text-[24px]">99.9%</div>
                <p className="text-[#333] font-[Lexend] font-semibold text-[12px] sm:text-[13px] mb-1">Uptime</p>
                <p className="text-[#999] font-[Mallanna] text-[10px] sm:text-[11px]">Guaranteed</p>
              </div>
              <div className="bg-white rounded-xl text-center shadow-md hover:shadow-xl transition-shadow border border-gray-100 px-3 py-2 sm:px-4 sm:py-3">
                <div className="text-[#FF4F00] font-bold font-[Lexend] mb-1 leading-none text-[20px] sm:text-[22px] md:text-[24px]">3-6</div>
                <p className="text-[#333] font-[Lexend] font-semibold text-[12px] sm:text-[13px] mb-1">Months</p>
                <p className="text-[#999] font-[Mallanna] text-[10px] sm:text-[11px]">Average ROI</p>
              </div>
              <div className="bg-white rounded-xl text-center shadow-md hover:shadow-xl transition-shadow border border-gray-100 px-3 py-2 sm:px-4 sm:py-3">
                <div className="text-[#FF4F00] font-bold font-[Lexend] mb-1 leading-none text-[20px] sm:text-[22px] md:text-[24px]">95%</div>
                <p className="text-[#333] font-[Lexend] font-semibold text-[12px] sm:text-[13px] mb-1">Client Retention</p>
                <p className="text-[#999] font-[Mallanna] text-[10px] sm:text-[11px]">Long-term partnerships</p>
              </div>
              <div className="bg-white rounded-xl text-center shadow-md hover:shadow-xl transition-shadow border border-gray-100 px-3 py-2 sm:px-4 sm:py-3">
                <div className="text-[#FF4F00] font-bold font-[Lexend] mb-1 leading-none text-[20px] sm:text-[22px] md:text-[24px]">50+</div>
                <p className="text-[#333] font-[Lexend] font-semibold text-[12px] sm:text-[13px] mb-1">Industries</p>
                <p className="text-[#999] font-[Mallanna] text-[10px] sm:text-[11px]">Diverse expertise</p>
              </div>
            </div>
            
            {/* Divider with title */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-gradient-to-br from-white to-gray-50 px-4 sm:px-6 text-[16px] sm:text-[18px] md:text-[20px] font-bold font-[Lexend] text-[#333]">
                  The WeXlot Impact
                </span>
              </div>
            </div>
            
            {/* Before vs After Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {/* Operational Efficiency */}
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border-2 border-gray-100 hover:border-[#FF4F00] transition-all">
                <div className="text-center mb-4">
                  <div className="inline-block bg-gradient-to-br from-orange-50 to-orange-100 rounded-full p-3 mb-3">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF4F00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h5 className="text-[#333] font-[Lexend] font-bold text-[14px] sm:text-[15px]">Operational Efficiency</h5>
                </div>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      <span className="text-[#666] font-[Lexend] text-[11px] sm:text-[12px] font-semibold">Before</span>
                    </div>
                    <p className="text-[#999] font-[Mallanna] text-[11px] sm:text-[12px] pl-4">Manual processes slowing you down</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-white rounded-lg p-3 border border-[#FF4F00]">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-[#FF4F00]"></div>
                      <span className="text-[#FF4F00] font-[Lexend] text-[11px] sm:text-[12px] font-semibold">After</span>
                    </div>
                    <p className="text-[#FF4F00] font-[Mallanna] text-[11px] sm:text-[12px] font-semibold pl-4">60% time saved with automation</p>
                  </div>
                </div>
              </div>
              
              {/* Revenue Growth */}
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border-2 border-gray-100 hover:border-[#FF4F00] transition-all">
                <div className="text-center mb-4">
                  <div className="inline-block bg-gradient-to-br from-orange-50 to-orange-100 rounded-full p-3 mb-3">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF4F00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h5 className="text-[#333] font-[Lexend] font-bold text-[14px] sm:text-[15px]">Revenue Growth</h5>
                </div>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      <span className="text-[#666] font-[Lexend] text-[11px] sm:text-[12px] font-semibold">Before</span>
                    </div>
                    <p className="text-[#999] font-[Mallanna] text-[11px] sm:text-[12px] pl-4">Stagnant sales and limited insights</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-white rounded-lg p-3 border border-[#FF4F00]">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-[#FF4F00]"></div>
                      <span className="text-[#FF4F00] font-[Lexend] text-[11px] sm:text-[12px] font-semibold">After</span>
                    </div>
                    <p className="text-[#FF4F00] font-[Mallanna] text-[11px] sm:text-[12px] font-semibold pl-4">35% average revenue increase</p>
                  </div>
                </div>
              </div>
              
              {/* Error Reduction */}
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border-2 border-gray-100 hover:border-[#FF4F00] transition-all">
                <div className="text-center mb-4">
                  <div className="inline-block bg-gradient-to-br from-orange-50 to-orange-100 rounded-full p-3 mb-3">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF4F00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h5 className="text-[#333] font-[Lexend] font-bold text-[14px] sm:text-[15px]">Error Reduction</h5>
                </div>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      <span className="text-[#666] font-[Lexend] text-[11px] sm:text-[12px] font-semibold">Before</span>
                    </div>
                    <p className="text-[#999] font-[Mallanna] text-[11px] sm:text-[12px] pl-4">Frequent costly mistakes</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-white rounded-lg p-3 border border-[#FF4F00]">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-[#FF4F00]"></div>
                      <span className="text-[#FF4F00] font-[Lexend] text-[11px] sm:text-[12px] font-semibold">After</span>
                    </div>
                    <p className="text-[#FF4F00] font-[Mallanna] text-[11px] sm:text-[12px] font-semibold pl-4">85% fewer errors achieved</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white text-[#333] py-12 sm:py-16 px-4 sm:px-8 md:px-16 lg:px-24 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-12">
            {/* Company Info */}
            <div>
              <ImageWithFallback 
                key={images.logo}
                src={images.logo}
                alt="WeXlot Logo"
                className="w-[50px] h-auto mb-4 sm:mb-6"
              />
              <p className="text-[#666] font-[Mallanna] text-[13px] sm:text-[14px] leading-relaxed mb-3 sm:mb-4">
                Building platforms that actually help businesses grow across multiple industries.
              </p>
              <p className="text-[#999] font-[Mallanna] text-[12px] sm:text-[13px]">
                © 2026 WeXlot. All rights reserved.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold font-[Lexend] text-[15px] sm:text-[16px] mb-3 sm:mb-4 text-[#333]">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#platforms" className="text-[#666] hover:text-[#FF4F00] transition-colors font-[Mallanna] text-[13px] sm:text-[14px]">
                    Our Platforms
                  </a>
                </li>
                <li>
                  <button onClick={scrollToWhoWeAre} className="text-[#666] hover:text-[#FF4F00] transition-colors font-[Mallanna] text-[13px] sm:text-[14px]">
                    Who We Are
                  </button>
                </li>
                <li>
                  <a href="#contact" className="text-[#666] hover:text-[#FF4F00] transition-colors font-[Mallanna] text-[13px] sm:text-[14px]">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#careers" className="text-[#666] hover:text-[#FF4F00] transition-colors font-[Mallanna] text-[13px] sm:text-[14px]">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            {/* Industry Sectors */}
            <div>
              <h4 className="font-bold font-[Lexend] text-[15px] sm:text-[16px] mb-3 sm:mb-4 text-[#333]">Industry Sectors</h4>
              <ul className="space-y-2">
                <li className="text-[#666] font-[Mallanna] text-[13px] sm:text-[14px]">Retail</li>
                <li className="text-[#666] font-[Mallanna] text-[13px] sm:text-[14px]">Healthcare</li>
                <li className="text-[#666] font-[Mallanna] text-[13px] sm:text-[14px]">Finance</li>
                <li className="text-[#666] font-[Mallanna] text-[13px] sm:text-[14px]">Beauty & Wellness</li>
              </ul>
            </div>

            {/* Legal & Social */}
            <div>
              <h4 className="font-bold font-[Lexend] text-[15px] sm:text-[16px] mb-3 sm:mb-4 text-[#333]">Legal & Social</h4>
              <ul className="space-y-2 mb-4 sm:mb-6">
                <li>
                  <a href="#privacy" className="text-[#666] hover:text-[#FF4F00] transition-colors font-[Mallanna] text-[13px] sm:text-[14px]">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#terms" className="text-[#666] hover:text-[#FF4F00] transition-colors font-[Mallanna] text-[13px] sm:text-[14px]">
                    Terms of Service
                  </a>
                </li>
              </ul>
              
              <div>
                <h5 className="font-bold font-[Lexend] text-[13px] sm:text-[14px] mb-2 sm:mb-3 text-[#333]">Follow Us</h5>
                <div className="flex gap-3 sm:gap-4">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="#0A66C2" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="#1DA1F2" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24">
                      <defs>
                        <linearGradient id="instagram-gradient-footer" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" style={{ stopColor: '#FED576' }} />
                          <stop offset="25%" style={{ stopColor: '#F47133' }} />
                          <stop offset="50%" style={{ stopColor: '#BC3081' }} />
                          <stop offset="100%" style={{ stopColor: '#4C63D2' }} />
                        </linearGradient>
                      </defs>
                      <path fill="url(#instagram-gradient-footer)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
