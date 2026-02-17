import { motion } from 'motion/react';
import { LucideIcon, ArrowRight, ExternalLink } from 'lucide-react';

interface Benefit {
  text: string;
}

interface PlatformCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  benefits: Benefit[];
  link: string;
  image: string;
}

export function PlatformCard({
  icon: Icon,
  title,
  description,
  benefits,
  link,
  image,
}: PlatformCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-200"
    >
      {/* Image Section with Overlay */}
      <div className="relative h-56 overflow-hidden bg-gray-900">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        
        {/* Icon Overlay */}
        <div className="absolute top-6 left-6">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <Icon className="text-white" size={32} />
          </div>
        </div>

        {/* Title on Image */}
        <div className="absolute bottom-6 left-6 right-6">
          <h3 className="text-2xl font-bold text-white">{title}</h3>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        <p className="text-gray-600 leading-relaxed">{description}</p>

        {/* Benefits */}
        <div className="space-y-3 pt-2">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
              </div>
              <span className="text-sm text-gray-700">{benefit.text}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex items-center justify-between w-full bg-gray-900 text-white px-6 py-3 rounded hover:bg-blue-600 transition-all font-medium group/btn"
        >
          <span>Learn More</span>
          <ExternalLink className="group-hover/btn:translate-x-1 transition-transform" size={18} />
        </a>
      </div>
    </motion.div>
  );
}
