import { NextResponse, NextRequest } from 'next/server'
import Prisma from '@prisma/client'
import moment from 'moment'

const prisma = new Prisma.PrismaClient()

export async function PUT(request) {
    try {
        const current_time = moment().format()
        const data = await request.json()
        const { id, ...rest } = data
        const field = await prisma.attendees.update({
            where: {
                id: parseInt(id),
            },
            data: {
                ...rest,
                updatedAt: current_time,
                timeOut: null,
            },
        })
        return NextResponse.json({
            field,
            status: 200,
            message: 'Attendee Time Out Reset',
        })
    } catch (error) {
        return NextResponse.json({
            message: 'Error updating attendee',
            status: 500,
        })
    }
}
