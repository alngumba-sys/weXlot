import { ShoppingCart, Pill, DollarSign, Scissors, CreditCard } from 'lucide-react';
import { PlatformCard } from './PlatformCard';

export function Platforms() {
  const platforms = [
    {
      icon: ShoppingCart,
      title: 'Sales Platform',
      description: 'Comprehensive CRM and sales management system designed to increase revenue and streamline your sales operations.',
      benefits: [
        { text: 'Advanced customer relationship management' },
        { text: 'Real-time sales pipeline tracking' },
        { text: 'Automated reporting and analytics' },
        { text: 'Mobile-first sales enablement' },
      ],
      link: 'https://sales.example.com',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwc2FsZXMlMjBhbmFseXRpY3MlMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzcxMjMwOTM3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      icon: Pill,
      title: 'Pharmacy Platform',
      description: 'Complete pharmacy management solution ensuring regulatory compliance and operational excellence in healthcare.',
      benefits: [
        { text: 'Integrated prescription management' },
        { text: 'Regulatory compliance automation' },
        { text: 'Inventory optimization and tracking' },
        { text: 'Patient safety and record keeping' },
      ],
      link: 'https://pharmacy.example.com',
      image: 'https://images.unsplash.com/photo-1577368211130-4bbd0181ddf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGFybWFjeSUyMG1lZGljaW5lJTIwaGVhbHRoY2FyZXxlbnwxfHx8fDE3NzExMjE5MDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      icon: DollarSign,
      title: 'Loans Platform',
      description: 'Streamlined loan processing and management system with advanced risk assessment and digital documentation.',
      benefits: [
        { text: 'Automated loan application workflow' },
        { text: 'Advanced credit scoring algorithms' },
        { text: 'Secure digital document management' },
        { text: 'Integrated payment processing' },
      ],
      link: 'https://loans.example.com',
      image: 'https://images.unsplash.com/photo-1770958420778-0d1f5a524ecf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBsb2FucyUyMG1vbmV5fGVufDF8fHx8MTc3MTIzMDkzOHww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      icon: Scissors,
      title: 'Barbershop & Salons Platform',
      description: 'Professional salon management system for scheduling, customer management, and business analytics.',
      benefits: [
        { text: 'Intelligent booking and scheduling' },
        { text: 'Comprehensive staff management' },
        { text: 'Customer history and preferences' },
        { text: 'Integrated inventory control' },
      ],
      link: 'https://salons.example.com',
      image: 'https://images.unsplash.com/photo-1759134155377-4207d89b39ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJiZXJzaG9wJTIwc2Fsb24lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzEyMzA5Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      icon: CreditCard,
      title: 'POS Platform',
      description: 'Modern point-of-sale system with comprehensive inventory management and real-time business intelligence.',
      benefits: [
        { text: 'Multi-channel payment processing' },
        { text: 'Real-time inventory synchronization' },
        { text: 'Advanced sales analytics dashboard' },
        { text: 'Integrated loyalty programs' },
      ],
      link: 'https://pos.example.com',
      image: 'https://images.unsplash.com/photo-1614068979501-5608bdfaa4bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2ludCUyMG9mJTIwc2FsZSUyMHJldGFpbHxlbnwxfHx8fDE3NzEyMzA5Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  return (
    <section id="platforms" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            OUR SOLUTIONS
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Integrated Business Platforms
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trusted by industry leaders worldwide. Our specialized platforms deliver 
            measurable results across diverse business sectors.
          </p>
        </div>

        {/* Platform Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {platforms.map((platform, index) => (
            <PlatformCard key={index} {...platform} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">
            Need a custom solution? Our team can help you find the perfect fit for your business.
          </p>
          <a
            href="#contact"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded hover:bg-blue-700 transition-colors font-semibold"
          >
            Schedule a Consultation
          </a>
        </div>
      </div>
    </section>
  );
}
