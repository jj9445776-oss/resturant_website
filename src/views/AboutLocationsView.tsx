import React from 'react';
import { MapPin, Phone, Clock, Mail, ChefHat, Sparkles, MessageSquare, Award } from 'lucide-react';
import { Branch } from '../types';
import { NotificationService } from '../services/notificationService';
import { useCart } from '../context/CartContext';

interface AboutLocationsViewProps {
  branches: Branch[];
}

export const AboutLocationsView: React.FC<AboutLocationsViewProps> = ({ branches }) => {
  const { settings } = useCart();

  const handleWhatsAppBranch = (branchName: string) => {
    const text = `As-salamu alaykum, I am inquiring about table availability and parking at Dastaan ${branchName}.`;
    const url = NotificationService.getWhatsAppClickToChatUrl(
      settings.whatsappNumber || '+923001234567',
      text
    );
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Heritage Introduction */}
      <div className="text-center max-w-3xl mx-auto">
        <p className="font-urdu text-2xl text-[#d4af37]">ہماری داستانِ ذائقہ</p>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#f5efe6] mt-2">
          The Story of Dastaan
        </h1>
        <p className="text-sm text-[#aba9b8] mt-3 leading-relaxed">
          Founded on the principle that royal Pakistani cooking is a high culinary art. We honor century-old family recipes, cold-pressed mustard &amp; desi ghee, fresh whole spices ground in stone sil-battas, and genuine hand-hammered iron woks.
        </p>
      </div>

      {/* Culinary Philosophy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-[#13131b] border border-[#232332]">
          <div className="w-12 h-12 rounded-xl bg-[#1c1c28] border border-[#2f2f42] flex items-center justify-center text-[#d4af37] mb-4">
            <ChefHat className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-lg font-bold text-[#f5efe6] mb-2">
            Ancestral Recipes
          </h3>
          <p className="text-xs text-[#9c9aa8] leading-relaxed">
            Formulated over four decades by master Ustaads from Peshawar's Namak Mandi, Lahore's Old City, and the royal Mughal courts of Delhi.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#13131b] border border-[#232332]">
          <div className="w-12 h-12 rounded-xl bg-[#1c1c28] border border-[#2f2f42] flex items-center justify-center text-[#d4af37] mb-4">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-lg font-bold text-[#f5efe6] mb-2">
            No Frozen Cuts
          </h3>
          <p className="text-xs text-[#9c9aa8] leading-relaxed">
            100% pasture-raised local Pakistani mutton and tender chicken delivered daily. Meat is trimmed on-site and cooked fresh for every single order.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#13131b] border border-[#232332]">
          <div className="w-12 h-12 rounded-xl bg-[#1c1c28] border border-[#2f2f42] flex items-center justify-center text-[#d4af37] mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-lg font-bold text-[#f5efe6] mb-2">
            Royal Hospitality
          </h3>
          <p className="text-xs text-[#9c9aa8] leading-relaxed">
            In Pakistani culture, a guest is a blessing (Mehmaan Rehmat Hai). We treat every diner as nobility, from arrival to farewell.
          </p>
        </div>
      </div>

      {/* Flagship Branches */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="font-urdu text-xl text-[#d4af37]">ہماری برانچز</p>
          <h2 className="font-heading text-3xl font-bold text-[#f5efe6] mt-1">
            Our Flagship Dining Destinations
          </h2>
          <p className="text-xs text-[#9c9aa8] mt-1">
            Visit our royal halls or order doorstep delivery across major metropolitan zones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="p-6 sm:p-7 rounded-3xl bg-[#13131b] border border-[#252535] hover:border-[#d4af3760] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-heading text-xl font-bold text-[#f5efe6]">
                    {branch.name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#1e1c10] text-[#f3c64c] border border-[#d4af3740]">
                    Active Branch
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-[#a09fae] mt-4">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#d4af37] flex-shrink-0 mt-0.5" />
                    <span>{branch.address}, {branch.city}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#d4af37] flex-shrink-0" />
                    <span>{branch.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-[#d4af37] flex-shrink-0" />
                    <span>Daily: 12:00 PM – 02:00 AM (Dine-in &amp; Takeaway)</span>
                  </div>
                </div>

                {/* Delivery areas tag */}
                {branch.deliveryAreas && (
                  <div className="mt-4 pt-3 border-t border-[#1e1e2c]">
                    <span className="text-[10px] uppercase font-bold text-[#7d7c8d] block mb-1">
                      Delivery Coverage Sectors:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {branch.deliveryAreas.map((area, aidx) => (
                        <span
                          key={aidx}
                          className="px-2 py-0.5 rounded text-[10px] bg-[#191924] text-[#cccad6] border border-[#272737]"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[#1e1e2c] flex items-center justify-between gap-3">
                <button
                  onClick={() => handleWhatsAppBranch(branch.name)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#25D36615] hover:bg-[#25D36625] border border-[#25D36640] text-[#25D366] text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Branch Concierge WhatsApp</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
