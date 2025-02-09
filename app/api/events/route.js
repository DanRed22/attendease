import { NextResponse } from 'next/server'
import Prisma from '@prisma/client'
import moment from 'moment'

const prisma = new Prisma.PrismaClient()

// GET all events
export async function GET() {
    try {
        const events = await prisma.event.findMany()
        return NextResponse.json(events)
    } catch (error) {
        return NextResponse.json(
            { error: 'Error fetching events' },
            { status: 500 },
        )
    }
}

// POST new event
export async function POST(request) {
    try {
        const data = await request.json()
        const event = await prisma.events.create({
            data: {
                data,
                createdAt: moment().format(),
                updatedAt: moment().format(),
            },
        })
        return NextResponse.json(event, { status: 201 })
    } catch (error) {
        return NextResponse.json(
            { error: 'Error creating event' },
            { status: 500 },
        )
    }
}

// PUT update event
export async function PUT(request) {
    try {
        const data = await request.json()
        const { id, ...updateData } = data

        const event = await prisma.events.update({
            where: { id },
            data: { updateData, updatedAt: moment().format() },
        })
        return NextResponse.json(event)
    } catch (error) {
        return NextResponse.json(
            { error: 'Error updating event' },
            { status: 500 },
        )
    }
}

// DELETE event
export async function DELETE(request) {
    try {
        const { id } = await request.json()
        await prisma.event.update({
            data: { deletedAt: moment().format() },
            where: { id },
        })
        return NextResponse.json({ message: 'Event deleted' })
    } catch (error) {
        return NextResponse.json(
            { error: 'Error deleting event' },
            { status: 500 },
        )
    }
}
