import { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import Prisma from '@prisma/client'
import moment from 'moment'
import bcrypt from 'bcryptjs'

const prisma = new Prisma.PrismaClient()

//LOGIN VIA EMAIL AND PASSWORD
export async function POST(request) {
    try {
        const data = await request.json()
        let { email, password } = data
        password = password.toString().trim()
        email = email.toString().trim()
        let user = await prisma.users.findUnique({
            where: { email },
        })

        if (!user) {
            return NextResponse.json(
                { message: 'User not found', error: true },
                { status: 404 },
            )
        }

        //password = bcrypt.hashSync(password.toString().trim(), 10)
        const passwordMatch = await bcrypt.compare(password, user.password)
        console.log(passwordMatch)
        delete user.password
        if (!passwordMatch) {
            return NextResponse.json(
                { message: 'Invalid password', error: true },
                { status: 401 },
            )
        }

        return NextResponse.json(
            { user, error: false, message: 'Login successful' },
            { status: 200 },
        )
    } catch (error) {
        return NextResponse.json(
            {
                message: 'Error logging in',
                error: true,
                error_message: error.message,
            },
            { status: 500 },
        )
    }
}
