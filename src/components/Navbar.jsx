import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { styles } from "../styles";
import { navLinks } from "../constants";
import { logo } from "../assets";
import { Menu, X } from "lucide-react"; // Using Lucide for icons

const Navbar = () => {
    const [active, setActive] = useState("");
    const [toggle, setToggle] = useState(false);
    const [scrolled, setScrolled] = useState(false);

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

    return (
        <nav
            className={`${styles.paddingX
                } w-full flex items-center py-5 fixed top-0 z-[999] transition-all duration-300 ${scrolled ? "bg-primary/80 backdrop-blur-md shadow-lg" : "bg-transparent"
                }`}
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
                            onClick={() => setActive(nav.title)}
                        >
                            <a href={`/#${nav.id}`}>{nav.title}</a>
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
                    <div
                        className="cursor-pointer text-white"
                        onClick={() => setToggle(!toggle)}
                    >
                        {toggle ? <X size={28} /> : <Menu size={28} />}
                    </div>

                    <div
                        className={`${!toggle ? "hidden" : "flex"
                            } p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl sidebar`}
                    >
                        <ul className='list-none flex justify-end items-start flex-1 flex-col gap-4'>
                            {navLinks.filter(nav => nav.id !== 'blog').map((nav) => (
                                <li
                                    key={nav.id}
                                    className={`font-poppins font-medium cursor-pointer text-[16px] ${active === nav.title ? "text-white" : "text-secondary"
                                        }`}
                                    onClick={() => {
                                        setToggle(!toggle);
                                        setActive(nav.title);
                                    }}
                                >
                                    <a href={`/#${nav.id}`}>{nav.title}</a>
                                </li>
                            ))}
                            <li
                                className="font-poppins font-medium cursor-pointer text-[16px] text-secondary"
                                onClick={() => {
                                    setToggle(!toggle);
                                }}
                            >
                                <Link to="/blog">Blog</Link>
                            </li>
                            <li
                                className="font-poppins font-medium cursor-pointer text-[16px] text-secondary"
                                onClick={() => {
                                    setToggle(!toggle);
                                }}
                            >
                                <Link to="/testimonials">Testimonials</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
