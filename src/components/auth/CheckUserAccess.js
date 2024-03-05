import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react'
import Loading from '../Loading';
import AppContext from '@/context/AppContext';
import showToast from '@/utility/showToast';

const CheckUserAccess = (props) => {
    const router = useRouter();
    const { status, data } = useSession();
    const [userAccess, setUserAccess] = useState({})
    
    const context = useContext(AppContext)
    useEffect(() => {
        const fetchDetails = async () => {
            try{
                const response = await fetch('/api/users/getaccess',
                {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({username: data.user.email})
                })

                const result = await response.json()

                if(result.status === 'success' && result.result.length){
                    const userAccess = result.result[0];
                    setUserAccess(userAccess)
                    context.setUserAccess(userAccess)
                    return;
                }
                console.log(result)
                showToast('Error while fetching user access!','error')
            }catch(err){
                console.log(err)
                showToast('Error while fetching user access!','error')
            }
        }

        if(status === 'authenticated' && !Object.keys(context.userAccess).length){
            fetchDetails();
        }
    }, [status]);

    if(Object.keys(context.userAccess).length){
        return(
            <>
               {props.children}
            </>
        )
    }
    if(status === 'unauthenticated'){
        return(
            <>
               {props.children}
            </>
        )
    }
    return (
        <Loading isLoading={true}/>
    )
}

export default CheckUserAccess