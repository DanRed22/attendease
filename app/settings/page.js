'use client'
import AddModal from '@/components/fields/AddModal'
import React, { useState, useEffect } from 'react'
import { MdAddBox } from 'react-icons/md'
import Swal from 'sweetalert2'
import { TbTrashFilled } from 'react-icons/tb'

export default function Settings() {
    const [showAddModal, setShowAddModal] = useState(false)
    const [fields, setFields] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchFields = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/fields')
            const jsonData = await response.json()
            setFields(jsonData?.data ?? [])
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

    const handleDelete = async (id) => {
        const confirmDelete = await Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: 'You will not be able to recover this field!',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
        })

        if (confirmDelete.isConfirmed) {
            try {
                const response = await fetch(`/api/fields/delete/`, {
                    method: 'POST',
                    body: JSON.stringify({
                        id: id,
                    }),
                })
                const data = await response.json()
                if (data.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Field deleted successfully',
                    })
                    fetchFields()
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'An error occurred while deleting the field',
                    })
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred while deleting the field',
                })
            }
        }
    }
    useEffect(() => {
        const fetchFields = async () => {
            setLoading(true)
            try {
                const response = await fetch('/api/fields')
                const jsonData = await response.json()
                setFields(jsonData?.data ?? [])
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

        fetchFields()
    }, [])
    return (
        <div className="container mx-auto px-4 py-8 h-screen w-screen">
            <AddModal
                show={showAddModal}
                handleClose={() => setShowAddModal(false)}
                refreshFields={fetchFields}
            />
            <h1 className="text-3xl">Settings</h1>

            <div className="flex justify-center flex-col mt-8 container w-full p-4 bg-slate-600 rounded-lg shadow-md">
                <h3 className="font-bold text-xl">Table Fields</h3>
                <p className="text-sm text-gray-300">
                    Add, edit, and delete fields
                </p>
                <div className="w-full flex justify-end">
                    <div className="tooltip" data-tip="Add Field">
                        <button
                            className="btn btn-primary p-2 btn-square"
                            onClick={() => setShowAddModal(true)}
                        >
                            <MdAddBox size={'1.5rem'} />
                        </button>
                    </div>
                </div>
                {loading && <p className="text-center">Loading...</p>}
                <div>
                    <table className=" mt-4 bg-zinc-900 rounded-md w-[100%] p-8 ">
                        <thead className="text-center font-bold">
                            <tr>
                                <th className="p-2 border bg-slate-800">
                                    Display Name
                                </th>
                                <th className="p-2 border bg-slate-800">
                                    DB Name
                                </th>
                                <th className="p-2 border bg-slate-800">
                                    Type
                                </th>
                                <th className="p-2 border bg-slate-800">
                                    Required
                                </th>
                                <th className="p-2 border bg-slate-800">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                key={'name'}
                                className="text-center p-4 border-b border-gray-300 bg-slate-400 text-black"
                            >
                                <td className="border p-2 overflow-elipsis ">
                                    Name
                                </td>
                                <td className="border p-2 overflow-elipsis ">
                                    display_name
                                </td>
                                <td className="border p-2 overflow-elipsis ">
                                    text
                                </td>
                                <td className="border p-2 overflow-elipsis ">
                                    Required
                                </td>
                                <td className="border p-2">DEFAULT</td>
                            </tr>
                            <tr
                                key={'email'}
                                className="text-center p-4 border-b border-gray-300 bg-slate-400 text-black"
                            >
                                <td className="border p-2 overflow-elipsis ">
                                    Email
                                </td>
                                <td className="border p-2 overflow-elipsis ">
                                    email
                                </td>
                                <td className="border p-2 overflow-elipsis ">
                                    text
                                </td>
                                <td className="border p-2 overflow-elipsis ">
                                    Required
                                </td>
                                <td className="border p-2">DEFAULT</td>
                            </tr>
                            {Array.isArray(fields) &&
                                fields.map((field) => (
                                    <tr
                                        key={field.id}
                                        className="text-center p-4 border-b border-gray-300"
                                    >
                                        <td className="border p-2 overflow-elipsis">
                                            {field.display_name}
                                        </td>
                                        <td className="border p-2 overflow-elipsis">
                                            {field.name}
                                        </td>
                                        <td className="border p-2 overflow-elipsis">
                                            {field.type}
                                        </td>
                                        <td className="border p-2 overflow-elipsis">
                                            {field.required
                                                ? 'Required'
                                                : 'Optional'}
                                        </td>
                                        <td className="border p-2">
                                            <button
                                                onClick={() =>
                                                    handleDelete(field.id)
                                                }
                                            >
                                                <TbTrashFilled size="1.5rem" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                        {(Array.isArray(fields) && fields.length === 0) ||
                            (!Array.isArray(fields) && (
                                <p className="text-center">No Fields Found</p>
                            ))}
                    </table>
                </div>
            </div>
        </div>
    )
}
