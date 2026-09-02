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
                title: 'Ahmed Raza',
                subtitle: 'CEO, StyleKart',
                content: 'Abdul completely transformed our online presence. Within 3 months we went from page 5 to page 1 for our main target keywords. The ROI has been excellent.',
                category: 'Review',
                coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100',
                author: admin._id
            },
            {
                title: 'Zainab Malik',
                subtitle: 'Founder, PureFit Nutrition',
                content: 'The SEO strategy provided was comprehensive and results-driven. Our traffic grew by 65% in a few months and our leads doubled. Great work.',
                category: 'Review',
                coverImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100',
                author: admin._id
            },
            {
                title: 'Fatima Hassan',
                subtitle: 'Marketing Director, Al-Madina',
                content: 'Best SEO investment we\'ve ever made. The technical audit alone uncovered critical issues we had no idea about. Our Lighthouse score went from 54 to 98.',
                category: 'Review',
                coverImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100',
                author: admin._id
            },
            {
                title: 'James Wilson',
                subtitle: 'CTO, CloudSync',
                content: 'Abdul\'s approach to technical SEO and content clustering helped us outrank much larger competitors in the B2B SaaS space.',
                category: 'Review',
                coverImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100',
                author: admin._id
            },
            {
                title: 'Bilal Khan',
                subtitle: 'Owner, UrbanNest',
                content: 'He optimized our local SEO and GMB profile. We are now generating regular inquiries directly from Google Maps without spending a dime on ads.',
                category: 'Review',
                coverImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100',
                author: admin._id
            },
            {
                title: 'Sara Ahmed',
                subtitle: 'Content Head, QuickByte',
                content: 'The content strategy was brilliant. We went from writing random blog posts to creating targeted entity clusters that actually rank and drive relevant traffic.',
                category: 'Review',
                coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100',
                author: admin._id
            }
        ];

        // 3. Seed Projects
        const projects = [
            {
                title: 'StyleKart Fashion — E-commerce SEO',
                description: 'Scaling a Shopify fashion brand from 2K to 15K monthly organic sessions.',
                situation: 'A growing fashion brand was struggling with duplicate content and flat organic traffic.',
                task: 'Audit the technical infrastructure, fix Shopify canonical issues, and build a content cluster strategy.',
                action: 'Implemented advanced Product schema, optimized Core Web Vitals, and built 25 high-quality backlinks.',
                result: '+650% Increase in organic traffic in 5 months.',
                techStack: ['Shopify', 'Ahrefs', 'Screaming Frog'],
                imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000',
                author: admin._id
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
                author: admin._id
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
                author: admin._id
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
                author: admin._id
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
                author: admin._id
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
                author: admin._id
            }
        ];

        // Clear existing data
        await Content.deleteMany({ category: { $in: ['FAQ', 'Review'] } });
        await Project.deleteMany({});

        // Insert new data
        await Content.create([...faqs, ...reviews]);
        await Project.create(projects);

        console.log('✅ FAQs, Reviews, and Projects seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding error:', err.message);
        process.exit(1);
    }
};

seedData();
