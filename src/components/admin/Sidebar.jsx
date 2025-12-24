import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase/client";
import { LayoutDashboard, FileText, MessageSquare, Mail, LogOut } from "lucide-react";

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/admin/login");
    };

    return (
        <div className="w-64 h-screen bg-tertiary fixed left-0 top-0 flex flex-col p-6">
            <h2 className="text-white text-2xl font-bold mb-10">Portfolio Admin</h2>

            <nav className="flex flex-col gap-4 flex-1">
                <Link to="/admin/dashboard" className="flex items-center gap-3 text-secondary hover:text-white transition-colors text-lg">
                    <LayoutDashboard size={20} /> Dashboard
                </Link>
                <Link to="/admin/blogs" className="flex items-center gap-3 text-secondary hover:text-white transition-colors text-lg">
                    <FileText size={20} /> Blogs
                </Link>
                <Link to="/admin/testimonials" className="flex items-center gap-3 text-secondary hover:text-white transition-colors text-lg">
                    <MessageSquare size={20} /> Testimonials
                </Link>
                <Link to="/admin/contacts" className="flex items-center gap-3 text-secondary hover:text-white transition-colors text-lg">
                    <Mail size={20} /> Contact Messages
                </Link>
            </nav>

            <button
                onClick={handleLogout}
                className="flex items-center gap-3 text-red-500 hover:text-red-400 transition-colors mt-auto text-lg"
            >
                <LogOut size={20} /> Logout
            </button>
        </div>
    );
};

export default Sidebar;
