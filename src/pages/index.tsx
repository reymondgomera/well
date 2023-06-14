import { NextPage } from 'next';
import BlankLayout from '@/@core/layouts/BlankLayout';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';
import Spinner from 'src/@core/components/spinner';

export const getHomeRoute = (role: String) => {
  let homeRoute = '';

  switch (role) {
    case 'admin':
      homeRoute = '/apps/dashboard';
      break;
    case 'user':
      homeRoute = '/apps/dashboard';
      break;
    case 'receptionist':
      homeRoute = '/apps/patient';
      break;
    case 'physician':
      homeRoute = '/apps/physician/checkup';
      break;
    default:
      homeRoute = '/apps/dashboard';
      break;
  }

  return homeRoute;
};

const IndexPage: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (session?.user && session?.user.role) {
      // Redirect user to Home URL
      router.replace(getHomeRoute(session.user.role.code));
    } else router.replace('/login');
  }, []);

  return <Spinner />;
};

IndexPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

export default IndexPage;
