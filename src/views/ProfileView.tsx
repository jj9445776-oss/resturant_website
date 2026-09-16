import React, { useState } from 'react';
import { User as UserIcon, LogOut, ShoppingBag, Calendar, ArrowRight, Clock, MapPin, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Order, Reservation } from '../types';

interface ProfileViewProps {
  orders: Order[];
  reservations: Reservation[];
  onTrackOrder: (orderNumber: string) => void;
  onNavigateToMenu: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  orders,
  reservations,
  onTrackOrder,
  onNavigateToMenu,
}) => {
  const { currentUser, userProfile, role, loginWithGoogle, logout } = useAuth();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<'orders' | 'reservations'>('orders');

  const userOrders = currentUser
    ? orders.filter((o) => o.customerId === currentUser.uid || o.customerEmail === currentUser.email)
    : orders.slice(0, 3); // show recent for guest

  const userReservations = currentUser
    ? reservations.filter((r) => r.customerEmail === currentUser.email)
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
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Profile Card Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#13131c] border border-[#262638] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
          {currentUser?.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt={currentUser.displayName || 'Patron'}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-[#d4af37]"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-[#1d1d2b] border border-[#303046] flex items-center justify-center text-[#d4af37]">
              <UserIcon className="w-10 h-10" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="font-heading text-2xl font-bold text-[#f5efe6]">
                {currentUser?.displayName || 'Royal Patron (Guest)'}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#201d12] text-[#f3c64c] border border-[#d4af3740]">
                {role.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-[#908f9e] mt-1">
              {currentUser?.email || 'Sign in with Google to sync your order history and royal rewards.'}
            </p>
          </div>
        </div>

        <div>
          {currentUser ? (
            <button
              onClick={logout}
              className="px-5 py-2.5 rounded-xl bg-[#1c1c28] hover:bg-[#281818] border border-[#303042] text-[#f87171] text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="px-6 py-3 rounded-xl bg-[#d4af37] hover:bg-[#e4bd43] text-[#0b0b0d] font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-lg"
            >
              <UserIcon className="w-4 h-4" />
              <span>Sign In with Google</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-[#212130] pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-[#d4af37] text-[#0b0b0d]'
              : 'text-[#9c9aa8] hover:text-[#f5efe6]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>My Orders ({userOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reservations')}
          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-2 ${
            activeTab === 'reservations'
              ? 'bg-[#d4af37] text-[#0b0b0d]'
              : 'text-[#9c9aa8] hover:text-[#f5efe6]'
          }`}
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
              <h3 className="font-heading text-lg font-bold text-[#f5efe6]">No Orders Placed Yet</h3>
              <p className="text-xs text-[#8f8e9e] mt-1 mb-4">
                Explore our royal Mughlai dishes and have them delivered hot to your doorstep.
              </p>
              <button
                onClick={onNavigateToMenu}
                className="px-5 py-2.5 rounded-xl bg-[#d4af37] text-[#0b0b0d] text-xs font-bold cursor-pointer"
              >
                Order from Menu
              </button>
            </div>
          ) : (
            userOrders.map((order) => (
              <div
                key={order.id}
                className="p-5 rounded-2xl bg-[#13131c] border border-[#232332] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[#d4af37]">
                      {order.orderNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#1d1b11] text-[#f3c64c] border border-[#d4af3740]">
                      {order.orderStatus.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-[#8f8e9e] mt-1">
                    {order.items.map((i) => `${i.quantity}x ${i.product.name}`).join(', ')}
                  </p>
                  <span className="text-[11px] text-[#6d6c7b] mt-1 block">
                    Placed on: {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                  </span>
                </div>

                <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                  <span className="font-heading text-base font-bold text-[#f5efe6]">
                    PKR {order.total.toLocaleString()}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onTrackOrder(order.orderNumber)}
                      className="px-3 py-1.5 rounded-lg bg-[#222232] hover:bg-[#d4af37] text-[#d4af37] hover:text-[#0b0b0d] text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Track Order
                    </button>
                    <button
                      onClick={() => handleReorder(order)}
                      className="px-3 py-1.5 rounded-lg bg-[#d4af3715] hover:bg-[#d4af37] text-[#d4af37] hover:text-[#0b0b0d] border border-[#d4af3740] text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Re-order
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
              <h3 className="font-heading text-lg font-bold text-[#f5efe6]">No Table Bookings Found</h3>
              <p className="text-xs text-[#8f8e9e] mt-1">
                Reserve your table at our Starlit Rooftop or Royal Majlis in Lahore, Karachi, or Islamabad.
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
                    <span className="font-mono text-sm font-bold text-[#d4af37]">
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
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
