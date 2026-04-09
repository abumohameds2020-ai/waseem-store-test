"use client";

import React, { Suspense, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Float, 
  Environment, 
  Html,
  ContactShadows,
  MeshDistortMaterial
} from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

// --- Procedural High-End IEM Shape ---
function iemShellGeometry() {
  const shape = new THREE.Shape();
  // Constructing a teardrop / ergonomic IEM body
  shape.moveTo(0, 0);
  shape.bezierCurveTo(1, 0, 1.5, 0.5, 1.5, 1.2);
  shape.bezierCurveTo(1.5, 2, 0.8, 2.5, 0, 2.5);
  shape.bezierCurveTo(-0.8, 2.5, -1.2, 1.5, -1.2, 0.8);
  shape.bezierCurveTo(-1.2, 0, -0.5, -0.2, 0, 0);
  
  const extrudeSettings = { 
    depth: 0.6, 
    bevelEnabled: true, 
    bevelThickness: 0.2, 
    bevelSize: 0.3, 
    bevelSegments: 64 
  };
  return new THREE.ExtrudeGeometry(shape, extrudeSettings);
}

function PBRPart({ position, rotation, color, label, specs, metalness = 0.9, transmission = 0, opacity = 1, geometry, emissive = "#000" }: any) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <group>
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh 
          position={position}
          rotation={rotation}
          ref={meshRef}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
          onPointerOut={() => setHovered(false)}
          castShadow
          receiveShadow
        >
          {geometry}
          <meshPhysicalMaterial 
            color={hovered ? '#d4af37' : color} 
            metalness={metalness} 
            roughness={hovered ? 0.05 : 0.2}
            transmission={transmission}
            thickness={2}
            envMapIntensity={2.5}
            clearcoat={1}
            clearcoatRoughness={0.05}
            transparent={opacity < 1}
            opacity={opacity}
            emissive={hovered ? '#d4af37' : emissive}
            emissiveIntensity={hovered ? 0.5 : 0}
          />
        </mesh>
      </Float>

      <Html position={[position[0] + 1.8, position[1] + 0.5, position[2]]}>
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
              className="pointer-events-none"
            >
              <div className="flex flex-col gap-1 border-l-2 border-[#d4af37] pl-6 bg-black/40 backdrop-blur-md p-4 rounded-r-2xl border-y border-white/5">
                 <span className="text-[12px] font-black text-[#d4af37] uppercase tracking-[0.4em]">{label}</span>
                 <div className="h-[1px] w-full bg-gradient-to-r from-[#d4af37] to-transparent my-1" />
                 <span className="text-[9px] font-bold text-white/80 uppercase tracking-widest">{specs}</span>
                 <span className="text-[8px] text-white/40 uppercase mt-2">Status: Active / Optimized</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Html>
    </group>
  );
}

export default function ThreeDVisualizer() {
  const shellGeo = useMemo(() => iemShellGeometry(), []);

  return (
    <section className="relative py-40 bg-[#030303] overflow-hidden min-h-screen flex flex-col items-center justify-center">
      {/* Background Holographic Glow */}
      <div className="absolute inset-0 z-0 bg-radial-gradient from-cyan-900/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
      
      <div className="absolute top-20 text-center z-10 pointer-events-none px-6">
         <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-cyan-500" />
            <span className="text-[11px] font-black text-[#d4af37] uppercase tracking-[1em]">Research & Development</span>
            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-cyan-500" />
         </div>
         <h2 className="text-7xl lg:text-9xl font-black text-white uppercase tracking-tighter leading-none italic mb-4">
           THE <span className="text-gray-500 italic opacity-50">CORE</span>
         </h2>
         <p className="max-w-2xl mx-auto text-white/40 text-[10px] font-black uppercase tracking-[0.5em]">Real-Time Physically Based Rendering • Holographic Structural Analysis</p>
      </div>

      <div className="w-full h-[900px] cursor-grab active:cursor-grabbing">
        <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
          <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={40} />
          
          <Environment preset="night" />

          {/* Cinematic Light Rig */}
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={10} color="#fff" />
          <pointLight position={[-10, -5, -10]} intensity={5} color="#06b6d4" />
          <pointLight position={[0, 10, 0]} intensity={2} color="#d4af37" />
          
          <Suspense fallback={null}>
            <group rotation={[Math.PI / 10, -Math.PI / 4, 0]}>
               
               {/* 1. Ghost Shell (Main IEM Body) */}
               <PBRPart 
                 position={[0, -1, 0]} 
                 rotation={[0, 0, -Math.PI / 4]}
                 color="#88ccee" 
                 label="Ghost Chassis" 
                 specs="UV-Cured Medical Resin Shell"
                 metalness={0.05}
                 transmission={0.98}
                 opacity={0.25}
                 geometry={<primitive object={shellGeo} />}
               />

               {/* 2. Planar Driver (Heart) */}
               <PBRPart 
                 position={[0.2, 0.3, 0.4]} 
                 color="#ffffff" 
                 label="Planar-Magnetic Core" 
                 specs="13.2mm Nano-Gold Diaphragm"
                 metalness={1}
                 geometry={<cylinderGeometry args={[0.55, 0.55, 0.15, 64]} />}
               />

               {/* 3. Balanced Armature (Detailed Guts) */}
               <PBRPart 
                 position={[-0.4, 0.8, 0.4]} 
                 color="#d4af37" 
                 label="High-Res Tweeter" 
                 specs="KZ Custom 30095 Armature"
                 metalness={0.9}
                 geometry={<boxGeometry args={[0.3, 0.4, 0.2]} />}
                 emissive="#d4af37"
               />

               {/* 4. Nozzle (Sonic Exit) */}
               <PBRPart 
                 position={[1.2, 0.1, 0.4]} 
                 rotation={[0, 0, Math.PI / 2.5]}
                 color="#ccc" 
                 label="Acoustic Nozzle" 
                 specs="CNC Milled Stainless Steel"
                 metalness={1}
                 geometry={<cylinderGeometry args={[0.25, 0.2, 0.8, 64]} />}
               />

               {/* 5. Crossover Circuit */}
               <PBRPart 
                 position={[-0.3, -0.2, 0.4]} 
                 color="#111" 
                 label="Neural Network" 
                 specs="Electronic Frequency Crossover"
                 metalness={0.5}
                 geometry={<boxGeometry args={[0.6, 0.4, 0.05]} />}
               />
            </group>

            <OrbitControls 
                enableZoom={false} 
                autoRotate 
                autoRotateSpeed={1.2}
                maxPolarAngle={Math.PI / 1.5}
                minPolarAngle={Math.PI / 3}
            />
            
            <ContactShadows position={[0, -3.5, 0]} opacity={0.6} scale={20} blur={3} far={5} />
          </Suspense>
        </Canvas>
      </div>

      {/* Scifi HUD Elements */}
      <div className="absolute bottom-20 left-20 hidden lg:flex flex-col gap-4">
         <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-cyan-500" />
            <div className="flex flex-col">
               <span className="text-[10px] font-black text-white uppercase tracking-widest">Physics Engaged</span>
               <span className="text-[8px] text-white/40 uppercase tracking-widest">Newtonian Fluid Dynamics</span>
            </div>
         </div>
      </div>

      <div className="absolute bottom-20 right-20 hidden lg:flex flex-col items-end gap-2">
         <span className="text-[40px] font-black text-white/5 tracking-tighter leading-none italic select-none">PRECISION</span>
         <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.5em] select-none">Engineering Manifest</span>
      </div>
    </section>
  );
}
