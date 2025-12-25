import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase/client";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, Eye, EyeOff, AlertTriangle } from "lucide-react";

// Rate limiting config
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

const Login = () => {
    const [step, setStep] = useState(1); // 1 = Access Key, 2 = Login
    const [accessKey, setAccessKey] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checkingKey, setCheckingKey] = useState(false);
    const [error, setError] = useState("");
    const [attempts, setAttempts] = useState(0);
    const [lockoutUntil, setLockoutUntil] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const navigate = useNavigate();

    // Check for existing lockout on mount
    useEffect(() => {
        const storedLockout = localStorage.getItem('admin_lockout');
        const storedAttempts = localStorage.getItem('admin_attempts');

        if (storedLockout) {
            const lockoutTime = parseInt(storedLockout);
            if (Date.now() < lockoutTime) {
                setLockoutUntil(lockoutTime);
            } else {
                localStorage.removeItem('admin_lockout');
                localStorage.removeItem('admin_attempts');
            }
        }

        if (storedAttempts) {
            setAttempts(parseInt(storedAttempts));
        }
    }, []);

    // Countdown timer for lockout
    useEffect(() => {
        if (!lockoutUntil) return;

        const interval = setInterval(() => {
            const remaining = lockoutUntil - Date.now();
            if (remaining <= 0) {
                setLockoutUntil(null);
                setAttempts(0);
                localStorage.removeItem('admin_lockout');
                localStorage.removeItem('admin_attempts');
                setTimeRemaining(0);
            } else {
                setTimeRemaining(Math.ceil(remaining / 1000));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [lockoutUntil]);

    const handleFailedAttempt = () => {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        localStorage.setItem('admin_attempts', newAttempts.toString());

        if (newAttempts >= MAX_ATTEMPTS) {
            const lockout = Date.now() + LOCKOUT_DURATION;
            setLockoutUntil(lockout);
            localStorage.setItem('admin_lockout', lockout.toString());
            setError(`Too many failed attempts! Locked out for 15 minutes.`);
        }
    };

    // Verify access key from Supabase database
    const verifyAccessKey = async (key) => {
        try {
            const { data, error } = await supabase
                .from('admin_settings')
                .select('value')
                .eq('key', 'secret_access_key')
                .single();

            if (error) {
                // If table doesn't exist or no key found, use fallback
                console.log('Using fallback key verification');
                return key === "Abhimanyu#98018"; // Fallback key
            }

            return data?.value === key;
        } catch (err) {
            console.error('Error verifying key:', err);
            return key === "Abhimanyu#98018"; // Fallback key
        }
    };

    const handleAccessKeySubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (lockoutUntil) {
            setError("Account locked. Please wait.");
            return;
        }

        setCheckingKey(true);
        const isValid = await verifyAccessKey(accessKey);
        setCheckingKey(false);

        if (isValid) {
            setStep(2);
            setAccessKey("");
            setAttempts(0);
            localStorage.removeItem('admin_attempts');
        } else {
            handleFailedAttempt();
            setError("Invalid access key!");
            setAccessKey("");
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (lockoutUntil) {
            setError("Account locked. Please wait.");
            return;
        }

        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Invalid email format");
            return;
        }

        setLoading(true);

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            });

            if (authError) {
                handleFailedAttempt();
                setError("Invalid credentials!");
            } else {
                localStorage.removeItem('admin_attempts');
                localStorage.removeItem('admin_lockout');
                navigate("/x7k9m2p4q/dashboard");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        }

        setLoading(false);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Lockout screen
    if (lockoutUntil && Date.now() < lockoutUntil) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-primary p-4">
                <div className="bg-tertiary p-8 rounded-2xl shadow-card w-full max-w-[400px] text-center">
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle size={40} className="text-red-500" />
                    </div>
                    <h2 className="text-white text-2xl font-bold mb-2">Access Blocked</h2>
                    <p className="text-secondary mb-6">
                        Too many failed attempts. Please try again later.
                    </p>
                    <div className="bg-black-100 rounded-xl p-6">
                        <p className="text-secondary text-sm mb-2">Time Remaining</p>
                        <p className="text-4xl font-bold text-red-500">{formatTime(timeRemaining)}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-primary p-4">
            <div className="bg-tertiary p-6 md:p-8 rounded-2xl shadow-card w-full max-w-[400px]">
                {/* Step 1: Access Key */}
                {step === 1 && (
                    <>
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 bg-violet-600/20 rounded-full flex items-center justify-center">
                                <Shield size={32} className="text-violet-500" />
                            </div>
                        </div>
                        <h2 className="text-white text-2xl font-bold mb-2 text-center">Secure Access</h2>
                        <p className="text-secondary text-sm text-center mb-6">
                            Enter your secret access key to continue
                        </p>

                        <form onSubmit={handleAccessKeySubmit} className="flex flex-col gap-4">
                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder="Secret Access Key"
                                    value={accessKey}
                                    onChange={(e) => setAccessKey(e.target.value)}
                                    className="w-full bg-black-100 py-4 px-6 rounded-lg text-white outline-none border-none font-medium"
                                    autoComplete="off"
                                />
                            </div>

                            {error && (
                                <div className="bg-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                                    <AlertTriangle size={16} />
                                    {error}
                                </div>
                            )}

                            {attempts > 0 && attempts < MAX_ATTEMPTS && (
                                <p className="text-yellow-500 text-xs text-center">
                                    {MAX_ATTEMPTS - attempts} attempts remaining
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={checkingKey}
                                className="bg-violet-600 py-4 rounded-lg text-white font-bold hover:bg-violet-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Lock size={18} />
                                {checkingKey ? "Verifying..." : "Verify Access"}
                            </button>
                        </form>
                    </>
                )}

                {/* Step 2: Login */}
                {step === 2 && (
                    <>
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center">
                                <Lock size={32} className="text-green-500" />
                            </div>
                        </div>
                        <h2 className="text-white text-2xl font-bold mb-2 text-center">Portal Login</h2>
                        <p className="text-secondary text-sm text-center mb-6">
                            Enter your credentials to continue
                        </p>

                        <form onSubmit={handleLogin} className="flex flex-col gap-4">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-black-100 py-4 px-6 rounded-lg text-white outline-none border-none font-medium"
                                autoComplete="email"
                            />

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black-100 py-4 px-6 pr-12 rounded-lg text-white outline-none border-none font-medium"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            {error && (
                                <div className="bg-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                                    <AlertTriangle size={16} />
                                    {error}
                                </div>
                            )}

                            {attempts > 0 && attempts < MAX_ATTEMPTS && (
                                <p className="text-yellow-500 text-xs text-center">
                                    {MAX_ATTEMPTS - attempts} attempts remaining
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-green-600 py-4 rounded-lg text-white font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setStep(1);
                                    setError("");
                                }}
                                className="text-secondary text-sm hover:text-white transition-colors"
                            >
                                ← Back
                            </button>
                        </form>
                    </>
                )}

                {/* Security Footer */}
                <div className="mt-6 pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-center gap-2 text-secondary text-xs">
                        <Shield size={14} />
                        <span>Protected by 2-Layer Security</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
