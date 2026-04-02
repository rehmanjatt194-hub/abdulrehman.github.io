import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db.js';
import Content from './models/Content.js';
import Project from './models/Project.js';
import User from './models/User.js';

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();
        
        // Find Admin User
        const admin = await User.findOne({ email: 'rehmanjatt194@gmail.com' });
        if (!admin) {
            console.log('Seed Admin first!');
            process.exit(1);
        }

        // 1. Seed FAQs
        const faqs = [
            {
                title: 'How long does it take to see SEO results?',
                content: 'On average, it takes 3 to 6 months to see significant results. However, technical fixes (like Core Web Vitals) can show ranking improvements within 2-4 weeks.',
                category: 'FAQ',
                author: admin._id
            },
            {
                title: 'What is Semantic SEO and why do I need it?',
                content: 'Semantic SEO focuses on topical authority and entities instead of just keywords. It helps Google understand the "context" of your content, leading to higher rankings for entire search categories.',
                category: 'FAQ',
                author: admin._id
            },
            {
                title: 'Do you provide white-label SEO reports?',
                content: 'Yes, I provide professional, white-labeled monthly reports featuring key metrics like organic traffic growth, keyword progression, and technical health scores.',
                category: 'FAQ',
                author: admin._id
            }
        ];

        // 2. Seed Reviews
        const reviews = [
            {
                title: 'John Davis',
                subtitle: 'CEO, TechStart',
                content: 'Abdul Rehman transformed our organic traffic. Within 3 months, we saw a massive 200% bump in lead generation purely through Google search.',
                category: 'Review',
                coverImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100',
                author: admin._id
            },
            {
                title: 'Michael Chen',
                subtitle: 'Founder, E-Shop',
                content: 'Very professional approach to SEO. He fixed our technical errors in week one, which immediately improved our loading speed and rankings.',
                category: 'Review',
                coverImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100',
                author: admin._id
            }
        ];

        // 3. Seed Projects
        const projects = [
            {
                title: 'E-Commerce Growth',
                description: 'Scaling a fashion brand from 10k to 50k monthly visitors.',
                situation: 'A niche fashion brand was struggling with flat organic traffic for 12 months.',
                task: 'Audit the technical infrastructure and build a content cluster strategy.',
                action: 'Implemented advanced Schema markup and optimized Core Web Vitals (LCP/FID).',
                result: '450% Increase in organic revenue and 3x more page 1 rankings.',
                techStack: ['Ahrefs', 'Screaming Frog', 'Next.js'],
                imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000',
                author: admin._id
            },
            {
                title: 'SaaS Authority',
                description: 'Building topical authority for a B2B SaaS platform.',
                situation: 'A new SaaS tool had zero organic presence against established competitors.',
                task: 'Establish authority through entity-based SEO and high-quality link building.',
                action: 'Created 20+ Pillar pages and acquired 15 high-DA backlinks.',
                result: 'Achieved Top 3 ranking for main commercial keywords within 5 months.',
                techStack: ['SEMrush', 'Looker Studio', 'React'],
                imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000',
                author: admin._id
            }
        ];

        // Clear existing data
        await Content.deleteMany({ category: { $in: ['FAQ', 'Review'] } });
        await Project.deleteMany({});

        // Insert new data
        await Content.insertMany([...faqs, ...reviews]);
        await Project.insertMany(projects);

        console.log('✅ FAQs, Reviews, and Projects seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding error:', err.message);
        process.exit(1);
    }
};

seedData();
