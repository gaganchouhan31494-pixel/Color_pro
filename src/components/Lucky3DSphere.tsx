import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Sparkles, Eye, Maximize2, RotateCcw, Flame } from 'lucide-react';
import { ColorType, Language, RoundResult } from '../types';
import { translations } from '../utils/translations';

interface Ball3D {
  id: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  color: 'green' | 'red' | 'violet' | 'gold' | 'blue';
  number: number;
  label: string;
  active: boolean;
  opacity: number;
}

interface Lucky3DSphereProps {
  remainingSeconds: number;
  isLocked: boolean;
  lastResult?: RoundResult | null;
  language: Language;
  onSelectColor?: (color: ColorType) => void;
}

export const Lucky3DSphere: React.FC<Lucky3DSphereProps> = ({
  remainingSeconds,
  isLocked,
  lastResult,
  language,
  onSelectColor,
}) => {
  const t = translations[language];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isInteractive, setIsInteractive] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState<{ x: number; y: number }>({ x: 0.1, y: 0.2 });
  const [highlightedColor, setHighlightedColor] = useState<ColorType | null>(null);

  // Balls physics array in 3D
  const ballsRef = useRef<Ball3D[]>([
    { id: 0, x: 20, y: -20, z: 15, vx: 0.8, vy: 0.9, vz: 0.7, radius: 15, color: 'violet', number: 0, label: '0', active: true, opacity: 1 },
    { id: 1, x: -30, y: 15, z: -10, vx: -0.9, vy: 0.7, vz: 0.8, radius: 14, color: 'green', number: 1, label: '1', active: true, opacity: 1 },
    { id: 2, x: 35, y: -10, z: -25, vx: 0.7, vy: -0.8, vz: 0.6, radius: 14, color: 'red', number: 2, label: '2', active: true, opacity: 1 },
    { id: 3, x: -15, y: -30, z: 20, vx: -0.6, vy: 0.8, vz: -0.9, radius: 14, color: 'green', number: 3, label: '3', active: true, opacity: 1 },
    { id: 4, x: 25, y: 25, z: -15, vx: 0.8, vy: -0.6, vz: 0.7, radius: 14, color: 'red', number: 4, label: '4', active: true, opacity: 1 },
    { id: 5, x: 0, y: 0, z: 35, vx: 0.5, vy: 0.9, vz: -0.8, radius: 15, color: 'violet', number: 5, label: '5', active: true, opacity: 1 },
    { id: 6, x: -35, y: -20, z: -15, vx: -0.8, vy: 0.6, vz: 0.5, radius: 14, color: 'red', number: 6, label: '6', active: true, opacity: 1 },
    { id: 7, x: 15, y: -35, z: -10, vx: 0.7, vy: -0.7, vz: -0.6, radius: 14, color: 'green', number: 7, label: '7', active: true, opacity: 1 },
    { id: 8, x: -20, y: 30, z: 25, vx: -0.7, vy: 0.8, vz: 0.6, radius: 14, color: 'red', number: 8, label: '8', active: true, opacity: 1 },
    { id: 9, x: 30, y: 10, z: 30, vx: 0.9, vy: -0.7, vz: -0.7, radius: 14, color: 'green', number: 9, label: '9', active: true, opacity: 1 },
  ]);

  // Color reduction effect trigger when locked (last 5s)
  useEffect(() => {
    if (isLocked) {
      // In the last 5 seconds, stimulate rapid 3D turbulence
      ballsRef.current.forEach((b) => {
        b.vx = (Math.random() - 0.5) * 4.5;
        b.vy = (Math.random() - 0.5) * 4.5;
        b.vz = (Math.random() - 0.5) * 4.5;
      });
    }
  }, [isLocked]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const sphereRadius = 88;
    const focalLength = 260;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2 - 6;

      ctx.clearRect(0, 0, width, height);

      // Auto rotation when not dragging
      if (!isDragging) {
        const speed = isLocked ? 0.045 : 0.008;
        setRotation((prev) => ({
          x: prev.x + speed * 0.4,
          y: prev.y + speed,
        }));
      }

      const cosX = Math.cos(rotation.x);
      const sinX = Math.sin(rotation.x);
      const cosY = Math.cos(rotation.y);
      const sinY = Math.sin(rotation.y);

      // 1. Draw 3D Base Pedestal (Metallic Stage)
      const baseCy = cy + sphereRadius + 14;
      const baseGrad = ctx.createLinearGradient(cx - 90, baseCy, cx + 90, baseCy + 25);
      baseGrad.addColorStop(0, '#1e293b');
      baseGrad.addColorStop(0.5, '#475569');
      baseGrad.addColorStop(1, '#0f172a');

      // Pedestal bottom shadow
      ctx.beginPath();
      ctx.ellipse(cx, baseCy + 14, 85, 20, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fill();

      // Pedestal rim
      ctx.beginPath();
      ctx.ellipse(cx, baseCy, 75, 18, 0, 0, Math.PI * 2);
      ctx.fillStyle = baseGrad;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#64748b';
      ctx.stroke();

      // Neon stage ring (glows green or amber)
      ctx.beginPath();
      ctx.ellipse(cx, baseCy - 2, 70, 16, 0, 0, Math.PI * 2);
      ctx.strokeStyle = isLocked ? '#f43f5e' : '#10b981';
      ctx.lineWidth = isLocked ? 3 : 2;
      ctx.shadowColor = isLocked ? '#f43f5e' : '#10b981';
      ctx.shadowBlur = isLocked ? 15 : 8;
      ctx.stroke();
      ctx.shadowBlur = 0; // reset

      // 2. Glass Sphere Outer Glow
      const glowGrad = ctx.createRadialGradient(cx, cy, sphereRadius * 0.4, cx, cy, sphereRadius * 1.3);
      if (isLocked) {
        glowGrad.addColorStop(0, 'rgba(244, 63, 94, 0.08)');
        glowGrad.addColorStop(0.8, 'rgba(244, 63, 94, 0.25)');
        glowGrad.addColorStop(1, 'rgba(244, 63, 94, 0)');
      } else {
        glowGrad.addColorStop(0, 'rgba(16, 185, 129, 0.05)');
        glowGrad.addColorStop(0.8, 'rgba(99, 102, 241, 0.18)');
        glowGrad.addColorStop(1, 'rgba(99, 102, 241, 0)');
      }
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, sphereRadius * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // 3. 3D Wireframe / Glass rings inside sphere
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, sphereRadius, 0, Math.PI * 2);
      ctx.clip(); // Keep all 3D contents inside the glass dome

      // Background inside sphere
      const innerBg = ctx.createRadialGradient(cx, cy - 20, 10, cx, cy, sphereRadius);
      innerBg.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
      innerBg.addColorStop(1, 'rgba(2, 6, 23, 0.98)');
      ctx.fillStyle = innerBg;
      ctx.fill();

      // Draw subtle rotating longitude & latitude 3D rings
      ctx.lineWidth = 1;
      ctx.strokeStyle = isLocked ? 'rgba(244, 63, 94, 0.2)' : 'rgba(148, 163, 184, 0.12)';
      for (let lat = -60; lat <= 60; lat += 30) {
        const radLat = (lat * Math.PI) / 180;
        const ringR = sphereRadius * Math.cos(radLat);
        const ringY = cy + sphereRadius * Math.sin(radLat) * cosX;
        ctx.beginPath();
        ctx.ellipse(cx, ringY, ringR, ringR * Math.abs(sinX) * 0.4 + 4, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 4. Update and Project 3D Balls
      const balls = ballsRef.current;
      const projectedBalls: {
        ball: Ball3D;
        px: number;
        py: number;
        pz: number;
        pRadius: number;
      }[] = [];

      balls.forEach((b) => {
        // Physics update
        const speedFactor = isLocked ? 2.5 : 1.0;
        b.x += b.vx * speedFactor;
        b.y += b.vy * speedFactor;
        b.z += b.vz * speedFactor;

        // Collision with 3D spherical boundary
        const distFromCenter = Math.sqrt(b.x * b.x + b.y * b.y + b.z * b.z);
        const maxDist = sphereRadius - b.radius - 4;

        if (distFromCenter > maxDist) {
          // Normal vector
          const nx = b.x / distFromCenter;
          const ny = b.y / distFromCenter;
          const nz = b.z / distFromCenter;

          // Reflect velocity vector: v = v - 2*(v.n)*n
          const dot = b.vx * nx + b.vy * ny + b.vz * nz;
          b.vx = b.vx - 2 * dot * nx;
          b.vy = b.vy - 2 * dot * ny;
          b.vz = b.vz - 2 * dot * nz;

          // Clamp position inside
          b.x = nx * maxDist;
          b.y = ny * maxDist;
          b.z = nz * maxDist;
        }

        // Apply 3D Rotation (Euler angles: Y then X)
        // 1. Rotate Y
        const x1 = b.x * cosY - b.z * sinY;
        const z1 = b.z * cosY + b.x * sinY;
        // 2. Rotate X
        const y2 = b.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + b.y * sinX;

        // Perspective Projection
        const scale = focalLength / (focalLength + z2);
        const px = cx + x1 * scale;
        const py = cy + y2 * scale;
        const pRadius = Math.max(8, b.radius * scale);

        projectedBalls.push({
          ball: b,
          px,
          py,
          pz: z2,
          pRadius,
        });
      });

      // Sort by Z-depth (painter's algorithm)
      projectedBalls.sort((a, b) => a.pz - b.pz);

      // Render 3D Balls
      projectedBalls.forEach(({ ball, px, py, pz, pRadius }) => {
        ctx.save();

        // Ball shadow on back wall
        ctx.beginPath();
        ctx.arc(px + 3, py + 3, pRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fill();

        // 3D Sphere Spherical Shading Gradient
        // Light source top-left: (px - pRadius * 0.35, py - pRadius * 0.35)
        const lightX = px - pRadius * 0.35;
        const lightY = py - pRadius * 0.35;
        const ballGrad = ctx.createRadialGradient(
          lightX,
          lightY,
          pRadius * 0.1,
          px,
          py,
          pRadius
        );

        if (ball.color === 'green') {
          ballGrad.addColorStop(0, '#a7f3d0');
          ballGrad.addColorStop(0.3, '#10b981');
          ballGrad.addColorStop(0.8, '#047857');
          ballGrad.addColorStop(1, '#064e3b');
        } else if (ball.color === 'red') {
          ballGrad.addColorStop(0, '#fecdd3');
          ballGrad.addColorStop(0.3, '#f43f5e');
          ballGrad.addColorStop(0.8, '#be123c');
          ballGrad.addColorStop(1, '#881337');
        } else if (ball.color === 'violet') {
          ballGrad.addColorStop(0, '#ddd6fe');
          ballGrad.addColorStop(0.3, '#8b5cf6');
          ballGrad.addColorStop(0.8, '#6d28d9');
          ballGrad.addColorStop(1, '#4c1d95');
        } else {
          ballGrad.addColorStop(0, '#fef08a');
          ballGrad.addColorStop(0.3, '#eab308');
          ballGrad.addColorStop(0.8, '#b45309');
          ballGrad.addColorStop(1, '#78350f');
        }

        ctx.beginPath();
        ctx.arc(px, py, pRadius, 0, Math.PI * 2);
        ctx.fillStyle = ballGrad;
        ctx.fill();

        // Specular glass highlight reflection
        ctx.beginPath();
        ctx.arc(lightX, lightY, pRadius * 0.28, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();

        // Number Label on Ball
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.round(pRadius * 0.95)}px 'JetBrains Mono', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;
        ctx.fillText(ball.label, px, py + 1);
        ctx.shadowBlur = 0;

        ctx.restore();
      });

      // 5. Realistic Glass Lens Highlights & Reflections (Glossy Dome)
      // Top crescent highlight
      const glassReflect = ctx.createLinearGradient(cx - 50, cy - sphereRadius, cx + 50, cy);
      glassReflect.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
      glassReflect.addColorStop(0.3, 'rgba(255, 255, 255, 0.15)');
      glassReflect.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.beginPath();
      ctx.ellipse(cx - 15, cy - sphereRadius * 0.48, sphereRadius * 0.65, sphereRadius * 0.35, -0.2, 0, Math.PI * 2);
      ctx.fillStyle = glassReflect;
      ctx.fill();

      // Edge rim glass glow
      ctx.beginPath();
      ctx.arc(cx, cy, sphereRadius - 1, 0, Math.PI * 2);
      ctx.lineWidth = 3;
      ctx.strokeStyle = isLocked ? 'rgba(244, 63, 94, 0.7)' : 'rgba(255, 255, 255, 0.3)';
      ctx.stroke();

      ctx.restore(); // Restore outer clip

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [isDragging, isLocked, rotation]);

  // Mouse / Touch interaction handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - mousePos.x;
    const dy = e.clientY - mousePos.y;
    setRotation((prev) => ({
      x: Math.max(-0.8, Math.min(0.8, prev.x + dy * 0.01)),
      y: prev.y + dx * 0.01,
    }));
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch event handlers for mobile responsiveness
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - mousePos.x;
    const dy = e.touches[0].clientY - mousePos.y;
    setRotation((prev) => ({
      x: Math.max(-0.8, Math.min(0.8, prev.x + dy * 0.01)),
      y: prev.y + dx * 0.01,
    }));
    setMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = () => setIsDragging(false);

  return (
    <div
      ref={containerRef}
      id="lucky-3d-sphere-card"
      className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl overflow-hidden transition-all duration-300"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with 3D Badge & Status */}
      <div className="flex items-center justify-between gap-2 mb-2 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-md flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-1.5">
              <span>{t.sphere3DTitle}</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                3D LIVE
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {t.sphere3DHint}
            </p>
          </div>
        </div>

        {/* Live Status indicator */}
        <div className="flex items-center gap-1.5">
          {isLocked ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>3D DRAW VORTEX</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{remainingSeconds}s</span>
            </span>
          )}
        </div>
      </div>

      {/* Main 3D Canvas Stage */}
      <div className="relative flex flex-col items-center justify-center my-1 select-none">
        <canvas
          id="canvas-3d-sphere"
          ref={canvasRef}
          width={320}
          height={230}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="cursor-grab active:cursor-grabbing touch-none max-w-full"
          style={{ width: '320px', height: '230px' }}
        />

        {/* Quick color selector chips under 3D stage */}
        <div className="flex items-center justify-center gap-2 mt-1 w-full max-w-xs px-2">
          <button
            id="btn-3d-select-green"
            onClick={() => onSelectColor && onSelectColor('green')}
            className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1 shadow-sm"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Green</span>
          </button>
          <button
            id="btn-3d-select-violet"
            onClick={() => onSelectColor && onSelectColor('violet')}
            className="flex-1 py-1.5 px-2 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-purple-300 text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1 shadow-sm"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
            <span>Violet</span>
          </button>
          <button
            id="btn-3d-select-red"
            onClick={() => onSelectColor && onSelectColor('red')}
            className="flex-1 py-1.5 px-2 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1 shadow-sm"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span>Red</span>
          </button>
        </div>
      </div>
    </div>
  );
};
