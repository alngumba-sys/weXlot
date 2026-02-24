import { useState } from 'react';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-900 text-white py-2 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <a href="tel:+15551234567" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                <Phone size={14} />
                <span className="hidden sm:inline">+1 (555) 123-4567</span>
              </a>
              <a href="mailto:info@businessplatforms.com" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                <Mail size={14} />
                <span className="hidden sm:inline">info@businessplatforms.com</span>
              </a>
            </div>
            <div className="text-xs text-gray-400">
              Trusted by 1000+ Businesses Worldwide
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 bg-white shadow-md z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/" className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xl">BP</span>
                </div>
                <div className="hidden sm:block">
                  <div className="font-bold text-gray-900 text-lg leading-tight">Business Platforms</div>
                  <div className="text-xs text-gray-500">Integrated Business Solutions</div>
                </div>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <button
                onClick={() => scrollToSection('home')}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('platforms')}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Our Solutions
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Why Choose Us
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Contact
              </button>
              <a
                href="#contact"
                className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors font-medium"
              >
                Get Started
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden overflow-hidden border-t border-gray-200"
              >
                <div className="py-4 space-y-2">
                  <button
                    onClick={() => scrollToSection('home')}
                    className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    Home
                  </button>
                  <button
                    onClick={() => scrollToSection('platforms')}
                    className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    Our Solutions
                  </button>
                  <button
                    onClick={() => scrollToSection('about')}
                    className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    Why Choose Us
                  </button>
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    Contact
                  </button>
                  <a
                    href="#contact"
                    className="block w-full text-center bg-blue-600 text-white px-6 py-3 rounded mt-4"
                  >
                    Get Started
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>
    </>
  );
}
