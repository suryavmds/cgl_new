import showToast from '@/utility/showToast'
import { Button, Form, Input } from 'antd'
import Image from 'next/image'
import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import Link from 'next/link'

const LoginPage = () => {
    const [formValues, setFormValues] = useState({
        email: '',
        password: ''
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

    const submitLogin = async () => {
        if (formValues.email !== '' && formValues.password !== '') {
            setLoading(true);
            console.log(formValues)
            const res = await signIn('credentials', {
              email: formValues.email,
              password: formValues.password,
              redirect: false
            });
            setLoading(false);
            if (res.error == null) {
              router.replace(`/`);
            } else {
                showToast(res.error, 'error');
            }
          } else {
            showToast('Enter a valid username and password', 'warning');
          }
    }
    
  return (
    <section className='login_page'>
        <div className='login_wrap'>
            <div className='top_header'>
                <button className='active'>Player</button>
                <button>Organizer</button>
            </div>
            <div className='middle_form'>
                <div className='form_element'>
                    <input placeholder='Email' name={'email'} onChange={inputHandler}
                        value={formValues.email || ''}></input>
                </div>
                <div className='form_element'>
                    <input placeholder='Password' name={'password'} onChange={inputHandler}
                        value={formValues.password || ''}></input>
                </div>
            </div>
            <button className='cgl_primary_btn rounded' onClick={() => submitLogin()}>SIGNIN</button>

            <div className='social_btn'>
                <img src='/google_signinbtn.png'></img>
            </div>

            <div className='footer'>
                <Link className='' href={'#'}>Create new account</Link>
            </div>
        </div>
    </section>
  )
}

export default LoginPage