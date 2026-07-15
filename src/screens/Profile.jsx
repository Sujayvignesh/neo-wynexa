import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-8">
        <h2 className="text-3xl font-bold mb-4 text-white">Not Logged In</h2>
        <p className="text-gray-400 mb-8">Please sign in to view your profile.</p>
        <Button variant="primary" onClick={() => navigate('/login')}>Sign In</Button>
      </div>
    );
  }

  const navItemClass = (isActive = false) => 
    `py-3 px-4 flex items-center justify-between cursor-pointer text-sm font-medium rounded-xl transition-all duration-200 mb-1 ${
      isActive 
        ? 'bg-cyan-500/20 text-cyan-400 shadow-sm border border-cyan-500/30' 
        : 'bg-transparent text-gray-400 hover:bg-white/10 hover:text-white'
    }`;

  const topCardClass = "bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-lg flex flex-col gap-2 relative overflow-hidden group hover:border-white/20 transition-all";
  const sectionHeaderClass = "text-sm font-bold tracking-wider uppercase mb-6 flex items-center gap-2 text-white";
  const detailClass = "flex items-start gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-white/10 transition-colors";
  const orderItemClass = "flex flex-col md:flex-row justify-between items-start md:items-center p-6 border border-white/10 rounded-3xl shadow-lg bg-white/5 backdrop-blur-xl hover:border-white/20 transition-all gap-6";

  return (
    <div className="bg-transparent min-h-screen pb-24 pt-10">
      
      {/* Title Header */}
      <div className="mb-10">
        <div className="max-w-[1440px] mx-auto px-8 flex items-end justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-white">
              Account Overview
            </h1>
            <p className="text-gray-400 font-medium">
              Manage your orders, credentials, and settings.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-bold text-white">{user.name}</div>
              <div className="text-xs font-semibold text-accent-gold bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-full inline-block mt-1">
                Verified Member
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-cyan-500 text-white flex items-center justify-center text-lg font-bold shadow-lg uppercase border border-cyan-400/50">
              {user.name.charAt(0)}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Sidebar */}
        <aside className="w-full lg:w-[280px] shrink-0 sticky top-28">
          <div className="bg-white/5 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-lg">
            <div className={navItemClass(true)}>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">dashboard</span>
                Dashboard
              </div>
            </div>
            <div className={navItemClass(false)}>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                Order History
              </div>
              <span className="bg-cyan-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold shadow-sm">0</span>
            </div>
            <div className={navItemClass(false)}>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">favorite</span>
                Wishlist
              </div>
            </div>
            <div className={navItemClass(false)}>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">settings</span>
                Account Settings
              </div>
            </div>

            <div className="border-t border-white/10 my-4"></div>
            
            <button 
              onClick={handleLogout} 
              className="w-full py-3 px-4 bg-accent-red/10 text-accent-red border border-accent-red/20 rounded-xl text-sm font-bold tracking-wide cursor-pointer flex items-center justify-center gap-2 hover:bg-accent-red hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-8 w-full">
          
          {/* Top Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={topCardClass}>
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Account Tier</div>
              <div className="text-2xl font-black text-cyan-400">Standard</div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-4xl text-cyan-400">workspace_premium</span>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={topCardClass}>
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Member Since</div>
              <div className="text-2xl font-black text-white">{new Date().getFullYear()}</div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-4xl text-gray-300">calendar_month</span>
              </div>
            </motion.div>
          </div>

          {/* Personal Credentials */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-lg">
            <h3 className={sectionHeaderClass}>
              <span className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">badge</span>
              </span>
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={detailClass}>
                <span className="material-symbols-outlined text-gray-400 mt-0.5">person</span>
                <div>
                  <div className="text-xs text-gray-500 font-bold tracking-wider uppercase mb-1">Full Name</div>
                  <div className="text-sm font-semibold text-white">{user.name}</div>
                </div>
              </div>
              <div className={detailClass}>
                <span className="material-symbols-outlined text-gray-400 mt-0.5">mail</span>
                <div>
                  <div className="text-xs text-gray-500 font-bold tracking-wider uppercase mb-1">Email Address</div>
                  <div className="text-sm font-semibold text-white">{user.email}</div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
