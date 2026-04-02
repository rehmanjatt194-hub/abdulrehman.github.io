import Message from '../models/Message.js';

/**
 * @desc Get all messages (Admin)
 */
export const getMessages = async (req, res) => {
    const messages = await Message.find({});
    res.json(messages);
};

/**
 * @desc Add a message (Public)
 */
export const addMessage = async (req, res) => {
    const { name, email, phone, title, url, budget, message } = req.body;
    const newMessage = new Message({ name, email, phone, title, url, budget, message });
    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully' });
};

/**
 * @desc Delete message (Admin)
 */
export const deleteMessage = async (req, res) => {
    const item = await Message.findById(req.params.id);

    if (item) {
        await item.deleteOne();
        res.json({ message: 'Message deleted' });
    } else {
        res.status(404).json({ message: 'Message not found' });
    }
};

/**
 * @desc Update message status (Admin)
 */
export const updateMessageStatus = async (req, res) => {
    const { status } = req.body;
    const item = await Message.findById(req.params.id);

    if (item) {
        item.status = status || item.status;
        const updatedItem = await item.save();
        res.json(updatedItem);
    } else {
        res.status(404).json({ message: 'Message not found' });
    }
};
