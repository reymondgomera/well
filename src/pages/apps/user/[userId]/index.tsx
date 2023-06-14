import { useEffect } from 'react';

import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { getUser } from '@/server/hooks/user';
import UserViewPage from '@/views/apps/user/view/UserViewPage';
import { requireAuth } from '@/common/requireAuth';
import { supabase } from '@/utils/supabase';
import { InvalidateQueries } from '@/utils/rq.context';

export const getServerSideProps = requireAuth(async () => {
  return { props: {} };
});

const UserView: NextPage = () => {
  const router = useRouter();
  const { userId } = router.query;

  const userData = getUser({ id: parseInt(userId as string) });

  useEffect(() => {
    const channel = supabase
      .channel('user-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'User' }, payload => {
        InvalidateQueries({ queryKey: {}, routerKey: 'user' });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return userData ? <UserViewPage data={userData} /> : null;
};

UserView.acl = {
  action: 'read',
  subject: 'user'
};

export default UserView;
