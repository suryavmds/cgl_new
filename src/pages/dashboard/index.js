import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react'
import AppContext from '@/context/AppContext';
import showToast from '@/utility/showToast';
import PlayerDashboard from '@/components/PlayerDashboard';
import HosterDashboard from '@/components/HosterDashboard';
import withAuth from '@/components/auth/withAuth';

const DashboardPage = () => {
    const router = useRouter();

    const context = useContext(AppContext)

    if(context.userInfo.user_role === 2){
        return <PlayerDashboard />
    }else if(context.userInfo.user_role === 3){
        return <HosterDashboard />
    }
  return (
    <div>Unauthorized</div>
  )
}

export default withAuth(DashboardPage)