import { useEffect } from 'react';

import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { getClinic } from '@/server/hooks/clinic';
import ClinicViewPage from '@/views/apps/clinic/view/ClinicViewPage';
import { requireAuth } from '@/common/requireAuth';
import { InvalidateQueries } from '@/utils/rq.context';
import { supabase } from '@/utils/supabase';

export const getServerSideProps = requireAuth(async () => {
  return { props: {} };
});

const ClinicView: NextPage = () => {
  const router = useRouter();
  const { clinicId } = router.query;

  const clinicData = getClinic({ id: parseInt(clinicId as string) });

  useEffect(() => {
    const channel = supabase
      .channel('clinic-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Clinic' }, payload => {
        InvalidateQueries({ queryKey: {}, routerKey: 'clinic' });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return clinicData ? <ClinicViewPage data={clinicData} /> : null;
};

ClinicView.acl = {
  action: 'read',
  subject: 'clinic'
};

export default ClinicView;
