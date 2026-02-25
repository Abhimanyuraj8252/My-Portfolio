import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { styles } from "../styles";

const PrivacyPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-primary min-h-screen py-24 px-6 sm:px-16">
            <main className="max-w-4xl mx-auto">
                <Link to="/" className="text-secondary hover:text-white mb-6 inline-block">
                    &larr; Back to Home
                </Link>
                <h1 className={`${styles.sectionHeadText} mb-8`}>Privacy Policy</h1>

                <section className="flex flex-col gap-6 text-secondary leading-7">
                    <p>Last updated: December 25, 2025</p>

                    <h2 className="text-white text-2xl font-bold mt-4">1. Introduction</h2>
                    <p>
                        Welcome to Abhimanyu Portfolio. We respect your privacy and are committed to protecting your personal data.
                        This privacy policy will inform you as to how we look after your personal data when you visit our website
                        and tell you about your privacy rights.
                    </p>

                    <h2 className="text-white text-2xl font-bold mt-4">2. Data We Collect</h2>
                    <p>
                        We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Identity Data includes first name, last name, username or similar identifier.</li>
                            <li>Contact Data includes email address and telephone number.</li>
                            <li>Technical Data includes internet protocol (IP) address, your login data, browser type and version.</li>
                        </ul>
                    </p>

                    <h2 className="text-white text-2xl font-bold mt-4">3. How We Use Your Data</h2>
                    <p>
                        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>To communicate with you via the contact form.</li>
                            <li>To improve our website and services.</li>
                        </ul>
                    </p>

                    <h2 className="text-white text-2xl font-bold mt-4">4. Data Security</h2>
                    <p>
                        We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way.
                    </p>

                    <h2 className="text-white text-2xl font-bold mt-4">5. Contact Us</h2>
                    <p>
                        If you have any questions about this privacy policy, please contact us via the contact form on the homepage.
                    </p>
                </section>
            </main>
        </div>
    );
};

export default PrivacyPolicy;
