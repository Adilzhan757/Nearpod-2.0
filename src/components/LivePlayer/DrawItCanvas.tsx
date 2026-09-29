import React, { useRef, useState, useEffect } from 'react';
import { Pencil, Highlighter, Eraser, RotateCcw, Trash2, Send, CheckCircle2, ZoomIn } from 'lucide-react';

interface DrawItCanvasProps {
  prompt: string;
  instructions?: string;
  backgroundImageUrl?: string;
  onSubmit: (dataUrl: string) => void;
  isKazakh: boolean;
  initialSubmittedUrl?: string;
}

export const DrawItCanvas: React.FC<DrawItCanvasProps> = ({
  prompt,
  instructions,
  backgroundImageUrl,
  onSubmit,
  isKazakh,
  initialSubmittedUrl,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeTool, setActiveTool] = useState<'pen' | 'highlighter' | 'eraser'>('pen');
  const [currentColor, setCurrentColor] = useState('#2563eb'); // blue
  const [lineWidth, setLineWidth] = useState(4);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(Boolean(initialSubmittedUrl));

  const colors = [
    { name: 'Red', hex: '#dc2626' },
    { name: 'Blue', hex: '#2563eb' },
    { name: 'Green', hex: '#16a34a' },
    { name: 'Yellow', hex: '#eab308' },
    { name: 'Purple', hex: '#9333ea' },
    { name: 'Black', hex: '#0f172a' },
  ];

  // Initialize Canvas & load background image
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set dimensions
    const width = 800;
    const height = 500;
    canvas.width = width;
    canvas.height = height;

    if (backgroundImageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = backgroundImageUrl;
      img.onload = () => {
        // Draw background fitted nicely
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        const hRatio = width / img.width;
        const vRatio = height / img.height;
        const ratio = Math.min(hRatio, vRatio);
        const centerShiftX = (width - img.width * ratio) / 2;
        const centerShiftY = (height - img.height * ratio) / 2;

        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          centerShiftX,
          centerShiftY,
          img.width * ratio,
          img.height * ratio
        );

        // Save initial state for undo
        saveHistory();
      };
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      saveHistory();
    }
  }, [backgroundImageUrl]);

  const saveHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    try {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory((prev) => [...prev.slice(-15), data]);
    } catch {
      // ignore security restrictions
    }
  };

  const undo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...history];
    newHistory.pop(); // remove current
    const previous = newHistory[newHistory.length - 1];
    ctx.putImageData(previous, 0, 0);
    setHistory(newHistory);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (backgroundImageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = backgroundImageUrl;
      img.onload = () => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.min(hRatio, vRatio);
        const centerShiftX = (canvas.width - img.width * ratio) / 2;
        const centerShiftY = (canvas.height - img.height * ratio) / 2;
        ctx.drawImage(img, 0, 0, img.width, img.height, centerShiftX, centerShiftY, img.width * ratio, img.height * ratio);
        saveHistory();
      };
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      saveHistory();
    }
  };

  // Drawing event handlers
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);

    if (activeTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = lineWidth * 3;
    } else if (activeTool === 'highlighter') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = currentColor + '55'; // translucent
      ctx.lineWidth = lineWidth * 2.5;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = lineWidth;
    }
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveHistory();
    }
  };

  const handleSubmit = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL('image/png');
      onSubmit(dataUrl);
      setIsSubmitted(true);
    } catch {
      onSubmit('drawing-submitted');
      setIsSubmitted(true);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Prompt Banner */}
      <div className="p-4 bg-sky-50/70 border-b border-sky-100 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider font-mono">
              Draw It {isKazakh ? '· Интерактивті тапсырма' : '· Activity'}
            </span>
          </div>
          <h3 className="text-base font-semibold text-slate-900">{prompt}</h3>
          {instructions && (
            <p className="text-xs text-slate-600 mt-1">{instructions}</p>
          )}
        </div>

        {/* Submit status / button */}
        <div className="shrink-0">
          {isSubmitted ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{isKazakh ? 'Жіберілді ✓' : 'Submitted ✓'}</span>
            </div>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all hover:shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isKazakh ? 'Мұғалімге жіберу' : 'Submit Work'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Tools */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-xs">
          <button
            onClick={() => setActiveTool('pen')}
            className={`p-1.5 rounded-md transition-colors ${
              activeTool === 'pen'
                ? 'bg-sky-100 text-sky-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Қалам / Pen"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTool('highlighter')}
            className={`p-1.5 rounded-md transition-colors ${
              activeTool === 'highlighter'
                ? 'bg-sky-100 text-sky-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Маркер / Highlighter"
          >
            <Highlighter className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTool('eraser')}
            className={`p-1.5 rounded-md transition-colors ${
              activeTool === 'eraser'
                ? 'bg-sky-100 text-sky-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Өшіргіш / Eraser"
          >
            <Eraser className="w-4 h-4" />
          </button>
        </div>

        {/* Colors */}
        <div className="flex items-center gap-1.5">
          {colors.map((c) => (
            <button
              key={c.hex}
              onClick={() => {
                setCurrentColor(c.hex);
                if (activeTool === 'eraser') setActiveTool('pen');
              }}
              style={{ backgroundColor: c.hex }}
              className={`w-6 h-6 rounded-full transition-transform ${
                currentColor === c.hex && activeTool !== 'eraser'
                  ? 'ring-2 ring-offset-2 ring-slate-800 scale-110'
                  : 'hover:scale-105'
              }`}
              title={c.name}
            />
          ))}
        </div>

        {/* Brush size */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">
            {isKazakh ? 'Қалыңдығы:' : 'Size:'}
          </span>
          <input
            type="range"
            min={2}
            max={18}
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="w-20 accent-sky-600 cursor-pointer"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={history.length <= 1}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-md disabled:opacity-40 transition-colors"
            title="Артқа қайтару / Undo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isKazakh ? 'Артқа' : 'Undo'}</span>
          </button>
          <button
            onClick={clearCanvas}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-700 hover:text-rose-600 rounded-md transition-colors"
            title="Тазарту / Clear"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isKazakh ? 'Тазарту' : 'Clear'}</span>
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative bg-slate-100 flex items-center justify-center p-3 select-none touch-none">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="bg-white rounded-lg shadow-inner cursor-crosshair max-w-full h-auto border border-slate-200"
          style={{ maxHeight: '60vh', aspectRatio: '800/500' }}
        />
      </div>
    </div>
  );
};
