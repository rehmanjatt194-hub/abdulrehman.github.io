import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db.js';
import Content from './models/Content.js';
import User from './models/User.js';

dotenv.config();

const seedBlogs = async () => {
    try {
        await connectDB();
        
        // Find Admin User
        const admin = await User.findOne({ email: 'rehmanjatt194@gmail.com' });
        if (!admin) {
            console.error('❌ Error: Admin user (rehmanjatt194@gmail.com) not found. Please seed admin first.');
            process.exit(1);
        }

        const blogs = [
            {
<<<<<<< HEAD
                title: 'How I Fixed 47 Technical SEO Errors and Doubled Organic Traffic',
                content: `
                    <h1>The Technical Foundation</h1>
                    <p>Many business owners invest heavily in content and backlinks, but ignore the technical health of their website. In this case study, I walk through how fixing a client's Shopify store architecture led to a massive traffic bump.</p>
                    
                    <h2>Common Issues Found:</h2>
                    <ul>
                        <li><strong>Canonical Tags Missing:</strong> Shopify creates multiple URLs for the same product based on collections. Without proper canonicals, this causes severe duplicate content issues.</li>
                        <li><strong>Pagination Errors:</strong> Collection pages weren't properly linking to deeper pages, causing a crawl trap.</li>
                        <li><strong>Missing H1s on Collections:</strong> Basic but critical. The main target keyword wasn't in the H1 tag.</li>
                    </ul>
                    <p>By fixing these foundational issues, Google could finally crawl and index the site efficiently, resulting in an immediate 100% boost in organic sessions within 30 days.</p>
                `,
                category: 'Blog',
                coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000',
                imageAlt: 'Technical SEO Audit dashboard',
                tags: ['Technical SEO', 'Shopify', 'Case Study'],
                author: admin._id
            },
            {
                title: 'Core Web Vitals in 2026: The Complete Optimization Guide',
                content: `
                    <h1>Speed is a Ranking Factor</h1>
                    <p>A high-performance website is no longer a luxury; it's the foundation of your SEO success. Google's <strong>Core Web Vitals</strong> (LCP, INP, and CLS) are critical metrics that measure the real-world user experience of your pages.</p>
                    
                    <h2>The Three Pillars</h2>
                    <ol>
                        <li><strong>LCP (Largest Contentful Paint):</strong> Measures loading performance. Aim for 2.5 seconds or less. Optimizing hero images and server response times is key here.</li>
                        <li><strong>INP (Interaction to Next Paint):</strong> The new metric replacing FID. It measures how quickly the page responds to user clicks. Heavy JavaScript is usually the culprit when this fails.</li>
                        <li><strong>CLS (Cumulative Layout Shift):</strong> Measures visual stability. Aim for 0.1 or less. Always define width and height attributes for your images!</li>
                    </ol>
                    <p>Optimizing these vitals isn't just about pleasing algorithms—it's about reducing bounce rates and increasing conversions.</p>
                `,
                category: 'Blog',
                coverImage: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000',
                imageAlt: 'Code on a screen showing web performance optimization',
                tags: ['Performance', 'Core Web Vitals', 'Technical SEO'],
                author: admin._id
            },
            {
                title: 'E-Commerce SEO Checklist: 5 Must-Do Optimizations',
                content: `
                    <h1>Ranking Products in a Competitive Space</h1>
                    <p>E-commerce SEO is a completely different beast compared to standard blog SEO. You are dealing with thousands of dynamic pages, faceted navigation, and out-of-stock products.</p>
                    
                    <h2>The Top 5 Priorities:</h2>
                    <ol>
                        <li><strong>Optimize Category Pages:</strong> This is where the real money is. Ensure your category pages have custom descriptions (not just product grids) and target broad commercial keywords.</li>
                        <li><strong>Implement Product Schema:</strong> Add JSON-LD Product schema with price, availability, and review aggregate data to get rich snippets in search results.</li>
                        <li><strong>Manage Out-of-Stock Products:</strong> Don't just 404 them. Leave the page up with a "back in stock" notification, or 301 redirect to a similar product if it's permanently gone.</li>
                        <li><strong>Fix Faceted Navigation:</strong> Stop Google from crawling thousands of parameter URLs (like ?color=red&size=m) by using robots.txt or URL parameter tools.</li>
                        <li><strong>Internal Linking:</strong> Link related products together to pass PageRank and increase average order value.</li>
                    </ol>
                `,
                category: 'Blog',
                coverImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=1000',
                imageAlt: 'E-commerce store screen',
                tags: ['E-Commerce', 'Shopify', 'SEO Strategy'],
                author: admin._id
            },
            {
                title: 'Local SEO: How to Dominate Google Maps in Your City',
                content: `
                    <h1>Winning the Local Pack</h1>
                    <p>For service businesses (plumbers, real estate, clinics), ranking in the top 3 of Google Maps (The Local Pack) is often more valuable than ranking #1 in standard organic search.</p>
                    
                    <h2>Key Optimization Steps:</h2>
                    <ul>
                        <li><strong>Claim and Optimize GMB:</strong> Fill out every single field in your Google My Business profile. Add high-quality photos weekly.</li>
                        <li><strong>NAP Consistency:</strong> Ensure your Name, Address, and Phone Number are exactly identical across Facebook, Yelp, YellowPages, and your website footer.</li>
                        <li><strong>Get Reviews Consistently:</strong> 50 reviews gathered over a year looks much more natural (and ranks better) than 50 reviews gathered in a single week. Build a process to ask every happy customer.</li>
                        <li><strong>Local Content:</strong> Create dedicated landing pages for every city you serve (e.g., "Plumber in Faisalabad", "Plumber in Lahore").</li>
                    </ul>
                `,
                category: 'Blog',
                coverImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000',
                imageAlt: 'Map pin showing local search dominance',
                tags: ['Local SEO', 'GMB', 'Small Business'],
                author: admin._id
            },
            {
                title: 'Link Building in 2026: What Actually Works',
                content: `
                    <h1>Quality Over Quantity</h1>
                    <p>The days of spamming thousands of directory links are long gone. Today, Google's Penguin algorithm easily detects manipulative link patterns. So, what actually moves the needle in 2026?</p>
                    
                    <h2>Effective Strategies:</h2>
                    <ol>
                        <li><strong>Digital PR:</strong> Creating data-driven studies or industry surveys and pitching them to journalists. This is the hardest, but most rewarding method to get links from massive sites like Forbes or TechCrunch.</li>
                        <li><strong>HARO (Help a Reporter Out):</strong> Answering queries from journalists who need expert quotes for their articles.</li>
                        <li><strong>Broken Link Building:</strong> Finding dead links on industry blogs and offering your active content as a replacement.</li>
                        <li><strong>Strategic Guest Posting:</strong> Writing extremely high-quality content for respected sites in your niche. (Avoid sites that openly advertise "Write for us").</li>
                    </ol>
                    <p>Remember: One link from a highly relevant, trusted domain is worth 100 links from low-quality PBNs.</p>
                `,
                category: 'Blog',
                coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000',
                imageAlt: 'Network connections representing backlinks',
                tags: ['Link Building', 'Off-Page SEO', 'Digital PR'],
=======
                title: 'Semantic SEO: Why Entities are the Future of Search',
                content: `
                    <h1>Moving Beyond Keywords</h1>
                    <p>In the modern search landscape, Google doesn't just look for words—it looks for <strong>meaning</strong>. Semantic SEO is the practice of building topical authority by mapping entities and search intent rather than just targeting individual keywords.</p>
                    
                    <h2>What are Entities?</h2>
                    <p>An entity is a well-defined object or concept that search engines can identify uniquely. By connecting your content to known entities, you provide the context search engines need to rank you as a trusted authority.</p>
                    
                    <ul>
                        <li><strong>Intent Matching:</strong> Aligning content with what the user actually wants to achieve.</li>
                        <li><strong>Topical Clusters:</strong> Grouping related content to demonstrate depth of knowledge.</li>
                        <li><strong>Knowledge Graph Integration:</strong> Helping Google connect your brand to the global data web.</li>
                    </ul>

                    <blockquote>"SEO is no longer about rank; it's about being the most relevant answer in the entity graph."</blockquote>
                `,
                category: 'Blog',
                coverImage: '/uploads/semantic_seo.png',
                imageAlt: 'Abstract representation of Semantic SEO and Knowledge Entities',
                tags: ['SEO Strategy', 'Semantic SEO', 'Entities'],
                author: admin._id
            },
            {
                title: 'Core Web Vitals: The Definitive 2026 Performance Guide',
                content: `
                    <h1>Speed is a Ranking Factor</h1>
                    <p>A high-performance website is no longer a luxury; it's the foundation of your SEO success. Google's <strong>Core Web Vitals</strong> (LCP, FID, and CLS) are critical metrics that measure the real-world user experience of your pages.</p>
                    
                    <h2>The Three Pillars</h2>
                    <ol>
                        <li><strong>LCP (Largest Contentful Paint):</strong> Measures loading performance. Aim for 2.5 seconds or less.</li>
                        <li><strong>FID (First Input Delay):</strong> Measures interactivity. Aim for 100 milliseconds or less.</li>
                        <li><strong>CLS (Cumulative Layout Shift):</strong> Measures visual stability. Aim for 0.1 or less.</li>
                    </ol>

                    <p>Optimizing these vitals isn't just about pleasing algorithms—it's about reducing bounce rates and increasing conversions. A faster site keeps users engaged and signals to Google that your infrastructure is professional and reliable.</p>
                `,
                category: 'Blog',
                coverImage: '/uploads/core_web_vitals.png',
                imageAlt: 'Futuristic performance dashboard showing Core Web Vitals metrics',
                tags: ['Technical SEO', 'Performance', 'Core Web Vitals'],
                author: admin._id
            },
            {
                title: 'Knowledge Graphs: How Google Understands Your Business',
                content: `
                    <h1>The Web of Data</h1>
                    <p>Google's Knowledge Graph is a massive database of billions of facts about people, places, and things. For your business to dominate search, you need to be a part of this graph.</p>
                    
                    <h2>Using Structured Data</h2>
                    <p>Schema markup (JSON-LD) is the language we use to talk to search engines directly. By implementing advanced schema, we can define your services, reviews, and professional identity in a way that search engines can't ignore.</p>
                    
                    <h3>Benefits of Knowledge Graph Presence:</h3>
                    <ul>
                        <li><strong>Rich Snippets:</strong> Enhanced search results with stars, prices, and FAQs.</li>
                        <li><strong>Knowledge Panels:</strong> Dedicated sidebar information in Google search.</li>
                        <li><strong>Voice Search Readiness:</strong> Providing structured answers for AI assistants.</li>
                    </ul>
                `,
                category: 'Blog',
                coverImage: '/uploads/knowledge_graph.png',
                imageAlt: 'Interconnected data nodes representing a digital Knowledge Graph',
                tags: ['SEO', 'Structured Data', 'Knowledge Graph'],
>>>>>>> dc74830e2ba472731d039da70784e6cf4d168476
                author: admin._id
            },
            {
                title: 'Revenue-First SEO: Architecting Growth for Maximum ROI',
                content: `
                    <h1>Traffic is Vanity, Revenue is Sanity</h1>
                    <p>Many SEOs focus on rankings alone. But high rankings mean nothing if they don't translate into business growth. <strong>Revenue-First SEO</strong> is about targeting the "commercial intent" keywords that drive actual sales and high-quality leads.</p>
                    
                    <h2>The ROI Framework</h2>
                    <p>We analyze the full funnel—from initial awareness to the final conversion. By combining SEO with Conversion Rate Optimization (CRO), we ensure that the traffic we build is ready to buy.</p>
                    
                    <ul>
<<<<<<< HEAD
                        <li><strong>Commercial Intent Matching:</strong> Targeting users at the "consideration" and "decision" stages (e.g. ranking for "best CRM software" rather than "what is a CRM").</li>
                        <li><strong>Full-Funnel Analytics:</strong> Tracking organic traffic all the way to revenue in the bank using GA4 and CRM integrations.</li>
                        <li><strong>Scalable Growth Engines:</strong> Building topic clusters that continue to perform long after the initial writing sprint.</li>
                    </ul>
                `,
                category: 'Blog',
                coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000',
                imageAlt: 'Analytics dashboard showing revenue growth',
=======
                        <li><strong>Commercial Intent Matching:</strong> Targeting users at the "consideration" and "decision" stages.</li>
                        <li><strong>Full-Funnel Analytics:</strong> Tracking organic traffic all the way to revenue in the bank.</li>
                        <li><strong>Scalable Growth Engines:</strong> Building systems that continue to perform long after the initial sprint.</li>
                    </ul>
                `,
                category: 'Blog',
                coverImage: '/uploads/revenue_seo.png',
                imageAlt: 'Abstract growth chart representing ROI-focused SEO success',
>>>>>>> dc74830e2ba472731d039da70784e6cf4d168476
                tags: ['Business Growth', 'SEO ROI', 'Marketing Strategy'],
                author: admin._id
            }
        ];

        // Clear existing blogs
        await Content.deleteMany({ category: 'Blog' });
        console.log('🗑️ Existing blogs removed.');

        // Insert new blogs
        await Content.create(blogs);
<<<<<<< HEAD
        console.log('✅ 6 New Realistic SEO blogs seeded successfully!');
=======
        console.log('✅ 4 New Premium SEO blogs seeded successfully!');
>>>>>>> dc74830e2ba472731d039da70784e6cf4d168476

        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding error:', err.message);
        process.exit(1);
    }
};

seedBlogs();
