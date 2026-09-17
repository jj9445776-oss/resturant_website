import React, { useState } from 'react';
import {
  User as UserIcon,
  LogOut,
  ShoppingBag,
  Calendar,
  ArrowRight,
  Clock,
  MapPin,
  Sparkles,
  Edit2,
  Check,
  Phone,
  Mail,
  ShieldCheck,
  Receipt,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Order, Reservation } from '../types';

interface ProfileViewProps {
  orders: Order[];
  reservations: Reservation[];
  onTrackOrder: (orderNumber: string) => void;
  onNavigateToMenu: () => void;
  onOpenAuthModal: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  orders,
  reservations,
  onTrackOrder,
  onNavigateToMenu,
  onOpenAuthModal,
}) => {
  const { currentUser, userProfile, role, loginWithGoogle, logout, updateCustomerProfile } = useAuth();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<'orders' | 'reservations' | 'settings'>('orders');

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(userProfile?.displayName || currentUser?.displayName || '');
  const [phoneInput, setPhoneInput] = useState(userProfile?.phone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const userOrders = currentUser
    ? orders.filter((o) => o.customerId === currentUser.uid || o.customerEmail?.toLowerCase() === currentUser.email?.toLowerCase())
    : orders.slice(0, 3); // show recent for demo if guest

  const userReservations = currentUser
    ? reservations.filter((r) => r.customerId === currentUser.uid || r.customerEmail?.toLowerCase() === currentUser.email?.toLowerCase())
    : reservations.slice(0, 3);

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart(
        item.product,
        item.quantity,
        item.selectedVariation,
        item.selectedAddons,
        item.spiceLevel,
        item.specialInstructions
      );
    });
    onNavigateToMenu();
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateCustomerProfile({
        displayName: nameInput.trim(),
        phone: phoneInput.trim(),
      });
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsEditing(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8" id="profile-view-container">
      {/* Profile Card Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#13131c] border border-[#262638] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-5 text-center sm:text-left flex-col sm:flex-row z-10">
          {currentUser?.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt={currentUser.displayName || 'Patron'}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-[#f59e0b] shadow-lg shadow-amber-500/10"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-[#1d1d2b] border border-[#303046] flex items-center justify-center text-[#f59e0b] shadow-inner font-display text-2xl font-bold">
              {(userProfile?.displayName || currentUser?.displayName || 'P').charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="font-display text-2xl font-bold text-stone-100">
                {userProfile?.displayName || currentUser?.displayName || 'Guest Patron'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
                {role.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              {currentUser?.email || 'Log in or create a customer account to track orders in real-time and save addresses.'}
            </p>
            {userProfile?.phone && (
              <p className="text-xs text-amber-500/80 mt-0.5 flex items-center gap-1.5 justify-center sm:justify-start">
                <Phone size={12} />
                <span>{userProfile.phone}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 z-10">
          {currentUser ? (
            <>
              <button
                onClick={() => {
                  setNameInput(userProfile?.displayName || currentUser.displayName || '');
                  setPhoneInput(userProfile?.phone || '');
                  setIsEditing(!isEditing);
                }}
                className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-2 cursor-pointer transition border border-stone-700"
                id="profile-edit-btn"
              >
                <Edit2 size={14} />
                <span>{isEditing ? 'Close Edit' : 'Edit Profile'}</span>
              </button>

              <button
                onClick={logout}
                className="px-4 py-2.5 rounded-xl bg-[#1c1c28] hover:bg-red-950/60 border border-red-900/40 text-red-400 text-xs font-semibold flex items-center gap-2 cursor-pointer transition"
                id="profile-sign-out-btn"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onOpenAuthModal}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs flex items-center gap-2 cursor-pointer transition shadow-lg shadow-amber-600/20"
                id="profile-login-modal-btn"
              >
                <UserIcon size={14} />
                <span>Sign In / Register</span>
              </button>
              <button
                onClick={loginWithGoogle}
                className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 font-medium text-xs flex items-center gap-2 cursor-pointer transition border border-stone-700"
                id="profile-google-login-btn"
              >
                <span>Google</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Inline Profile Editor Form */}
      {isEditing && currentUser && (
        <form onSubmit={handleSaveProfile} className="p-6 rounded-2xl bg-stone-900/90 border border-amber-500/30 space-y-4 animate-in fade-in">
          <h3 className="font-display text-sm font-bold text-amber-400">Update Profile Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-stone-400 mb-1" htmlFor="edit-name">Display Name</label>
              <input
                id="edit-name"
                type="text"
                required
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1" htmlFor="edit-phone">Mobile Phone</label>
              <input
                id="edit-phone"
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="+92 300 1234567"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 cursor-pointer transition disabled:opacity-50"
            >
              {isSaving ? <span className="animate-spin">⌛</span> : <Check size={14} />}
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
            {saveSuccess && <span className="text-xs text-emerald-400 font-medium">Profile saved successfully!</span>}
          </div>
        </form>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-[#212130] pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-[#f59e0b] text-[#0b0b0d]'
              : 'text-[#9c9aa8] hover:text-[#f5efe6]'
          }`}
          id="profile-tab-orders"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>My Orders ({userOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reservations')}
          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-2 ${
            activeTab === 'reservations'
              ? 'bg-[#f59e0b] text-[#0b0b0d]'
              : 'text-[#9c9aa8] hover:text-[#f5efe6]'
          }`}
          id="profile-tab-reservations"
        >
          <Calendar className="w-4 h-4" />
          <span>Table Bookings ({userReservations.length})</span>
        </button>
      </div>

      {/* Tab Content: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {userOrders.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#12121a] border border-[#222230]">
              <ShoppingBag className="w-10 h-10 text-[#5c5b6b] mx-auto mb-3" />
              <h3 className="font-display text-lg font-bold text-[#f5efe6]">No Orders Placed Yet</h3>
              <p className="text-xs text-[#8f8e9e] mt-1 mb-4">
                Explore our signature gourmet burgers and sides and have them delivered hot to your doorstep.
              </p>
              <button
                onClick={onNavigateToMenu}
                className="px-5 py-2.5 rounded-xl bg-[#f59e0b] text-[#0b0b0d] text-xs font-bold cursor-pointer hover:bg-amber-400 transition"
              >
                Order from Menu
              </button>
            </div>
          ) : (
            userOrders.map((order) => (
              <div
                key={order.id}
                className="p-5 rounded-2xl bg-[#13131c] border border-[#232332] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-stone-700"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[#f59e0b]">
                      {order.orderNumber}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      {order.orderStatus.replace(/_/g, ' ')}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      order.paymentStatus === 'verified' ? 'bg-emerald-950 text-emerald-400' : 'bg-stone-800 text-stone-300'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 mt-1 font-medium">
                    {order.items.map((i) => `${i.quantity}x ${i.product.name}`).join(', ')}
                  </p>
                  <span className="text-[11px] text-stone-500 mt-1 block">
                    Placed: {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()} • {order.deliveryType.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                  <span className="font-display text-base font-bold text-stone-100">
                    ${order.total.toFixed(2)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onTrackOrder(order.orderNumber)}
                      className="px-3 py-1.5 rounded-lg bg-[#222232] hover:bg-[#f59e0b] text-[#f59e0b] hover:text-[#0b0b0d] text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Track Order
                    </button>
                    <button
                      onClick={() => handleReorder(order)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-[#f59e0b] text-amber-400 hover:text-[#0b0b0d] border border-amber-500/30 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1"
                    >
                      <RotateCcw size={12} />
                      <span>Re-order</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab Content: Reservations */}
      {activeTab === 'reservations' && (
        <div className="space-y-4">
          {userReservations.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#12121a] border border-[#222230]">
              <Calendar className="w-10 h-10 text-[#5c5b6b] mx-auto mb-3" />
              <h3 className="font-display text-lg font-bold text-[#f5efe6]">No Table Bookings Found</h3>
              <p className="text-xs text-[#8f8e9e] mt-1">
                Reserve your table for lunch or dinner with friends and family.
              </p>
            </div>
          ) : (
            userReservations.map((res) => (
              <div
                key={res.id}
                className="p-5 rounded-2xl bg-[#13131c] border border-[#232332] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[#f59e0b]">
                      {res.reservationNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#142918] text-[#4ade80] border border-[#22c55e40]">
                      {res.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#f5efe6] mt-1">{res.branchName}</h4>
                  <p className="text-xs text-[#8f8e9e] mt-0.5">
                    {res.date} at {res.time} • {res.guests} Guests ({res.seatingArea.toUpperCase()})
                  </p>
                  {res.specialRequests && (
                    <p className="text-[11px] text-amber-400 italic mt-1">Special note: "{res.specialRequests}"</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
