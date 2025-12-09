import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, ClipboardList, Coffee, LogOut, TrendingUp, CheckCircle, Clock, AlertCircle, Plus, Trash2 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useStore } from '../services/store';
import { OrderStatus, Category } from '../types';
import { Button, Input, Badge, Modal } from './ui';
import { CURRENCY } from '../constants';

const StatsCard: React.FC<{ title: string; value: string; icon: any; trend?: string }> = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-coffee-50 rounded-lg text-coffee-600">
        <Icon className="h-6 w-6" />
      </div>
      {trend && <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{trend}</span>}
    </div>
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
  </div>
);

export const AdminPanel: React.FC = () => {
  const { orders, menu, updateOrderStatus, addMenuItem, deleteMenuItem, logoutAdmin } = useStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'menu'>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Stats Calculation
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === OrderStatus.PENDING).length;

  const salesData = useMemo(() => {
    const data: Record<string, number> = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        data[item.category] = (data[item.category] || 0) + (item.price * item.quantity);
      });
    });
    return Object.entries(data).map(([name, sales]) => ({ name, sales }));
  }, [orders]);

  const COLORS = ['#a77f71', '#8a5a4d', '#6f453b', '#5c3a32', '#d2bab0'];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-coffee-900 text-coffee-100 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-coffee-800">
          <h1 className="text-2xl font-serif font-bold text-white">Lumina Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-coffee-800 text-white' : 'hover:bg-coffee-800/50'}`}
          >
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-coffee-800 text-white' : 'hover:bg-coffee-800/50'}`}
          >
            <ClipboardList className="h-5 w-5" /> Orders
            {pendingOrders > 0 && <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingOrders}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'menu' ? 'bg-coffee-800 text-white' : 'hover:bg-coffee-800/50'}`}
          >
            <Coffee className="h-5 w-5" /> Menu Management
          </button>
        </nav>
        <div className="p-4 border-t border-coffee-800">
          <button onClick={logoutAdmin} className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-red-900/50 text-red-200 transition-colors">
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-100 p-4 md:hidden flex justify-between items-center">
           <h1 className="font-serif font-bold text-coffee-900">Lumina Admin</h1>
           <button onClick={logoutAdmin}><LogOut className="h-5 w-5" /></button>
        </header>

        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="Total Revenue" value={`${CURRENCY}${totalRevenue.toFixed(2)}`} icon={TrendingUp} trend="+12.5%" />
                <StatsCard title="Total Orders" value={totalOrders.toString()} icon={ClipboardList} trend="+5.2%" />
                <StatsCard title="Pending Orders" value={pendingOrders.toString()} icon={Clock} />
                <StatsCard title="Menu Items" value={menu.length.toString()} icon={Coffee} />
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Sales by Category</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} tickFormatter={(value) => `$${value}`} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        cursor={{fill: '#f9fafb'}}
                      />
                      <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                        {salesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-2xl font-bold text-gray-900">Active Orders</h2>
              <div className="space-y-4">
                {orders.length === 0 ? <p className="text-gray-500">No orders yet.</p> : 
                  orders.sort((a,b) => b.timestamp - a.timestamp).map(order => (
                  <div key={order.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-6 lg:items-center">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900">Order #{order.id}</h3>
                        <span className="text-sm text-gray-500">{new Date(order.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Customer: <span className="font-medium">{order.customerName}</span> ({order.paymentMethod})</p>
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((item, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {item.quantity}x {item.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6">
                      <div className="text-right w-full sm:w-auto">
                         <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                            order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {order.status}
                          </span>
                          <p className="font-bold text-lg">{CURRENCY}{order.total.toFixed(2)}</p>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        {order.status !== OrderStatus.COMPLETED && order.status !== OrderStatus.CANCELLED && (
                          <Button 
                            onClick={() => {
                              const next = order.status === OrderStatus.PENDING ? OrderStatus.PREPARING : OrderStatus.READY;
                              if (order.status === OrderStatus.READY) updateOrderStatus(order.id, OrderStatus.COMPLETED);
                              else updateOrderStatus(order.id, next);
                            }}
                            className="flex-1 sm:w-32"
                          >
                            Advance
                          </Button>
                        )}
                        {order.status === OrderStatus.PENDING && (
                           <Button variant="danger" onClick={() => updateOrderStatus(order.id, OrderStatus.CANCELLED)}>Cancel</Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="space-y-6 animate-in fade-in duration-300">
               <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Menu Items</h2>
                <Button onClick={() => setIsAddModalOpen(true)}><Plus className="h-4 w-4 mr-2" /> Add Item</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {menu.map(item => (
                  <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4">
                    <img src={item.image} alt={item.name} className="h-24 w-24 rounded-lg object-cover" />
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-900">{item.name}</h3>
                        <button onClick={() => deleteMenuItem(item.id)} className="text-gray-400 hover:text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                      <div className="mt-auto flex justify-between items-end">
                        <span className="font-bold text-coffee-700">{CURRENCY}{item.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Add Item Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Menu Item">
        <AddItemForm onClose={() => setIsAddModalOpen(false)} onAdd={addMenuItem} />
      </Modal>
    </div>
  );
};

const AddItemForm: React.FC<{ onClose: () => void; onAdd: (i: any) => void }> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: Category.HOT_COFFEE, image: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      price: parseFloat(formData.price),
      image: formData.image || `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 1000)}`
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Input required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
           <label className="block text-sm font-medium mb-1">Price</label>
           <Input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
        </div>
        <div>
           <label className="block text-sm font-medium mb-1">Category</label>
           <select 
             className="w-full rounded-md border border-coffee-200 px-3 py-2 text-sm focus:border-coffee-500 focus:outline-none focus:ring-1 focus:ring-coffee-500"
             value={formData.category}
             onChange={e => setFormData({...formData, category: e.target.value as Category})}
           >
             {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
           </select>
        </div>
      </div>
      <div className="pt-4 flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
        <Button type="submit">Add Item</Button>
      </div>
    </form>
  );
};