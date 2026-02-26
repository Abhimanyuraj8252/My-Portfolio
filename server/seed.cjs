const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const technologies = [
    { name: "HTML 5", iconName: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", category: "Language", proficiency: 90, isFeatured: true },
    { name: "CSS 3", iconName: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", category: "Language", proficiency: 85, isFeatured: true },
    { name: "JavaScript", iconName: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", category: "Language", proficiency: 90, isFeatured: true },
    { name: "TypeScript", iconName: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", category: "Language", proficiency: 80, isFeatured: true },
    { name: "React JS", iconName: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", category: "Frontend", proficiency: 95, isFeatured: true },
    { name: "Redux Toolkit", iconName: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg", category: "Frontend", proficiency: 85, isFeatured: true },
    { name: "Tailwind CSS", iconName: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg", category: "Frontend", proficiency: 95, isFeatured: true },
    { name: "Node JS", iconName: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", category: "Backend", proficiency: 80, isFeatured: true },
    { name: "MongoDB", iconName: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", category: "Backend", proficiency: 85, isFeatured: true },
    { name: "Three JS", iconName: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg", category: "Frontend", proficiency: 70, isFeatured: true },
    { name: "git", iconName: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", category: "Tools", proficiency: 90, isFeatured: true },
    { name: "figma", iconName: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg", category: "Tools", proficiency: 75, isFeatured: true },
    { name: "docker", iconName: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", category: "Tools", proficiency: 70, isFeatured: true },
    { name: "Python", iconName: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", category: "Language", proficiency: 85, isFeatured: true },
    { name: "Java", iconName: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg", category: "Language", proficiency: 80, isFeatured: true },
    { name: "C++", iconName: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg", category: "Language", proficiency: 75, isFeatured: true },
    { name: "C", iconName: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg", category: "Language", proficiency: 80, isFeatured: true },
    { name: "C#", iconName: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg", category: "Language", proficiency: 75, isFeatured: true },
    { name: "PHP", iconName: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg", category: "Backend", proficiency: 70, isFeatured: true },
    { name: "Kotlin", iconName: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg", category: "Language", proficiency: 75, isFeatured: true },
    { name: "Bootstrap", iconName: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg", category: "Frontend", proficiency: 90, isFeatured: true },
    { name: "Angular", iconName: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg", category: "Frontend", proficiency: 70, isFeatured: true },
    { name: "Android", iconName: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg", category: "Tools", proficiency: 80, isFeatured: true },
    { name: "SQL", iconName: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg", category: "Language", proficiency: 85, isFeatured: true },
    { name: "XML", iconName: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xml/xml-original.svg", category: "Language", proficiency: 90, isFeatured: true },
];

const projects = [
    {
        title: "LuxStay Hotel",
        slug: "luxstay-hotel",
        description: "A luxury hotel booking website featuring elegant design, room showcases, booking system, and premium amenities. Experience sophistication redefined.",
        category: "Web",
        status: "Completed",
        isFeatured: true,
        techStack: ["html", "tailwind", "javascript"],
        thumbnailUrl: "/project-thumbs/luxstay-hotel.png",
        source_code_link: "https://github.com/Abhimanyuraj8252/luxstayhotel",
        liveUrl: "https://luxstayhotel-ruby.vercel.app/",
    },
    {
        title: "Gym & Fitness Centre",
        slug: "gym-fitness",
        description: "A comprehensive fitness website for gyms, featuring class schedules, trainer profiles, and membership details.",
        category: "Web",
        status: "Completed",
        isFeatured: true,
        techStack: ["html", "css", "js"],
        thumbnailUrl: "/project-thumbs/gym-fitness.png",
        source_code_link: "https://github.com/Abhimanyuraj8252/Gym-Fitness-Centre",
        liveUrl: "https://exquisite-frangollo-888ef4.netlify.app/",
    },
    {
        title: "Digital Wedding Invitation",
        slug: "digital-wedding",
        description: "An interactive, digital wedding invitation card replacing traditional paper invites with a modern web experience.",
        category: "Web",
        status: "Completed",
        isFeatured: true,
        techStack: ["html", "css", "js"],
        thumbnailUrl: "/project-thumbs/digital-wedding.png",
        source_code_link: "https://github.com/Abhimanyuraj8252/Digital-Wedding-Invitation-Shadi-Card-",
        liveUrl: "https://digital-wedding-invitation-shadi-card.netlify.app/",
    },
    {
        title: "School ESP",
        slug: "school-esp",
        description: "A School Management System designed to streamline administrative tasks and improve communication.",
        category: "Web",
        status: "Completed",
        isFeatured: true,
        techStack: ["react", "node", "mongodb"],
        thumbnailUrl: "/project-thumbs/school-esp.png",
        source_code_link: "https://github.com/Abhimanyuraj8252/School-ESP",
        liveUrl: "https://schoolesp.netlify.app/",
    },
    {
        title: "Politician Portfolio",
        slug: "politician-portfolio",
        description: "A professional portfolio website tailored for public figures and politicians to showcase their work and vision.",
        category: "Web",
        status: "Completed",
        isFeatured: false,
        techStack: ["html", "css", "js"],
        thumbnailUrl: "/project-thumbs/politician-portfolio.png",
        source_code_link: "https://github.com/Abhimanyuraj8252/Politician-Portfolio-Neta-Ji-",
        liveUrl: "https://abhimanyuraj8252.github.io/Politician-Portfolio-Neta-Ji-/",
    },
    {
        title: "Digital Visiting Card (vCard)",
        slug: "digital-vcard",
        description: "A modern digital visiting card solution allowing easy sharing of contact information via a web link.",
        category: "Web",
        status: "Completed",
        isFeatured: false,
        techStack: ["html", "css", "js"],
        thumbnailUrl: "/project-thumbs/digital-vcard.png",
        source_code_link: "https://github.com/Abhimanyuraj8252/Digital-Visiting-Card-vCard-?tab=readme-ov-file",
        liveUrl: "https://abhimanyuraj8252.github.io/Digital-Visiting-Card-vCard-/",
    },
    {
        title: "Coaching Centre Education",
        slug: "coaching-centre",
        description: "An educational platform for coaching centers to manage students, courses, and resources effectively.",
        category: "Web",
        status: "Completed",
        isFeatured: false,
        techStack: ["react", "tailwind"],
        thumbnailUrl: "/project-thumbs/coaching-centre.png",
        source_code_link: "https://github.com/Abhimanyuraj8252/Coaching-Centre-Education-",
        liveUrl: "https://coaching-centre-education.netlify.app/",
    },
    {
        title: "QUANTUM TOOLS",
        slug: "quantum-tools",
        description: "A suite of online utilities and tools designed to assist developers and general users with daily tasks.",
        category: "Tools",
        status: "Completed",
        isFeatured: false,
        techStack: ["react", "api"],
        thumbnailUrl: "/project-thumbs/quantum-tools.png",
        source_code_link: "https://github.com/Abhimanyuraj8252/QUANTUM-TOOLS",
        liveUrl: "https://quantumtools.me/",
    },
    {
        title: "Echoryn Media Player",
        slug: "echoryn-media-player",
        description: "A feature-rich Android media player application supporting various audio and video formats.",
        category: "App",
        status: "Completed",
        isFeatured: false,
        techStack: ["kotlin", "android", "xml"],
        thumbnailUrl: "/project-thumbs/echoryn.png",
        source_code_link: "https://github.com/Abhimanyuraj8252/EchorynMediaPlayer",
        liveUrl: "",
    },
    {
        title: "Astrologer Website",
        slug: "astrologer",
        description: "A specialized website for astrology services, allowing clients to book consultations and view horoscopes.",
        category: "Web",
        status: "Completed",
        isFeatured: false,
        techStack: ["html", "css", "js"],
        thumbnailUrl: "/project-thumbs/astrologer.png",
        source_code_link: "",
        liveUrl: "https://astrologer-template.netlify.app/",
    }
];

async function main() {
    console.log(`Start seeding ...`);

    // Clear existing to prevent duplicates
    await prisma.skill.deleteMany({});
    await prisma.project.deleteMany({});

    for (const t of technologies) {
        const skill = await prisma.skill.create({
            data: t,
        });
        console.log(`Created skill with id: ${skill.id}`);
    }

    for (const p of projects) {
        // Map the properties correctly to the Prisma model
        const project = await prisma.project.create({
            data: {
                title: p.title,
                slug: p.slug,
                description: p.description,
                category: p.category,
                status: p.status,
                isFeatured: p.isFeatured,
                techStack: p.techStack,
                thumbnailUrl: p.thumbnailUrl,
                repoUrl: p.source_code_link || "",
                liveUrl: p.liveUrl || ""
            },
        });
        console.log(`Created project with id: ${project.id}`);
    }
    console.log(`Seeding finished.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
