
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { IndianRupee, Users, Utensils, TrendingUp, Check, X, ArrowLeft } from 'lucide-react';
import { api } from '../services/mockApi';
import { Reservation, Order, ReservationStatus } from '../types';

const revenueData = [
  { name: 'Mon', amount: 45000 },
  { name: 'Tue', amount: 52000 },
  { name: 'Wed', amount: 38000 },
  { name: 'Thu', amount: 65000 },
  { name: 'Fri', amount: 98000 },
  { name: 'Sat', amount: 125000 },
  { name: 'Sun', amount: 110000 },
];

const popularDishes = [
  { name: 'Butter Chicken', value: 400 },
  { name: 'Dal Makhani', value: 300 },
  { name: 'Mutton Rogan Josh', value: 200 },
  { name: 'Paneer Tikka', value: 250 },
];

const COLORS = ['#C5A028', '#800000', '#4A0404', '#E8D48A'];

interface AdminDashboardProps {
  onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.getReservations();
      const ord = await api.getOrders();
      setReservations(res);
      setOrders(ord);
    };
    fetchData();
  }, []);

  const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalAmount, 0) + 450000; // Simulated historical

  const updateStatus = async (id: string, status: ReservationStatus) => {
    await api.updateReservationStatus(id, status);
    const updated = await api.getReservations();
    setReservations(updated);
  };

  return (
    <div className="min-h-screen bg-[#1a0202] pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-serif text-[#C5A028] mb-2 italic">Royal Analytics</h2>
            <p className="text-gray-400">Welcome back, Maharaja of Operations.</p>
          </div>
          <button onClick={onBack} className="flex items-center gap-2 text-[#C5A028] hover:text-white transition-colors">
            <ArrowLeft size={20} /> Back to Site
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { title: "Daily Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: <IndianRupee />, trend: "+12.5%" },
            { title: "Active Bookings", value: reservations.filter(r => r.status === ReservationStatus.PENDING).length, icon: <Users />, trend: "Busy Night" },
            { title: "Orders Fulfilled", value: orders.length + 1240, icon: <Utensils />, trend: "+45 today" },
            { title: "Growth Rate", value: "24%", icon: <TrendingUp />, trend: "Steady" }
          ].map((stat, idx) => (
            <div key={idx} className="bg-[#4A0404]/30 royal-border p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="text-[#C5A028]">{stat.icon}</div>
                <span className="text-green-500 text-xs font-bold">{stat.trend}</span>
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{stat.title}</p>
              <h3 className="text-2xl font-serif text-white">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-[#4A0404]/20 royal-border p-8">
            <h4 className="text-lg font-serif italic text-[#C5A028] mb-6">Revenue Performance (Weekly)</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a1010" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#4A0404', border: '1px solid #C5A028' }}
                    itemStyle={{ color: '#C5A028' }}
                  />
                  <Bar dataKey="amount" fill="#C5A028" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#4A0404]/20 royal-border p-8">
            <h4 className="text-lg font-serif italic text-[#C5A028] mb-6">Popular Culinary Choices</h4>
            <div className="h-64 flex">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={popularDishes}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {popularDishes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col justify-center gap-2">
                {popularDishes.map((dish, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3" style={{ backgroundColor: COLORS[idx] }}></div>
                    <span className="text-gray-400">{dish.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#4A0404]/20 royal-border p-8">
          <h4 className="text-lg font-serif italic text-[#C5A028] mb-6">Recent Reservations</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#C5A028]/20 text-xs text-[#C5A028] uppercase tracking-widest font-bold">
                  <th className="pb-4 px-4">Guest</th>
                  <th className="pb-4 px-4">Date & Time</th>
                  <th className="pb-4 px-4">Guests</th>
                  <th className="pb-4 px-4">Status</th>
                  <th className="pb-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {reservations.map((res) => (
                  <tr key={res.id} className="border-b border-[#C5A028]/10 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 font-serif">{res.userName}</td>
                    <td className="py-4 px-4 text-gray-400">{res.date} • {res.timeSlot}</td>
                    <td className="py-4 px-4 text-gray-400">{res.guestCount} Ppl</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase ${
                        res.status === ReservationStatus.CONFIRMED ? 'text-green-500' :
                        res.status === ReservationStatus.CANCELLED ? 'text-red-500' : 'text-yellow-500'
                      }`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      {res.status === ReservationStatus.PENDING && (
                        <>
                          <button 
                            onClick={() => updateStatus(res.id, ReservationStatus.CONFIRMED)}
                            className="p-1 text-green-500 hover:bg-green-500/10 transition-colors"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                             onClick={() => updateStatus(res.id, ReservationStatus.CANCELLED)}
                             className="p-1 text-red-500 hover:bg-red-500/10 transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {reservations.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500 italic">No reservation records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
