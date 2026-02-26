import React, { useState, useEffect } from 'react';
import { Menu, Plus, Save, Trash, X, Activity } from 'lucide-react';
import Sidebar from '../../components/admin/Sidebar';
import API_BASE_URL from '../../config';

const TagAndAdManager = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('scripts'); // 'scripts' or 'ads'

    const [scripts, setScripts] = useState([]);
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            const [scriptsRes, adsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/system/scripts`, { headers }),
                fetch(`${API_BASE_URL}/api/layout/dynamic-blocks`, { headers })
            ]);

            if (scriptsRes.ok) setScripts(await scriptsRes.json());
            if (adsRes.ok) setAds(await adsRes.json());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddScript = () => {
        setScripts([{ id: 'new_' + Date.now(), isNew: true, provider: 'GOOGLE_ANALYTICS', trackingId: '', customScript: '', isActive: true }, ...scripts]);
    };

    const handleAddAd = () => {
        setAds([{ blockId: 'new_' + Date.now(), isNew: true, zone: 'HEADER', sourceType: 'GOOGLE_ADS', renderContent: '', pageRoute: '*', isActive: true }, ...ads]);
    };

    const handleSaveScript = async (script) => {
        const token = localStorage.getItem('token');
        const method = script.isNew ? 'POST' : 'PUT';
        const url = script.isNew ? `${API_BASE_URL}/api/system/scripts` : `${API_BASE_URL}/api/system/scripts/${script.id}`;

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(script)
            });
            if (res.ok) fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveAd = async (ad) => {
        const token = localStorage.getItem('token');
        const method = ad.isNew ? 'POST' : 'PUT';
        const url = ad.isNew ? `${API_BASE_URL}/api/layout/dynamic-blocks` : `${API_BASE_URL}/api/layout/dynamic-blocks/${ad.blockId}`;

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(ad)
            });
            if (res.ok) fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteScript = async (id) => {
        if (id.toString().startsWith('new_')) {
            setScripts(scripts.filter(s => s.id !== id));
            return;
        }
        const token = localStorage.getItem('token');
        try {
            await fetch(`${API_BASE_URL}/api/system/scripts/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            fetchData();
        } catch (err) { }
    };

    const handleDeleteAd = async (blockId) => {
        if (blockId.toString().startsWith('new_')) {
            setAds(ads.filter(a => a.blockId !== blockId));
            return;
        }
        const token = localStorage.getItem('token');
        try {
            await fetch(`${API_BASE_URL}/api/layout/dynamic-blocks/${blockId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            fetchData();
        } catch (err) { }
    };

    // Live Preview Dispatcher
    const handlePreviewAd = (ad) => {
        window.postMessage({ type: 'WIDGET_PREVIEW', zone: ad.zone, widget: { ...ad, renderContent: ad.renderContent } }, '*');
    };
    const handleClearPreview = (ad) => {
        window.postMessage({ type: 'WIDGET_PREVIEW_CLEAR', zone: ad.zone }, '*');
    };

    return (
        <div className="h-screen bg-[#0f1115] text-gray-200 font-sans flex overflow-hidden">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col h-screen overflow-hidden relative md:ml-64">
                <div className="md:hidden flex items-center justify-between p-4 bg-black/40 backdrop-blur-md border-b border-white/10 z-20">
                    <h1 className="text-xl font-bold text-white">Tags & Ads</h1>
                    <button onClick={() => setSidebarOpen(true)} className="p-2 bg-white/5 rounded-lg text-white">
                        <Menu size={20} />
                    </button>
                </div>

                <div className="p-4 md:p-8 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                                    <Activity className="text-indigo-400" />
                                    Tag & Ad Manager
                                </h1>
                                <p className="text-gray-400 mt-1">Manage external analytics scripts and ad slots</p>
                            </div>
                        </div>

                        <div className="flex gap-4 mb-6 border-b border-white/10">
                            <button
                                onClick={() => setActiveTab('scripts')}
                                className={`pb-3 px-2 font-medium transition-colors ${activeTab === 'scripts' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                Tracking Scripts
                            </button>
                            <button
                                onClick={() => setActiveTab('ads')}
                                className={`pb-3 px-2 font-medium transition-colors ${activeTab === 'ads' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                Ad Slots
                            </button>
                        </div>

                        {loading ? (
                            <div className="text-center py-10 text-gray-500">Loading...</div>
                        ) : activeTab === 'scripts' ? (
                            <div className="space-y-4">
                                <button onClick={handleAddScript} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm mb-4">
                                    <Plus size={16} /> Add Script
                                </button>
                                {scripts.map(script => (
                                    <div key={script.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col md:flex-row gap-4">
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-400 mb-1">Provider</label>
                                                <select
                                                    value={script.provider}
                                                    onChange={(e) => setScripts(scripts.map(s => s.id === script.id ? { ...s, provider: e.target.value } : s))}
                                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                                >
                                                    <option value="GOOGLE_ANALYTICS" className="bg-[#1a1d2e] text-white">Google Analytics</option>
                                                    <option value="META_PIXEL" className="bg-[#1a1d2e] text-white">Meta Pixel</option>
                                                    <option value="TIKTOK_PIXEL" className="bg-[#1a1d2e] text-white">TikTok Pixel</option>
                                                    <option value="LINKEDIN_INSIGHT" className="bg-[#1a1d2e] text-white">LinkedIn Insight</option>
                                                    <option value="TWITTER_PIXEL" className="bg-[#1a1d2e] text-white">Twitter Pixel</option>
                                                    <option value="CUSTOM" className="bg-[#1a1d2e] text-white">Custom Script</option>
                                                </select>
                                            </div>
                                            {script.provider !== 'CUSTOM' ? (
                                                <div>
                                                    <label className="block text-xs text-gray-400 mb-1">Tracking ID</label>
                                                    <input
                                                        type="text"
                                                        value={script.trackingId || ''}
                                                        onChange={(e) => setScripts(scripts.map(s => s.id === script.id ? { ...s, trackingId: e.target.value } : s))}
                                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                                                        placeholder="G-XXXX / Pixel ID"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs text-gray-400 mb-1">Custom JS (includes &lt;script&gt; tags)</label>
                                                    <textarea
                                                        value={script.customScript || ''}
                                                        onChange={(e) => setScripts(scripts.map(s => s.id === script.id ? { ...s, customScript: e.target.value } : s))}
                                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white h-24 font-mono"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-row md:flex-col gap-2 justify-end">
                                            <button onClick={() => setScripts(scripts.map(s => s.id === script.id ? { ...s, isActive: !s.isActive } : s))} className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${script.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                                                {script.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                            <button onClick={() => handleSaveScript(script)} className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs transition-colors">
                                                <Save size={14} /> Save
                                            </button>
                                            <button onClick={() => handleDeleteScript(script.id)} className="flex items-center gap-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3 py-1.5 rounded-lg text-xs transition-colors">
                                                <Trash size={14} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <button onClick={handleAddAd} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm mb-4">
                                    <Plus size={16} /> Add Ad Slot
                                </button>
                                {ads.map(ad => (
                                    <div key={ad.blockId} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col md:flex-row gap-4">
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-400 mb-1">Slot Name</label>
                                                <select
                                                    value={ad.zone}
                                                    onChange={(e) => setAds(ads.map(a => a.blockId === ad.blockId ? { ...a, zone: e.target.value } : a))}
                                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                                >
                                                    <option value="HEADER" className="bg-[#1a1d2e] text-white">HEADER</option>
                                                    <option value="FOOTER" className="bg-[#1a1d2e] text-white">FOOTER</option>
                                                    <option value="SIDEBAR" className="bg-[#1a1d2e] text-white">SIDEBAR</option>
                                                    <option value="IN_CONTENT" className="bg-[#1a1d2e] text-white">IN_CONTENT</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-400 mb-1">Provider</label>
                                                <select
                                                    value={ad.sourceType}
                                                    onChange={(e) => setAds(ads.map(a => a.blockId === ad.blockId ? { ...a, sourceType: e.target.value } : a))}
                                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                                >
                                                    <option value="GOOGLE_ADS" className="bg-[#1a1d2e] text-white">Google Ads</option>
                                                    <option value="FACEBOOK_AUDIENCE_NETWORK" className="bg-[#1a1d2e] text-white">Facebook Audience Network</option>
                                                    <option value="AMAZON_PUBLISHER_SERVICES" className="bg-[#1a1d2e] text-white">Amazon Publisher Services</option>
                                                    <option value="MEDIA_NET" className="bg-[#1a1d2e] text-white">Media.net</option>
                                                    <option value="CUSTOM" className="bg-[#1a1d2e] text-white">Custom</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-400 mb-1 flex justify-between">
                                                    <span>Page Route</span>
                                                    {ad.pageRoute === '*' && <span className="text-indigo-400 text-[10px]">Global</span>}
                                                </label>
                                                <select
                                                    value={ad.pageRoute}
                                                    onChange={(e) => setAds(ads.map(a => a.blockId === ad.blockId ? { ...a, pageRoute: e.target.value } : a))}
                                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                                >
                                                    <option value="*" className="bg-[#1a1d2e] text-white font-bold text-indigo-300">Global (All Pages)</option>
                                                    <option value="/" className="bg-[#1a1d2e] text-white">Homepage (/)</option>
                                                    <option value="/blog" className="bg-[#1a1d2e] text-white">Blog List (/blog)</option>
                                                    <option value="/services" className="bg-[#1a1d2e] text-white">Services (/services)</option>
                                                    <option value="/testimonials" className="bg-[#1a1d2e] text-white">Testimonials (/testimonials)</option>
                                                    <option value="/contact" className="bg-[#1a1d2e] text-white">Contact (/contact)</option>
                                                    <option value="/blog/[slug]" className="bg-[#1a1d2e] text-white">Blog Post Details</option>
                                                </select>
                                            </div>
                                            <div className="md:col-span-3">
                                                <label className="block text-xs text-gray-400 mb-1">Ad Code (HTML/JS)</label>
                                                <textarea
                                                    value={ad.renderContent}
                                                    onChange={(e) => setAds(ads.map(a => a.blockId === ad.blockId ? { ...a, renderContent: e.target.value } : a))}
                                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white h-24 font-mono"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-row md:flex-col gap-2 justify-end">
                                            <button onClick={() => setAds(ads.map(a => a.blockId === ad.blockId ? { ...a, isActive: !a.isActive } : a))} className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${ad.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                                                {ad.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                            <button onClick={() => handlePreviewAd(ad)} className="flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 px-3 py-1.5 rounded-lg text-xs transition-colors">
                                                Preview
                                            </button>
                                            <button onClick={() => handleClearPreview(ad)} className="flex items-center gap-1 bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 px-3 py-1.5 rounded-lg text-xs transition-colors">
                                                Clear Prev
                                            </button>
                                            <button onClick={() => handleSaveAd(ad)} className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs transition-colors">
                                                <Save size={14} /> Save
                                            </button>
                                            <button onClick={() => handleDeleteAd(ad.blockId)} className="flex items-center gap-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3 py-1.5 rounded-lg text-xs transition-colors">
                                                <Trash size={14} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TagAndAdManager;
