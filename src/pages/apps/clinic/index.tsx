import { Grid } from '@mui/material';
import { requireAuth } from '@/common/requireAuth';
import ClinicTableList from '@/views/apps/clinic/ClinicTableList';
import { NextPage } from 'next';

export const getServerSideProps = requireAuth(async () => {
  return { props: {} };
});

import React from 'react';

const ClinicPage: NextPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ClinicTableList />
      </Grid>
    </Grid>
  );
};

ClinicPage.acl = {
  action: 'read',
  subject: 'clinic'
};

export default ClinicPage;
