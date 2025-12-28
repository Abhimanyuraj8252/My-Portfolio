import { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import { LenisContext } from '../context/LenisContext';

const SmoothScroll = ({ children }) => {
    const [lenis, setLenis] = useState(null);
    const reqIdRef = useRef(null);

    useEffect(() => {
        const lenisInstance = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1, // Reset to 1 for natural feel
            smoothTouch: false, // Keep false for native touch feel as per recommendation usually
            touchMultiplier: 2,
        });

        setLenis(lenisInstance);

        function raf(time) {
            lenisInstance.raf(time);
            reqIdRef.current = requestAnimationFrame(raf);
        }

        reqIdRef.current = requestAnimationFrame(raf);

        return () => {
            lenisInstance.destroy();
            if (reqIdRef.current) {
                cancelAnimationFrame(reqIdRef.current);
            }
            setLenis(null);
        };
    }, []);

    return (
        <LenisContext.Provider value={lenis}>
            {children}
        </LenisContext.Provider>
    );
};

export default SmoothScroll;
