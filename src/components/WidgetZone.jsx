import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWidgetStore } from '../context/WidgetContext';
import SafeHTMLInjector from './SafeHTMLInjector';

/**
 * WidgetZone
 * 
 * Replaces DynamicAd. Connects to WidgetContext.
 * Shows a skeleton loader matching `minHeight` while waiting for the payload.
 * Fades in the `SafeHTMLInjector` once ready.
 * Collapses to 0 height if no widget exists for this route/zone.
 */
const WidgetZone = ({ zoneName, minHeight = 'min-h-[90px]' }) => {
    const { widgets, loading } = useWidgetStore();
    const location = useLocation();
    const [activeWidget, setActiveWidget] = useState(null);

    // Live preview overrides
    const [previewWidget, setPreviewWidget] = useState(null);

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data?.type === 'WIDGET_PREVIEW' && event.data?.zone === zoneName) {
                setPreviewWidget(event.data.widget);
            } else if (event.data?.type === 'WIDGET_PREVIEW_CLEAR' && event.data?.zone === zoneName) {
                setPreviewWidget(null);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [zoneName]);

    useEffect(() => {
        if (previewWidget) {
            setActiveWidget(previewWidget);
            return;
        }

        if (widgets && widgets.length > 0) {
            const currentRoute = location.pathname;
            const validWidget = widgets.find(
                w => w.zone === zoneName && w.isActive && (w.pageRoute === '*' || w.pageRoute === currentRoute)
            );
            setActiveWidget(validWidget || null);
        } else {
            setActiveWidget(null);
        }
    }, [widgets, zoneName, location.pathname, previewWidget]);

    return (
        <AnimatePresence mode="wait">
            {loading ? (
                <motion.div
                    key="skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`w-full ${minHeight} animate-pulse bg-gray-800/20 rounded-xl`}
                />
            ) : activeWidget ? (
                <motion.div
                    key="content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="w-full flex items-center justify-center overflow-hidden"
                >
                    <SafeHTMLInjector htmlContent={activeWidget.renderContent} />
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
};

export default WidgetZone;
