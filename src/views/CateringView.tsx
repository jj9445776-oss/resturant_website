import React, { useState } from 'react';
import { Sparkles, Users, Calendar, MapPin, CheckCircle2, MessageSquare, Utensils, HeartHandshake } from 'lucide-react';
import { createCateringLead } from '../services/dbService';
import { NotificationService } from '../services/notificationService';
import { useCart } from '../context/CartContext';

export const CateringView: React.FC = () => {
  const { settings } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('0300-1234567');
  const [email, setEmail] = useState('');
  const [eventType, setEventType] = useState('Royal Wedding / Walima');
  const [guestCount, setGuestCount] = useState(150);
  const [eventDate, setEventDate] = useState('2026-10-15');
  const [city, setCity] = useState('Lahore');
  const [estimatedBudget, setEstimatedBudget] = useState('PKR 350,000 - 500,000');
  const [specialRequirements, setSpecialRequirements] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createCateringLead({
        id: `cat-${Date.now()}`,
        name: name.trim() || 'Royal Host',
        phone: phone.trim(),
        email: email.trim(),
        eventType,
        guests: Number(guestCount),
        eventDate,
        budgetRange: estimatedBudget,
        foodRequirements: specialRequirements.trim() || 'Complete royal catering package with live sigri and tandoor.',
        status: 'new',
        createdAt: new Date().toISOString(),
      });
      setIsSuccess(true);
    } catch (err) {
      console.error('Catering inquiry error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDirectWhatsApp = () => {
    const text =
      `✨ *DASTAAN ROYAL CATERING INQUIRY* ✨\n\n` +
      `Host: ${name || 'Prospective Host'}\n` +
      `Event: ${eventType}\n` +
      `Guests: ${guestCount} Persons\n` +
      `Date: ${eventDate}\n` +
      `City: ${city}\n` +
      `Budget: ${estimatedBudget}\n\n` +
      `Notes: ${specialRequirements || 'Seeking complete royal catering package with live sigri and clay oven tandoor setup.'}`;

    const url = NotificationService.getWhatsAppClickToChatUrl(
      settings.whatsappNumber || '+923001234567',
      text
    );
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1e1a10] border border-[#d4af3760] text-[#f3c64c] text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Shahi Dastarkhwan for Celebrations</span>
        </div>
        <p className="font-urdu text-2xl text-[#d4af37]">شاہی کیٹرنگ اور شاندار دعوت</p>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#f5efe6] mt-2">
          Royal Catering &amp; Wedding Feasts
        </h1>
        <p className="text-sm text-[#a5a4b4] mt-3 leading-relaxed">
          From opulent Walima receptions and Mehndi dawats to high-profile corporate galas. We transport our live charcoal sigris, iron karahi woks, and live tandoors directly to your venue.
        </p>
      </div>

      {/* Catering Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: 'Mughlai Grand Feast',
            urdu: 'شاہی مغلئی طعام',
            price: 'From PKR 2,850 / person',
            features: [
              'Mutton Dum Pukht Biryani with saffron rice',
              'Shinwari Mutton Karahi in cold-pressed desi ghee',
              'Charcoal Reshmi Kebabs & Kasturi Boti',
              'Assorted Roghani & Garlic Naan live from clay tandoor',
              'Zafrani Shahi Kheer & Badami Kulfi',
              'Royal brass chafing dishes & white-glove service',
            ],
          },
          {
            title: 'Shinwari Live Wok BBQ',
            urdu: 'شنواری لائیو باربی کیو',
            price: 'From PKR 3,450 / person',
            popular: true,
            features: [
              'Live Shinwari mutton woks prepared before guests',
              'Whole Balochi Sajji with aromatic brown rice',
              'Seekh Kebabs, Malai Boti & Peshawari Chapli Kebabs',
              'Traditional Peshawari Qahwa with Cardamom',
              'Fresh live salads, plum chutney & mint raita',
              'Full live cooking station setup and uniformed chefs',
            ],
          },
          {
            title: 'Corporate Executive Dawat',
            urdu: 'کارپوریٹ ایگزیکٹو ضیافت',
            price: 'From PKR 2,250 / person',
            features: [
              'Boneless Chicken Makhni Handi & Mughlai Karahi',
              'Chicken Dum Biryani with raita',
              'Crispy Seekh Kebabs & Fish Tikka (Seasonal)',
              'Warm Gulab Jamun & Rabri',
              'Mineral water, gourmet drinks & green tea',
              'Strict punctual setup & professional banquet staff',
            ],
          },
        ].map((tier, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-3xl bg-[#13131b] border flex flex-col justify-between ${
              tier.popular ? 'border-[#d4af37] shadow-xl shadow-[#d4af3710]' : 'border-[#242434]'
            }`}
          >
            <div>
              {tier.popular && (
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#d4af37] text-[#0b0b0d] mb-3 inline-block">
                  Most Preferred
                </span>
              )}
              <p className="font-urdu text-base text-[#d4af37]">{tier.urdu}</p>
              <h3 className="font-heading text-xl font-bold text-[#f5efe6]">{tier.title}</h3>
              <p className="text-sm font-semibold text-[#d4af37] mt-1">{tier.price}</p>

              <ul className="mt-5 space-y-2.5 text-xs text-[#a7a5b6]">
                {tier.features.map((feat, fidx) => (
                  <li key={fidx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                setEventType(tier.title);
                window.scrollTo({ top: 900, behavior: 'smooth' });
              }}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-[#1d1d2b] hover:bg-[#d4af37] text-[#eae5d9] hover:text-[#0b0b0d] font-bold text-xs transition-colors cursor-pointer border border-[#2e2e42]"
            >
              Select Package &amp; Inquire
            </button>
          </div>
        ))}
      </div>

      {/* Inquiry Form */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#111118] border border-[#272737]">
        {isSuccess ? (
          <div className="text-center max-w-md mx-auto py-8">
            <div className="w-16 h-16 rounded-full bg-[#183520] border border-[#22c55e] flex items-center justify-center mx-auto mb-4 text-[#4ade80]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-[#f5efe6]">
              Inquiry Dispatched to Royal Banquet Desk
            </h3>
            <p className="text-xs text-[#9c9aa8] mt-2 mb-6">
              Our Executive Catering Manager will review your requirements and get in touch within 2 business hours.
            </p>
            <button
              onClick={handleDirectWhatsApp}
              className="py-3 px-6 rounded-xl bg-[#25D366] text-[#082010] font-bold text-xs flex items-center justify-center gap-2 mx-auto cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Connect on WhatsApp Instantly</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#20202e]">
              <div>
                <h3 className="font-heading text-2xl font-bold text-[#f5efe6]">
                  Request a Customized Catering Proposal
                </h3>
                <p className="text-xs text-[#8e8d9e] mt-1">
                  Share your event parameters for an itemized estimate and menu tasting session.
                </p>
              </div>
              <button
                type="button"
                onClick={handleDirectWhatsApp}
                className="px-4 py-2 rounded-xl bg-[#25D3661a] hover:bg-[#25D3662a] border border-[#25D36640] text-[#25D366] text-xs font-semibold flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Instant WhatsApp Concierge</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#9d9ba9] mb-1">Host Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sardar Usman Liaquat"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#161622] border border-[#272737] text-sm text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#9d9ba9] mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0300-1234567"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#161622] border border-[#272737] text-sm text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#9d9ba9] mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usman@domain.pk"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#161622] border border-[#272737] text-sm text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#9d9ba9] mb-1">Event Type</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#161622] border border-[#272737] text-sm text-white focus:outline-none focus:border-[#d4af37] cursor-pointer"
                >
                  <option value="Royal Wedding / Walima">Royal Wedding / Walima</option>
                  <option value="Mehndi / Sangeet Night">Mehndi / Sangeet Night</option>
                  <option value="Corporate Annual Gala">Corporate Annual Gala</option>
                  <option value="Executive Boardroom Lunch">Executive Boardroom Lunch</option>
                  <option value="Family Dawat / Anniversary">Family Dawat / Anniversary</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9d9ba9] mb-1">Guest Count</label>
                <input
                  type="number"
                  min="20"
                  max="2000"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#161622] border border-[#272737] text-sm text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9d9ba9] mb-1">Event Date</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#161622] border border-[#272737] text-sm text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9d9ba9] mb-1">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#161622] border border-[#272737] text-sm text-white focus:outline-none focus:border-[#d4af37] cursor-pointer"
                >
                  <option value="Lahore">Lahore</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Faisalabad">Faisalabad</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9d9ba9] mb-1">
                Special Catering Preferences &amp; Live Setup Requirements
              </label>
              <textarea
                rows={3}
                value={specialRequirements}
                onChange={(e) => setSpecialRequirements(e.target.value)}
                placeholder="Mention specific dishes, live tandoor requests, welcome drink setups, or floral arrangements..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#161622] border border-[#272737] text-sm text-white placeholder-[#585765] focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-xl bg-[#d4af37] hover:bg-[#e4bd43] text-[#0b0b0d] font-bold text-sm transition-colors cursor-pointer shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting Inquiry...' : 'Submit Catering Proposal Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
