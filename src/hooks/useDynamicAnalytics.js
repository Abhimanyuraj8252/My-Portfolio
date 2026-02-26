import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const GA_URL = 'https://www.googletagmanager.com/gtag/js';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useDynamicAnalytics = () => {
    const location = useLocation();
    const [scripts, setScripts] = useState([]);

    useEffect(() => {
        const fetchScripts = async () => {
            try {
                const response = await fetch(`${API_URL}/api/system/scripts`);
                if (!response.ok) throw new Error('Failed to fetch tags');
                const data = await response.json();

                const activeScripts = data.filter(s => s.isActive);
                setScripts(activeScripts);

                activeScripts.forEach(script => {
                    if (script.provider === 'GOOGLE_ANALYTICS' && script.trackingId) {
                        if (!document.querySelector(`script[src*="${script.trackingId}"]`)) {
                            const gaBase = document.createElement('script');
                            gaBase.async = true;
                            gaBase.src = `${GA_URL}?id=${script.trackingId}`;
                            document.head.appendChild(gaBase);

                            if (!window.dataLayer) {
                                window.dataLayer = window.dataLayer || [];
                                window.gtag = function () { window.dataLayer.push(arguments); };
                                window.gtag('js', new Date());
                            }
                            window.gtag('config', script.trackingId, { send_page_view: false });
                        }
                    } else if (script.provider === 'META_PIXEL' && script.trackingId) {
                        if (!document.querySelector(`script[id="meta-pixel-${script.trackingId}"]`)) {
                            const inlineScript = document.createElement('script');
                            inlineScript.id = `meta-pixel-${script.trackingId}`;
                            inlineScript.innerHTML = `
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
                            document.head.appendChild(inlineScript);
                        }
                    } else if (script.provider === 'TIKTOK_PIXEL' && script.trackingId) {
                        if (!document.querySelector(`script[id="tiktok-pixel-${script.trackingId}"]`)) {
                            const inlineScript = document.createElement('script');
                            inlineScript.id = `tiktok-pixel-${script.trackingId}`;
                            inlineScript.innerHTML = `
                                !function (w, d, t) {
                                  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                                  ttq.load('${script.trackingId}');
                                  ttq.page();
                                }(window, document, 'ttq');
                            `;
                            document.head.appendChild(inlineScript);
                        }
                    } else if (script.provider === 'LINKEDIN_INSIGHT' && script.trackingId) {
                        if (!document.querySelector(`script[id="linkedin-insight-${script.trackingId}"]`)) {
                            const inlineScript = document.createElement('script');
                            inlineScript.id = `linkedin-insight-${script.trackingId}`;
                            inlineScript.innerHTML = `
                                _linkedin_partner_id = "${script.trackingId}";
                                window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
                                window._linkedin_data_partner_ids.push(_linkedin_partner_id);
                                (function(l) {
                                if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
                                window.lintrk.q=[]}
                                var s = document.getElementsByTagName("script")[0];
                                var b = document.createElement("script");
                                b.type = "text/javascript";b.async = true;
                                b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
                                s.parentNode.insertBefore(b, s);})(window.lintrk);
                            `;
                            document.head.appendChild(inlineScript);
                        }
                    } else if (script.provider === 'TWITTER_PIXEL' && script.trackingId) {
                        if (!document.querySelector(`script[id="twitter-pixel-${script.trackingId}"]`)) {
                            const inlineScript = document.createElement('script');
                            inlineScript.id = `twitter-pixel-${script.trackingId}`;
                            inlineScript.innerHTML = `
                                !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
                                },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
                                a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
                                twq('config','${script.trackingId}');
                            `;
                            document.head.appendChild(inlineScript);
                        }
                    } else if (script.provider === 'CUSTOM' && script.customScript) {
                        const customHost = document.createElement('div');
                        customHost.innerHTML = script.customScript;
                        Array.from(customHost.querySelectorAll('script')).forEach((s, idx) => {
                            const uniqueId = `custom-script-${script.id}-${idx}`;
                            if (!document.querySelector(`script[data-custom-id="${uniqueId}"]`)) {
                                const newScript = document.createElement('script');
                                newScript.setAttribute('data-custom-id', uniqueId);
                                if (s.src) newScript.src = s.src;
                                if (s.async) newScript.async = true;
                                newScript.innerHTML = s.innerHTML;
                                document.head.appendChild(newScript);
                            }
                        });
                    }
                });
            } catch (error) {
                console.error('Analytics Injector Error:', error);
            }
        };

        fetchScripts();
    }, []);

    useEffect(() => {
        if (!scripts.length) return;

        scripts.forEach(script => {
            if (script.provider === 'GOOGLE_ANALYTICS' && window.gtag) {
                window.gtag('config', script.trackingId, {
                    page_path: location.pathname + location.search
                });
            } else if (script.provider === 'META_PIXEL' && window.fbq) {
                window.fbq('track', 'PageView');
            } else if (script.provider === 'TIKTOK_PIXEL' && window.ttq) {
                window.ttq.page();
            } else if (script.provider === 'TWITTER_PIXEL' && window.twq) {
                window.twq('event', 'tw-ojeix-ojeix'); // Generic pageview standard
            }
        });
    }, [location, scripts]);
};

export default useDynamicAnalytics;
