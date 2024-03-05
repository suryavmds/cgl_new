import { signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

const PlayerDashboard = () => {
  return (
    <main>
    <nav className='cgl_nav'>
        <div>
        <img alt="Logo" src='/cgl_logo.png' />
        </div>
        <ul>
        <li>
            <Link href={'/'}>Home</Link>
        </li>
        <li>
            <Link href={'/dashboard'}>Dashboard</Link>
        </li>
        <li>
            <Link href={'#'} onClick={signOut}>Logout</Link>
        </li>
        </ul>
    </nav>
    </main>
  )
}

export default PlayerDashboard