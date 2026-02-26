import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { styles } from "../styles";
import PageSEO from "../components/PageSEO";

const RefundPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
        <PageSEO
            route="/refund-policy"
            fallbackTitle="Refund Policy | Abhimanyu Raj"
            fallbackDescription="Refund and cancellation policy for services provided by Abhimanyu Raj."
        />
        <div className="bg-primary min-h-screen py-24 px-6 sm:px-16">
            <main className="max-w-4xl mx-auto">
                <Link to="/" className="text-secondary hover:text-white mb-6 inline-block">
                    &larr; Back to Home
                </Link>
                <h1 className={`${styles.sectionHeadText} mb-8`}>Refund Policy</h1>

                <section className="flex flex-col gap-6 text-secondary leading-7">
                    <p>Last updated: December 25, 2025</p>

                    <h2 className="text-white text-2xl font-bold mt-4">1. General Terms</h2>
                    <p>
                        By purchasing our services or products, you agree to this refund policy. We aim to ensure customer satisfaction, but due to the nature of digital goods and services, specific conditions apply.
                    </p>

                    <h2 className="text-white text-2xl font-bold mt-4">2. Services</h2>
                    <p>
                        For web development and design services:
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Initial Deposit:</strong> The initial deposit (usually 30-50%) is non-refundable once work has commenced.</li>
                            <li><strong>Completed Work:</strong> Once the final project is delivered and approved, no refunds will be issued.</li>
                            <li><strong>Cancellation:</strong> If you cancel the project before completion, you may be eligible for a partial refund based on the work completed, excluding the non-refundable deposit.</li>
                        </ul>
                    </p>

                    <h2 className="text-white text-2xl font-bold mt-4">3. Digital Products</h2>
                    <p>
                        Since your purchase is a digital product, it is deemed "used" after download or opening, and all purchases made on this website are non-refundable or exchangeable. Since the products made available here are intangible, there is a strict no refund policy.
                    </p>

                    <h2 className="text-white text-2xl font-bold mt-4">4. Contact Us</h2>
                    <p>
                        If you have any questions about our Returns and Refunds Policy, please contact us via the contact page.
                    </p>
                </section>
            </main>
        </div>
        </>
    );
};

export default RefundPolicy;
