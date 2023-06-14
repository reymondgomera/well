import { useEffect } from 'react';

import { NextPage } from 'next';

import { Grid, Skeleton } from '@mui/material';

import Icon from '@/@core/components/icon';
import CardStatsHorizontal from '@/@core/components/card-statistics/card-stats-horizontal';
import CardStatsVertical from '@/@core/components/card-statistics/card-stats-vertical';

import { requireAuth } from '@/common/requireAuth';
import { getDashboardStatistics } from '@/server/hooks/dashboard';
import { supabase } from '@/utils/supabase';
import { InvalidateQueries } from '@/utils/rq.context';

export const getServerSideProps = requireAuth(async () => {
  return { props: {} };
});

const Dashboard: NextPage = () => {
  const { data, isLoading } = getDashboardStatistics();

  const getTrend = (previous: number, current: number) => {
    if (previous && current) {
      return current > previous ? 'positive' : 'negative';
    } else return undefined;
  };

  const getTrendNumber = (previous: number, current: number) => {
    if (previous && current) {
      const sign = current > previous ? '+' : '';
      return `${sign}${(((current - previous) / previous) * 100).toFixed(2)}%`;
    } else return undefined;
  };

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, payload => {
        InvalidateQueries({ queryKey: {}, routerKey: 'dashboard' });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <Grid container spacing={6}>
      {!isLoading ? (
        <>
          <Grid item xs={6} md={4} lg={3}>
            <CardStatsHorizontal
              stats={data?.reference.total ? data?.reference.total.toLocaleString() : ''}
              title='Total Reference'
              color='secondary'
              icon={<Icon icon='mdi:list-box-outline' />}
            />
          </Grid>
          <Grid item xs={6} md={4} lg={3}>
            <CardStatsHorizontal
              stats={data?.user.total ? data?.user.total.toLocaleString() : ''}
              title='Total User'
              color='primary'
              icon={<Icon icon='mdi:account-outline' />}
            />
          </Grid>
          <Grid item xs={6} md={4} lg={3}>
            <CardStatsHorizontal
              stats={data?.user.totalPhysician ? data?.user.totalPhysician.toLocaleString() : ''}
              title='Total Physician'
              color='warning'
              icon={<Icon icon='mdi:doctor' />}
            />
          </Grid>
          <Grid item xs={6} md={4} lg={3}>
            <CardStatsHorizontal
              stats={data?.user.totalReceptionist ? data?.user.totalReceptionist.toLocaleString() : ''}
              title='Total Receptionist'
              color='success'
              icon={<Icon icon='uil:user-md' />}
            />
          </Grid>
          <Grid item xs={6} md={4} lg={3}>
            <CardStatsHorizontal
              stats={data?.clinic.total ? data?.clinic.total.toLocaleString() : ''}
              title='Total Clinic'
              color='info'
              icon={<Icon icon='mdi:home-city-outline' />}
            />
          </Grid>
          <Grid item xs={6} md={4} lg={3}>
            <CardStatsHorizontal
              stats={data?.patient.total ? data?.patient.total.toLocaleString() : ''}
              title='Total Patient'
              color='info'
              icon={<Icon icon='mdi:patient-outline' />}
            />
          </Grid>
          <Grid item xs={6} md={4} lg={3}>
            <CardStatsHorizontal
              stats={data?.checkup.total ? data?.checkup.total.toLocaleString() : ''}
              title='Total Checkup'
              color='info'
              icon={<Icon icon='tabler:checkup-list' />}
            />
          </Grid>
          <Grid item xs={6} md={4} lg={3}>
            <CardStatsHorizontal
              stats={
                data?.checkup.total && data?.clinic.total
                  ? `${(data?.checkup.total / data?.clinic.total).toFixed(2)}%`
                  : ''
              }
              title='Average Checkup'
              color='info'
              icon={<Icon icon='tabler:checkup-list' />}
            />
          </Grid>
        </>
      ) : (
        Array.from({ length: 8 }).map((_, i) => (
          <Grid key={i} item xs={6} md={4} lg={3}>
            <Skeleton variant='rounded' animation='wave' width='100%' height={80} />
          </Grid>
        ))
      )}

      {/* stats for this month compared to previous month */}
      {/* <Grid item xs={6} md={4} lg={2}>
        <CardStatsVertical
          stats={patientStat?.thisMonthTotal ? patientStat?.thisMonthTotal.toLocaleString() : ''}
          title='Total Patient'
          color='primary'
          trend={patientStat && getTrend(patientStat.previousMonthTotal, patientStat.thisMonthTotal)}
          trendNumber={patientStat && getTrendNumber(patientStat.previousMonthTotal, patientStat.thisMonthTotal)}
          icon={<Icon icon='mdi:account-outline' />}
          chipText='This Month'
        />
      </Grid> */}
    </Grid>
  );
};

export default Dashboard;

Dashboard.acl = {
  action: 'read',
  subject: 'dashboard'
};
