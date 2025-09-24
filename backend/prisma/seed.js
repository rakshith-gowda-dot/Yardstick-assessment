import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

async function main() {
    console.log('Starting database seeding...');
    
    // Clear existing data
    await prisma.note.deleteMany();
    await prisma.user.deleteMany();
    await prisma.tenant.deleteMany();

    // Create tenants
    const acme = await prisma.tenant.create({
        data: {
            slug: 'acme',
            name: 'Acme Corporation',
            plan: 'FREE'
        }
    });

    const globex = await prisma.tenant.create({
        data: {
            slug: 'globex',
            name: 'Globex Corporation',
            plan: 'FREE'
        }
    });

    console.log('Tenants created:', { acme: acme.slug, globex: globex.slug });

    // Create users for Acme - FIXED ROLES
    await prisma.user.create({
        data: {
            email: 'admin@acme.test',
            password: hashPassword('password'),
            role: 'ADMIN', // Correct role
            tenantId: acme.id
        }
    });

    await prisma.user.create({
        data: {
            email: 'user@acme.test',
            password: hashPassword('password'),
            role: 'MEMBER', // Correct role - should NOT see upgrade
            tenantId: acme.id
        }
    });

    // Create users for Globex
    await prisma.user.create({
        data: {
            email: 'admin@globex.test',
            password: hashPassword('password'),
            role: 'ADMIN', // Correct role
            tenantId: globex.id
        }
    });

    await prisma.user.create({
        data: {
            email: 'user@globex.test',
            password: hashPassword('password'),
            role: 'MEMBER', // Correct role - should NOT see upgrade
            tenantId: globex.id
        }
    });

    console.log('Database seeded successfully!');
    console.log('=== TEST ACCOUNTS ===');
    console.log('Acme Corporation:');
    console.log('  👑 Admin: admin@acme.test / password (CAN upgrade)');
    console.log('  👤 Member: user@acme.test / password (CANNOT upgrade)');
    console.log('Globex Corporation:');
    console.log('  👑 Admin: admin@globex.test / password (CAN upgrade)');
    console.log('  👤 Member: user@globex.test / password (CANNOT upgrade)');
}

main()
    .catch((e) => {
        console.error('Seeding error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });