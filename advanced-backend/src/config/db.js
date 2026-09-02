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

        // Seed Reviews if empty (6 premium reviews for 2x3 symmetry)
        const reviewCount = await Content.countDocuments({ category: 'Review' });
        if (reviewCount < 6) {
            if (reviewCount > 0) await Content.deleteMany({ category: 'Review' });
            await Content.create([
                {
                    title: 'Ahmed Raza',
                    slug: 'review-ahmed-raza',
                    subtitle: 'CEO, StyleKart',
                    content: 'Abdul completely transformed our online presence. Within 3 months we went from page 5 to page 1 for our main target keywords. The ROI has been excellent.',
                    category: 'Review',
                    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100',
                    author: admin._id
                },
                {
                    title: 'Zainab Malik',
                    slug: 'review-zainab-malik',
                    subtitle: 'Founder, PureFit Nutrition',
                    content: 'The SEO strategy provided was comprehensive and results-driven. Our traffic grew by 65% in a few months and our leads doubled. Great work.',
                    category: 'Review',
                    coverImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100',
                    author: admin._id
                },
                {
                    title: 'Fatima Hassan',
                    slug: 'review-fatima-hassan',
                    subtitle: 'Marketing Director, Al-Madina',
                    content: 'Best SEO investment we\'ve ever made. The technical audit alone uncovered critical issues we had no idea about. Our Lighthouse score went from 54 to 98.',
                    category: 'Review',
                    coverImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100',
                    author: admin._id
                },
                {
                    title: 'James Wilson',
                    slug: 'review-james-wilson',
                    subtitle: 'CTO, CloudSync',
                    content: 'Abdul\'s approach to technical SEO and content clustering helped us outrank much larger competitors in the B2B SaaS space.',
                    category: 'Review',
                    coverImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100',
                    author: admin._id
                },
                {
                    title: 'Bilal Khan',
                    slug: 'review-bilal-khan',
                    subtitle: 'Owner, UrbanNest',
                    content: 'He optimized our local SEO and GMB profile. We are now generating regular inquiries directly from Google Maps without spending a dime on ads.',
                    category: 'Review',
                    coverImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100',
                    author: admin._id
                },
                {
                    title: 'Sara Ahmed',
                    slug: 'review-sara-ahmed',
                    subtitle: 'Content Head, QuickByte',
                    content: 'The content strategy was brilliant. We went from writing random blog posts to creating targeted entity clusters that actually rank and drive relevant traffic.',
                    category: 'Review',
                    coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100',
                    author: admin._id
                }
            ]);
            console.log('✅ 6 Premium Reviews seeded successfully!');
        }

        // Seed Blogs if empty (6 premium blogs for 2 sets of 3)
        const blogCount = await Content.countDocuments({ category: 'Blog' });
        if (blogCount < 6) {
            if (blogCount > 0) await Content.deleteMany({ category: 'Blog' });
            await Content.create([
                {
                    title: 'How I Fixed 47 Technical SEO Errors and Doubled Organic Traffic',
                    content: `<h1>The Technical Foundation</h1><p>Many business owners invest heavily in content and backlinks, but ignore the technical health of their website. In this case study, I walk through how fixing a client's Shopify store architecture led to a massive traffic bump.</p><h2>Common Issues Found:</h2><ul><li><strong>Canonical Tags Missing:</strong> Shopify creates multiple URLs for the same product based on collections. Without proper canonicals, this causes severe duplicate content issues.</li><li><strong>Pagination Errors:</strong> Collection pages weren't properly linking to deeper pages, causing a crawl trap.</li><li><strong>Missing H1s on Collections:</strong> Basic but critical. The main target keyword wasn't in the H1 tag.</li></ul><p>By fixing these foundational issues, Google could finally crawl and index the site efficiently, resulting in an immediate 100% boost in organic sessions within 30 days.</p>`,
                    category: 'Blog',
                    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000',
                    imageAlt: 'Technical SEO Audit dashboard',
                    tags: ['Technical SEO', 'Shopify', 'Case Study'],
                    author: admin._id
                },
                {
                    title: 'Core Web Vitals in 2026: The Complete Optimization Guide',
                    content: `<h1>Speed is a Ranking Factor</h1><p>A high-performance website is no longer a luxury; it's the foundation of your SEO success. Google's <strong>Core Web Vitals</strong> (LCP, INP, and CLS) are critical metrics that measure the real-world user experience of your pages.</p><h2>The Three Pillars</h2><ol><li><strong>LCP (Largest Contentful Paint):</strong> Measures loading performance. Aim for 2.5 seconds or less. Optimizing hero images and server response times is key here.</li><li><strong>INP (Interaction to Next Paint):</strong> The new metric replacing FID. It measures how quickly the page responds to user clicks. Heavy JavaScript is usually the culprit when this fails.</li><li><strong>CLS (Cumulative Layout Shift):</strong> Measures visual stability. Aim for 0.1 or less. Always define width and height attributes for your images!</li></ol><p>Optimizing these vitals isn't just about pleasing algorithms—it's about reducing bounce rates and increasing conversions.</p>`,
                    category: 'Blog',
                    coverImage: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000',
                    imageAlt: 'Code on a screen showing web performance optimization',
                    tags: ['Performance', 'Core Web Vitals', 'Technical SEO'],
                    author: admin._id
                },
                {
                    title: 'E-Commerce SEO Checklist: 5 Must-Do Optimizations',
                    content: `<h1>Ranking Products in a Competitive Space</h1><p>E-commerce SEO is a completely different beast compared to standard blog SEO. You are dealing with thousands of dynamic pages, faceted navigation, and out-of-stock products.</p><h2>The Top 5 Priorities:</h2><ol><li><strong>Optimize Category Pages:</strong> This is where the real money is. Ensure your category pages have custom descriptions (not just product grids) and target broad commercial keywords.</li><li><strong>Implement Product Schema:</strong> Add JSON-LD Product schema with price, availability, and review aggregate data to get rich snippets in search results.</li><li><strong>Manage Out-of-Stock Products:</strong> Don't just 404 them. Leave the page up with a "back in stock" notification, or 301 redirect to a similar product if it's permanently gone.</li><li><strong>Fix Faceted Navigation:</strong> Stop Google from crawling thousands of parameter URLs (like ?color=red&size=m) by using robots.txt or URL parameter tools.</li><li><strong>Internal Linking:</strong> Link related products together to pass PageRank and increase average order value.</li></ol>`,
                    category: 'Blog',
                    coverImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=1000',
                    imageAlt: 'E-commerce store screen',
                    tags: ['E-Commerce', 'Shopify', 'SEO Strategy'],
                    author: admin._id
                },
                {
                    title: 'Local SEO: How to Dominate Google Maps in Your City',
                    content: `<h1>Winning the Local Pack</h1><p>For service businesses (plumbers, real estate, clinics), ranking in the top 3 of Google Maps (The Local Pack) is often more valuable than ranking #1 in standard organic search.</p><h2>Key Optimization Steps:</h2><ul><li><strong>Claim and Optimize GMB:</strong> Fill out every single field in your Google My Business profile. Add high-quality photos weekly.</li><li><strong>NAP Consistency:</strong> Ensure your Name, Address, and Phone Number are exactly identical across Facebook, Yelp, YellowPages, and your website footer.</li><li><strong>Get Reviews Consistently:</strong> 50 reviews gathered over a year looks much more natural (and ranks better) than 50 reviews gathered in a single week. Build a process to ask every happy customer.</li><li><strong>Local Content:</strong> Create dedicated landing pages for every city you serve (e.g., "Plumber in Faisalabad", "Plumber in Lahore").</li></ul>`,
                    category: 'Blog',
                    coverImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000',
                    imageAlt: 'Map pin showing local search dominance',
                    tags: ['Local SEO', 'GMB', 'Small Business'],
                    author: admin._id
                },
                {
                    title: 'Link Building in 2026: What Actually Works',
                    content: `<h1>Quality Over Quantity</h1><p>The days of spamming thousands of directory links are long gone. Today, Google's Penguin algorithm easily detects manipulative link patterns. So, what actually moves the needle in 2026?</p><h2>Effective Strategies:</h2><ol><li><strong>Digital PR:</strong> Creating data-driven studies or industry surveys and pitching them to journalists. This is the hardest, but most rewarding method to get links from massive sites like Forbes or TechCrunch.</li><li><strong>HARO (Help a Reporter Out):</strong> Answering queries from journalists who need expert quotes for their articles.</li><li><strong>Broken Link Building:</strong> Finding dead links on industry blogs and offering your active content as a replacement.</li><li><strong>Strategic Guest Posting:</strong> Writing extremely high-quality content for respected sites in your niche. (Avoid sites that openly advertise "Write for us").</li></ol><p>Remember: One link from a highly relevant, trusted domain is worth 100 links from low-quality PBNs.</p>`,
                    category: 'Blog',
                    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000',
                    imageAlt: 'Network connections representing backlinks',
                    tags: ['Link Building', 'Off-Page SEO', 'Digital PR'],
                    author: admin._id
                },
                {
                    title: 'Revenue-First SEO: Architecting Growth for Maximum ROI',
                    content: `<h1>Traffic is Vanity, Revenue is Sanity</h1><p>Many SEOs focus on rankings alone. But high rankings mean nothing if they don't translate into business growth. <strong>Revenue-First SEO</strong> is about targeting the "commercial intent" keywords that drive actual sales and high-quality leads.</p><h2>The ROI Framework</h2><p>We analyze the full funnel—from initial awareness to the final conversion. By combining SEO with Conversion Rate Optimization (CRO), we ensure that the traffic we build is ready to buy.</p><ul><li><strong>Commercial Intent Matching:</strong> Targeting users at the "consideration" and "decision" stages (e.g. ranking for "best CRM software" rather than "what is a CRM").</li><li><strong>Full-Funnel Analytics:</strong> Tracking organic traffic all the way to revenue in the bank using GA4 and CRM integrations.</li><li><strong>Scalable Growth Engines:</strong> Building topic clusters that continue to perform long after the initial writing sprint.</li></ul>`,
                    category: 'Blog',
                    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000',
                    imageAlt: 'Analytics dashboard showing revenue growth',
                    tags: ['Business Growth', 'SEO ROI', 'Marketing Strategy'],
                    author: admin._id
                }
            ]);
            console.log('✅ 6 Realistic Blogs seeded successfully!');
        }

        // Seed Case Studies (Project model) if empty
        const projectCount = await Project.countDocuments();
        if (projectCount < 6) {
            if (projectCount > 0) await Project.deleteMany({});
            await Project.create([
                {
                    title: 'StyleKart Fashion — E-commerce SEO',
                    description: 'Scaling a Shopify fashion brand from 2K to 15K monthly organic sessions.',
                    situation: 'A growing fashion brand was struggling with duplicate content and flat organic traffic.',
                    task: 'Audit the technical infrastructure, fix Shopify canonical issues, and build a content cluster strategy.',
                    action: 'Implemented advanced Product schema, optimized Core Web Vitals, and built 25 high-quality backlinks.',
                    result: '+650% Increase in organic traffic in 5 months.',
                    techStack: ['Shopify', 'Ahrefs', 'Screaming Frog'],
                    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000',
                    createdBy: admin._id
                },
                {
                    title: 'Al-Madina Textiles — Local SEO',
                    description: 'Dominating local search for a regional B2B textile supplier.',
                    situation: 'The company was practically invisible on Google Maps despite having a large physical presence.',
                    task: 'Establish local authority through GMB optimization and consistent NAP citations.',
                    action: 'Optimized Google My Business profile, built 50+ local citations, and added location-specific landing pages.',
                    result: 'Achieved #2 ranking in Local Pack for 12 primary keywords.',
                    techStack: ['Google Business', 'BrightLocal', 'WordPress'],
                    imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=1000',
                    createdBy: admin._id
                },
                {
                    title: 'CloudSync SaaS — B2B Authority',
                    description: 'Building topical authority for a cloud storage SaaS platform.',
                    situation: 'A new SaaS tool had zero organic presence against established enterprise competitors.',
                    task: 'Establish authority through entity-based SEO and high-quality link building.',
                    action: 'Created 20+ Pillar pages and acquired 15 high-DA backlinks through guest posting.',
                    result: 'Achieved Top 3 ranking for main commercial keywords within 6 months.',
                    techStack: ['SEMrush', 'React', 'Google Search Console'],
                    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000',
                    createdBy: admin._id
                },
                {
                    title: 'PureFit Nutrition — E-commerce',
                    description: 'Recovering lost traffic after a site migration for a supplement brand.',
                    situation: 'The client lost 40% of their organic traffic after moving from WooCommerce to Shopify.',
                    task: 'Identify migration errors and recover lost rankings.',
                    action: 'Fixed broken 301 redirects, resolved 404 errors, and restored missing metadata across 200+ products.',
                    result: 'Recovered all lost traffic within 45 days and grew it by an additional 30%.',
                    techStack: ['Google Analytics 4', 'Screaming Frog', 'Shopify'],
                    imageUrl: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=1000',
                    createdBy: admin._id
                },
                {
                    title: 'UrbanNest Realty — Real Estate SEO',
                    description: 'Driving qualified buyer leads for a real estate agency.',
                    situation: 'The agency relied purely on expensive Facebook ads and wanted to shift to organic inbound leads.',
                    task: 'Rank for high-intent keywords like "apartments for sale in [city]".',
                    action: 'Implemented property listing schema, improved site architecture, and launched a localized blog.',
                    result: 'Generated 40+ inbound organic leads per month, reducing CAC by 60%.',
                    techStack: ['WordPress', 'Schema.org', 'Ahrefs'],
                    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000',
                    createdBy: admin._id
                },
                {
                    title: 'QuickByte Tech — Content Strategy',
                    description: 'Scaling a technology blog from 5K to 30K monthly readers.',
                    situation: 'The blog was publishing frequently but failing to rank for competitive tech terms.',
                    task: 'Restructure the content strategy focusing on topical clusters rather than isolated keywords.',
                    action: 'Performed a content gap analysis, merged cannibalizing articles, and created 4 comprehensive hub pages.',
                    result: '300% increase in organic traffic and a massive boost in ad revenue.',
                    techStack: ['SurferSEO', 'SEMrush', 'Ghost CMS'],
                    imageUrl: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=1000',
                    createdBy: admin._id
                }
            ]);
            console.log('✅ 6 Realistic Case Studies seeded successfully!');
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
