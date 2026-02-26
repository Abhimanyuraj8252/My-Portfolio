import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { m as motion } from "framer-motion";
import { ArrowRight, Clock, IndianRupee, CheckCircle2, Package, Code, Globe, Smartphone, Palette, Database, Bot, Layers, Shield, Zap, ArrowLeft, Loader2 } from "lucide-react";
import { Navbar, Footer, StarsCanvas } from "../components";
import API_BASE_URL from "../config";

const ICON_MAP = { Code, Globe, Smartphone, Palette, Database, Bot, Layers, Shield, Zap, Package };

const ServiceIcon = ({ name, size = 28, className = "" }) => {
    const Icon = ICON_MAP[name] || Package;
    return <Icon size={size} className={className} />;
};

// Static fallback if DB has no services
const FALLBACK_SERVICES = [
    { id: "1", title: "Web Development", icon: "Globe", description: "Full-stack web development with React, Node.js and modern technologies.", price: 15000, deliveryTime: "7-14 days", features: ["Responsive Design", "SEO Optimized", "Fast Loading", "Custom Design"] },
    { id: "2", title: "Mobile App Development", icon: "Smartphone", description: "Cross-platform Android applications built with Kotlin & modern tools.", price: 20000, deliveryTime: "14-21 days", features: ["Native Performance", "Kotlin & XML", "Material Design", "Play Store Ready"] },
    { id: "3", title: "Backend Development", icon: "Database", description: "Scalable REST APIs, databases and server-side architecture.", price: 12000, deliveryTime: "5-10 days", features: ["REST APIs", "Database Design", "Auth & Security", "Deployment"] },
    { id: "4", title: "UI/UX Design", icon: "Palette", description: "Beautiful, intuitive designs tailored to your brand and audience.", price: 8000, deliveryTime: "3-7 days", features: ["Wireframing", "Figma Designs", "Brand Identity", "Responsive UI"] },
];

const ServiceCard = ({ service, index }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            onClick={() => navigate(`/services/${service.id}`, { state: { from: '/services' } })}
            className="group relative bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] rounded-2xl p-6 cursor-pointer hover:border-violet-500/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(139,92,246,0.12)] hover:-translate-y-1"
        >
            {/* Glow top */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />

            {/* Icon */}
            <div className="w-14 h-14 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-5 group-hover:bg-violet-500/20 transition-colors">
                <ServiceIcon name={service.icon} size={26} className="text-violet-400" />
            </div>

            <h3 className="text-white font-bold text-xl mb-2 group-hover:text-violet-300 transition-colors">{service.title}</h3>
            <p className="text-white/50 text-sm leading-relaxed mb-5 line-clamp-2">{service.description}</p>

            {/* Features preview */}
            {service.features?.length > 0 && (
                <ul className="space-y-1.5 mb-5">
                    {service.features.slice(0, 3).map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-white/60">
                            <CheckCircle2 size={12} className="text-violet-400 shrink-0" />
                            {f}
                        </li>
                    ))}
                    {service.features.length > 3 && (
                        <li className="text-xs text-violet-400/70">+{service.features.length - 3} more...</li>
                    )}
                </ul>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div>
                    {service.price > 0 && (
                        <div className="flex items-center gap-1 text-violet-300 font-bold text-lg">
                            <IndianRupee size={14} />
                            {Number(service.price).toLocaleString("en-IN")}
                        </div>
                    )}
                    {service.deliveryTime && (
                        <div className="flex items-center gap-1 text-white/35 text-xs mt-0.5">
                            <Clock size={10} /> {service.deliveryTime}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-1 text-violet-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    View Details <ArrowRight size={14} />
                </div>
            </div>
        </motion.div>
    );
};

const ServicesPage = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetch_ = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/services`);
                if (res.ok) {
                    const data = await res.json();
                    const active = data.filter(s => s.status === "Active");
                    setServices(active.length > 0 ? active : FALLBACK_SERVICES);
                } else {
                    setServices(FALLBACK_SERVICES);
                }
            } catch {
                setServices(FALLBACK_SERVICES);
            } finally {
                setLoading(false);
            }
        };
        fetch_();
    }, []);

    return (
        <div className="relative min-h-screen bg-primary overflow-hidden">
            <Navbar />

            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-indigo-600/8 rounded-full blur-3xl" />
            </div>

            <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                    <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">What I Offer</p>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
                        My{" "}
                        <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Services</span>
                    </h1>
                    <p className="text-white/45 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        From stunning websites to powerful mobile apps — I deliver high-quality digital solutions tailored to your goals.
                    </p>
                    <div className="mt-8 flex items-center justify-center">
                        <Link
                            to="/#contact"
                            onClick={() => setTimeout(() => { const el = document.getElementById("contact"); if (el) el.scrollIntoView({ behavior: "smooth" }); }, 300)}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-3 px-7 rounded-xl transition-all shadow-lg shadow-violet-500/20"
                        >
                            Get a Free Quote <ArrowRight size={16} />
                        </Link>
                    </div>
                </motion.div>

                {/* Services Grid */}
                {loading ? (
                    <div className="flex justify-center py-24">
                        <Loader2 size={36} className="text-violet-400 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service, i) => (
                            <ServiceCard key={service.id} service={service} index={i} />
                        ))}
                    </div>
                )}

                {/* CTA at bottom */}
                {!loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mt-20 text-center relative bg-gradient-to-br from-violet-600/10 to-indigo-600/5 border border-violet-500/20 rounded-2xl p-10"
                    >
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Don't see what you need?</h2>
                        <p className="text-white/50 mb-6 text-sm">I'm flexible and can build custom solutions for your unique requirements.</p>
                        <Link
                            to="/#contact"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-lg shadow-violet-500/20"
                        >
                            Contact Me <ArrowRight size={16} />
                        </Link>
                    </motion.div>
                )}
            </main>

            <Footer />
            <StarsCanvas />
        </div>
    );
};

export default ServicesPage;
