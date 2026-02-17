
import React, { useState } from 'react';
import { Product, UserClone } from '../types';
import { generateTryOnImage } from '../services/geminiService';
import ExpandedPreviewModal from './ExpandedPreviewModal';

interface ProductPreviewModalProps {
  product: Product;
  userClone: UserClone | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
}

const ProductPreviewModal: React.FC<ProductPreviewModalProps> = ({ product, userClone, isOpen, onClose, onAddToCart }) => {
  const [displayImage, setDisplayImage] = useState(product.originalImageUrl);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasTriedOn, setHasTriedOn] = useState(false);
  const [isExpandedOpen, setIsExpandedOpen] = useState(false);

  if (!isOpen) return null;

  const handleTryOn = async () => {
    if (!userClone?.front || isGenerating) return;

    setIsGenerating(true);
    try {
      const aiImage = await generateTryOnImage(userClone, product);
      setDisplayImage(aiImage);
      setHasTriedOn(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setDisplayImage(product.originalImageUrl);
    setHasTriedOn(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 py-8">
        <div className="absolute inset-0 bg-stone-950/90 backdrop-blur-xl" onClick={onClose}></div>
        
        <div className="relative w-full max-w-5xl bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
          <button onClick={onClose} className="absolute top-6 right-6 text-stone-400 hover:text-stone-900 z-10 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg transition-all">
            <i className="fas fa-times"></i>
          </button>

          {/* Image Section */}
          <div 
            onClick={() => hasTriedOn && !isGenerating && setIsExpandedOpen(true)}
            className={`relative w-full md:w-1/2 bg-stone-50 flex items-center justify-center overflow-hidden h-[50vh] md:h-auto border-b md:border-b-0 md:border-r border-stone-100 ${hasTriedOn ? 'cursor-zoom-in' : ''}`}
          >
            <img 
              src={displayImage} 
              alt={product.name}
              className={`w-full h-full object-contain transition-all duration-1000 ${isGenerating ? 'opacity-20 scale-105 blur-2xl' : 'opacity-100'}`}
            />
            
            {isGenerating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-20 h-20 border-4 border-stone-200 border-t-green-500 rounded-full animate-spin mb-4"></div>
                <p className="text-stone-900 font-black text-[10px] uppercase tracking-[0.3em] bg-white/90 px-4 py-2 rounded-full shadow-xl">Synthesizing Your Look...</p>
              </div>
            )}

            {hasTriedOn && !isGenerating && (
              <div className="absolute inset-x-0 bottom-6 flex justify-center">
                <div className="bg-stone-900/80 backdrop-blur px-4 py-2 rounded-full text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl border border-white/10 animate-bounce">
                  <i className="fas fa-expand-alt"></i> Click to expand full view
                </div>
              </div>
            )}

            {hasTriedOn && !isGenerating && (
              <div className="absolute top-6 left-6 bg-green-500 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-2xl">
                <i className="fas fa-sparkles mr-2"></i> AI Preview Active
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto custom-scrollbar flex flex-col">
            <div className="flex-1">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-50 px-3 py-1 rounded-full">{product.gender}'s {product.category}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">ID: {product.id}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tighter mb-4">{product.name}</h2>
                <div className="text-3xl font-black text-stone-900 mb-6">${product.price}</div>
                <p className="text-stone-500 leading-relaxed text-lg mb-8">{product.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Size</p>
                    <p className="font-bold text-stone-900">{product.size}</p>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Condition</p>
                    <p className="font-bold text-stone-900">{product.condition}</p>
                  </div>
                </div>
              </div>

              {/* AI Action Area */}
              <div className="bg-stone-50 rounded-[2rem] p-6 mb-8 border border-stone-100">
                {userClone?.front ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 rounded-2xl border-2 border-green-500 overflow-hidden shrink-0 shadow-sm">
                        <img src={userClone.front} className="w-full h-full object-cover" alt="Clone" />
                      </div>
                      <div>
                        <h4 className="font-black text-stone-900 text-xs uppercase tracking-widest">AI Studio Ready</h4>
                        <p className="text-[10px] text-stone-500">Your 3-angle profile is active.</p>
                      </div>
                    </div>
                    
                    {!hasTriedOn ? (
                      <button 
                        onClick={handleTryOn}
                        disabled={isGenerating}
                        className="w-full py-5 bg-stone-900 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl hover:bg-green-600 transition-all flex items-center justify-center gap-3 active:scale-95"
                      >
                        <i className="fas fa-magic"></i>
                        See It On You
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button 
                          onClick={handleReset}
                          className="flex-1 py-5 bg-white text-stone-900 border border-stone-200 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-sm hover:bg-stone-100 transition-all flex items-center justify-center gap-3"
                        >
                          <i className="fas fa-undo"></i>
                          Reset
                        </button>
                        <button 
                          onClick={() => setIsExpandedOpen(true)}
                          className="flex-1 py-5 bg-green-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-xl hover:bg-green-700 transition-all flex items-center justify-center gap-3"
                        >
                          <i className="fas fa-360-degrees text-sm"></i>
                          360° View
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-xs text-stone-500 mb-4">You haven't created an AI clone yet. Set one up to preview this item on your frame.</p>
                    <button className="text-[11px] font-black uppercase tracking-widest text-green-600 underline">Initialize Clone Wizard</button>
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={() => { onAddToCart(product); onClose(); }}
              className="w-full py-6 bg-stone-900 text-white rounded-[2rem] font-black uppercase text-[11px] tracking-[0.3em] shadow-2xl hover:bg-stone-800 transition-all active:scale-95"
            >
              Add to Bag — ${product.price}
            </button>
          </div>
        </div>
      </div>

      {userClone && (
        <ExpandedPreviewModal 
          isOpen={isExpandedOpen}
          onClose={() => setIsExpandedOpen(false)}
          product={product}
          userClone={userClone}
        />
      )}
    </>
  );
};

export default ProductPreviewModal;
