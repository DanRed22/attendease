'use client'
import React, { Fragment, Suspense, useEffect } from 'react'
import AttendanceInput from './AttendanceInput'
import axios from 'axios'

export default function AttendanceTable({ fields, setData, data, fetchData }) {
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

    return (
        <div>
            <table className="w-full bg-zinc-900 rounded-md p-8 overflow-scroll">
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
                                {fields.map((field, index) => (
                                    <td
                                        key={`${attendee_index}_${attendee.id}_field_index_${index}`}
                                        className="p-4 border"
                                    >
                                        <AttendanceInput
                                            index={index}
                                            field={field}
                                            setData={setData}
                                            data={attendee}
                                            value={
                                                attendee.data[field.name] ||
                                                null
                                            }
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
                            <td>Action</td>
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
