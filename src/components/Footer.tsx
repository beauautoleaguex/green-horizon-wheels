
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Tag, Wrench, DollarSign, Shield, Info, MapPin } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-8">
          {/* Logo */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <img 
                src="/lovable-uploads/d99fbaef-645b-46ba-975c-5b747c2667b9.png" 
                alt="mymoto" 
                className="h-8" 
              />
            </Link>
            <p className="text-gray-500 text-sm mt-4">
              Find your perfect ride with mymoto, your trusted partner in automotive excellence.
            </p>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Vehicle</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-500 hover:text-brand-green text-sm flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Buy</span>
                </Link>
              </li>
              <li>
                <Link to="/sell" className="text-gray-500 hover:text-brand-green text-sm flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <span>Sell</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/service" className="text-gray-500 hover:text-brand-green text-sm flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  <span>Servicing & Parts</span>
                </Link>
              </li>
              <li>
                <Link to="/finance" className="text-gray-500 hover:text-brand-green text-sm flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Finance</span>
                </Link>
              </li>
              <li>
                <Link to="/warranty" className="text-gray-500 hover:text-brand-green text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Warranty</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-gray-500 hover:text-brand-green text-sm flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  <span>Help & Support</span>
                </Link>
              </li>
              <li>
                <Link to="/locations" className="text-gray-500 hover:text-brand-green text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Find a Location</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-gray-900 mb-4">Contact Us</h3>
            <p className="text-gray-500 text-sm mb-2">
              Need help finding your ideal vehicle?
            </p>
            <p className="text-gray-500 text-sm">
              Email: <a href="mailto:contact@mymoto.com" className="text-brand-green hover:underline">contact@mymoto.com</a>
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Phone: <a href="tel:+1234567890" className="text-brand-green hover:underline">+1 (234) 567-890</a>
            </p>
          </div>
        </div>

        {/* Bottom copyright section */}
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {currentYear} mymoto. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-500 hover:text-brand-green text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-brand-green text-sm">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
