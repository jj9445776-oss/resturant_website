export type Role = 'super_admin' | 'manager' | 'order_manager' | 'content_manager' | 'customer';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phone?: string;
  role: Role;
  savedAddresses?: DeliveryAddress[];
  createdAt: string;
  updatedAt?: string;
}

export interface DeliveryAddress {
  id: string;
  title: string; // e.g. "Home", "Office", "Gulberg Villa"
  city: string; // e.g. "Lahore", "Karachi", "Islamabad"
  area: string; // e.g. "DHA Phase 5", "Gulberg III", "F-7/2"
  streetAddress: string;
  landmark?: string;
  isDefault?: boolean;
}

export interface ProductVariation {
  id: string;
  name: string; // e.g. "Half (0.5 kg)", "Full (1.0 kg)"
  priceDiff: number; // + or - or absolute
}

export interface ProductAddon {
  id: string;
  name: string; // e.g. "Roghani Naan", "Zeera Raita", "Special Mint Chutney"
  nameUrdu?: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  nameUrdu: string;
  slug: string;
  category: string;
  description: string;
  shortDescription: string;
  price: number; // in PKR
  salePrice?: number;
  image: string;
  ingredients: string[];
  allergens?: string[];
  calories?: number;
  spicyLevel: 1 | 2 | 3 | 4; // 1: Mild, 2: Medium, 3: Desi Spicy, 4: Royal Fiery Karahi
  isVegetarian: boolean;
  isFeatured: boolean;
  isAvailable: boolean;
  prepTimeMinutes: number;
  addOns?: ProductAddon[];
  variations?: ProductVariation[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  nameUrdu: string;
  slug: string;
  description: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  quantity: number;
  selectedVariation?: ProductVariation;
  selectedAddons: ProductAddon[];
  spiceLevel: number;
  specialInstructions?: string;
  unitPrice: number;
  itemTotal: number;
}

export type DeliveryType = 'delivery' | 'pickup';
export type PaymentMethod = 'jazzcash' | 'easypaisa' | 'bank_transfer' | 'cod';
export type PaymentStatus = 'pending' | 'verified' | 'failed' | 'refunded';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string; // ORD-2026-XXXXXX
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryType: DeliveryType;
  deliveryAddress?: {
    city: string;
    area: string;
    streetAddress: string;
    landmark?: string;
    riderNote?: string;
  };
  branchId?: string;
  branchName?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  transactionId?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';

export interface Reservation {
  id: string;
  reservationNumber: string; // RES-2026-XXXX
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  guests: number;
  seatingArea: 'Grand Dining Hall' | 'Rooftop Starlit Terrace' | 'Royal Majlis (Dastarkhwan)' | 'Private VIP Family Suite';
  occasion?: string;
  specialRequest?: string;
  specialRequests?: string;
  branchId: string;
  branchName: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface CateringLead {
  id: string;
  name: string;
  company?: string;
  phone: string;
  email: string;
  eventType: string; // "Wedding / Valima", "Corporate Gala", "Qawwali Night", "Family Dawat"
  eventDate: string;
  guests: number;
  budgetRange: string;
  foodRequirements: string;
  message?: string;
  status: 'new' | 'contacted' | 'quoted' | 'confirmed' | 'closed';
  createdAt: string;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number; // 1-5
  comment: string;
  dishName?: string;
  isApproved: boolean;
  city?: string;
  createdAt: string;
}

export interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  openingHours: string;
  mapsUrl: string;
  deliveryAvailable: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number; // e.g. 15 for 15%, or 500 for 500 PKR off
  minOrder: number;
  maxDiscount?: number;
  expiryDate: string;
  usageLimit: number;
  timesUsed: number;
  isActive: boolean;
  createdAt: string;
}

export interface RestaurantSettings {
  id: string;
  restaurantName: string;
  tagline: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  address: string;
  currency: string;
  defaultTaxRate: number; // e.g. 5%
  defaultDeliveryFee: number; // e.g. 200 PKR
  freeDeliveryThreshold: number; // e.g. 2500 PKR
  minOrderAmount: number; // e.g. 800 PKR
  codEnabled: boolean;
  jazzCashEnabled: boolean;
  jazzCashAccountTitle: string;
  jazzCashAccountNumber: string;
  easyPaisaEnabled: boolean;
  easyPaisaAccountTitle: string;
  easyPaisaAccountNumber: string;
  bankTransferEnabled: boolean;
  bankName: string;
  bankAccountTitle: string;
  bankAccountNumber: string;
  bankIban: string;
  whatsappNotificationsEnabled: boolean;
  smsNotificationsEnabled: boolean;
  updatedAt?: string;
}

export interface AuditLog {
  id: string;
  adminEmail: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  timestamp: string;
}
