import { useEffect, useState } from 'react';

import { Button, CardContent, CardHeader, Divider, Grid, MenuItem } from '@mui/material';

import Icon from '@/@core/components/icon';

import { useFilterControlChange } from '@/utils/helper';
import { DropdownData, TextInputSearch } from '@/utils/form.component';
import { useUserFormStore } from '@/stores/user.store';

const ClinicViewUsersTableHeader = () => {
  const { searchFilter, handleSearchFilter } = useFilterControlChange();
  const { setSearchFilter } = useUserFormStore();

  const filterTableHeader = new Map([['tableHeader', [6, 7, 8]]]).get('tableHeader');
  const dataLoaded = !!filterTableHeader;

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

          <TextInputSearch
            handleSearchFilter={handleSearchFilter}
            searchFilterValue={searchFilter}
            textFieldAttribute={{ size: 'small', sx: { mb: 2 } }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ClinicViewUsersTableHeader;
