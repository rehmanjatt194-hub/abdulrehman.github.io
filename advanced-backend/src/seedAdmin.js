import Datastore from 'nedb-promises';
import bcrypt from 'bcryptjs';
import path from 'path';

/**
 * Seeding the Admin User requested by USER.
 */
const seedAdmin = async () => {
    const dbPath = path.join(process.cwd(), 'data/users.db');
    const db = Datastore.create({ filename: dbPath, autoload: true });

    const email = 'rehmanjatt194@gmail.com';
    const rawPassword = 'Qonkar3972$';

    // Check if user already exists
    const existingUser = await db.findOne({ email });
    if (existingUser) {
        console.log('User already exists. Updating password...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(rawPassword, salt);
        await db.update({ email }, { $set: { password: hashedPassword, role: 'Admin', username: 'Rehman Jatt' } });
        console.log('✅ Admin user updated successfully!');
    } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(rawPassword, salt);
        
        await db.insert({
            username: 'Rehman Jatt',
            email,
            password: hashedPassword,
            role: 'Admin',
            isVerified: true
        });
        console.log('✅ Admin user created successfully!');
    }
    process.exit(0);
};

seedAdmin();
