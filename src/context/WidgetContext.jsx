import React, { createContext, useContext, useEffect, useState } from 'react';

const WidgetContext = createContext(null);

export const WidgetProvider = ({ children }) => {
    const [widgets, setWidgets] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchWidgets = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await fetch(`${API_URL}/api/layout/dynamic-blocks`);
            if (res.ok) {
                const data = await res.json();
                setWidgets(data.filter(widget => widget.isActive));
            }
        } catch (error) {
            console.error('Failed to fetch widgets:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWidgets();
    }, []);

    return (
        <WidgetContext.Provider value={{ widgets, loading, refetch: fetchWidgets }}>
            {children}
        </WidgetContext.Provider>
    );
};

export const useWidgetStore = () => {
    const context = useContext(WidgetContext);
    if (!context) {
        throw new Error('useWidgetStore must be used within a WidgetProvider');
    }
    return context;
};
