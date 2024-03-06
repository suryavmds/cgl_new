import { PlusOutlined } from '@ant-design/icons'
import { Button, Space } from 'antd'
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

    <div className='cgl_padding'>
        <Space size={'large'}>
            <div className='text-white'>My games</div>
            <Link href={'/'}>
            <Button type="primary">Join game <PlusOutlined /></Button>
            </Link>
        </Space>
    </div>



    </main>
  )
}

export default PlayerDashboard