import express from 'express';
import prisma from '../lib/db.js';
import { authenticateToken } from '../lib/middleware.js';

const router = express.Router();

router.use(authenticateToken);

// Get all notes for current tenant
router.get('/', async (req, res) => {
    try {
        const notes = await prisma.note.findMany({
            where: { tenantId: req.user.tenantId },
            include: { author: { select: { email: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(notes);
    } catch (error) {
        console.error('Get notes error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get specific note
router.get('/:id', async (req, res) => {
    try {
        const note = await prisma.note.findFirst({
            where: {
                id: req.params.id,
                tenantId: req.user.tenantId
            },
            include: { author: { select: { email: true } } }
        });

        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.json(note);
    } catch (error) {
        console.error('Get note error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create new note
router.post('/', async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content required' });
        }

        // Check note limit for free plan
        if (req.user.tenant.plan === 'FREE') {
            const noteCount = await prisma.note.count({
                where: { tenantId: req.user.tenantId }
            });

            if (noteCount >= 3) {
                return res.status(403).json({ 
                    error: 'Free plan limit reached. Upgrade to Pro to create more notes.' 
                });
            }
        }

        const note = await prisma.note.create({
            data: {
                title,
                content,
                tenantId: req.user.tenantId,
                authorId: req.user.id
            },
            include: { author: { select: { email: true } } }
        });

        res.status(201).json(note);
    } catch (error) {
        console.error('Create note error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update note
router.put('/:id', async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content required' });
        }

        const note = await prisma.note.findFirst({
            where: {
                id: req.params.id,
                tenantId: req.user.tenantId
            }
        });

        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        const updatedNote = await prisma.note.update({
            where: { id: req.params.id },
            data: { title, content },
            include: { author: { select: { email: true } } }
        });

        res.json(updatedNote);
    } catch (error) {
        console.error('Update note error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete note
router.delete('/:id', async (req, res) => {
    try {
        const note = await prisma.note.findFirst({
            where: {
                id: req.params.id,
                tenantId: req.user.tenantId
            }
        });

        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        await prisma.note.delete({
            where: { id: req.params.id }
        });

        res.status(204).send();
    } catch (error) {
        console.error('Delete note error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;