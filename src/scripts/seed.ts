import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { Service } from '../models/Service';

const services = [
  {
    title: 'GPT-4 Turbo Content Engine',
    description: 'Generate high-quality articles, blogs, and marketing copy with GPT-4 Turbo. Perfect for content creators and marketers who need scalable, engaging written content at speed.',
    price: 49,
    category: 'Content Writing',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=800',
    users: 12400,
    deliveryTime: '1-2 hours',
    featured: true,
  },
  {
    title: 'DALL·E 3 Image Studio',
    description: 'Transform your text prompts into stunning, photorealistic images with DALL·E 3. Ideal for designers, marketers, and creators seeking unique visuals without a photographer.',
    price: 79,
    category: 'Image Generation',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1686191129064-e4ee5459e578?w=800',
    users: 9800,
    deliveryTime: 'Instant',
    featured: true,
  },
  {
    title: 'Semantic Code Architect',
    description: 'AI-powered code generation and review. Write, debug, and refactor code in any language. Includes code explanations, unit test generation, and security vulnerability scanning.',
    price: 39,
    category: 'Code Assistant',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
    users: 7600,
    deliveryTime: 'Real-time',
    featured: false,
  },
  {
    title: 'Predictive Analytics Intelligence',
    description: 'Turn raw data into actionable insights with AI-driven analytics. Supports CSV, Excel, and database inputs. Generates charts, forecasts, and executive summaries automatically.',
    price: 99,
    category: 'Data Analysis',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    users: 4300,
    deliveryTime: '2-4 hours',
    featured: true,
  },
  {
    title: 'Workflow Automation Architect',
    description: 'Automate repetitive business processes with intelligent AI agents. Connect your apps, automate data flows, and trigger smart actions — no code required.',
    price: 89,
    category: 'AI Automation',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    users: 5900,
    deliveryTime: 'Same day',
    featured: false,
  },
  {
    title: 'Neural Voice Synthesis Pro',
    description: 'Generate ultra-realistic human voices in 30+ languages. Perfect for audiobooks, podcasts, ads, and voiceovers. Clone voices or choose from 200+ professional presets.',
    price: 59,
    category: 'Voice Synthesis',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800',
    users: 6700,
    deliveryTime: 'Instant',
    featured: false,
  },
  {
    title: 'Brand Identity Architect',
    description: 'Create complete brand identities with AI: logos, color palettes, typography, and brand guidelines — all generated from your brief in minutes.',
    price: 199,
    category: 'Image Generation',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800',
    users: 3100,
    deliveryTime: '1-2 days',
    featured: true,
  },
  {
    title: 'Smart Email Campaign Writer',
    description: 'AI-crafted email sequences that convert. A/B tested subject lines, personalized copy, and CTA optimization built-in. Integrates with Mailchimp, HubSpot, and SendGrid.',
    price: 35,
    category: 'Content Writing',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    users: 8200,
    deliveryTime: '30 minutes',
    featured: false,
  },
  {
    title: 'AI Research Synthesizer',
    description: 'Summarize papers, extract key findings, and generate literature reviews from academic and business documents. Supports PDF, DOCX, and URLs.',
    price: 45,
    category: 'Data Analysis',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    users: 3400,
    deliveryTime: '1-3 hours',
    featured: false,
  },
  {
    title: 'Code Review & Security Auditor',
    description: 'Automated AI code review that catches bugs, security vulnerabilities, and performance issues before they hit production. Integrates with GitHub, GitLab, and Bitbucket.',
    price: 69,
    category: 'Code Assistant',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800',
    users: 5100,
    deliveryTime: 'Real-time',
    featured: true,
  },
  {
    title: 'Social Media Content Factory',
    description: 'Generate weeks of social media content in minutes. Platform-optimized posts, hashtags, and captions for Instagram, Twitter, LinkedIn, and TikTok.',
    price: 29,
    category: 'Content Writing',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800',
    users: 14500,
    deliveryTime: '15 minutes',
    featured: false,
  },
  {
    title: 'CRM Process Automator',
    description: 'Automate your entire sales pipeline with AI. Lead scoring, follow-up emails, meeting scheduling, and CRM updates all handled intelligently without manual input.',
    price: 129,
    category: 'AI Automation',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    users: 2800,
    deliveryTime: '1-2 days',
    featured: false,
  },
];

const seed = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting seed...');

    const existing = await Service.countDocuments();
    if (existing > 0) {
      console.log(`⚠️  Database already has ${existing} services. Skipping seed.`);
      console.log('   To re-seed, drop the services collection first.');
      process.exit(0);
    }

    await Service.insertMany(services);
    console.log(`✅ Seeded ${services.length} services successfully`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seed();
