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
  size?: number; // default 170
  highlight?: boolean;
}

export default function LighthouseGauge({
  score,
  title,
  subtitle,
  segments,
  size = 175,
  highlight = false
}: LighthouseGaugeProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.33; // promień łuku
  const rLabel = size * 0.445; // promień etykiety metryki
  const strokeWidth = Math.max(5, Math.round(size * 0.04));

  const count = segments.length || 5;
  const totalAnglePerSeg = 360 / count;
  const gap = 8; // stopnie odstępu między segmentami
  const arcSpan = totalAnglePerSeg - gap;

  const getScoreColor = (val: number) => {
    if (val >= 80) return { stroke: '#10b981', hex: '#059669', bg: '#ecfdf5' };
    if (val >= 50) return { stroke: '#f59e0b', hex: '#d97706', bg: '#fffbeb' };
    return { stroke: '#ef4444', hex: '#dc2626', bg: '#fff1f2' };
  };

  const centerColor = getScoreColor(score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
          {/* Delikatne tło wewnątrz okręgu */}
          <circle
            cx={cx}
            cy={cy}
            r={r - strokeWidth * 1.2}
            fill={centerColor.bg}
            className="transition-colors duration-500"
          />

          {/* Segmenty łuków w stylu Google Lighthouse */}
          {segments.map((seg, i) => {
            const startAngle = -90 + i * totalAnglePerSeg + gap / 2;
            const endAngle = startAngle + arcSpan;
            const midAngle = (startAngle + endAngle) / 2;

            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            const midRad = (midAngle * Math.PI) / 180;

            const x1 = cx + r * Math.cos(startRad);
            const y1 = cy + r * Math.sin(startRad);
            const x2 = cx + r * Math.cos(endRad);
            const y2 = cy + r * Math.sin(endRad);

            const pathD = `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;

            const labelX = cx + rLabel * Math.cos(midRad);
            const labelY = cy + rLabel * Math.sin(midRad);

            const segColor = getScoreColor(seg.score);

            return (
              <g key={seg.name} className="group/seg">
                {/* Pusta ścieżka bazowa */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                />
                {/* Kolorowy aktywny łuk */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={segColor.stroke}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  className="transition-all duration-500 hover:opacity-80 cursor-pointer"
                >
                  <title>{`${seg.name}: ${seg.score}/100`}</title>
                </path>
                {/* Etykieta metryki na obwodzie (np. FCP, LCP, SEO) */}
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="font-mono text-[9px] sm:text-[10px] font-bold fill-slate-500 select-none pointer-events-none tracking-tight"
                >
                  {seg.name}
                </text>
              </g>
            );
          })}

          {/* Centralny wynik punktowy 0-100 */}
          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="central"
            className="font-black font-sans select-none tracking-tight"
            style={{ fill: centerColor.hex, fontSize: Math.round(size * 0.29) }}
          >
            {score}
          </text>
        </svg>
      </div>

      <div className="mt-2.5 text-center">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
          <span>{title}</span>
          {highlight && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-semibold">
              Kategoria
            </span>
          )}
        </h4>
        {subtitle && (
          <p className="text-[11px] text-slate-500 font-mono mt-0.5 max-w-[210px] leading-tight mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
