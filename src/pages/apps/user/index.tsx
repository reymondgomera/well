import { Grid } from '@mui/material';
import UserTableList from '@/views/apps/user/UserTableList';
import { requireAuth } from '@/common/requireAuth';
import { NextPage } from 'next';

export const getServerSideProps = requireAuth(async () => {
  return { props: {} };
});

const UserPage: NextPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserTableList />
      </Grid>
    </Grid>
  );
};

UserPage.acl = {
  action: 'read',
  subject: 'user'
};

export default UserPage;
