import { Grid } from '@mui/material';
import { requireAuth } from '@/common/requireAuth';
import CheckupTableList from '@/views/apps/checkup/CheckupTableList';
import { NextPage } from 'next';

export const getServerSideProps = requireAuth(async () => {
  return { props: {} };
});

const CheckupPage: NextPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CheckupTableList />
      </Grid>
    </Grid>
  );
};

CheckupPage.acl = {
  action: 'read',
  subject: 'checkup-vital-signs'
};

export default CheckupPage;
