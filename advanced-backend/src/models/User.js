import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Maqsad: User ki saari details (Email, Role, Profile Picture) store karne ka schema.
 * Ismein Role (Admin/User) aur Verification status bhi shamil hai.
 */
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['User', 'Admin'], default: 'User' },
    profilePicture: { type: String, default: 'default-avatar.png' },
    isVerified: { type: Boolean, default: false }
}, { timestamps: true });

// Password ko hash karna save hone se pehle
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Password match karne ke liye helper method
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
