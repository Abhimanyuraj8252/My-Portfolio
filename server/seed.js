import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const hash = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
        where: { email: 'admin@admin.com' },
        update: {},
        create: { email: 'admin@admin.com', password: hash },
    });
    console.log('Admin created: admin@admin.com / admin123');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
