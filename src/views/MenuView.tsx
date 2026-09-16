import React, { useState, useMemo } from 'react';
import { Search, Flame, SlidersHorizontal, Sparkles, Filter, X } from 'lucide-react';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';

interface MenuViewProps {
  products: Product[];
  categories: Category[];
  onOpenProductDetails: (product: Product) => void;
}

export const MenuView: React.FC<MenuViewProps> = ({
  products,
  categories,
  onOpenProductDetails,
}) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegetarianOnly, setVegetarianOnly] = useState(false);
  const [chefSpecialOnly, setChefSpecialOnly] = useState(false);
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc'>('recommended');

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category match
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchUrdu = item.nameUrdu.includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchIng = item.ingredients.some((i) => i.toLowerCase().includes(query));
        if (!matchName && !matchUrdu && !matchDesc && !matchIng) return false;
      }
      // Vegetarian filter
      if (vegetarianOnly && !item.isVegetarian) {
        return false;
      }
      // Chef Special filter
      if (chefSpecialOnly && !item.isFeatured) {
        return false;
      }
      // Spice level
      if (selectedSpiceLevel !== null && item.spicyLevel !== selectedSpiceLevel) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice ?? a.price;
      const priceB = b.salePrice ?? b.price;
      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      return 0; // default
    });
  }, [products, selectedCategory, searchQuery, vegetarianOnly, chefSpecialOnly, selectedSpiceLevel, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto pt-4">
        <p className="font-urdu text-xl text-[#d4af37]">شاہی دسترخوان مینیو</p>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-[#f5efe6] mt-1">
          The Royal Dastaan Menu
        </h1>
        <p className="text-sm text-[#9c9aa8] mt-2">
          Prepared with pristine ingredients, fresh cuts of meat, and unhurried culinary devotion.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <Search className="w-5 h-5 text-[#888796] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-[#14141d] border border-[#272737] text-sm text-[#f5efe6] placeholder-[#626171] focus:outline-none focus:border-[#d4af37] shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7f7e8e] hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills (Horizontal Scrollable) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar pt-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#d4af37] text-[#0b0b0d] shadow-md font-bold'
                : 'bg-[#151520] text-[#9c9aa8] hover:bg-[#1f1f2d] hover:text-[#f5efe6] border border-[#242434]'
            }`}
          >
            {t('allCategories')} ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.slug
                  ? 'bg-[#d4af37] text-[#0b0b0d] shadow-md font-bold'
                  : 'bg-[#151520] text-[#9c9aa8] hover:bg-[#1f1f2d] hover:text-[#f5efe6] border border-[#242434]'
              }`}
            >
              <span>{cat.name}</span>
              {cat.nameUrdu && (
                <span className="font-urdu text-xs opacity-75">
                  ({cat.nameUrdu})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Secondary Filters Bar */}
        <div className="p-3 rounded-2xl bg-[#12121a] border border-[#20202c] flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setVegetarianOnly(!vegetarianOnly)}
              className={`px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${
                vegetarianOnly
                  ? 'bg-[#14532d] text-[#86efac] border-[#22c55e]'
                  : 'bg-[#181824] text-[#8d8c9c] border-[#29293a] hover:text-[#f5efe6]'
              }`}
            >
              🥗 Vegetarian Only
            </button>

            <button
              onClick={() => setChefSpecialOnly(!chefSpecialOnly)}
              className={`px-3 py-1.5 rounded-lg border cursor-pointer transition-all flex items-center gap-1 ${
                chefSpecialOnly
                  ? 'bg-[#29200d] text-[#f3c64c] border-[#d4af37]'
                  : 'bg-[#181824] text-[#8d8c9c] border-[#29293a] hover:text-[#f5efe6]'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#d4af37]" />
              <span>Chef's Signature</span>
            </button>

            {/* Spice Filter Dropdown */}
            <div className="flex items-center gap-1 bg-[#181824] px-2.5 py-1.5 rounded-lg border border-[#29293a]">
              <Flame className="w-3.5 h-3.5 text-[#ef4444]" />
              <select
                value={selectedSpiceLevel ?? ''}
                onChange={(e) =>
                  setSelectedSpiceLevel(e.target.value ? Number(e.target.value) : null)
                }
                className="bg-transparent text-xs text-[#a09fae] focus:outline-none cursor-pointer"
              >
                <option value="" className="bg-[#181824]">All Spice Levels</option>
                <option value="1" className="bg-[#181824]">Mild (ہلکا)</option>
                <option value="2" className="bg-[#181824]">Medium (درمیانہ)</option>
                <option value="3" className="bg-[#181824]">Desi Spicy (تیز)</option>
                <option value="4" className="bg-[#181824]">Fiery Karahi (کڑاہی)</option>
              </select>
            </div>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-[#7d7c8b]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg bg-[#181824] border border-[#29293a] text-xs text-[#d4af37] focus:outline-none cursor-pointer font-medium"
            >
              <option value="recommended" className="bg-[#181824]">Chef Recommendation</option>
              <option value="price-asc" className="bg-[#181824]">Price: Low to High</option>
              <option value="price-desc" className="bg-[#181824]">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Results Grid */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#12121a] border border-[#222230]">
          <p className="text-base text-[#d4af37] font-urdu">معذرت، کوئی ڈش دستیاب نہیں</p>
          <h3 className="font-heading text-lg font-bold text-[#f5efe6] mt-1">
            No Dishes Match Your Selection
          </h3>
          <p className="text-xs text-[#848393] mt-1">
            Try adjusting your search keywords or resetting dietary filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setVegetarianOnly(false);
              setChefSpecialOnly(false);
              setSelectedSpiceLevel(null);
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#222230] text-xs font-semibold text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0b0b0d] transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div>
          <p className="text-xs text-[#7e7d8d] mb-4">
            Showing <strong className="text-[#f5efe6]">{filteredProducts.length}</strong> royal dishes
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetails={onOpenProductDetails}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
