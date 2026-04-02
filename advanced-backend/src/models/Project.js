import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    techStack: [String],
    situation: { type: String, required: false },
    task: { type: String, required: false },
    action: { type: String, required: false },
    result: { type: String, required: false },
    liveUrl: String,
    githubLink: String,
    imageUrl: { type: String, default: 'default-project.png' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
export default Project;
