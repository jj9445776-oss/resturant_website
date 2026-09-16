import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, Sparkles, ShoppingBag, Bike } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    deliveryFee,
    tax,
    discount,
    total,
    freeDeliveryRemaining,
    coupon,
    applyCouponCode,
    removeCoupon,
    deliveryType,
    setDeliveryType,
    settings,
  } = useCart();

  const { t } = useLanguage();
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ success: boolean; text: string } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCouponCode(couponInput);
    setCouponMsg({ success: res.success, text: res.message });
    if (res.success) setCouponInput('');
  };

  const freeDeliveryThreshold = settings.freeDeliveryThreshold || 2500;
  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  const formatPrice = (amount: number) => {
    if (settings.currency === '$' || amount < 100) {
      return `$${amount.toFixed(2)}`;
    }
    return `PKR ${amount.toLocaleString()}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-[#000000a6] backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#101017] border-l border-[#242432] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-[#20202c] flex items-center justify-between bg-[#0c0c12]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
              <h2 className="font-heading text-lg font-bold text-[#f5efe6]">
                {t('yourCart')}
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-lg text-[#9b99a8] hover:text-white hover:bg-[#1c1c28] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery / Pickup Switch */}
          <div className="p-3 bg-[#14141e] border-b border-[#1f1f2d]">
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#0b0b10] border border-[#262636]">
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  deliveryType === 'delivery'
                    ? 'bg-[#d4af37] text-[#0b0b0d] shadow'
                    : 'text-[#9c9aa8] hover:text-[#f5efe6]'
                }`}
              >
                <Bike className="w-3.5 h-3.5" />
                <span>Royal Delivery</span>
              </button>
              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  deliveryType === 'pickup'
                    ? 'bg-[#d4af37] text-[#0b0b0d] shadow'
                    : 'text-[#9c9aa8] hover:text-[#f5efe6]'
                }`}
              >
                <span>Takeaway Pickup</span>
              </button>
            </div>

            {/* Free Delivery Bar */}
            {deliveryType === 'delivery' && (
              <div className="mt-2.5 px-1">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-[#a09fae]">
                    {freeDeliveryRemaining > 0 ? (
                      <>Add <strong className="text-[#d4af37]">PKR {freeDeliveryRemaining.toLocaleString()}</strong> for Free Delivery</>
                    ) : (
                      <span className="text-[#4ade80] font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Free Royal Delivery Unlocked!
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] text-[#787786]">{progressPercent}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#20202c] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#d4af37] to-[#f9e295] rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-[#181824] flex items-center justify-center text-[#555466] mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-[#cfcbd9]">
                  Your Dastarkhwan is Empty
                </h3>
                <p className="text-xs text-[#7e7d8d] mt-1 max-w-xs">
                  Explore our royal selection of iron-wok karahis, dum biryanis, and flame-kissed kebabs.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="p-3 rounded-xl bg-[#151520] border border-[#232332] flex gap-3 relative group"
                >
                  {/* Dish Thumbnail */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover bg-[#1f1f2b] flex-shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-sm text-[#f5efe6] truncate pr-4">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-[#6d6c7b] hover:text-[#ef4444] transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Variation or Addons Tags */}
                    <div className="text-[11px] text-[#9b99a8] space-y-0.5 mt-0.5">
                      {item.selectedVariation && (
                        <div>Portion: <span className="text-[#d4af37]">{item.selectedVariation.name}</span></div>
                      )}
                      {item.selectedAddons.length > 0 && (
                        <div>
                          Addons: {item.selectedAddons.map((a) => a.name).join(', ')}
                        </div>
                      )}
                      {item.spiceLevel && (
                        <div>Spice: Level {item.spiceLevel}/4</div>
                      )}
                      {item.specialInstructions && (
                        <div className="italic text-[#7b7a89] truncate">
                          Note: "{item.specialInstructions}"
                        </div>
                      )}
                    </div>

                    {/* Quantity and Price */}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center border border-[#29293a] rounded-lg bg-[#111119]">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="p-1 text-[#a5a4b4] hover:text-white cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-[#f5efe6]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="p-1 text-[#a5a4b4] hover:text-white cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-heading font-bold text-sm text-[#d4af37]">
                        PKR {item.itemTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Coupon & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#20202c] bg-[#0c0c12] space-y-3">
              {/* Coupon Form */}
              <div>
                {coupon ? (
                  <div className="p-2.5 rounded-lg bg-[#1c2919] border border-[#22c55e40] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-[#4ade80]" />
                      <span className="font-bold text-[#4ade80]">{coupon.code}</span>
                      <span className="text-[#a7f3d0]">
                        (-PKR {discount.toLocaleString()})
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-[#ef4444] hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Coupon Code (e.g. WELCOME10)"
                      className="flex-1 px-3 py-1.5 rounded-lg bg-[#161622] border border-[#272737] text-xs text-[#f5efe6] placeholder-[#5f5e6e] focus:outline-none focus:border-[#d4af37]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-[#222230] hover:bg-[#d4af37] text-[#d4af37] hover:text-[#0b0b0d] text-xs font-bold transition-colors cursor-pointer border border-[#303042]"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponMsg && (
                  <p className={`text-[11px] mt-1 ${couponMsg.success ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                    {couponMsg.text}
                  </p>
                )}
              </div>

              {/* Cost Summary */}
              <div className="space-y-1.5 text-xs text-[#a09fae] pt-2 border-t border-[#1c1c28]">
                <div className="flex justify-between">
                  <span>{t('subtotal')}</span>
                  <span className="text-[#f5efe6] font-medium">{formatPrice(subtotal)}</span>
                </div>
                {deliveryType === 'delivery' && (
                  <div className="flex justify-between">
                    <span>{t('deliveryFee')}</span>
                    <span className="text-[#f5efe6] font-medium">
                      {deliveryFee === 0 ? <span className="text-[#4ade80]">FREE</span> : formatPrice(deliveryFee)}
                    </span>
                  </div>
                )}
                {tax > 0 && (
                  <div className="flex justify-between">
                    <span>{t('tax')} ({settings.defaultTaxRate || 8.5}%)</span>
                    <span className="text-[#f5efe6] font-medium">{formatPrice(tax)}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-[#4ade80]">
                    <span>{t('discount')}</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-[#f5efe6] pt-2 border-t border-[#1e1e2b]">
                  <span>{t('total')}</span>
                  <span className="font-heading text-base text-[#f59e0b]">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  closeCart();
                  onProceedToCheckout();
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#f59e0b] hover:bg-[#fbbf24] text-[#0b0b0d] font-bold text-sm transition-colors cursor-pointer shadow-lg flex items-center justify-center gap-2"
              >
                <span>{t('checkout')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
