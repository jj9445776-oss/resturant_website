import React, { useState } from 'react';
import { X, Flame, Plus, Minus, Check, Clock, Sparkles } from 'lucide-react';
import { Product, ProductVariation, ProductAddon } from '../types';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();

  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | undefined>(
    product.variations && product.variations.length > 0 ? product.variations[0] : undefined
  );
  const [selectedAddons, setSelectedAddons] = useState<ProductAddon[]>([]);
  const [spiceLevel, setSpiceLevel] = useState<number>(product.spicyLevel || 2);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const toggleAddon = (addon: ProductAddon) => {
    setSelectedAddons((prev) =>
      prev.some((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const basePrice = product.salePrice ?? product.price;
  const variationPrice = selectedVariation?.priceDiff || 0;
  const addonsPrice = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = Math.max(0, basePrice + variationPrice + addonsPrice);
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    addToCart(
      product,
      quantity,
      selectedVariation,
      selectedAddons,
      spiceLevel,
      specialInstructions
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000ba] backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#12121a] border border-[#2d2d3d] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#00000088] text-white hover:bg-[#d4af37] hover:text-[#0b0b0d] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          {/* Hero Image */}
          <div className="relative h-64 sm:h-72 w-full bg-[#181824]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] via-[#12121a20] to-transparent" />
            <div className="absolute bottom-4 left-6 right-6">
              <p className="font-urdu text-lg text-[#d4af37]">{product.nameUrdu}</p>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#f5efe6]">
                {product.name}
              </h2>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Description & Quick Info */}
            <div>
              <p className="text-sm text-[#b2b0be] leading-relaxed">
                {product.description}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#9d9ba9]">
                <div className="flex items-center gap-1 bg-[#1a1a26] px-2.5 py-1 rounded-md border border-[#28283a]">
                  <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Prep: {product.prepTimeMinutes} mins</span>
                </div>
                {product.calories && (
                  <div className="bg-[#1a1a26] px-2.5 py-1 rounded-md border border-[#28283a]">
                    <span>{product.calories} kcal</span>
                  </div>
                )}
                {product.isVegetarian && (
                  <div className="bg-[#14532d] text-[#86efac] px-2.5 py-1 rounded-md font-semibold">
                    Vegetarian
                  </div>
                )}
              </div>
            </div>

            {/* Ingredients */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#d4af37] mb-2">
                  Key Ingredients &amp; Aromatics
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {product.ingredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-full bg-[#191924] text-[#cfcbd9] border border-[#242434]"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Portion / Variation Selector */}
            {product.variations && product.variations.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#d4af37] mb-2">
                  Select Portion Size
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {product.variations.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariation(v)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        selectedVariation?.id === v.id
                          ? 'border-[#d4af37] bg-[#221e10] text-[#f5efe6]'
                          : 'border-[#262636] bg-[#161622] text-[#9f9dae] hover:border-[#38384d]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{v.name}</span>
                        {selectedVariation?.id === v.id && (
                          <Check className="w-4 h-4 text-[#d4af37]" />
                        )}
                      </div>
                      <span className="text-xs text-[#d4af37] mt-1 block">
                        {v.priceDiff > 0 ? `+PKR ${v.priceDiff.toLocaleString()}` : 'Base Price'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Spice Level Customization */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#d4af37] mb-2 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#ef4444]" />
                <span>Custom Spice Intensity</span>
              </h4>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[
                  { level: 1, label: 'Mild (ہلکا)' },
                  { level: 2, label: 'Medium (درمیانہ)' },
                  { level: 3, label: 'Desi Spicy (تیز)' },
                  { level: 4, label: 'Royal Fiery (کڑاہی)' },
                ].map((item) => (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => setSpiceLevel(item.level)}
                    className={`py-2 px-1 rounded-lg border text-center cursor-pointer transition-all ${
                      spiceLevel === item.level
                        ? 'border-[#d4af37] bg-[#261f0d] text-[#f3c64c] font-bold'
                        : 'border-[#262636] bg-[#161622] text-[#8e8d9e]'
                    }`}
                  >
                    <div>{item.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Add-ons */}
            {product.addOns && product.addOns.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#d4af37] mb-2">
                  Optional Sides &amp; Breads
                </h4>
                <div className="space-y-2">
                  {product.addOns.map((addon) => {
                    const isSelected = selectedAddons.some((a) => a.id === addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-[#d4af37] bg-[#221e10]'
                            : 'border-[#262636] bg-[#161622] hover:border-[#38384d]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                              isSelected ? 'bg-[#d4af37] border-[#d4af37]' : 'border-[#3f3f52]'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#0b0b0d]" />}
                          </div>
                          <div>
                            <span className="text-sm font-medium text-[#eae5d9]">{addon.name}</span>
                            {addon.nameUrdu && (
                              <span className="text-xs text-[#d4af37] ml-2 font-urdu">
                                {addon.nameUrdu}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-[#d4af37]">
                          +PKR {addon.price.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div>
              <label
                htmlFor="dish-instructions"
                className="block text-xs font-semibold uppercase tracking-wider text-[#a4a2b2] mb-1.5"
              >
                Special Preparation Note for the Chef
              </label>
              <textarea
                id="dish-instructions"
                rows={2}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Less oil, extra ginger juliennes, separate raita..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#161622] border border-[#28283a] text-sm text-[#f5efe6] placeholder-[#5f5e6d] focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>
        </div>

        {/* Modal Sticky Footer */}
        <div className="p-4 sm:p-5 bg-[#0e0e15] border-t border-[#262636] flex items-center justify-between gap-4">
          {/* Quantity selector */}
          <div className="flex items-center border border-[#2e2e42] rounded-xl bg-[#151520] p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1.5 rounded-lg text-[#b8b6c4] hover:text-[#d4af37] hover:bg-[#20202e] cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-9 text-center font-bold text-sm text-[#f5efe6]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1.5 rounded-lg text-[#b8b6c4] hover:text-[#d4af37] hover:bg-[#20202e] cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Submit */}
          <button
            onClick={handleAdd}
            className="flex-1 py-3.5 px-5 rounded-xl bg-[#f59e0b] hover:bg-[#fbbf24] text-[#0b0b0d] font-bold text-sm transition-all duration-200 cursor-pointer shadow-lg flex items-center justify-between"
          >
            <span className="font-display uppercase tracking-wider">Add to Order</span>
            <span className="font-display font-bold text-base tracking-wide">
              {totalPrice < 100 ? `$${totalPrice.toFixed(2)}` : `PKR ${totalPrice.toLocaleString()}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
