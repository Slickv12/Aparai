import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Linkedin, Instagram, Youtube } from 'lucide-react';
import ALogo from "../assets/ALogo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/',
      icon: Linkedin,
      className: 'from-emerald-600 to-green-700',
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/',
      icon: Instagram,
      className: 'from-emerald-500 to-lime-600',
    },
    {
      name: 'YouTube',
      href: 'https://www.youtube.com/',
      icon: Youtube,
      className: 'from-green-600 to-emerald-800',
    },
  ];

  return (
    <footer className="bg-slate-950 text-emerald-50 border-t border-emerald-500/20 mt-auto">
      <div className="section-padding py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <img src={ALogo} alt="Aparaitech Logo" className="h-10 w-auto object-contain" />
              <div>
                <span className="text-2xl font-bold text-emerald-200">Aparaitech</span>
                <span className="block text-sm text-emerald-400/80">Innovating Tomorrow</span>
              </div>
            </Link>
            <p className="text-emerald-100/80 mb-6">
              Building enterprise software solutions with cutting-edge technology and exceptional talent.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-emerald-200">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-emerald-100/80 hover:text-emerald-300 transition-colors">Home</Link></li>
              <li><Link to="/positions" className="text-emerald-100/80 hover:text-emerald-300 transition-colors">Open Positions</Link></li>
              <li><Link to="/apply" className="text-emerald-100/80 hover:text-emerald-300 transition-colors">Apply Now</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-emerald-200">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-emerald-300 mt-1" />
                <span className="text-emerald-100/80">SVPM College of Engineering, Malegaon BK, Baramati, Maharashtra</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-emerald-300" />
                <a href="mailto:info@aparaitech.org" className="text-emerald-100/80 hover:text-emerald-300 transition-colors">info@aparaitech.org</a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-emerald-300" />
                <span className="text-emerald-100/80">+91 63643 26342</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-emerald-200">Location Map</h3>
            <div className="rounded-xl overflow-hidden border border-emerald-500/30 shadow-lg shadow-emerald-500/10 mb-5">
              <iframe
                title="SVPM College of Engineering Location"
                src="https://www.google.com/maps?q=SVPM+College+of+Engineering+Baramati&output=embed"
                width="100%"
                height="170"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <h3 className="text-lg font-semibold mb-4 text-emerald-200">Follow Me</h3>
            <div className="flex space-x-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className={`group bg-gradient-to-br ${social.className} p-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5`}
                  >
                    <Icon className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-500/20 mt-8 pt-8 text-center text-emerald-100/70">
          <p>&copy; {currentYear} Aparaitech Technologies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
