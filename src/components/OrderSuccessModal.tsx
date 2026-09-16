import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, MessageSquare, Printer, ArrowRight, Sparkles, MapPin, Bike } from 'lucide-react';
import { Order, RestaurantSettings } from '../types';
import { NotificationService } from '../services/notificationService';

interface OrderSuccessModalProps {
  order: Order | null;
  settings: RestaurantSettings;
  onClose: () => void;
  onTrackOrder: (orderNumber: string) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  settings,
  onClose,
  onTrackOrder,
}) => {
  useEffect(() => {
    if (order) {
      // Fire celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#f9e295', '#ffffff', '#e25822'],
      });
    }
  }, [order]);

  if (!order) return null;

  const handleWhatsAppDispatch = () => {
    const message = NotificationService.formatOrderWhatsAppMessage(order, settings);
    const url = NotificationService.getWhatsAppClickToChatUrl(
      settings.whatsappNumber || '+923001234567',
      message
    );
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000cf] backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#111118] border border-[#2c2c3e] rounded-2xl overflow-hidden shadow-2xl p-6 sm:p-8 my-8 text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-[#18331d] border border-[#22c55e] flex items-center justify-center mx-auto mb-4 text-[#4ade80] shadow-lg shadow-[#22c55e20]">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <p className="font-urdu text-base text-[#d4af37]">آرڈر کامیابی سے موصول ہو گیا ہے</p>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#f5efe6] mt-1">
          Royal Order Confirmed!
        </h2>
        <p className="text-xs text-[#9d9ba9] mt-1.5">
          Order Reference: <strong className="text-[#d4af37] font-mono text-sm">{order.orderNumber}</strong>
        </p>

        {/* Receipt Box */}
        <div className="mt-6 p-4 rounded-xl bg-[#0c0c12] border border-[#222232] text-left text-xs space-y-2.5">
          <div className="flex justify-between pb-2 border-b border-[#1c1c28]">
            <span className="text-[#868595]">Customer:</span>
            <span className="text-[#f5efe6] font-semibold">{order.customerName} ({order.customerPhone})</span>
          </div>

          <div className="flex justify-between pb-2 border-b border-[#1c1c28]">
            <span className="text-[#868595]">Fulfillment Type:</span>
            <span className="text-[#d4af37] font-medium capitalize flex items-center gap-1">
              <Bike className="w-3.5 h-3.5" />
              {order.deliveryType === 'delivery' ? 'Royal Doorstep Delivery' : 'Self-Pickup'}
            </span>
          </div>

          {order.deliveryAddress && (
            <div className="pb-2 border-b border-[#1c1c28]">
              <span className="text-[#868595] block mb-0.5">Address:</span>
              <span className="text-[#cfcbd8]">
                {order.deliveryAddress.streetAddress}, {order.deliveryAddress.area}, {order.deliveryAddress.city}
              </span>
            </div>
          )}

          {/* Items Preview */}
          <div className="py-2 border-b border-[#1c1c28] space-y-1.5">
            <span className="text-[#868595] block uppercase text-[10px] font-bold">Ordered Dishes</span>
            {order.items.map((item) => (
              <div key={item.cartItemId} className="flex justify-between text-[#dedcd2]">
                <span>
                  {item.quantity}x {item.product.name}
                  {item.selectedVariation ? ` (${item.selectedVariation.name})` : ''}
                </span>
                <span className="font-semibold text-[#f5efe6]">
                  PKR {item.itemTotal.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Grand Total */}
          <div className="pt-2 flex justify-between text-sm font-bold text-[#f5efe6]">
            <span>Total Payable ({order.paymentMethod.toUpperCase()}):</span>
            <span className="text-[#d4af37] font-heading text-base">
              PKR {order.total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-2.5">
          {/* WhatsApp send button */}
          <button
            onClick={handleWhatsAppDispatch}
            className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-[#071b0e] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Send Order Copy to Restaurant WhatsApp</span>
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                onClose();
                onTrackOrder(order.orderNumber);
              }}
              className="py-2.5 px-4 rounded-xl bg-[#d4af37] hover:bg-[#e2bd47] text-[#0b0b0d] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>Track Order Live</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handlePrint}
              className="py-2.5 px-4 rounded-xl bg-[#1c1c28] hover:bg-[#262638] text-[#eae5d9] border border-[#2b2b3d] font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
