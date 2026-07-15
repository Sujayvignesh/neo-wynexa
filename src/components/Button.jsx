import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  icon, 
  className = '', 
  fullWidth = false,
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 border border-transparent font-sans font-medium cursor-pointer no-underline transition-all duration-300 outline-none focus:ring-2 focus:ring-offset-2";
  const widthClass = fullWidth ? "w-full" : "w-auto";

  const variants = {
    primary: "bg-primary-900 text-white shadow-soft hover:bg-gray-800 hover:shadow-soft-md hover:-translate-y-0.5 focus:ring-primary-900 rounded-full",
    gradient: "bg-gradient-to-r from-accent-blue to-accent-violet text-white shadow-soft hover:shadow-soft-md hover:-translate-y-0.5 focus:ring-accent-blue rounded-full",
    secondary: "bg-white/10 text-white border border-white/10 shadow-soft hover:bg-white/20 hover:border-white/20 hover:-translate-y-0.5 focus:ring-white/30 rounded-full",
    outline: "bg-transparent text-white border border-white/20 hover:bg-white/10 focus:ring-white/30 rounded-full",
    text: "bg-transparent text-gray-300 hover:bg-white/10 hover:text-white rounded-xl"
  };

  const sizes = {
    small: "py-2 px-4 text-xs",
    medium: "py-3 px-6 text-sm",
    large: "py-4 px-8 text-base"
  };

  const combinedClasses = `${baseClasses} ${widthClass} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <motion.button 
      className={combinedClasses}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {icon && <span className="material-symbols-outlined text-[20px]">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button;
