import { NextRequest } from 'next/server'
import Prisma from '@prisma/client'
import moment from 'moment'

const prisma = new Prisma.PrismaClient()

export async function GET() {
    try {
        const field = await prisma.fields.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            skip: offset,
            take: number_of_items,
        })
        return NextResponse.json({
            field,
            message: 'Fields found',
            status: 200,
        })
    } catch (error) {
        return NextResponse.json({
            message: 'Error fetching fields',
            status: 500,
        })
    }
}

export async function POST(request) {
    try {
        const data = await request.json()
        const field = await prisma.fields.create({
            data: {
                ...data,
                createdAt: moment().format(),
                updatedAt: moment().format(),
            },
        })
        return NextResponse.json({
            field,
            status: 201,
            message: 'Field created',
        })
    } catch (error) {
        return NextResponse.json(
            { message: 'Error creating field' },
            { status: 500 },
        )
    }
}

export async function PUT(request) {
    try {
        const data = await request.json()
        const field = await prisma.fields.update({
            where: {
                id: data.id,
            },
            data: {
                ...data,
                updatedAt: moment().format(),
            },
        })
        return NextResponse.json({
            field,
            message: 'Field updated',
            status: 200,
        })
    } catch (error) {
        return NextResponse.json({
            message: 'Error updating field',
            status: 500,
        })
    }
}
