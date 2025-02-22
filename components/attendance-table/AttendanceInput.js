'use client'
import React, { Fragment, useEffect, useState } from 'react'
import axios from 'axios'

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
    const handleSave = async () => {
        try {
            setShowSaveButton(false)
            let temp_data = data
            console.log('TYPEOF', typeof temp_data.data)
            console.log(
                'TEMP INDEx',
                index,
                value,
                temp_data[index].data[field.name],
            )
            if (field.type === 'checkbox') {
                temp_data[index].data[field.name] = !value
            } else {
                temp_data[index].data[field.name] = value
            }
            console.log('TEMP DATA', temp_data)
            setData(temp_data)

            await axios.put('/api/attendees', {
                ...data[index],
            })
            await fetchData()
        } catch (error) {
            console.error('Error updating data:', error.messsage)
        }
    }
    const handleChange = (e) => {
        if (field.type === 'checkbox') {
            console.log('NEW VALUE KO BEH', e)
            setValue(e)
            handleSave()
        } else {
            setValue(e.target.value)
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
                        value={value}
                        onChange={(e) => handleChange(e)}
                    >
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
                        onChange={() => handleChange(!value)}
                    />
                </div>
            ) : null}
        </Fragment>
    )
}
