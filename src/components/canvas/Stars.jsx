import React, { useState, useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";

const Stars = (props) => {
    const ref = useRef();

    const sphere = useMemo(() => {
        const positions = new Float32Array(5001); // 1667 stars * 3 coordinates

        for (let i = 0; i < positions.length; i += 3) {
            const radius = Math.random() * 1.2;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);

            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);

            // Ensure no NaN or Infinity values
            positions[i] = isFinite(x) ? x : 0;
            positions[i + 1] = isFinite(y) ? y : 0;
            positions[i + 2] = isFinite(z) ? z : 0;
        }

        return positions;
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color='#f272c8'
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
};

const StarsCanvas = () => {
    return (
        <div
            className='pointer-events-none'
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                pointerEvents: 'none',
            }}
        >
            <Canvas
                camera={{ position: [0, 0, 1] }}
                dpr={[1, 1.5]} // Limit pixel ratio
                gl={{
                    preserveDrawingBuffer: false,
                    powerPreference: 'low-power', // Low power for background element
                    antialias: false,
                }}
                onCreated={({ gl }) => {
                    gl.domElement.addEventListener('webglcontextlost', (e) => e.preventDefault(), false);
                }}
                style={{ pointerEvents: 'none' }}
            >
                <Suspense fallback={null}>
                    <Stars />
                </Suspense>

                <Preload all />
            </Canvas>
        </div>
    );
};

export default React.memo(StarsCanvas);
