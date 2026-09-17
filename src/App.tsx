import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { HostingerDocsModal } from './views/HostingerDocsModal';
import { AuthModal } from './components/AuthModal';

// Views
import { HomeView } from './views/HomeView';
import { MenuView } from './views/MenuView';
import { CheckoutView } from './views/CheckoutView';
import { ReservationsView } from './views/ReservationsView';
import { CateringView } from './views/CateringView';
import { OrderTrackingView } from './views/OrderTrackingView';
import { ProfileView } from './views/ProfileView';
import { AboutLocationsView } from './views/AboutLocationsView';
import { AdminView } from './views/AdminView';

// Services & Seed data
import {
  subscribeProducts,
  subscribeCategories,
  subscribeOrders,
  subscribeReservations,
  subscribeCoupons,
  subscribeBranches,
  subscribeReviews,
  subscribeCateringLeads,
  subscribeSettings,
  subscribeAuditLogs,
} from './services/dbService';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_BRANCHES,
  INITIAL_REVIEWS,
  INITIAL_SETTINGS,
  INITIAL_COUPONS,
} from './data/seedData';
import {
  Product,
  Category,
  Order,
  Reservation,
  Coupon,
  Branch,
  Review,
  CateringLead,
  RestaurantSettings,
  AuditLog,
} from './types';

function AppContent() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState<string>('');
  const [isHostingerDocsOpen, setIsHostingerDocsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Firestore Real-Time State (with rich fallback seed data)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [cateringLeads, setCateringLeads] = useState<CateringLead[]>([]);
  const [settings, setSettings] = useState<RestaurantSettings>(INITIAL_SETTINGS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    const unsubProducts = subscribeProducts((data) => {
      if (data && data.length > 0) setProducts(data);
    });
    const unsubCategories = subscribeCategories((data) => {
      if (data && data.length > 0) setCategories(data);
    });
    const unsubOrders = subscribeOrders(setOrders);
    const unsubReservations = subscribeReservations(setReservations);
    const unsubCoupons = subscribeCoupons((data) => {
      if (data && data.length > 0) setCoupons(data);
    });
    const unsubBranches = subscribeBranches((data) => {
      if (data && data.length > 0) setBranches(data);
    });
    const unsubReviews = subscribeReviews((data) => {
      if (data && data.length > 0) setReviews(data);
    });
    const unsubCatering = subscribeCateringLeads(setCateringLeads);
    const unsubSettings = subscribeSettings((data) => {
      if (data && Object.keys(data).length > 0) setSettings(data);
    });
    const unsubAudit = subscribeAuditLogs(setAuditLogs);

    return () => {
      unsubProducts();
      unsubCategories();
      unsubOrders();
      unsubReservations();
      unsubCoupons();
      unsubBranches();
      unsubReviews();
      unsubCatering();
      unsubSettings();
      unsubAudit();
    };
  }, []);

  const handleOrderPlaced = (order: Order) => {
    setPlacedOrder(order);
    setTrackingOrderNumber(order.orderNumber);
  };

  const handleTrackOrder = (orderNumber: string) => {
    setTrackingOrderNumber(orderNumber);
    setCurrentView('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-[#e8e5dc] font-sans flex flex-col selection:bg-[#d4af37] selection:text-[#0b0b0d]">
      {/* Sticky Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenHostingerDocs={() => setIsHostingerDocsOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            products={products}
            onNavigate={setCurrentView}
            onOpenProductDetails={setSelectedProduct}
          />
        )}

        {currentView === 'menu' && (
          <MenuView
            products={products}
            categories={categories}
            onOpenProductDetails={setSelectedProduct}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutView
            onBackToMenu={() => setCurrentView('menu')}
            onOrderPlaced={handleOrderPlaced}
          />
        )}

        {currentView === 'reservations' && (
          <ReservationsView branches={branches} />
        )}

        {currentView === 'catering' && <CateringView />}

        {currentView === 'track' && (
          <OrderTrackingView
            initialOrderNumber={trackingOrderNumber}
            allOrders={orders}
          />
        )}

        {currentView === 'profile' && (
          <ProfileView
            orders={orders}
            reservations={reservations}
            onTrackOrder={handleTrackOrder}
            onNavigateToMenu={() => setCurrentView('menu')}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {(currentView === 'about' || currentView === 'locations') && (
          <AboutLocationsView branches={branches} />
        )}

        {currentView === 'admin' && (
          <AdminView
            products={products}
            categories={categories}
            orders={orders}
            reservations={reservations}
            coupons={coupons}
            branches={branches}
            reviews={reviews}
            cateringLeads={cateringLeads}
            settings={settings}
            auditLogs={auditLogs}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        setCurrentView={setCurrentView}
        onOpenHostingerDocs={() => setIsHostingerDocsOpen(true)}
      />

      {/* Cart Drawer */}
      <CartDrawer onProceedToCheckout={() => setCurrentView('checkout')} />

      {/* Product Customization Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Order Success Receipt Modal */}
      <OrderSuccessModal
        order={placedOrder}
        settings={settings}
        onClose={() => setPlacedOrder(null)}
        onTrackOrder={handleTrackOrder}
      />

      {/* Hostinger Deployment Guide Modal */}
      {isHostingerDocsOpen && (
        <HostingerDocsModal onClose={() => setIsHostingerDocsOpen(false)} />
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </CartProvider>
    </AuthProvider>
  );
}
