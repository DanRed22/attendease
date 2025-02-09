'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { storeCookies } from '@/utils/auth'

export default function Home() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })

        if (response.ok) {
            const data = await response.json()
            storeCookies(data)

            Swal.fire({
                title: 'Welcome!',
                text: 'You have successfully logged in',
                icon: 'success',
                time: 5000,
                show: true,
                background: 'rgb(55 65 81)',
                color: 'white',
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                showConfirmButton: false,
                timer: 3000,
                onClose: () => {
                    window.location.href = '/attendance'
                },
            })
        } else {
            const data = await response.json()
            console.log(data)
            Swal.fire({
                title: 'Error!',
                text: data?.message || 'An error occurred',
                icon: 'error',
                time: 5000,
                show: true,
                background: 'rgb(55 65 81)',
                color: 'white',
            })
        }
    }

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h1 className="text-4xl font-bold text-center">Login</h1>
            <div className="artboard artboard-horizontal phone-2 bg-gray-700 p-4 rounded-lg flex flex-col align-center justify-center">
                <label className="input input-bordered flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70"
                    >
                        <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                        <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                    </svg>
                    <input
                        type="text"
                        className="grow"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                    />
                </label>

                <label className="input input-bordered flex items-center gap-2 mt-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70"
                    >
                        <path
                            fillRule="evenodd"
                            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <input
                        type="password"
                        className="grow"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                </label>

                <button
                    onClick={(e) => {
                        handleSubmit(e)
                    }}
                    className="btn btn-primary mt-4 w-[40%] self-end"
                >
                    Login
                </button>
            </div>
        </div>
    )
}
