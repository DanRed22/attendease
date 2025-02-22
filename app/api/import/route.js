import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { PrismaClient } from '@prisma/client' // Adjust the import path for Prisma

const prisma = new PrismaClient()
export async function POST(request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file')

        if (!file) {
            return NextResponse.json(
                { message: 'No file uploaded' },
                { status: 400 },
            )
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const workbook = XLSX.read(buffer, { type: 'buffer' })
        const sheetName = workbook.SheetNames[0]
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])

        let temp_data = data.map((record) => {
            let extraData = {}

            Object.keys(record).forEach((key) => {
                if (key !== 'name' && key !== 'email') {
                    extraData[key] = record[key]
                }
            })

            return {
                name: record['name'],
                email: record['email'],
                data: JSON.stringify(extraData),
            }
        })

        // **Perform upsert for each record**
        const result = await Promise.all(
            temp_data.map(async (attendee) => {
                return prisma.attendees.create({
                    data: attendee,
                })
            }),
        )

        return NextResponse.json({
            data: result,
            message: 'Excel parsed successfully',
        })
    } catch (error) {
        console.error('Error parsing Excel:', error)
        return NextResponse.json(
            { message: 'Error parsing file' },
            { status: 500 },
        )
    }
}
