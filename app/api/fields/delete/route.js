import { NextRequest, NextResponse } from 'next/server'
import Prisma from '@prisma/client'
import moment from 'moment'

const prisma = new Prisma.PrismaClient()

export async function POST(request) {
    try {
        const data = await request.json()
        const field = await prisma.fields.delete({
            where: {
                id: data.id,
            },
        })
        return NextResponse.json({
            field,
            message: 'Field deleted',
            status: 200,
        })
    } catch (error) {
        return NextResponse.json({
            message: 'Error deleting field',
            error: error.message,
            status: 500,
        })
    }
}
