import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { FaCalendarAlt } from "react-icons/fa";
import { GrGamepad } from "react-icons/gr";
import { useState, useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [triggerEffect, setTriggerEffect] = useState(false);
  const [dataList, setDataList] = useState([]);

  // const triggerCallback = () => {
  //   setTriggerEffect(!triggerEffect)         
  // }

  const formatDateTime = (datetimeString) => {
    const dateTime = new Date(datetimeString);
    const date = dateTime.toLocaleDateString('en-US');
    const time = dateTime.toLocaleTimeString('en-US');
    return `${date} ${time}`;
  };
  

  useEffect(() => {
    const fetchData = async () => {
    try {
        // setTableLoading(true);
        const response = await fetch('/api/tourney/fetchtourneys');
        const data = await response.json();
        if (data.status === 'success') {
          setDataList(data.result.map(tournament => ({
            ...tournament,
            tournament_date: formatDateTime(tournament.tournament_date)
          })));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // console.log("this is the data llist",dataList)

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
      
      <section className="tourn_list">
      {dataList.map((tournament, index) => (
        <div key={index} className='tourn_item'>
          <div className='poster'>
            <img src='/pubgbg.jpeg' alt='poster'></img>
          </div>
          <div className='content'>
            <h1>{tournament.tournament_name}</h1>
            <h4>Hoster Name :{tournament.username}</h4>
            <h4>Entry Fee : {tournament.entry_fee}</h4>
            <h4>Prize Money : {tournament.prize_money}</h4>

            <div className='tags'>
              <h3><FaCalendarAlt /> {tournament.tournament_date}</h3>
              <h3><GrGamepad /> {tournament.count}/30 Joined</h3>
            </div>
          </div>
        </div>
          ))}
      </section>
    </main>
  )
}
