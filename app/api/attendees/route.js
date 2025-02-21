import { NextResponse, NextRequest } from 'next/server'
import Prisma from '@prisma/client'
import moment from 'moment'

const prisma = new Prisma.PrismaClient()

export async function GET(request) {
    try {
        const search = request.nextUrl.searchParams.get('search') || ''

        console.log('Search:', search)

        const whereCondition = search
            ? {
                  OR: [
                      { name: { contains: search, mode: 'insensitive' } },
                      { email: { contains: search, mode: 'insensitive' } },
                      { data: { contains: search, mode: 'insensitive' } },
                  ],
              }
            : {} // No filter if search is empty

        const field = await prisma.attendees.findMany({
            where: whereCondition,
            orderBy: { createdAt: 'asc' },
        })

        return NextResponse.json({
            data: field || [],
            message: 'Fields found',
            status: 200,
        })
    } catch (error) {
        return NextResponse.json({
            data: [],
            message: 'Error fetching fields',
            status: 500,
        })
    }
}

export async function POST(request) {
    try {
        const data = await request.json()
        const field = await prisma.attendees.create({
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
        const field = await prisma.attendees.update({
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
            status: 200,
            message: 'Field updated',
        })
    } catch (error) {
        return NextResponse.json(
            { message: 'Error updating field' },
            { status: 500 },
        )
    }
}

export async function DELETE(request) {
    try {
        const data = await request.json()
        const field = await prisma.attendees.delete({
            where: {
                id: data.id,
            },
        })
        return NextResponse.json({
            field,
            status: 200,
            message: 'Field deleted',
        })
    } catch (error) {
        return NextResponse.json(
            { message: 'Error deleting field' },
            { status: 500 },
        )
    }
}
