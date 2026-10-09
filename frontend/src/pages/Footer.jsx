import {  Share2Icon, Inspect, Truck, MailCheck, PhoneCall } from 'lucide-react';
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white tracking-tight">STORE<span className="text-blue-500">NAME</span></h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your one-stop destination for premium products. Delivering excellence and quality right to your doorstep.
            </p>
          
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors duration-200">Shop All</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">New Arrivals</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Best Sellers</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Sale & Offers</a></li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Customer Care</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors duration-200">Contact Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Track Order</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">FAQs</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">Stay Updated</h3>
            <p className="text-sm text-slate-400">Subscribe to get special offers and free giveaways.</p>
            <form className="flex space-x-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter email" 
                className="w-full bg-slate-800 text-white px-4 py-2 rounded-md text-sm border border-slate-700 focus:outline-none focus:border-blue-500"
                required
              />
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Join
              </button>
            </form>
            <div className="space-y-2 pt-2 text-sm text-slate-400">
              <div className="flex items-center space-x-2">
                <MailCheck className="h-4 w-4 text-blue-500 shrink-0" />
                <span>support@storename.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneCall className="h-4 w-4 text-blue-500 shrink-0" />
                <span>+1 (555) 000-0000</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 space-y-4 md:space-y-0">
          <p>&copy; {new Date().getFullYear()} StoreName Inc. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
