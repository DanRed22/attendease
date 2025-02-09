'use client'
import React, { useState, Fragment } from 'react'

export default function Navbar() {
    return (
        <Fragment>
            <div className="navbar bg-base-100">
                <div className="flex-1">
                    <a className="btn btn-ghost text-xl">Attendease</a>
                </div>
                <div className="flex-none">
                    <ul className="menu menu-horizontal px-1">
                        <li>
                            <a>Profile</a>
                        </li>
                        <li>
                            <details>
                                <summary>Events</summary>
                                <ul className="bg-base-100 rounded-t-none p-2"></ul>
                            </details>
                        </li>
                    </ul>
                </div>
            </div>
        </Fragment>
    )
}
