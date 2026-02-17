
import React, { useState, useRef } from 'react';
import { UserClone } from '../types';
import { analyzeCloneImages } from '../services/geminiService';

interface CloneWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onCloneCreated: (clone: UserClone) => void;
}

type Angle = 'front' | 'back' | 'threeQuarter';

const CloneWizard: React.FC<CloneWizardProps> = ({ isOpen, onClose, onCloneCreated }) => {
  const [step, setStep] = useState<'gender' | 'upload' | 'preview'>('gender');
  const [gender, setGender] = useState<'Men' | 'Women'>('Men');
  const [images, setImages] = useState<Record<Angle, string | null>>({
    front: null,
    back: null,
    threeQuarter: null
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeAngle, setActiveAngle] = useState<Angle>('front');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => ({ ...prev, [activeAngle]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinish = async () => {
    if (!images.front) return;
    setIsProcessing(true);
    try {
      const clone: UserClone = { ...images, gender };
      const analysis = await analyzeCloneImages(clone);
      onCloneCreated({ ...clone, analysis });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const angles: { id: Angle; label: string; icon: string; desc: string }[] = [
    { id: 'front', label: 'Front View', icon: 'fa-user', desc: 'Face the camera directly' },
    { id: 'back', label: 'Back View', icon: 'fa-user-ninja', desc: 'Turn your back to camera' },
    { id: 'threeQuarter', label: '3/4 Angle', icon: 'fa-user-tie', desc: 'Turn 45 degrees' }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl transition-all">
        <button onClick={onClose} className="absolute top-8 right-8 text-stone-300 hover:text-stone-900 z-10">
          <i className="fas fa-times text-xl"></i>
        </button>

        {step === 'gender' && (
          <div className="p-12 text-center">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-stone-900 tracking-tighter mb-2">WHO ARE YOU?</h2>
              <p className="text-stone-500">Choose your preference to help our AI generate the perfect fit.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-12">
              <button 
                onClick={() => { setGender('Men'); setStep('upload'); }}
                className="group p-10 bg-stone-50 border-2 border-transparent hover:border-stone-900 rounded-[2rem] transition-all flex flex-col items-center gap-4"
              >
                <div className="w-20 h-20 bg-stone-200 rounded-full flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">🕺</div>
                <span className="font-black uppercase tracking-widest text-sm">Men's</span>
              </button>
              <button 
                onClick={() => { setGender('Women'); setStep('upload'); }}
                className="group p-10 bg-stone-50 border-2 border-transparent hover:border-stone-900 rounded-[2rem] transition-all flex flex-col items-center gap-4"
              >
                <div className="w-20 h-20 bg-stone-200 rounded-full flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">💃</div>
                <span className="font-black uppercase tracking-widest text-sm">Women's</span>
              </button>
            </div>
          </div>
        )}

        {step === 'upload' && (
          <div className="p-10">
            <div className="mb-8 flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-black text-stone-900 tracking-tighter">SCAN BODY ANGLE</h2>
                <p className="text-sm text-stone-500">Provide 3 angles for high-precision virtual fitting.</p>
              </div>
              <div className="flex gap-1">
                {angles.map((a, i) => (
                  <div key={a.id} className={`w-8 h-1 rounded-full ${images[a.id] ? 'bg-green-500' : 'bg-stone-200'}`}></div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="flex flex-col gap-3">
                {angles.map(angle => (
                  <button
                    key={angle.id}
                    onClick={() => setActiveAngle(angle.id)}
                    className={`p-4 rounded-2xl border flex items-center gap-4 transition-all text-left ${
                      activeAngle === angle.id 
                        ? 'border-stone-900 bg-stone-900 text-white shadow-lg' 
                        : 'border-stone-100 bg-stone-50 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeAngle === angle.id ? 'bg-stone-800' : 'bg-white'}`}>
                      <i className={`fas ${angle.icon}`}></i>
                    </div>
                    <div>
                      <div className="font-black uppercase tracking-widest text-[10px]">{angle.label}</div>
                      <div className="text-[9px] opacity-60">{images[angle.id] ? 'Captured ✓' : angle.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="aspect-[3/4] bg-stone-100 rounded-[2rem] overflow-hidden relative border-2 border-dashed border-stone-200 group">
                {images[activeAngle] ? (
                  <div className="relative h-full">
                    <img src={images[activeAngle]!} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setImages(prev => ({...prev, [activeAngle]: null}))}
                      className="absolute top-4 right-4 w-8 h-8 bg-black/50 backdrop-blur text-white rounded-full flex items-center justify-center"
                    >
                      <i className="fas fa-trash-alt text-xs"></i>
                    </button>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center" onClick={() => fileInputRef.current?.click()}>
                    <i className="fas fa-cloud-upload-alt text-4xl text-stone-300 mb-4 group-hover:scale-110 transition-transform"></i>
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Click to upload {angles.find(a => a.id === activeAngle)?.label}</p>
                  </div>
                )}
              </div>
            </div>

            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />

            <div className="flex gap-4">
              <button 
                onClick={() => setStep('gender')}
                className="flex-1 py-4 bg-stone-100 text-stone-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-stone-200 transition-all"
              >
                Back
              </button>
              <button 
                disabled={!images.front || isProcessing}
                onClick={handleFinish}
                className="flex-[2] py-4 bg-stone-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-green-600 transition-all disabled:bg-stone-200 flex items-center justify-center gap-2 shadow-xl"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Syncing Clone...
                  </>
                ) : (
                  <>
                    <i className="fas fa-magic"></i>
                    Initialize AI Clone
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CloneWizard;
