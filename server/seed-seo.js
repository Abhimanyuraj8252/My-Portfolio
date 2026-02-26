import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seoData = [
    {
        pageRoute: "/",
        metaTitle: "Abhimanyu Raj | Full Stack Developer & AI Enthusiast",
        metaDescription: "Welcome to the portfolio of Abhimanyu Raj, a passionate Full Stack Developer specializing in MERN stack, Next.js, and AI-driven web applications.",
        keywords: [
            "Abhimanyu Raj", "Abhimanyu Raj portfolio", "Full Stack Developer", "MERN Stack Developer", "React Developer",
            "Node.js Expert", "Web Development", "AI in Web App", "Next.js Developer", "Frontend Engineer",
            "Backend Engineer", "Software Developer", "JavaScript Expert", "TypeScript Developer", "Tailwind CSS",
            "UI/UX Design", "Custom Web Solutions", "Best Web Developer", "Hire Full Stack Developer", "Patna Developer",
            "Indian Web Developer", "Freelance Developer", "Tech Enthusiast", "Innovative Coding", "Responsive Design",
            "API Development", "Database Architecture", "MongoDB Expert", "PostgreSQL", "Cloud Deployment", "Vercel", "AWS"
        ],
        ogImage: "https://abhimanyu-raj-cse.vercel.app/logo.png",
        ogType: "website",
        twitterCard: "summary_large_image",
        canonicalUrl: "https://abhimanyu-raj-cse.vercel.app/",
        author: "Abhimanyu Raj"
    },
    {
        pageRoute: "/about",
        metaTitle: "About Abhimanyu Raj | My Journey & Skills",
        metaDescription: "Learn about my journey as a software developer, my educational background, and the core technologies I use to build scalable web applications.",
        keywords: [
            "About Abhimanyu Raj", "Developer Biography", "Software Engineering Journey", "Tech Stack", "Programming Skills",
            "Education", "Computer Science", "Experience", "Career Profile", "Professional Details",
            "Coding Expertise", "React Enthusiast", "Node Architect", "Problem Solver", "Creative Thinker",
            "Team Collaboration", "Agile Development", "Life of a Coder", "Developer Mindset", "Tech Background",
            "Software Craftsmanship", "Continuous Learning", "Web Fundamentals", "Modern JS", "Code Quality",
            "Mentorship", "Open Source Contributor", "Tech Talks", "Industry Insights", "Future Goals", "Patna Engineering"
        ],
        ogImage: "https://abhimanyu-raj-cse.vercel.app/logo.png",
        ogType: "website",
        twitterCard: "summary",
        canonicalUrl: "https://abhimanyu-raj-cse.vercel.app/about",
        author: "Abhimanyu Raj"
    },
    {
        pageRoute: "/services",
        metaTitle: "Web Development Services | Front-End, Back-End, AI",
        metaDescription: "Offering premium digital services including custom website development, API integrations, e-commerce solutions, and AI-powered web applications.",
        keywords: [
            "Web Development Services", "Custom Website Design", "Frontend Development Service", "Backend API Development", "Full Stack Services",
            "E-commerce Development", "SaaS Application Building", "AI Integration Services", "SEO Optimization Service", "Performance Tuning",
            "UI Design Services", "UX Consulting", "Web App Upgrades", "Legacy Code Refactoring", "Database Design",
            "Cloud Hosting Setup", "CMS Development", "WordPress to React", "Tailwind Styling", "Responsive Web Design",
            "Mobile Friendly Sites", "Secure Web Apps", "Authentication Setup", "Payment Gateway Integration", "Stripe API",
            "Razorpay Integration", "Technical Support", "Website Maintenance", "Hire Web Developer", "Freelance Web Services", "Agency Quality Code"
        ],
        ogImage: "https://abhimanyu-raj-cse.vercel.app/logo.png",
        ogType: "website",
        twitterCard: "summary_large_image",
        canonicalUrl: "https://abhimanyu-raj-cse.vercel.app/services",
        author: "Abhimanyu Raj"
    },
    {
        pageRoute: "/projects",
        metaTitle: "My Portfolio Projects | Abhimanyu Raj",
        metaDescription: "Explore my latest web development projects ranging from dynamic e-commerce platforms to AI-integrated administration panels.",
        keywords: [
            "Portfolio Projects", "Web App Showcase", "MERN Stack Projects", "React Applications", "Next.js Portfolio",
            "Live Projects", "GitHub Repositories", "Code Examples", "System Architecture", "Design Patterns",
            "Client Work", "Personal Projects", "E-commerce Site Example", "Admin Dashboard UI", "AI Project Examples",
            "Full Stack Showcase", "Frontend Demos", "Backend Architecture Examples", "Scalable Apps", "Web Demonstrations",
            "Creative Code", "Interactive UI", "Three.js Examples", "Framer Motion Animations", "Responsive Portfolios",
            "Best Developer Projects", "Tech Stack Demonstrations", "Working Prototypes", "MVP Development", "Open Source Projects", "Developer Case Studies"
        ],
        ogImage: "https://abhimanyu-raj-cse.vercel.app/logo.png",
        ogType: "website",
        twitterCard: "summary_large_image",
        canonicalUrl: "https://abhimanyu-raj-cse.vercel.app/projects",
        author: "Abhimanyu Raj"
    },
    {
        pageRoute: "/contact",
        metaTitle: "Contact Me | Let's Build Something Amazing",
        metaDescription: "Get in touch with Abhimanyu Raj for freelance inquiries, project collaborations, or to hire a dedicated Full Stack Developer.",
        keywords: [
            "Contact Abhimanyu", "Hire Abhimanyu Raj", "Get in Touch", "Freelance Inquiry", "Web Project Quote",
            "Developer Contact Info", "Collaborate on Project", "Business Inquiry", "Email Developer", "WhatsApp Contact",
            "Let's Build", "Consultation Setup", "Tech Mentoring Contact", "Job Opportunities", "Recruit Express Developer",
            "Hire React Expert", "Contact Web Engineer", "Message Developer", "Project Proposal", "Outsourcing Development",
            "Contract Developer", "Remote Developer Contact", "Patna Developer Contact", "Indian Freelancer", "Code Assistance",
            "Technical Problem Solving", "Website Redesign Contact", "Maintenance Inquiry", "Custom Software Request", "Development Partnership"
        ],
        ogImage: "https://abhimanyu-raj-cse.vercel.app/logo.png",
        ogType: "website",
        twitterCard: "summary",
        canonicalUrl: "https://abhimanyu-raj-cse.vercel.app/contact",
        author: "Abhimanyu Raj"
    },
    {
        pageRoute: "/blog",
        metaTitle: "Tech Blog & Insights | Abhimanyu Raj",
        metaDescription: "Read my latest articles and tutorials on web development, React, Node.js, and modern software engineering practices.",
        keywords: [
            "Tech Blog", "Web Development Tutorials", "React Guides", "Node.js Articles", "Coding Tips",
            "Developer Insights", "Software Engineering Blog", "Programming Tutorials", "JavaScript Knowledge", "CSS Tricks",
            "Frontend Architecture", "Backend Patterns", "Database Optimization", "Deploying Apps", "Learning to Code",
            "Developer Lifestyle", "Tech News", "Framework Comparisons", "React vs Nextjs", "API Best Practices",
            "Security in Web", "Performance Metrics", "SEO Tips for Devs", "Freelancing Advice", "Career in Tech",
            "Code Reviews", "System Design Tutorials", "AI in Development", "Tech Trends", "Programming Blog", "Abhimanyu Blog"
        ],
        ogImage: "https://abhimanyu-raj-cse.vercel.app/logo.png",
        ogType: "website",
        twitterCard: "summary_large_image",
        canonicalUrl: "https://abhimanyu-raj-cse.vercel.app/blog",
        author: "Abhimanyu Raj"
    }
];

async function seed() {
    console.log('Seeding SEO data...');
    try {
        for (const data of seoData) {
            await prisma.sEOMetadata.upsert({
                where: { pageRoute: data.pageRoute },
                update: {
                    ...data,
                    lastUpdated: new Date()
                },
                create: data,
            });
            console.log(`Upserted SEO for ${data.pageRoute}`);
        }
        console.log('SEO Seeding completed successfully.');
    } catch (error) {
        console.error('Error seeding SEO:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
