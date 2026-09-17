import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  limit,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
  Product,
  Category,
  Order,
  Reservation,
  CateringLead,
  Review,
  Branch,
  Coupon,
  RestaurantSettings,
  AuditLog,
  UserProfile,
  PaymentRecord,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_BRANCHES,
  INITIAL_COUPONS,
  INITIAL_SETTINGS,
  INITIAL_REVIEWS,
} from '../data/seedData';

// Local storage fallback cache keys for instant offline / fallback readiness
const CACHE_KEYS = {
  products: 'dastaan_products_cache',
  categories: 'dastaan_categories_cache',
  branches: 'dastaan_branches_cache',
  coupons: 'dastaan_coupons_cache',
  settings: 'dastaan_settings_cache',
  orders: 'dastaan_orders_cache',
  reservations: 'dastaan_reservations_cache',
};

// Seed initial database if empty
export async function seedInitialDataIfEmpty(): Promise<void> {
  try {
    const productsSnap = await getDocs(collection(db, 'products'));
    if (productsSnap.empty) {
      console.log('Seeding initial Dastaan restaurant data to Firestore...');
      // Seed products
      for (const prod of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), prod);
      }
      // Seed categories
      for (const cat of INITIAL_CATEGORIES) {
        await setDoc(doc(db, 'categories', cat.id), cat);
      }
      // Seed branches
      for (const branch of INITIAL_BRANCHES) {
        await setDoc(doc(db, 'branches', branch.id), branch);
      }
      // Seed coupons
      for (const coup of INITIAL_COUPONS) {
        await setDoc(doc(db, 'coupons', coup.id), coup);
      }
      // Seed reviews
      for (const rev of INITIAL_REVIEWS) {
        await setDoc(doc(db, 'reviews', rev.id), rev);
      }
      // Seed settings
      await setDoc(doc(db, 'settings', INITIAL_SETTINGS.id), INITIAL_SETTINGS);
      console.log('Database seeding completed.');
    }
  } catch (error) {
    console.warn('Initial seeding check skipped or permission locked:', error);
  }
}

// Ensure initial run
seedInitialDataIfEmpty().catch(console.warn);

// ================= PRODUCT SERVICES =================
export function subscribeProducts(onUpdate: (products: Product[]) => void): () => void {
  const path = 'products';
  try {
    return onSnapshot(
      collection(db, path),
      (snap) => {
        if (!snap.empty) {
          const list = snap.docs.map((d) => d.data() as Product);
          localStorage.setItem(CACHE_KEYS.products, JSON.stringify(list));
          onUpdate(list);
        } else {
          // Fallback to initial if database hasn't populated yet
          const cached = localStorage.getItem(CACHE_KEYS.products);
          onUpdate(cached ? JSON.parse(cached) : INITIAL_PRODUCTS);
        }
      },
      (error) => {
        console.warn('Products snapshot notice:', error.message);
        const cached = localStorage.getItem(CACHE_KEYS.products);
        onUpdate(cached ? JSON.parse(cached) : INITIAL_PRODUCTS);
      }
    );
  } catch (err) {
    const cached = localStorage.getItem(CACHE_KEYS.products);
    onUpdate(cached ? JSON.parse(cached) : INITIAL_PRODUCTS);
    return () => {};
  }
}

export async function saveProduct(product: Product): Promise<void> {
  const path = `products/${product.id}`;
  try {
    await setDoc(doc(db, 'products', product.id), product);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  const path = `products/${productId}`;
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ================= CATEGORIES SERVICES =================
export function subscribeCategories(onUpdate: (categories: Category[]) => void): () => void {
  const path = 'categories';
  try {
    return onSnapshot(
      collection(db, path),
      (snap) => {
        if (!snap.empty) {
          const list = snap.docs.map((d) => d.data() as Category);
          list.sort((a, b) => a.displayOrder - b.displayOrder);
          localStorage.setItem(CACHE_KEYS.categories, JSON.stringify(list));
          onUpdate(list);
        } else {
          const cached = localStorage.getItem(CACHE_KEYS.categories);
          onUpdate(cached ? JSON.parse(cached) : INITIAL_CATEGORIES);
        }
      },
      () => {
        const cached = localStorage.getItem(CACHE_KEYS.categories);
        onUpdate(cached ? JSON.parse(cached) : INITIAL_CATEGORIES);
      }
    );
  } catch {
    const cached = localStorage.getItem(CACHE_KEYS.categories);
    onUpdate(cached ? JSON.parse(cached) : INITIAL_CATEGORIES);
    return () => {};
  }
}

export async function saveCategory(category: Category): Promise<void> {
  const path = `categories/${category.id}`;
  try {
    await setDoc(doc(db, 'categories', category.id), category);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ================= ORDERS SERVICES =================
export function subscribeOrders(onUpdate: (orders: Order[]) => void): () => void {
  const path = 'orders';
  try {
    return onSnapshot(
      collection(db, path),
      (snap) => {
        const list = snap.docs.map((d) => d.data() as Order);
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        localStorage.setItem(CACHE_KEYS.orders, JSON.stringify(list));
        onUpdate(list);
      },
      (error) => {
        console.warn('Orders snapshot notice:', error.message);
        const cached = localStorage.getItem(CACHE_KEYS.orders);
        if (cached) onUpdate(JSON.parse(cached));
      }
    );
  } catch {
    return () => {};
  }
}

export async function createOrder(order: Order): Promise<void> {
  const path = `orders/${order.id}`;
  try {
    await setDoc(doc(db, 'orders', order.id), order);
    // update local cache
    const existingStr = localStorage.getItem(CACHE_KEYS.orders);
    const existing: Order[] = existingStr ? JSON.parse(existingStr) : [];
    localStorage.setItem(CACHE_KEYS.orders, JSON.stringify([order, ...existing.filter((o) => o.id !== order.id)]));
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateOrderStatus(orderId: string, status: Order['orderStatus']): Promise<void> {
  const path = `orders/${orderId}`;
  try {
    await updateDoc(doc(db, 'orders', orderId), {
      orderStatus: status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function updateOrderPayment(orderId: string, paymentStatus: Order['paymentStatus'], transactionId?: string): Promise<void> {
  const path = `orders/${orderId}`;
  try {
    await updateDoc(doc(db, 'orders', orderId), {
      paymentStatus,
      ...(transactionId ? { transactionId } : {}),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// ================= RESERVATIONS SERVICES =================
export function subscribeReservations(onUpdate: (reservations: Reservation[]) => void): () => void {
  const path = 'reservations';
  try {
    return onSnapshot(
      collection(db, path),
      (snap) => {
        const list = snap.docs.map((d) => d.data() as Reservation);
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        localStorage.setItem(CACHE_KEYS.reservations, JSON.stringify(list));
        onUpdate(list);
      },
      (error) => {
        console.warn('Reservations snapshot notice:', error.message);
        const cached = localStorage.getItem(CACHE_KEYS.reservations);
        if (cached) onUpdate(JSON.parse(cached));
      }
    );
  } catch {
    return () => {};
  }
}

export async function createReservation(res: Reservation): Promise<void> {
  const path = `reservations/${res.id}`;
  try {
    await setDoc(doc(db, 'reservations', res.id), res);
    const existingStr = localStorage.getItem(CACHE_KEYS.reservations);
    const existing: Reservation[] = existingStr ? JSON.parse(existingStr) : [];
    localStorage.setItem(CACHE_KEYS.reservations, JSON.stringify([res, ...existing.filter((r) => r.id !== res.id)]));
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateReservationStatus(resId: string, status: Reservation['status']): Promise<void> {
  const path = `reservations/${resId}`;
  try {
    await updateDoc(doc(db, 'reservations', resId), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// ================= CATERING LEADS =================
export function subscribeCateringLeads(onUpdate: (leads: CateringLead[]) => void): () => void {
  const path = 'catering_leads';
  try {
    return onSnapshot(
      collection(db, path),
      (snap) => {
        const list = snap.docs.map((d) => d.data() as CateringLead);
        onUpdate(list);
      },
      () => {}
    );
  } catch {
    return () => {};
  }
}

export async function createCateringLead(lead: CateringLead): Promise<void> {
  const path = `catering_leads/${lead.id}`;
  try {
    await setDoc(doc(db, 'catering_leads', lead.id), lead);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateCateringLeadStatus(leadId: string, status: CateringLead['status']): Promise<void> {
  const path = `catering_leads/${leadId}`;
  try {
    await updateDoc(doc(db, 'catering_leads', leadId), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// ================= BRANCHES =================
export function subscribeBranches(onUpdate: (branches: Branch[]) => void): () => void {
  const path = 'branches';
  try {
    return onSnapshot(
      collection(db, path),
      (snap) => {
        if (!snap.empty) {
          onUpdate(snap.docs.map((d) => d.data() as Branch));
        } else {
          onUpdate(INITIAL_BRANCHES);
        }
      },
      () => onUpdate(INITIAL_BRANCHES)
    );
  } catch {
    onUpdate(INITIAL_BRANCHES);
    return () => {};
  }
}

// ================= COUPONS =================
export function subscribeCoupons(onUpdate: (coupons: Coupon[]) => void): () => void {
  const path = 'coupons';
  try {
    return onSnapshot(
      collection(db, path),
      (snap) => {
        if (!snap.empty) {
          onUpdate(snap.docs.map((d) => d.data() as Coupon));
        } else {
          onUpdate(INITIAL_COUPONS);
        }
      },
      () => onUpdate(INITIAL_COUPONS)
    );
  } catch {
    onUpdate(INITIAL_COUPONS);
    return () => {};
  }
}

export async function saveCoupon(coupon: Coupon): Promise<void> {
  const path = `coupons/${coupon.id}`;
  try {
    await setDoc(doc(db, 'coupons', coupon.id), coupon);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ================= SETTINGS =================
export function subscribeSettings(onUpdate: (settings: RestaurantSettings) => void): () => void {
  const path = `settings/${INITIAL_SETTINGS.id}`;
  try {
    return onSnapshot(
      doc(db, 'settings', INITIAL_SETTINGS.id),
      (snap) => {
        if (snap.exists()) {
          onUpdate(snap.data() as RestaurantSettings);
        } else {
          onUpdate(INITIAL_SETTINGS);
        }
      },
      () => onUpdate(INITIAL_SETTINGS)
    );
  } catch {
    onUpdate(INITIAL_SETTINGS);
    return () => {};
  }
}

export async function saveSettings(settings: RestaurantSettings): Promise<void> {
  const path = `settings/${settings.id}`;
  try {
    await setDoc(doc(db, 'settings', settings.id), settings);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ================= AUDIT LOGS =================
export function subscribeAuditLogs(onUpdate: (logs: AuditLog[]) => void): () => void {
  const path = 'audit_logs';
  try {
    return onSnapshot(
      collection(db, path),
      (snap) => {
        const list = snap.docs.map((d) => d.data() as AuditLog);
        list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        onUpdate(list);
      },
      () => {}
    );
  } catch {
    return () => {};
  }
}

export async function logAuditEvent(adminEmail: string, action: string, entity: string, entityId: string, details: string): Promise<void> {
  const log: AuditLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    adminEmail,
    action,
    entity,
    entityId,
    details,
    timestamp: new Date().toISOString(),
  };
  try {
    await setDoc(doc(db, 'audit_logs', log.id), log);
  } catch {
    console.log('Audit log stored locally:', log);
  }
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const path = `categories/${categoryId}`;
  try {
    await deleteDoc(doc(db, 'categories', categoryId));
    try {
      await deleteDoc(doc(db, 'menuCategories', categoryId));
    } catch {}
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function deleteCoupon(couponId: string): Promise<void> {
  const path = `coupons/${couponId}`;
  try {
    await deleteDoc(doc(db, 'coupons', couponId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ================= PAYMENTS SERVICES =================
export async function createPaymentRecord(payment: PaymentRecord): Promise<void> {
  const path = `payments/${payment.id}`;
  try {
    await setDoc(doc(db, 'payments', payment.id), payment);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribePayments(onUpdate: (payments: PaymentRecord[]) => void): () => void {
  const path = 'payments';
  try {
    return onSnapshot(
      collection(db, path),
      (snap) => {
        const list = snap.docs.map((d) => d.data() as PaymentRecord);
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        onUpdate(list);
      },
      (error) => {
        console.warn('Payments snapshot notice:', error.message);
      }
    );
  } catch {
    return () => {};
  }
}

// ================= REVIEWS =================
export function subscribeReviews(onUpdate: (reviews: Review[]) => void): () => void {
  const path = 'reviews';
  try {
    return onSnapshot(
      collection(db, path),
      (snap) => {
        if (!snap.empty) {
          onUpdate(snap.docs.map((d) => d.data() as Review));
        } else {
          onUpdate(INITIAL_REVIEWS);
        }
      },
      () => onUpdate(INITIAL_REVIEWS)
    );
  } catch {
    onUpdate(INITIAL_REVIEWS);
    return () => {};
  }
}

export async function submitReview(review: Review): Promise<void> {
  const path = `reviews/${review.id}`;
  try {
    await setDoc(doc(db, 'reviews', review.id), review);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function toggleReviewStatus(reviewId: string, isApproved: boolean): Promise<void> {
  const path = `reviews/${reviewId}`;
  try {
    await updateDoc(doc(db, 'reviews', reviewId), { isApproved });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteReview(reviewId: string): Promise<void> {
  const path = `reviews/${reviewId}`;
  try {
    await deleteDoc(doc(db, 'reviews', reviewId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
