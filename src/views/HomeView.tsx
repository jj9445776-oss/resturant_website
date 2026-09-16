import React, { useState } from 'react';
import {
  MapPin,
  ArrowRight,
  Star,
  Sparkles,
  ShoppingBag,
  Layers,
  CheckCircle2,
  ChevronRight,
  Utensils,
  Coffee,
  Heart,
} from 'lucide-react';
import { ThreeBurgerHero } from '../components/ThreeBurgerHero';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface HomeViewProps {
  products: Product[];
  onNavigate: (view: string) => void;
  onOpenProductDetails: (product: Product) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  onNavigate,
  onOpenProductDetails,
}) => {
  const { addToCart } = useCart();
  const [use3DView, setUse3DView] = useState<boolean>(true);
  const [mealAddedNotice, setMealAddedNotice] = useState<boolean>(false);

  // Get the 4 exact favorites from screenshot
  const favoriteBurgers = [
    products.find((p) => p.slug === 'classic-cheeseburger') || products[0],
    products.find((p) => p.slug === 'bbq-bacon-burger') || products[1],
    products.find((p) => p.slug === 'avocado-ranch-burger') || products[2],
    products.find((p) => p.slug === 'spicy-jalapeno-burger') || products[3],
  ].filter(Boolean) as Product[];

  const handleAddMealCombo = () => {
    const mealUpgradeItem = products.find((p) => p.category === 'combos') || {
      id: 'bf-meal-upgrade',
      name: 'Make It A Meal Combo Upgrade',
      nameUrdu: 'میل کمبو',
      slug: 'make-it-a-meal-combo',
      category: 'combos',
      description: 'Hand-cut fries and fountain drink upgrade.',
      shortDescription: 'Add fries & a drink for just $3.99',
      price: 3.99,
      image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=800&q=80',
      ingredients: ['Hand-Cut Fries', 'Fountain Drink'],
      spicyLevel: 1,
      isVegetarian: true,
      isFeatured: true,
      isAvailable: true,
      prepTimeMinutes: 4,
      createdAt: '2026-09-01T00:00:00Z',
    };

    addToCart(mealUpgradeItem as Product, 1);
    setMealAddedNotice(true);
    setTimeout(() => setMealAddedNotice(false), 2500);
  };

  return (
    <div className="w-full bg-[#0d0d0f] text-white">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (EXACT REPLICA OF ATTACHED SCREENSHOT + 3D ANIMATED BURGER) */}
      {/* ========================================================================= */}
      <section className="relative min-h-[85vh] lg:min-h-[92vh] bg-[#0c0c0e] flex items-center overflow-hidden pt-8 pb-16 lg:py-20 border-b border-[#1b1b22]">
        {/* Subtle warm ambient spotlight centered behind burger */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#f59e0b]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#f59e0b]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Column: Typography & Call to Actions */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* Script tagline with sunburst accents */}
              <div className="flex items-center gap-2 text-[#f59e0b]">
                <span className="text-sm">✦</span>
                <span className="font-script text-2xl sm:text-3xl text-[#f59e0b] tracking-wide">
                  Made Fresh. Made to Crave.
                </span>
                <span className="text-sm font-script text-[#f59e0b] -rotate-12">
                  \ | /
                </span>
              </div>

              {/* Massive Main Headline */}
              <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase leading-[0.92]">
                BURGERS <br />
                DONE <span className="text-[#f59e0b]">RIGHT</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-[#b0aebb] font-medium max-w-lg leading-relaxed">
                100% fresh beef, bold flavors, crispy fries, and shakes that hit the spot.
              </p>

              {/* Action Buttons (VIEW MENU + FIND A LOCATION) */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5 sm:gap-4">
                {/* Yellow VIEW MENU button with burger icon */}
                <button
                  onClick={() => onNavigate('menu')}
                  className="px-6 sm:px-7 py-3.5 rounded-lg bg-[#f59e0b] hover:bg-[#fbbf24] text-[#0d0d0f] font-display text-base sm:text-lg font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all duration-200 shadow-xl shadow-[#f59e0b]/25 hover:scale-[1.02] cursor-pointer"
                >
                  <span>VIEW MENU</span>
                  {/* Mini burger icon */}
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-[#0d0d0f]" stroke="currentColor" strokeWidth="2.5">
                    <path d="M4 8C4 5.79086 5.79086 4 8 4H16C18.2091 4 20 5.79086 20 8V9H4V8Z" fill="currentColor" />
                    <rect x="3" y="11.5" width="18" height="2" rx="1" fill="currentColor" />
                    <path d="M4 15H20V17C20 18.6569 18.6569 20 17 20H7C5.34315 20 4 18.6569 4 17V15Z" fill="currentColor" />
                  </svg>
                </button>

                {/* Dark outlined FIND A LOCATION button with map pin */}
                <button
                  onClick={() => onNavigate('locations')}
                  className="px-6 sm:px-7 py-3.5 rounded-lg bg-transparent hover:bg-[#1c1c24] text-white border-2 border-[#363644] hover:border-[#f59e0b]/60 font-display text-base sm:text-lg font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all duration-200 cursor-pointer"
                >
                  <span>FIND A LOCATION</span>
                  <MapPin className="w-4 h-4 text-[#f59e0b]" />
                </button>
              </div>

              {/* Star Ratings: 4.8 (2,500+ Reviews) */}
              <div className="pt-2 flex items-center gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-1 text-[#f59e0b]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#f59e0b]" />
                  ))}
                </div>
                <span className="font-bold text-white tracking-wide">
                  4.8 <span className="text-[#8e8d9e] font-normal">(2,500+ Reviews)</span>
                </span>
              </div>
            </div>

            {/* Right Column: 3D ANIMATED BURGER ON RUSTIC PLATTER + CIRCULAR STAMP */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              {/* View Switcher: Interactive 3D Model vs Photo mode */}
              <div className="absolute top-2 right-2 z-30 flex items-center gap-1 bg-[#14141a]/90 backdrop-blur border border-[#2b2b3b] p-1 rounded-lg text-xs">
                <button
                  onClick={() => setUse3DView(true)}
                  className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer ${
                    use3DView ? 'bg-[#f59e0b] text-[#0d0d0f]' : 'text-[#8e8d9e] hover:text-white'
                  }`}
                >
                  3D Animated
                </button>
                <button
                  onClick={() => setUse3DView(false)}
                  className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer ${
                    !use3DView ? 'bg-[#f59e0b] text-[#0d0d0f]' : 'text-[#8e8d9e] hover:text-white'
                  }`}
                >
                  Photo View
                </button>
              </div>

              {/* The Burger Display */}
              {use3DView ? (
                <div className="w-full flex items-center justify-center">
                  <ThreeBurgerHero
                    onOrderClick={() => onNavigate('menu')}
                  />
                </div>
              ) : (
                /* High-Res Static Photography (matching the exact hero photograph) */
                <div className="relative w-full max-w-lg aspect-square flex items-center justify-center py-6">
                  <img
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=90"
                    alt="Burger Done Right - 100% Fresh Angus Beef"
                    className="w-full h-auto max-h-[500px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              {/* Rotating Circular Stamp: "100% FRESH BEEF - NEVER FROZEN" (Exact match to screenshot) */}
              <div className="absolute bottom-6 right-2 sm:right-6 z-20 pointer-events-none">
                <div className="relative w-24 sm:w-28 h-24 sm:h-28 rounded-full border-2 border-[#f59e0b]/80 bg-[#121217]/95 shadow-2xl flex flex-col items-center justify-center text-center p-2 text-[#f59e0b]">
                  {/* Subtle inner ring */}
                  <div className="absolute inset-1 rounded-full border border-dashed border-[#f59e0b]/40" />
                  <span className="font-display text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#f59e0b] leading-tight">
                    100% <br /> FRESH BEEF
                  </span>
                  {/* Mini beef icon */}
                  <div className="w-5 h-1.5 bg-[#f59e0b] rounded-full my-1 opacity-90" />
                  <span className="font-display text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white leading-tight">
                    NEVER FROZEN
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. FOUR FEATURE HIGHLIGHTS BAR (EXACT MATCH TO SCREENSHOT)               */}
      {/* ========================================================================= */}
      <section className="bg-[#121216] border-b border-[#21212b] py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {/* 1. PREMIUM QUALITY */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#1a1a24] border border-[#2b2b3b] flex items-center justify-center shrink-0 text-[#f59e0b]">
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 stroke-current" strokeWidth="2">
                  <path d="M4 9C4 6.79086 5.79086 5 8 5H16C18.2091 5 20 6.79086 20 9V10H4V9Z" />
                  <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2" />
                  <line x1="4" y1="15" x2="20" y2="15" strokeWidth="2" />
                  <path d="M5 17C5 18.6569 6.34315 20 8 20H16C17.6569 20 19 18.6569 19 17V17H5V17Z" />
                </svg>
              </div>
              <div>
                <h4 className="font-display text-sm sm:text-base font-bold uppercase tracking-wide text-white">
                  PREMIUM QUALITY
                </h4>
                <p className="text-xs text-[#8e8d9e] mt-0.5 leading-relaxed">
                  100% fresh, never frozen Angus beef.
                </p>
              </div>
            </div>

            {/* 2. HAND-CUT FRIES */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#1a1a24] border border-[#2b2b3b] flex items-center justify-center shrink-0 text-[#f59e0b]">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display text-sm sm:text-base font-bold uppercase tracking-wide text-white">
                  HAND-CUT FRIES
                </h4>
                <p className="text-xs text-[#8e8d9e] mt-0.5 leading-relaxed">
                  Crispy, golden and seasoned to perfection.
                </p>
              </div>
            </div>

            {/* 3. HAND-SPUN SHAKES */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#1a1a24] border border-[#2b2b3b] flex items-center justify-center shrink-0 text-[#f59e0b]">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display text-sm sm:text-base font-bold uppercase tracking-wide text-white">
                  HAND-SPUN SHAKES
                </h4>
                <p className="text-xs text-[#8e8d9e] mt-0.5 leading-relaxed">
                  Thick, creamy shakes made fresh daily.
                </p>
              </div>
            </div>

            {/* 4. MADE FRESH DAILY */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#1a1a24] border border-[#2b2b3b] flex items-center justify-center shrink-0 text-[#f59e0b]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display text-sm sm:text-base font-bold uppercase tracking-wide text-white">
                  MADE FRESH DAILY
                </h4>
                <p className="text-xs text-[#8e8d9e] mt-0.5 leading-relaxed">
                  Quality ingredients, delivered fresh.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CUSTOMER FAVORITES (LIGHT PAPER BACKGROUND MATCHING SCREENSHOT)       */}
      {/* ========================================================================= */}
      <section className="bg-[#f7f6f2] text-[#111115] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="font-script text-2xl sm:text-3xl text-[#f59e0b] block -mb-1">
                Our Menu
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-wide text-[#111115]">
                CUSTOMER FAVORITES
              </h2>
            </div>

            {/* VIEW FULL MENU -> button */}
            <button
              onClick={() => onNavigate('menu')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#d4d1c9] hover:border-[#111115] bg-white font-display text-xs sm:text-sm font-bold uppercase tracking-wider text-[#111115] hover:bg-[#111115] hover:text-white transition-all cursor-pointer shadow-sm self-start sm:self-auto"
            >
              <span>VIEW FULL MENU</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 4 Cards Grid (Classic Cheeseburger, BBQ Bacon Burger, Avocado Ranch Burger, Spicy Jalapeño Burger) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoriteBurgers.map((burger) => (
              <ProductCard
                key={burger.id}
                product={burger}
                onOpenDetails={onOpenProductDetails}
                variant="favorite"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. DUAL SPLIT BANNER: "MAKE IT A MEAL!" & "BURGERS BUILT ON PASSION"      */}
      {/* ========================================================================= */}
      <section className="w-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Half (Dark Charcoal): MAKE IT A MEAL! */}
        <div className="lg:col-span-6 bg-[#0f0f12] p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#22222c]">
          <div className="relative z-10">
            <span className="font-script text-2xl sm:text-3xl text-[#f59e0b] block">
              Make it a
            </span>
            <div className="flex items-baseline gap-3">
              <h3 className="font-display text-5xl sm:text-7xl font-black text-white tracking-tight leading-none">
                MEAL!
              </h3>
              <span className="text-xl sm:text-2xl text-[#f59e0b] font-script">
                \ | /
              </span>
            </div>
            <p className="text-sm sm:text-base text-[#b4b2c2] mt-3 font-medium">
              Add fries &amp; a drink for just{' '}
              <span className="font-display text-2xl sm:text-3xl font-bold text-[#f59e0b] ml-1">
                $3.99
              </span>
            </p>

            <button
              onClick={handleAddMealCombo}
              className="mt-6 px-6 py-2.5 rounded-lg bg-[#f59e0b] hover:bg-[#fbbf24] text-[#0f0f12] font-display text-sm font-bold uppercase tracking-wider transition-all duration-200 shadow-md cursor-pointer inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>ADD MEAL UPGRADE</span>
            </button>

            {mealAddedNotice && (
              <div className="mt-3 text-xs text-[#4ade80] flex items-center gap-1.5 font-bold animate-bounce">
                <CheckCircle2 className="w-4 h-4" />
                <span>Meal Combo added to cart!</span>
              </div>
            )}
          </div>

          {/* Visual of Burger + Fries + Drink Cup */}
          <div className="mt-8 flex items-end justify-center">
            <img
              src="https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=800&q=80"
              alt="Burger Factory Meal Combo with Fries & Drink"
              className="max-h-64 object-contain rounded-2xl drop-shadow-[0_15px_25px_rgba(0,0,0,0.7)]"
            />
          </div>
        </div>

        {/* Right Half (Warm Mustard / Golden Yellow): ABOUT US / BURGERS BUILT ON PASSION */}
        <div className="lg:col-span-6 bg-[#f59e0b] text-[#0f0f12] p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 max-w-lg">
            <span className="font-script text-2xl sm:text-3xl text-[#1a1a20] block font-bold">
              About Us
            </span>
            <h3 className="font-display text-4xl sm:text-6xl font-black text-[#0f0f12] tracking-tight uppercase leading-[0.95] mt-1 mb-4">
              BURGERS BUILT <br /> ON PASSION
            </h3>
            <p className="text-sm sm:text-base text-[#1c1a17] font-medium leading-relaxed mb-8">
              We started with a simple idea: create the best burgers using honest ingredients and real flavors. Every burger we serve is made fresh to order, because you deserve better.
            </p>

            <button
              onClick={() => onNavigate('about')}
              className="px-7 py-3 rounded-lg bg-[#0f0f12] hover:bg-[#23232c] text-white font-display text-sm sm:text-base font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer shadow-lg"
            >
              <span>OUR STORY</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Circular Stamp: REAL INGREDIENTS / REAL GOOD Burgers with crossed spatulas */}
          <div className="mt-8 sm:mt-12 flex justify-end">
            <div className="relative w-32 sm:w-36 h-32 sm:h-36 rounded-full border-2 border-[#0f0f12] flex flex-col items-center justify-center text-center p-2 text-[#0f0f12]">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase leading-tight">
                REAL INGREDIENTS
              </span>
              {/* Crossed spatula & fork SVG */}
              <div className="my-1.5 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 stroke-current" strokeWidth="2">
                  <line x1="4" y1="4" x2="20" y2="20" />
                  <line x1="20" y1="4" x2="4" y2="20" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                </svg>
              </div>
              <span className="font-script text-xl sm:text-2xl leading-none font-bold">
                Real Good
              </span>
              <span className="font-display text-sm font-bold uppercase tracking-wider leading-none">
                Burgers
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
