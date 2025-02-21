'use client'
import React, { Fragment, useEffect, useState } from 'react'

export default function AttendanceInput({ data, index, setData, field }) {
    const [value, setValue] = useState(data.data[field.name] || undefined)

    // useEffect(() => {
    //     if (data) {
    //         const temp_data = data
    //         console.log(data)
    //         temp_data[field.name] = value
    //         setData((prevData) => {
    //             const newData = [...prevData]
    //             newData[index] = temp_data
    //             return newData
    //         })
    //     }
    // }, [value])

    return (
        <Fragment>
            {field.type === 'text' || field.type === 'textarea' ? (
                <input
                    className="p-2 border rounded-md"
                    type="text"
                    value={value}
                    onChange={() => setValue(value)}
                />
            ) : null}
            {field.type === 'number' ? (
                <input type="number" value={value} />
            ) : null}

            {field.type === 'select' ? (
                <div>
                    <select
                        className="p-2 border rounded-md"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
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
                        className="checkbox-primary	"
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setValue(e.target.checked)}
                    />
                </div>
            ) : null}
        </Fragment>
    )
}
