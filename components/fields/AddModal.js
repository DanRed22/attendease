import React, { Fragment, useState } from 'react'
import Swal from 'sweetalert2'

const AddModal = ({ show, handleClose }) => {
    const [fieldData, setFieldData] = useState({
        display_name: '',
        name: '',
        type: 'text',
        required: false,
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleAdd(fieldData)
        setFieldData({
            display_name: '',
            name: '',
            type: 'text',
            required: false,
        })
    }

    const handleAdd = async (fieldData) => {
        'Adding field:', fieldData
        try {
            const response = await fetch('/api/fields', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(fieldData),
            })
            const data = await response.json()
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Field added successfully',
                showConfirmButton: true,
                confirmButtonText: 'Close',
                willClose: () => handleClose(),
            })
        } catch (error) {
            console.error('Error adding field:', error)
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while adding the field',
            })
        }
    }

    return (
        <Fragment>
            <dialog className={`modal ${show ? 'modal-open' : ''}`}>
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Add New Field</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Field Name</span>
                            </label>
                            <div
                                className="tooltip"
                                data-tip="This will be used for display purposes"
                            >
                                <input
                                    type="text"
                                    placeholder="Enter field name"
                                    className="input input-bordered w-full"
                                    value={fieldData.display_name}
                                    onChange={(e) =>
                                        setFieldData({
                                            ...fieldData,
                                            display_name: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">
                                    Database Name
                                </span>
                            </label>
                            <div
                                className="tooltip"
                                data-tip="This will be used for actual database and CSV field name"
                            >
                                <input
                                    type="text"
                                    placeholder="sample_field_name"
                                    className="input input-bordered w-full"
                                    value={fieldData.name}
                                    onChange={(e) =>
                                        setFieldData({
                                            ...fieldData,
                                            name: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-control w-full">
                            <div
                                className="tooltip"
                                data-tip="This will be used to determine the type of data to be stored"
                            >
                                <label className="label">
                                    <span className="label-text">
                                        Field Type
                                    </span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={fieldData.type}
                                    onChange={(e) =>
                                        setFieldData({
                                            ...fieldData,
                                            type: e.target.value,
                                        })
                                    }
                                >
                                    <option value="text">Text</option>
                                    <option value="number">Number</option>
                                    <option value="textarea">Textarea</option>
                                    <option value="select">Select</option>
                                    <option value="date">Date</option>
                                    <option value="checkbox">Checkbox</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-control">
                            <div
                                className="tooltip"
                                data-tip="This determines if the field is required"
                            >
                                <label className="label cursor-pointer">
                                    <span className="label-text">
                                        Required field
                                    </span>
                                    <input
                                        type="checkbox"
                                        className="checkbox"
                                        checked={fieldData.required}
                                        onChange={(e) =>
                                            setFieldData({
                                                ...fieldData,
                                                required: e.target.checked,
                                            })
                                        }
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="modal-action">
                            <button
                                type="button"
                                className="btn"
                                onClick={handleClose}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Add Field
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </Fragment>
    )
}

export default AddModal
