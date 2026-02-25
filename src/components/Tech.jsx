import React from "react";
import { motion } from "framer-motion";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";

const TechCard = ({ icon, name }) => {
    return (
        <motion.div
            className="w-28 h-28 relative flex items-center justify-center cursor-pointer group"
            whileHover={{ scale: 1.1, rotate: 10 }}
            animate={{
                y: [0, -10, 0],
            }}
            transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
            }}
        >
            {/* 3D Orb Background - CSS only, high performance */}
            <div
                className="absolute inset-0 rounded-full"
                style={{
                    background: "linear-gradient(135deg, #e0faff 0%, #25c0e0 50%, #101426 100%)",
                    boxShadow: "inset 4px 4px 10px rgba(255,255,255,0.5), inset -4px -4px 10px rgba(0,0,0,0.5), 0 10px 20px rgba(0,0,0,0.3)",
                }}
            />

            {/* Decal / Icon */}
            <div className="z-10 w-2/3 h-2/3 flex items-center justify-center">
                <img src={icon} alt={name} className="w-full h-full object-contain drop-shadow-md" />
            </div>

            {/* Label on Hover (Accessory) */}
            <div className="absolute -bottom-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                <span className="text-[#050816] text-sm font-bold bg-[#25c0e0] px-3 py-1 rounded-lg shadow-[0_0_15px_rgba(37,192,224,0.6)] whitespace-nowrap border border-white">
                    {name}
                </span>
            </div>
        </motion.div>
    );
};

const Tech = () => {
    return (
        <div className='flex flex-row flex-wrap justify-center gap-10'>
            {technologies.map((technology) => (
                <div className='w-28 h-28' key={technology.name}>
                    <TechCard icon={technology.icon} name={technology.name} />
                </div>
            ))}
        </div>
    );
};

export default SectionWrapper(Tech, "tech");
