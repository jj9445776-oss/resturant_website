import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Tags,
  Calendar,
  Users,
  Percent,
  MapPin,
  Star,
  PartyPopper,
  MessageSquare,
  Smartphone,
  CreditCard,
  History,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Save,
  Send,
  Eye,
  Shield,
  FileText,
} from 'lucide-react';
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
  OrderStatus,
  PaymentStatus,
} from '../types';
import {
  updateOrderStatus,
  updateOrderPayment,
  saveProduct,
  deleteProduct,
  updateReservationStatus,
  saveCoupon,
  saveSettings,
  updateCateringLeadStatus,
  toggleReviewStatus,
  logAuditEvent,
} from '../services/dbService';
import { NotificationService } from '../services/notificationService';
import { useAuth } from '../context/AuthContext';

interface AdminViewProps {
  products: Product[];
  categories: Category[];
  orders: Order[];
  reservations: Reservation[];
  coupons: Coupon[];
  branches: Branch[];
  reviews: Review[];
  cateringLeads: CateringLead[];
  settings: RestaurantSettings;
  auditLogs: AuditLog[];
}

type AdminTab =
  | 'dashboard'
  | 'orders'
  | 'menu'
  | 'categories'
  | 'reservations'
  | 'customers'
  | 'coupons'
  | 'branches'
  | 'reviews'
  | 'catering'
  | 'whatsapp'
  | 'sms'
  | 'payments'
  | 'audit';

export const AdminView: React.FC<AdminViewProps> = ({
  products,
  categories,
  orders,
  reservations,
  coupons,
  branches,
  reviews,
  cateringLeads,
  settings,
  auditLogs,
}) => {
  const { currentUser, role } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Search and filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [menuSearch, setMenuSearch] = useState('');

  // Editing modals / state
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<Partial<Coupon> | null>(null);
  const [currentSettings, setCurrentSettings] = useState<RestaurantSettings>(settings);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false);

  // Test Notification state
  const [testPhone, setTestPhone] = useState('03001234567');
  const [testNotifResult, setTestNotifResult] = useState<string | null>(null);

  // Financial Metrics
  const totalRevenue = orders.reduce((sum, o) => (o.orderStatus !== 'cancelled' ? sum + o.total : sum), 0);
  const totalCompletedOrders = orders.filter((o) => o.orderStatus === 'completed').length;
  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'confirmed').length;
  const pendingReservationsCount = reservations.filter((r) => r.status === 'confirmed').length;
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  // Tabs navigation config
  const navItems: { id: AdminTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard & Metrics', icon: LayoutDashboard },
    { id: 'orders', label: 'Live Orders', icon: ShoppingBag },
    { id: 'menu', label: 'Dishes & Menu CRUD', icon: UtensilsCrossed },
    { id: 'categories', label: 'Food Categories', icon: Tags },
    { id: 'reservations', label: 'Table Bookings', icon: Calendar },
    { id: 'customers', label: 'Customer Directory', icon: Users },
    { id: 'coupons', label: 'Coupons & Deals', icon: Percent },
    { id: 'branches', label: 'Branch Locations', icon: MapPin },
    { id: 'reviews', label: 'Review Moderation', icon: Star },
    { id: 'catering', label: 'Catering Leads', icon: PartyPopper },
    { id: 'whatsapp', label: 'WhatsApp Alerts', icon: MessageSquare },
    { id: 'sms', label: 'SMS Gateway', icon: Smartphone },
    { id: 'payments', label: 'Payment Accounts', icon: CreditCard },
    { id: 'audit', label: 'Security & Audit', icon: History },
  ];

  const handleSaveSettings = async () => {
    try {
      await saveSettings(currentSettings);
      await logAuditEvent(currentUser?.email || 'admin@dastaan.pk', 'UPDATE', 'settings', currentSettings.id, 'Updated restaurant settings');
      setSettingsSavedMsg(true);
      setTimeout(() => setSettingsSavedMsg(false), 3000);
    } catch (err) {
      console.error('Settings save error:', err);
    }
  };

  const handleTestWhatsApp = async () => {
    setTestNotifResult('Sending test WhatsApp message to ' + testPhone + '...');
    const res = await NotificationService.dispatchServerNotification(
      'whatsapp',
      testPhone,
      'Test message from Dastaan Restaurant Admin System. System operational.'
    );
    setTestNotifResult(res.success ? `WhatsApp dispatched successfully (ID: ${res.messageId})` : 'Failed');
    setTimeout(() => setTestNotifResult(null), 4000);
  };

  const handleTestSMS = async () => {
    setTestNotifResult('Dispatching test SMS gateway alert to ' + testPhone + '...');
    const res = await NotificationService.dispatchServerNotification(
      'sms',
      testPhone,
      'Dastaan: Test SMS verification code 9821. Shahi Zauq, Aapki Khidmat Mein!'
    );
    setTestNotifResult(res.success ? `SMS dispatched successfully (ID: ${res.messageId})` : 'Failed');
    setTimeout(() => setTestNotifResult(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-[#13131c] border border-[#262638] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#d4af37]" />
            <h1 className="font-heading text-2xl font-bold text-[#f5efe6]">
              Dastaan Enterprise Management Portal
            </h1>
          </div>
          <p className="text-xs text-[#908f9f] mt-1">
            Logged in as: <strong className="text-[#f5efe6]">{currentUser?.email || 'bilalit.rfc@gmail.com'}</strong> • Role:{' '}
            <span className="uppercase text-[#d4af37] font-semibold">{role.replace('_', ' ')}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-[#1a1a26] text-[#a09fae] border border-[#2b2b3b]">
            14 Enterprise Modules Active
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-[#162e1c] text-[#4ade80] border border-[#22c55e40] font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            Live Cloud Sync
          </span>
        </div>
      </div>

      {/* Main Admin Layout (Sidebar + Content) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Module Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-1">
          <div className="p-2 rounded-2xl bg-[#12121a] border border-[#222230] space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors text-left ${
                    isActive
                      ? 'bg-[#d4af37] text-[#0b0b0d] shadow'
                      : 'text-[#a2a0b0] hover:text-[#f5efe6] hover:bg-[#191924]'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Sub-Module Body */}
        <div className="lg:col-span-4 min-h-[600px]">
          {/* ========================================================================= */}
          {/* 1. DASHBOARD & METRICS */}
          {/* ========================================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#13131c] border border-[#262638]">
                  <span className="text-xs text-[#8c8a9a] uppercase font-bold">Total Gross Revenue</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-heading text-2xl font-bold text-[#f5efe6]">
                      PKR {totalRevenue.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#4ade80] mt-1 block">Live Firestore calculations</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#13131c] border border-[#262638]">
                  <span className="text-xs text-[#8c8a9a] uppercase font-bold">Total Orders</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-heading text-2xl font-bold text-[#d4af37]">
                      {orders.length}
                    </span>
                    <span className="text-xs text-[#8c8a9a]">({totalCompletedOrders} completed)</span>
                  </div>
                  <span className="text-[11px] text-[#8c8a9a] mt-1 block">Avg Order: PKR {avgOrderValue.toLocaleString()}</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#13131c] border border-[#262638]">
                  <span className="text-xs text-[#8c8a9a] uppercase font-bold">Active Orders in Kitchen</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-heading text-2xl font-bold text-[#f87171]">
                      {pendingOrdersCount}
                    </span>
                    <span className="text-xs text-[#8c8a9a]">dispatching</span>
                  </div>
                  <span className="text-[11px] text-[#f87171] mt-1 block">Awaiting fulfillment</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#13131c] border border-[#262638]">
                  <span className="text-xs text-[#8c8a9a] uppercase font-bold">Table Reservations</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-heading text-2xl font-bold text-[#38bdf8]">
                      {reservations.length}
                    </span>
                    <span className="text-xs text-[#8c8a9a]">({pendingReservationsCount} upcoming)</span>
                  </div>
                  <span className="text-[11px] text-[#38bdf8] mt-1 block">Lahore, KHI, ISB</span>
                </div>
              </div>

              {/* Recent Orders List */}
              <div className="p-6 rounded-3xl bg-[#13131c] border border-[#262638] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#212130]">
                  <h3 className="font-heading text-base font-bold text-[#f5efe6]">
                    Recent Dastarkhwan Orders
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#d4af37] hover:underline cursor-pointer"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#9d9ba9]">
                    <thead className="text-[11px] uppercase bg-[#181824] text-[#868595]">
                      <tr>
                        <th className="p-3">Order #</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Items</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Payment</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e1e2c]">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#161622]">
                          <td className="p-3 font-mono font-bold text-[#d4af37]">{ord.orderNumber}</td>
                          <td className="p-3 font-medium text-white">{ord.customerName}</td>
                          <td className="p-3">{ord.items.length} items</td>
                          <td className="p-3 font-semibold text-white">PKR {ord.total.toLocaleString()}</td>
                          <td className="p-3 uppercase text-[10px] text-[#38bdf8]">{ord.paymentMethod}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#1e1c10] text-[#f3c64c]">
                              {ord.orderStatus.replace(/_/g, ' ')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. ORDERS MANAGEMENT */}
          {/* ========================================================================= */}
          {activeTab === 'orders' && (
            <div className="p-6 rounded-3xl bg-[#13131c] border border-[#262638] space-y-4 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#212130]">
                <h3 className="font-heading text-lg font-bold text-[#f5efe6]">
                  Live Orders Pipeline ({orders.length})
                </h3>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search Order # or phone..."
                    className="px-3 py-1.5 rounded-lg bg-[#181824] border border-[#2c2c3e] text-xs text-white placeholder-[#686776]"
                  />
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-[#181824] border border-[#2c2c3e] text-xs text-[#d4af37] cursor-pointer"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">In Kitchen</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {orders
                  .filter((o) => {
                    if (orderStatusFilter !== 'all' && o.orderStatus !== orderStatusFilter) return false;
                    if (orderSearch.trim()) {
                      const q = orderSearch.toLowerCase();
                      return o.orderNumber.toLowerCase().includes(q) || o.customerPhone.includes(q);
                    }
                    return true;
                  })
                  .map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-xl bg-[#161622] border border-[#242436] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-[#d4af37]">
                            {ord.orderNumber}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#1e1c10] text-[#f3c64c] border border-[#d4af3740]">
                            {ord.orderStatus.replace(/_/g, ' ')}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-[#142618] text-[#4ade80]">
                            Pay: {ord.paymentStatus}
                          </span>
                        </div>
                        <p className="text-xs text-white font-medium">
                          {ord.customerName} • {ord.customerPhone}
                        </p>
                        <p className="text-[11px] text-[#868595]">
                          {ord.items.map((i) => `${i.quantity}x ${i.product.name}`).join(', ')}
                        </p>
                        {ord.deliveryAddress && (
                          <p className="text-[11px] text-[#737282]">
                            Address: {ord.deliveryAddress.streetAddress}, {ord.deliveryAddress.area}, {ord.deliveryAddress.city}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col sm:items-end gap-2">
                        <span className="font-heading text-base font-bold text-[#f5efe6]">
                          PKR {ord.total.toLocaleString()}
                        </span>

                        {/* Status Transition Buttons */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <select
                            value={ord.orderStatus}
                            onChange={async (e) => {
                              const newStatus = e.target.value as OrderStatus;
                              await updateOrderStatus(ord.id, newStatus);
                              await logAuditEvent(currentUser?.email || 'admin', 'UPDATE_STATUS', 'order', ord.id, `Status set to ${newStatus}`);
                            }}
                            className="px-2 py-1 rounded bg-[#20202e] border border-[#323246] text-xs text-[#d4af37] cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">In Kitchen</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>

                          {ord.paymentStatus === 'pending' && (
                            <button
                              onClick={async () => {
                                await updateOrderPayment(ord.id, 'verified');
                                await logAuditEvent(currentUser?.email || 'admin', 'VERIFY_PAY', 'order', ord.id, 'Payment verified');
                              }}
                              className="px-2 py-1 rounded bg-[#162e1c] text-[#4ade80] border border-[#22c55e40] text-xs font-bold cursor-pointer"
                            >
                              Verify Pay
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. MENU & PRODUCT CRUD */}
          {/* ========================================================================= */}
          {activeTab === 'menu' && (
            <div className="p-6 rounded-3xl bg-[#13131c] border border-[#262638] space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#212130]">
                <div>
                  <h3 className="font-heading text-lg font-bold text-[#f5efe6]">
                    Dishes &amp; Culinary Catalog ({products.length})
                  </h3>
                  <p className="text-xs text-[#8f8e9e]">Add, edit, or adjust prices and availability</p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    placeholder="Search dishes..."
                    className="px-3 py-1.5 rounded-lg bg-[#181824] border border-[#2c2c3e] text-xs text-white placeholder-[#686776]"
                  />
                  <button
                    onClick={() =>
                      setEditingProduct({
                        id: `prod-${Date.now()}`,
                        name: '',
                        nameUrdu: '',
                        description: '',
                        price: 1200,
                        category: 'karahi',
                        spicyLevel: 2,
                        prepTimeMinutes: 30,
                        isVegetarian: false,
                        isFeatured: false,
                        isAvailable: true,
                        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
                        ingredients: ['Mutton', 'Desi Ghee', 'Ginger'],
                      })
                    }
                    className="px-3.5 py-1.5 rounded-xl bg-[#d4af37] text-[#0b0b0d] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Dish</span>
                  </button>
                </div>
              </div>

              {/* Dish Edit Form Modal */}
              {editingProduct && (
                <div className="p-5 rounded-2xl bg-[#181826] border border-[#d4af3760] space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading text-sm font-bold text-[#f3c64c]">
                      {editingProduct.name ? `Editing: ${editingProduct.name}` : 'Create New Royal Dish'}
                    </h4>
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="text-xs text-[#8f8e9e] hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-[#9d9ba9] mb-1">Dish Name (English) *</label>
                      <input
                        type="text"
                        value={editingProduct.name || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="w-full px-3 py-1.5 rounded bg-[#101018] border border-[#2b2b3d] text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[#9d9ba9] mb-1">Name in Urdu (اردو نام) *</label>
                      <input
                        type="text"
                        value={editingProduct.nameUrdu || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, nameUrdu: e.target.value })}
                        className="w-full px-3 py-1.5 rounded bg-[#101018] border border-[#2b2b3d] text-white font-urdu"
                      />
                    </div>
                    <div>
                      <label className="block text-[#9d9ba9] mb-1">Category</label>
                      <select
                        value={editingProduct.category || 'karahi'}
                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                        className="w-full px-3 py-1.5 rounded bg-[#101018] border border-[#2b2b3d] text-white cursor-pointer"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.slug}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#9d9ba9] mb-1">Price (PKR) *</label>
                      <input
                        type="number"
                        value={editingProduct.price || 0}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded bg-[#101018] border border-[#2b2b3d] text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[#9d9ba9] mb-1">Special Sale Price (PKR)</label>
                      <input
                        type="number"
                        value={editingProduct.salePrice || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            salePrice: e.target.value ? Number(e.target.value) : undefined,
                          })
                        }
                        className="w-full px-3 py-1.5 rounded bg-[#101018] border border-[#2b2b3d] text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[#9d9ba9] mb-1">Spice Level (1-4)</label>
                      <input
                        type="number"
                        min="1"
                        max="4"
                        value={editingProduct.spicyLevel || 2}
                        onChange={(e) => setEditingProduct({ ...editingProduct, spicyLevel: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded bg-[#101018] border border-[#2b2b3d] text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#9d9ba9] mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={editingProduct.description || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      className="w-full px-3 py-1.5 rounded bg-[#101018] border border-[#2b2b3d] text-xs text-white"
                    />
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-white">
                      <input
                        type="checkbox"
                        checked={editingProduct.isAvailable ?? true}
                        onChange={(e) => setEditingProduct({ ...editingProduct, isAvailable: e.target.checked })}
                      />
                      <span>In Stock / Available</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-white">
                      <input
                        type="checkbox"
                        checked={editingProduct.isFeatured ?? false}
                        onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                      />
                      <span>Chef Signature Feature</span>
                    </label>

                    <button
                      onClick={async () => {
                        if (!editingProduct.name || !editingProduct.price) return;
                        await saveProduct(editingProduct as Product);
                        await logAuditEvent(currentUser?.email || 'admin', 'SAVE', 'product', (editingProduct as Product).id, 'Dish created/updated');
                        setEditingProduct(null);
                      }}
                      className="ml-auto px-4 py-2 rounded-xl bg-[#d4af37] text-[#0b0b0d] font-bold cursor-pointer"
                    >
                      Save Dish to Firestore
                    </button>
                  </div>
                </div>
              )}

              {/* Product List Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {products
                  .filter((p) => p.name.toLowerCase().includes(menuSearch.toLowerCase()))
                  .map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-xl bg-[#161622] border border-[#242436] flex items-center justify-between gap-3"
                    >
                      <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover bg-[#20202e]" />
                      <div className="min-w-0 flex-1">
                        <span className="font-semibold text-xs text-white block truncate">{p.name}</span>
                        <span className="text-[10px] text-[#d4af37] font-urdu block">{p.nameUrdu}</span>
                        <span className="text-xs text-[#8f8e9e]">PKR {p.price.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="p-1.5 rounded bg-[#222232] hover:bg-[#d4af37] text-[#d4af37] hover:text-[#0b0b0d] cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={async () => {
                            await deleteProduct(p.id);
                            await logAuditEvent(currentUser?.email || 'admin', 'DELETE', 'product', p.id, 'Dish deleted');
                          }}
                          className="p-1.5 rounded bg-[#2b1818] hover:bg-[#ef4444] text-[#f87171] hover:text-white cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. CATEGORIES CRUD */}
          {/* ========================================================================= */}
          {activeTab === 'categories' && (
            <div className="p-6 rounded-3xl bg-[#13131c] border border-[#262638] space-y-4 animate-in fade-in">
              <h3 className="font-heading text-lg font-bold text-[#f5efe6] pb-3 border-b border-[#212130]">
                Food Categories ({categories.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {categories.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl bg-[#161622] border border-[#242436]">
                    <span className="font-urdu text-sm text-[#d4af37] block">{c.nameUrdu}</span>
                    <h4 className="font-heading font-bold text-sm text-white">{c.name}</h4>
                    <p className="text-[11px] text-[#868595] mt-1">{c.description}</p>
                    <span className="text-[10px] font-mono text-[#6d6c7b] mt-2 block">slug: {c.slug}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. TABLE RESERVATIONS */}
          {/* ========================================================================= */}
          {activeTab === 'reservations' && (
            <div className="p-6 rounded-3xl bg-[#13131c] border border-[#262638] space-y-4 animate-in fade-in">
              <h3 className="font-heading text-lg font-bold text-[#f5efe6] pb-3 border-b border-[#212130]">
                Patron Table Bookings ({reservations.length})
              </h3>
              <div className="space-y-3">
                {reservations.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-xl bg-[#161622] border border-[#242436] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-[#d4af37]">
                          {r.reservationNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#172c1c] text-[#4ade80]">
                          {r.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-white mt-1">
                        {r.customerName} ({r.customerPhone})
                      </h4>
                      <p className="text-xs text-[#8f8e9e]">
                        {r.branchName} • {r.date} at {r.time} • {r.guests} Guests ({r.seatingArea.toUpperCase()})
                      </p>
                      {r.specialRequests && (
                        <p className="text-[11px] text-[#d4af37] italic">Note: "{r.specialRequests}"</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          await updateReservationStatus(r.id, 'completed');
                          await logAuditEvent(currentUser?.email || 'admin', 'UPDATE_STATUS', 'reservation', r.id, 'Reservation completed');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#162e1c] text-[#4ade80] text-xs font-semibold cursor-pointer"
                      >
                        Mark Seated
                      </button>
                      <button
                        onClick={async () => {
                          await updateReservationStatus(r.id, 'cancelled');
                          await logAuditEvent(currentUser?.email || 'admin', 'CANCEL', 'reservation', r.id, 'Reservation cancelled');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#2e1616] text-[#f87171] text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 6. CUSTOMER DIRECTORY */}
          {/* ========================================================================= */}
          {activeTab === 'customers' && (
            <div className="p-6 rounded-3xl bg-[#13131c] border border-[#262638] space-y-4 animate-in fade-in">
              <h3 className="font-heading text-lg font-bold text-[#f5efe6] pb-3 border-b border-[#212130]">
                Customer &amp; VIP Patrons Directory
              </h3>
              <p className="text-xs text-[#8e8d9e]">
                Customer profiles captured via Google Sign-In and completed Pakistani delivery receipts.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {orders.map((o) => (
                  <div key={o.id} className="p-3.5 rounded-xl bg-[#161622] border border-[#242436] space-y-1 text-xs">
                    <span className="font-bold text-white block">{o.customerName}</span>
                    <span className="text-[#d4af37] block">Phone: {o.customerPhone}</span>
                    <span className="text-[#8e8d9e] block">Email: {o.customerEmail}</span>
                    <span className="text-[11px] text-[#6b6a79] block">Last Order: {o.orderNumber}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 7. COUPONS & DEALS */}
          {/* ========================================================================= */}
          {activeTab === 'coupons' && (
            <div className="p-6 rounded-3xl bg-[#13131c] border border-[#262638] space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#212130]">
                <h3 className="font-heading text-lg font-bold text-[#f5efe6]">
                  Coupons &amp; Promotional Deals ({coupons.length})
                </h3>
                <button
                  onClick={() =>
                    setEditingCoupon({
                      id: `coupon-${Date.now()}`,
                      code: 'RAMADAN20',
                      discountType: 'percentage',
                      value: 20,
                      minOrder: 2000,
                      maxDiscount: 1000,
                      isActive: true,
                      expiryDate: '2026-12-31',
                    })
                  }
                  className="px-3 py-1.5 rounded-xl bg-[#d4af37] text-[#0b0b0d] font-bold text-xs cursor-pointer"
                >
                  + Add Coupon
                </button>
              </div>

              {editingCoupon && (
                <div className="p-4 rounded-xl bg-[#181826] border border-[#d4af3760] space-y-3 text-xs">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[#9d9ba9] mb-1">Code</label>
                      <input
                        type="text"
                        value={editingCoupon.code || ''}
                        onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })}
                        className="w-full px-2 py-1 rounded bg-[#101018] border border-[#2c2c3e] text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[#9d9ba9] mb-1">Discount Value (% or PKR)</label>
                      <input
                        type="number"
                        value={editingCoupon.value || 0}
                        onChange={(e) => setEditingCoupon({ ...editingCoupon, value: Number(e.target.value) })}
                        className="w-full px-2 py-1 rounded bg-[#101018] border border-[#2c2c3e] text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[#9d9ba9] mb-1">Min Order (PKR)</label>
                      <input
                        type="number"
                        value={editingCoupon.minOrder || 1500}
                        onChange={(e) => setEditingCoupon({ ...editingCoupon, minOrder: Number(e.target.value) })}
                        className="w-full px-2 py-1 rounded bg-[#101018] border border-[#2c2c3e] text-white"
                      />
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      if (!editingCoupon.code) return;
                      await saveCoupon(editingCoupon as Coupon);
                      await logAuditEvent(currentUser?.email || 'admin', 'SAVE', 'coupon', (editingCoupon as Coupon).id, 'Coupon saved');
                      setEditingCoupon(null);
                    }}
                    className="px-4 py-1.5 rounded bg-[#d4af37] text-[#0b0b0d] font-bold cursor-pointer"
                  >
                    Save Coupon
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {coupons.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl bg-[#161622] border border-[#242436] flex justify-between">
                    <div>
                      <span className="font-mono text-base font-bold text-[#d4af37]">{c.code}</span>
                      <p className="text-xs text-white">
                        {c.value}{c.discountType === 'percentage' ? '%' : ' PKR'} off
                      </p>
                      <span className="text-[11px] text-[#8e8d9e] block mt-1">
                        Min Order: PKR {c.minOrder.toLocaleString()}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#142618] text-[#4ade80] h-fit">
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 8. BRANCH LOCATIONS */}
          {/* ========================================================================= */}
          {activeTab === 'branches' && (
            <div className="p-6 rounded-3xl bg-[#13131c] border border-[#262638] space-y-4 animate-in fade-in">
              <h3 className="font-heading text-lg font-bold text-[#f5efe6] pb-3 border-b border-[#212130]">
                Branch Operations &amp; Dispatch Hubs ({branches.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {branches.map((b) => (
                  <div key={b.id} className="p-4 rounded-xl bg-[#161622] border border-[#242436] space-y-1.5 text-xs">
                    <h4 className="font-bold text-sm text-white">{b.name}</h4>
                    <p className="text-[#a09fae]">{b.address}, {b.city}</p>
                    <p className="text-[#d4af37]">Hotline: {b.phone}</p>
                    <div className="pt-2 border-t border-[#20202e] flex flex-wrap gap-1">
                      {b.deliveryAreas.map((a, i) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-[#1d1d2b] text-white">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 9. REVIEWS MODERATION */}
          {/* ========================================================================= */}
          {activeTab === 'reviews' && (
            <div className="p-6 rounded-3xl bg-[#13131c] border border-[#262638] space-y-4 animate-in fade-in">
              <h3 className="font-heading text-lg font-bold text-[#f5efe6] pb-3 border-b border-[#212130]">
                Customer Testimonials Moderation ({reviews.length})
              </h3>
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-xl bg-[#161622] border border-[#242436] flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{rev.customerName}</span>
                        <span className="text-[11px] text-[#d4af37]">★ {rev.rating}/5</span>
                        <span className="text-[10px] text-[#6e6d7d]">({rev.city})</span>
                      </div>
                      <p className="text-xs text-[#cfcbd9] italic mt-1">"{rev.comment}"</p>
                    </div>

                    <button
                      onClick={async () => {
                        await toggleReviewStatus(rev.id, !rev.isApproved);
                        await logAuditEvent(currentUser?.email || 'admin', 'MODERATE', 'review', rev.id, `Approved: ${!rev.isApproved}`);
                      }}
                      className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                        rev.isApproved ? 'bg-[#183520] text-[#4ade80]' : 'bg-[#2b1818] text-[#f87171]'
                      }`}
                    >
                      {rev.isApproved ? 'Approved' : 'Pending'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 10. CATERING LEADS */}
          {/* ========================================================================= */}
          {activeTab === 'catering' && (
            <div className="p-6 rounded-3xl bg-[#13131c] border border-[#262638] space-y-4 animate-in fade-in">
              <h3 className="font-heading text-lg font-bold text-[#f5efe6] pb-3 border-b border-[#212130]">
                Banquet &amp; Royal Wedding Leads ({cateringLeads.length})
              </h3>
              <div className="space-y-3">
                {cateringLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-4 rounded-xl bg-[#161622] border border-[#242436] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{lead.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#201d12] text-[#f3c64c]">
                          {lead.eventType}
                        </span>
                      </div>
                      <p className="text-xs text-[#d4af37]">
                        {lead.guests} Guests • Date: {lead.eventDate}
                      </p>
                      <p className="text-xs text-[#8e8d9e]">Phone: {lead.phone} • Email: {lead.email}</p>
                      {lead.foodRequirements && (
                        <p className="text-[11px] text-[#7a7989] italic">"{lead.foodRequirements}"</p>
                      )}
                    </div>

                    <div>
                      <select
                        value={lead.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value as any;
                          await updateCateringLeadStatus(lead.id, newStatus);
                          await logAuditEvent(currentUser?.email || 'admin', 'UPDATE_STATUS', 'catering_lead', lead.id, `Status: ${newStatus}`);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-[#20202e] text-xs text-[#d4af37] border border-[#323246] cursor-pointer"
                      >
                        <option value="new">New Lead</option>
                        <option value="contacted">Contacted</option>
                        <option value="quoted">Quoted</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 11. WHATSAPP NOTIFICATIONS CONFIGURATION */}
          {/* ========================================================================= */}
          {activeTab === 'whatsapp' && (
            <div className="p-6 rounded-3xl bg-[#13131c] border border-[#262638] space-y-6 animate-in fade-in">
              <div className="pb-3 border-b border-[#212130]">
                <h3 className="font-heading text-lg font-bold text-[#f5efe6]">
                  WhatsApp Business Notification Engine
                </h3>
                <p className="text-xs text-[#8f8e9e] mt-1">
                  Configure WhatsApp templates, customer receipts, and test live webhooks.
                </p>
              </div>

              {testNotifResult && (
                <div className="p-3 rounded-xl bg-[#1a2f1e] text-[#4ade80] text-xs">
                  {testNotifResult}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#9d9ba9] mb-1 font-medium">
                    Restaurant WhatsApp Hotline Number
                  </label>
                  <input
                    type="text"
                    value={currentSettings.whatsappNumber || ''}
                    onChange={(e) =>
                      setCurrentSettings({ ...currentSettings, whatsappNumber: e.target.value })
                    }
                    placeholder="+923001234567"
                    className="w-full px-3 py-2 rounded-xl bg-[#161622] border border-[#2c2c3e] text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#9d9ba9] mb-1 font-medium">
                    Auto-Send Order Slip on WhatsApp
                  </label>
                  <select
                    value={currentSettings.enableWhatsAppNotifications ? 'true' : 'false'}
                    onChange={(e) =>
                      setCurrentSettings({
                        ...currentSettings,
                        enableWhatsAppNotifications: e.target.value === 'true',
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#161622] border border-[#2c2c3e] text-white cursor-pointer"
                  >
                    <option value="true">Enabled (Pre-formatted Pakistani Slip)</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>
              </div>

              {/* Test WhatsApp Action */}
              <div className="p-4 rounded-2xl bg-[#0c0c12] border border-[#20202e] space-y-3">
                <span className="font-bold text-xs text-white block">Dispatch Test WhatsApp Notification</span>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    placeholder="03001234567"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#161622] border border-[#28283a] text-xs text-white"
                  />
                  <button
                    onClick={handleTestWhatsApp}
                    className="px-4 py-1.5 rounded-lg bg-[#25D366] text-[#071d0e] font-bold text-xs cursor-pointer"
                  >
                    Send Test WhatsApp
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveSettings}
                  className="px-5 py-2.5 rounded-xl bg-[#d4af37] text-[#0b0b0d] font-bold text-xs cursor-pointer shadow"
                >
                  Save WhatsApp Settings
                </button>
                {settingsSavedMsg && <span className="text-xs text-[#4ade80]">Settings saved successfully!</span>}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 12. SMS GATEWAY NOTIFICATIONS */}
          {/* ========================================================================= */}
          {activeTab === 'sms' && (
            <div className="p-6 rounded-3xl bg-[#13131c] border border-[#262638] space-y-6 animate-in fade-in">
              <div className="pb-3 border-b border-[#212130]">
                <h3 className="font-heading text-lg font-bold text-[#f5efe6]">
                  SMS Gateway Architecture &amp; Sender ID
                </h3>
                <p className="text-xs text-[#8f8e9e] mt-1">
                  Supported Pakistani telecom providers: Jazz, Telenor, Zong, Ufone with alphanumeric Sender ID (DASTAAN).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#9d9ba9] mb-1 font-medium">Masked Sender ID</label>
                  <input
                    type="text"
                    value="DASTAAN"
                    disabled
                    className="w-full px-3 py-2 rounded-xl bg-[#161622] border border-[#2c2c3e] text-[#d4af37] font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[#9d9ba9] mb-1 font-medium">SMS Dispatch Status</label>
                  <select
                    value={currentSettings.enableSmsNotifications ? 'true' : 'false'}
                    onChange={(e) =>
                      setCurrentSettings({
                        ...currentSettings,
                        enableSmsNotifications: e.target.value === 'true',
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#161622] border border-[#2c2c3e] text-white cursor-pointer"
                  >
                    <option value="true">Active (Auto SMS on Order &amp; Table Booking)</option>
                    <option value="false">Muted</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0c0c12] border border-[#20202e] space-y-3">
                <span className="font-bold text-xs text-white block">Dispatch Test SMS Alert</span>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    placeholder="03001234567"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#161622] border border-[#28283a] text-xs text-white"
                  />
                  <button
                    onClick={handleTestSMS}
                    className="px-4 py-1.5 rounded-lg bg-[#38bdf8] text-[#0b1b24] font-bold text-xs cursor-pointer"
                  >
                    Send Test SMS
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveSettings}
                  className="px-5 py-2.5 rounded-xl bg-[#d4af37] text-[#0b0b0d] font-bold text-xs cursor-pointer shadow"
                >
                  Save SMS Settings
                </button>
                {settingsSavedMsg && <span className="text-xs text-[#4ade80]">Settings saved successfully!</span>}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 13. PAYMENT METHODS SETTINGS */}
          {/* ========================================================================= */}
          {activeTab === 'payments' && (
            <div className="p-6 rounded-3xl bg-[#13131c] border border-[#262638] space-y-6 animate-in fade-in">
              <div className="pb-3 border-b border-[#212130]">
                <h3 className="font-heading text-lg font-bold text-[#f5efe6]">
                  Pakistani Payment Gateways &amp; Bank Accounts
                </h3>
                <p className="text-xs text-[#8f8e9e] mt-1">
                  Configure JazzCash, Easypaisa, 1Link Raast Bank Transfer, and Cash on Delivery parameters.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                {/* JazzCash */}
                <div className="p-4 rounded-2xl bg-[#161622] border border-[#ef444440] space-y-3">
                  <span className="font-bold text-sm text-[#ef4444] block">JazzCash Merchant Account</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#9d9ba9] mb-1">Account Title</label>
                      <input
                        type="text"
                        value={currentSettings.jazzCashAccountTitle || ''}
                        onChange={(e) =>
                          setCurrentSettings({ ...currentSettings, jazzCashAccountTitle: e.target.value })
                        }
                        className="w-full px-3 py-1.5 rounded bg-[#101018] border border-[#2b2b3d] text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[#9d9ba9] mb-1">Account / Till Number</label>
                      <input
                        type="text"
                        value={currentSettings.jazzCashAccountNumber || ''}
                        onChange={(e) =>
                          setCurrentSettings({ ...currentSettings, jazzCashAccountNumber: e.target.value })
                        }
                        className="w-full px-3 py-1.5 rounded bg-[#101018] border border-[#2b2b3d] text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Easypaisa */}
                <div className="p-4 rounded-2xl bg-[#161622] border border-[#22c55e40] space-y-3">
                  <span className="font-bold text-sm text-[#22c55e] block">Easypaisa Wallet Details</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#9d9ba9] mb-1">Wallet Title</label>
                      <input
                        type="text"
                        value={currentSettings.easyPaisaAccountTitle || ''}
                        onChange={(e) =>
                          setCurrentSettings({ ...currentSettings, easyPaisaAccountTitle: e.target.value })
                        }
                        className="w-full px-3 py-1.5 rounded bg-[#101018] border border-[#2b2b3d] text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[#9d9ba9] mb-1">Wallet Mobile Number</label>
                      <input
                        type="text"
                        value={currentSettings.easyPaisaAccountNumber || ''}
                        onChange={(e) =>
                          setCurrentSettings({ ...currentSettings, easyPaisaAccountNumber: e.target.value })
                        }
                        className="w-full px-3 py-1.5 rounded bg-[#101018] border border-[#2b2b3d] text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Bank / Raast */}
                <div className="p-4 rounded-2xl bg-[#161622] border border-[#38bdf840] space-y-3">
                  <span className="font-bold text-sm text-[#38bdf8] block">Bank Account &amp; Raast IBAN</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#9d9ba9] mb-1">Bank Name</label>
                      <input
                        type="text"
                        value={currentSettings.bankName || ''}
                        onChange={(e) => setCurrentSettings({ ...currentSettings, bankName: e.target.value })}
                        className="w-full px-3 py-1.5 rounded bg-[#101018] border border-[#2b2b3d] text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[#9d9ba9] mb-1">Account Title</label>
                      <input
                        type="text"
                        value={currentSettings.bankAccountTitle || ''}
                        onChange={(e) =>
                          setCurrentSettings({ ...currentSettings, bankAccountTitle: e.target.value })
                        }
                        className="w-full px-3 py-1.5 rounded bg-[#101018] border border-[#2b2b3d] text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[#9d9ba9] mb-1">Account Number</label>
                      <input
                        type="text"
                        value={currentSettings.bankAccountNumber || ''}
                        onChange={(e) =>
                          setCurrentSettings({ ...currentSettings, bankAccountNumber: e.target.value })
                        }
                        className="w-full px-3 py-1.5 rounded bg-[#101018] border border-[#2b2b3d] text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[#9d9ba9] mb-1">Pakistani IBAN (24 Characters)</label>
                      <input
                        type="text"
                        value={currentSettings.bankIban || ''}
                        onChange={(e) => setCurrentSettings({ ...currentSettings, bankIban: e.target.value })}
                        className="w-full px-3 py-1.5 rounded bg-[#101018] border border-[#2b2b3d] text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveSettings}
                  className="px-5 py-2.5 rounded-xl bg-[#d4af37] text-[#0b0b0d] font-bold text-xs cursor-pointer shadow"
                >
                  Update Payment Gateways
                </button>
                {settingsSavedMsg && <span className="text-xs text-[#4ade80]">Payment accounts saved!</span>}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 14. SECURITY & AUDIT LOGS */}
          {/* ========================================================================= */}
          {activeTab === 'audit' && (
            <div className="p-6 rounded-3xl bg-[#13131c] border border-[#262638] space-y-4 animate-in fade-in">
              <div className="pb-3 border-b border-[#212130]">
                <h3 className="font-heading text-lg font-bold text-[#f5efe6]">
                  Enterprise Security &amp; Audit Logs ({auditLogs.length})
                </h3>
                <p className="text-xs text-[#8f8e9e] mt-1">
                  Immutable record of administrative actions, status changes, and schema updates.
                </p>
              </div>

              <div className="space-y-2">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-[#161622] border border-[#242436] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white uppercase text-[10px] px-1.5 py-0.5 rounded bg-[#20202e] text-[#d4af37]">
                          {log.action}
                        </span>
                        <span className="text-[#a09fae]">{log.entityType} ({log.entityId})</span>
                      </div>
                      <span className="text-[11px] text-[#6e6d7d] mt-0.5 block">
                        Admin: <strong className="text-white">{log.adminEmail}</strong>
                      </span>
                    </div>
                    <span className="text-[10px] text-[#868595] font-mono">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
