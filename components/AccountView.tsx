
import React from 'react';
import { User, Order, OrderStatus } from '../types';

interface AccountViewProps {
  user: User;
  orders: Order[];
  onLogout: () => void;
  onClose: () => void;
  // Added isOpen to match the prop being passed in App.tsx
  isOpen: boolean;
}

const AccountView: React.FC<AccountViewProps> = ({ user, orders, onLogout, onClose, isOpen }) => {
  // Added check for isOpen prop to control visibility
  if (!isOpen) return null;

  const userOrders = orders.filter(o => o.userId === user.id);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'Pending': return 'fa-clock text-amber-500';
      case 'Processing': return 'fa-cog fa-spin text-blue-500';
      case 'Shipped': return 'fa-truck text-purple-500';
      case 'Delivered': return 'fa-check-circle text-green-500';
    }
  };

  return (
    <div className="fixed inset-0 z-[140] flex justify-end">
      <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-[#faf9f6] h-full shadow-2xl flex flex-col p-8 md:p-12 animate-slide-left overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-stone-900 rounded-2xl flex items-center justify-center text-white text-2xl font-black">
              {user.fullName.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tighter uppercase">{user.fullName}</h2>
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={onLogout} className="p-4 bg-white border border-stone-200 rounded-2xl text-stone-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm">
              <i className="fas fa-sign-out-alt"></i>
            </button>
            <button onClick={onClose} className="p-4 bg-stone-900 rounded-2xl text-white shadow-xl">
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] mb-6">Order History</h3>
            
            {userOrders.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-[2.5rem] border border-stone-100">
                <i className="fas fa-box-open text-4xl text-stone-100 mb-4"></i>
                <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-6">
                {userOrders.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(order => (
                  <div key={order.id} className="bg-white rounded-[2rem] p-6 border border-stone-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-[10px] font-black text-stone-300 uppercase mb-1">Order ID</p>
                        <p className="font-black text-stone-900 uppercase">#{order.id.slice(0, 8)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-stone-300 uppercase mb-1">Status</p>
                        <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-stone-900">
                          <i className={`fas ${getStatusIcon(order.status)}`}></i>
                          {order.status}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar mb-6">
                      {order.items.map(item => (
                        <div key={item.id} className="w-16 h-20 bg-stone-50 rounded-xl overflow-hidden shrink-0 border border-stone-100">
                          <img src={item.originalImageUrl} className="w-full h-full object-cover" alt="" />
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-stone-50">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-stone-300 uppercase">Date</span>
                        <span className="text-xs font-bold text-stone-600">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      {order.trackingNumber && (
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-stone-300 uppercase">Tracking</span>
                          <span className="text-xs font-black text-green-600">{order.trackingNumber}</span>
                        </div>
                      )}
                      <div className="text-right">
                        <span className="text-[9px] font-black text-stone-300 uppercase">Total</span>
                        <p className="text-lg font-black text-stone-900">${order.total}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountView;
