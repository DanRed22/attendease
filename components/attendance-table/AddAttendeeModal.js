'use client'
import React, { Fragment, useState } from 'react'
import Swal from 'sweetalert2'

export default function AddAttendeeModal({ fetchData, onClose }) {
    const [attendee, setAttendee] = useState({
        name: '',
        email: '',
    })

    const handleSave = async () => {
        if (!attendee.name || !attendee.email) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Name and Email are required',
            })
            return
        }
        try {
            await fetch('/api/attendees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(attendee),
            })

            Swal.file({
                icon: 'success',
                title: 'Success',
                text: 'Attendee added successfully',
                confirmButtonText: 'Close',
                showConfirmButton: true,
                willClose: async () => {
                    await fetchData()
                    onClose()
                },
            })
        } catch (error) {
            console.error('Error updating attendee:', error.message)
        }
    }
    return (
        <Fragment>
            <div className=" absolute z-50 backdrop-blur-md w-full h-full flex top-0 left-0 justify-center items-center">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Editing Attendee</h3>
                    <label class="form-control w-full max-w-xs">
                        <div class="label">
                            <span class="label-text">Name</span>
                            <span class="label-text-alt">Required</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Name"
                            class="input input-bordered w-full max-w-xs"
                            value={attendee?.name || ''}
                            onChange={(e) =>
                                setAttendee({
                                    ...attendee,
                                    name: e.target.value,
                                })
                            }
                        />
                    </label>
                    <label class="form-control w-full max-w-xs mt-4">
                        <div class="label">
                            <span class="label-text">Email</span>
                            <span class="label-text-alt">Required</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Email"
                            class="input input-bordered w-full max-w-xs"
                            value={attendee?.email || null}
                            onChange={(e) =>
                                setAttendee({
                                    ...attendee,
                                    email: e.target.value,
                                })
                            }
                        />
                    </label>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button
                                onClick={() => {
                                    console.log('Closing modal...')
                                    onClose()
                                }}
                                className="btn"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    console.log('Saving data...')
                                    handleSave()
                                    onClose()
                                }}
                                className="btn"
                            >
                                Save
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
