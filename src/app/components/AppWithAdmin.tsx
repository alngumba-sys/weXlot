import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scissors, 
  Banknote, 
  BedDouble, 
  Store, 
  Pill, 
  Briefcase, 
  CalendarCheck,
  Users,
  CreditCard,
  TrendingUp,
  Activity,
  CheckCircle2,
  MapPin,
  Target,
  UserX
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getAllImages } from '../../lib/supabase';

const smartLenderUpLogo = "data:image/svg+xml,%3Csvg width='200' height='80' viewBox='0 0 200 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 40 L40 25 L60 40 V55 H20 V40 Z' stroke='%23FF4F00' stroke-width='3' fill='none' stroke-linejoin='round'/%3E%3Ctext x='70' y='48' font-family='sans-serif' font-size='20' font-weight='bold' fill='%23333'%3ESmartLender%3Ctspan fill='%23FF4F00'%3EUp%3C/tspan%3E%3C/text%3E%3C/svg%3E";
const hotelierUpLogo = "data:image/svg+xml,%3Csvg width='200' height='80' viewBox='0 0 200 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 30 V50 M60 30 V50 M20 40 H60 M20 30 H60 M25 30 V25 H35 V30 M45 30 V25 H55 V30' stroke='%23FF4F00' stroke-width='3' fill='none' stroke-linecap='round'/%3E%3Ctext x='70' y='48' font-family='sans-serif' font-size='22' font-weight='bold' fill='%23333'%3EHotelier%3Ctspan fill='%23FF4F00'%3EUp%3C/tspan%3E%3C/text%3E%3C/svg%3E";
const pillsUpLogo = "data:image/svg+xml,%3Csvg width='200' height='80' viewBox='0 0 200 80' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='25' y='30' width='30' height='20' rx='10' stroke='%23FF4F00' stroke-width='3' fill='none'/%3E%3Cpath d='M40 30 V50' stroke='%23FF4F00' stroke-width='3'/%3E%3Ctext x='70' y='48' font-family='sans-serif' font-size='24' font-weight='bold' fill='%23333'%3EPills%3Ctspan fill='%23FF4F00'%3EUp%3C/tspan%3E%3C/text%3E%3C/svg%3E";
const salesUpLogo = "data:image/svg+xml,%3Csvg width='200' height='80' viewBox='0 0 200 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 50 L30 40 L40 45 L55 25' stroke='%23FF4F00' stroke-width='3' fill='none' stroke-linecap='round'/%3E%3Cpath d='M50 25 H55 V30' stroke='%23FF4F00' stroke-width='3' stroke-linecap='round'/%3E%3Ctext x='70' y='48' font-family='sans-serif' font-size='24' font-weight='bold' fill='%23333'%3ESales%3Ctspan fill='%23FF4F00'%3EUp%3C/tspan%3E%3C/text%3E%3C/svg%3E";
const wexlotLogoNew = "data:image/svg+xml,%3Csvg width='150' height='50' viewBox='0 0 150 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 15 L35 40 L50 15 M50 15 L65 40 L80 15' stroke='%23023E8A' stroke-width='5' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3Ccircle cx='95' cy='15' r='5' fill='%23FF4F00'/%3E%3Ctext x='105' y='38' font-family='sans-serif' font-size='24' font-weight='bold' fill='%23023E8A'%3EXlot%3C/text%3E%3C/svg%3E";
const wexlotLogoWhite = "data:image/svg+xml,%3Csvg width='150' height='50' viewBox='0 0 150 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 15 L35 40 L50 15 M50 15 L65 40 L80 15' stroke='white' stroke-width='5' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3Ccircle cx='95' cy='15' r='5' fill='%23FF4F00'/%3E%3Ctext x='105' y='38' font-family='sans-serif' font-size='24' font-weight='bold' fill='white'%3EXlot%3C/text%3E%3C/svg%3E";

// Import AdminPanel directly instead of lazy loading to avoid dynamic import issues
import { AdminPanel } from './AdminPanel';

const leftColumnData = [
  { icon: Scissors, title: "New Appointment", value: "Today, 10:00 AM", color: "text-orange-400" },
  { icon: Banknote, title: "Loan Approved", value: "$5,000.00", color: "text-green-400" },
  { icon: BedDouble, title: "Room Check-in", value: "Suite 302", color: "text-blue-400" },
  { icon: CalendarCheck, title: "Booking Confirmed", value: "Jane Doe", color: "text-purple-400" },
  { icon: Activity, title: "Risk Assessment", value: "Score: 98/100", color: "text-red-400" },
  { icon: TrendingUp, title: "Occupancy Rate", value: "+12% vs last week", color: "text-emerald-400" },
];

const rightColumnData = [
  { icon: Store, title: "New Sale", value: "Order #8821", color: "text-yellow-400" },
  { icon: MapPin, title: "Field Sales Team", value: "Active: 12 Agents", color: "text-orange-400" },
  { icon: Briefcase, title: "Q3 Revenue", value: "$124,500", color: "text-indigo-400" },
  { icon: Target, title: "Staff Targets", value: "95% Achieved", color: "text-emerald-400" },
  { icon: CreditCard, title: "Payment Received", value: "$45.90", color: "text-cyan-400" },
  { icon: UserX, title: "Inactive Customer", value: "Re-engagement Needed", color: "text-red-400" },
  { icon: CheckCircle2, title: "Inventory Update", value: "Stock Low: Aspirin", color: "text-rose-400" },
  { icon: Users, title: "New Customer", value: "Drill Ltd", color: "text-pink-400" },
  { icon: Pill, title: "Prescription Ready", value: "RX-99201", color: "text-teal-400" },
];

export default function AppWithAdmin() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isContactDropdownOpen, setIsContactDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const contactDropdownRef = useRef<HTMLDivElement>(null);
  const whoWeAreRef = useRef<HTMLDivElement>(null);
  const whyUsRef = useRef<HTMLDivElement>(null);

  // Default fallback image URLs
  const defaultImages = {
    workspaceImage: "https://images.unsplash.com/photo-1630283018262-d0df4afc2fef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2UlMjBidXNpbmVzcyUyMGRlc2t8ZW58MXx8fHwxNzcxMzIxODE3fDA&ixlib=rb-4.1.0&q=60&w=1080&auto=format",
    logo: wexlotLogoNew,
    footerLogo: wexlotLogoWhite,
    scissorUpLogo: "https://via.placeholder.com/199x79/666666/FFFFFF?text=ScissorUp",
    pillsUpLogo: pillsUpLogo,
    smartLenderUpLogo: smartLenderUpLogo,
    hotelierUpLogo: hotelierUpLogo,
    tillsUpLogo: "https://via.placeholder.com/128x79/666666/FFFFFF?text=TillsUp",
    salesUpLogo: salesUpLogo,
    philosophyImage: "https://images.unsplash.com/photo-1609619385076-36a873425636?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHRoaW5raW5nJTIwaW5ub3ZhdGlvbiUyMGxpZ2h0YnVsYnxlbnwxfHx8fDE3NzEzMjE4MTh8MA&ixlib=rb-4.1.0&q=60&w=1080&auto=format",
  };

  // State for images - Initialize with default images
  const [images, setImages] = useState(defaultImages);
  const [imagesLoaded, setImagesLoaded] = useState(false);

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
      footerLogo: defaultImages.footerLogo,
      scissorUpLogo: supabaseImages.scissorUpLogo || defaultImages.scissorUpLogo,
      pillsUpLogo: supabaseImages.pillsUpLogo || defaultImages.pillsUpLogo,
      smartLenderUpLogo: supabaseImages.smartLenderUpLogo || defaultImages.smartLenderUpLogo,
      hotelierUpLogo: supabaseImages.hotelierUpLogo || defaultImages.hotelierUpLogo,
      tillsUpLogo: supabaseImages.tillsUpLogo || defaultImages.tillsUpLogo,
      salesUpLogo: supabaseImages.salesUpLogo || defaultImages.salesUpLogo,
      philosophyImage: supabaseImages.philosophyImage || defaultImages.philosophyImage,
    };
    
    console.log('[' + new Date().toLocaleTimeString() + '] Setting images state to:', newImages);
    setImages(newImages);
    setImagesLoaded(true);
  };

  const [flashingLogo, setFlashingLogo] = useState<string | null>(null);
  const logoQueueRef = useRef<string[]>([]);
  const lastLogoRef = useRef<string | null>(null);
  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    const allLogos = ['scissorUp', 'smartLenderUp', 'hotelierUp', 'tillsUp', 'pillsUp', 'salesUp'];
    
    const fillQueue = () => {
      let newQueue = [...allLogos];
      
      // Fisher-Yates shuffle
      for (let i = newQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newQueue[i], newQueue[j]] = [newQueue[j], newQueue[i]];
      }

      // Prevent consecutive repeats across batches
      // If the first item of the new batch is the same as the last flashed logo
      if (lastLogoRef.current && newQueue[0] === lastLogoRef.current) {
        // Swap first element with the last element
        [newQueue[0], newQueue[newQueue.length - 1]] = [newQueue[newQueue.length - 1], newQueue[0]];
      }
      
      logoQueueRef.current = newQueue;
    };

    const flashNextLogo = () => {
      // If queue is empty, refill it
      if (logoQueueRef.current.length === 0) {
        fillQueue();
      }
      
      // Get the next logo
      const selectedLogo = logoQueueRef.current.shift();
      
      if (selectedLogo) {
        lastLogoRef.current = selectedLogo;
        setFlashingLogo(selectedLogo);
        
        // Clear it after 3 seconds (flashing duration)
        setTimeout(() => {
          setFlashingLogo(null);
        }, 3000);
      }
    };

    // Initial flash
    flashNextLogo();

    // Set interval for subsequent flashes - runs every 4 seconds to allow for 3s flash + 1s gap
    const intervalId = setInterval(flashNextLogo, 4000); 

    return () => clearInterval(intervalId);
  }, []);

  const handleLogoClick = () => {
    // Open admin panel immediately on any logo click
    setIsAdminOpen(true);
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
    },
    {
      name: 'Sales Platform',
      logo: images.salesUpLogo,
      url: '#',
      logoClass: 'w-[100px]'
    },
    {
      name: 'Hotel Platform',
      logo: images.hotelierUpLogo,
      url: '#',
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
    <div className="min-h-screen relative overflow-hidden bg-[#FDF8E8]">
      {/* Admin Panel */}
      {isAdminOpen && (
        <AdminPanel 
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          onImagesUpdated={handleImagesUpdated}
          currentImages={images}
        />
      )}

      {/* Header */}
      <header className="flex justify-between items-center gap-4 relative px-[96px] py-[4px]">
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-gray-300 hover:text-[#FF4F00] transition-colors z-50"
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
            className="text-gray-300 hover:text-[#FF4F00] transition-colors font-[Lexend] font-medium text-[14px]"
          >
            Who We Are
          </button>
          
          <button 
            onClick={scrollToWhyUs}
            className="text-gray-300 hover:text-[#FF4F00] transition-colors font-[Lexend] font-medium text-[14px]"
          >
            Why us
          </button>
          
          <div className="relative" ref={contactDropdownRef}>
            <button 
              onClick={() => setIsContactDropdownOpen(!isContactDropdownOpen)}
              className="text-gray-300 hover:text-[#FF2200] transition-colors font-[Lexend] font-medium text-[14px]"
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

      {/* Logo Section - Click to open admin */}
      <div className="flex justify-start px-4 sm:px-8 md:px-16 lg:px-24 relative z-20">
        <button
          onClick={handleLogoClick}
          className="cursor-pointer focus:outline-none p-3 -m-3 hover:opacity-80 transition-opacity relative z-20"
          aria-label="WeXlot Logo - Click to open admin"
        >
          {imagesLoaded && (
            <ImageWithFallback 
              src={images.logo}
              alt="WeXlot Logo"
              className="w-[50px] sm:w-[60px] md:w-[67px] h-auto pointer-events-none"
              loading="eager"
            />
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-4 sm:px-8 md:px-16 lg:px-24 py-4 md:py-0 relative z-10 -mt-[60px]">
        {/* Text Section */}
        <h1 className="leading-tight font-bold font-[Lexend] text-[#C0C0C0] text-center text-[28px] sm:text-[34px] md:text-[40px] mx-[0px] my-[5px]">
          hello,<br />
          we are WeXlot,<br />
          we build <span className="text-[#FF4F00]">platforms that actually<br />
          help businesses grow.</span>
        </h1>

        {/* Workspace Image - Shows on mobile only (below text) */}
        <div className="w-full max-w-2xl mb-8 lg:hidden">
          {imagesLoaded && (
            <ImageWithFallback 
              src={images.workspaceImage}
              alt="Business platform dashboard"
              className="w-full h-auto object-contain rounded-lg opacity-55"
              loading="eager"
              width={672}
              height={378}
            />
          )}
        </div>

        {/* Content Section with Logo and Image */}
        <div className="max-w-6xl w-full flex flex-col md:flex-row lg:flex-row gap-8 lg:gap-12 items-start relative">
          {/* Left Side - ScissorUp and SmartLenderUp */}
          <div className="w-full md:flex-1 lg:flex-none lg:w-64 space-y-8 lg:space-y-12">
            <a 
              href="https://scissorup.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block cursor-pointer group transition-all mx-[0px] mt-[0px] mb-[12px]"
            >
              <div className="w-full max-w-[199px] h-auto m-[0px]">
                <ImageWithFallback 
                  key={images.scissorUpLogo}
                  src={images.scissorUpLogo}
                  alt="ScissorUp Logo"
                  className={`w-[199px] h-auto object-contain ${flashingLogo === 'scissorUp' ? 'grayscale-0 scale-[1.15]' : 'grayscale scale-100'} group-hover:grayscale-0 group-hover:scale-100 transition-all duration-500`}
                />
              </div>
              
              <h2 className="font-bold text-[#FF4F00] font-[Mallanna] text-[18px] sm:text-[20px] m-[0px]">
                Barbershop & Salons
              </h2>
              
              <p className="text-gray-300 mb-3 leading-relaxed text-[12px] sm:text-[13px] font-[Mallanna] tracking-tight">
                Transform your appointment booking and client management with a stylish, easy-to-use interface.
              </p>
              

            </a>

            <a 
              href="https://smartlenderup.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block cursor-pointer group transition-all"
            >
              <div className="w-full max-w-[199px] h-[79px]">
                <ImageWithFallback 
                  key={images.smartLenderUpLogo}
                  src={images.smartLenderUpLogo}
                  alt="SmartLenderUp Logo"
                  className={`w-[178px] h-auto object-contain mt-[39px] ${flashingLogo === 'smartLenderUp' ? 'grayscale-0 scale-[1.15]' : 'grayscale scale-100'} group-hover:grayscale-0 group-hover:scale-100 transition-all duration-500`}
                />
              </div>
              
              <h2 className="font-bold text-[#FF4F00] font-[Mallanna] text-[18px] sm:text-[20px] mx-[0px] mt-[-23px] mb-[2px]">
                Loans Platform
              </h2>
              
              <p className="text-gray-300 mb-3 leading-relaxed text-[12px] sm:text-[13px] font-[Mallanna] tracking-tight">
                Simplify the lending lifecycle from application to disbursement with intelligent risk assessment.
              </p>
              

            </a>

            <a 
              href="https://hotelierup.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block cursor-pointer group transition-all"
            >
              <div className="w-full max-w-[199px] h-auto">
                <ImageWithFallback 
                  key={images.hotelierUpLogo}
                  src={images.hotelierUpLogo}
                  alt="HotelierUp Logo"
                  className={`w-[199px] h-auto object-contain mx-[0px] my-[5px] ${flashingLogo === 'hotelierUp' ? 'grayscale-0 scale-[1.15]' : 'grayscale scale-100'} group-hover:grayscale-0 group-hover:scale-100 transition-all duration-500`}
                />
              </div>
              
              <h2 className="font-bold text-[#FF4F00] font-[Mallanna] text-[18px] sm:text-[20px] m-[0px]">
                Hotel Platform
              </h2>
              
              <p className="text-gray-300 mb-3 leading-relaxed text-[12px] sm:text-[13px] font-[Mallanna] tracking-tight">
                All-in-one hospitality management platform. Streamline operations, enhance guest experiences, and driving excellence
              </p>
            </a>
          </div>

          {/* Center - Workspace Image (Desktop only - positioned in center) */}
          <div className="hidden lg:block flex-1 relative min-h-[400px]">
            {imagesLoaded && (
              <ImageWithFallback 
                src={images.workspaceImage}
                alt="Business platform dashboard"
                className="w-[115%] h-auto object-contain rounded-lg opacity-55 absolute left-1/2 -translate-x-1/2 top-8"
                loading="eager"
                width={1080}
                height={600}
              />
            )}
          </div>

          {/* Right Side - TillsUp and PillsUp */}
          <div className="w-full md:flex-1 lg:flex-none lg:w-64 space-y-8 lg:space-y-12">
            <a 
              href="http://www.tillsup.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block cursor-pointer group transition-all"
            >
              <div className="w-full max-w-[199px] h-auto">
                <ImageWithFallback 
                  key={images.tillsUpLogo}
                  src={images.tillsUpLogo}
                  alt="TillsUp Logo"
                  className={`w-[128px] h-auto object-contain mt-[12px] ${flashingLogo === 'tillsUp' ? 'grayscale-0 opacity-100 scale-[1.15]' : 'grayscale opacity-70 scale-100'} group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500`}
                />
              </div>
              
              <h2 className="font-bold text-[#FF4F00] font-[Mallanna] text-[18px] sm:text-[20px] m-[0px]">
                POS Platform
              </h2>
              
              <p className="text-gray-400 group-hover:text-gray-200 mb-3 leading-relaxed text-[12px] sm:text-[13px] font-[Mallanna] tracking-tight transition-colors">
                Fast, reliable, and integrated point-of-sale system for modern retail and hospitality businesses.
              </p>

            </a>

            <a 
              href="https://pillsup.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block cursor-pointer group transition-all"
            >
              <div className="w-full max-w-[199px] h-auto mt-[-20px]">
                <ImageWithFallback 
                  key={images.pillsUpLogo}
                  src={images.pillsUpLogo}
                  alt="PillsUp Logo"
                  className={`w-[161px] h-auto object-contain mt-[0px] m-[0px] ${flashingLogo === 'pillsUp' ? 'grayscale-0 scale-[1.15]' : 'grayscale scale-100'} group-hover:grayscale-0 group-hover:scale-100 transition-all duration-500`}
                />
              </div>
              
              <h2 className="font-bold text-[#FF4F00] font-[Mallanna] text-[18px] sm:text-[20px] m-[0px]">
                Pharmacy Platform
              </h2>
              
              <p className="text-gray-300 mb-3 leading-relaxed text-[12px] sm:text-[13px] font-[Mallanna] tracking-tight">
                Manage inventory, prescriptions, and patient records with a secure and compliant digital ecosystem.
              </p>
            </a>

            <div 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('MintUp (Sales Platform) clicked!');
                setShowComingSoon(true);
                setTimeout(() => {
                  console.log('Hiding popup');
                  setShowComingSoon(false);
                }, 4000);
              }}
              className="block cursor-pointer group transition-all mt-[-5px] relative"
            >
              <div className="w-full max-w-[199px] h-auto">
                <ImageWithFallback 
                  key={images.salesUpLogo}
                  src={images.salesUpLogo}
                  alt="MintUp Logo"
                  className={`w-[115px] h-auto object-contain mt-[10px] m-[0px] ${flashingLogo === 'salesUp' ? 'grayscale-0 opacity-100 scale-[1.15]' : 'grayscale opacity-70 scale-100'} group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500`}
                />
              </div>
              
              <h2 className="font-bold text-[#FF4F00] font-[Mallanna] text-[18px] sm:text-[20px] mx-[0px] my-[6px]">
                Sales Platform
              </h2>
              
              <p className="text-gray-300 mb-3 leading-relaxed text-[12px] sm:text-[13px] font-[Mallanna] tracking-tight">
                Enterprise ERP platform optimizing Field Operations, Sales, and Warehouse management.
              </p>
              
              {/* Coming Soon Popup */}
              {showComingSoon && (
                <div
                  className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-[#FF4F00] text-white px-4 py-2 rounded-lg shadow-2xl z-[9999] font-bold text-sm whitespace-nowrap border-2 border-white animate-pulse"
                  style={{ pointerEvents: 'none' }}
                >
                  Coming Soon!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Scrolling Cards - Full width, in-flow */}
      <div className="w-full relative overflow-hidden z-0 mt-8 mb-4">
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#FDF8E8] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#FDF8E8] to-transparent z-10 pointer-events-none" />
        <motion.div
          key="scroller-v2"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 300, repeat: Infinity, ease: "linear" }}
          className="flex flex-row gap-4 w-max bg-[#76434300] px-[16px] py-[0px]"
        >
          {[...rightColumnData, ...rightColumnData, ...rightColumnData, ...rightColumnData, ...rightColumnData, ...rightColumnData, ...rightColumnData, ...rightColumnData].map((card, i) => (
            <div key={i} className="bg-white p-3 rounded-xl border border-orange-50/50 shadow-md min-w-[160px] flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`p-1.5 rounded-lg bg-gray-50/50`}>
                  <card.icon className={`w-4 h-4 ${card.color}`} />
                </div>
                <span className="text-[#555] font-[Lexend] font-semibold text-[11px] leading-tight whitespace-nowrap">{card.title}</span>
              </div>
              <div className="text-[#999] font-[Mallanna] pl-1 whitespace-nowrap text-[11px]">{card.value}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Who We Are Section */}
      <div ref={whoWeAreRef} className="py-12 sm:py-16 md:py-24 px-4 sm:px-8 md:px-16 lg:px-24 relative z-10">
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
              {imagesLoaded && (
                <ImageWithFallback 
                  src={images.philosophyImage}
                  alt="Creative thinking and innovation"
                  className="w-full max-w-[250px] sm:max-w-[280px] md:max-w-[320px] h-auto object-contain opacity-50 flex-shrink-0 mx-auto lg:mx-0"
                  loading="lazy"
                  width={320}
                  height={213}
                />
              )}
              
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
      <footer className="bg-[#023E8A] text-white py-12 sm:py-16 px-4 sm:px-8 md:px-16 lg:px-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-12">
            {/* Company Info */}
            <div>
              <ImageWithFallback 
                key={images.footerLogo}
                src={images.footerLogo}
                alt="WeXlot Logo"
                className="w-[50px] h-auto mb-4 sm:mb-6"
              />
              <p className="text-gray-300 font-[Mallanna] text-[13px] sm:text-[14px] leading-relaxed mb-3 sm:mb-4">
                Building platforms that actually help businesses grow across multiple industries.
              </p>
              <p className="text-gray-400 font-[Mallanna] text-[12px] sm:text-[13px]">
                © 2026 WeXlot. All rights reserved.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold font-[Lexend] text-[15px] sm:text-[16px] mb-3 sm:mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#platforms" className="text-gray-300 hover:text-[#FF4F00] transition-colors font-[Mallanna] text-[13px] sm:text-[14px]">
                    Our Platforms
                  </a>
                </li>
                <li>
                  <button onClick={scrollToWhoWeAre} className="text-gray-300 hover:text-[#FF4F00] transition-colors font-[Mallanna] text-[13px] sm:text-[14px]">
                    Who We Are
                  </button>
                </li>
                <li>
                  <a href="#contact" className="text-gray-300 hover:text-[#FF4F00] transition-colors font-[Mallanna] text-[13px] sm:text-[14px]">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#careers" className="text-gray-300 hover:text-[#FF4F00] transition-colors font-[Mallanna] text-[13px] sm:text-[14px]">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            {/* Industry Sectors */}
            <div>
              <h4 className="font-bold font-[Lexend] text-[15px] sm:text-[16px] mb-3 sm:mb-4 text-white">Industry Sectors</h4>
              <ul className="space-y-2">
                <li className="text-gray-300 font-[Mallanna] text-[13px] sm:text-[14px]">Retail</li>
                <li className="text-gray-300 font-[Mallanna] text-[13px] sm:text-[14px]">Healthcare</li>
                <li className="text-gray-300 font-[Mallanna] text-[13px] sm:text-[14px]">Finance</li>
                <li className="text-gray-300 font-[Mallanna] text-[13px] sm:text-[14px]">Beauty & Wellness</li>
              </ul>
            </div>

            {/* Legal & Social */}
            <div>
              <h4 className="font-bold font-[Lexend] text-[15px] sm:text-[16px] mb-3 sm:mb-4 text-white">Legal & Social</h4>
              <ul className="space-y-2 mb-4 sm:mb-6">
                <li>
                  <a href="#privacy" className="text-gray-300 hover:text-[#FF4F00] transition-colors font-[Mallanna] text-[13px] sm:text-[14px]">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#terms" className="text-gray-300 hover:text-[#FF4F00] transition-colors font-[Mallanna] text-[13px] sm:text-[14px]">
                    Terms of Service
                  </a>
                </li>
              </ul>
              
              <div>
                <h5 className="font-bold font-[Lexend] text-[13px] sm:text-[14px] mb-2 sm:mb-3 text-white">Follow Us</h5>
                <div className="flex gap-3 sm:gap-4">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="#ffffff" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="#1DA1F2" viewBox="0 0 24 24">
                      <path fill="#ffffff" d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="#ffffff" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="#ffffff" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
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