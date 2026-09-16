import React from 'react';
import { BurgerFactoryLogo } from './BurgerFactoryLogo';
import { ShoppingBag, ChevronRight } from 'lucide-react';

interface FooterProps {
  setCurrentView: (view: string) => void;
  onOpenHostingerDocs?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView }) => {
  return (
    <footer className="bg-[#0b0b0e] text-white border-t border-[#1f1f28] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#1f1f28]">
          {/* Col 1: Brand Logo */}
          <div className="space-y-4">
            <BurgerFactoryLogo size="lg" />
            <p className="text-xs text-[#8e8d9e] leading-relaxed max-w-xs">
              Crafting premium 100% fresh Angus beef burgers, twice-cooked hand-cut fries, and thick hand-spun custard shakes since 2016.
            </p>
          </div>

          {/* Col 2: Quick Links (Exact match to screenshot) */}
          <div>
            <h4 className="font-display text-base font-bold uppercase tracking-wider text-white mb-4">
              QUICK LINKS
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-[#a09fae]">
              <button onClick={() => setCurrentView('home')} className="hover:text-[#f59e0b] text-left transition-colors cursor-pointer">
                Home
              </button>
              <button onClick={() => setCurrentView('catering')} className="hover:text-[#f59e0b] text-left transition-colors cursor-pointer">
                Catering
              </button>
              <button onClick={() => setCurrentView('menu')} className="hover:text-[#f59e0b] text-left transition-colors cursor-pointer">
                Menu
              </button>
              <button onClick={() => setCurrentView('menu')} className="hover:text-[#f59e0b] text-left transition-colors cursor-pointer">
                Order Online
              </button>
              <button onClick={() => setCurrentView('about')} className="hover:text-[#f59e0b] text-left transition-colors cursor-pointer">
                About Us
              </button>
              <button onClick={() => setCurrentView('about')} className="hover:text-[#f59e0b] text-left transition-colors cursor-pointer">
                Careers
              </button>
              <button onClick={() => setCurrentView('locations')} className="hover:text-[#f59e0b] text-left transition-colors cursor-pointer">
                Locations
              </button>
              <button onClick={() => setCurrentView('about')} className="hover:text-[#f59e0b] text-left transition-colors cursor-pointer">
                Contact
              </button>
            </div>
          </div>

          {/* Col 3: Opening Hours (Exact match to screenshot) */}
          <div>
            <h4 className="font-display text-base font-bold uppercase tracking-wider text-white mb-4">
              OPENING HOURS
            </h4>
            <div className="space-y-2 text-xs text-[#a09fae]">
              <div className="flex justify-between">
                <span>Mon – Thu</span>
                <span className="font-medium text-white">11:00 AM – 10:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Fri – Sat</span>
                <span className="font-medium text-white">11:00 AM – 11:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span className="font-medium text-white">11:00 AM – 9:00 PM</span>
              </div>
            </div>
          </div>

          {/* Col 4: Follow Us & Order Online Card (Exact match to screenshot) */}
          <div className="space-y-4">
            <h4 className="font-display text-base font-bold uppercase tracking-wider text-white">
              FOLLOW US
            </h4>
            {/* Social Icons */}
            <div className="flex items-center gap-2.5">
              {['f', 'ig', 'tt', 'yt'].map((social) => (
                <div
                  key={social}
                  className="w-8 h-8 rounded-full bg-[#1b1b24] hover:bg-[#f59e0b] hover:text-[#0b0b0e] text-[#a09fae] flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                >
                  {social === 'f' && 'f'}
                  {social === 'ig' && ''}
                  {social === 'tt' && '🎵'}
                  {social === 'yt' && '▶'}
                </div>
              ))}
            </div>

            {/* ORDER AHEAD & SKIP THE LINE card matching the screenshot */}
            <button
              onClick={() => setCurrentView('menu')}
              className="w-full p-3 rounded-xl bg-[#181822] hover:bg-[#20202c] border border-[#2b2b3b] text-left flex items-center justify-between group transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#f59e0b] flex items-center justify-center text-[#0b0b0e]">
                  <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#a09fae] block">
                    Order Ahead & Skip The Line!
                  </span>
                  <span className="font-display text-sm font-bold text-white group-hover:text-[#f59e0b] transition-colors">
                    ORDER ONLINE
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#a09fae] group-hover:text-[#f59e0b] transition-colors" />
            </button>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 text-center text-xs text-[#6e6d7d]">
          © 2024 Burger Factory. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};
