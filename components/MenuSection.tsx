
import React, { useState } from 'react';
import { Leaf, Flame, Plus, ShoppingCart, Info, QrCode, X, Share2, Smartphone } from 'lucide-react';
import { MENU_ITEMS } from '../constants';
import { Category, MenuItem, SpiceLevel } from '../types';
import { api } from '../services/mockApi';

interface MenuSectionProps {
  onAddToCart: (item: MenuItem) => void;
  cartCount: number;
  onOpenCart: () => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({ onAddToCart, cartCount, onOpenCart }) => {
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [showQr, setShowQr] = useState(false);
  const [itemQr, setItemQr] = useState<{ name: string; url: string } | null>(null);

  const categories = ['All', ...Object.values(Category)];

  const filteredItems = activeCategory === 'All' 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === activeCategory);

  const getSpiceIcon = (level: SpiceLevel) => {
    const count = level === SpiceLevel.MILD ? 1 : level === SpiceLevel.MEDIUM ? 2 : 3;
    return (
      <div className="flex gap-0.5 text-red-500">
        {[...Array(count)].map((_, i) => <Flame key={i} size={12} fill="currentColor" />)}
      </div>
    );
  };

  const shareMenu = () => {
    const url = window.location.href + '#digital-menu';
    navigator.clipboard.writeText(url);
    alert('Digital Menu link copied! You can now scan it or share with your table.');
  };

  const showItemQr = async (item: MenuItem) => {
    const qrUrl = await api.getMenuItemQr(item.id);
    setItemQr({ name: item.name, url: qrUrl });
  };

  return (
    <section id="menu" className="py-24 bg-[#1a0202]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h4 className="text-[#C5A028] uppercase tracking-[0.3em] text-sm mb-4">Gastronomy</h4>
          <h2 className="text-4xl md:text-6xl font-serif text-[#C5A028] mb-6 italic">Signature Menu</h2>
          <div className="w-24 h-1 bg-[#C5A028] mx-auto mb-8"></div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as any)}
                className={`px-6 py-2 border border-[#C5A028]/20 text-xs font-semibold uppercase tracking-widest transition-all ${
                  activeCategory === cat ? 'bg-[#C5A028] text-[#1a0202]' : 'hover:border-[#C5A028] text-gray-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div key={item.id} className="group royal-border p-4 bg-[#4A0404]/30 hover:bg-[#4A0404]/50 transition-all duration-500">
              <div className="relative h-64 mb-6 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  loading="lazy"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute top-4 right-4 bg-[#1a0202]/80 p-2 backdrop-blur-sm">
                  {item.isVeg ? (
                    <div className="flex items-center gap-1 text-green-500 text-[10px] font-bold uppercase">
                      <Leaf size={14} /> Veg
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-500 text-[10px] font-bold uppercase">
                      <div className="w-3 h-3 border-2 border-red-500 rounded-sm flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      </div> Non-Veg
                    </div>
                  )}
                </div>
                {/* Individual Item QR Trigger */}
                <button 
                  onClick={() => showItemQr(item)}
                  className="absolute bottom-4 right-4 bg-white/10 hover:bg-[#C5A028] text-white hover:text-[#1a0202] p-2 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                >
                  <QrCode size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-serif text-[#C5A028] group-hover:italic transition-all">
                    {item.name}
                  </h3>
                  <div className="text-right">
                    <p className="text-[#C5A028] font-bold">
                      ₹{item.priceMin}{item.priceMax ? ` - ₹${item.priceMax}` : ''}
                    </p>
                    {getSpiceIcon(item.spiceLevel)}
                  </div>
                </div>
                
                <p className="text-sm text-gray-400 leading-relaxed italic">
                  {item.description}
                </p>

                <div className="pt-4 flex justify-between items-center">
                  <button className="text-gray-500 hover:text-[#C5A028] transition-colors">
                    <Info size={18} />
                  </button>
                  <button 
                    onClick={() => onAddToCart(item)}
                    className="flex items-center gap-2 bg-[#C5A028]/10 hover:bg-[#C5A028] border border-[#C5A028] text-[#C5A028] hover:text-[#1a0202] px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all"
                  >
                    <Plus size={14} /> Add to Pre-Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-8 border-t border-[#C5A028]/20 pt-12">
           <button 
            onClick={() => setShowQr(true)}
            className="flex items-center gap-4 text-[#C5A028] border border-[#C5A028] px-8 py-4 hover:bg-[#C5A028] hover:text-[#1a0202] transition-all group"
           >
              <QrCode size={24} />
              <div className="text-left">
                <p className="text-xs font-bold uppercase tracking-widest">Full Digital Menu</p>
                <p className="text-[10px] opacity-70">Scan for your table</p>
              </div>
           </button>

           <div className="text-center md:text-left max-w-sm">
              <h4 className="text-lg font-serif italic text-[#C5A028] mb-2">Prefer Dining At Home?</h4>
              <p className="text-xs text-gray-400">Order from our digital menu and experience the royal flavors delivered to your doorstep.</p>
           </div>
        </div>

        {/* Float Action Button for Cart */}
        {cartCount > 0 && (
          <button 
            onClick={onOpenCart}
            className="fixed bottom-8 right-8 z-40 bg-[#C5A028] text-[#1a0202] w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform animate-bounce"
          >
            <ShoppingCart size={24} />
            <span className="absolute -top-1 -right-1 bg-white text-[#1a0202] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-[#C5A028]">
              {cartCount}
            </span>
          </button>
        )}

        {/* QR Code Modal Simulation */}
        {showQr && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-[#1a0202]/90" onClick={() => setShowQr(false)}></div>
            <div className="relative bg-[#4A0404] royal-border p-12 max-w-xs w-full text-center">
              <button onClick={() => setShowQr(false)} className="absolute top-4 right-4 text-[#C5A028]"><X size={20}/></button>
              <h3 className="text-2xl font-serif text-[#C5A028] mb-6 italic">Scan for Magic</h3>
              <div className="bg-white p-4 inline-block mb-6 rounded-lg">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.href + '#digital-menu')}`} alt="Full Menu QR Code" />
              </div>
              <p className="text-xs text-gray-300 italic mb-6">Download our digital concierge to view ingredients and allergens in real-time.</p>
              <button 
                onClick={shareMenu}
                className="flex items-center justify-center gap-2 w-full border border-[#C5A028] py-3 text-[10px] font-bold uppercase tracking-widest text-[#C5A028] hover:bg-[#C5A028] hover:text-[#1a0202] transition-all"
              >
                <Share2 size={14}/> Copy Concierge Link
              </button>
            </div>
          </div>
        )}

        {/* Individual Item QR Modal */}
        {itemQr && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-[#1a0202]/90" onClick={() => setItemQr(null)}></div>
            <div className="relative bg-[#4A0404] royal-border p-8 max-w-xs w-full text-center animate-fade-in-up">
              <button onClick={() => setItemQr(null)} className="absolute top-4 right-4 text-[#C5A028]"><X size={20}/></button>
              <Smartphone size={32} className="mx-auto text-[#C5A028] mb-4" />
              <h3 className="text-xl font-serif text-[#C5A028] mb-1 italic">{itemQr.name}</h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-6">Deep Link Passport</p>
              <div className="bg-white p-4 inline-block mb-6 rounded-lg shadow-2xl">
                <img src={itemQr.url} alt={`${itemQr.name} QR Code`} />
              </div>
              <p className="text-[10px] text-gray-300 italic">Scan this to show only this dish to your guests or share the specific flavor experience.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuSection;
