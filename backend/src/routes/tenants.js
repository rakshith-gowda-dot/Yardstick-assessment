import express from 'express';
import prisma from '../lib/db.js';
import { authenticateToken, requireAdmin } from '../lib/middleware.js';

const router = express.Router();

router.use(authenticateToken);
router.use(requireAdmin);

// Upgrade tenant to Pro
router.post('/:slug/upgrade', async (req, res) => {
    try {
        if (req.user.tenant.slug !== req.params.slug) {
            return res.status(403).json({ error: 'Cannot upgrade other tenants' });
        }

        const tenant = await prisma.tenant.update({
            where: { slug: req.params.slug },
            data: { plan: 'PRO' }
        });

        res.json({ 
            message: 'Successfully upgraded to Pro plan',
            tenant 
        });
    } catch (error) {
        console.error('Upgrade error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;