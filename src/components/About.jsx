import React from "react";
// import Tilt from "react-tilt"; // Using framer-motion instead for simpler setup or install react-tilt if needed by user
// Using standard div for now, or can install react-tilt
import { m as motion } from "framer-motion";

import { styles } from "../styles";
import { services } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";

const ServiceCard = ({ index, title, icon }) => (
    // Ideally wrap in Tilt for 3D effect: <Tilt className='xs:w-[250px] w-full'>
    <div className='xs:w-[250px] w-full'>
        <motion.div
            variants={fadeIn("right", "spring", index * 0.5, 0.75)}
            className='w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card'
        >
            <div
                options={{
                    max: 45,
                    scale: 1,
                    speed: 450,
                }}
                className='bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col'
            >
                {/* Placeholder Icon if no asset */}
                <div className="text-white text-4xl font-bold">{icon === 'web' ? '🕸️' : icon === 'mobile' ? '📱' : icon === 'backend' ? '⚙️' : '🎨'}</div>

                {/* <img
          src={icon}
          alt='web-development'
          className='w-16 h-16 object-contain'
        /> */}

                <p className='text-white text-[20px] font-bold text-center'>
                    {title}
                </p>
            </div>
        </motion.div>
    </div>
);

const About = () => {
    // Resume Summary Logic
    return (
        <>
            <motion.div variants={textVariant()}>
                <p className={styles.sectionSubText}>Introduction</p>
                <h2 className={styles.sectionHeadText}>Overview.</h2>
            </motion.div>

            <motion.p
                variants={fadeIn("", "", 0.1, 1)}
                className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
            >
                Currently pursuing a Diploma in Computer Science and Engineering from Digambar Jain Polytechnic (expected August 2026), complemented by a certification in Programming with Python from Internshala Trainings.
                <br /><br />
                As a Freelance Web Developer, I design and develop custom websites and advanced Android media player applications, focusing on user experience and functionality. By leveraging skills in Kotlin, XML, and Next.js, I emphasize clean, scalable, and efficient code to deliver tailored digital solutions.
            </motion.p>

            <div className='mt-20 flex flex-wrap gap-10'>
                {services.map((service, index) => (
                    <ServiceCard key={service.title} index={index} {...service} />
                ))}
            </div>
        </>
    );
};

export default SectionWrapper(About, "about");
