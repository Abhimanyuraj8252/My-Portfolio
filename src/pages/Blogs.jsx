import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { supabase } from "../lib/supabase/client";
import { styles } from "../styles";
import { Navbar } from "../components";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";

const BlogCard = ({ index, title, excerpt, content, slug, created_at, cover_image, category, tags, reading_time, featured }) => {
    const description = excerpt || content?.replace(/<[^>]+>/g, '').substring(0, 150) + '...';

    return (
        <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
            <Link to={`/blog/${slug}`}>
                <div className={`bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full cursor-pointer hover:shadow-card transition-all hover:scale-[1.02] ${featured ? 'ring-2 ring-yellow-500' : ''}`}>
                    <div className='relative w-full h-[230px]'>
                        {cover_image ? (
                            <img src={cover_image} alt={title} className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                            <div className="w-full h-full bg-violet-900 rounded-2xl flex items-center justify-center text-5xl">
                                📝
                            </div>
                        )}
                        {featured && (
                            <div className="absolute top-3 right-3 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                                ⭐ Featured
                            </div>
                        )}
                        {category && (
                            <div className="absolute bottom-3 left-3 bg-violet-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                                {category}
                            </div>
                        )}
                    </div>

                    <div className='mt-5'>
                        <h3 className='text-white font-bold text-[24px] truncate'>{title}</h3>
                        <p className='mt-2 text-secondary text-[14px] line-clamp-2'>
                            {description}
                        </p>

                        {tags?.length > 0 && (
                            <div className="flex gap-1 mt-3 flex-wrap">
                                {tags.slice(0, 3).map((tag, i) => (
                                    <span key={i} className="bg-black-200 text-secondary text-xs px-2 py-1 rounded">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-between items-center mt-4">
                            <p className="text-secondary text-xs">
                                {new Date(created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                            <p className="text-secondary text-xs">
                                📖 {reading_time || 5} min read
                            </p>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .eq('published', true)
                .order('created_at', { ascending: false });

            if (!error) setBlogs(data);
            setLoading(false);
        };

        fetchBlogs();
    }, []);

    return (
        <>
            <Helmet>
                <title>Blog | Abhimanyu Raj - Web Developer</title>
                <meta name="description" content="Read insights, tutorials, and updates on Web Development, 3D Graphics, and Software Engineering." />
            </Helmet>

            <div className="bg-primary min-h-screen">
                <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center h-[300px]">
                    <Navbar />
                    <div className={`${styles.padding} max-w-7xl mx-auto pt-32`}>
                        <motion.div variants={textVariant()}>
                            <p className={styles.sectionSubText}>My Thoughts & Tutorials</p>
                            <h2 className={styles.sectionHeadText}>Blog.</h2>
                        </motion.div>
                    </div>
                </div>

                <div className={`${styles.padding} max-w-7xl mx-auto`}>
                    {loading ? (
                        <p className="text-white">Loading articles...</p>
                    ) : (
                        <div className='flex flex-wrap gap-7'>
                            {blogs.length > 0 ? (
                                blogs.map((blog, index) => (
                                    <BlogCard key={blog.id} index={index} {...blog} />
                                ))
                            ) : (
                                <p className="text-secondary text-lg">No articles published yet.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SectionWrapper(Blogs, "");
