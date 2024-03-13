import { Button, Col, Row, Table } from 'antd';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { ImTrophy } from "react-icons/im";
import { BsCalendar2DateFill } from "react-icons/bs";
import showToast from '@/utility/showToast';

const TournDetailPage = ({tournId}) => {
    const { data: session } = useSession();
    const [dataList, setDataList] = useState([]);
    const [isTableLoading, setTableLoading] = useState(false);
    const [selectedDetails, setSelectedDetails] = useState({});
    const [triggerEffects, setTriggerEffects] = useState(false);

    const columns = [
        {
          title: 'ID',
          dataIndex: 'id',
        },
        {
          title: 'Player Name',
          dataIndex: 'name',
        },
      ];
      const data = [
        {
          key: '1',
          name: 'aohn Brown',
          id: 98,
          math: 60,
          english: 70,
        },
        {
          key: '2',
          name: 'Jim Green',
          id: 98,
          math: 66,
          english: 89,
        },
        {
          key: '3',
          name: 'Joe Black',
          id: 98,
          math: 90,
          english: 70,
        },
        {
          key: '4',
          name: 'Jim Red',
          id: 88,
          math: 99,
          english: 89,
        },
      ];

      useEffect(() => {
        const fetchData = async () => {
          try {
              setTableLoading(true);
              const response = await fetch('/api/tourney/details?id='+orderId);
              const data = await response.json();
              setTableLoading(false);
          if (data.status === 'success' && data.results.length) {
            setSelectedDetails(data.results[0]);
            setDataList(data.styles)
          } else {
            showToast('Failed to fetch order', 'error')
          }
          } catch (error) {
              console.error('Error fetching data:', error);
              setTableLoading(false);
          }
        };
    
        fetchData();
      }, [triggerEffects]);
  return (
    <>
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

      <section className='tourn_details'>
        <div className='header'>
            <div className='fade'></div>
            <img alt='Poster' src='/pubgbg.jpeg'>
            </img>
        </div>
        <div className='content'>
            <Row gutter={[15, 15]}>
                <Col sm={24} md={12}>
                    <h3 className='title'>Tournament Name</h3>
                </Col>
                <Col sm={24} md={12} className='flex'>
                    <h5 className='date'><ImTrophy /> Reward: $5000</h5>
                    <h5 className='date'><BsCalendar2DateFill /> Jan 5 10:10 AM</h5>
                </Col>
                <Col sm={24} className='gap'>
                    <Button type="primary">Join match</Button>
                    <Button type="dashed">Set match finished</Button>
                </Col>
                <Col sm={24}>
                    <Table columns={columns} dataSource={data} />
                </Col>
            </Row>
        </div>
      </section>
    </main>
    </>
  )
}

export default TournDetailPage

export async function getServerSideProps(context) {
    const { params } = context
    const { tournId } = params
    return {
      props: {
        tournId,
      }
  }
}