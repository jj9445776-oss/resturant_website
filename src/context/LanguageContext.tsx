import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ur';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: (key: string) => string;
}

const DICTIONARY: Record<string, { en: string; ur: string }> = {
  // Navigation
  home: { en: 'Home', ur: 'صفحۂ اول' },
  menu: { en: 'Royal Menu', ur: 'شاہی مینیو' },
  about: { en: 'Our Story', ur: 'ہماری داستان' },
  locations: { en: 'Locations', ur: 'برانچز' },
  reservations: { en: 'Table Booking', ur: 'میز بکنگ' },
  catering: { en: 'Royal Catering', ur: 'شاہی کیٹرنگ' },
  contact: { en: 'Contact', ur: 'رابطہ' },
  orderOnline: { en: 'Order Online', ur: 'آن لائن آرڈر' },
  cart: { en: 'Cart', ur: 'ٹوکری' },
  admin: { en: 'Admin Portal', ur: 'انتظامیہ' },
  profile: { en: 'Profile', ur: 'پروفائل' },
  login: { en: 'Sign In', ur: 'داخل ہوں' },
  logout: { en: 'Sign Out', ur: 'خارج ہوں' },

  // Hero
  heroTagline: { en: 'Royal Mughlai & Modern Desi Culinary Heritage', ur: 'روایت، ذائقہ اور شاہی مہمان نوازی' },
  heroHeadline: { en: 'CRAFTED WITH PASSION. SERVED WITH ROYAL PRIDE.', ur: 'شاہی ذائقہ، خالص اجزاء اور روایتی مہمان نوازی' },
  heroSubtext: {
    en: 'Experience the rich heritage of Pashtun iron-wok karahis, fragrant slow-dum biryanis, and flame-kissed sigri kebabs perfected over generations.',
    ur: 'شنواری لوہے کی کڑاہی، دیگچی دم بریانی اور کوئلہ سیگری کباب کا لازوال شاہی لطف اٹھائیں۔'
  },
  exploreMenu: { en: 'Explore Menu', ur: 'مینیو دیکھیں' },
  reserveTable: { en: 'Reserve a Table', ur: 'میز ریزرو کریں' },
  openNow: { en: 'Open Daily: 12:00 PM – 02:00 AM', ur: 'روزانہ: دوپہر 12 تا رات 2 بجے' },
  deliveryTime: { en: 'Average Delivery: 30–45 Mins', ur: 'اوسط ڈیلیوری: 30 تا 45 منٹ' },

  // Menu Filters
  allCategories: { en: 'All Categories', ur: 'تمام اقسام' },
  searchPlaceholder: { en: 'Search dishes (e.g. Mutton Karahi, Biryani, Naan)...', ur: 'ڈش تلاش کریں (مثلاً مٹن کڑاہی، بریانی)...' },
  spicyMild: { en: 'Mild', ur: 'ہلکا مصالحہ' },
  spicyMedium: { en: 'Medium Desi', ur: 'درمیانہ مصالحہ' },
  spicyHot: { en: 'Fiery Karahi', ur: 'تیز مصالحہ' },
  vegOnly: { en: 'Vegetarian Only', ur: 'صرف سبزی' },
  addToCart: { en: 'Add to Cart', ur: 'ٹوکری میں شامل کریں' },
  customize: { en: 'Customize', ur: 'ترتیب دیں' },
  pkr: { en: 'PKR', ur: 'روپے' },

  // Cart & Checkout
  yourCart: { en: 'Your Royal Dastarkhwan', ur: 'آپ کی شاہی ٹوکری' },
  subtotal: { en: 'Subtotal', ur: 'کل رقم' },
  deliveryFee: { en: 'Delivery Fee', ur: 'ڈیلیوری فیس' },
  tax: { en: 'Tax (PRA/SRB)', ur: 'ٹیکس' },
  discount: { en: 'Discount', ur: 'رعایت' },
  total: { en: 'Total Amount', ur: 'مکمل رقم' },
  checkout: { en: 'Proceed to Checkout', ur: 'چیک آؤٹ کریں' },
  applyCoupon: { en: 'Apply Coupon', ur: 'کوپن لگائیں' },
  freeDeliveryMsg: { en: 'Add more items for FREE delivery above PKR 2,500!', ur: '2,500 روپے سے زائد پر مفت ڈیلیوری!' },

  // Checkout
  delivery: { en: 'Delivery', ur: 'ہوم ڈیلیوری' },
  pickup: { en: 'Takeaway Pickup', ur: 'ریستوران سے پک اپ' },
  fullName: { en: 'Full Name', ur: 'پورا نام' },
  phoneNumber: { en: 'Mobile Number', ur: 'موبائل نمبر' },
  emailAddress: { en: 'Email Address', ur: 'ای میل' },
  city: { en: 'City', ur: 'شہر' },
  area: { en: 'Area / Sector', ur: 'علاقہ / سیکٹر' },
  streetAddress: { en: 'Street Address / House No', ur: 'گلی اور مکان نمبر' },
  landmark: { en: 'Nearest Landmark', ur: 'قریبی مشہور مقام' },
  riderNotes: { en: 'Delivery Instructions for Rider', ur: 'رائیڈر کے لیے ہدایات' },
  paymentMethod: { en: 'Payment Method', ur: 'طریقۂ ادائیگی' },
  placeOrder: { en: 'Confirm & Place Order', ur: 'آرڈر کنفرم کریں' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('dastaan_lang') as Language) || 'en';
  });

  const isRTL = language === 'ur';

  useEffect(() => {
    localStorage.setItem('dastaan_lang', language);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const t = (key: string): string => {
    return DICTIONARY[key]?.[language] || DICTIONARY[key]?.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
