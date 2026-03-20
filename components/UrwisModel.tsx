'use client';

import React, { Suspense, useEffect, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center } from '@react-three/drei';

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export default function UrwisModel() {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // Tylko raz, zaczynamy pobierać
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative cursor-grab active:cursor-grabbing bg-zinc-950/20 backdrop-blur-sm"
    >
      {!isInView ? (
        <div className="w-full h-full flex items-center justify-center animate-pulse bg-zinc-900">
          <span className="text-zinc-600 font-mono text-xs">Wczytywanie sceny...</span>
        </div>
      ) : (
        <Canvas
          // FOV 30 sprawi, że model będzie bliżej (większy)
          camera={{ position: [0, 0, 4.5], fov: 30 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 10, 5]} intensity={0.9} />
          <directionalLight position={[-5, 2, -4]} intensity={0.4} />
          <pointLight position={[0, 0, 2]} intensity={0.5} color="#ea580c" />
          
          <Suspense fallback={null}>
            <Center>
              <Model url="/urwis.glb" />
            </Center>
            <OrbitControls 
              enableZoom={false} 
              enablePan={false} 
              autoRotate 
              autoRotateSpeed={4.0} 
              minPolarAngle={Math.PI / 3} 
              maxPolarAngle={Math.PI / 1.5} 
            />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}

useGLTF.preload('/urwis.glb');
