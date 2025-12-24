import React, { useState } from "react";
import { supabase } from "../../lib/supabase/client";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert(error.message);
        } else {
            navigate("/admin/dashboard");
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center h-screen bg-primary">
            <div className="bg-tertiary p-8 rounded-2xl shadow-card w-[400px]">
                <h2 className="text-white text-3xl font-bold mb-6 text-center">Admin Login</h2>
                <form onSubmit={handleLogin} className="flex flex-col gap-6">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-black-100 py-4 px-6 rounded-lg text-white outline-none border-none font-medium"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-black-100 py-4 px-6 rounded-lg text-white outline-none border-none font-medium"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-violet-600 py-3 rounded-lg text-white font-bold hover:bg-violet-700 transition-colors"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
