import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', className = '', isLoading, disabled, ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-coffee-600 text-white hover:bg-coffee-700 focus:ring-coffee-500",
    secondary: "bg-coffee-100 text-coffee-900 hover:bg-coffee-200 focus:ring-coffee-300",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost: "bg-transparent text-coffee-700 hover:bg-coffee-50"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => (
  <input 
    className={`w-full rounded-md border border-coffee-200 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-coffee-500 focus:outline-none focus:ring-1 focus:ring-coffee-500 ${className}`}
    {...props}
  />
);

export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-coffee-50">
          <h3 className="text-lg font-bold text-coffee-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = 'bg-gray-100 text-gray-800' }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
    {children}
  </span>
);