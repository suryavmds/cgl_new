import { PlusOutlined } from '@ant-design/icons'
import { Button, Space } from 'antd'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { FaCalendarAlt } from 'react-icons/fa'
import { GrGamepad } from 'react-icons/gr'

const HosterDashboardPage = () => {
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
            <div className='text-white'>My tournaments</div>
            <Link href={'/'}>
            <Button type="primary">Create tournament <PlusOutlined /></Button>
            </Link>
        </Space>

        <section className="tourn_list small pt-20">

            <div className='tourn_item'>
            <div className='poster'>
                <img src='/pubgbg.jpeg' alt='poster'></img>
            </div>
            <div className='content'>
                <h1>Tournament Name</h1>
                <h4>Hoster Name</h4>

                <div className='tags'>
                <h3><FaCalendarAlt /> June 15 - 08:00PM</h3>
                <h3><GrGamepad /> 20/30 Joined</h3>
                </div>
            </div>
            </div>

            <div className='tourn_item'>
            <div className='poster'>
                <img src='/pubgbg.jpeg' alt='poster'></img>
            </div>
            <div className='content'>
                <h1>Tournament Name</h1>
                <h4>Hoster Name</h4>

                <div className='tags'>
                <h3><FaCalendarAlt /> June 15 - 08:00PM</h3>
                <h3><GrGamepad /> June 15 - 08:00PM</h3>
                </div>
            </div>
            </div>

            <div className='tourn_item'>
            <div className='poster'>
                <img src='/pubgbg.jpeg' alt='poster'></img>
            </div>
            <div className='content'>
                <h1>Tournament Name</h1>
                <h4>Hoster Name</h4>

                <div className='tags'>
                <h3><FaCalendarAlt /> June 15 - 08:00PM</h3>
                <h3><GrGamepad /> June 15 - 08:00PM</h3>
                </div>
            </div>
            </div>

        </section>
    </div>



    </main>
  )
}

export default HosterDashboardPage