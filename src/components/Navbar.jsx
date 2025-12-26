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

        const scrollToSection = () => {
            const element = document.getElementById(navId);
            if (element) {
                // scrollIntoView works correctly with body overflow settings
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                return true;
            }
            return false;
        };

        // If already on home page, scroll directly
        if (location.pathname === '/') {
            if (!scrollToSection()) {
                // If element not found (lazy loading), poll for it
                let attempts = 0;
                const checkInterval = setInterval(() => {
                    if (scrollToSection() || attempts > 30) {
                        clearInterval(checkInterval);
                    }
                    attempts++;
                }, 100);
            }
        } else {
            // Navigate to home first, then scroll
            navigate('/');
            let attempts = 0;
            const checkInterval = setInterval(() => {
                if (scrollToSection() || attempts > 30) {
                    clearInterval(checkInterval);
                }
                attempts++;
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
                        className="cursor-pointer text-white p-2 -mr-2 touch-manipulation"
                        onClick={() => setToggle(!toggle)}
                    >
                        {toggle ? <X size={28} /> : <Menu size={28} />}
                    </button>

                    <div
                        className={`${!toggle ? "hidden" : "flex"
                            } p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[180px] z-[10000] rounded-xl sidebar pointer-events-auto`}
                    >
                        <ul className='list-none flex justify-end items-start flex-1 flex-col gap-4'>
                            {navLinks.filter(nav => nav.id !== 'blog').map((nav) => (
                                <li
                                    key={nav.id}
                                    className={`font-poppins font-medium cursor-pointer text-[16px] py-2 px-1 min-h-[44px] flex items-center touch-manipulation ${active === nav.title ? "text-white" : "text-secondary"
                                        }`}
                                    onClick={(e) => handleNavClick(nav.id, nav.title, e)}
                                >
                                    <span>{nav.title}</span>
                                </li>
                            ))}
                            <li
                                className="font-poppins font-medium cursor-pointer text-[16px] text-secondary py-2 px-1 min-h-[44px] flex items-center touch-manipulation"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setToggle(false);
                                    navigate("/blog");
                                }}
                            >
                                <span>Blog</span>
                            </li>
                            <li
                                className="font-poppins font-medium cursor-pointer text-[16px] text-secondary py-2 px-1 min-h-[44px] flex items-center touch-manipulation"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setToggle(false);
                                    navigate("/testimonials");
                                }}
                            >
                                <span>Testimonials</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
