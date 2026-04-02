import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Content from '../models/Content.js';
import Project from '../models/Project.js';

// Model import to facilitate seeding
const seedDatabase = async () => {
    try {
        // Models are now imported at the top

        const email = 'rehmanjatt194@gmail.com';
        let admin = await User.findOne({ email });
        
        if (!admin) {
            admin = await User.create({
                username: 'Rehman Jatt',
                email,
                password: 'Qonkar3972$', // Hash handled by model pre-save if present
                role: 'Admin',
                isVerified: true
            });
            console.log('✅ Admin user seeded!');
        }

        // Seed FAQs if empty
        const faqCount = await Content.countDocuments({ category: 'FAQ' });
        if (faqCount < 3) {
            if (faqCount > 0) await Content.deleteMany({ category: 'FAQ' });
            await Content.create([
                {
                    title: 'How long does it take to see SEO results?',
                    slug: 'faq-seo-results-timeline',
                    content: 'On average, it takes 3 to 6 months to see significant results. However, technical fixes (like Core Web Vitals) can show ranking improvements within 2-4 weeks.',
                    category: 'FAQ',
                    author: admin._id
                },
                {
                    title: 'What is Semantic SEO and why do I need it?',
                    slug: 'faq-semantic-seo-importance',
                    content: 'Semantic SEO focuses on topical authority and entities instead of just keywords. It helps Google understand the context of your content, leading to higher rankings for entire search categories.',
                    category: 'FAQ',
                    author: admin._id
                },
                {
                    title: 'Do you provide white-label SEO reports?',
                    slug: 'faq-white-label-reports',
                    content: 'Yes, I provide professional, white-labeled monthly reports featuring key metrics like organic traffic growth and keyword progression.',
                    category: 'FAQ',
                    author: admin._id
                }
            ]);
            console.log('✅ FAQs seeded!');
        }

        // Seed Reviews if empty
        const reviewCount = await Content.countDocuments({ category: 'Review' });
        if (reviewCount < 2) {
            if (reviewCount > 0) await Content.deleteMany({ category: 'Review' });
            await Content.create([
                {
                    title: 'John Davis',
                    slug: 'review-john-davis',
                    subtitle: 'CEO, TechStart',
                    content: 'Abdul Rehman transformed our organic traffic. Within 3 months, we saw a massive 200% bump in lead generation purely through Google search.',
                    category: 'Review',
                    coverImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100',
                    author: admin._id
                },
                {
                    title: 'Sarah Williams',
                    slug: 'review-sarah-williams',
                    subtitle: 'Marketing Director, LocalBiz',
                    content: 'An absolute game changer for our local presence. His technical SEO audit revealed issues we never knew existed.',
                    category: 'Review',
                    coverImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100',
                    author: admin._id
                }
            ]);
            console.log('✅ Reviews seeded!');
        }

        // Seed a sample Blog if empty
        const blogCount = await Content.countDocuments({ category: 'Blog' });
        if (blogCount < 2) {
            await Content.create([
                {
                    title: 'The Future of SEO in the AI Era',
                    content: '<h1>The Future is Semantic</h1><p>SEO is no longer just about keywords. With the rise of AI-driven search engines, context and authority are more important than ever. High-quality content that provides real answers to user intent is the only way to stay competitive in 2026.</p>',
                    category: 'Blog',
                    tags: ['AI', 'SEO', 'Marketing'],
                    coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000',
                    author: admin._id
                },
                {
                    title: 'How Core Web Vitals Impact Your Google Rankings',
                    content: `
                        <h1>The Three Pillars of User Experience</h1>
                        <p>Google's Core Web Vitals (LCP, FID, and CLS) are now a critical ranking factor for every website. If your site is slow to load or has shifting elements, you are likely losing traffic to competitors who have optimized their technical SEO.</p>
                        
                        <h2>Why Mobile Performance Matters</h2>
                        <p>Most searches now happen on mobile devices. If your LCP (Largest Contentful Paint) is above 2.5 seconds, Google's algorithms will deprioritize your content in favor of faster, more responsive pages.</p>
                        
                        <h2>Building Technical Authority</h2>
                        <p>For a detailed breakdown of these metrics, you should check out the official guide on <a href="https://web.dev/vitals/" target="_blank" class="text-blue-500 underline font-bold hover:text-blue-300">Google's Web Dev Portal</a>. This is the source of truth for all SEO specialists.</p>
                        
                        <p>By optimizing these vitals, you're not just pleasing the search engines—you're providing a better experience for your visitors, which invariably leads to higher conversion rates.</p>
                    `,
                    category: 'Blog',
                    slug: 'core-web-vitals-impact-seo-2026',
                    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1470',
                    tags: ['SEO', 'Core Web Vitals', 'Google Rankings'],
                    author: admin._id
                }
            ]);
            console.log('✅ Blogs seeded!');
        }

        // Seed Projects if empty
        const projectCount = await Project.countDocuments();
        if (projectCount < 2) {
            await Project.create([
                {
                    title: 'E-commerce Traffic Surge',
                    description: 'Increased organic revenue by 300% for a luxury fashion brand by optimizing technical infrastructure and semantic architecture.',
                    techStack: ['Schema.org', 'Screaming Frog', 'Technical SEO'],
                    situation: 'The client faced stagnant organic growth despite a high-quality product line. Site architecture was fragmented and cannibalizing key search terms.',
                    task: 'Revamp the entire URL structure, implement advanced Product Schema, and fix Core Web Vitals to improve mobile ranking post-update.',
                    action: 'Conducted a deep technical audit, consolidated redundant pages, and optimized LCP/FID via server-side caching and image compression.',
                    result: 'Organic traffic grew by 150% in 5 months, with a 300% increase in revenue specifically from high-intent category searches.',
                    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000',
                    createdBy: admin._id
                },
                {
                    title: 'SaaS Lead Generation',
                    description: 'Dominated high-intent B2B keywords through topical authority and entity-based content strategy.',
                    techStack: ['Ahrefs', 'Content Strategy', 'Link Building'],
                    situation: 'A fintech startup struggled to compete with established giants for core "expense management" keywords.',
                    task: 'Build topical authority through a cluster model and secure high-authority backlinks from reputable tech publications.',
                    action: 'Published 15 deep-dive guides on expense automation and secured placements on Forbes and TechCrunch via strategic outreach.',
                    result: 'Achieved #1 ranking for "Best Expense Management Software" within 6 months, driving 500+ MQLs per month.',
                    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000',
                    createdBy: admin._id
                }
            ]);
            console.log('✅ Projects seeded!');
            const checkProjects = await Project.find({});
            console.log(`🔍 Verification - Projects in DB: ${checkProjects.length}`);
        }
    } catch (err) {
        console.error('❌ Seeding failed:', err.message);
    }
};

/**
 * Maqsad: MongoDB ya Local Memory Fallback ke saath connection manage karna.
 */
const connectDB = async () => {
    try {
        console.log('⏳ Connecting to MongoDB...');
        // Set a short timeout so we don't wait forever
        await mongoose.connect(process.env.MONGO_URI, { 
            serverSelectionTimeoutMS: 2000,
            connectTimeoutMS: 2000
        });
        console.log('🚀 MongoDB Connected Successfully!');
    } catch (error) {
        console.warn('⚠️  Local MongoDB Not Found. Switching to ZERO-CONFIG MEMORY MODE...');
        try {
            const mongoServer = await MongoMemoryServer.create();
            const uri = mongoServer.getUri();
            await mongoose.connect(uri);
            console.log('✅ In-Memory MongoDB Activated!');
            
            // Seed the memory database
            await seedDatabase();
        } catch (innerError) {
            console.error('❌ Failed to start In-Memory MongoDB:', innerError.message);
        }
    }
};

export default connectDB;
