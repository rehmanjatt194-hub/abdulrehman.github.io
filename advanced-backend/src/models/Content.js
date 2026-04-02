import mongoose from 'mongoose';
import slugify from 'slugify';

const contentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    content: { type: String, required: true },
    category: { type: String, enum: ['Blog', 'Case Study', 'FAQ', 'Review'], required: true },
    subtitle: { type: String }, // For Reviewer Role or FAQ Order
    coverImage: { type: String, default: 'default-cover.png' },
    imageAlt: { type: String },
    tags: [String],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Pre-save slug & alt generation
contentSchema.pre('save', async function() {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true, strict: true });
        if (!this.imageAlt) this.imageAlt = this.title;
    }
});

const Content = mongoose.model('Content', contentSchema);
export default Content;
