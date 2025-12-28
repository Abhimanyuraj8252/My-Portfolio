import { createContext, useContext } from 'react';

export const LenisContext = createContext(null);

export const useLenis = () => {
    const context = useContext(LenisContext);
    if (context === undefined) {
        throw new Error('useLenis must be used within a LenisProvider (SmoothScroll)');
    }
    return context;
};
