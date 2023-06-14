import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, CircularProgress, Tab as MuiTab, TabProps, Typography, styled } from '@mui/material';

import React, { useEffect, useState } from 'react';

import { UsersType } from '@/utils/db.type';
import Icon from '@/@core/components/icon';
import { useClinicFormStore } from '@/stores/clinic.store';
import { getClinics } from '@/server/hooks/clinic';
import UserViewProfile from './UserViewProfile';
import UserViewClinics from './UserViewClinics';
import { supabase } from '@/utils/supabase';
import { InvalidateQueries } from '@/utils/rq.context';

interface UserViewRightPropsType {
  data: UsersType;
}

const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  minHeight: 48,
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(1)
  }
}));

const UserViewRight = ({ data }: UserViewRightPropsType) => {
  const [activeTab, setActiveTab] = useState<string>('1');
  const { searchFilter } = useClinicFormStore();

  const [clinics, setClinics] = useState<number[]>([]);
  const { data: clinicsData, status: clinicsDataStatus } = getClinics({ searchFilter }, { ids: clinics });

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    if (data.role.code !== 'admin') {
      const clinics = data.profile?.clinics;
      setClinics(clinics ? clinics.map(c => c.id) : []);
    }
  }, [data]);

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

  if (data)
    return (
      <TabContext value={activeTab}>
        <TabList onChange={handleChange}>
          <Tab value='1' label='Profile' icon={<Icon icon='mingcute:profile-line' />} />
          <Tab value='2' label='Clinics' icon={<Icon icon='mdi:home-city-outline' />} />
        </TabList>
        <Box sx={{ mt: 6 }}>
          {clinicsDataStatus === 'loading' ? (
            <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <CircularProgress sx={{ mb: 4 }} />
              <Typography>Loading...</Typography>
            </Box>
          ) : (
            <>
              <TabPanel sx={{ p: 0, width: '100%' }} value='1'>
                <UserViewProfile userData={data} />
              </TabPanel>
              <TabPanel sx={{ p: 0, width: '100%' }} value='2'>
                <UserViewClinics userData={data} clinicsData={clinicsData ? clinicsData : []} />
              </TabPanel>
            </>
          )}
        </Box>
      </TabContext>
    );
  else return null;
};

export default UserViewRight;
