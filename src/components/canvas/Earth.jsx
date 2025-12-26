import React, { Suspense, useState, useCallback, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Earth = () => {
    return (
        <group dispose={null}>
            {/* Core Sphere - Darker background */}
            <mesh scale={2.2}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshStandardMaterial color="#1f1f1f" />
            </mesh>

            {/* Particle Cloud Layer - Premium Modern Look */}
            {/* Blue Particles */}
            <points scale={2.25}>
                <sphereGeometry args={[1, 64, 64]} />
                <pointsMaterial color="#25c0e0" size={0.02} transparent opacity={0.8} sizeAttenuation={true} />
            </points>

            {/* Red Particles - Slightly Offset */}
            <points scale={2.25} rotation={[0.5, 0.5, 0]}>
                <sphereGeometry args={[1, 48, 48]} />
                <pointsMaterial color="#ff3b3b" size={0.02} transparent opacity={0.6} sizeAttenuation={true} />
            </points>

            {/* Yellow Particles - Another Offset */}
            <points scale={2.25} rotation={[-0.5, -0.2, 0]}>
                <sphereGeometry args={[1, 32, 32]} />
                <pointsMaterial color="#ffcc00" size={0.025} transparent opacity={0.6} sizeAttenuation={true} />
            </points>

            <ambientLight intensity={1} />
        </group>
    );
};

const EarthCanvas = () => {
    const [contextLost, setContextLost] = useState(false);
    const canvasRef = useRef(null);

    const handleContextLost = useCallback((e) => {
        e.preventDefault();
        console.warn('WebGL context lost, attempting to restore...');
        setContextLost(true);
    }, []);

    const handleContextRestored = useCallback(() => {
        console.log('WebGL context restored');
        setContextLost(false);
    }, []);

    // Show fallback when context is lost
    if (contextLost) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-secondary text-sm">Restoring 3D view...</div>
            </div>
        );
    }

    return (
        <Canvas
            ref={canvasRef}
            shadows
            frameloop='demand'
            dpr={[1, 1.5]} // Limit max DPR for better performance
            gl={{
                preserveDrawingBuffer: false, // Set to false to reduce memory usage
                powerPreference: 'default', // Let browser decide for better stability
                antialias: false, // Disable for better mobile performance
                failIfMajorPerformanceCaveat: false, // Don't fail on low-end devices
            }}
            camera={{
                fov: 45,
                near: 0.1,
                far: 200,
                position: [-4, 3, 6],
            }}
            onCreated={({ gl }) => {
                gl.domElement.style.touchAction = 'pan-y';

                // Handle WebGL context loss gracefully
                gl.domElement.addEventListener('webglcontextlost', handleContextLost, false);
                gl.domElement.addEventListener('webglcontextrestored', handleContextRestored, false);
            }}
        >
            <Suspense fallback={<CanvasLoader />}>
                <OrbitControls
                    autoRotate
                    autoRotateSpeed={5}
                    enableZoom={false}
                    enablePan={false}
                    maxPolarAngle={Math.PI / 2}
                    minPolarAngle={Math.PI / 2}
                    makeDefault
                />
                <Earth />
            </Suspense>

            <Preload all />
        </Canvas>
    );
};

export default EarthCanvas;
