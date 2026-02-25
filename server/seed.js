import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const hash = await bcrypt.hash('@Abhi98018', 10);
    const user = await prisma.user.upsert({
        where: { email: 'abhimanyuraj134@gmail.com' },
        update: {
            password: hash
        },
        create: {
            email: 'abhimanyuraj134@gmail.com',
            password: hash
        },
    });
    console.log('Admin updated/created: abhimanyuraj134@gmail.com / @Abhi98018');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
