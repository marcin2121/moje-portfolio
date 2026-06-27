'use client';

import dynamic from 'next/dynamic';

const Particles = dynamic(() => import('@/components/ui/Particles'), { ssr: false });

export function ParticlesClient() {
  return <Particles />;
}
