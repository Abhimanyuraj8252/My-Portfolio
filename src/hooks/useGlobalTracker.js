import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useSWR from 'swr';
import API_BASE_URL from '../config';

const fetcher = (url) => fetch(url).then(res => res.json());

export const useGlobalTracker = () => {
    const location = useLocation();

    const { data, error } = useSWR(`${API_BASE_URL}/api/ui/layout-configs`, fetcher, {
        revalidateOnFocus: false,
        shouldRetryOnError: false // Prevent continuous retries if AdBlocker blocks
    });

    useEffect(() => {
        if (!data || !data.scripts) return;

        data.scripts.forEach(script => {
            if (!script.isActive) return;

            // Anti-Duplication: check if already exists
            const existingScript = document.head.querySelector(`script[data-tracker-id="${script.id}"]`);
            if (existingScript) return;

            if (script.provider === 'GOOGLE_ANALYTICS' && script.trackingId) {
                const gaScript = document.createElement('script');
                gaScript.async = true;
                gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${script.trackingId}`;
                gaScript.setAttribute('data-tracker-id', script.id);
                document.head.appendChild(gaScript);

                const inlineScript = document.createElement('script');
                inlineScript.setAttribute('data-tracker-id', script.id + '_inline');
                inlineScript.innerHTML = `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${script.trackingId}');
                `;
                document.head.appendChild(inlineScript);
            } else if (script.provider === 'META_PIXEL' && script.trackingId) {
                const fbScript = document.createElement('script');
                fbScript.setAttribute('data-tracker-id', script.id);
                fbScript.innerHTML = `
                    !function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '${script.trackingId}');
                    fbq('track', 'PageView');
                `;
                document.head.appendChild(fbScript);
            } else if (script.customScript) {
                // If it's a custom script blob (e.g. TikTok, LinkedIn, Twitter)
                const customWrapper = document.createElement('script');
                customWrapper.setAttribute('data-tracker-id', script.id);
                // Simple regex to extract src if exists, else just inner text
                const srcMatch = script.customScript.match(/src="([^"]+)"/);
                if (srcMatch) {
                    customWrapper.src = srcMatch[1];
                    customWrapper.async = true;
                } else {
                    const contentMatch = script.customScript.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
                    customWrapper.innerHTML = contentMatch;
                }
                document.head.appendChild(customWrapper);
            }
        });
    }, [data]);

    // SPA Routing PageView triggers
    useEffect(() => {
        if (!data || !data.scripts) return;

        const currentPath = location.pathname;

        data.scripts.forEach(script => {
            if (!script.isActive) return;

            if (script.provider === 'GOOGLE_ANALYTICS' && window.gtag) {
                window.gtag('config', script.trackingId, { page_path: currentPath });
            } else if (script.provider === 'META_PIXEL' && window.fbq) {
                window.fbq('track', 'PageView');
            }
            // Add other providers' pageview triggers here as needed
        });
    }, [location.pathname, data]);

    return { configs: data, error };
};
