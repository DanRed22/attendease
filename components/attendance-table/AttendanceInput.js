'use client'
import React, { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'

export default function AttendanceInput({
    data,
    attendee,
    index,
    setData,
    field,
    fetchData,
}) {
    const [value, setValue] = useState(() => {
        if (field.type === 'checkbox') {
            return attendee?.data[field.name]
                ? Boolean(attendee.data[field.name])
                : false
        } else {
            return attendee.data[field.name] || undefined
        }
    })
    const [showSaveButton, setShowSaveButton] = useState(false)

    const handleUndo = () => {
        setValue(data[index]?.data[field.name] || undefined)
        setShowSaveButton(false)
    }
    // const handleSave = async () => {
    //     try {
    //         setShowSaveButton(false)
    //         let temp_data = data
    //         console.log('TYPEOF', typeof temp_data.data)
    //         console.log(
    //             'TEMP INDEx',
    //             index,
    //             value,
    //             temp_data[index].data[field.name],
    //         )
    //         if (field.type === 'checkbox') {
    //             temp_data[index].data[field.name] = !value
    //         } else {
    //             temp_data[index].data[field.name] = value
    //         }
    //         console.log('TEMP DATA', temp_data)
    //         setData(temp_data)

    //         await axios.put('/api/attendees', {
    //             ...temp_data[index],
    //         })
    //         await fetchData()
    //     } catch (error) {
    //         console.error('Error updating data:', error.messsage)
    //     }
    // }

    const handleSave = async (newValue = value) => {
        try {
            setShowSaveButton(false)
            let temp_data = { ...attendee } // Ensure temp_data is a new reference

            temp_data.data[field.name] = newValue

            const temp_arr_data = [...data] // Ensure temp_arr_data is a new reference
            temp_arr_data[index] = temp_data

            await setData(temp_arr_data) // Update state with new data

            await axios.put('/api/attendees', {
                ...temp_data,
            })
            await fetchData()
        } catch (error) {
            console.error('Error updating data:', error.message)
        }
    }
    const handleChange = (e) => {
        let newValue
        if (field.type === 'checkbox') {
            newValue = e.target.checked
            setValue(newValue)
            handleSave(newValue) // Explicitly pass the new value
        } else if (field.type === 'select') {
            newValue = e.target.value
            Swal.fire({
                icon: 'info',
                title: 'Save',
                text: 'Do you want to save this change?',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
            }).then((result) => {
                if (result.isConfirmed) {
                    setValue(newValue) // Update the state
                    handleSave(newValue) // Explicitly pass the new value
                } else {
                    setValue(data[index]?.data[field.name] || undefined)
                }
            })
        } else {
            newValue = e.target.value
            setValue(newValue)
            setShowSaveButton(true) // Ensure save button appears
        }
    }

    return (
        <Fragment>
            {field.type === 'text' || field.type === 'textarea' ? (
                <div className="flex flex-col justify-center space-x-2 space-y-2">
                    <textarea
                        className="p-2 border rounded-md h-10"
                        type="textarea"
                        value={value ? value : ''}
                        onChange={(e) => handleChange(e)}
                        onClick={() => setShowSaveButton(true)}
                    />
                    {showSaveButton ? (
                        <div className="space-x-2">
                            <button
                                className="btn border border-slate-500 hover:border-slate-300 h-10 text-xl"
                                onClick={handleSave}
                            >
                                ✔
                            </button>
                            <button
                                className="btn border border-slate-500 hover:border-slate-300 h-10 text-xl"
                                onClick={handleUndo}
                            >
                                ✖
                            </button>
                        </div>
                    ) : null}
                </div>
            ) : null}
            {field.type === 'number' ? (
                <div className="flex flex-col justify-center space-x-2 space-y-2">
                    <input
                        className="p-2 border rounded-md h-10"
                        type="number"
                        value={value ? value : ''}
                        onChange={(e) => handleChange(e)}
                        onClick={() => setShowSaveButton(true)}
                    />
                    {showSaveButton ? (
                        <div className="space-x-2">
                            <button
                                className="btn border border-slate-500 hover:border-slate-300 h-10 text-xl"
                                onClick={handleSave}
                            >
                                ✔
                            </button>
                            <button
                                className="btn border border-slate-500 hover:border-slate-300 h-10 text-xl"
                                onClick={handleUndo}
                            >
                                ✖
                            </button>
                        </div>
                    ) : null}
                </div>
            ) : null}

            {field.type === 'select' ? (
                <div>
                    <select
                        className="p-2 border rounded-md"
                        value={!value ? '' : value}
                        onChange={(e) => handleChange(e)}
                    >
                        <option key={'Not Selected'} value={''}>
                            -Not Selected-
                        </option>
                        {value &&
                            field?.config?.options &&
                            !field?.config?.options.includes(value) && (
                                <option value={value}>{value}</option>
                            )}

                        {field &&
                            field?.config &&
                            field?.config?.options.map((option, index) => (
                                <option
                                    key={`${index}_${option}`}
                                    value={option}
                                >
                                    {option}
                                </option>
                            ))}
                    </select>
                </div>
            ) : null}

            {field.type === 'checkbox' ? (
                <div>
                    <input
                        className="checkbox"
                        type="checkbox"
                        checked={value ? value : false}
                        onChange={(e) => handleChange(e)}
                    />
                </div>
            ) : null}
        </Fragment>
    )
}
