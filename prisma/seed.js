const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    const hashedPassword = bcrypt.hashSync('12345678', 10)

    const admin = await prisma.users.create({
        data: {
            email: 'admin@example.com',
            password: hashedPassword,
            username: 'admin',
            name: 'Admin User',
            role: 'ADMIN',
        },
    })

    console.log('Created admin user:', admin)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
