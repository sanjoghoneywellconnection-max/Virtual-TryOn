
import React from 'react';
import { Product, UserClone } from '../types';

interface ProductCardProps {
  product: Product;
  userClone: UserClone | null;
  onSelect: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, userClone, onSelect, onAddToCart }) => {
  return (
    <div 
      onClick={() => onSelect(product)}
      className="group bg-white rounded-3xl overflow-hidden border border-stone-100 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500 cursor-pointer"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
        <img 
          src={product.originalImageUrl} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.1] group-hover:grayscale-0"
        />
        
        <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/5 transition-colors duration-500"></div>
        
        {/* Visual Indicator for AI readiness */}
        {userClone?.front && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all delay-75">
            <i className="fas fa-magic text-stone-900"></i>
          </div>
        )}

        <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <div className="bg-white/90 backdrop-blur-md py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-stone-900 text-center shadow-2xl">
            Preview & Try-On
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{product.category}</p>
            <h3 className="font-bold text-stone-900 text-lg group-hover:text-green-600 transition-colors tracking-tight">{product.name}</h3>
          </div>
          <span className="font-black text-stone-900 text-lg">${product.price}</span>
        </div>
        
        <div className="flex items-center gap-2 mb-6">
          <span className="text-[9px] font-bold uppercase bg-stone-50 border border-stone-100 px-3 py-1 rounded-full text-stone-500">
            Size {product.size}
          </span>
          <span className="text-[9px] font-bold uppercase bg-stone-50 border border-stone-100 px-3 py-1 rounded-full text-stone-500">
            {product.condition}
          </span>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            className="flex-1 py-4 bg-stone-100 text-stone-900 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-stone-900 hover:text-white active:scale-95 flex items-center justify-center gap-2"
          >
            Add to bag
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
