import type { GetServerSideProps, GetServerSidePropsContext } from 'next/types';
import { getServerSession } from 'next-auth';

import { nextAuthOptions } from './auth';

export const requireAuth = (func: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
  const session = await getServerSession(ctx.req, ctx.res, nextAuthOptions);

  if (session) {
    const roleCode = session.user.role.code;
    const chosenClinic = session.user.clinicId;

    if (roleCode !== 'admin' && !chosenClinic) {
      return {
        redirect: {
          destination: '/choose-clinic', // redirect to choose clinic page
          permanent: false
        }
      };
    }
  }

  if (!session) {
    return {
      redirect: {
        destination: '/login', // redirect to login page
        permanent: false
      }
    };
  }

  return await func(ctx);
};
