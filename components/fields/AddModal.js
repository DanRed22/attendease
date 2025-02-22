import React, { Fragment, useState } from 'react'
import Swal from 'sweetalert2'

const AddModal = ({ show, handleClose, refreshFields }) => {
    const [optionValue, setOptionValue] = useState('')
    const [fieldData, setFieldData] = useState({
        display_name: '',
        name: '',
        type: 'text',
        required: false,
        config: {
            options: [],
        },
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleAdd(fieldData)
        setFieldData({
            display_name: '',
            name: '',
            type: 'text',
            required: false,
            config: fieldData.config,
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
                willClose: () => {
                    refreshFields()
                    handleClose()
                },
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
                                    {/* <option value="date">Date</option>*/}
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
                        {fieldData.type === 'select' && (
                            <Fragment>
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
                                                type="text"
                                                value={optionValue}
                                                className="input input-bordered w-full"
                                                onChange={(e) =>
                                                    setOptionValue(
                                                        e.target.value,
                                                    )
                                                }
                                                onKeyDown={(e) => {
                                                    if (
                                                        e.key === 'Enter' ||
                                                        e.keyCode === 13 ||
                                                        e.key === ','
                                                    ) {
                                                        if (
                                                            optionValue ===
                                                                '' &&
                                                            typeof optionValue !==
                                                                'string'
                                                        )
                                                            return
                                                        e.preventDefault()

                                                        if (
                                                            !fieldData.config
                                                                .options
                                                        ) {
                                                            setFieldData({
                                                                ...fieldData,
                                                                config: {
                                                                    options: [],
                                                                },
                                                            })
                                                        }
                                                        console.log(
                                                            'FIELD DATABAHHHHH',
                                                            fieldData,
                                                        )

                                                        setFieldData({
                                                            ...fieldData,
                                                            config: {
                                                                ...fieldData.config,
                                                                options: [
                                                                    ...fieldData
                                                                        .config
                                                                        .options,
                                                                    optionValue,
                                                                ],
                                                            },
                                                        })

                                                        setOptionValue('')
                                                    }
                                                }}
                                            />
                                        </label>
                                        <div className="rounded-lg p-2 border mt-2 space-y-1">
                                            {fieldData.config?.options?.map(
                                                (option, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex justify-between"
                                                    >
                                                        <span>{option}</span>
                                                        <button
                                                            onClick={() => {
                                                                setFieldData({
                                                                    ...fieldData,
                                                                    config: {
                                                                        ...fieldData.config,
                                                                        options:
                                                                            fieldData.config.options.filter(
                                                                                (
                                                                                    opt,
                                                                                ) =>
                                                                                    opt !==
                                                                                    option,
                                                                            ),
                                                                    },
                                                                })
                                                            }}
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-5 w-5"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M10 0C4.477 0 0 4.477 0 10c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10 0-5.523-4.477-10-10-10zM5 9a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2H5z"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Fragment>
                        )}
                        <div className="modal-action">
                            <button
                                type="button"
                                className="btn"
                                onClick={() => {
                                    setFieldData({
                                        display_name: '',
                                        name: '',
                                        type: 'text',
                                        required: false,
                                        config: {
                                            options: [],
                                        },
                                    })
                                    handleClose()
                                }}
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
