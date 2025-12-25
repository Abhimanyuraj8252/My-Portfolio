import { motion } from "framer-motion";

import { styles } from "../styles";
// Removed 3D Canvas for performance
// import { ComputersCanvas } from "./canvas";

const Hero = () => {
    return (
        <section className={`relative w-full min-h-screen mx-auto overflow-hidden bg-primary`}>
            {/* Animated Background Gradients */}
            <div className="absolute inset-0 top-0 z-0">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 20, repeat: Infinity, repeatType: "mirror" }}
                    className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full purple-gradient opacity-20 blur-[120px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.1, 1], x: [0, 50, 0] }}
                    transition={{ duration: 15, repeat: Infinity, repeatType: "mirror" }}
                    className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full blue-gradient opacity-20 blur-[100px]"
                />
            </div>

            <div
                className={`absolute inset-0 top-[180px] lg:top-[160px] max-w-7xl mx-auto ${styles.paddingX} flex flex-col lg:flex-row items-start lg:items-center lg:justify-between gap-5 z-10`}
            >
                {/* Left Side - Text Content */}
                <div className="flex flex-row items-start gap-5 flex-1">
                    <div className='flex flex-col justify-center items-center mt-5'>
                        <div className='w-5 h-5 rounded-full bg-[#915eff]' />
                        <div className='w-1 sm:h-80 h-40 violet-gradient' />
                    </div>

                    <div className="w-full">
                        <h1 className={`${styles.heroHeadText} text-white`}>
                            Hi, I'm <span className='text-[#915eff]'>Abhimanyu</span>
                        </h1>
                        <p className={`${styles.heroSubText} mt-2 text-white-100`}>
                            I develop 3D visuals, user <br className='sm:block hidden' />
                            interfaces and web applications.
                        </p>

                        {/* Mobile Profile Image - Above Card */}
                        <div className="w-full lg:hidden flex justify-center mt-8 mb-8">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                                className="relative w-72 h-72 sm:w-80 sm:h-80"
                            >
                                {/* Spinning glowing border */}
                                <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-[#915eff] via-pink-500 to-[#00cea8] opacity-75 blur-lg animate-spin-slow" />

                                {/* Image Circle */}
                                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/20 bg-primary shadow-2xl">
                                    <img
                                        src="/abhimanyu-hero.jpg"
                                        alt="Abhimanyu Raj"
                                        className="w-full h-full object-cover object-center scale-100"
                                        loading="eager"
                                        onError={(e) => { console.error('Image failed to load:', e.target.src); }}
                                    />
                                </div>

                                {/* Badge */}
                                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-lg">
                                    <span className="text-xs font-bold text-[#915eff] tracking-wider">CREATOR</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Abstract visual element / Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="mt-4 max-w-xl p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-card relative z-10"
                        >
                            <h2 className="text-xl font-bold text-white mb-2">Software Engineer</h2>
                            <p className="text-secondary text-[16px] leading-[28px]">
                                Freelance Web & App Developer with expertise in building scalable applications.
                                CSE student passionate about crafting innovative digital solutions.
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/50">Freelancer</span>
                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/50">Web & App Dev</span>
                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-300 border border-green-500/50">CSE</span>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Right Side - Premium Profile Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: 100 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                    className="hidden lg:flex flex-shrink-0 mr-8"
                >
                    <div className="relative group">
                        {/* Animated gradient ring */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#915eff] via-[#00cea8] to-[#bf61ff] rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />

                        {/* Secondary glow */}
                        <div className="absolute -inset-2 bg-gradient-to-r from-violet-600 to-cyan-400 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />

                        {/* Image container */}
                        <div className="relative w-72 h-72 xl:w-80 xl:h-80 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl">
                            <img
                                src="/abhimanyu-hero.jpg"
                                alt="Abhimanyu Raj"
                                className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700 ease-out"
                            />
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent opacity-60" />
                        </div>

                        {/* Badges */}
                        <div className="absolute -bottom-2 -left-4 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full shadow-lg shadow-violet-500/30">
                            <span className="text-white text-sm font-bold">💻 Developer</span>
                        </div>

                        <div className="absolute -top-2 -right-4 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-lg shadow-cyan-500/30">
                            <span className="text-white text-sm font-bold">🎨 Designer</span>
                        </div>
                    </div>
                </motion.div>
            </div>

        </section>
    );
};

export default Hero;
