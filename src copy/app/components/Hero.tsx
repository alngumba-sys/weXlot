import { motion } from 'motion/react';
import { ArrowRight, Shield, Award, CheckCircle2 } from 'lucide-react';

export function Hero() {
  const scrollToPlatforms = () => {
    const element = document.getElementById('platforms');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Comprehensive Business Solutions
                <span className="text-blue-400"> You Can Trust</span>
              </h1>
              
              <p className="text-xl text-gray-300 leading-relaxed">
                Empowering businesses across multiple industries with integrated, 
                reliable, and secure platforms designed for growth and efficiency.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Shield className="text-blue-400" size={20} />
                <span className="text-sm">Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="text-blue-400" size={20} />
                <span className="text-sm">Industry Leading</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-blue-400" size={20} />
                <span className="text-sm">99.9% Uptime</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={scrollToPlatforms}
                className="group bg-blue-600 text-white px-8 py-4 rounded hover:bg-blue-700 transition-all font-semibold flex items-center justify-center gap-2"
              >
                Explore Solutions
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
              
              <a
                href="#contact"
                className="border-2 border-white text-white px-8 py-4 rounded hover:bg-white hover:text-gray-900 transition-all font-semibold text-center"
              >
                Request Consultation
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-700">
              <div>
                <div className="text-3xl font-bold text-blue-400">1000+</div>
                <div className="text-sm text-gray-400">Active Clients</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400">5</div>
                <div className="text-sm text-gray-400">Industries Served</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400">24/7</div>
                <div className="text-sm text-gray-400">Support Available</div>
              </div>
            </div>
          </motion.div>

          {/* Right Image/Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1696861273647-92dfe8bb697c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMGhhbmRzaGFrZSUyMHRydXN0fGVufDF8fHx8MTc3MTIzMTQ1OHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Professional Business Partnership"
                className="rounded-lg shadow-2xl"
              />
              
              {/* Floating Stats Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 bg-white text-gray-900 rounded-lg shadow-xl p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="text-white" size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-2xl">98%</div>
                    <div className="text-sm text-gray-600">Client Satisfaction</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
