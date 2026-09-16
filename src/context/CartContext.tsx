import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product, ProductVariation, ProductAddon, Coupon, DeliveryType, RestaurantSettings } from '../types';
import { subscribeSettings, subscribeCoupons } from '../services/dbService';
import { INITIAL_SETTINGS } from '../data/seedData';

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: Product,
    quantity: number,
    selectedVariation?: ProductVariation,
    selectedAddons?: ProductAddon[],
    spiceLevel?: number,
    specialInstructions?: string
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  deliveryType: DeliveryType;
  setDeliveryType: (type: DeliveryType) => void;
  coupon: Coupon | null;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  settings: RestaurantSettings;
  // Financial breakdown
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  freeDeliveryRemaining: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('dastaan_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('delivery');
  const [coupon, setCoupon] = useState<Coupon | null>(() => {
    try {
      const saved = localStorage.getItem('dastaan_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [settings, setSettings] = useState<RestaurantSettings>(INITIAL_SETTINGS);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    const unsubSettings = subscribeSettings(setSettings);
    const unsubCoupons = subscribeCoupons(setAvailableCoupons);
    return () => {
      unsubSettings();
      unsubCoupons();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('dastaan_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (coupon) {
      localStorage.setItem('dastaan_coupon', JSON.stringify(coupon));
    } else {
      localStorage.removeItem('dastaan_coupon');
    }
  }, [coupon]);

  const addToCart = (
    product: Product,
    quantity: number = 1,
    selectedVariation?: ProductVariation,
    selectedAddons: ProductAddon[] = [],
    spiceLevel: number = 2,
    specialInstructions: string = ''
  ) => {
    const basePrice = product.salePrice ?? product.price;
    const variationPriceDiff = selectedVariation?.priceDiff || 0;
    const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = Math.max(0, basePrice + variationPriceDiff + addonsTotal);
    const itemTotal = unitPrice * quantity;

    // Generate a unique key for grouping identical configurations
    const configKey = `${product.id}-${selectedVariation?.id || 'standard'}-${selectedAddons.map((a) => a.id).sort().join(',')}-${spiceLevel}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => {
        const itemKey = `${item.product.id}-${item.selectedVariation?.id || 'standard'}-${item.selectedAddons.map((a) => a.id).sort().join(',')}-${item.spiceLevel}`;
        return itemKey === configKey && (!specialInstructions || item.specialInstructions === specialInstructions);
      });

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          itemTotal: updated[existingIndex].unitPrice * newQty,
        };
        return updated;
      }

      const newItem: CartItem = {
        cartItemId: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        product,
        quantity,
        selectedVariation,
        selectedAddons,
        spiceLevel,
        specialInstructions,
        unitPrice,
        itemTotal,
      };
      return [...prev, newItem];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId
          ? {
              ...item,
              quantity,
              itemTotal: item.unitPrice * quantity,
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
  };

  // Calculations
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.itemTotal, 0);

  // Delivery fee logic
  const isFreeDelivery = deliveryType === 'pickup' || subtotal >= (settings.freeDeliveryThreshold || 2500);
  const deliveryFee = deliveryType === 'pickup' ? 0 : isFreeDelivery ? 0 : (settings.defaultDeliveryFee || 180);
  const freeDeliveryRemaining = Math.max(0, (settings.freeDeliveryThreshold || 2500) - subtotal);

  // Tax calculation (decimal safe)
  const taxRatePercent = settings.defaultTaxRate || 5.0;
  const tax = Math.round((subtotal * taxRatePercent) / 100);

  // Discount calculation
  let discount = 0;
  if (coupon && subtotal >= coupon.minOrder) {
    if (coupon.discountType === 'percentage') {
      const computed = Math.round((subtotal * coupon.value) / 100);
      discount = coupon.maxDiscount ? Math.min(computed, coupon.maxDiscount) : computed;
    } else {
      discount = coupon.value;
    }
  }

  const total = Math.max(0, subtotal + deliveryFee + tax - discount);

  const applyCouponCode = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const found = availableCoupons.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);

    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }

    if (subtotal < found.minOrder) {
      return {
        success: false,
        message: `Minimum order of PKR ${found.minOrder.toLocaleString()} required for this coupon.`,
      };
    }

    setCoupon(found);
    return {
      success: true,
      message: `Coupon ${found.code} applied successfully!`,
    };
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen(!isCartOpen),
        deliveryType,
        setDeliveryType,
        coupon,
        applyCouponCode,
        removeCoupon,
        settings,
        itemCount,
        subtotal,
        deliveryFee,
        tax,
        discount,
        total,
        freeDeliveryRemaining,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
