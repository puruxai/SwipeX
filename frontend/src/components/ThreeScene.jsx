import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function FloatingObjects() {
  const meshRef1 = useRef();
  const meshRef2 = useRef();
  const meshRef3 = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Rotate and bob objects gently
    if (meshRef1.current) {
      meshRef1.current.rotation.x = time * 0.15;
      meshRef1.current.rotation.y = time * 0.2;
      meshRef1.current.position.y = Math.sin(time * 0.5) * 0.4 + 1.2;
    }
    if (meshRef2.current) {
      meshRef2.current.rotation.x = time * -0.1;
      meshRef2.current.rotation.y = time * 0.25;
      meshRef2.current.position.y = Math.cos(time * 0.4) * 0.3 - 1.2;
    }
    if (meshRef3.current) {
      meshRef3.current.rotation.z = time * 0.3;
      meshRef3.current.position.x = Math.sin(time * 0.3) * 0.5 + 2.5;
      meshRef3.current.position.y = Math.sin(time * 0.6) * 0.3;
    }
  });

  return (
    <group>
      {/* Mesh 1: Glass Sphere */}
      <mesh ref={meshRef1} position={[-2, 1.2, 0]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshPhysicalMaterial
          color="#ffb693"
          roughness={0.1}
          metalness={0.1}
          transmission={0.9}
          thickness={1.2}
          clearcoat={1.0}
        />
      </mesh>

      {/* Mesh 2: Glass Torus */}
      <mesh ref={meshRef2} position={[2, -1.2, -1]}>
        <torusGeometry args={[0.6, 0.2, 16, 100]} />
        <meshPhysicalMaterial
          color="#ff6b00"
          roughness={0.15}
          metalness={0.2}
          transmission={0.8}
          thickness={0.8}
          clearcoat={1.0}
        />
      </mesh>

      {/* Mesh 3: Floating Diamond */}
      <mesh ref={meshRef3} position={[2.5, 0, 1]}>
        <octahedronGeometry args={[0.5]} />
        <meshPhysicalMaterial
          color="#d2bbff"
          roughness={0.05}
          metalness={0.1}
          transmission={0.85}
          thickness={1.5}
          clearcoat={1.0}
        />
      </mesh>
    </group>
  );
}

function Starfield() {
  const pointsRef = useRef();

  const [positions, colors] = useMemo(() => {
    const count = 350;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Coordinates
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;

      // Custom color mixture of warm orange and cool purple particles
      const isOrange = Math.random() > 0.4;
      col[i * 3] = isOrange ? 1.0 : 0.82;
      col[i * 3 + 1] = isOrange ? 0.42 : 0.73;
      col[i * 3 + 2] = isOrange ? 0.0 : 1.0;
    }

    return [pos, col];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.02;
      pointsRef.current.rotation.x = time * 0.01;
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
        size={0.045}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// Scene controller that responds to mouse movement
function ParallaxScene() {
  useFrame((state) => {
    const { x, y } = state.pointer;
    // Smoothly shift camera position based on cursor pointer coordinate
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, x * 1.5, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, y * 1.2, 0.05);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} intensity={0.8} color="#d2bbff" />
      <Starfield />
      <FloatingObjects />
    </>
  );
}

export default function ThreeScene() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-90">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ParallaxScene />
      </Canvas>
    </div>
  );
}
