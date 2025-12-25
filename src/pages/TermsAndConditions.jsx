import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { styles } from "../styles";

const TermsAndConditions = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-primary min-h-screen py-24 px-6 sm:px-16">
            <main className="max-w-4xl mx-auto">
                <Link to="/" className="text-secondary hover:text-white mb-6 inline-block">
                    &larr; Back to Home
                </Link>
                <h1 className={`${styles.sectionHeadText} mb-8`}>Terms & Conditions</h1>

                <section className="flex flex-col gap-6 text-secondary leading-7">
                    <p>Last updated: December 25, 2025</p>

                    <h2 className="text-white text-2xl font-bold mt-4">1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                    </p>

                    <h2 className="text-white text-2xl font-bold mt-4">2. Intellectual Property</h2>
                    <p>
                        The Site and its original content, features, and functionality are owned by Abhimanyu and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
                    </p>

                    <h2 className="text-white text-2xl font-bold mt-4">3. License to Use</h2>
                    <p>
                        You may view, download for caching purposes only, and print pages from the website for your own personal use, subject to the restrictions set out below and elsewhere in these terms and conditions.
                    </p>

                    <h2 className="text-white text-2xl font-bold mt-4">4. Limitation of Liability</h2>
                    <p>
                        In no event shall Abhimanyu, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract.
                    </p>

                    <h2 className="text-white text-2xl font-bold mt-4">5. Governing Law</h2>
                    <p>
                        These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                    </p>
                </section>
            </main>
        </div>
    );
};

export default TermsAndConditions;
