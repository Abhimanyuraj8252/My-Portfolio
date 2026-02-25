import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const reviews = [
    { name: 'Aarav Sharma', designation: 'CEO', company: 'TechNova India', message: 'Abhimanyu is an exceptional developer. His attention to detail and ability to deliver complex solutions on time is truly commendable. Highly recommended!', rating: 5, isApproved: true },
    { name: 'Priya Patel', designation: 'Marketing Director', company: 'GrowthX', message: 'Working with Abhimanyu was a breeze. He understood our vision perfectly and translated it into a beautiful, functional website. The entire process was smooth and professional.', rating: 5, isApproved: true },
    { name: 'Vikram Singh', designation: 'Founder', company: 'StartUp Hub', message: 'I was blown away by the quality of work. Abhimanyu not only met our expectations but exceeded them. His technical skills are top-notch.', rating: 5, isApproved: true },
    { name: 'Neha Gupta', designation: 'Product Manager', company: 'Innovate Solutions', message: 'Great communication and excellent technical skills. Abhimanyu is a proactive problem solver who consistently delivers high-quality code. A valuable asset to any project.', rating: 4, isApproved: true },
    { name: 'Rahul Desai', designation: 'CTO', company: 'FinTech Solutions', message: 'One of the best freelancers I have worked with. He delivered the project before the deadline without compromising on quality. Very reliable.', rating: 5, isApproved: true },
    { name: 'Sneha Reddy', designation: 'Creative Director', company: 'Design Studio', message: 'Abhimanyu has a great eye for design and user experience. He seamlessly integrated our designs into a flawless frontend application. Fantastic work!', rating: 5, isApproved: true },
    { name: 'Arjun Kapoor', designation: 'Operations Manager', company: 'LogiCorp', message: 'The web app he built for us streamlined our internal processes significantly. It is fast, secure, and very easy to use. Great job!', rating: 4, isApproved: true },
    { name: 'Kavita Joshi', designation: 'E-commerce Owner', company: 'Trendz', message: 'Helped us revamp our e-commerce platform. The new site is much faster and more user-friendly, leading to a noticeable increase in sales.', rating: 5, isApproved: true },
    { name: 'Sanjay Verma', designation: 'Freelancer', company: null, message: 'Collaborated with him on a few projects. He is highly skilled in React and Node.js. Always brings innovative solutions to the table.', rating: 5, isApproved: true },
    { name: 'Pooja Mehta', designation: 'HR Manager', company: 'TalentAcquire', message: 'Developed our internal career portal. The system is robust and handles hundreds of applications smoothly. Very satisfied with the outcome.', rating: 4, isApproved: true },
    { name: 'Ravi Kumar', designation: 'VP of Engineering', company: 'TechSynergy', message: 'Exceptional full-stack developer. His code is clean, well-documented, and highly scalable. Look forward to working with him again.', rating: 5, isApproved: true },
    { name: 'Meera Nair', designation: 'Data Analyst', company: 'DataSense', message: 'Built a custom dashboard for our analytics team. The data visualization is spot on and the performance is incredible.', rating: 5, isApproved: true },
    { name: 'Amitabh Bachchan', designation: 'Director', company: 'MediaCorp', message: 'Professional, punctual, and highly skilled. He handled our website revamp with utmost care. The final product is exactly what we envisioned.', rating: 5, isApproved: true },
    { name: 'Rekha Iyer', designation: 'Startup Co-founder', company: null, message: 'He was instrumental in building our MVP. His rapid prototyping skills and technical insights saved us a lot of time and money.', rating: 4, isApproved: true },
    { name: 'Deepak Chawla', designation: 'IT Consultant', company: 'TechAdvisors', message: 'A thorough professional. He understands the business requirements perfectly and translates them into flawless technical solutions.', rating: 5, isApproved: true },
    { name: 'Anjali Desai', designation: 'UI/UX Designer', company: 'CreativeMinds', message: 'Loved working with Abhimanyu. He pays great attention to UI details and ensures the final implementation matches the design exactly.', rating: 5, isApproved: true },
    { name: 'Karan Malhotra', designation: 'Project Manager', company: 'AgileSoft', message: 'Delivered the project exactly as scoped. His agile approach and regular updates kept the whole team aligned. Great development partner.', rating: 4, isApproved: true },
    { name: 'Sunita Rao', designation: 'Educator', company: 'LearnTech', message: 'Developed a custom LMS for our institute. The platform is intuitive and our students love it. Very responsive to our feedback during development.', rating: 5, isApproved: true },
    { name: 'Rajeev Menon', designation: 'Chief Architect', company: 'BuildRight', message: 'Strong architectural knowledge. He designed a system that is not only scalable but also easy to maintain. A true engineering talent.', rating: 5, isApproved: true },
    { name: 'Swati Bansal', designation: 'Marketing Exec', company: 'AdVantage', message: 'Helped us build a highly interactive campaign landing page. The animations and load times were phenomenal. Highly recommend his services.', rating: 5, isApproved: true },
    { name: 'Gaurav Jain', designation: 'Fintech Founder', company: 'PayQuick', message: 'Security and performance were our top priorities, and Abhimanyu delivered on both fronts. The application is rock solid.', rating: 5, isApproved: true },
    { name: 'Isha Gupta', designation: 'Business Analyst', company: 'CorpStrat', message: 'He has a knack for complex problem-solving. Simplified our complex workflows into an easy-to-use web interface.', rating: 4, isApproved: true },
    { name: 'Mohit Agarwal', designation: 'Tech Lead', company: 'DevSquad', message: 'Clean code, great communication, and timely delivery. What more could you ask for? A fantastic developer to have on your team.', rating: 5, isApproved: true },
    { name: 'Nisha Singh', designation: 'Content Strategist', company: 'WordCrafters', message: 'Built a fantastic custom CMS for us. It is so much faster and easier to use than our previous off-the-shelf solution.', rating: 5, isApproved: true },
    { name: 'Pranav Joshi', designation: 'Logistics Head', company: 'FastTrack', message: 'Developed our tracking dashboard. The real-time updates and seamless API integrations are exactly what we needed.', rating: 5, isApproved: true },
    { name: 'Tanvi Khanna', designation: 'Event Manager', company: 'Evento', message: 'Created a beautiful ticketing and event management site for us. Very responsive and handled the complex logic perfectly.', rating: 4, isApproved: true },
    { name: 'Aashish Bhatia', designation: 'Real Estate Broker', company: 'PrimeEstates', message: 'The property listing platform he built for us is top-notch. Fast search, great image handling, and very user-friendly.', rating: 5, isApproved: true },
    { name: 'Ritu Kapoor', designation: 'Fitness Coach', company: 'FitLife', message: 'Built my personal brand website and booking system. It looks amazing and works flawlessly. Highly professional service.', rating: 5, isApproved: true },
    { name: 'Varun Dhawan', designation: 'Restaurant Owner', company: 'SpiceRoute', message: 'The online ordering system he developed is exactly what our restaurant needed. It is robust and has significantly boosted our online sales.', rating: 5, isApproved: true },
    { name: 'Smriti Sen', designation: 'Blogger', company: null, message: 'Helped me migrate and redesign my blog. The new site is blazingly fast and SEO optimized. Very happy with the results!', rating: 5, isApproved: true },
    { name: 'Aditya Nath', designation: 'Automobile Dealer', company: 'AutoHub', message: 'Created a sleek inventory management system for our dealership. It has saved us countless hours of manual work.', rating: 4, isApproved: true },
    { name: 'Kriti Sanon', designation: 'Fashion Designer', company: 'LabelKriti', message: 'My portfolio website looks stunning! The animations and layout are exactly what I wanted. He truly brought my vision to life.', rating: 5, isApproved: true },
    { name: 'Yash Vardhan', designation: 'Financial Advisor', company: 'WealthCare', message: 'Secure, reliable, and professional. The client portal he built is exactly what we needed to serve our clients better.', rating: 5, isApproved: true },
    { name: 'Divya Prakash', designation: 'NGO Director', company: 'HopeFoundation', message: 'Built a beautiful donation platform for us. It is easy to use and has helped us reach more donors. Very grateful for his work.', rating: 5, isApproved: true },
    { name: 'Rohan Mehra', designation: 'Gaming Streamer', company: null, message: 'The custom overlay and stream tracking site he built is insane! Very cool features and super fast.', rating: 5, isApproved: true }
];

async function main() {
    console.log('Start seeding reviews...');
    for (const review of reviews) {
        await prisma.testimonial.create({
            data: review,
        });
    }
    console.log(`Seeded ${reviews.length} reviews.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
