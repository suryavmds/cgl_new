import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useSession } from 'next-auth/react';
import Loading from '@/components/Loading';

const withAuth = (Component) => {
  const WrappedComponent = (props) => {
    const router = useRouter();
    
    const { status } = useSession();

    useEffect(() => {
      if (status === "unauthenticated") {
        router.push("/login");
      }
    }, [status]);

    if (status === "authenticated") {
      return <Component {...props} />;
    }

    return (
        <Loading isLoading={true}/>
    );
  };

  WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
};

export default withAuth;