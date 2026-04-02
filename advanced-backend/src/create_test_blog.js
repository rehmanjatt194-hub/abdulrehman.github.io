import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Content from './models/Content.js';
import User from './models/User.js';

dotenv.config();

const createTestBlog = async () => {
    try {
        console.log('⏳ Connecting to MongoDB...');
        // Assume the same DB connection logic as in db.js
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio');
        console.log('🚀 Connected to MongoDB!');

        const admin = await User.findOne({ email: 'rehmanjatt194@gmail.com' });
        if (!admin) {
            console.error('❌ Admin user not found! Run the seed first.');
            process.exit(1);
        }

        const blogData = {
            title: 'How Core Web Vitals Impact Your Google Rankings',
            content: `
                <h1>The Three Pillars of User Experience</h1>
                <p>Google's Core Web Vitals (LCP, FID, and CLS) are now a critical ranking factor for every website. If your site is slow to load or has shifting elements, you are likely losing traffic to competitors who have optimized their technical SEO.</p>
                
                <h2>Why Mobile Performance Matters</h2>
                <p>Most searches now happen on mobile devices. If your LCP (Largest Contentful Paint) is above 2.5 seconds, Google's algorithms will deprioritize your content in favor of faster, more responsive pages.</p>
                
                <h2>Building Technical Authority</h2>
                <p>For a detailed breakdown of these metrics, you should check out the official guide on <a href="https://web.dev/vitals/" target="_blank" class="text-blue-400 underline font-bold">Google's Web Dev Portal</a>. This is the source of truth for all SEO specialists.</p>
                
                <p>By optimizing these vitals, you're not just pleasing the search engines—you're providing a better experience for your visitors, which invariably leads to higher conversion rates.</p>
            `,
            category: 'Blog',
            slug: 'core-web-vitals-impact-seo-2026',
            coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1470&auto=format&fit=crop',
            tags: ['SEO', 'Core Web Vitals', 'Google Rankings'],
            author: admin._id
        };

        // Create the blog
        await Content.create(blogData);
        console.log('✅ Test Blog with Backlink Created Successfully!');
        
        process.exit(0);
    } catch (err) {
        console.error('❌ Failed to create test blog:', err.message);
        process.exit(1);
    }
};

createTestBlog();
