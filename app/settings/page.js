'use client'
import AddModal from '@/components/fields/AddModal'
import React, { useState } from 'react'

export default function page() {
    const [showAddModal, setShowAddModal] = useState(true)
    return (
        <div className="container mx-auto px-4 py-8 h-screen w-screen">
            <AddModal show={showAddModal} />
            <h1 className="text-3xl">Settings</h1>

            <div className="mt-8 container w-full p-4 bg-slate-600 rounded-lg shadow-md">
                <h3 className="font-bold text-xl">Table Fields</h3>
                <p className="text-sm text-gray-300">
                    Add, edit, and delete fields
                </p>
            </div>
        </div>
    )
}
