import React, { useState, useEffect } from 'react'
import { Button, Drawer, Radio, Space, Form, Row, Col, Select } from 'antd';
import showToast from '@/utility/showToast';
import Loading from '@/components/Loading';

const TournamentStatus = ({isOpen, showDrawer, tournId}) => {

    const [playersList,setPlayersList] = useState([]);
    const [form] = Form.useForm();
    const [formValues, setFormValues] = useState({});
    const [isSubmitLoading, setSubmitLoading] = useState(false);

  const onClose = () => {
    showDrawer(false);
  };

const tournamentStatusUpdateHandler = async () => {
    setSubmitLoading(true);
    try {
      const values = await form.validateFields();
      try {
        const response = await fetch('/api/tourney/winnerrunner', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...formValues, tournamentId: tournId  })
        });
        const data = await response.json();
        setSubmitLoading(false);
        if (data.status === 'success') {
          showToast('Tournament updated successfully')
          showDrawer(false);
        } else {
          showToast(data.message, 'error')
          setSubmitLoading(false)

        }

      } catch (err) {
        console.log(err)
        showToast('Failed to update', 'error')
        setSubmitLoading(false)
      }
    }
    catch (err) {
      console.log('Validation error', err)
      setSubmitLoading(false)
    }
  };

const onSelectChangeHandler = (value, name) => {
    setFormValues({
      ...formValues,
      [name]: value,
    });
}

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`/api/tourney/tournamentplayers?tournId=${tournId}`, { method: 'GET' });
        const result = await response.json();
        if (result.status === 'success') {
          if (result.result.length) {
              let tempArr = []
              result.result.map((item) => {
                tempArr.push({
                  label: item.name,
                  tournamentId: item.tournamentId,
                  value: item.playersId
                })
              })
              setPlayersList(tempArr)
            }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchDetails();
  }, [isOpen, tournId]);

    // console.log("this i smy my array", playersList)

  return (
   <>
      <Drawer
           title="Update tournament status"
           width={720}
           onClose={onClose}
           open={isOpen}
           extra={
             <Space>
               <Button onClick={onClose}>Cancel</Button>
               <Button type="primary" 
               onClick={tournamentStatusUpdateHandler}
               loading={isSubmitLoading}
               >
                  Update
               </Button>
             </Space>
           }
      >
         <Form
          layout="vertical"
          form={form}
          initialValues={formValues}
        >
          <Row gutter={16}>
            <Col xs={24} lg={12}>
            <Form.Item
              name="winner"
              label="Winner"
              rules={[{ required: true, message: 'Winner is required' }]}
              >
                <Select
                  showSearch
                  value={formValues.winner || ''}
                  style={{ width: '100%' }}
                  size='large'
                  name={'winner'}
                  onChange={(value) => onSelectChangeHandler(value, 'winner')}
                  options={playersList}
                />
              </Form.Item>

            </Col>
            <Col xs={24} lg={12}>
            <Form.Item
              name="runner"
              label="Runner"
              >
                <Select
                  showSearch
                  value={formValues.winner || ''}
                  style={{ width: '100%' }}
                  size='large'
                  name={'runner'}
                  onChange={(value) => onSelectChangeHandler(value, 'runner')}
                  options={playersList}
                />
              </Form.Item>

            </Col>
            </Row>
            </Form>
        
      
      </Drawer>
    </>
  )
}

export default TournamentStatus