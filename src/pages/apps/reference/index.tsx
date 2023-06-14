import { Grid } from '@mui/material';
import ReferenceLayout from '@/views/apps/reference/ReferenceLayout';
import { requireAuth } from '@/common/requireAuth';
import { NextPage } from 'next';

export const getServerSideProps = requireAuth(async () => {
  return { props: {} };
});

const ReferencePage: NextPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ReferenceLayout />
      </Grid>
    </Grid>
  );
};

ReferencePage.acl = {
  action: 'read',
  subject: 'reference'
};

export default ReferencePage;
