'use client'
import React, { Fragment, useState } from 'react'

function EditModal({ attendee, fetchData, onClose, saveData }) {
    const [new_attendee_data, set_new_attendee_data] = useState(attendee)
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
                            value={new_attendee_data?.name || ''}
                            onChange={(e) =>
                                set_new_attendee_data({
                                    ...new_attendee_data,
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
                            value={new_attendee_data?.email || null}
                            onChange={(e) =>
                                set_new_attendee_data({
                                    ...new_attendee_data,
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
                                    saveData(new_attendee_data)
                                    onClose()
                                }}
                                className="btn"
                            >
                                Close
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default EditModal
