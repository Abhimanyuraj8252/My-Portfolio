import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
    Decal,
    Float,
    OrbitControls,
    Preload,
    useTexture,
} from "@react-three/drei";

import CanvasLoader from "../Loader";

const Ball = (props) => {
    const [decal] = useTexture([props.imgUrl], (texture) => {
        // Texture loaded successfully
    }, (error) => {
        console.error('Failed to load texture:', error);
    });

    return (
        <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
            <ambientLight intensity={0.25} />
            <directionalLight position={[0, 0, 0.05]} />
            <mesh castShadow receiveShadow scale={2.75}>
                <icosahedronGeometry args={[1, 1]} />
                <meshStandardMaterial
                    color='#fff8eb'
                    polygonOffset
                    polygonOffsetFactor={-5}
                    flatShading
                />
                <Decal
                    position={[0, 0, 1]}
                    rotation={[2 * Math.PI, 0, 6.25]}
                    map={decal}
                    flatShading
                />
            </mesh>
        </Float>
    );
};

const BallCanvas = ({ icon }) => {
    return (
        <Canvas
            frameloop='demand'
            dpr={[1, 1.5]}
            gl={{
                preserveDrawingBuffer: true,
                powerPreference: 'high-performance',
                antialias: false,
            }}
            onCreated={({ gl }) => {
                gl.domElement.style.touchAction = 'pan-y';
                gl.domElement.addEventListener('webglcontextlost', (e) => e.preventDefault(), false);
            }}
        >
            <Suspense fallback={<CanvasLoader />}>
                <OrbitControls enableZoom={false} enablePan={false} makeDefault />
                <Ball imgUrl={icon} />
            </Suspense>

            <Preload all />
        </Canvas>
    );
};

export default BallCanvas;
