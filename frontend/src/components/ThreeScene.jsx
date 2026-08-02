import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function FloatingObjects() {
  const meshRef1 = useRef();
  const meshRef2 = useRef();
  const meshRef3 = useRef();
  const meshRef4 = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Smooth custom rotation & organic floating bobs
    if (meshRef1.current) {
      meshRef1.current.rotation.x = time * 0.12;
      meshRef1.current.rotation.y = time * 0.18;
      meshRef1.current.position.y = Math.sin(time * 0.6) * 0.5 + 1.3;
      meshRef1.current.position.x = Math.sin(time * 0.2) * 0.3 - 2.5;
    }
    if (meshRef2.current) {
      meshRef2.current.rotation.x = time * -0.08;
      meshRef2.current.rotation.y = time * 0.22;
      meshRef2.current.position.y = Math.cos(time * 0.5) * 0.4 - 1.4;
      meshRef2.current.position.x = Math.cos(time * 0.3) * 0.3 + 2.5;
    }
    if (meshRef3.current) {
      meshRef3.current.rotation.z = time * 0.25;
      meshRef3.current.rotation.x = time * 0.15;
      meshRef3.current.position.x = Math.sin(time * 0.4) * 0.6 + 3.2;
      meshRef3.current.position.y = Math.sin(time * 0.8) * 0.3 + 0.5;
    }
    if (meshRef4.current) {
      meshRef4.current.rotation.y = time * 0.3;
      meshRef4.current.position.x = Math.cos(time * 0.3) * 0.6 - 3.2;
      meshRef4.current.position.y = Math.cos(time * 0.6) * 0.3 - 0.5;
    }
  });

  return (
    <group>
      {/* 1. Large Frosted Glass Torus */}
      <mesh ref={meshRef1} position={[-2.5, 1.3, -1]}>
        <torusGeometry args={[0.9, 0.25, 32, 120]} />
        <meshPhysicalMaterial
          color="#ff7f30"
          roughness={0.05}
          metalness={0.1}
          transmission={0.92}
          thickness={1.5}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          ior={1.6}
        />
      </mesh>

      {/* 2. Glass TorusKnot */}
      <mesh ref={meshRef2} position={[2.5, -1.4, -2]}>
        <torusKnotGeometry args={[0.5, 0.18, 100, 16]} />
        <meshPhysicalMaterial
          color="#ff4500"
          roughness={0.08}
          metalness={0.2}
          transmission={0.88}
          thickness={1.2}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          ior={1.5}
        />
      </mesh>

      {/* 3. Floating Glass Diamond (Octahedron) */}
      <mesh ref={meshRef3} position={[3.2, 0.5, 0]}>
        <octahedronGeometry args={[0.6]} />
        <meshPhysicalMaterial
          color="#8b5cf6"
          roughness={0.02}
          metalness={0.15}
          transmission={0.95}
          thickness={2.0}
          clearcoat={1.0}
          ior={1.8}
        />
      </mesh>

      {/* 4. Floating Sphere */}
      <mesh ref={meshRef4} position={[-3.2, -0.5, 0]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshPhysicalMaterial
          color="#10b981"
          roughness={0.04}
          metalness={0.1}
          transmission={0.93}
          thickness={1.6}
          clearcoat={1.0}
          ior={1.4}
        />
      </mesh>
    </group>
  );
}

function Starfield() {
  const pointsRef = useRef();

  const [positions, colors] = useMemo(() => {
    const count = 480;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Create random points spread across space coordinate spheres
      const radius = 5 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      // Color nodes: mix bright orange (Stitch accent) and deep violet-purple
      const mixRatio = Math.random();
      if (mixRatio > 0.45) {
        col[i * 3] = 1.0;       // Red
        col[i * 3 + 1] = 0.42;   // Green
        col[i * 3 + 2] = 0.0;    // Blue
      } else if (mixRatio > 0.15) {
        col[i * 3] = 0.49;       // Violet
        col[i * 3 + 1] = 0.23;
        col[i * 3 + 2] = 0.93;
      } else {
        col[i * 3] = 0.06;       // Emerald
        col[i * 3 + 1] = 0.73;
        col[i * 3 + 2] = 0.51;
      }
    }

    return [pos, col];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      // Rotation + slight mouse parallax shifts
      pointsRef.current.rotation.y = time * 0.015;
      pointsRef.current.rotation.x = time * 0.008;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// Scene controls camera translation with custom parallax damping
function ParallaxScene() {
  useFrame((state) => {
    const { x, y } = state.pointer;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, x * 1.8, 0.04);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, y * 1.4, 0.04);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1.6} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.9} color="#7c3aed" />
      <pointLight position={[0, 0, 5]} intensity={0.6} color="#ff6b00" />
      <Starfield />
      <FloatingObjects />
    </>
  );
}

export default function ThreeScene() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-85">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ParallaxScene />
      </Canvas>
    </div>
  );
}
