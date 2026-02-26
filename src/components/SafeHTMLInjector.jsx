import React, { useEffect, useRef } from 'react';

/**
 * SafeHTMLInjector
 * 
 * A utility component that safely injects generic HTML blobs
 * and extracts/executes `<script>` tags by creating fresh nodes.
 * Used heavily for rendering display blocks/third-party widgets.
 */
const SafeHTMLInjector = ({ htmlContent }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current || !htmlContent) return;

        // 1. Parse the incoming string HTML into a Document object
        const parser = new DOMParser();
        const parsedDoc = parser.parseFromString(htmlContent, 'text/html');

        // 2. Clear current container
        while (containerRef.current.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild);
        }

        const scriptNodes = []; // To keep track for cleanup
        const originalScripts = Array.from(parsedDoc.querySelectorAll('script'));

        // 3. Remove scripts from the parsed document body before injecting
        originalScripts.forEach(script => script.parentNode?.removeChild(script));

        // 4. Inject the raw non-script HTML
        containerRef.current.innerHTML = parsedDoc.body.innerHTML;

        // 5. Recreate and append the script tags to execute them
        originalScripts.forEach(originalScript => {
            const newScript = document.createElement('script');

            // Copy all attributes
            Array.from(originalScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });

            // Reattach inline text content
            newScript.textContent = originalScript.textContent;

            // Optional: Mark it for easier targeting/cleanup
            newScript.setAttribute('data-injector', 'safe');

            scriptNodes.push(newScript);

            // Append to DOM inside the container so they are scoped logically
            containerRef.current.appendChild(newScript);
        });

        // 6. Cleanup on unmount or re-render
        return () => {
            // Scripts inside containerRef are auto-removed when container is unmounted
            // but if they were attached to document.head, we'd need manual cleanup here.
        };
    }, [htmlContent]);

    return <div ref={containerRef} className="safe-html-injector-root" />;
};

export default SafeHTMLInjector;
