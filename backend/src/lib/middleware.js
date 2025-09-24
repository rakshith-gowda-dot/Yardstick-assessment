import { verifyToken } from './auth.js';
import prisma from './db.js';

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: { tenant: true }
        });

        if (!user) {
            return res.status(403).json({ error: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};