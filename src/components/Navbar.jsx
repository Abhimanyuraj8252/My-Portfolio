import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { styles } from "../styles";
import { navLinks } from "../constants";
import { logo } from "../assets";
import { Menu, X } from "lucide-react"; // Using Lucide for icons

const Navbar = () => {
    const [active, setActive] = useState("");
    const [toggle, setToggle] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            if (scrollTop > 100) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll, { passive: true });
    }, []);

    const handleNavClick = (navId, navTitle, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setActive(navTitle);
        setToggle(false);

        // Simple scroll function
        const doScroll = () => {
            const el = document.getElementById(navId);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                return true;
            }
            return false;
        };

        // If not on home, navigate first
        if (location.pathname !== '/') {
            navigate('/');
        }

        // Try immediately, then poll
        if (!doScroll()) {
            let count = 0;
            const poll = setInterval(() => {
                count++;
                if (doScroll() || count >= 50) {
                    clearInterval(poll);
                }
            }, 100);
        }
    };

    return (
        <nav
            className={`${styles.paddingX
                } w-full flex items-center py-5 fixed top-0 z-[9999] isolate pointer-events-auto transition-all duration-300 ${scrolled ? "bg-primary/80 backdrop-blur-md shadow-lg" : "bg-transparent"
                }`}
            style={{ touchAction: 'manipulation' }}
        >
            <div className='w-full flex justify-between items-center max-w-7xl mx-auto'>
                <Link
                    to='/'
                    className='flex items-center gap-2 flex-shrink-0'
                    onClick={() => {
                        setActive("");
                        window.scrollTo(0, 0);
                    }}
                >
                    <img src={logo} alt="logo" className="w-8 h-8 sm:w-9 sm:h-9 object-contain flex-shrink-0" />
                    <p className='text-white text-[16px] sm:text-[18px] font-bold cursor-pointer whitespace-nowrap'>
                        Abhimanyu Raj<span className='hidden md:inline'> | CSE</span>
                    </p>
                </Link>

                {/* Desktop Navigation */}
                <ul className='list-none hidden sm:flex flex-row gap-10'>
                    {navLinks.filter(nav => nav.id !== 'blog').map((nav) => (
                        <li
                            key={nav.id}
                            className={`${active === nav.title ? "text-white" : "text-secondary"
                                } hover:text-white text-[18px] font-medium cursor-pointer transition-colors duration-200`}
                            onClick={() => handleNavClick(nav.id, nav.title)}
                        >
                            <span>{nav.title}</span>
                        </li>
                    ))}
                    <li className="text-secondary hover:text-white text-[18px] font-medium cursor-pointer transition-colors duration-200">
                        <Link to="/blog">Blog</Link>
                    </li>
                    <li className="text-secondary hover:text-white text-[18px] font-medium cursor-pointer transition-colors duration-200">
                        <Link to="/testimonials">Testimonials</Link>
                    </li>
                </ul>

                {/* Mobile Navigation */}
                <div className='sm:hidden flex flex-1 justify-end items-center'>
                    <button
                        type="button"
                        aria-label={toggle ? "Close menu" : "Open menu"}
                        className="cursor-pointer text-white p-2 -mr-2 touch-manipulation relative z-[99999]"
                        onClick={() => setToggle(!toggle)}
                        onTouchEnd={(e) => {
                            e.preventDefault();
                            setToggle(!toggle);
                        }}
                    >
                        {toggle ? <X size={28} /> : <Menu size={28} />}
                    </button>

                    {/* Mobile Menu Dropdown - Fixed position for better mobile support */}
                    {toggle && (
                        <div
                            className="fixed top-[80px] right-4 p-6 black-gradient min-w-[200px] rounded-xl shadow-2xl"
                            style={{
                                zIndex: 99999,
                                pointerEvents: 'auto',
                                touchAction: 'manipulation',
                            }}
                        >
                            <ul className='list-none flex flex-col gap-4'>
                                {navLinks.filter(nav => nav.id !== 'blog').map((nav) => (
                                    <li key={nav.id}>
                                        <button
                                            type="button"
                                            className={`font-poppins font-medium cursor-pointer text-[16px] py-3 px-4 min-h-[48px] flex items-center w-full text-left rounded-lg active:bg-white/10 ${active === nav.title ? "text-white bg-white/5" : "text-secondary"
                                                }`}
                                            onClick={(e) => handleNavClick(nav.id, nav.title, e)}
                                            onTouchEnd={(e) => {
                                                e.preventDefault();
                                                handleNavClick(nav.id, nav.title, e);
                                            }}
                                        >
                                            {nav.title}
                                        </button>
                                    </li>
                                ))}
                                <li>
                                    <Link
                                        to="/blog"
                                        className="font-poppins font-medium cursor-pointer text-[16px] text-secondary py-3 px-4 min-h-[48px] flex items-center w-full rounded-lg active:bg-white/10"
                                        onClick={() => setToggle(false)}
                                        onTouchEnd={(e) => {
                                            e.preventDefault();
                                            setToggle(false);
                                        }}
                                    >
                                        Blog
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/testimonials"
                                        className="font-poppins font-medium cursor-pointer text-[16px] text-secondary py-3 px-4 min-h-[48px] flex items-center w-full rounded-lg active:bg-white/10"
                                        onClick={() => setToggle(false)}
                                        onTouchEnd={(e) => {
                                            e.preventDefault();
                                            setToggle(false);
                                        }}
                                    >
                                        Testimonials
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
