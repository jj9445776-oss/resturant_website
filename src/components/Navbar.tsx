import React, { useState } from 'react';
import {
  ShoppingBag,
  User as UserIcon,
  Shield,
  Menu as MenuIcon,
  X,
  Calendar,
  Sparkles,
  LogIn,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BurgerFactoryLogo } from './BurgerFactoryLogo';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenHostingerDocs: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenHostingerDocs,
  onOpenAuthModal,
}) => {
  const { itemCount } = useCart();
  const { currentUser, userProfile, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'HOME' },
    { id: 'menu', label: 'MENU' },
    { id: 'reservations', label: 'RESERVATIONS' },
    { id: 'about', label: 'ABOUT US' },
    { id: 'locations', label: 'LOCATIONS' },
    { id: 'catering', label: 'CATERING' },
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
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="focus:outline-none cursor-pointer group"
            id="nav-brand-logo-btn"
          >
            <BurgerFactoryLogo size="md" />
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-xs lg:text-[13px] font-bold tracking-wider transition-colors cursor-pointer py-1 relative ${
                  currentView === link.id
                    ? 'text-[#f59e0b]'
                    : 'text-white/85 hover:text-[#f59e0b]'
                }`}
                id={`nav-link-${link.id}`}
              >
                {link.label}
                {currentView === link.id && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#f59e0b] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2.5 sm:space-x-3.5">
            {/* User Profile / Sign In */}
            {currentUser ? (
              <button
                onClick={() => handleNavClick('profile')}
                className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl transition cursor-pointer border ${
                  currentView === 'profile'
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'bg-[#181822] text-stone-200 border-[#2b2b3a] hover:border-amber-500/40'
                }`}
                title="Customer Profile & Order History"
                id="nav-user-profile-btn"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="User Avatar"
                    className="w-7 h-7 rounded-lg object-cover border border-amber-500/50"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
                    {(userProfile?.displayName || currentUser.displayName || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:inline text-xs font-semibold max-w-[90px] truncate">
                  {userProfile?.displayName || currentUser.displayName || 'Patron'}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#181822] hover:bg-[#20202e] text-amber-400 border border-amber-500/30 text-xs font-bold transition cursor-pointer"
                id="nav-sign-in-btn"
              >
                <LogIn size={15} />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* "ORDER ONLINE" Yellow Button */}
            <button
              onClick={() => handleNavClick('menu')}
              className="flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-[#f59e0b] hover:bg-[#fbbf24] text-[#0f0f12] font-display text-xs sm:text-sm font-bold tracking-wider transition-all duration-200 shadow-lg shadow-[#f59e0b]/20 hover:scale-[1.02] cursor-pointer"
              id="nav-order-online-btn"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">ORDER ONLINE</span>
              <span className="sm:hidden">MENU</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setCurrentView('checkout')}
              className="relative p-2.5 rounded-lg bg-[#191922] hover:bg-[#232330] text-white border border-[#2c2c3a] transition-all cursor-pointer"
              aria-label="View Shopping Cart"
              id="nav-cart-btn"
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
              title="Admin Portal & Operations"
              id="nav-admin-btn"
            >
              <Shield className="w-5 h-5" />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-[#191922] text-white border border-[#2c2c3a] cursor-pointer"
              aria-label="Toggle navigation menu"
              id="nav-mobile-toggle-btn"
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
                id={`mobile-nav-${link.id}`}
              >
                {link.label}
              </button>
            ))}

            {currentUser ? (
              <button
                onClick={() => handleNavClick('profile')}
                className="text-left px-3 py-2 rounded-lg text-sm font-bold tracking-wider text-amber-400 bg-[#1d1d28] flex items-center justify-between"
                id="mobile-nav-profile"
              >
                <span>MY PROFILE &amp; ORDERS</span>
                <UserIcon size={16} />
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal();
                }}
                className="text-left px-3 py-2 rounded-lg text-sm font-bold tracking-wider text-amber-400 bg-[#1d1d28] flex items-center justify-between"
                id="mobile-nav-signin"
              >
                <span>SIGN IN / REGISTER</span>
                <LogIn size={16} />
              </button>
            )}

            <button
              onClick={() => handleNavClick('admin')}
              className="text-left px-3 py-2 rounded-lg text-sm font-bold tracking-wider text-[#f59e0b] bg-[#1d1d28] flex items-center justify-between"
              id="mobile-nav-admin"
            >
              <span>ADMIN PORTAL</span>
              <Shield size={16} />
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
