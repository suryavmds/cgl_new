import { getServerSession } from 'next-auth';
import { getSession } from 'next-auth/react'
import { authOptions } from './auth/[...nextauth]';

export const withAuth = handler => async (req, res) => {
    // Check if the user is authenticated
    // const isAuthenticated = await getSession({ req })

    // if (!isAuthenticated) {
    //     return res.status(401).json({ status: 'fail', message: 'Unauthorized' }); 
    // }
    const session = await getServerSession(req, res, authOptions)
    
    if (!session) {
        return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
    } 
    return handler(req, res);
};
  