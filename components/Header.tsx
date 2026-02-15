
import React, { useState, useEffect } from 'react';
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';
import { api } from '../services/mockApi';
import { User } from '../types';

interface HeaderProps {
  onNavClick: (section: string) => void;
  onAdminClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavClick, onAdminClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    setUser(api.getCurrentUser());
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    api.logout();
    setUser(null);
    window.location.reload();
  };

  const menuItems = [
    { name: 'Menu', id: 'menu' },
    { name: 'Reservations', id: 'reservations' },
    { name: 'Events', id: 'events' },
    { name: 'Reviews', id: 'reviews' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#1a0202]/95 backdrop-blur-md border-b border-[#C5A028]/20 py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => onNavClick('hero')}>
          <div className="w-10 h-10 border-2 border-[#C5A028] flex items-center justify-center transform group-hover:rotate-45 transition-transform">
            <span className="text-[#C5A028] font-serif font-bold -rotate-45 group-hover:rotate-0">RS</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-serif font-bold text-[#C5A028] tracking-widest leading-none">THE ROYAL SPICE</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Fine Indian Dining</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavClick(item.id)}
              className="text-sm uppercase tracking-widest hover:text-[#C5A028] transition-colors"
            >
              {item.name}
            </button>
          ))}
          {user ? (
            <div className="flex items-center gap-4 pl-4 border-l border-[#C5A028]/20">
              {user.role === 'ADMIN' && (
                <button onClick={onAdminClick} className="p-2 text-[#C5A028] hover:bg-[#C5A028]/10 rounded-full transition-colors">
                  <LayoutDashboard size={20} />
                </button>
              )}
              <button onClick={handleLogout} className="p-2 hover:text-[#C5A028] transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button onClick={() => onNavClick('login')} className="bg-[#C5A028] text-[#1a0202] px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#E8D48A] transition-colors rounded-sm">
              Login
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-[#C5A028]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#1a0202] border-t border-[#C5A028]/20 py-8 px-4 animate-fade-in-down">
          <div className="flex flex-col gap-6 items-center">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { onNavClick(item.id); setIsMobileMenuOpen(false); }}
                className="text-lg uppercase tracking-widest hover:text-[#C5A028]"
              >
                {item.name}
              </button>
            ))}
            {!user && (
               <button onClick={() => { onNavClick('login'); setIsMobileMenuOpen(false); }} className="w-full bg-[#C5A028] text-[#1a0202] py-4 font-bold uppercase tracking-widest">
                Login
               </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
