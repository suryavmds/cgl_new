import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { FaCalendarAlt } from "react-icons/fa";
import { GrGamepad } from "react-icons/gr";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { data: session } = useSession();
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
          {
            (session) ? 
            <li>
              <Link href={'#'} onClick={signOut}>Logout</Link>
            </li> : 
            <></>
          }
          <li>
            <a target='_blank' href={'https://bot.dialogflow.com/78dbb90c-d231-4f93-a8a7-d23adbcb66b2'}>Chat with us</a>
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
