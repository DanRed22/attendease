'use client'
import AttendanceTable from '@/components/attendance-table/AttendanceTable'
import React, { useEffect, useState } from 'react'
import { MdAddBox } from 'react-icons/md'
import Swal from 'sweetalert2'

export default function FieldsPage() {
    const [fields, setFields] = useState([])
    const [attendees, setAttendees] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchFields = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/fields')
            const jsonData = await response.json()
            setFields(jsonData?.data ?? [])
            const temp_fields = jsonData?.data.map((field) => ({
                ...field,
                config: field.config ? JSON.parse(field.config) : {},
            }))
            setFields(temp_fields)
            console.log('Fields:', temp_fields)
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while fetching fields',
            })
            setFields([])
        } finally {
            setLoading(false)
        }
    }

    const fetchAttendees = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/attendees')
            const jsonData = await response.json()
            const temp_attendees =
                jsonData?.data?.map((attendee) => ({
                    ...attendee,
                    data: attendee.data ? JSON.parse(attendee.data) : {},
                })) ?? []
            setAttendees(temp_attendees)
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while fetching attendees',
            })
            setAttendees([])
        } finally {
            setLoading(false)
        }
    }

    const fetchData = async () => {
        await fetchFields()
        await fetchAttendees()
    }

    useEffect(() => {
        fetchData()
    }, [])
    return (
        <div className="w-full h-screen flex flex-col items-center justify-start">
            <div className="flex w-full justify-between items-center px-10 py-4">
                <h1 className="text-3xl font-bold justify-start">Attendance</h1>
                <div className="tooltip-bottom tooltip" data-tip="Add Field">
                    <button className="btn btn-primary p-2 btn-square">
                        <MdAddBox size={'1.5rem'} />
                    </button>
                </div>
            </div>
            <div className="w-[95%] p-2 shadow-lg overflow-scroll rounded-lg bg-slate-700 ">
                {loading && <p className="text-center p-4">Loading...</p>}
                {!loading && (
                    <AttendanceTable
                        data={attendees}
                        fields={fields}
                        setData={setAttendees}
                        fetchData={fetchData}
                    />
                )}
            </div>
        </div>
    )
}
