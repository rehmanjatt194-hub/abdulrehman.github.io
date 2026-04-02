import Content from '../models/Content.js';

/**
 * @desc Get all content (Blog/Case Study) with search & filter
 * @route GET /api/v1/content
 */
export const getContent = async (req, res) => {
    const { category, search } = req.query;
    const query = {};

    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };

    const contentList = await Content.find(query).populate('author', 'username');
    res.json(contentList);
};

/**
 * @desc Get content by slug
 * @route GET /api/v1/content/:slug
 */
export const getContentBySlug = async (req, res) => {
    const content = await Content.findOne({ slug: req.params.slug }).populate('author', 'username');

    if (content) {
        res.json(content);
    } else {
        res.status(404).json({ message: 'Content not found' });
    }
};

/**
 * @desc Create content (Admin)
 * @route POST /api/v1/content
 */
export const createContent = async (req, res) => {
    const { title, content, category, tags } = req.body;
    const item = new Content({
        title,
        content,
        category,
        subtitle: req.body.subtitle,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        coverImage: req.file ? `/uploads/${req.file.filename}` : 'default-cover.png',
        imageAlt: req.body.imageAlt,
        author: req.user._id
    });

    const createdItem = await item.save();
    res.status(201).json(createdItem);
};

/**
 * @desc Update content (Admin)
 * @route PUT /api/v1/content/:id
 */
export const updateContent = async (req, res) => {
    const item = await Content.findById(req.params.id);

    if (item) {
        item.title = req.body.title || item.title;
        item.content = req.body.content || item.content;
        item.subtitle = req.body.subtitle || item.subtitle;
        item.category = req.body.category || item.category;
        item.tags = req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : item.tags;
        item.imageAlt = req.body.imageAlt || item.imageAlt;
        if (req.file) item.coverImage = `/uploads/${req.file.filename}`;

        const updatedItem = await item.save();
        res.json(updatedItem);
    } else {
        res.status(404).json({ message: 'Content not found' });
    }
};

/**
 * @desc Delete content (Admin)
 * @route DELETE /api/v1/content/:id
 */
export const deleteContent = async (req, res) => {
    const item = await Content.findById(req.params.id);

    if (item) {
        await item.deleteOne();
        res.json({ message: 'Content removed' });
    } else {
        res.status(404).json({ message: 'Content not found' });
    }
};
