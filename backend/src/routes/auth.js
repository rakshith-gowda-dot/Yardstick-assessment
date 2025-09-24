import express from 'express';
import prisma from '../lib/db.js';
import { generateToken, comparePassword } from '../lib/auth.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const user = await prisma.user.findUnique({
            where: { email },
            include: { tenant: true }
        });

        if (!user || !comparePassword(password, user.password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
            tenantId: user.tenantId,
            tenantSlug: user.tenant.slug
        });

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                tenant: user.tenant
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;