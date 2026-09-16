import React from 'react';
import { Plus } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  variant?: 'favorite' | 'catalog';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  variant = 'favorite',
}) => {
  const { addToCart } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ((product.variations && product.variations.length > 0) || (product.addOns && product.addOns.length > 0)) {
      onOpenDetails(product);
    } else {
      addToCart(product, 1);
    }
  };

  const formattedPrice = typeof product.price === 'number' 
    ? (product.price < 50 ? `$${product.price.toFixed(2)}` : `PKR ${product.price.toLocaleString()}`)
    : `$${product.price}`;

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-[#eae8e4] hover:border-[#f59e0b]/40 flex flex-col justify-between cursor-pointer hover:-translate-y-1.5"
    >
      {/* Product Image Container */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden rounded-xl bg-[#1a1a22] mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        {product.isFeatured && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-[#f59e0b] text-[#0f0f12] shadow">
            Top Pick
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-display text-lg sm:text-xl font-bold uppercase tracking-wide text-[#111115] group-hover:text-[#d97706] transition-colors leading-tight">
            {product.name}
          </h3>
          <p className="text-xs text-[#52525b] mt-1.5 leading-relaxed line-clamp-2">
            {product.shortDescription || product.description}
          </p>
        </div>

        {/* Pricing & Add to Cart Circle Button (Exact match to screenshot) */}
        <div className="mt-4 pt-3 flex items-center justify-between">
          <span className="font-display text-xl font-bold text-[#f59e0b]">
            {formattedPrice}
          </span>

          <button
            onClick={handleQuickAdd}
            className="w-8 h-8 rounded-full bg-[#111115] hover:bg-[#f59e0b] text-white hover:text-[#0f0f12] flex items-center justify-center transition-all duration-200 shadow-md hover:scale-110 cursor-pointer"
            aria-label={`Add ${product.name} to order`}
            title="Add to order"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};

