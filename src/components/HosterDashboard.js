import { PlusOutlined } from '@ant-design/icons'
import { Button, Col, InputNumber, Modal, Row, Space } from 'antd'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import React, { useContext } from 'react'
import { FaCalendarAlt } from 'react-icons/fa'
import { GrGamepad } from 'react-icons/gr'
import NewTourneyModal from '@/modals/NewTourneyModal'
import { useState } from 'react'
import AppContext from '@/context/AppContext'
import { useRouter } from 'next/router'
import showToast from '@/utility/showToast'

const HosterDashboardPage = () => {
    const [isDrawerOpen, setDrawerOpen] = useState(false)
    const [triggerEffect, setTriggerEffect] = useState(false);

    const triggerCallback = () => {
        setTriggerEffect(!triggerEffect)         
    }

    const context = useContext(AppContext)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [walletAmount, setWalletAmount] = useState(0)
    const [isSubmitLoading, setSubmitLoading] = useState(false);
    const router = useRouter();

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = async () => {

        try{
            setSubmitLoading(true)
            if(walletAmount <= 0){
            showToast('Enter valid credits to add', 'warning')
            setSubmitLoading(false)
            return;
            }
            const response = await fetch('/api/wallet/addmoney', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({amount: walletAmount, userId: context.userInfo.user_id, user_type: context.userInfo.user_role})
            });
            const data = await response.json();
            setSubmitLoading(false)
            if(data.status === 'success'){
                showToast('Credit added successfully!')
                setIsModalOpen(false);
                setWalletAmount(0)
                router.reload();
            }else{
                showToast(data.message, 'error')
            }
    
        }catch(err){
            console.log(err)
            showToast('Failed to add credit', 'error')
            setSubmitLoading(false)
        }
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const onChange = (value) => {
        console.log('changed', value);
        setWalletAmount(value)
    };

    function formatCurrency(amount) {
        return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }
      
  return (
    <>
    <NewTourneyModal isOpen={isDrawerOpen} showDrawer={setDrawerOpen} triggerSuccess={triggerCallback}/>
    <main>
    <Modal confirmLoading={isSubmitLoading} title="Add credits to wallet" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="Add credit">
            <InputNumber size='large' suffix="$" style={{width: '180px'}} min={1} max={1000} defaultValue={walletAmount} value={walletAmount} onChange={onChange} />
    </Modal>
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
          <li>
            <a target='_blank' href={'https://bot.dialogflow.com/78dbb90c-d231-4f93-a8a7-d23adbcb66b2'}>Chat with us</a>
        </li>
        </ul>
    </nav>


    <div className='cgl_padding profile_info'>
        <Row gutter={[15, 15]}>
            <Col lg={12} md={24}>
                <h1>Welcome {context.userInfo.user_details.host_name}!</h1>
                <h6>Hoster dashboard</h6>
            </Col>
            <Col lg={12} md={24}>
                <div className='cgl_wallet'>
                    <Space>
                        <p>Wallet balance</p>
                        <h5>{formatCurrency(context.userInfo.user_details.wallet_balance|| 0)}</h5>
                        <Button type="primary" onClick={() => setIsModalOpen(true)}><PlusOutlined /></Button>
                    </Space>
                </div>
            </Col>
        </Row>
    </div>

    <div className='cgl_padding'>
        <Space size={'large'}>
            <div className='text-white'>My tournaments</div>
              
            <Button type="primary" onClick={() => setDrawerOpen(true)} >Create tournament <PlusOutlined /></Button>
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
    </>
  )
}

export default HosterDashboardPage