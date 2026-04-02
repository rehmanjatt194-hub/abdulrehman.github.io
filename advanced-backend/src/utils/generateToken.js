import jwt from 'jsonwebtoken';

/**
 * Maqsad: User ID ke basis par JWT token create karna.
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export default generateToken;
