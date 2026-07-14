import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Content from '../models/Content.js';
import Project from '../models/Project.js';

// Model import to facilitate seeding
const seedDatabase = async () => {
    try {
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

        // Seed Reviews if empty (9 premium reviews for 3x3 symmetry)
        const reviewCount = await Content.countDocuments({ category: 'Review' });
        if (reviewCount < 9) {
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
                },
                {
                    title: 'Michael Chen',
                    slug: 'review-michael-chen',
                    subtitle: 'Founder, E-Shop',
                    content: 'Very professional approach to SEO. He fixed our technical errors in week one, which immediately improved our loading speed and rankings.',
                    category: 'Review',
                    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100',
                    author: admin._id
                },
                {
                    title: 'David Thompson',
                    slug: 'review-david-thompson',
                    subtitle: 'E-Commerce Manager',
                    content: 'Highly recommended. He audits the whole site carefully and points out exactly what needs fixing. My conversions have skyrocketed.',
                    category: 'Review',
                    coverImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100',
                    author: admin._id
                },
                {
                    title: 'Emily Roberts',
                    slug: 'review-emily-roberts',
                    subtitle: 'Marketing VP',
                    content: 'His link-building strategy was phenomenal. The high DA sites he acquired links boosted our authority beyond our expectations.',
                    category: 'Review',
                    coverImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100',
                    author: admin._id
                },
                {
                    title: 'Sophie Laurent',
                    slug: 'review-sophie-laurent',
                    subtitle: 'Growth Head, SaaS',
                    content: 'The most data-driven SEO I have ever worked with. The content-led growth strategy we implemented scaled our organic pipe by 3x.',
                    category: 'Review',
                    coverImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100',
                    author: admin._id
                },
                {
                    title: 'Alex Rivera',
                    slug: 'review-alex-rivera',
                    subtitle: 'COO, GlobalLogix',
                    content: 'Managing international SEO is tough, but Abdul made it look easy. Our global traffic distribution is now perfectly optimized.',
                    category: 'Review',
                    coverImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100',
                    author: admin._id
                },
                {
                    title: 'Jessica Wu',
                    slug: 'review-jessica-wu',
                    subtitle: 'Product Lead, AI-Stream',
                    content: 'His ability to integrate SEO with our AI-driven product discovery was impressive. Results were visible much faster than expected.',
                    category: 'Review',
                    coverImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=100',
                    author: admin._id
                },
                {
                    title: 'Mark Stevens',
                    slug: 'review-mark-stevens',
                    subtitle: 'Director, FinTech Solutions',
                    content: 'The ROI we achieved through his strategy was outstanding. He doesn’t just focus on clicks; he focuses on bottom-line revenue.',
                    category: 'Review',
                    coverImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100',
                    author: admin._id
                }
            ]);
            console.log('✅ 9 Premium Reviews seeded successfully!');
        }

        // Seed Blogs if empty (6 premium blogs for 2 sets of 3)
        const blogCount = await Content.countDocuments({ category: 'Blog' });
        if (blogCount < 6) {
            if (blogCount > 0) await Content.deleteMany({ category: 'Blog' });
            await Content.create([
                {
                    title: 'Semantic SEO: Why Entities are the Future of Search',
                    content: `<h1>Moving Beyond Keywords</h1><p>In the modern search landscape, Google doesn't just look for words—it looks for <strong>meaning</strong>. Semantic SEO is the practice of building topical authority by mapping entities and search intent rather than just targeting individual keywords.</p>`,
                    category: 'Blog',
                    coverImage: '/uploads/semantic_seo.png',
                    imageAlt: 'Abstract representation of Semantic SEO and Knowledge Entities',
                    tags: ['SEO Strategy', 'Semantic SEO', 'Entities'],
                    author: admin._id
                },
                {
                    title: 'Core Web Vitals: The Definitive 2026 Performance Guide',
                    content: `<h1>Speed is a Ranking Factor</h1><p>A high-performance website is no longer a luxury; it's the foundation of your SEO success. Google's <strong>Core Web Vitals</strong> are critical metrics measure user experience.</p>`,
                    category: 'Blog',
                    coverImage: '/uploads/core_web_vitals.png',
                    imageAlt: 'Futuristic performance dashboard showing Core Web Vitals metrics',
                    tags: ['Technical SEO', 'Performance', 'Core Web Vitals'],
                    author: admin._id
                },
                {
                    title: 'Knowledge Graphs: How Google Understands Your Business',
                    content: `<h1>The Web of Data</h1><p>Google's Knowledge Graph is a massive database of facts. For your business to dominate search, you need to be a part of this structured data web.</p>`,
                    category: 'Blog',
                    coverImage: '/uploads/knowledge_graph.png',
                    imageAlt: 'Interconnected data nodes representing a digital Knowledge Graph',
                    tags: ['SEO', 'Structured Data', 'Knowledge Graph'],
                    author: admin._id
                },
                {
                    title: 'Revenue-First SEO: Architecting Growth for Maximum ROI',
                    content: `<h1>Traffic is Vanity, Revenue is Sanity</h1><p>Revenue-First SEO is about targeting the "commercial intent" keywords that drive actual sales and high-quality leads.</p>`,
                    category: 'Blog',
                    coverImage: '/uploads/revenue_seo.png',
                    imageAlt: 'Abstract growth chart representing ROI-focused SEO success',
                    tags: ['Business Growth', 'SEO ROI', 'Marketing Strategy'],
                    author: admin._id
                },
                {
                    title: 'The AI Search Revolution: Ranking in the Age of SGE',
                    content: `<h1>The LLM Era</h1><p>Generative Search Experience (SGE) is changing how users consume information. Learn how to optimize for AI-driven query responses and gain visibility in AI snapshots.</p>`,
                    category: 'Blog',
                    coverImage: '/uploads/ai_search.png',
                    imageAlt: 'Futuristic AI neural network representing search evolution',
                    tags: ['AI SEO', 'SGE', 'Search Future'],
                    author: admin._id
                },
                {
                    title: 'Mobile-First Indexing 2026: The Technical Edge',
                    content: `<h1>Mobile Only, Not Just Mobile First</h1><p>By 2026, desktop parity is no longer enough. We explore advanced mobile technical SEO, including edge rendering and mobile Core Web Vitals optimization.</p>`,
                    category: 'Blog',
                    coverImage: '/uploads/mobile_first.png',
                    imageAlt: 'Neon glowing mobile device representing advanced technical SEO',
                    tags: ['Mobile SEO', 'Technical Mastery', '2026 Trends'],
                    author: admin._id
                }
            ]);
            console.log('✅ 6 Premium Blogs seeded successfully!');
        }

        // Seed Case Studies (Project model) if empty (6 premium projects for symmetry)
        const projectCount = await Project.countDocuments();
        if (projectCount < 6) {
            if (projectCount > 0) await Project.deleteMany({});
            await Project.create([
                {
                    title: 'FashionHouse SEO Success',
                    description: 'FashionHouse partnering with us achieved a 120% boost in organic traffic across their boutique collections.',
                    situation: 'Low category rankings and technical debt.',
                    task: 'Consolidate site architecture and optimize for mobile velocity.',
                    action: 'Conducted a deep technical audit and implemented semantic content clusters.',
                    result: '120% Traffic increase and 2x conversions in 4 months.',
                    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000',
                    techStack: ['Audit', 'Technical SEO', 'Content Strategy'],
                    createdBy: admin._id
                },
                {
                    title: 'EduLearn Platform Growth',
                    description: 'The e-learning platform EduLearn saw a 75% growth in organic student acquisitions.',
                    situation: 'High competition from established academic aggregators.',
                    task: 'Dominate long-tail educational intent keywords.',
                    action: 'Built a robust knowledge base and secured high-authority academic backlinks.',
                    result: '75% Growth in students and top 3 results for 400+ targeted keywords.',
                    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1000',
                    techStack: ['Backlinks', 'Content Marketing', 'Long-tail Research'],
                    createdBy: admin._id
                },
                {
                    title: 'SaaS Growth Engine',
                    description: 'A data-driven SEO strategy that resulted in 300% growth for a fintech SaaS tool.',
                    situation: 'Market saturation and lack of product visibility.',
                    task: 'Scale content velocity and optimize for bottom-of-funnel conversion keywords.',
                    action: 'Engineered a scalable content production system and implemented advanced JSON-LD schema.',
                    result: '300% Lift in organic sign-ups and 50% lower customer acquisition cost.',
                    imageUrl: '/uploads/saas_growth.png',
                    techStack: ['Scalable Content', 'Schema', 'Conversion Focus'],
                    createdBy: admin._id
                },
                {
                    title: 'Global E-com ROI',
                    description: 'Scaling organic search revenue by 45% for a cross-border e-commerce brand.',
                    situation: 'Indexation bloat and international SEO misconfigurations.',
                    task: 'Globalize site structure and fix technical roadblocks for 50k+ products.',
                    action: 'Fixed hreflang issues and optimized server-side rendering for catalog pages.',
                    result: '45% Revenue growth and 60% increase in international organic sessions.',
                    imageUrl: '/uploads/ecom_roi.png',
                    techStack: ['International SEO', 'SSR Optimization', 'Crawl Budget'],
                    createdBy: admin._id
                },
                {
                    title: 'Local Authority Dominance',
                    description: 'Achieved #1 position in Map Pack for 80% of locations for a multi-city medical service provider.',
                    situation: 'Poor local visibility and inconsistent citation profile.',
                    task: 'Standardize GMB profiles and build a localized backlink engine.',
                    action: 'Automated citation management and launched 150+ hyper-local landing pages.',
                    result: 'Dominating 80% of local markets and 150% increase in appointment bookings.',
                    imageUrl: '/uploads/local_seo.png',
                    techStack: ['Local SEO', 'GMB Management', 'Citation Building'],
                    createdBy: admin._id
                },
                {
                    title: 'Real Estate Domination',
                    description: 'Scaling a national property portal’s organic leads by 400% through technical mastery.',
                    situation: 'Huge site size with significant crawl budget waste.',
                    task: 'Optimize crawl paths and eliminate thin content indexation.',
                    action: 'Implemented dynamic URL parameter handling and programmatic internal linking strategy.',
                    result: '400% Lead growth and secured #1 position for "Luxury Properties" nationally.',
                    imageUrl: '/uploads/real_estate.png',
                    techStack: ['Crawl Budget', 'Programmatic SEO', 'Data Mapping'],
                    createdBy: admin._id
                }
            ]);
            console.log('✅ 6 Premium Case Studies seeded successfully!');
        }

        const stats = {
            faqs: await Content.countDocuments({ category: 'FAQ' }),
            reviews: await Content.countDocuments({ category: 'Review' }),
            blogs: await Content.countDocuments({ category: 'Blog' }),
            projects: await Project.countDocuments()
        };
        console.log('🔍 Final Seeding Stats:', stats);

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
