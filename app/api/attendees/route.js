import { NextResponse, NextRequest } from 'next/server'
import Prisma from '@prisma/client'
import moment from 'moment'

const prisma = new Prisma.PrismaClient()

export async function GET(request) {
    try {
        const url = new URL(request.url) // Properly extract search params
        const search = url.searchParams.get('search') || ''
        const take = Number(url.searchParams.get('take')) || 25
        const offset = Number(url.searchParams.get('offset') || 0)
        // console.log('Search:', search)

        const whereCondition = {
            deletedAt: null,
            ...(search
                ? {
                      OR: [
                          { name: { contains: search, mode: 'insensitive' } },
                          { email: { contains: search, mode: 'insensitive' } },
                      ],
                  }
                : {}),
        }

        //console.log('Where Condition:', JSON.stringify(whereCondition, null, 2))

        const fields = await prisma.attendees.findMany({
            //where: whereCondition,
            where: {
                deletedAt: null,
                OR: [
                    { email: { contains: String(search) } },
                    { name: { contains: String(search) } },
                    { data: { contains: String(search) } },
                ],
            },
            orderBy: { createdAt: 'asc' },
            take: take,
            skip: take * offset,
        })

        const count_present = await prisma.attendees.count({
            where: {
                deletedAt: null,
                timeIn: { not: null },
            },
        })

        const count_not_present = await prisma.attendees.count({
            where: {
                deletedAt: null,
                timeIn: null,
            },
        })

        const count_time_out = await prisma.attendees.count({
            where: {
                deletedAt: null,
                timeOut: { not: null },
            },
        })

        const count_not_timed_out = await prisma.attendees.count({
            where: {
                timeOut: null,
                deletedAt: null,
            },
        })

        const total = await prisma.attendees.count({
            where: {
                deletedAt: null,
            },
        })

        // console.log('Fields:', fields) // Log the result of the query

        // console.log('Fields:', fields) // Log the fields
        return NextResponse.json({
            data: fields,
            count: {
                present: count_present,
                not_present: count_not_present,
                time_out: count_time_out,
                not_timed_out: count_not_timed_out,
                total: total,
            },
            message: 'Fields found',
            status: 200,
        })
    } catch (error) {
        console.error('Error fetching fields:', error || 'Unknown error')
        return NextResponse.json(
            {
                data: [],
                message: 'Error fetching fields',
                error: error ? error.message : 'Unknown error',
            },
            { status: 500 },
        )
    }
}

export async function POST(request) {
    try {
        const data = await request.json()
        data.data = JSON.stringify({})
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
            message: 'attendee created',
        })
    } catch (error) {
        return NextResponse.json(
            { message: 'Error creating attendee' },
            { status: 500 },
        )
    }
}

export async function PUT(request) {
    try {
        const received_data = await request.json()
        if (received_data?.data && typeof received_data.data === 'object') {
            received_data.data = JSON.stringify(received_data.data)
        }
        const id = received_data.id
        delete received_data.id
        //console.log('ID', id)
        console.log('RECEIVED DATA', received_data)
        const field = await prisma.attendees.update({
            where: {
                id: id,
            },
            data: {
                ...received_data,
                updatedAt: moment().toISOString(),
            },
        })

        return NextResponse.json({
            field,
            status: 200,
            message: 'Field updated',
        })
    } catch (error) {
        console.error('Error updating field:', error)
        return NextResponse.json(
            { message: 'Error updating field', error_message: error.message },
            { status: 500 },
        )
    }
}

export async function DELETE(request) {
    try {
        const data = await request.json()
        console.log('DATA', data.id)

        const field = await prisma.attendees.update({
            where: { id: data.id },
            data: { deletedAt: moment().toISOString() },
        })

        return NextResponse.json({
            field,
            status: 200,
            message: 'Field deleted',
        })
    } catch (error) {
        console.error('Error deleting field:', error)
        return NextResponse.json(
            { message: 'Error deleting field' },
            { status: 500 },
        )
    }
}
