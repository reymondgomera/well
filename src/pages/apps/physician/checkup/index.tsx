import { Grid } from '@mui/material';
import { requireAuth } from '@/common/requireAuth';
import CheckupTableList from '@/views/apps/checkup/CheckupTableList';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';

export const getServerSideProps = requireAuth(async () => {
  return { props: {} };
});

const PhysicianCheckupPage: NextPage = () => {
  const { data: session } = useSession();

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CheckupTableList physicianId={session?.user.id} />
      </Grid>
    </Grid>
  );
};

PhysicianCheckupPage.acl = {
  action: 'read',
  subject: 'checkup'
};

export default PhysicianCheckupPage;
