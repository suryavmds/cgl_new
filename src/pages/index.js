import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { FaCalendarAlt } from "react-icons/fa";
import { GrGamepad } from "react-icons/gr";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main>
      {/* <section className="main_gamelist">
        <div className="cgl_gameitem">
          <img src="/gamelogo/pubg.png"></img>
        </div>
        <div className="cgl_gameitem active">
          <img src="/gamelogo/apex.png"></img>
        </div>
        <div className="cgl_gameitem">
          <img src="/gamelogo/cod.png"></img>
        </div>
      </section> */}

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
      
      <section className="tourn_list">

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
    </main>
  )
}
