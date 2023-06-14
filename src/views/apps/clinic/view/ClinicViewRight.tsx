import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, CircularProgress, Tab as MuiTab, TabProps, Typography, styled } from '@mui/material';

import React, { useEffect, useState } from 'react';

import { ClinicsType } from '@/utils/db.type';
import Icon from '@/@core/components/icon';
import { getUsers } from '@/server/hooks/user';
import ClinicViewUsers from './ClinicViewUsers';
import { useUserFormStore } from '@/stores/user.store';
import ClinicViewCheckupHistory from './ClinicViewCheckupHistory';
import { getCheckups } from '@/server/hooks/checkup';
import { useCheckupFormStore } from '@/stores/checkup.store';
import { supabase } from '@/utils/supabase';
import { InvalidateQueries } from '@/utils/rq.context';

interface ClinicViewRightPropsType {
  data: ClinicsType;
}

const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  minHeight: 48,
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(1)
  }
}));

const ClinicViewRight = ({ data }: ClinicViewRightPropsType) => {
  const [activeTab, setActiveTab] = useState<string>('1');
  const { searchFilter: userSearchFilter } = useUserFormStore();
  const { searchFilter: checkupSearchFilter } = useCheckupFormStore();

  const { data: usersData, status: usersDataStatus } = getUsers(
    { searchFilter: userSearchFilter },
    { ids: data.profile ? data.profile.map(p => p.userId) : [] }
  );

  const { data: clinicCheckupsData, status: clinicCheckupsDataStatus } = getCheckups({
    searchFilter: {
      ...checkupSearchFilter,
      dropDown: {
        ...checkupSearchFilter?.dropDown,
        clinicId: data.id
      }
    }
  });

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    const channel = supabase
      .channel('db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'User' }, payload => {
        InvalidateQueries({ queryKey: {}, routerKey: 'user' });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Checkup' }, payload => {
        InvalidateQueries({ queryKey: {}, routerKey: 'checkup' });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (data) {
    return (
      <TabContext value={activeTab}>
        <TabList onChange={handleChange}>
          <Tab value='1' label='Users' icon={<Icon icon='mdi:account-outline' />} />
          <Tab value='2' label='Checkup History' icon={<Icon icon='mdi:history' />} />
        </TabList>
        <Box sx={{ mt: 6 }}>
          {usersDataStatus === 'loading' || clinicCheckupsDataStatus === 'loading' ? (
            <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <CircularProgress sx={{ mb: 4 }} />
              <Typography>Loading...</Typography>
            </Box>
          ) : (
            <>
              <TabPanel sx={{ p: 0, width: '100%' }} value='1'>
                <ClinicViewUsers clinicData={data} usersData={usersData ? usersData : []} />
              </TabPanel>
              <TabPanel sx={{ p: 0, width: '100%' }} value='2'>
                <ClinicViewCheckupHistory
                  clinicData={data}
                  ClinicCheckupsData={clinicCheckupsData ? clinicCheckupsData : []}
                />
              </TabPanel>
            </>
          )}
        </Box>
      </TabContext>
    );
  } else return null;
};

export default ClinicViewRight;
