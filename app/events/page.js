import { useState, useEffect } from 'react'
;('use client')

export default function EventsPage() {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('/api/events', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                const data = await response.json()
                setEvents(data)
                setLoading(false)
            } catch (error) {
                console.error('Error fetching events:', error)
                setLoading(false)
            }
        }

        fetchEvents()
    }, [])

    if (loading) {
        return <div>Loading events...</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Events</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <div
                        key={event.id}
                        className="border rounded-lg p-4 shadow-sm"
                    >
                        <h2 className="text-xl font-semibold">{event.title}</h2>
                        <p className="text-gray-600">{event.date}</p>
                        <p className="mt-2">{event.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
