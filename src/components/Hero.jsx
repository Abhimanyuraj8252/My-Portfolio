import { motion } from "framer-motion";

import { styles } from "../styles";
// Removed 3D Canvas for performance
// import { ComputersCanvas } from "./canvas";

const Hero = () => {
    return (
        <section className={`relative w-full h-screen mx-auto overflow-hidden bg-primary`}>
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
                className={`absolute inset-0 top-[120px] max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5 z-10`}
            >
                <div className='flex flex-col justify-center items-center mt-5'>
                    <div className='w-5 h-5 rounded-full bg-[#915eff]' />
                    <div className='w-1 sm:h-80 h-40 violet-gradient' />
                </div>

                <div>
                    <h1 className={`${styles.heroHeadText} text-white`}>
                        Hi, I'm <span className='text-[#915eff]'>Abhimanyu</span>
                    </h1>
                    <p className={`${styles.heroSubText} mt-2 text-white-100`}>
                        I develop 3D visuals, user <br className='sm:block hidden' />
                        interfaces and web applications.
                    </p>

                    {/* Abstract visual element / Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="mt-10 max-w-xl p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-card hover:shadow-cyan-500/20 transition-all duration-300"
                    >
                        <h3 className="text-xl font-bold text-white mb-2">Digital Creator</h3>
                        <p className="text-secondary text-[16px] leading-[28px]">
                            Building immersive digital experiences that merge art with code.
                            Specializing in React, 3D WebGL, and modern UI/UX design.
                        </p>
                        <div className="mt-4 flex gap-3">
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/50">Full Stack</span>
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/50">3D Visuals</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Changed from ComputersCanvas to nothing or just the scroll indicator */}

            <div className='absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center z-20'>
                <a href='#about'>
                    <div className='w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2'>
                        <motion.div
                            animate={{
                                y: [0, 24, 0],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                repeatType: "loop",
                            }}
                            className='w-3 h-3 rounded-full bg-secondary mb-1'
                        />
                    </div>
                </a>
            </div>
        </section>
    );
};

export default Hero;
