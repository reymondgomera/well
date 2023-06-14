import { Grid } from '@mui/material';
import { requireAuth } from '@/common/requireAuth';
import PatientTableList from '@/views/apps/patient/PatientTableList';
import { NextPage } from 'next';

export const getServerSideProps = requireAuth(async () => {
  return { props: {} };
});

const PatientPage: NextPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PatientTableList />
      </Grid>
    </Grid>
  );
};

PatientPage.acl = {
  action: 'read',
  subject: 'patient'
};

export default PatientPage;
