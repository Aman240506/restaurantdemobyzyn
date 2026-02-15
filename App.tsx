
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MenuSection from './components/MenuSection';
import ReservationSection from './components/ReservationSection';
import AdminDashboard from './components/AdminDashboard';
import { api } from './services/mockApi';
import { MenuItem, OrderItem, User } from './types';
import { ShoppingBag, X, Star, MapPin, Phone, Mail, Instagram, Facebook, Twitter, Smartphone, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'HOME' | 'ADMIN' | 'LOGIN' | 'QR_MENU'>('HOME');
  const [isRegister, setIsRegister] = useState(false);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(api.getCurrentUser());
    
    // Check if URL has a hash for QR menu (simulating scanning)
    if (window.location.hash === '#digital-menu') {
      setView('QR_MENU');
    }
  }, []);

  const handleNavClick = (sectionId: string) => {
    if (sectionId === 'login') {
      setView('LOGIN');
      return;
    }
    if (sectionId === 'qr-menu') {
      setView('QR_MENU');
      return;
    }
    setView('HOME');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleAddToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.menuItemId === item.id);
      if (existing) {
        return prev.map(i => i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { menuItemId: item.id, name: item.name, price: item.priceMin, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    const total = cart.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
    await api.createOrder({
      userId: user?.id || 'guest',
      items: cart,
      totalAmount: total
    });
    setCart([]);
    setIsCartOpen(false);
    alert('Royal Order Placed! Your GST invoice has been sent to your email.');
  };

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    try {
      if (isRegister) {
        const name = formData.get('name') as string;
        const phone = formData.get('phone') as string;
        await api.register({ name, email, phone, password });
        alert('Registration successful! Please login.');
        setIsRegister(false);
      } else {
        const loggedInUser = await api.login(email, password);
        setUser(loggedInUser);
        setView('HOME');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (view === 'ADMIN') {
    return <AdminDashboard onBack={() => setView('HOME')} />;
  }

  if (view === 'QR_MENU') {
    return (
      <div className="min-h-screen bg-[#1a0202]">
        <div className="bg-[#4A0404] p-6 text-center border-b border-[#C5A028]/20 sticky top-0 z-50 flex items-center justify-between">
          <button onClick={() => setView('HOME')} className="text-[#C5A028]"><ArrowLeft size={20}/></button>
          <div className="flex items-center gap-2">
            <Smartphone size={20} className="text-[#C5A028]"/>
            <h2 className="text-xl font-serif italic text-[#C5A028]">Royal Digital Concierge</h2>
          </div>
          <div className="w-5"></div>
        </div>
        <div className="pb-32">
          <MenuSection onAddToCart={handleAddToCart} cartCount={cart.length} onOpenCart={() => setIsCartOpen(true)} />
        </div>
      </div>
    );
  }

  if (view === 'LOGIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a0202] px-4">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]"></div>
        <div className="max-w-md w-full royal-border bg-[#4A0404] p-12 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-serif text-[#C5A028] mb-2 italic">{isRegister ? 'New Courtier' : 'Royal Access'}</h2>
            <p className="text-xs text-gray-400 uppercase tracking-widest">{isRegister ? 'Join the dynasty' : 'Sign in to your kingdom'}</p>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#C5A028] mb-2 font-bold">Full Name</label>
                  <input name="name" type="text" required className="w-full bg-[#1a0202]/50 border-b border-[#C5A028]/30 px-4 py-3 text-sm focus:border-[#C5A028] outline-none text-white" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#C5A028] mb-2 font-bold">Phone</label>
                  <input name="phone" type="tel" required className="w-full bg-[#1a0202]/50 border-b border-[#C5A028]/30 px-4 py-3 text-sm focus:border-[#C5A028] outline-none text-white" />
                </div>
              </>
            )}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#C5A028] mb-2 font-bold">Email Address</label>
              <input name="email" type="email" required className="w-full bg-[#1a0202]/50 border-b border-[#C5A028]/30 px-4 py-3 text-sm focus:border-[#C5A028] outline-none text-white" placeholder="maharaja@royalspice.com" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#C5A028] mb-2 font-bold">Secret Key</label>
              <input name="password" type="password" required className="w-full bg-[#1a0202]/50 border-b border-[#C5A028]/30 px-4 py-3 text-sm focus:border-[#C5A028] outline-none text-white" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full gold-gradient text-[#1a0202] py-4 font-bold uppercase tracking-widest hover:brightness-110 mt-4">
              {isRegister ? 'Proclaim Registry' : 'Enter The Gates'}
            </button>
            <div className="text-center mt-6">
              <button 
                type="button" 
                onClick={() => setIsRegister(!isRegister)}
                className="text-[10px] text-[#C5A028] uppercase tracking-widest font-bold hover:underline"
              >
                {isRegister ? 'Already a patron? Sign In' : 'New patron? Register here'}
              </button>
            </div>
          </form>
          <button onClick={() => setView('HOME')} className="mt-8 text-gray-500 text-[10px] uppercase tracking-widest block mx-auto hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeft size={12}/> Return to Palace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <Header onNavClick={handleNavClick} onAdminClick={() => setView('ADMIN')} />

      {/* Hero Section */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1920&q=80" 
            alt="Royal Interior" 
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a0202]/80 via-[#1a0202]/40 to-[#1a0202]"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-8">
          <div className="animate-fade-in-up">
            <h4 className="text-[#C5A028] uppercase tracking-[0.5em] text-sm md:text-base mb-4 font-semibold">Welcome to the Dynasty of Taste</h4>
            <h1 className="text-5xl md:text-8xl font-serif text-white mb-6 italic leading-tight">An Authentic Royal <span className="text-[#C5A028]">Indian</span> Experience</h1>
            <p className="text-gray-300 md:text-xl font-light italic max-w-2xl mx-auto leading-relaxed">
              Where heritage meets modern elegance. Savor the flavors once reserved only for the Maharajas.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 animate-fade-in-up [animation-delay:400ms]">
            <button 
              onClick={() => handleNavClick('reservations')}
              className="bg-[#C5A028] text-[#1a0202] px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-[#4A0404] transition-all duration-300 transform hover:-translate-y-1"
            >
              Reserve a Table
            </button>
            <button 
              onClick={() => handleNavClick('menu')}
              className="border-2 border-[#C5A028] text-[#C5A028] px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#C5A028] hover:text-[#1a0202] transition-all duration-300 transform hover:-translate-y-1"
            >
              Explore Menu
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#C5A028] animate-bounce">
          <span className="text-[10px] uppercase tracking-widest font-bold">Scroll</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-[#C5A028] to-transparent"></div>
        </div>
      </section>

      {/* Main Content */}
      <MenuSection onAddToCart={handleAddToCart} cartCount={cart.length} onOpenCart={() => setIsCartOpen(true)} />
      <ReservationSection />

      {/* Events Section */}
      <section id="events" className="py-24 bg-[#4A0404]/20 border-y border-[#C5A028]/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h4 className="text-[#C5A028] uppercase tracking-[0.3em] text-sm mb-4">Celebrations</h4>
            <h2 className="text-4xl md:text-6xl font-serif text-[#C5A028] mb-6 italic">Private Dining & Events</h2>
            <div className="w-24 h-1 bg-[#C5A028] mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Wedding Dinners", img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80" },
              { title: "Corporate Soirées", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80" },
              { title: "Royal Birthdays", img: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=600&q=80" }
            ].map((event, idx) => (
              <div key={idx} className="group relative h-[400px] overflow-hidden royal-border">
                <img src={event.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={event.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a0202] to-transparent opacity-80"></div>
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-2xl font-serif italic text-white mb-4">{event.title}</h3>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-[#C5A028] border-b border-[#C5A028] pb-1 hover:text-white hover:border-white transition-all">Inquire Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-24 bg-[#1a0202]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
           <div className="grid lg:grid-cols-3 gap-12">
             <div className="lg:col-span-1">
               <h2 className="text-4xl font-serif text-[#C5A028] mb-6 italic">What Our Royal Guests Say</h2>
               <div className="flex items-center gap-2 text-[#C5A028] mb-4">
                 <Star fill="currentColor" size={20} />
                 <Star fill="currentColor" size={20} />
                 <Star fill="currentColor" size={20} />
                 <Star fill="currentColor" size={20} />
                 <Star fill="currentColor" size={20} />
                 <span className="text-white ml-2">4.9/5</span>
               </div>
               <p className="text-gray-400 italic mb-8">Verified experiences from our cherished patrons across Google and TripAdvisor.</p>
               <button className="text-[#C5A028] border border-[#C5A028] px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#C5A028] hover:text-[#1a0202] transition-all">Write a Review</button>
             </div>
             
             <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
               {[
                 { name: "Priya Sharma", comment: "The Butter Chicken is legendary. The ambiance makes you feel like actual royalty. Highly recommend for anniversaries.", date: "2 days ago" },
                 { name: "Vikram Malhotra", comment: "Exceptional service. The staff is attentive but discreet. Dal Makhani is the best I've had in Mumbai.", date: "1 week ago" }
               ].map((rev, idx) => (
                 <div key={idx} className="bg-[#4A0404]/30 p-8 royal-border">
                   <p className="text-gray-300 italic mb-6 leading-relaxed">"{rev.comment}"</p>
                   <div className="flex justify-between items-center">
                     <span className="font-serif italic text-[#C5A028]">{rev.name}</span>
                     <span className="text-[10px] text-gray-500 uppercase">{rev.date}</span>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </section>

      {/* Contact & Footer */}
      <footer id="contact" className="bg-[#1a0202] border-t border-[#C5A028]/20 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <h2 className="text-2xl font-serif text-[#C5A028] italic">The Royal Spice</h2>
              <p className="text-gray-400 text-sm italic leading-relaxed">Preserving the culinary legacy of ancient India with a contemporary flair. Every dish tells a story of royalty.</p>
              <div className="flex gap-4">
                <a href="#" className="p-2 border border-[#C5A028]/30 text-[#C5A028] hover:bg-[#C5A028] hover:text-[#1a0202] transition-all"><Instagram size={18}/></a>
                <a href="#" className="p-2 border border-[#C5A028]/30 text-[#C5A028] hover:bg-[#C5A028] hover:text-[#1a0202] transition-all"><Facebook size={18}/></a>
                <a href="#" className="p-2 border border-[#C5A028]/30 text-[#C5A028] hover:bg-[#C5A028] hover:text-[#1a0202] transition-all"><Twitter size={18}/></a>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] uppercase tracking-widest text-[#C5A028] mb-8 font-bold">Contact Us</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="flex items-start gap-3"><MapPin size={18} className="text-[#C5A028] shrink-0" /> Heritage Square, Colaba, Mumbai, India</li>
                <li className="flex items-center gap-3"><Phone size={18} className="text-[#C5A028] shrink-0" /> +91 22 2345 6789</li>
                <li className="flex items-center gap-3"><Mail size={18} className="text-[#C5A028] shrink-0" /> reservations@royalspice.in</li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] uppercase tracking-widest text-[#C5A028] mb-8 font-bold">Quick Links</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#menu" className="hover:text-[#C5A028]">The Menu</a></li>
                <li><a href="#reservations" className="hover:text-[#C5A028]">Book Table</a></li>
                <li><a href="#events" className="hover:text-[#C5A028]">Private Dining</a></li>
                <li><a href="#" className="hover:text-[#C5A028]">Gift Vouchers</a></li>
                <li><a href="#" className="hover:text-[#C5A028]">Career</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] uppercase tracking-widest text-[#C5A028] mb-8 font-bold">Location</h4>
              <div className="h-48 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all border border-[#C5A028]/20">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15096.345842183863!2d72.8239!3d18.9218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7d1c676478953%3A0x63390c9b0e1e92d!2sGateway%20Of%20India%20Mumbai!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>

          <div className="border-t border-[#C5A028]/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-500 uppercase tracking-widest">
            <p>© 2024 The Royal Spice. All Rights Reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#C5A028]">Privacy Policy</a>
              <a href="#" className="hover:text-[#C5A028]">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div className="absolute inset-0 bg-[#1a0202]/80 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="absolute top-0 right-0 h-full w-full max-w-md bg-[#4A0404] royal-border p-8 shadow-2xl animate-fade-in-left">
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-4 text-[#C5A028]">
                <ShoppingBag size={24} />
                <h2 className="text-3xl font-serif italic">Your Pre-Order</h2>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="text-[#C5A028]"><X size={24} /></button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-24 space-y-6">
                <p className="text-gray-400 italic">Your royal basket is currently empty.</p>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="text-[#C5A028] border-b border-[#C5A028] text-xs uppercase tracking-widest font-bold"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              <div className="flex flex-col h-[calc(100%-12rem)]">
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center mb-6 border-b border-[#C5A028]/10 pb-4">
                      <div>
                        <h4 className="font-serif italic text-white">{item.name}</h4>
                        <p className="text-[10px] text-[#C5A028] uppercase tracking-widest">₹{item.price} x {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-white font-bold">₹{item.price * item.quantity}</span>
                        <button onClick={() => setCart(cart.filter(i => i.menuItemId !== item.menuItemId))} className="text-red-500/50 hover:text-red-500"><X size={14}/></button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-auto pt-8 border-t border-[#C5A028]/20 space-y-4">
                  <div className="flex justify-between text-[#C5A028]">
                    <span className="text-xs uppercase tracking-widest font-bold">Subtotal</span>
                    <span className="font-bold">₹{cart.reduce((a, b) => a + (b.price * b.quantity), 0)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span className="text-xs uppercase tracking-widest">GST (18%)</span>
                    <span>₹{Math.round(cart.reduce((a, b) => a + (b.price * b.quantity), 0) * 0.18)}</span>
                  </div>
                  <div className="flex justify-between text-white text-xl font-serif border-t border-[#C5A028]/20 pt-4 mb-8">
                    <span>Total</span>
                    <span className="text-[#C5A028]">₹{Math.round(cart.reduce((a, b) => a + (b.price * b.quantity), 0) * 1.18)}</span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full gold-gradient text-[#1a0202] py-4 font-bold uppercase tracking-widest shadow-lg hover:brightness-110 active:scale-95 transition-all"
                  >
                    Proceed to Payment
                  </button>
                  <p className="text-[10px] text-gray-500 text-center italic mt-2">Powered by Razorpay Secure Checkout</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
