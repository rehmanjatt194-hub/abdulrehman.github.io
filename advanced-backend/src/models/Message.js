import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: false },
    title: { type: String, required: false }, // Client's job title
    url: { type: String, required: false }, // Store/Website URL
    budget: { type: String, required: false },
    message: { type: String, required: true },
    status: { type: String, enum: ['New', 'Read', 'Replied'], default: 'New' }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
export default Message;
