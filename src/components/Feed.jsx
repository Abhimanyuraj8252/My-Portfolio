import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { testimonials } from "../constants"; // Fallback data
import { supabase } from "../lib/supabase/client";

const FeedbackCard = ({
    index,
    message,
    name,
    designation,
    company,
    image,
    rating,
}) => (
    <motion.div
        variants={fadeIn("", "spring", index * 0.5, 0.75)}
        className='bg-black-200 p-10 rounded-3xl xs:w-[320px] w-full'
    >
        <p className='text-white font-black text-[48px]'>"</p>

        <div className='mt-1'>
            <p className='text-white tracking-wider text-[18px]'>{message}</p>

            <div className="flex gap-1 mt-2 mb-4">
                {"★".repeat(rating || 5)}
            </div>

            <div className='mt-7 flex justify-between items-center gap-1'>
                <div className='flex-1 flex flex-col'>
                    <p className='text-white font-medium text-[16px]'>
                        <span className='blue-text-gradient'>@</span> {name}
                    </p>
                    <p className='mt-1 text-secondary text-[12px]'>
                        {designation} {company && `of ${company}`}
                    </p>
                </div>

                {image ? (
                    <img
                        src={image}
                        alt={`feedback_by-${name}`}
                        className='w-10 h-10 rounded-full object-cover'
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold">
                        {name.charAt(0)}
                    </div>
                )}
            </div>
        </div>
    </motion.div>
);

const Feed = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .eq('approved', true) // Only show approved reviews
                .order('created_at', { ascending: false })
                .limit(6);

            if (!error && data.length > 0) {
                setReviews(data);
            } else {
                // Fallback to constants if no DB data
                setReviews(testimonials);
            }
        };

        fetchReviews();
    }, []);

    return (
        <div className={`mt-12 bg-black-100 rounded-[20px]`}>
            <div
                className={`bg-tertiary rounded-2xl ${styles.padding} min-h-[300px]`}
            >
                <motion.div variants={textVariant()}>
                    <p className={styles.sectionSubText}>What others say</p>
                    <h2 className={styles.sectionHeadText}>Testimonials.</h2>
                </motion.div>
            </div>
            <div className={`-mt-20 pb-14 ${styles.paddingX} flex flex-wrap gap-7`}>
                {reviews.map((testimonial, index) => (
                    <FeedbackCard key={testimonial.name + index} index={index} {...testimonial} />
                ))}
            </div>
        </div>
    );
};

export default SectionWrapper(Feed, "feed");
