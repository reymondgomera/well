import { useEffect } from 'react';

import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { getPatient } from '@/server/hooks/patient';
import PatientViewPage from '@/views/apps/patient/view/PatientViewPage';
import { requireAuth } from '@/common/requireAuth';
import { supabase } from '@/utils/supabase';
import { InvalidateQueries } from '@/utils/rq.context';

export const getServerSideProps = requireAuth(async () => {
  return { props: {} };
});

const PatientView: NextPage = () => {
  const router = useRouter();
  const { patientId } = router.query;

  const patientData = getPatient({ id: parseInt(patientId as string) });

  useEffect(() => {
    const channel = supabase
      .channel('patient-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Patient' }, payload => {
        InvalidateQueries({ queryKey: {}, routerKey: 'patient' });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return patientData ? <PatientViewPage data={patientData} /> : null;
};

PatientView.acl = {
  action: 'read',
  subject: 'patient'
};

export default PatientView;
