import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { getCheckup } from '@/server/hooks/checkup';
import CheckupViewPage from '@/views/apps/checkup/view/CheckupViewPage';
import { requireAuth } from '@/common/requireAuth';
import { useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { InvalidateQueries } from '@/utils/rq.context';

export const getServerSideProps = requireAuth(async () => {
  return { props: {} };
});

const PatientCheckupView: NextPage = () => {
  const router = useRouter();
  const { checkupId } = router.query;

  const checkupData = getCheckup({ id: parseInt(checkupId as string) });

  useEffect(() => {
    const channel = supabase
      .channel('checkup-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Checkup' }, payload => {
        InvalidateQueries({ queryKey: {}, routerKey: 'checkup' });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return checkupData ? <CheckupViewPage data={checkupData} /> : null;
};

PatientCheckupView.acl = {
  action: 'read',
  subject: 'checkup'
};

export default PatientCheckupView;
