import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';

/**
 * Maqsad: Server ko Port par listen karwana aur DB connect karna.
 */

dotenv.config();

// Connect Database and Start Server
connectDB().then(() => {
    const PORT = process.env.PORT || 5001;
    console.log(`🔍 PORT from env: ${process.env.PORT}`);
    app.listen(PORT, () => {
        console.log(`📡 Server started in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
});
