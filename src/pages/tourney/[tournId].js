import { Button, Col, Row, Table } from 'antd';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import { ImTrophy } from "react-icons/im";
import { BsCalendar2DateFill } from "react-icons/bs";
import showToast from '@/utility/showToast';
import AppContext from '@/context/AppContext';

const TournDetailPage = ({tournId}) => {
    const { data: session } = useSession();
    const [dataList, setDataList] = useState([]);
    const [isTableLoading, setTableLoading] = useState(false);
    const [selectedDetails, setSelectedDetails] = useState({});
    const [triggerEffects, setTriggerEffects] = useState(false);
    const context = useContext(AppContext)

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

      let button = <Link href={'/login'}><Button type="primary">Login to join</Button></Link>

      useEffect(() => {
        const fetchData = async () => {
          try {
              setTableLoading(true);
              const response = await fetch('/api/tourney/details',
              {
                  method: 'POST',
                  headers: {
                  'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({userId: context.userInfo.user_id, tournamentId: tournId})
              })

              const result = await response.json()
              console.log(result)
              setTableLoading(false);
          if (result.status === 'success') {
            setSelectedDetails(result);
            setDataList(result.players_registered)
          } else {
            showToast('Failed to fetch tournament details', 'error')
          }
          } catch (error) {
              console.error('Error fetching data:', error);
              setTableLoading(false);
          }
        };
    
        fetchData();

      }, [triggerEffects]);

      const formatDateTime = (datetimeString) => {
        const dateTime = new Date(datetimeString);
        const date = dateTime.toLocaleDateString('en-US');
        const time = dateTime.toLocaleTimeString('en-US');
        return `${date} ${time}`;
      };

      if(context.userInfo.user_id){
        if(selectedDetails?.is_player_registered){
          button = <Button danger type="primary" onClick={() => joinTourney(false)}>Leave tournament</Button>
        }else{
          button = <Button type="primary" onClick={() => joinTourney(true)}>Join tournament</Button>
        }
      }

      const joinTourney = async (status) => {
        try{
          const response = await fetch('/api/tourney/join',
          {
              method: 'POST',
              headers: {
              'Content-Type': 'application/json'
              },
              body: JSON.stringify({userId: context.userInfo.user_id, tournamentId: tournId, status: status})
          })

          const result = await response.json()

          if (result.status === 'success') {
            setTriggerEffects(!triggerEffects)
            showToast(`Successfully ${status ? 'joined' : 'leaved'} the tournament`)
          } else {
            showToast(result.message)
          }

        }catch(Error){
          console.log(Error)
          showToast(`Failed to ${status ? 'join' : 'leave'}`, 'error')
        }
      }

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
                    <h3 className='title'>{selectedDetails?.tourmey_details?.tournament_name}</h3>
                </Col>
                <Col sm={24} md={12} className='flex'>
                    <h5 className='date'><ImTrophy /> Reward: ${selectedDetails?.tourmey_details?.prize_money}</h5>
                    <h5 className='date'><BsCalendar2DateFill /> {formatDateTime(selectedDetails?.tourmey_details?.tournament_date)}</h5>
                </Col>
                <Col sm={24} className='gap'>
                    {button}
                    <Button type="dashed">Set match finished</Button>
                </Col>
                <Col sm={24}>
                    <Table columns={columns} dataSource={dataList} />
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