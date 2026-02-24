import { motion } from 'motion/react';
import { Shield, Zap, Users, HeadphonesIcon, Award, TrendingUp } from 'lucide-react';

export function About() {
  const features = [
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and security protocols protecting your sensitive business data 24/7.',
    },
    {
      icon: Zap,
      title: 'Lightning Performance',
      description: 'Optimized infrastructure ensuring your operations run smoothly without interruption.',
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Dedicated specialists with deep industry knowledge supporting your success.',
    },
    {
      icon: HeadphonesIcon,
      title: '24/7 Support',
      description: 'Round-the-clock assistance ensuring you always have help when you need it.',
    },
    {
      icon: Award,
      title: 'Industry Leading',
      description: 'Award-winning platforms trusted by businesses across multiple industries.',
    },
    {
      icon: TrendingUp,
      title: 'Proven Results',
      description: 'Track record of delivering measurable ROI and business growth for our clients.',
    },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            WHY CHOOSE US
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Built on Trust, Driven by Results
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We understand that choosing the right business platform is critical. 
            That's why we've built our reputation on reliability, innovation, and unwavering support.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white border border-gray-200 p-8 rounded-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center mb-5">
                <feature.icon className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Image Section with Stats */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mt-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1758691736975-9f7f643d178e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb3Jwb3JhdGUlMjBvZmZpY2UlMjB0ZWFtfGVufDF8fHx8MTc3MTE3NzU2Mnww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Professional team collaboration"
              className="rounded-lg shadow-xl"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                A Partner You Can Rely On
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                For over a decade, we've been helping businesses transform their operations 
                through innovative technology solutions. Our commitment to excellence and 
                client success has made us a trusted partner for organizations worldwide.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Whether you're a startup or an enterprise, our scalable platforms grow with 
                your business, ensuring you always have the tools you need to succeed.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-4xl font-bold text-blue-600 mb-2">10+</div>
                <div className="text-sm text-gray-700">Years of Excellence</div>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
                <div className="text-sm text-gray-700">Countries Served</div>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-4xl font-bold text-blue-600 mb-2">1M+</div>
                <div className="text-sm text-gray-700">Transactions Daily</div>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
                <div className="text-sm text-gray-700">System Uptime</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
