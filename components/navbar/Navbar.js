'use client'
import React, { useState, useEffect } from 'react'
import {
    getUserRole,
    isAuthenticated,
    logout,
    checkExpired,
} from '@/utils/auth'
import { useRouter } from 'next/navigation' // Import useRouter for better navigation
import Cookie from 'js-cookie'

export default function Navbar() {
    const [show, setShow] = useState(null) // Use `null` to indicate "loading" state
    const router = useRouter()

    const checkAuth = async () => {
        const authStatus = await isAuthenticated()
        console.log('Auth Status:', authStatus)
        setShow(authStatus) // Set state only after checking auth

        if (!authStatus) {
            router.replace('/') // Prevents infinite redirects
        }
    }

    useEffect(() => {
        checkAuth()
    }, [router]) // Depend on `router` to avoid unnecessary re-renders

    if (show === null) return null // Prevent flashing UI during loading

    return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">Attendease</a>
            </div>
            <div className="flex-none">
                {show && (
                    <ul className="menu menu-horizontal px-1">
                        <li onClick={() => router.push('/attendance')}>
                            <a>Attendance</a>
                        </li>
                        <li onClick={() => router.push('/settings')}>
                            <a>Settings</a>
                        </li>
                        {getUserRole() === 'ADMIN' && (
                            <li onClick={() => router.push('/export')}>
                                <a>Export</a>
                            </li>
                        )}
                        <li
                            onClick={() => {
                                logout()
                                router.replace('/')
                                setShow(false)
                            }}
                        >
                            <a>Logout</a>
                        </li>
                    </ul>
                )}
            </div>
        </div>
    )
}
