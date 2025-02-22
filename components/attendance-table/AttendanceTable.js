'use client'
import React, { Fragment, Suspense, use, useEffect, useState } from 'react'
import AttendanceInput from './AttendanceInput'
import axios from 'axios'
import { TbTrashFilled } from 'react-icons/tb'
import { FaPencilAlt } from 'react-icons/fa'
import { getUserRole } from '@/utils/auth'
import Swal from 'sweetalert2'
import EditModal from './EditModal'
import AddAttendeeModal from './AddAttendeeModal'

export default function AttendanceTable({ fields, setData, data, fetchData }) {
    const [role, setRole] = useState(null)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingAttendee, setEditingAttendee] = useState(null)

    useEffect(() => {
        userRole()
    }, [])

    const saveAttendeeData = async (attendee) => {
        try {
            await axios.put('/api/attendees', {
                ...attendee,
            })
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Attendee data updated successfully',
            })
            setShowEditModal(false)
            setEditingAttendee(null)
            await fetchData()
        } catch (error) {
            console.error('Error updating data:', error.messsage)
        }
    }

    const closeEditModal = () => {
        setShowEditModal(false)
    }

    const userRole = async () => {
        const usr_role = await getUserRole()
        setRole(usr_role)
    }
    const onTimeIn = async (index) => {
        setData((prevData) => {
            const newData = [...prevData]
            newData[index] = {
                ...newData[index],
                time_in: new Date().toISOString(),
            }
            return newData
        })

        await axios.put('/api/attendees/time-in', { id: data[index].id })
        await fetchData()
    }

    const onTimeOut = async (index) => {
        setData((prevData) => {
            const newData = [...prevData]
            newData[index] = {
                ...newData[index],
                time_out: new Date().toISOString(),
            }
            return newData
        })

        await axios.put('/api/attendees/time-out', { id: data[index].id })
        await fetchData()
    }

    const onResetTimeIn = async (index) => {
        setData((prevData) => {
            const newData = [...prevData]
            newData[index] = { ...newData[index], time_in: null }
            return newData
        })

        await axios.put('/api/attendees/reset-time-in', { id: data[index].id })
        await fetchData()
    }

    const onResetTimeOut = async (index) => {
        setData((prevData) => {
            const newData = [...prevData]
            newData[index] = { ...newData[index], time_out: null }
            return newData
        })

        await axios.put('/api/attendees/reset-time-out', { id: data[index].id })
        await fetchData()
    }

    const deleteAttendee = async (index) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'The attendee will be deleted from the list',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
        }).then(async (confirm) => {
            if (!confirm) return

            await axios.delete('/api/attendees', {
                data: { id: data[index].id },
            })
            await fetchData()
        })
    }

    return (
        <div className="overflow-scroll">
            {showEditModal && (
                <EditModal
                    attendee={editingAttendee}
                    fetchData={fetchData}
                    onClose={closeEditModal}
                    saveData={saveAttendeeData}
                />
            )}

            <table className="w-full bg-zinc-900 rounded-md p-8">
                <thead className="text-center font-bold sticky">
                    <tr>
                        <th className="p-2 border bg-slate-800">Name</th>
                        <th className="p-2 border bg-slate-800">Email</th>
                        <Suspense>
                            {fields.map((field, index) => (
                                <th
                                    key={index}
                                    className="p-2 border bg-slate-800"
                                >
                                    <div
                                        className="tooltip"
                                        data-tip={`${field.name}`}
                                    >
                                        {field.display_name}
                                    </div>
                                </th>
                            ))}
                        </Suspense>
                        <th className="p-2 border bg-slate-800">Time In</th>
                        <th className="p-2 border bg-slate-800">Time Out</th>
                        <th className="p-4 border bg-slate-800">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-center">
                    {data.map((attendee, attendee_index) => (
                        <tr key={`${attendee_index}_${attendee.id}`}>
                            <td className="p-4 border">{attendee.name}</td>
                            <td className="p-4 border">{attendee.email}</td>

                            <Suspense fallback={<p>Loading....</p>}>
                                {fields.map((field, field_index) => (
                                    <td
                                        key={`${attendee_index}_${attendee.id}_field_index_${field_index}`}
                                        className="p-4 border"
                                    >
                                        <AttendanceInput
                                            index={attendee_index}
                                            field={field}
                                            setData={setData}
                                            data={data}
                                            attendee={attendee}
                                            value={
                                                attendee.data[field.name] ||
                                                null
                                            }
                                            fetchData={fetchData}
                                        />
                                    </td>
                                ))}
                            </Suspense>
                            <td className="p-4 border">
                                <div>
                                    {attendee.timeIn ? (
                                        <button
                                            onClick={() =>
                                                onResetTimeIn(attendee_index)
                                            }
                                            className="w-28 p-1 text-white rounded-md bg-green-700"
                                        >
                                            Present
                                        </button>
                                    ) : (
                                        <button
                                            className="w-28 text-black p-1 rounded-md bg-yellow-400"
                                            onClick={() =>
                                                onTimeIn(attendee_index)
                                            }
                                        >
                                            Time In
                                        </button>
                                    )}
                                </div>
                            </td>
                            <td className="p-4 border">
                                <div>
                                    {attendee.timeOut ? (
                                        <button
                                            onClick={() =>
                                                onResetTimeOut(attendee_index)
                                            }
                                            className="w-28 p-1 text-white rounded-md bg-green-700"
                                        >
                                            Logged Out
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                onTimeOut(attendee_index)
                                            }
                                            className="w-28 text-black p-1 rounded-md bg-yellow-400"
                                        >
                                            Time Out
                                        </button>
                                    )}
                                </div>
                            </td>
                            <td className="p-4 border">
                                <div className="flex justify-center items-center space-x-2">
                                    <button
                                        onClick={() => {
                                            setEditingAttendee(
                                                data[attendee_index],
                                            )
                                            setShowEditModal(true)
                                        }}
                                        className="btn btn-primary"
                                    >
                                        <FaPencilAlt size="1rem" />
                                    </button>

                                    {role && role === 'ADMIN' && (
                                        <button
                                            onClick={() =>
                                                deleteAttendee(attendee_index)
                                            }
                                            className="btn btn-secondary"
                                        >
                                            {' '}
                                            <TbTrashFilled size="1rem" />
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                    {(!data || data.length === 0) && (
                        <tr>
                            <td className="p-4" colSpan={fields.length + 5}>
                                No attendees found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
