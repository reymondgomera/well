import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, CircularProgress, Tab as MuiTab, TabProps, Typography, styled } from '@mui/material';

import React, { useEffect, useState } from 'react';

import { PatientsType } from '@/utils/db.type';
import Icon from '@/@core/components/icon';
import PatientViewOverview from './PatientViewOverview';
import { getReferences } from '@/server/hooks/reference';
import { getCheckups } from '@/server/hooks/checkup';
import PatientViewCheckupHistory from './PatientViewCheckupHistory';
import { useCheckupFormStore } from '@/stores/checkup.store';
import { supabase } from '@/utils/supabase';
import { InvalidateQueries } from '@/utils/rq.context';

interface PatientViewRightPropsType {
  data: PatientsType;
}

const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  minHeight: 48,
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(1)
  }
}));

const PatientViewRight = ({ data }: PatientViewRightPropsType) => {
  const [activeTab, setActiveTab] = useState<string>('1');
  const { searchFilter } = useCheckupFormStore();

  const { data: referencesData, status: referencesDataStatus } = getReferences({ entities: [10] });
  const { data: patientCheckupsData, status: patientCheckupsDataStatus } = getCheckups({
    searchFilter: {
      ...searchFilter,
      dropDown: {
        ...searchFilter?.dropDown,
        patientId: data.id
      }
    }
  });

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    const channel = supabase
      .channel('db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Reference' }, payload => {
        InvalidateQueries({ queryKey: {}, routerKey: 'reference' });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Checkup' }, payload => {
        InvalidateQueries({ queryKey: {}, routerKey: 'checkup' });
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
          <Tab value='1' label='Overview' icon={<Icon icon='mdi:account-outline' />} />
          <Tab value='2' label='Checkup History' icon={<Icon icon='mdi:history' />} />
        </TabList>
        <Box sx={{ mt: 6 }}>
          {referencesDataStatus === 'loading' || patientCheckupsDataStatus === 'loading' ? (
            <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <CircularProgress sx={{ mb: 4 }} />
              <Typography>Loading...</Typography>
            </Box>
          ) : (
            <>
              <TabPanel sx={{ p: 0, width: '100%' }} value='1'>
                <PatientViewOverview patientData={data} referencesData={referencesData ? referencesData : []} />
              </TabPanel>
              <TabPanel sx={{ p: 0 }} value='2'>
                <PatientViewCheckupHistory
                  patientData={data}
                  patientCheckupsData={patientCheckupsData ? patientCheckupsData : []}
                />
              </TabPanel>
            </>
          )}
        </Box>
      </TabContext>
    );
  else return null;
};

export default PatientViewRight;
