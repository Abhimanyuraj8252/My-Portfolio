import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

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
    return (
        <Canvas
            shadows
            frameloop='demand'
            dpr={[1, 2]}
            gl={{ preserveDrawingBuffer: true }}
            camera={{
                fov: 45,
                near: 0.1,
                far: 200,
                position: [-4, 3, 6],
            }}
            onCreated={({ gl }) => {
                // Keep scroll working on touch devices while allowing canvas interactions
                gl.domElement.style.touchAction = 'pan-y';
            }}
        >
            <Suspense fallback={<CanvasLoader />}>
                <OrbitControls
                    autoRotate
                    autoRotateSpeed={5}
                    enableZoom={false}
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
