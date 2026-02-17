
import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';

interface AdminDashboardProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, onUpdateStatus, onClose }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-700';
      case 'Processing': return 'bg-blue-100 text-blue-700';
      case 'Shipped': return 'bg-purple-100 text-purple-700';
      case 'Delivered': return 'bg-green-100 text-green-700';
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-slate-50 flex flex-col font-sans">
      <header className="bg-slate-900 text-white px-8 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <i className="fas fa-chart-line text-xs"></i>
          </div>
          <h2 className="font-black tracking-tighter text-xl uppercase italic">EcoThread Admin</h2>
        </div>
        <button onClick={onClose} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
          Exit Dashboard
        </button>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Order List */}
        <div className="w-full lg:w-1/3 border-r border-slate-200 bg-white overflow-y-auto custom-scrollbar">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Incoming Requests</h3>
            <p className="text-slate-900 font-bold text-xl">{orders.length} Total Orders</p>
          </div>
          
          {orders.length === 0 ? (
            <div className="p-12 text-center">
              <i className="fas fa-inbox text-4xl text-slate-200 mb-4"></i>
              <p className="text-slate-400 text-sm font-medium">No orders found.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(order => (
                <div 
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-6 cursor-pointer transition-all hover:bg-slate-50 ${selectedOrder?.id === order.id ? 'bg-slate-100 border-l-4 border-slate-900' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-black text-slate-900 text-sm tracking-tight">#{order.id.slice(0, 8)}</span>
                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mb-1 font-medium">{order.shippingAddress.fullName}</p>
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                    <span className="text-slate-900">${order.total}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details Panel */}
        <div className="hidden lg:flex flex-1 bg-slate-50 overflow-y-auto custom-scrollbar flex-col">
          {selectedOrder ? (
            <div className="p-12 max-w-4xl mx-auto w-full space-y-12">
              <div className="flex justify-between items-end">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Order Detail</h4>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Order #{selectedOrder.id.slice(0, 12)}</h3>
                </div>
                <div className="flex gap-2">
                  {(['Processing', 'Shipped', 'Delivered'] as OrderStatus[]).map(status => (
                    <button
                      key={status}
                      onClick={() => onUpdateStatus(selectedOrder.id, status)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        selectedOrder.status === status ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-400'
                      }`}
                    >
                      Mark as {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Customer & Shipping</h5>
                    <p className="font-black text-slate-900">{selectedOrder.shippingAddress.fullName}</p>
                    <p className="text-slate-500 text-sm mb-4">{selectedOrder.shippingAddress.email}</p>
                    <div className="text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed italic">
                      {selectedOrder.shippingAddress.address}
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Items Summary</h5>
                    <div className="space-y-4">
                      {selectedOrder.items.map(item => (
                        <div key={item.id} className="flex gap-4">
                          <img src={item.originalImageUrl} className="w-12 h-16 object-cover rounded-lg" alt="" />
                          <div>
                            <p className="font-black text-slate-900 text-xs uppercase tracking-tight">{item.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Size {item.size} • ${item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden group">
                  <h5 className="text-[10px] font-black text-green-400 uppercase tracking-[0.3em] mb-4 relative z-10">AI Clone Reference</h5>
                  <div className="aspect-[4/5] bg-slate-800 rounded-2xl overflow-hidden relative z-10 shadow-2xl">
                    <img 
                      src={selectedOrder.userClone.front || ''} 
                      className="w-full h-full object-contain" 
                      alt="AI Preview Reference" 
                    />
                  </div>
                  <div className="mt-6 space-y-2 relative z-10">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Analysis Data:</p>
                    <p className="text-xs italic text-slate-300">"{selectedOrder.userClone.analysis}"</p>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[80px] rounded-full"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 gap-6">
              <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center shadow-inner">
                <i className="fas fa-mouse-pointer text-4xl opacity-10"></i>
              </div>
              <p className="font-black text-[10px] uppercase tracking-[0.4em]">Select an order to inspect details</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
