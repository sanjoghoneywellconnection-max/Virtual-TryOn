
import React, { useState, useEffect } from 'react';
import { Product, CartItem, UserClone } from './types';
import { PRODUCTS } from './constants';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import CloneWizard from './components/CloneWizard';
import ProductPreviewModal from './components/ProductPreviewModal';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userClone, setUserClone] = useState<UserClone | null>(null);
  const [isCloneWizardOpen, setIsCloneWizardOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeGender, setActiveGender] = useState<'Men' | 'Women'>('Men');
  const [category, setCategory] = useState<string>('All');

  useEffect(() => {
    const savedClone = localStorage.getItem('eco_thread_clone_v2');
    if (savedClone) {
      const parsed = JSON.parse(savedClone);
      setUserClone(parsed);
      setActiveGender(parsed.gender);
    }
  }, []);

  const handleCloneCreated = (clone: UserClone) => {
    setUserClone(clone);
    setActiveGender(clone.gender);
    localStorage.setItem('eco_thread_clone_v2', JSON.stringify(clone));
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const filteredProducts = PRODUCTS.filter(p => {
    const matchesGender = p.gender === activeGender;
    const matchesCategory = category === 'All' || p.category === category;
    return matchesGender && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
        onOpenCart={() => setIsCartOpen(true)}
        onOpenClone={() => setIsCloneWizardOpen(true)}
        isCloneActive={!!userClone?.front}
        activeGender={activeGender}
        onGenderChange={setActiveGender}
      />

      {/* Hero Section */}
      <section className="bg-[#faf9f6] pt-20 pb-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 bg-white px-5 py-2 rounded-2xl shadow-sm border border-stone-100">
              <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-900">Virtual Fitting Live</span>
            </div>
            
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-stone-900 leading-[0.9]">
              THRIFT <br /> 
              <span className="text-green-600 underline decoration-green-200 decoration-[12px] underline-offset-8">DIFFERENT.</span>
            </h2>
            
            <p className="text-stone-500 text-lg max-w-lg leading-relaxed font-medium mx-auto lg:mx-0">
              Stop wondering if it fits. Create your 360° AI clone and see yourself in every piece before you commit to the find.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
              <button 
                onClick={() => setIsCloneWizardOpen(true)}
                className="px-10 py-5 bg-stone-900 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-green-600 transition-all hover:scale-105 active:scale-95"
              >
                {userClone?.front ? 'Update AI Clone' : 'Start My AI Clone'}
              </button>
              <div className="flex items-center justify-center lg:justify-start">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-stone-200 overflow-hidden shadow-sm">
                      <img src={`https://i.pravatar.cc/100?u=${i + 10}`} alt="user" />
                    </div>
                  ))}
                </div>
                <span className="pl-6 text-[9px] font-black text-stone-400 uppercase tracking-widest">Global Thrifters Active</span>
              </div>
            </div>
          </div>

          <div className="relative mt-12 lg:mt-0">
            <div className="aspect-[4/5] bg-stone-200 rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.15)] relative group">
              <img 
                src={userClone?.front || (activeGender === 'Men' ? 'https://images.unsplash.com/photo-1550246140-29f40b904e5a?q=80&w=800&auto=format&fit=crop' : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop')} 
                className="w-full h-full object-cover grayscale-[0.1] group-hover:grayscale-0 transition-all duration-700"
                alt="AI Model"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-10 right-10 text-white p-8 glass-morphism rounded-[2.5rem] border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-70">AI Session Active</p>
                </div>
                <h4 className="font-black text-2xl tracking-tight">{userClone ? 'Your AI Mirror' : `Browse ${activeGender} Fashion`}</h4>
              </div>
            </div>
            {/* Design accents */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-500/20 blur-[100px] rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-stone-900/10 blur-[120px] rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full py-24 px-6 md:px-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-20">
          <div className="flex gap-3 overflow-x-auto pb-6 lg:pb-0 no-scrollbar">
            {['All', 'Outerwear', 'Knitwear', 'Tops', 'Bottoms'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                  category === cat ? 'bg-stone-900 text-white shadow-2xl' : 'bg-stone-50 text-stone-400 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 flex items-center gap-4 bg-stone-50 px-6 py-4 rounded-2xl border border-stone-100">
            Filtering <span className="text-stone-900">{filteredProducts.length}</span> Pieces for <span className="text-green-600">{activeGender}</span>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-40 bg-stone-50 rounded-[4rem] border-2 border-dashed border-stone-200">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
              <i className="fas fa-search text-3xl text-stone-200"></i>
            </div>
            <h3 className="text-3xl font-black text-stone-900 tracking-tighter">No items found here.</h3>
            <p className="text-stone-400 mt-3 font-medium">Our inventory updates every Tuesday. Try another category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                userClone={userClone}
                onSelect={setSelectedProduct}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-24 px-6 md:px-12 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="col-span-1 md:col-span-2 space-y-10">
            <h4 className="text-4xl font-black tracking-tighter italic">ECOTHREAD.</h4>
            <p className="text-stone-400 text-xl leading-relaxed max-w-lg">
              Reinventing the thrift experience with <span className="text-white font-bold underline decoration-green-500 decoration-4">proprietary AI.</span> We believe fashion should be circular and personal.
            </p>
            <div className="flex gap-6">
              {['facebook-f', 'instagram', 'twitter', 'tiktok'].map(s => (
                <div key={s} className="w-14 h-14 bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl flex items-center justify-center cursor-pointer transition-all hover:-translate-y-1">
                  <i className={`fab fa-${s} text-xl`}></i>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h5 className="font-black text-[10px] uppercase tracking-[0.3em] text-stone-500 mb-10">Studio</h5>
            <ul className="space-y-6 font-black text-sm uppercase tracking-widest">
              <li className="hover:text-green-400 cursor-pointer transition-colors">AI Diagnostics</li>
              <li className="hover:text-green-400 cursor-pointer transition-colors">Men's Drop</li>
              <li className="hover:text-green-400 cursor-pointer transition-colors">Women's Drop</li>
              <li className="hover:text-green-400 cursor-pointer transition-colors">Sustainable Lab</li>
            </ul>
          </div>
          <div>
            <h5 className="font-black text-[10px] uppercase tracking-[0.3em] text-stone-500 mb-10">Eco System</h5>
            <p className="text-stone-500 text-sm leading-relaxed italic font-medium">
              "By using AI clones, we've reduced shipping-related carbon emissions by 40% through minimized returns."
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CloneWizard 
        isOpen={isCloneWizardOpen} 
        onClose={() => setIsCloneWizardOpen(false)} 
        onCloneCreated={handleCloneCreated}
      />

      {selectedProduct && (
        <ProductPreviewModal 
          isOpen={!!selectedProduct}
          product={selectedProduct}
          userClone={userClone}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[120] flex justify-end">
          <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-md" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-left p-10">
            <div className="flex items-center justify-between mb-16">
              <h3 className="text-3xl font-black tracking-tighter uppercase">Cart ({cart.length})</h3>
              <button onClick={() => setIsCartOpen(false)} className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center hover:bg-stone-100 transition-colors shadow-sm">
                <i className="fas fa-times text-stone-900"></i>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-stone-200 gap-6">
                  <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center shadow-inner">
                    <i className="fas fa-shopping-basket text-4xl"></i>
                  </div>
                  <p className="font-black text-[11px] uppercase tracking-[0.3em]">Your bag is empty</p>
                </div>
              ) : (
                <div className="space-y-12">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-8 group">
                      <div className="w-28 h-36 bg-stone-100 rounded-[2rem] overflow-hidden shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500">
                        <img src={item.originalImageUrl} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="flex-1 min-w-0 py-2 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-black text-stone-900 text-sm leading-tight uppercase tracking-tight line-clamp-2">{item.name}</h4>
                            <button onClick={() => removeFromCart(item.id)} className="text-stone-300 hover:text-red-500 transition-colors p-1"><i className="fas fa-trash-alt text-xs"></i></button>
                          </div>
                          <p className="text-stone-400 text-[9px] font-black uppercase tracking-widest">Size {item.size} • Qty {item.quantity}</p>
                        </div>
                        <span className="font-black text-stone-900 text-xl tracking-tighter">${item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-16 space-y-8 border-t border-stone-100 pt-10">
              <div className="flex justify-between items-end">
                <span className="text-stone-400 font-black uppercase text-[11px] tracking-[0.3em]">Total</span>
                <span className="text-5xl font-black text-stone-900 tracking-tighter">${cartTotal}</span>
              </div>
              <button 
                disabled={cart.length === 0}
                className="w-full py-7 bg-stone-900 text-white rounded-[2.5rem] font-black uppercase text-[11px] tracking-[0.4em] hover:bg-green-600 disabled:bg-stone-50 disabled:text-stone-200 transition-all shadow-2xl active:scale-95"
              >
                Checkout Securely
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-left {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-left {
          animation: slide-left 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default App;
