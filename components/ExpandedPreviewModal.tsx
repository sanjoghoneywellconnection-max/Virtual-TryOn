
import React, { useState, useEffect } from 'react';
import { Product, UserClone } from '../types';
import { generateTryOnImage } from '../services/geminiService';

interface ExpandedPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  userClone: UserClone;
}

type Angle = 'front' | 'back' | 'threeQuarter';

const ExpandedPreviewModal: React.FC<ExpandedPreviewModalProps> = ({ isOpen, onClose, product, userClone }) => {
  const [activeAngle, setActiveAngle] = useState<Angle>('front');
  const [generatedImages, setGeneratedImages] = useState<Record<Angle, string | null>>({
    front: null,
    back: null,
    threeQuarter: null
  });
  const [loadingAngles, setLoadingAngles] = useState<Record<Angle, boolean>>({
    front: false,
    back: false,
    threeQuarter: false
  });

  useEffect(() => {
    if (isOpen && !generatedImages[activeAngle] && !loadingAngles[activeAngle]) {
      handleGenerateAngle(activeAngle);
    }
  }, [isOpen, activeAngle]);

  const handleGenerateAngle = async (angle: Angle) => {
    if (!userClone[angle] || generatedImages[angle] || loadingAngles[angle]) return;

    setLoadingAngles(prev => ({ ...prev, [angle]: true }));
    try {
      const result = await generateTryOnImage(userClone, product, angle);
      setGeneratedImages(prev => ({ ...prev, [angle]: result }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAngles(prev => ({ ...prev, [angle]: false }));
    }
  };

  if (!isOpen) return null;

  const availableAngles = (['front', 'back', 'threeQuarter'] as Angle[]).filter(a => !!userClone[a]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-stone-950 p-4 md:p-12">
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 z-[210] w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white transition-all"
      >
        <i className="fas fa-times text-xl"></i>
      </button>

      <div className="w-full h-full max-w-7xl flex flex-col md:flex-row gap-8 items-stretch">
        {/* Main Display */}
        <div className="flex-1 bg-stone-900 rounded-[3rem] overflow-hidden relative flex items-center justify-center border border-white/5">
          {loadingAngles[activeAngle] ? (
            <div className="flex flex-col items-center gap-6">
              <div className="w-16 h-16 border-4 border-white/20 border-t-green-500 rounded-full animate-spin"></div>
              <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.4em]">Rendering {activeAngle} Perspective...</p>
            </div>
          ) : (
            <img 
              src={generatedImages[activeAngle] || userClone[activeAngle]!} 
              className="w-full h-full object-contain"
              alt="AI Clone Preview"
            />
          )}

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 bg-black/40 backdrop-blur-xl p-2 rounded-[2rem] border border-white/10">
            {availableAngles.map(angle => (
              <button
                key={angle}
                onClick={() => setActiveAngle(angle)}
                className={`px-6 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeAngle === angle ? 'bg-white text-stone-900 shadow-xl' : 'text-white/40 hover:text-white'
                }`}
              >
                {angle === 'threeQuarter' ? '3/4 Angle' : angle}
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar info */}
        <div className="w-full md:w-80 space-y-8 flex flex-col justify-center">
          <div>
            <h2 className="text-white text-3xl font-black tracking-tighter mb-2">360° VIRTUAL FIT</h2>
            <p className="text-white/40 text-sm">Full immersion mode. Every detail of the {product.name} mapped to your frame.</p>
          </div>

          <div className="space-y-4">
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-green-500 mb-2">AI Diagnosis</p>
              <p className="text-white/80 text-xs leading-relaxed italic">"{userClone.analysis}"</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-[9px] font-black text-white/30 uppercase mb-1">Size</p>
                <p className="text-white font-bold">{product.size}</p>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-[9px] font-black text-white/30 uppercase mb-1">Condition</p>
                <p className="text-white font-bold">{product.condition}</p>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-5 bg-green-600 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-green-500 transition-all active:scale-95"
          >
            Back to Item Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpandedPreviewModal;
