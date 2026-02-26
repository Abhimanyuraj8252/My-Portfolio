import React, { useRef, useState, useCallback, useEffect } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
    Send, Loader2, CheckCircle2, X, ArrowLeft, MessageSquare,
    Mail, Phone, MapPin, ExternalLink, Zap, Clock, Shield
} from "lucide-react";
import { FaWhatsapp, FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { Navbar, Footer, StarsCanvas } from "../components";
import API_BASE_URL from "../config";

// ─── Thank You Modal ────────────────────────────────────────────────────────
const ThankYouModal = ({ isOpen, onClose }) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    className="relative bg-gradient-to-br from-[#0d0b1e] to-[#13102a] border border-violet-500/25 p-10 rounded-3xl max-w-sm w-full text-center shadow-[0_0_80px_rgba(139,92,246,0.2)]"
                >
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-600/8 to-cyan-500/4 pointer-events-none" />
                    <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                    <div className="relative z-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                            className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-5"
                        >
                            <CheckCircle2 size={38} className="text-green-400" />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-white mb-2">Message Sent! 🚀</h3>
                        <p className="text-white/50 text-sm mb-7">Thank you for reaching out. I'll get back to you as soon as possible, usually within 24 hours.</p>
                        <button
                            onClick={onClose}
                            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-violet-500/20"
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

// ─── Floating Label Input ───────────────────────────────────────────────────
const FloatingInput = ({ label, as: Tag = "input", required, ...props }) => (
    <div className="relative group">
        <Tag
            required={required}
            {...props}
            placeholder=" "
            className={`peer w-full bg-white/[0.04] border border-white/10 rounded-2xl px-5 pt-6 pb-3 text-white text-sm placeholder-transparent focus:border-violet-500/60 focus:bg-white/[0.06] focus:outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(139,92,246,0.08)] resize-none ${props.className || ""}`}
        />
        <label className="absolute left-5 top-4 text-white/35 text-xs font-medium uppercase tracking-wider transition-all duration-200 peer-placeholder-shown:top-4.5 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2.5 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-violet-400 pointer-events-none">
            {label}{required && " *"}
        </label>
    </div>
);

// ─── Custom Select Dropdown ────────────────────────────────────────────────
const CustomDropdown = ({ label, value, options, onChange, placeholder = "Select an option" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <label className="absolute left-5 top-2.5 z-10 text-violet-400 text-[10px] font-medium uppercase tracking-wider pointer-events-none">
                {label}
            </label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-white/[0.04] border ${isOpen ? 'border-violet-500/60 shadow-[0_0_20px_rgba(139,92,246,0.1)]' : 'border-white/10'} rounded-2xl px-5 pt-7 pb-2.5 text-left text-white text-sm transition-all duration-300 flex items-center justify-between group hover:bg-white/[0.06]`}
            >
                <span className={value ? "text-white" : "text-white/30"}>
                    {value || placeholder}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-white/30 group-hover:text-violet-400 transition-colors"
                >
                    <ArrowLeft size={14} className="-rotate-90" />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute z-[100] left-0 right-0 mt-2 bg-[#13102a] border border-white/10 rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-h-60 overflow-y-auto custom-scrollbar backdrop-blur-xl"
                        data-lenis-prevent
                        onWheel={(e) => e.stopPropagation()}
                    >
                        {options.map((opt) => (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                    onChange(opt);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center gap-3 ${value === opt
                                    ? "bg-violet-600/20 text-violet-300"
                                    : "text-white/60 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                {value === opt && <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.6)]" />}
                                {opt}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── Info Chip ──────────────────────────────────────────────────────────────
const InfoChip = ({ icon: Icon, label, value, href, color }) => (
    <motion.a
        href={href}
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        whileHover={{ scale: 1.02, y: -2 }}
        className="flex items-center gap-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] hover:border-violet-500/30 rounded-2xl p-4 transition-all duration-300 group cursor-pointer"
    >
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
            <Icon size={20} className="text-white" />
        </div>
        <div>
            <p className="text-white/40 text-xs uppercase tracking-widest">{label}</p>
            <p className="text-white font-medium text-sm mt-0.5 group-hover:text-violet-300 transition-colors">{value}</p>
        </div>
        <ExternalLink size={13} className="ml-auto text-white/20 group-hover:text-violet-400 transition-colors" />
    </motion.a>
);

// ─── Main Contact Page ──────────────────────────────────────────────────────
const ContactPage = () => {
    const [form, setForm] = useState({
        name: "", email: "", mobile: "", service: "", budget: "", message: "",
    });
    const [loading, setLoading] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false);
    const [dbServices, setDbServices] = useState([]);
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);

        // Fetch services for dropdown
        fetch(`${API_BASE_URL}/api/services`)
            .then(r => r.ok ? r.json() : [])
            .then(data => setDbServices(data.filter(s => s.status === "Active")))
            .catch(() => { });

        // Fetch contact info
        fetch(`${API_BASE_URL}/api/settings`)
            .then(r => r.ok ? r.json() : null)
            .then(data => setSettings(data))
            .catch(() => { });
    }, []);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleWhatsApp = () => {
        const num = settings?.whatsappNumber?.replace(/\D/g, "") || "919801834437";
        const msg = encodeURIComponent(
            `Hi Abhimanyu! 👋\n\nI'm interested in your services.\n\n📋 *Inquiry Details:*\n• Name: ${form.name || "Not provided"}\n• Email: ${form.email || "Not provided"}\n• Mobile: ${form.mobile || "Not provided"}\n• Service: ${form.service || "Not specified"}\n• Budget: ${form.budget || "Not specified"}\n\n📝 *Message:*\n${form.message || "Please contact me!"}`
        );
        window.open(`https://wa.me/${num}?text=${msg}`, "_blank");
    };

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await fetch(`${API_BASE_URL}/api/contacts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name, email: form.email, mobile: form.mobile,
                    subject: form.service, budget: form.budget || "Not Specified",
                    message: form.message,
                }),
            });

            await fetch("https://formsubmit.co/ajax/novanexusltd001@gmail.com", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({
                    name: form.name, email: form.email, mobile: form.mobile,
                    service: form.service, budget: form.budget, message: form.message,
                    _subject: `New Portfolio Inquiry from ${form.name}`, _template: "table",
                }),
            });

            setLoading(false);
            setShowThankYou(true);
            setForm({ name: "", email: "", mobile: "", service: "", budget: "", message: "" });
        } catch {
            setLoading(false);
            toast.error("Unable to send. Please try WhatsApp instead.");
        }
    }, [form]);

    const whatsappNum = settings?.whatsappNumber || "+91 9801834437";
    const email = settings?.contactEmail || "novanexusltd001@gmail.com";

    return (
        <div className="relative min-h-screen bg-primary overflow-hidden">
            <Navbar />
            <ThankYouModal isOpen={showThankYou} onClose={() => setShowThankYou(false)} />

            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.07, 0.1, 0.07] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-violet-600 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.08, 0.05] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.04, 0.07, 0.04] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
                    className="absolute top-2/3 left-1/3 w-[400px] h-[400px] bg-cyan-600 rounded-full blur-[120px]"
                />
            </div>

            {/* Grid Pattern */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.025]"
                style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
            />

            <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">

                {/* Hero Header */}
                <div className="text-center mb-16">
                    <Link to="/" className="inline-flex items-center gap-2 text-white/35 hover:text-white text-sm mb-8 transition-colors">
                        <ArrowLeft size={15} /> Back to Home
                    </Link>

                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/25 rounded-full px-5 py-2 mb-6">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-violet-300 text-sm font-medium">Available for new projects</span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-5 leading-none tracking-tight">
                            Let's{" "}
                            <span className="relative inline-block">
                                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                                    Create
                                </span>
                                <motion.div
                                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-400 to-cyan-400 origin-left"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 0.8, duration: 0.6 }}
                                />
                            </span>
                            {" "}Something
                            <br />
                            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                                Amazing
                            </span>
                        </h1>
                        <p className="text-white/45 text-lg max-w-xl mx-auto leading-relaxed">
                            Have a project in mind? Let's talk. Fill the form or send a WhatsApp — I respond quickly.
                        </p>
                    </motion.div>

                    {/* Stats Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="flex items-center justify-center gap-8 mt-10"
                    >
                        {[
                            { icon: Zap, label: "Fast Delivery", value: "On Time" },
                            { icon: Clock, label: "Response Time", value: "< 24 Hours" },
                            { icon: Shield, label: "Satisfaction", value: "100% Guaranteed" },
                        ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className="text-center">
                                <div className="flex items-center justify-center gap-1.5 text-violet-400 mb-1">
                                    <Icon size={15} />
                                    <span className="text-white font-bold text-sm">{value}</span>
                                </div>
                                <p className="text-white/30 text-xs">{label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

                    {/* ── LEFT: FORM (3 cols) ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-3"
                    >
                        <div className="relative bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] rounded-3xl p-8 overflow-hidden backdrop-blur-sm">
                            {/* Card glow top */}
                            <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
                            <div className="absolute -top-20 -left-20 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

                            <div className="relative z-10">
                                <h2 className="text-2xl font-bold text-white mb-1">Send a Message</h2>
                                <p className="text-white/40 text-sm mb-8">All fields marked with * are required</p>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Row 1 */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FloatingInput label="Your Name" name="name" value={form.name} onChange={handleChange} required autoComplete="name" />
                                        <FloatingInput label="WhatsApp / Mobile" name="mobile" value={form.mobile} onChange={handleChange} type="tel" autoComplete="tel" />
                                    </div>

                                    {/* Email */}
                                    <FloatingInput label="Email Address" name="email" value={form.email} onChange={handleChange} type="email" required autoComplete="email" />

                                    {/* Service + Budget */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <CustomDropdown
                                            label="Service Needed"
                                            value={form.service}
                                            options={dbServices.length > 0
                                                ? dbServices.map(s => s.title)
                                                : ["Web Development", "WordPress Website", "Shopify Store", "Android App Development", "Backend Development", "UI/UX Design", "Full Stack Development", "SEO Optimization", "Content & Blog Writing", "Bug Fixing & Support", "Website Maintenance", "Other"]
                                            }
                                            onChange={(val) => setForm(prev => ({ ...prev, service: val }))}
                                            placeholder="Select a Service"
                                        />
                                        <FloatingInput label="Budget (Optional)" name="budget" value={form.budget} onChange={handleChange} placeholder=" " />
                                    </div>

                                    {/* Message */}
                                    <FloatingInput label="Your Message" as="textarea" name="message" value={form.message} onChange={handleChange} required rows={5} />

                                    {/* Submit Row */}
                                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="relative group flex-1 flex items-center justify-center gap-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-violet-500/25 overflow-hidden"
                                        >
                                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                            {loading ? <Loader2 size={17} className="animate-spin" /> : <Send size={16} />}
                                            {loading ? "Sending..." : "Send Message"}
                                        </button>

                                        {/* WhatsApp Quick */}
                                        <button
                                            type="button"
                                            onClick={handleWhatsApp}
                                            className="flex items-center justify-center gap-2 bg-green-500/10 border border-green-500/25 hover:bg-green-500/20 hover:border-green-500/40 text-green-400 font-semibold py-4 px-6 rounded-2xl transition-all"
                                        >
                                            <FaWhatsapp size={18} />
                                            <span className="hidden sm:inline">WhatsApp</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>

                    {/* ── RIGHT: INFO (2 cols) ── */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.35 }}
                        className="lg:col-span-2 space-y-4"
                    >
                        {/* Contact Info */}
                        <div className="bg-white/[0.03] border border-white/[0.07] rounded-3xl p-6 overflow-hidden relative">
                            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
                            <h3 className="text-white font-bold text-lg mb-5">Contact Details</h3>
                            <div className="space-y-3">
                                <InfoChip icon={FaWhatsapp} label="WhatsApp" value={whatsappNum} href={`https://wa.me/${whatsappNum.replace(/\D/g, "")}`} color="bg-gradient-to-br from-green-500 to-emerald-600" />
                                <InfoChip icon={Mail} label="Email" value={email} href={`mailto:${email}`} color="bg-gradient-to-br from-violet-500 to-indigo-600" />
                                <InfoChip icon={MapPin} label="Location" value="India / Remote" href="https://www.google.com/maps/place/India" color="bg-gradient-to-br from-cyan-500 to-blue-600" />
                                <InfoChip icon={Phone} label="Call" value={whatsappNum} href={`tel:${whatsappNum}`} color="bg-gradient-to-br from-blue-500 to-indigo-600" />
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="bg-white/[0.03] border border-white/[0.07] rounded-3xl p-6">
                            <h3 className="text-white font-bold text-base mb-4">Find Me Online</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { Icon: FaGithub, href: "https://github.com/Abhimanyuraj8252", label: "GitHub", color: "hover:text-white hover:border-white/40" },
                                    { Icon: FaLinkedin, href: "https://www.linkedin.com/in/abhimanyu-raj-8a853a32a", label: "LinkedIn", color: "hover:text-blue-400 hover:border-blue-500/40" },
                                    { Icon: FaInstagram, href: "https://www.instagram.com/sudo_abhimanyu", label: "Instagram", color: "hover:text-pink-400 hover:border-pink-500/40" },
                                ].map(({ Icon, href, label, color }) => (
                                    <motion.a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        className={`flex flex-col items-center gap-2 p-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl text-white/40 transition-all ${color}`}
                                    >
                                        <Icon size={22} />
                                        <span className="text-[10px] font-medium">{label}</span>
                                    </motion.a>
                                ))}
                            </div>
                        </div>

                        {/* Quick WhatsApp CTA */}
                        <motion.a
                            href={`https://wa.me/${whatsappNum.replace(/\D/g, "")}?text=${encodeURIComponent("Hi Abhimanyu! 👋 I'd like to discuss a project with you.")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-4 bg-gradient-to-r from-green-600/20 to-emerald-600/15 border border-green-500/25 rounded-3xl p-5 hover:border-green-500/40 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-green-500/15 flex items-center justify-center shrink-0 group-hover:bg-green-500/25 transition-colors">
                                <FaWhatsapp size={24} className="text-green-400" />
                            </div>
                            <div>
                                <p className="text-white font-semibold text-sm">Chat on WhatsApp</p>
                                <p className="text-white/40 text-xs mt-0.5">Fastest way to reach me</p>
                            </div>
                            <ExternalLink size={14} className="ml-auto text-white/20 group-hover:text-green-400 transition-colors" />
                        </motion.a>

                        {/* Tagline */}
                        <p className="text-center text-white/20 text-xs py-2">⚡ Usually responds within 24 hours</p>
                    </motion.div>
                </div>
            </main>

            <Footer />
            <StarsCanvas />
        </div>
    );
};

export default ContactPage;
