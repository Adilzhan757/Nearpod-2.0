import React, { useState, useRef } from 'react';
import { VRFieldTripData, VRHotspot } from '../../types/nearpod';
import { Compass, Info, Maximize2, Move, ZoomIn, ZoomOut, MapPin, Sparkles } from 'lucide-react';

interface VRViewerProps {
  vr: VRFieldTripData;
  isKazakh: boolean;
}

export const VRViewer: React.FC<VRViewerProps> = ({ vr, isKazakh }) => {
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeHotspot, setActiveHotspot] = useState<VRHotspot | null>(vr.hotspots[0] || null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX - panX);
    setStartY(e.clientY - panY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - startX;
    const newY = e.clientY - startY;

    // Constrain panning
    setPanX(Math.max(-250, Math.min(250, newX)));
    setPanY(Math.max(-80, Math.min(80, newY)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setStartX(e.touches[0].clientX - panX);
      setStartY(e.touches[0].clientY - panY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const newX = e.touches[0].clientX - startX;
    const newY = e.touches[0].clientY - startY;
    setPanX(Math.max(-250, Math.min(250, newX)));
    setPanY(Math.max(-80, Math.min(80, newY)));
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.max(1, Math.min(1.8, prev + delta)));
  };

  const resetView = () => {
    setPanX(0);
    setPanY(0);
    setZoomLevel(1);
  };

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl flex flex-col">
      {/* Top Bar for VR */}
      <div className="bg-slate-950/80 backdrop-blur-md p-4 border-b border-slate-800 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider font-mono">
                360° VR Field Trip · {isKazakh ? 'Виртуалды саяхат' : 'Exploration'}
              </span>
            </div>
            <h3 className="text-base font-bold font-display text-white">
              {vr.locationName}
            </h3>
          </div>
        </div>

        {/* Viewport controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleZoom(0.2)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors"
            title="Жақындату / Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(-0.2)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors"
            title="Алыстату / Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
          >
            {isKazakh ? 'Қалпына келтіру' : 'Reset'}
          </button>
        </div>
      </div>

      {/* Main 360 Viewer Canvas Container */}
      <div
        className="relative h-[440px] sm:h-[500px] overflow-hidden bg-black cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Panoramic Background Image Layer with transform */}
        <div
          className="absolute inset-0 w-[140%] h-[120%] -left-[20%] -top-[10%] transition-transform duration-75 ease-out"
          style={{
            transform: `translate(${panX}px, ${panY}px) scale(${zoomLevel})`,
            backgroundImage: `url(${vr.panoramicImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Interactive Hotspots positioned relative to canvas */}
          {vr.hotspots.map((spot) => (
            <button
              key={spot.id}
              onClick={(e) => {
                e.stopPropagation();
                setActiveHotspot(spot);
              }}
              style={{
                left: `${spot.xPercent}%`,
                top: `${spot.yPercent}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none z-20"
            >
              <span className="relative flex h-8 w-8">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-8 w-8 bg-sky-500 text-white items-center justify-center shadow-lg border-2 border-white cursor-pointer group-hover:scale-110 transition-transform">
                  <MapPin className="w-4 h-4 fill-white" />
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* User Interaction Guide Overlay */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs text-white/90 flex items-center gap-2 pointer-events-none">
          <Move className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
          <span>{isKazakh ? 'Тінтуірмен бұрыңыз (360°)' : 'Drag to rotate 360°'}</span>
        </div>

        {/* Active Hotspot Detail Card Modal */}
        {activeHotspot && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white p-4 rounded-xl shadow-2xl z-30 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-sky-500/20 text-sky-400">
                  <Info className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold font-display text-sky-300">
                  {activeHotspot.title}
                </h4>
              </div>
              <button
                onClick={() => setActiveHotspot(null)}
                className="text-slate-400 hover:text-white text-xs px-1"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {activeHotspot.description}
            </p>
          </div>
        )}
      </div>

      {/* Description footer */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
        <span>{vr.description}</span>
        <span className="font-mono text-slate-500">VR Gyro / Pan Active</span>
      </div>
    </div>
  );
};
