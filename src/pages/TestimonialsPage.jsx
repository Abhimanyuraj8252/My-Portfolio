import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { supabase } from "../lib/supabase/client";
import { FaStar } from "react-icons/fa";

const FeedbackCard = ({ index, message, name, designation, company, rating }) => (
    <motion.div
        variants={fadeIn("", "spring", index * 0.5, 0.75)}
        className='bg-black-200 p-10 rounded-3xl w-full md:w-[48%] lg:w-[30%]'
    >
        <p className='text-white font-black text-[48px]'>"</p>

        <div className='mt-1'>
            <p className='text-white tracking-wider text-[18px]'>{message}</p>

            <div className="flex gap-1 mt-2 mb-4">
                {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < rating ? "text-yellow-500" : "text-gray-600"} />
                ))}
            </div>

            <div className='mt-7 flex justify-between items-center gap-1'>
                <div className='flex-1 flex flex-col'>
                    <p className='text-white font-medium text-[16px]'>
                        <span className='blue-text-gradient'>@</span> {name}
                    </p>
                    {designation && (
                        <p className='mt-1 text-secondary text-[12px]'>
                            {designation}
                        </p>
                    )}
                </div>
            </div>
        </div>
    </motion.div>
);

const TestimonialsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [form, setForm] = useState({
        name: "",
        rating: 5,
        message: "",
        designation: ""
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('approved', true)
            .order('created_at', { ascending: false });

        if (!error) setReviews(data);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleRating = (value) => {
        setForm({ ...form, rating: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase
            .from('reviews')
            .insert([{
                name: form.name,
                rating: form.rating,
                message: form.message,
                designation: form.designation,
                approved: false // Pending approval
            }]);

        setLoading(false);

        if (!error) {
            setSubmitted(true);
            setForm({ name: "", rating: 5, message: "", designation: "" });
            setTimeout(() => setSubmitted(false), 5000);
        } else {
            alert("Error submitting review. Please try again.");
        }
    };

    return (
        <div className="pt-28 pb-10 bg-primary min-h-screen">
            <div className={`${styles.padding} max-w-7xl mx-auto relative z-0`}>
                <motion.div variants={textVariant()}>
                    <p className={styles.sectionSubText}>What our clients say</p>
                    <h2 className={styles.sectionHeadText}>Testimonials.</h2>
                </motion.div>

                {/* Submission Form */}
                <div className="mt-10 bg-black-100 p-8 rounded-2xl max-w-2xl mx-auto">
                    <h3 className="text-2xl font-bold text-white mb-6">Leave a Review</h3>
                    {submitted ? (
                        <div className="bg-green-500/20 border border-green-500 p-4 rounded-xl text-center">
                            <h4 className="text-white font-bold text-xl">Thank You!</h4>
                            <p className="text-secondary mt-2">Your review has been submitted for approval.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-white font-medium">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar
                                            key={star}
                                            size={24}
                                            className={`cursor-pointer transition-colors ${star <= form.rating ? "text-yellow-500" : "text-gray-600"}`}
                                            onClick={() => handleRating(star)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <label className="flex flex-col">
                                <span className="text-white font-medium mb-4">Your Name</span>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="What's your name?"
                                    required
                                    className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium"
                                />
                            </label>

                            <label className="flex flex-col">
                                <span className="text-white font-medium mb-4">Designation (Optional)</span>
                                <input
                                    type="text"
                                    name="designation"
                                    value={form.designation}
                                    onChange={handleChange}
                                    placeholder="e.g. CEO of Company"
                                    className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium"
                                />
                            </label>

                            <label className="flex flex-col">
                                <span className="text-white font-medium mb-4">Your Review</span>
                                <textarea
                                    rows={4}
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    placeholder="Share your experience..."
                                    required
                                    className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium"
                                />
                            </label>

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-tertiary py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary hover:bg-[#1f1b3c] transition-all"
                            >
                                {loading ? "Submitting..." : "Submit Review"}
                            </button>
                        </form>
                    )}
                </div>

                {/* Reviews List */}
                <div className="mt-20 flex flex-wrap gap-7 justify-center">
                    {reviews.length > 0 ? (
                        reviews.map((review, index) => (
                            <FeedbackCard key={review.id} index={index} {...review} />
                        ))
                    ) : (
                        <p className="text-secondary text-center w-full">No reviews yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TestimonialsPage;
