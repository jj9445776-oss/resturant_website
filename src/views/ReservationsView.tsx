import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  MapPin,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  UtensilsCrossed,
  ShieldCheck,
} from 'lucide-react';
import { Reservation, Branch } from '../types';
import { createReservation } from '../services/dbService';
import { NotificationService } from '../services/notificationService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface ReservationsViewProps {
  branches: Branch[];
}

export const ReservationsView: React.FC<ReservationsViewProps> = ({ branches }) => {
  const { settings } = useCart();
  const { currentUser, userProfile } = useAuth();

  const [selectedBranchId, setSelectedBranchId] = useState(branches[0]?.id || 'branch-gulberg-lhr');
  const [customerName, setCustomerName] = useState(userProfile?.displayName || currentUser?.displayName || '');
  const [customerPhone, setCustomerPhone] = useState(userProfile?.phone || '0300-1234567');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [guests, setGuests] = useState(4);
  const [date, setDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('20:00');
  const [seatingArea, setSeatingArea] = useState<'hall' | 'rooftop' | 'majlis' | 'vip'>('rooftop');
  const [occasion, setOccasion] = useState('Family Feast');
  const [specialRequests, setSpecialRequests] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  const selectedBranch = branches.find((b) => b.id === selectedBranchId) || branches[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const resNumber = `RES-2026-${Math.floor(Math.random() * 90000 + 10000)}`;
      const reservationId = `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

      const newRes: Reservation = {
        id: reservationId,
        reservationNumber: resNumber,
        branchId: selectedBranch.id,
        branchName: selectedBranch.name,
        customerName: customerName.trim() || 'Royal Guest',
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        guests: Number(guests),
        date,
        time,
        seatingArea,
        occasion,
        specialRequests: specialRequests.trim(),
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      await createReservation(newRes);

      // Trigger simulated SMS notification
      await NotificationService.dispatchServerNotification(
        'sms',
        newRes.customerPhone,
        NotificationService.formatReservationSMS(newRes)
      );

      setConfirmedReservation(newRes);
    } catch (err) {
      console.error('Reservation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppShare = () => {
    if (!confirmedReservation) return;
    const msg =
      `✨ *DASTAAN TABLE RESERVATION CONFIRMATION* ✨\n\n` +
      `Booking Ref: ${confirmedReservation.reservationNumber}\n` +
      `Guest Name: ${confirmedReservation.customerName}\n` +
      `Branch: ${confirmedReservation.branchName}\n` +
      `Date & Time: ${confirmedReservation.date} at ${confirmedReservation.time}\n` +
      `Guests: ${confirmedReservation.guests} Persons\n` +
      `Seating Area: ${confirmedReservation.seatingArea.toUpperCase()}\n` +
      `Occasion: ${confirmedReservation.occasion}\n\n` +
      `Looking forward to hosting your royal dastarkhwan. For directions call ${selectedBranch?.phone || '0300-1234567'}.`;

    const url = NotificationService.getWhatsAppClickToChatUrl(
      settings.whatsappNumber || '+923001234567',
      msg
    );
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <p className="font-urdu text-xl text-[#d4af37]">شاہی میز کی بکنگ</p>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#f5efe6] mt-1">
          Reserve a Royal Table
        </h1>
        <p className="text-xs text-[#9d9ba9] mt-2">
          Experience timeless Mughlai elegance, candlelit starlit rooftops, or our traditional floor majlis dastarkhwan.
        </p>
      </div>

      {confirmedReservation ? (
        <div className="max-w-xl mx-auto p-8 rounded-3xl bg-[#12121a] border border-[#2d2d3e] text-center shadow-2xl animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-[#16301d] border border-[#22c55e] flex items-center justify-center mx-auto mb-4 text-[#4ade80]">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <p className="font-urdu text-base text-[#d4af37]">آپ کی بکنگ محفوظ کر لی گئی ہے</p>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#f5efe6] mt-1">
            Table Confirmed!
          </h2>
          <p className="text-xs text-[#9d9ba9] mt-1">
            Reference Number: <strong className="text-[#d4af37] font-mono text-sm">{confirmedReservation.reservationNumber}</strong>
          </p>

          <div className="mt-6 p-4 rounded-xl bg-[#0b0b10] border border-[#20202c] text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-[#848394]">Branch:</span>
              <span className="text-[#f5efe6] font-semibold">{confirmedReservation.branchName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#848394]">Date &amp; Time:</span>
              <span className="text-[#f5efe6] font-semibold">{confirmedReservation.date} at {confirmedReservation.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#848394]">Party Size:</span>
              <span className="text-[#f5efe6] font-semibold">{confirmedReservation.guests} Guests</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#848394]">Seating Area:</span>
              <span className="text-[#d4af37] font-semibold uppercase">{confirmedReservation.seatingArea}</span>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <button
              onClick={handleWhatsAppShare}
              className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-[#071b0e] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Share Booking on WhatsApp</span>
            </button>
            <button
              onClick={() => setConfirmedReservation(null)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#1c1c28] hover:bg-[#242434] text-[#eae5d9] text-xs font-semibold cursor-pointer"
            >
              Book Another Table
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Branch Selector */}
            <div className="p-5 rounded-2xl bg-[#13131b] border border-[#232330]">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#d4af37] mb-3 flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>Select Dastaan Flagship Branch</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {branches.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBranchId(b.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedBranchId === b.id
                        ? 'border-[#d4af37] bg-[#221c0e] text-[#f5efe6]'
                        : 'border-[#262638] bg-[#161622] text-[#8e8d9e]'
                    }`}
                  >
                    <span className="font-bold text-xs block text-[#f5efe6]">{b.name}</span>
                    <span className="text-[11px] text-[#8e8d9e] block mt-0.5 truncate">{b.address}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Date, Time, Guests */}
            <div className="p-5 rounded-2xl bg-[#13131b] border border-[#232330] space-y-4">
              <h3 className="font-heading text-sm font-semibold text-[#f5efe6] uppercase tracking-wider">
                Schedule &amp; Guests
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-[#9d9ba9] mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171723] border border-[#2b2b3b] text-sm text-[#f5efe6] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#9d9ba9] mb-1">Time Slot *</label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171723] border border-[#2b2b3b] text-sm text-[#f5efe6] focus:outline-none focus:border-[#d4af37] cursor-pointer"
                  >
                    <option value="12:30">12:30 PM (Lunch)</option>
                    <option value="13:30">01:30 PM (Lunch)</option>
                    <option value="14:30">02:30 PM (Lunch)</option>
                    <option value="19:30">07:30 PM (Dinner)</option>
                    <option value="20:30">08:30 PM (Prime Dinner)</option>
                    <option value="21:30">09:30 PM (Prime Dinner)</option>
                    <option value="22:30">10:30 PM (Late Night)</option>
                    <option value="23:30">11:30 PM (Midnight Feast)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[#9d9ba9] mb-1">Party Size *</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171723] border border-[#2b2b3b] text-sm text-[#f5efe6] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>
            </div>

            {/* Seating Ambiance */}
            <div className="p-5 rounded-2xl bg-[#13131b] border border-[#232330]">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#d4af37] mb-3">
                Preferred Dining Ambiance
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'rooftop', title: 'Starlit Rooftop', desc: 'Panoramic city view' },
                  { id: 'hall', title: 'Royal Hall', desc: 'Live qawwali & chandeliers' },
                  { id: 'majlis', title: 'Royal Majlis', desc: 'Floor dastarkhwan' },
                  { id: 'vip', title: 'Private VIP Room', desc: 'Dedicated butler' },
                ].map((amb) => (
                  <button
                    key={amb.id}
                    type="button"
                    onClick={() => setSeatingArea(amb.id as any)}
                    className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                      seatingArea === amb.id
                        ? 'border-[#d4af37] bg-[#221c0e] text-[#f3c64c] font-bold'
                        : 'border-[#262638] bg-[#161622] text-[#8e8d9e]'
                    }`}
                  >
                    <span className="text-xs block">{amb.title}</span>
                    <span className="text-[10px] text-[#787788] block mt-0.5">{amb.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Guest Details */}
            <div className="p-5 rounded-2xl bg-[#13131b] border border-[#232330] space-y-4">
              <h3 className="font-heading text-sm font-semibold text-[#f5efe6] uppercase tracking-wider">
                Guest Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#9d9ba9] mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Mian Tariq Mahmood"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171723] border border-[#2b2b3b] text-sm text-[#f5efe6] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#9d9ba9] mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171723] border border-[#2b2b3b] text-sm text-[#f5efe6] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#9d9ba9] mb-1">Special Occasion or Setup Notes</label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Birthday cake arrangement, anniversary rose petals, high-chair needed"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171723] border border-[#2b2b3b] text-sm text-[#f5efe6] focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>
          </div>

          {/* Right Summary */}
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-[#13131b] border border-[#272737] space-y-4 sticky top-28">
              <h3 className="font-heading text-base font-bold text-[#f5efe6] pb-3 border-b border-[#20202e]">
                Reservation Overview
              </h3>

              <div className="text-xs space-y-2.5 text-[#9d9ba9]">
                <div>
                  <span className="text-[#6d6c7b] block">Branch:</span>
                  <span className="text-[#f5efe6] font-medium">{selectedBranch?.name}</span>
                </div>
                <div>
                  <span className="text-[#6d6c7b] block">Date &amp; Time:</span>
                  <span className="text-[#f5efe6] font-medium">{date} at {time}</span>
                </div>
                <div>
                  <span className="text-[#6d6c7b] block">Number of Guests:</span>
                  <span className="text-[#d4af37] font-bold">{guests} Persons</span>
                </div>
                <div>
                  <span className="text-[#6d6c7b] block">Atmosphere:</span>
                  <span className="text-[#f5efe6] font-medium capitalize">{seatingArea}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#20202e]">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#d4af37] hover:bg-[#e4bd43] text-[#0b0b0d] font-bold text-sm tracking-wide transition-all shadow-xl cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Securing Table...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Confirm Royal Table</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-center text-[#6e6d7d]">
                No advance booking deposit required for groups under 10 guests. Tables held for 20 minutes past reservation time.
              </p>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
