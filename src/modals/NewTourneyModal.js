import AppContext from '@/context/AppContext';
import showToast from '@/utility/showToast';
import { Button, Col, Drawer, Form, Input, Row, Select, Space, DatePicker } from 'antd'
import React, { useState, useContext } from 'react'
const dateFormat = 'YYYY/MM/DD';

const NewTourneyDrawer = ({isOpen, showDrawer, triggerSuccess}) => {
    const context = useContext(AppContext)
    const [formValues, setFormValues] = useState({})
    const [isSubmitLoading, setSubmitLoading] = useState(false)
    const [form] = Form.useForm();
    
    const onClose = () => {
        showDrawer(false);
    };

    const onDateChangeHandler = (value) => {
      setFormValues({
          ...formValues,
          ['tournament_date']: value
      })
  }

    const onSubmit = async () => {
        setSubmitLoading(true)
        try{
            const values = await form.validateFields();
            try{
                const response = await fetch('/api/tourney/newtourney', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({...formValues, hostId: context.userInfo.user_id})
                });
                const data = await response.json();
                setSubmitLoading(false)
                if(data.status === 'success'){
                    showToast('Tournament created successfully!')
                    setFormValues({
                      tournament_name : '',
                      tournament_description: '',
                      prize_money: '',
                      state: '',
                      tournament_date: '',
                      entry_fee: ''
                    })
                    form.setFieldsValue({
                      tournament_name : '',
                      tournament_description: '',
                      prize_money: '',
                      state: '',
                      tournament_date: '',
                      entry_fee: ''
                    })
                    triggerSuccess(true)
                    showDrawer(false)
                  
                }else{
                    showToast(data.message, 'error')
                }

            }catch(err){
                console.log(formValues)
                console.log(err)
                showToast('Failed to create tournament', 'error')
                setSubmitLoading(false)
            }
        }
        catch(err){
            console.log('Validation error', err)
            setSubmitLoading(false)
        }
    }

    const onInputChangeHandler = (event) => {
        const {name, value} = event.target;
        setFormValues({
            ...formValues,
            [name]: value
        })
    }
    
  
  return (
    <>
    <Drawer
        title="Create tournament"
        width={720}
        onClose={onClose}
        open={isOpen}
        bodyStyle={{
          paddingBottom: 80,
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={onSubmit} loading={isSubmitLoading} type="primary">
                Create tournament
            </Button>
          </Space>
        }
      >
        <Form layout="vertical"
            form={form}
            initialValues={formValues}>
          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item
                name="tournament_name"
                label="Name"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the tournament name',
                  },
                ]}
              >
                <Input name='tournament_name' placeholder="Please enter the tournament name" 
                onChange={onInputChangeHandler} 
                value={formValues.tournament_name}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name="tournament_description"
                label="Tournament description"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your tournament description',
                  },
                ]}
              >
                <Input name='tournament_description' placeholder="Please enter your tournament description" 
                onChange={onInputChangeHandler} 
                value={formValues.tournament_description}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name="prize_money"
                label="Prize money"
                rules={[
                  // {
                  //   required: true,
                  //   message: 'Please enter the city',
                  // },
                  {
                    pattern: /^\d+$/,
                    message: 'Please enter only numbers',
                  },
              
                ]}
              >
                <Input name='prize_money' placeholder="Please enter the prize money" 
                onChange={onInputChangeHandler} 
                value={formValues.prize_money}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name="tournament_date"
                label="Tournament Date"
                rules={[
                  {
                    required: true,
                    message: 'Please fill the date',
                  },
                ]}
              >
               <DatePicker
                style={{ width: '100%' }}
                name="tournament_date"
                size='large'
                onChange={onDateChangeHandler}
                // format={dateFormat}
                showTime
               />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name="entry_fee"
                label="Entry Fee"
                rules={[
                  // {
                  //   required: true,
                  //   message: 'Please enter country',
                  // },
                  {
                    pattern: /^\d+$/,
                    message: 'Please enter only numbers',
                  },
              
                ]}
              >
                <Input name='entry_fee' placeholder="Please enter your entry fee" 
                onChange={onInputChangeHandler} 
                value={formValues.entry_fee}
                />
              </Form.Item>
            </Col>
      
          </Row>
        </Form>
      </Drawer>
    </>
  )
}

export default NewTourneyDrawer