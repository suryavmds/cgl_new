import showToast from "@/utility/showToast";
import { Button, Form, Input } from "antd";
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import Link from 'next/link'

const SignupPage = () =>{

    const [activeButton, setActiveButton] = useState(1);


    const [formValues, setFormValues] = useState({
        name: '',
        nickname: '',
        password: '',
        phonenumber: '',
        country: '',
        about: ''
    })
    const [isLoading, setLoading] = useState(false)
    const router = useRouter();

    const inputHandler = (event) => {
        const {value, name} = event.target
  
        setFormValues({
            ...formValues,
            [name]: value
        })
    }

    const handleClick = (button) => {
        setActiveButton(button);
      };
    

    const submitLogin = async () => {
        console.log(formValues)
        setLoading(true)
        try{
            const requestData = {
                formValues: formValues,
                activeButton: activeButton
            };
    
            const response = await fetch('/api/users/createuser',
            {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            })

            const result = await response.json()

            // if(result.status === 'success' && result.result.length){
            //     const userAccess = result.result[0];
            //     setUserAccess(userAccess)
            //     context.setUserAccess(userAccess)
            //     return;
            // }
            console.log(result)
        }catch(err){
            console.log(err)
            showToast('Error while fetching user access!','error')
        }
    }
     

    return (
        <section className='login_page'>
            <div className='login_wrap'>
                <div className='top_header'>
                    <button   className={activeButton === 1 ? 'active' : ''}
        onClick={() => handleClick(1)}>Player</button>
                    <button
                      className={activeButton === 2 ? 'active' : ''}
                      onClick={() => handleClick(2)}>Organizer</button>
                </div>
                <div className='middle_form'>
                    <div className='form_element'>
                        <input placeholder='Name' name={'name'} onChange={inputHandler}
                            value={formValues.name || ''}></input>
                    </div>
                    <div className='form_element'>
                        <input placeholder='Nick Name' name={'nickname'} onChange={inputHandler}
                            value={formValues.nickname || ''}></input>
                    </div>
                    <div className='form_element'>
                        <input placeholder='password' name={'password'} onChange={inputHandler}
                            value={formValues.password || ''}></input>
                    </div>
                    <div className='form_element'>
                        <input placeholder='Phone Number' name={'phonenumber'} onChange={inputHandler}
                            value={formValues.phonenumber || ''}></input>
                    </div>
                    <div className='form_element'>
                        <input placeholder='Country' name={'country'} onChange={inputHandler}
                            value={formValues.country || ''}></input>
                    </div>
                    <div className='form_element'>
                        <input placeholder='About' name={'about'} onChange={inputHandler}
                            value={formValues.about || ''}></input>
                    </div>
                </div>
                <button className='cgl_primary_btn rounded' onClick={() => submitLogin()}>SIGNUP</button>
    
                {/* <div className='social_btn'>
                    <img src='/google_signinbtn.png'></img>
                </div> */}
    
                {/* <div className='footer'>
                    <Link className='' href={'#'}>Create new account</Link>
                </div> */}
            </div>
        </section>
      )
}

export default SignupPage