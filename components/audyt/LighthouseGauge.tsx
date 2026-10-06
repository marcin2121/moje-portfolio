'use client';

import React from 'react';

export interface GaugeSegment {
  name: string;
  score: number; // 0-100
}

interface LighthouseGaugeProps {
  score: number;
  title: string;
  subtitle?: string;
  segments: GaugeSegment[];
  size?: number; // default 175
  highlight?: boolean;
  badgeText?: string;
}

export default function LighthouseGauge({
  score,
  title,
  subtitle,
  segments,
  size = 175,
  highlight = false,
  badgeText
}: LighthouseGaugeProps) {
  const [hoveredSeg, setHoveredSeg] = React.useState<GaugeSegment | null>(null);

  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.36;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  // Paleta barw
  const getScoreTheme = (val: number) => {
    if (val >= 80) {
      return {
        stroke: '#10b981',
        strokeGradientEnd: '#059669',
        hex: '#059669',
        bg: '#ecfdf5',
        border: '#a7f3d0',
        tier: 'KLASA A',
        textColor: 'text-emerald-700'
      };
    }
    if (val >= 50) {
      return {
        stroke: '#f59e0b',
        strokeGradientEnd: '#d97706',
        hex: '#d97706',
        bg: '#fffbeb',
        border: '#fde68a',
        tier: 'ŚREDNIA',
        textColor: 'text-amber-700'
      };
    }
    return {
      stroke: '#f43f5e',
      strokeGradientEnd: '#e11d48',
      hex: '#e11d48',
      bg: '#fff1f2',
      border: '#fecdd3',
      tier: 'KRYTYCZNA',
      textColor: 'text-rose-700'
    };
  };

  const theme = getScoreTheme(score);
  const gradientId = `gauge-grad-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  // Kalibracja 24 mikro-znaczników tarczy (chronograph feel)
  const totalTicks = 28;
  const activeTicksCount = Math.round((score / 100) * totalTicks);
  const tickOuterRadius = radius + 9;
  const tickInnerRadius = radius + 5;

  return (
    <div className="flex flex-col items-center w-full max-w-[240px]">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="overflow-visible"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={theme.stroke} />
              <stop offset="100%" stopColor={theme.strokeGradientEnd} />
            </linearGradient>
            <filter id={`glow-${gradientId}`} x1="-20%" y1="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={theme.stroke} floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Subtelne tło wewnętrzne tarczy */}
          <circle
            cx={cx}
            cy={cy}
            r={radius - strokeWidth * 1.1}
            fill={theme.bg}
            className="transition-colors duration-500"
          />

          {/* Znaczniki obwodowe (precyzyjna podziałka telemetryczna) */}
          {Array.from({ length: totalTicks }).map((_, i) => {
            const angleDeg = -90 + (i * 360) / totalTicks;
            const angleRad = (angleDeg * Math.PI) / 180;
            const x1 = cx + tickInnerRadius * Math.cos(angleRad);
            const y1 = cy + tickInnerRadius * Math.sin(angleRad);
            const x2 = cx + tickOuterRadius * Math.cos(angleRad);
            const y2 = cy + tickOuterRadius * Math.sin(angleRad);
            const isActive = i < activeTicksCount;

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isActive ? theme.stroke : '#e2e8f0'}
                strokeWidth={isActive ? 1.5 : 1}
                strokeOpacity={isActive ? 0.75 : 0.4}
                strokeLinecap="round"
              />
            );
          })}

          {/* Bazowy tor okręgu */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />

          {/* Płynny ciągły łuk postępu (Bespoke Continuous Arc) */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}
            filter={`url(#glow-${gradientId})`}
            className="transition-all duration-700 ease-out"
          />

          {/* Wskazanie punktacji wewnątrz */}
          <text
            x={cx}
            y={cy - 2}
            textAnchor="middle"
            dominantBaseline="central"
            className="font-black font-sans select-none tracking-tight"
            style={{ fill: theme.hex, fontSize: Math.round(size * 0.26) }}
          >
            {score}
          </text>

          {/* Skala / 100 */}
          <text
            x={cx}
            y={cy + Math.round(size * 0.16)}
            textAnchor="middle"
            dominantBaseline="central"
            className="font-mono text-[10px] font-bold fill-slate-400 select-none tracking-wider"
          >
            / 100
          </text>
        </svg>
      </div>

      {/* Nagłówek i opis miernika */}
      <div className="mt-2 text-center w-full">
        <div className="flex items-center justify-center gap-1.5 flex-nowrap">
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight whitespace-nowrap">
            {title}
          </h4>
          {highlight && (
            <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-md font-semibold whitespace-nowrap shrink-0">
              {badgeText || 'Twoja platforma'}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-[11px] text-slate-500 font-mono mt-0.5 leading-tight">
            {subtitle}
          </p>
        )}
      </div>

      {/* Mini-pasek 5 wektorów telemetrycznych */}
      {segments && segments.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 w-full flex flex-wrap justify-center gap-1">
          {segments.map((seg) => {
            const segTheme = getScoreTheme(seg.score);
            return (
              <div
                key={seg.name}
                onMouseEnter={() => setHoveredSeg(seg)}
                onMouseLeave={() => setHoveredSeg(null)}
                className="group relative cursor-default"
              >
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200/60 transition-colors">
                  <span className="text-[9px] font-mono text-slate-500">{seg.name}</span>
                  <span
                    className="text-[9px] font-mono font-bold"
                    style={{ color: segTheme.hex }}
                  >
                    {seg.score}
                  </span>
                </div>

                {/* Tooltip mikrometryki */}
                {hoveredSeg?.name === seg.name && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-slate-900 text-white text-[10px] font-mono rounded shadow-lg whitespace-nowrap z-20 pointer-events-none">
                    {seg.name}: {seg.score}/100
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
