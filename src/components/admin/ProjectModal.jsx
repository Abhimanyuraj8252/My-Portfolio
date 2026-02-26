import React, { useState, useEffect, useCallback } from 'react';
import { X, UploadCloud, XCircle, Settings, LayoutGrid, Image as ImageIcon } from 'lucide-react';
import { AnimatePresence, m as motion } from 'framer-motion';

const CATEGORIES = ['Web', 'App', 'AI', 'Design'];
const STATUSES = ['Completed', 'InProgress', 'Maintenance'];

const initialForm = {
    title: '',
    slug: '',
    description: '',
    liveUrl: '',
    repoUrl: '',
    thumbnailUrl: '',
    galleryImages: [],
    techStack: [],
    category: CATEGORIES[0],
    status: STATUSES[0],
    isFeatured: false,
    priorityOrder: 0,
};

const ProjectModal = ({ isOpen, onClose, onSave, project = null }) => {
    const [activeTab, setActiveTab] = useState('basic');
    const [formData, setFormData] = useState(initialForm);
    const [techInput, setTechInput] = useState('');

    // Reset or populate form when modal opens
    useEffect(() => {
        if (!isOpen) return;

        setTimeout(() => {
            setFormData(project ? {
                ...initialForm,
                ...project,
                galleryImages: project.galleryImages || [],
                techStack: project.techStack || []
            } : initialForm);
            setActiveTab('basic');
            setTechInput('');
        }, 0);

    }, [isOpen, project]);

    // Handle Input Changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Generate Slug from Title
    const handleTitleBlur = () => {
        if (!formData.slug && formData.title) {
            setFormData(prev => ({
                ...prev,
                slug: prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
            }));
        }
    }

    // --- Tab 3: Tech Stack Logic ---
    const handleTechAdd = (e) => {
        e.preventDefault();
        const trimmed = techInput.trim();
        if (trimmed && !formData.techStack.includes(trimmed)) {
            setFormData((prev) => ({
                ...prev,
                techStack: [...prev.techStack, trimmed],
            }));
            setTechInput('');
        }
    };

    const handleTechRemove = (techToRemove) => {
        setFormData((prev) => ({
            ...prev,
            techStack: prev.techStack.filter((tech) => tech !== techToRemove),
        }));
    };

    // --- Tab 2: Media Logic (Dummy) ---
    const handleFileDrop = useCallback((e, type) => {
        e.preventDefault();
        const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
        if (!files || files.length === 0) return;

        // Simulate file selection for UI purposes (using local URLs)
        if (type === 'thumbnail') {
            const file = files[0];
            const dummyUrl = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, thumbnailUrl: dummyUrl }));
        } else if (type === 'gallery') {
            const newUrls = Array.from(files).map(f => URL.createObjectURL(f));
            setFormData(prev => ({ ...prev, galleryImages: [...prev.galleryImages, ...newUrls] }));
        }
    }, []);

    const removeGalleryImage = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            galleryImages: prev.galleryImages.filter((_, i) => i !== indexToRemove)
        }))
    }

    // --- Submission ---
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xl">
                <motion.div
                    initial={{ opacity: 0, y: 150, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 150, scale: 0.95 }}
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    className="bg-[#0f0f15]/90 w-full max-w-4xl h-[90vh] sm:h-[85vh] sm:rounded-3xl border border-white/10 shadow-[0_0_80px_rgba(168,85,247,0.15)] flex flex-col overflow-hidden relative"
                >
                    {/* Inner ambient glow */}
                    <div className="absolute inset-x-0 -top-40 h-80 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

                    {/* Header */}
                    <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
                        <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-3">
                            <span className="w-2 h-8 rounded-full bg-gradient-to-b from-purple-400 to-pink-500"></span>
                            {project ? 'Edit Project' : 'Add New Project'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors border border-transparent hover:border-white/10"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row flex-1 overflow-hidden relative z-10">
                        {/* Sidebar / Tabs */}
                        <div className="w-full sm:w-64 bg-black/40 border-b sm:border-b-0 sm:border-r border-white/5 p-4 flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible no-scrollbar shrink-0">
                            <TabButton
                                id="basic"
                                icon={LayoutGrid}
                                label="Basic Info"
                                active={activeTab === 'basic'}
                                onClick={() => setActiveTab('basic')}
                            />
                            <TabButton
                                id="media"
                                icon={ImageIcon}
                                label="Media Center"
                                active={activeTab === 'media'}
                                onClick={() => setActiveTab('media')}
                            />
                            <TabButton
                                id="config"
                                icon={Settings}
                                label="Tech & Config"
                                active={activeTab === 'config'}
                                onClick={() => setActiveTab('config')}
                            />
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                            <form id="project-form" onSubmit={handleSubmit} className="space-y-6">

                                {/* TSAB 1: BASIC INFO */}
                                {activeTab === 'basic' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <InputField
                                                label="Project Title"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                onBlur={handleTitleBlur}
                                                placeholder="E.g., Cosmic Dashboard"
                                                required
                                            />
                                            <InputField
                                                label="Slug (Unique)"
                                                name="slug"
                                                value={formData.slug}
                                                onChange={handleChange}
                                                placeholder="cosmic-dashboard"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-white/80">Description</label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                placeholder="Describe the project..."
                                                rows={4}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <InputField
                                                label="Live URL"
                                                name="liveUrl"
                                                value={formData.liveUrl}
                                                onChange={handleChange}
                                                placeholder="https://..."
                                            />
                                            <InputField
                                                label="Repository URL"
                                                name="repoUrl"
                                                value={formData.repoUrl}
                                                onChange={handleChange}
                                                placeholder="https://github.com/..."
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {/* TAB 2: MEDIA CENTER */}
                                {activeTab === 'media' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">

                                        {/* Thumbnail Upload */}
                                        <div className="space-y-3">
                                            <label className="text-sm font-medium text-white/80 flex items-center justify-between">
                                                <span>Primary Thumbnail (16:9)</span>
                                                {formData.thumbnailUrl && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData(p => ({ ...p, thumbnailUrl: '' }))}
                                                        className="text-xs text-red-400 hover:text-red-300"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </label>

                                            {formData.thumbnailUrl ? (
                                                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group">
                                                    <img src={formData.thumbnailUrl} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <span className="text-white text-sm">Thumbnail Set. Remove to re-upload.</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    className="border-2 border-dashed border-white/20 rounded-xl p-10 text-center hover:bg-white/5 hover:border-purple-500/50 transition-colors cursor-pointer group"
                                                    onDragOver={(e) => e.preventDefault()}
                                                    onDrop={(e) => handleFileDrop(e, 'thumbnail')}
                                                    onClick={() => document.getElementById('thumb-upload').click()}
                                                >
                                                    <UploadCloud className="mx-auto h-12 w-12 text-white/40 group-hover:text-purple-400 transition-colors mb-3" />
                                                    <p className="text-sm text-white/60">Drag and drop an image, or click to browse</p>
                                                    <input
                                                        id="thumb-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => handleFileDrop(e, 'thumbnail')}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* Gallery Upload */}
                                        <div className="space-y-3">
                                            <label className="text-sm font-medium text-white/80">Gallery Images</label>
                                            <div
                                                className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:bg-white/5 transition-colors cursor-pointer"
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={(e) => handleFileDrop(e, 'gallery')}
                                                onClick={() => document.getElementById('gallery-upload').click()}
                                            >
                                                <p className="text-sm text-white/60">Upload additional screenshots (+)</p>
                                                <input
                                                    id="gallery-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    className="hidden"
                                                    onChange={(e) => handleFileDrop(e, 'gallery')}
                                                />
                                            </div>

                                            {formData.galleryImages.length > 0 && (
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                                    {formData.galleryImages.map((url, i) => (
                                                        <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-white/10 group">
                                                            <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeGalleryImage(i)}
                                                                className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {/* TAB 3: TECH STACK & CONFIG */}
                                {activeTab === 'config' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-medium text-white/80">Category</label>
                                                <select
                                                    name="category"
                                                    value={formData.category}
                                                    onChange={handleChange}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 appearance-none"
                                                >
                                                    {CATEGORIES.map(cat => (
                                                        <option key={cat} value={cat} className="bg-[#0f0f15]">{cat}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-medium text-white/80">Status</label>
                                                <select
                                                    name="status"
                                                    value={formData.status}
                                                    onChange={handleChange}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 appearance-none"
                                                >
                                                    {STATUSES.map(stat => (
                                                        <option key={stat} value={stat} className="bg-[#0f0f15]">{stat}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Custom Tech Stack Input */}
                                        <div className="space-y-3">
                                            <label className="text-sm font-medium text-white/80">Tech Stack</label>
                                            <div className="p-3 bg-black/40 border border-white/10 rounded-xl focus-within:border-purple-500/50 transition-colors flex flex-wrap gap-2">
                                                {formData.techStack.map(tech => (
                                                    <span key={tech} className="flex items-center gap-1 bg-white/10 text-white px-2.5 py-1 rounded-md text-sm border border-white/5">
                                                        {tech}
                                                        <button type="button" onClick={() => handleTechRemove(tech)} className="text-white/50 hover:text-red-400 transition-colors">
                                                            <XCircle size={14} />
                                                        </button>
                                                    </span>
                                                ))}
                                                <input
                                                    type="text"
                                                    value={techInput}
                                                    onChange={(e) => setTechInput(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleTechAdd(e)}
                                                    placeholder="Type a technology and press enter..."
                                                    className="flex-1 bg-transparent min-w-[200px] text-white placeholder:text-white/30 focus:outline-none text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-white/10">
                                            <label className="flex items-center gap-3 cursor-pointer p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    name="isFeatured"
                                                    checked={formData.isFeatured}
                                                    onChange={handleChange}
                                                    className="w-5 h-5 rounded border-white/20 bg-black/40 text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
                                                />
                                                <div>
                                                    <h4 className="text-white font-medium">Feature on Homepage</h4>
                                                    <p className="text-xs text-white/50">Highlight this project in the hero section.</p>
                                                </div>
                                            </label>

                                            <InputField
                                                label="Priority Order (Number)"
                                                name="priorityOrder"
                                                type="number"
                                                value={formData.priorityOrder}
                                                onChange={handleChange}
                                                placeholder="0"
                                            />
                                        </div>

                                    </motion.div>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-5 border-t border-white/10 bg-black/20 flex flex-col sm:flex-row justify-end gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            form="project-form"
                            type="submit"
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                        >
                            {project ? 'Save Changes' : 'Create Project'}
                        </button>
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    );
};

// --- Subcomponents ---

const TabButton = ({ icon, label, active, onClick }) => {
    const IconItem = icon;
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl transition-all font-medium text-sm whitespace-nowrap
                ${active
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                    : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                }
            `}
        >
            <IconItem size={18} />
            {label}
        </button>
    );
};

const InputField = ({ label, name, value, onChange, onBlur, placeholder, type = 'text', required = false }) => (
    <div className="space-y-1.5">
        <label className="text-sm font-medium text-white/80">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            required={required}
            className="w-full bg-black/20 hover:bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-light tracking-wide shadow-inner"
        />
    </div>
);

export default ProjectModal;
