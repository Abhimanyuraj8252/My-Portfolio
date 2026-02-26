import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useGlobalTracker } from '../hooks/useGlobalTracker';

/**
 * DynamicWidget
 * 
 * Safe HTML injector and layout shift protector combined.
 * Automatically ties into useGlobalTracker to pull down the display blocks. 
 */
export const DynamicWidget = ({ zone, minHeight = 'min-h-[90px]' }) => {
    const { configs, error } = useGlobalTracker();
    const location = useLocation();
    const containerRef = useRef(null);

    // If fetch failed completely (e.g. AdBlocker blocked the whole JSON call)
    // we want to instantly render null to collapse the layout space gracefully.
    if (error) return null;

    const widgets = configs?.widgets || [];

    const activeWidget = widgets.find(
        w => w.zone === zone && w.isActive && (w.pageRoute === '*' || w.pageRoute === location.pathname)
    );

    useEffect(() => {
        if (!activeWidget || !containerRef.current) return;

        const htmlContent = activeWidget.renderContent;
        if (!htmlContent) return;

        // Clean any existing content before injecting
        while (containerRef.current.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild);
        }

        const parser = new DOMParser();
        const parsedDoc = parser.parseFromString(htmlContent, 'text/html');

        const originalScripts = Array.from(parsedDoc.querySelectorAll('script'));
        originalScripts.forEach(script => script.parentNode?.removeChild(script));

        // Inject non-script HTML
        containerRef.current.innerHTML = parsedDoc.body.innerHTML;

        const injectedNodes = [];

        // Force script execution
        originalScripts.forEach(originalScript => {
            const newScript = document.createElement('script');

            Array.from(originalScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });

            newScript.textContent = originalScript.textContent;
            newScript.setAttribute('data-dynamic-widget', zone);

            injectedNodes.push(newScript);
            containerRef.current.appendChild(newScript);
        });

        // Cleanup on unmount (prevent memory leaks during SPA navigation)
        return () => {
            injectedNodes.forEach(node => {
                if (node.parentNode) {
                    node.parentNode.removeChild(node);
                }
            });
        };
    }, [activeWidget, location.pathname]);

    return (
        <AnimatePresence mode="wait">
            {!configs ? (
                // Skeleton Loader before the fetch completes
                <motion.div
                    key="skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`w-full ${minHeight} animate-pulse bg-gray-800/20 rounded-xl`}
                />
            ) : activeWidget ? (
                // Actual contents after execution
                <motion.div
                    key="content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full flex items-center justify-center overflow-hidden"
                >
                    <div ref={containerRef} className="w-full dynamic-widget-container" />
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
};
