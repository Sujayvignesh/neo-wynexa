import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');
  
  const [stats, setStats] = useState([
    { label: 'Total Revenue', value: '₹0.00', change: '+0.0%', icon: 'attach_money', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Total Orders', value: '0', change: '+0.0%', icon: 'shopping_bag', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Active Customers', value: '0', change: '+0.0%', icon: 'group', color: 'text-orange-400', bg: 'bg-orange-500/10' }
  ]);
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${API_URL}/api/admin/dashboard`);
        const data = await response.json();
        
        setStats([
          { label: 'Total Revenue', value: `₹${data.stats.revenue.toLocaleString('en-US', {minimumFractionDigits: 2})}`, change: '+12.5%', icon: 'attach_money', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { label: 'Total Orders', value: data.stats.orders.toString(), change: '+5.2%', icon: 'shopping_bag', color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'Active Customers', value: data.stats.customers.toString(), change: '+18.1%', icon: 'group', color: 'text-orange-400', bg: 'bg-orange-500/10' }
        ]);

        const mappedOrders = data.recentOrders.map(order => {
          let statusColor = 'text-orange-400 bg-orange-400/10 border-orange-400/20';
          if (order.status === 'Delivered') statusColor = 'text-green-400 bg-green-400/10 border-green-400/20';
          if (order.status === 'Shipped') statusColor = 'text-blue-400 bg-blue-400/10 border-blue-400/20';
          
          return {
            ...order,
            statusColor
          };
        });
        
        setRecentOrders(mappedOrders);
        
        const mappedProducts = data.topProducts.map(p => ({
          name: p.name,
          sales: p.sales,
          revenue: `₹${p.revenue.toLocaleString('en-US', {minimumFractionDigits: 0})}`,
          image: p.image
        }));
        
        setTopProducts(mappedProducts);

      } catch (err) {
        console.error("Failed to fetch admin dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="bg-black min-h-screen text-white flex overflow-hidden">
      
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 bg-white/5 border-r border-white/10 backdrop-blur-xl flex flex-col z-20 shrink-0"
      >
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-purple-500 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.5)]">
            <span className="material-symbols-outlined text-white text-sm font-bold">admin_panel_settings</span>
          </div>
          <h2 className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            NEO WYNEXA <span className="text-white text-sm font-medium tracking-normal ml-1">Admin</span>
          </h2>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2">
          {['Dashboard', 'Products', 'Orders', 'Customers', 'Analytics'].map((item) => (
            <button 
              key={item}
              onClick={() => setActiveTab(item)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === item ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.1)]' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {item === 'Dashboard' ? 'dashboard' : item === 'Products' ? 'inventory_2' : item === 'Orders' ? 'shopping_cart_checkout' : item === 'Customers' ? 'group' : 'monitoring'}
              </span>
              {item}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-400 hover:text-white hover:bg-white/5 w-full transition-all">
            <span className="material-symbols-outlined text-[20px]">storefront</span>
            Back to Store
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto relative bg-[#0a0a0a]">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="p-8 max-w-7xl mx-auto relative z-10">
          
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Welcome back, Admin</h1>
              <p className="text-gray-400 text-sm">Here's what's happening with your store today.</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span>
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 p-[2px]">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                    <img src="https://ui-avatars.com/api/?name=Admin+User&background=random" alt="Admin" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-white/20 transition-all"
              >
                <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl transition-all group-hover:scale-150 opacity-20 ${stat.bg.replace('/10', '')}`}></div>
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} border border-current/20`}>
                    <span className="material-symbols-outlined">{stat.icon}</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-400 text-sm font-semibold bg-green-400/10 px-2 py-1 rounded-lg border border-green-400/20">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span> {stat.change}
                  </div>
                </div>
                
                <h3 className="text-gray-400 text-sm font-medium mb-1 relative z-10">{stat.label}</h3>
                <div className="text-3xl font-bold text-white relative z-10">{stat.value}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Orders */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Recent Orders</h2>
                <button className="text-cyan-400 text-sm font-medium hover:text-cyan-300">View All</button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-sm">
                      <th className="pb-3 font-medium">Order ID</th>
                      <th className="pb-3 font-medium">Customer</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, idx) => (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 text-white font-medium">{order.id}</td>
                        <td className="py-4 text-gray-300">{order.customer}</td>
                        <td className="py-4 text-gray-400 text-sm">{order.date}</td>
                        <td className="py-4 text-white font-bold">{order.amount}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${order.statusColor}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Top Products */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">Top Products</h2>
              
              <div className="flex flex-col gap-5">
                {topProducts.map((product, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/10 overflow-hidden shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-screen" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm font-bold truncate">{product.name}</h4>
                      <p className="text-gray-400 text-xs mt-1">{product.sales} sales</p>
                    </div>
                    <div className="text-right">
                      <div className="text-cyan-400 text-sm font-bold">{product.revenue}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
