import Project from '../models/Project.js';

/**
 * @desc Get all projects
 * @route GET /api/v1/projects
 */
export const getProjects = async (req, res) => {
    console.log('📡 GET /api/v1/projects called');
    const projects = await Project.find({});
    console.log(`🔍 Projects found: ${projects.length}`);
    res.json(projects);
};

/**
 * @desc Create a project (Admin)
 * @route POST /api/v1/projects
 */
export const createProject = async (req, res) => {
    const { title, description, situation, task, action, result, techStack, liveUrl, githubLink } = req.body;
    const project = new Project({
        title,
        description,
        situation,
        task,
        action,
        result,
        techStack: techStack ? techStack.split(',').map(item => item.trim()) : [],
        liveUrl,
        githubLink,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : 'default-project.png',
        createdBy: req.user._id
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
};

/**
 * @desc Update a project (Admin)
 * @route PUT /api/v1/projects/:id
 */
export const updateProject = async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (project) {
        project.title = req.body.title || project.title;
        project.description = req.body.description || project.description;
        project.situation = req.body.situation || project.situation;
        project.task = req.body.task || project.task;
        project.action = req.body.action || project.action;
        project.result = req.body.result || project.result;
        project.techStack = req.body.techStack ? req.body.techStack.split(',').map(item => item.trim()) : project.techStack;
        project.liveUrl = req.body.liveUrl || project.liveUrl;
        project.githubLink = req.body.githubLink || project.githubLink;
        if (req.file) project.imageUrl = `/uploads/${req.file.filename}`;

        const updatedProject = await project.save();
        res.json(updatedProject);
    } else {
        res.status(404).json({ message: 'Project not found' });
    }
};

/**
 * @desc Delete project (Admin)
 * @route DELETE /api/v1/projects/:id
 */
export const deleteProject = async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (project) {
        await project.deleteOne();
        res.json({ message: 'Project removed' });
    } else {
        res.status(404).json({ message: 'Project not found' });
    }
};
