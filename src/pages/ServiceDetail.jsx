import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { m as motion } from "framer-motion";
import { ArrowLeft, Clock, IndianRupee, CheckCircle2, Package, Code, Globe, Smartphone, Palette, Database, Bot, Layers, Shield, Zap, ArrowRight, Loader2, Star } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Navbar, Footer, StarsCanvas } from "../components";
import API_BASE_URL from "../config";

const WA_NUMBER = "919801834437"; // WhatsApp number without + or spaces

const ICON_MAP = { Code, Globe, Smartphone, Palette, Database, Bot, Layers, Shield, Zap, Package };
const ServiceIcon = ({ name, size = 28, className = "" }) => {
    const Icon = ICON_MAP[name] || Package;
    return <Icon size={size} className={className} />;
};

const FALLBACK_SERVICES = [
    { id: "1", title: "Web Development", icon: "Globe", description: "Full-stack web development with React, Node.js and modern technologies. I build fast, responsive, and SEO-friendly websites that help your business grow online.", price: 15000, deliveryTime: "7-14 days", features: ["Responsive Design", "SEO Optimized", "Fast Loading", "Custom Design", "CMS Integration", "Contact Forms"] },
    { id: "2", title: "Mobile App Development", icon: "Smartphone", description: "Cross-platform Android applications built with Kotlin & modern tools for high performance.", price: 20000, deliveryTime: "14-21 days", features: ["Native Performance", "Kotlin & XML", "Material Design", "Play Store Ready", "Push Notifications", "Offline Support"] },
    { id: "3", title: "Backend Development", icon: "Database", description: "Scalable REST APIs, databases and server-side architecture for your applications.", price: 12000, deliveryTime: "5-10 days", features: ["REST APIs", "Database Design", "Auth & Security", "Deployment", "Documentation", "Performance Optimization"] },
    { id: "4", title: "UI/UX Design", icon: "Palette", description: "Beautiful, intuitive designs tailored to your brand and audience.", price: 8000, deliveryTime: "3-7 days", features: ["Wireframing", "Figma Designs", "Brand Identity", "Responsive UI", "User Research", "Prototype"] },
];

const ServiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [service, setService] = useState(null);
    const [allServices, setAllServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        const loadData = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/services`);
                if (res.ok) {
                    const data = await res.json();
                    const active = data.filter(s => s.status === "Active");
                    const list = active.length > 0 ? active : FALLBACK_SERVICES;
                    setAllServices(list);
                    const found = list.find(s => s.id === id);
                    if (found) {
                        setService(found);
                    } else {
                        // Try fallback too
                        const fallback = FALLBACK_SERVICES.find(s => s.id === id);
                        setService(fallback || null);
                    }
                } else {
                    setAllServices(FALLBACK_SERVICES);
                    setService(FALLBACK_SERVICES.find(s => s.id === id) || null);
                }
            } catch {
                setAllServices(FALLBACK_SERVICES);
                setService(FALLBACK_SERVICES.find(s => s.id === id) || null);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center">
                <Loader2 size={40} className="text-violet-400 animate-spin" />
            </div>
        );
    }

    if (!service) {
        return (
            <div className="min-h-screen bg-primary flex flex-col items-center justify-center gap-4">
                <Navbar />
                <p className="text-white text-xl">Service not found.</p>
                <button onClick={() => navigate("/services")} className="text-violet-400 hover:underline flex items-center gap-2">
                    <ArrowLeft size={16} /> Back to Services
                </button>
            </div>
        );
    }

    const others = allServices.filter(s => s.id !== id).slice(0, 3);

    // Build WhatsApp message with all service details
    const handleWhatsApp = () => {
        const features = service.features?.filter(Boolean).join(", ") || "—";
        const price = service.price > 0 ? `₹${Number(service.price).toLocaleString("en-IN")} onwards` : "Custom Quote";
        const msg = encodeURIComponent(
            `Hi Abhimanyu! 👋\n\nI'm interested in your *${service.title}* service.\n\n📋 *Service Details:*\n• Service: ${service.title}\n• Starting Price: ${price}\n• Delivery Time: ${service.deliveryTime || "—"}\n• Includes: ${features}\n\nPlease let me know the next steps. I'd love to discuss my requirements with you! 🚀`
        );
        window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
    };

    const backUrl = location.state?.from || "/services";
    const backText = location.state?.from === '/' ? "Back to Home" : "All Services";

    return (
        <div className="relative min-h-screen bg-primary overflow-hidden">
            <Navbar />

            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-0 w-96 h-96 bg-violet-600/8 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-0 w-64 h-64 bg-indigo-600/6 rounded-full blur-3xl" />
            </div>

            <main className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
                {/* Back button */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                    <button onClick={() => navigate(backUrl)} className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-10 transition-colors">
                        <ArrowLeft size={16} /> {backText}
                    </button>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT: Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            {/* Header */}
                            <div className="flex items-start gap-5 mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/25 flex items-center justify-center flex-shrink-0">
                                    <ServiceIcon name={service.icon} size={30} className="text-violet-400" />
                                </div>
                                <div>
                                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{service.title}</h1>
                                    {service.deliveryTime && (
                                        <div className="flex items-center gap-2 text-white/40 text-sm">
                                            <Clock size={14} /> Delivery: {service.deliveryTime}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 mb-6">
                                <h2 className="text-white font-semibold text-lg mb-3">About This Service</h2>
                                <p className="text-white/60 leading-relaxed text-base">{service.description}</p>
                            </div>

                            {/* Features */}
                            {service.features?.filter(Boolean).length > 0 && (
                                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                                    <h2 className="text-white font-semibold text-lg mb-5">What's Included</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {service.features.filter(Boolean).map((f, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 + i * 0.05 }}
                                                className="flex items-center gap-3 bg-violet-500/5 border border-violet-500/15 rounded-xl px-4 py-3"
                                            >
                                                <CheckCircle2 size={16} className="text-violet-400 shrink-0" />
                                                <span className="text-white/75 text-sm">{f}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* RIGHT: Pricing & CTA Sidebar */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="sticky top-28 space-y-4"
                        >
                            {/* Price Card */}
                            <div className="relative bg-gradient-to-br from-violet-600/15 to-indigo-600/10 border border-violet-500/25 rounded-2xl p-6 overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl" />

                                <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Starting From</p>
                                {service.price > 0 ? (
                                    <div className="flex items-start gap-1 mb-1">
                                        <IndianRupee size={24} className="text-violet-300 mt-1" />
                                        <span className="text-4xl font-bold text-white">{Number(service.price).toLocaleString("en-IN")}</span>
                                    </div>
                                ) : (
                                    <p className="text-2xl font-bold text-white mb-1">Contact for Quote</p>
                                )}
                                {service.deliveryTime && (
                                    <p className="text-white/40 text-xs mb-5 flex items-center gap-1"><Clock size={11} /> Delivered in {service.deliveryTime}</p>
                                )}

                                <button
                                    onClick={handleWhatsApp}
                                    className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-green-500/20 mb-3 group"
                                >
                                    <FaWhatsapp size={19} className="group-hover:scale-110 transition-transform" />
                                    Get Started on WhatsApp
                                </button>
                                <Link
                                    to="/services"
                                    className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-medium py-3 px-6 rounded-xl transition-all text-sm"
                                >
                                    <ArrowLeft size={14} /> All Services
                                </Link>
                            </div>

                            {/* Why Me */}
                            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
                                <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Star size={15} className="text-amber-400" /> Why Choose Me</h3>
                                <ul className="space-y-2.5 text-sm text-white/55">
                                    {["Clean & scalable code", "On-time delivery", "Free revisions included", "24/7 communication", "Support after delivery"].map((p, i) => (
                                        <li key={i} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />{p}</li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Other Services */}
                {others.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-16"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Other Services</h2>
                            <Link to="/services" className="text-violet-400 hover:text-violet-300 text-sm flex items-center gap-1 transition-colors">
                                View All <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {others.map((s) => (
                                <div
                                    key={s.id}
                                    onClick={() => { navigate(`/services/${s.id}`, { state: location.state }); window.scrollTo(0, 0); }}
                                    className="group bg-white/[0.03] border border-white/[0.06] hover:border-violet-500/30 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-0.5"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center mb-3 group-hover:bg-violet-500/20 transition-colors">
                                        <ServiceIcon name={s.icon} size={20} className="text-violet-400" />
                                    </div>
                                    <h4 className="text-white font-semibold text-sm mb-1 group-hover:text-violet-300 transition-colors">{s.title}</h4>
                                    <p className="text-white/40 text-xs line-clamp-2">{s.description}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </main>

            <Footer />
            <StarsCanvas />
        </div>
    );
};

export default ServiceDetail;
