import { Box, Button, CardContent, CardHeader, Divider, Grid } from '@mui/material';
import Icon from '@/@core/components/icon';

import { useEffect } from 'react';
import { useFilterControlChange } from '@/utils/helper';
import { usePatientFormStore } from '@/stores/patient.store';
import { DropdownData, TextInputSearch } from '@/utils/form.component';

const PatientTableHeader = () => {
  const { searchFilter, handleSearchFilter } = useFilterControlChange();
  const { onAdd, setSearchFilter } = usePatientFormStore();

  const filterTableHeader = new Map([['tableHeader', [1, 2, 3]]]).get('tableHeader');
  const dataLoaded = !!filterTableHeader;

  const handleCreate = () => onAdd();

  useEffect(() => {
    setSearchFilter(searchFilter);
  }, [searchFilter]);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CardHeader title='Search Filters' sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
        {dataLoaded ? (
          <CardContent>
            <Grid container spacing={6}>
              {filterTableHeader.map(entityId => (
                <Grid key={entityId} item sm={4} xs={12}>
                  <DropdownData
                    type='filter'
                    id={entityId}
                    handleSearchFilter={handleSearchFilter}
                    searchFilterValue={searchFilter}
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        ) : null}

        <Divider />
        <Grid
          sx={{
            p: 5,
            pb: 3,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Button
            sx={{ mr: 4, mb: 2 }}
            color='secondary'
            variant='outlined'
            startIcon={<Icon icon='mdi:export-variant' fontSize={20} />}
          >
            Export
          </Button>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <TextInputSearch
              handleSearchFilter={handleSearchFilter}
              searchFilterValue={searchFilter}
              textFieldAttribute={{ size: 'small', sx: { mb: 2 } }}
            />

            <Button sx={{ mb: 2, ml: 5 }} onClick={handleCreate} variant='contained'>
              Add Patient
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PatientTableHeader;
