
import React, { useState } from 'react';
import { Calendar, Users, Clock, MessageSquare, CheckCircle } from 'lucide-react';
import { api } from '../services/mockApi';
import { TIME_SLOTS } from '../constants';

const ReservationSection: React.FC = () => {
  const [formData, setFormData] = useState({
    date: '',
    timeSlot: '',
    guestCount: 2,
    specialRequest: '',
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await api.createReservation({
        userId: 'guest_user',
        userName: formData.name,
        date: formData.date,
        timeSlot: formData.timeSlot,
        guestCount: formData.guestCount,
        specialRequest: formData.specialRequest
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section id="reservations" className="py-24 bg-[#1a0202] flex items-center justify-center">
        <div className="max-w-xl text-center royal-border p-12 bg-[#4A0404]/30 backdrop-blur-sm animate-fade-in">
          <CheckCircle className="mx-auto text-[#C5A028] mb-6" size={64} />
          <h2 className="text-3xl font-serif text-[#C5A028] mb-4 italic">Request Received!</h2>
          <p className="text-gray-300 mb-8 leading-relaxed">
            Your table reservation for <strong>{formData.date}</strong> at <strong>{formData.timeSlot}</strong> has been logged. Our concierge will contact you shortly via SMS/Email for final confirmation.
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="bg-[#C5A028] text-[#1a0202] px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#E8D48A]"
          >
            New Reservation
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="reservations" className="py-24 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 border-8 border-[#C5A028] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 border-4 border-[#C5A028] -translate-x-1/2 translate-y-1/2 rotate-45"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h4 className="text-[#C5A028] uppercase tracking-[0.3em] text-sm mb-4">Experience</h4>
            <h2 className="text-4xl md:text-6xl font-serif text-[#C5A028] mb-8 italic">Reserve A Table</h2>
            <p className="text-gray-400 mb-8 leading-relaxed italic text-lg">
              "Dining at The Royal Spice is more than a meal; it is a journey through India's regal past. Allow us to curate an evening of opulence for you."
            </p>
            
            <div className="space-y-6">
              {[
                { icon: <Clock size={20} />, title: "Operating Hours", desc: "Lunch: 12 PM - 3 PM | Dinner: 7 PM - 11 PM" },
                { icon: <Users size={20} />, title: "Private Events", desc: "For groups larger than 12, please use our Inquiry Form." },
                { icon: <Calendar size={20} />, title: "Same Day Booking", desc: "Please call us directly for immediate availability." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="text-[#C5A028] mt-1">{item.icon}</div>
                  <div>
                    <h5 className="font-serif italic text-white text-lg">{item.title}</h5>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#4A0404] royal-border p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#C5A028] mb-2 font-bold">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-[#1a0202]/50 border-b border-[#C5A028]/30 px-4 py-3 text-sm focus:border-[#C5A028] outline-none transition-all"
                    placeholder="Maharaja Gupta"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#C5A028] mb-2 font-bold">Phone Number</label>
                  <input
                    type="tel"
                    required
                    className="w-full bg-[#1a0202]/50 border-b border-[#C5A028]/30 px-4 py-3 text-sm focus:border-[#C5A028] outline-none transition-all"
                    placeholder="+91 99999 99999"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#C5A028] mb-2 font-bold">Date</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-[#1a0202]/50 border-b border-[#C5A028]/30 px-4 py-3 text-sm focus:border-[#C5A028] outline-none transition-all appearance-none"
                    value={formData.date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#C5A028] mb-2 font-bold">Time Slot</label>
                  <select
                    required
                    className="w-full bg-[#1a0202]/50 border-b border-[#C5A028]/30 px-4 py-3 text-sm focus:border-[#C5A028] outline-none transition-all"
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({...formData, timeSlot: e.target.value})}
                  >
                    <option value="" disabled>Select a time</option>
                    {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#C5A028] mb-2 font-bold">Number of Guests</label>
                  <div className="flex items-center gap-4 bg-[#1a0202]/50 border-b border-[#C5A028]/30 px-4 py-2">
                    <button type="button" onClick={() => setFormData({...formData, guestCount: Math.max(1, formData.guestCount - 1)})} className="text-[#C5A028] hover:scale-125 transition-transform">-</button>
                    <span className="flex-1 text-center font-bold text-[#C5A028]">{formData.guestCount}</span>
                    <button type="button" onClick={() => setFormData({...formData, guestCount: Math.min(12, formData.guestCount + 1)})} className="text-[#C5A028] hover:scale-125 transition-transform">+</button>
                  </div>
                </div>
                <div>
                   <label className="block text-[10px] uppercase tracking-widest text-[#C5A028] mb-2 font-bold">Advance Payment</label>
                   <p className="text-[10px] text-gray-500 italic mt-1 leading-tight">Paid bookings receive priority window-side seating.</p>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#C5A028] mb-2 font-bold">Special Requests</label>
                <textarea
                  className="w-full bg-[#1a0202]/50 border-b border-[#C5A028]/30 px-4 py-3 text-sm focus:border-[#C5A028] outline-none transition-all h-24 resize-none"
                  placeholder="Anniversary, Food Allergies, Baby Chair, etc."
                  value={formData.specialRequest}
                  onChange={(e) => setFormData({...formData, specialRequest: e.target.value})}
                ></textarea>
              </div>

              {error && <p className="text-red-500 text-xs italic">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full gold-gradient text-[#1a0202] py-4 font-bold uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Checking Availability...' : 'Secure Your Table'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReservationSection;
