import React, { useState } from 'react';
import {
  ShoppingBag,
  User as UserIcon,
  Shield,
  Menu as MenuIcon,
  X,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BurgerFactoryLogo } from './BurgerFactoryLogo';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenHostingerDocs: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView, onOpenHostingerDocs }) => {
  const { itemCount, total, openCart } = useCart();
  const { currentUser, role, isAdmin, loginWithGoogle, logout, simulateRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'HOME' },
    { id: 'menu', label: 'MENU' },
    { id: 'about', label: 'ABOUT US' },
    { id: 'locations', label: 'LOCATIONS' },
    { id: 'catering', label: 'CATERING' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const handleNavClick = (viewId: string) => {
    setCurrentView(viewId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0c0c0e]/95 backdrop-blur-md border-b border-[#212128] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo (Exact match to screenshot) */}
          <button
            onClick={() => handleNavClick('home')}
            className="focus:outline-none cursor-pointer group"
          >
            <BurgerFactoryLogo size="md" />
          </button>

          {/* Desktop Nav Links (HOME, MENU, ABOUT US, LOCATIONS, CATERING, CONTACT) */}
          <nav className="hidden md:flex items-center space-x-7 lg:space-x-9">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-xs lg:text-[13px] font-bold tracking-wider transition-colors cursor-pointer py-1 relative ${
                  currentView === link.id
                    ? 'text-[#f59e0b]'
                    : 'text-white/85 hover:text-[#f59e0b]'
                }`}
              >
                {link.label}
                {currentView === link.id && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#f59e0b] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Right Action: ORDER ONLINE Button + Cart Drawer + Admin Toggle */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* "ORDER ONLINE" Yellow Pill Button matching the screenshot */}
            <button
              onClick={() => handleNavClick('menu')}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-[#f59e0b] hover:bg-[#fbbf24] text-[#0f0f12] font-display text-sm sm:text-base font-bold tracking-wider transition-all duration-200 shadow-lg shadow-[#f59e0b]/20 hover:scale-[1.02] cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              <span>ORDER ONLINE</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-lg bg-[#191922] hover:bg-[#232330] text-white border border-[#2c2c3a] transition-all cursor-pointer"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#f59e0b]" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 rounded-full bg-[#f59e0b] text-[#0d0d0f] font-bold text-[11px] flex items-center justify-center shadow-md animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Admin Switcher Icon */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`p-2.5 rounded-lg transition-colors cursor-pointer ${
                currentView === 'admin'
                  ? 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]'
                  : 'bg-[#191922] text-[#8e8d9e] hover:text-white border border-[#2c2c3a]'
              }`}
              title="Admin & Operations Management"
            >
              <Shield className="w-5 h-5" />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-[#191922] text-white border border-[#2c2c3a] cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0e0e12] border-b border-[#242430] px-4 py-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left px-3 py-2 rounded-lg text-sm font-bold tracking-wider ${
                  currentView === link.id
                    ? 'bg-[#f59e0b] text-[#0f0f12]'
                    : 'text-white hover:bg-[#1a1a24]'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick('admin')}
              className="text-left px-3 py-2 rounded-lg text-sm font-bold tracking-wider text-[#f59e0b] bg-[#1d1d28]"
            >
              ADMIN PORTAL
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
