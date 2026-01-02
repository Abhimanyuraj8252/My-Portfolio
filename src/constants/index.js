import {
    mobile,
    backend,
    creator,
    web,
    javascript,
    typescript,
    html,
    css,
    reactjs,
    redux,
    tailwind,
    nodejs,
    mongodb,
    git,
    figma,
    docker,
    threejs,
    carrent,
    jobit,
    tripguide,
    python,
    java,
    cpp,
    c,
    csharp,
    php,
    kotlin,
    bootstrap,
    angular,
    android,
    mysql,
    xml,
} from "../assets";

export const navLinks = [
    {
        id: "about",
        title: "About",
    },
    {
        id: "experience",
        title: "Experience",
    },
    {
        id: "projects",
        title: "Projects",
    },
    {
        id: "contact",
        title: "Contact",
    },
    {
        id: "blog",
        title: "Blog",
    }
];

export const socialLinks = [
    {
        name: "GitHub",
        url: "https://github.com/Abhimanyuraj8252",
    },
    {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/abhimanyu-raj-8a853a32a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    },
    {
        name: "Instagram",
        url: "https://www.instagram.com/sudo_abhimanyu?igsh=MWRhaHdoY2o2NmI5dQ==",
    },
    {
        name: "Facebook",
        url: "https://www.facebook.com/share/17G87iLFUJ/",
    },
    {
        name: "Twitter",
        url: "https://x.com/AbhimanyuR75031",
    },
    {
        name: "Reddit",
        url: "https://www.reddit.com/u/Hacker_Abhimanyu/s/GouOuxRdCq",
    },
];

const services = [
    {
        title: "Web Developer",
        icon: web,
    },
    {
        title: "React Native Developer",
        icon: mobile,
    },
    {
        title: "Backend Developer",
        icon: backend,
    },
    {
        title: "Content Creator",
        icon: creator,
    },
];

const technologies = [
    { name: "HTML 5", icon: html },
    { name: "CSS 3", icon: css },
    { name: "JavaScript", icon: javascript },
    { name: "TypeScript", icon: typescript },
    { name: "React JS", icon: reactjs },
    { name: "Redux Toolkit", icon: redux },
    { name: "Tailwind CSS", icon: tailwind },
    { name: "Node JS", icon: nodejs },
    { name: "MongoDB", icon: mongodb },
    { name: "Three JS", icon: threejs },
    { name: "git", icon: git },
    { name: "figma", icon: figma },
    { name: "docker", icon: docker },
    { name: "Python", icon: python },
    { name: "Java", icon: java },
    { name: "C++", icon: cpp },
    { name: "C", icon: c },
    { name: "C#", icon: csharp },
    { name: "PHP", icon: php },
    { name: "Kotlin", icon: kotlin },
    { name: "Bootstrap", icon: bootstrap },
    { name: "Angular", icon: angular },
    { name: "Android", icon: android },
    { name: "SQL", icon: mysql },
    { name: "XML", icon: xml },
];

const experiences = [
    {
        title: "Freelance Web Developer",
        company_name: "Self Employed",
        icon: creator, // Using creator as placeholder for Freelance
        iconBg: "#383E56",
        date: "September 2025 - Present", // Matches Resume
        points: [
            "Designed and developed custom websites for local clients, enhancing their brand visibility.",
            "Created advanced Android media player applications, focusing on user experience and functionality.",
            "Built real-time tracking systems for dynamic location updates, ensuring accuracy and efficiency.",
            "Emphasized writing clean, scalable, and efficient code to maintain high-quality standards.",
        ],
    },
    {
        title: "Diploma in Computer Science & Engineering",
        company_name: "Digambar Jain Polytechnic",
        icon: backend, // Placeholder
        iconBg: "#E6DEDD",
        date: "September 2023 - August 2026",
        points: [
            "Pursuing Diploma in Computer Science and Engineering.",
            "Relevant Coursework: Data Structures, Algorithms, DBMS, Operating Systems.",
        ]
    },
    {
        title: "Programming With Python Certification",
        company_name: "Internshala Trainings",
        icon: python,
        iconBg: "#E6DEDD",
        date: "Jul 2025",
        points: [
            "Successfully completed a 6 weeks online certified training on Programming with Python.",
            "Covered Introduction to Python, Using Variables, Basics, OOP, SQLite Database, GUI with PyQT, Application of Python in Various Disciplines.",
            "Scored 98% in the final assessment and was a top performer in the training.",
        ]
    }
];

const testimonials = [
    // Initial dummy data, will be replaced by Supabase data
    {
        testimonial:
            "I thought it was impossible to make a website as beautiful as our product, but Abhimanyu proved me wrong.",
        name: "Sara Lee",
        designation: "CFO",
        company: "Acme Co",
        image: "https://randomuser.me/api/portraits/women/4.jpg",
    },
];

const projects = [
    {
        name: "LuxStay Hotel",
        description: "A luxury hotel booking website featuring elegant design, room showcases, booking system, and premium amenities. Experience sophistication redefined.",
        category: "web",
        featured: true,
        tags: [
            { name: "html", color: "blue-text-gradient" },
            { name: "tailwind", color: "green-text-gradient" },
            { name: "javascript", color: "pink-text-gradient" },
        ],
        image: "/project-thumbs/luxstay-hotel.png",
        source_code_link: "https://github.com/Abhimanyuraj8252/luxstayhotel",
        live_link: "https://luxstayhotel-ruby.vercel.app/",
    },
    {
        name: "Gym & Fitness Centre",
        description: "A comprehensive fitness website for gyms, featuring class schedules, trainer profiles, and membership details.",
        category: "web",
        featured: true,
        tags: [
            { name: "html", color: "blue-text-gradient" },
            { name: "css", color: "green-text-gradient" },
            { name: "js", color: "pink-text-gradient" },
        ],
        image: "/project-thumbs/gym-fitness.png",
        source_code_link: "https://github.com/Abhimanyuraj8252/Gym-Fitness-Centre",
        live_link: "https://exquisite-frangollo-888ef4.netlify.app/",
    },
    {
        name: "Digital Wedding Invitation",
        description: "An interactive, digital wedding invitation card replacing traditional paper invites with a modern web experience.",
        category: "web",
        featured: true,
        tags: [
            { name: "html", color: "blue-text-gradient" },
            { name: "css", color: "green-text-gradient" },
            { name: "js", color: "pink-text-gradient" },
        ],
        image: "/project-thumbs/digital-wedding.png",
        source_code_link: "https://github.com/Abhimanyuraj8252/Digital-Wedding-Invitation-Shadi-Card-",
        live_link: "https://digital-wedding-invitation-shadi-card.netlify.app/",
    },
    {
        name: "School ESP",
        description: "A School Management System designed to streamline administrative tasks and improve communication.",
        category: "web",
        featured: true,
        tags: [
            { name: "react", color: "blue-text-gradient" },
            { name: "node", color: "green-text-gradient" },
            { name: "mongodb", color: "pink-text-gradient" },
        ],
        image: "/project-thumbs/school-esp.png",
        source_code_link: "https://github.com/Abhimanyuraj8252/School-ESP",
        live_link: "https://schoolesp.netlify.app/",
    },
    {
        name: "Politician Portfolio",
        description: "A professional portfolio website tailored for public figures and politicians to showcase their work and vision.",
        category: "web",
        tags: [
            { name: "html", color: "blue-text-gradient" },
            { name: "css", color: "green-text-gradient" },
            { name: "js", color: "pink-text-gradient" },
        ],
        image: "/project-thumbs/politician-portfolio.png",
        source_code_link: "https://github.com/Abhimanyuraj8252/Politician-Portfolio-Neta-Ji-",
        live_link: "https://abhimanyuraj8252.github.io/Politician-Portfolio-Neta-Ji-/",
    },
    {
        name: "Digital Visiting Card (vCard)",
        description: "A modern digital visiting card solution allowing easy sharing of contact information via a web link.",
        category: "web",
        tags: [
            { name: "html", color: "blue-text-gradient" },
            { name: "css", color: "green-text-gradient" },
            { name: "js", color: "pink-text-gradient" },
        ],
        image: "/project-thumbs/digital-vcard.png",
        source_code_link: "https://github.com/Abhimanyuraj8252/Digital-Visiting-Card-vCard-?tab=readme-ov-file",
        live_link: "https://abhimanyuraj8252.github.io/Digital-Visiting-Card-vCard-/",
    },
    {
        name: "Coaching Centre Education",
        description: "An educational platform for coaching centers to manage students, courses, and resources effectively.",
        category: "web",
        tags: [
            { name: "react", color: "blue-text-gradient" },
            { name: "tailwind", color: "green-text-gradient" },
        ],
        image: "/project-thumbs/coaching-centre.png",
        source_code_link: "https://github.com/Abhimanyuraj8252/Coaching-Centre-Education-",
        live_link: "https://coaching-centre-education.netlify.app/",
    },
    {
        name: "QUANTUM TOOLS",
        description: "A suite of online utilities and tools designed to assist developers and general users with daily tasks.",
        category: "tools",
        tags: [
            { name: "react", color: "blue-text-gradient" },
            { name: "api", color: "green-text-gradient" },
        ],
        image: "/project-thumbs/quantum-tools.png",
        source_code_link: "https://github.com/Abhimanyuraj8252/QUANTUM-TOOLS",
        live_link: "https://quantumtools.me/",
    },
    {
        name: "Echoryn Media Player",
        description: "A feature-rich Android media player application supporting various audio and video formats.",
        category: "mobile",
        tags: [
            { name: "kotlin", color: "blue-text-gradient" },
            { name: "android", color: "green-text-gradient" },
            { name: "xml", color: "pink-text-gradient" },
        ],
        image: "/project-thumbs/echoryn.png",
        source_code_link: "https://github.com/Abhimanyuraj8252/EchorynMediaPlayer",
        live_link: "", // No live link provided for Android app
    },
    {
        name: "Astrologer Website",
        description: "A specialized website for astrology services, allowing clients to book consultations and view horoscopes.",
        category: "web",
        tags: [
            { name: "html", color: "blue-text-gradient" },
            { name: "css", color: "green-text-gradient" },
            { name: "js", color: "pink-text-gradient" },
        ],
        image: "/project-thumbs/astrologer.png",
        source_code_link: "", // No Github link provided
        live_link: "https://astrologer-template.netlify.app/",
    },
];

export { services, technologies, experiences, testimonials, projects };
