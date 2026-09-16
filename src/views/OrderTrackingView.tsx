import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  Utensils,
  Bike,
  Sparkles,
  Phone,
  MessageSquare,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { NotificationService } from '../services/notificationService';
import { useCart } from '../context/CartContext';

interface OrderTrackingViewProps {
  initialOrderNumber?: string;
  allOrders: Order[];
}

const ORDER_STAGES: { key: OrderStatus; label: string; desc: string }[] = [
  { key: 'pending', label: 'Order Placed', desc: 'Received by Dastaan Dispatch' },
  { key: 'confirmed', label: 'Order Confirmed', desc: 'Verified and queued' },
  { key: 'preparing', label: 'In Royal Kitchen', desc: 'Fresh iron-woks & tandoor firing' },
  { key: 'out_for_delivery', label: 'Out with Rider', desc: 'On royal delivery route' },
  { key: 'completed', label: 'Delivered', desc: 'Dastarkhwan served' },
];

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  initialOrderNumber = '',
  allOrders,
}) => {
  const { settings } = useCart();
  const [searchTerm, setSearchTerm] = useState(initialOrderNumber);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (initialOrderNumber) {
      const match = allOrders.find(
        (o) => o.orderNumber.toLowerCase() === initialOrderNumber.toLowerCase()
      );
      if (match) setSelectedOrder(match);
    } else if (allOrders.length > 0 && !selectedOrder) {
      setSelectedOrder(allOrders[0]);
    }
  }, [initialOrderNumber, allOrders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    const clean = searchTerm.trim().toLowerCase();
    const found = allOrders.find(
      (o) =>
        o.orderNumber.toLowerCase() === clean ||
        o.customerPhone.replace(/[^0-9]/g, '').includes(clean)
    );
    setSelectedOrder(found || null);
  };

  const getStageIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'preparing': return 2;
      case 'out_for_delivery': return 3;
      case 'completed': return 4;
      default: return 0;
    }
  };

  const currentStageIdx = selectedOrder ? getStageIndex(selectedOrder.orderStatus) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <p className="font-urdu text-xl text-[#d4af37]">آرڈر ٹریکنگ</p>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#f5efe6] mt-1">
          Live Order Tracker
        </h1>
        <p className="text-xs text-[#9d9ba9] mt-2">
          Monitor your royal feast in real-time from the iron wok to your doorstep.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#757484] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Order # (e.g. ORD-2026-...) or phone"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#14141e] border border-[#272737] text-xs text-white focus:outline-none focus:border-[#d4af37]"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-[#d4af37] text-[#0b0b0d] text-xs font-bold hover:bg-[#e4bd43] transition-colors cursor-pointer"
        >
          Track
        </button>
      </form>

      {selectedOrder ? (
        <div className="rounded-3xl bg-[#12121a] border border-[#252535] p-6 sm:p-8 space-y-8 shadow-2xl">
          {/* Order Meta Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#1f1f2d] gap-4">
            <div>
              <span className="text-[10px] text-[#7d7c8d] uppercase tracking-wider block">
                Order Tracking Number
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-xl font-bold text-[#d4af37]">
                  {selectedOrder.orderNumber}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-bold bg-[#1e1c10] text-[#f3c64c] border border-[#d4af3740]">
                  {selectedOrder.orderStatus.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const url = NotificationService.getWhatsAppClickToChatUrl(
                    settings.whatsappNumber || '+923001234567',
                    `Inquiring on order status for Order ${selectedOrder.orderNumber}`
                  );
                  window.open(url, '_blank');
                }}
                className="px-3.5 py-2 rounded-xl bg-[#25D36618] hover:bg-[#25D36628] border border-[#25D36640] text-[#25D366] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Rider</span>
              </button>
              <button
                onClick={() => window.print()}
                className="p-2 rounded-xl bg-[#1a1a26] text-[#b4b2c2] hover:text-white border border-[#2b2b3b] cursor-pointer"
                title="Print Order Receipt"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Timeline Visualizer */}
          <div className="py-4">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-4 right-4 h-1 bg-[#1f1f2d] hidden sm:block -z-0">
                <div
                  className="h-full bg-gradient-to-r from-[#d4af37] to-[#4ade80] transition-all duration-500"
                  style={{ width: `${(currentStageIdx / (ORDER_STAGES.length - 1)) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                {ORDER_STAGES.map((stage, idx) => {
                  const isDone = idx <= currentStageIdx;
                  const isCurrent = idx === currentStageIdx;

                  return (
                    <div key={stage.key} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isDone
                            ? 'bg-[#d4af37] text-[#0b0b0d] ring-4 ring-[#d4af3725]'
                            : 'bg-[#181824] text-[#6d6c7d] border border-[#2b2b3b]'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>
                      <div>
                        <span
                          className={`text-xs font-bold block ${
                            isCurrent ? 'text-[#d4af37]' : isDone ? 'text-[#f5efe6]' : 'text-[#6c6b7a]'
                          }`}
                        >
                          {stage.label}
                        </span>
                        <span className="text-[10px] text-[#7d7c8d] block mt-0.5">
                          {stage.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Items & Financial summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#1f1f2d]">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] mb-3">
                Items in Royal Delivery
              </h4>
              <div className="space-y-2 text-xs">
                {selectedOrder.items.map((item) => (
                  <div key={item.cartItemId} className="flex justify-between py-1 border-b border-[#181824]">
                    <div>
                      <span className="text-[#f5efe6] font-medium">
                        {item.quantity}x {item.product.name}
                      </span>
                      {item.selectedVariation && (
                        <span className="text-[10px] text-[#8e8d9d] block">
                          Portion: {item.selectedVariation.name}
                        </span>
                      )}
                    </div>
                    <span className="text-[#d4af37] font-semibold">
                      PKR {item.itemTotal.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#9c9aa8] bg-[#0c0c12] p-4 rounded-2xl border border-[#1e1e2c]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#f5efe6] mb-2">
                Order Breakdown
              </h4>
              <div className="flex justify-between">
                <span>Customer:</span>
                <span className="text-[#f5efe6] font-medium">{selectedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone:</span>
                <span className="text-[#f5efe6]">{selectedOrder.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment:</span>
                <span className="text-[#d4af37] uppercase font-semibold">
                  {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#1a1a26] text-sm font-bold text-[#f5efe6]">
                <span>Total Amount:</span>
                <span className="text-[#d4af37] font-heading text-base">
                  PKR {selectedOrder.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-[#12121a] border border-[#222230]">
          <p className="text-sm text-[#9c9aa8]">
            No order found matching your search. Please check your order reference number or view recent orders in your profile.
          </p>
        </div>
      )}
    </div>
  );
};
