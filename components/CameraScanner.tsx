
import React, { useRef, useState } from 'react';
import { Camera, X, Sparkles, RefreshCcw, Gamepad2 } from 'lucide-react';
import { parseReceiptImage } from '../services/geminiService';

interface CameraScannerProps {
  onParsed: (data: any) => void;
  onClose: () => void;
}

const CameraScanner: React.FC<CameraScannerProps> = ({ onParsed, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (err) {
      console.error("Camera access denied", err);
    }
  };

  React.useEffect(() => {
    startCamera();
    return () => stream?.getTracks().forEach(t => t.stop());
  }, []);

  const capture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsProcessing(true);
    
    const context = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context?.drawImage(videoRef.current, 0, 0);
    
    const base64 = canvasRef.current.toDataURL('image/jpeg', 0.8).split(',')[1];
    const result = await parseReceiptImage(base64);
    
    if (result) {
      onParsed(result);
    } else {
      setIsProcessing(false);
      alert("Neural Vision failed to decipher the input. Ensure high contrast and standard CBE/Telebirr layout.");
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-950 flex flex-col animate-in fade-in duration-500">
      <div className="relative flex-1 bg-black overflow-hidden">
        <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover opacity-80" />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Pro Gaming Hud Overlay */}
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
          <div className="w-full max-w-xs aspect-square border-2 border-indigo-500/30 rounded-[3rem] relative shadow-[0_0_50px_rgba(79,70,229,0.2)]">
            <div className="absolute top-0 left-0 w-12 h-12 border-t-8 border-l-8 border-indigo-500 -translate-x-1 -translate-y-1 rounded-tl-[2rem]" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t-8 border-r-8 border-indigo-500 translate-x-1 -translate-y-1 rounded-tr-[2rem]" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-8 border-l-8 border-indigo-500 -translate-x-1 translate-y-1 rounded-bl-[2rem]" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-8 border-r-8 border-indigo-500 translate-x-1 translate-y-1 rounded-br-[2rem]" />
            
            {/* Scan line effect */}
            <div className="absolute inset-x-0 h-1 bg-indigo-500/40 shadow-[0_0_15px_rgba(79,70,229,1)] animate-scan" />
          </div>
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mt-10 animate-pulse">Scanning Ledger Surface...</p>
        </div>

        <button onClick={onClose} className="absolute top-10 right-6 p-5 bg-white/5 hover:bg-white/10 text-white rounded-full backdrop-blur-xl border border-white/10 transition-all active:scale-90">
          <X size={28} />
        </button>

        <div className="absolute top-10 left-6 flex items-center gap-3 px-6 py-3 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl backdrop-blur-xl">
           <Gamepad2 size={20} className="text-indigo-400" />
           <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Neural Scanner v1.0</span>
        </div>
      </div>

      <div className="bg-slate-900 dark:bg-slate-950 p-12 flex flex-col items-center justify-center border-t border-white/5">
        <button 
          onClick={capture}
          disabled={isProcessing}
          className="w-28 h-28 bg-white rounded-full border-[12px] border-slate-800 dark:border-slate-900 flex items-center justify-center shadow-2xl active:scale-90 transition-all disabled:opacity-50 group relative overflow-hidden"
        >
          {isProcessing ? (
             <RefreshCcw className="animate-spin text-slate-900" size={40} />
          ) : (
            <div className="flex flex-col items-center">
              <Sparkles className="text-indigo-600 group-hover:scale-125 transition-transform" size={40} />
              <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
        </button>
        <p className="mt-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Decipher Receipt via Gemini Vision</p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: 10%; }
          100% { top: 90%; }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite alternate;
        }
      `}} />
    </div>
  );
};

export default CameraScanner;
