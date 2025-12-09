import React, { useState } from 'react';
import { ShoppingBag, Search, Plus, Minus, Trash2, CreditCard, Banknote, Smartphone, CheckCircle, Lock } from 'lucide-react';
import { useStore } from '../services/store';
import { Category, MenuItem } from '../types';
import { Button, Input, Modal, Badge } from './ui';
import { CURRENCY } from '../constants';

const MenuCard: React.FC<{ item: MenuItem; onAdd: () => void }> = ({ item, onAdd }) => (
  <div className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
    <div className="relative h-48 overflow-hidden">
      <img 
        src={item.image} 
        alt={item.name} 
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute top-2 right-2">
        <Badge color="bg-white/90 backdrop-blur text-coffee-700 shadow-sm font-bold">
          {CURRENCY}{item.price.toFixed(2)}
        </Badge>
      </div>
    </div>
    <div className="p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-gray-900">{item.name}</h3>
          <p className="text-xs text-gray-500 uppercase tracking-wide">{item.category}</p>
        </div>
      </div>
      <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">{item.description}</p>
      <Button onClick={onAdd} className="w-full flex items-center justify-center gap-2">
        <Plus className="h-4 w-4" /> Add to Order
      </Button>
    </div>
  </div>
);

const PaymentForm: React.FC<{ 
  total: number; 
  onComplete: (name: string, method: any) => Promise<void>;
  onCancel: () => void; 
}> = ({ total, onComplete, onCancel }) => {
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [name, setName] = useState('');
  const [method, setMethod] = useState<'Credit Card' | 'Apple Pay' | 'Cash'>('Credit Card');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    // Simulate gateway delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    await onComplete(name, method);
    setStep('success');
  };

  if (step === 'success') {
    return (
      <div className="text-center py-8">
        <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Order Confirmed!</h3>
        <p className="text-gray-500 mb-6">Your order has been sent to the kitchen.</p>
        <Button onClick={onCancel} className="w-full">Back to Menu</Button>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-12 w-12 border-4 border-coffee-200 border-t-coffee-600 rounded-full mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-900">Processing Payment...</p>
        <p className="text-sm text-gray-500">Please do not close this window.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-coffee-50 rounded-lg mb-4">
        <p className="text-sm text-coffee-700 mb-1">Total Amount</p>
        <p className="text-2xl font-bold text-coffee-900">{CURRENCY}{total.toFixed(2)}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name on Order</label>
        <Input required value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'Credit Card', icon: CreditCard, label: 'Card' },
            { id: 'Apple Pay', icon: Smartphone, label: 'Apple Pay' },
            { id: 'Cash', icon: Banknote, label: 'Cash' }
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id as any)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm font-medium transition-all ${
                method === m.id 
                  ? 'border-coffee-600 bg-coffee-50 text-coffee-700' 
                  : 'border-gray-200 hover:border-coffee-200 text-gray-600'
              }`}
            >
              <m.icon className="h-5 w-5 mb-1" />
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {method === 'Credit Card' && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
          <Input placeholder="Card Number" maxLength={19} required />
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="MM/YY" maxLength={5} required />
            <Input placeholder="CVC" maxLength={3} required />
          </div>
        </div>
      )}

      <div className="pt-4">
        <Button type="submit" className="w-full">
          Pay {CURRENCY}{total.toFixed(2)}
        </Button>
      </div>
    </form>
  );
};

export const CustomerView: React.FC = () => {
  const { menu, addToCart, cart, removeFromCart, updateCartQuantity, placeOrder } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [search, setSearch] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const filteredMenu = menu.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Header */}
      <div className="bg-coffee-900 text-coffee-50 py-12 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4">Lumina Cafe</h1>
          <p className="text-lg text-coffee-200 max-w-2xl mx-auto">Artisan coffee, freshly baked pastries, and a cozy atmosphere. Order now for pickup.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur shadow-sm border-b border-gray-100 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === 'All' ? 'bg-coffee-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              All
            </button>
            {Object.values(Category).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-coffee-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Search menu..." 
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMenu.map(item => (
            <MenuCard key={item.id} item={item} onAdd={() => addToCart(item)} />
          ))}
        </div>
        {filteredMenu.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p>No items found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Cart Drawer Button (Mobile Sticky / Desktop Fixed) */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 left-6 z-40 bg-white text-coffee-900 shadow-lg border border-coffee-100 rounded-full px-6 py-3 font-medium flex items-center gap-3 hover:bg-coffee-50 transition-transform hover:scale-105"
      >
        <div className="relative">
          <ShoppingBag className="h-6 w-6" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </div>
        <span className="font-bold">{CURRENCY}{cartTotal.toFixed(2)}</span>
      </button>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-coffee-50">
              <h2 className="text-lg font-bold text-coffee-900 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" /> Your Order
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-coffee-100 rounded-full">
                <span className="sr-only">Close</span>
                &times;
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                  <ShoppingBag className="h-16 w-16 opacity-20" />
                  <p>Your cart is empty</p>
                  <Button onClick={() => setIsCartOpen(false)} variant="secondary">Browse Menu</Button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <span className="text-sm font-bold">{CURRENCY}{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{CURRENCY}{item.price.toFixed(2)} each</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
                          <button onClick={() => updateCartQuantity(item.id, -1)} className="p-1 hover:bg-white rounded shadow-sm">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item.id, 1)} className="p-1 hover:bg-white rounded shadow-sm">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 ml-auto p-1">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between mb-4 text-lg font-bold text-coffee-900">
                  <span>Total</span>
                  <span>{CURRENCY}{cartTotal.toFixed(2)}</span>
                </div>
                <Button 
                  onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} 
                  className="w-full py-3 text-lg"
                >
                  Checkout
                </Button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Payment Modal */}
      <Modal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} title="Secure Checkout">
        <PaymentForm 
          total={cartTotal} 
          onComplete={placeOrder} 
          onCancel={() => setIsCheckoutOpen(false)}
        />
      </Modal>

      {/* Footer with Admin Link */}
      <div className="py-12 text-center">
        <a href="#/login" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-coffee-600 transition-colors">
          <Lock className="h-3 w-3" />
          Staff Login
        </a>
      </div>
    </div>
  );
};