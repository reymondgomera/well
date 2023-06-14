import { forwardRef, useContext, useEffect, useState } from 'react';

import { Button, CardContent, CardHeader, Divider, Grid, MenuItem } from '@mui/material';

import Icon from '@/@core/components/icon';

import { useFilterControlChange } from '@/utils/helper';
import { useCheckupFormStore } from '@/stores/checkup.store';
import {
  DateRangeInputSearch,
  DropdownData,
  DropdownNonEntityReferenceData,
  TextInputSearch
} from '@/utils/form.component';
import { getReferences } from '@/server/hooks/reference';
import { getClinics } from '@/server/hooks/clinic';
import { CheckupUnionFieldType } from '@/server/schema/checkup';
import { AbilityContext } from '@/layouts/components/acl/Can';

const CheckupTableHeader = () => {
  const {
    searchFilter,
    setSearchFilter: filterControlSetSearchFilter,
    handleSearchFilter,
    handleDateRangeFilter
  } = useFilterControlChange();
  const { setSearchFilter } = useCheckupFormStore();

  const ability = useContext(AbilityContext);
  const [open, setOpen] = useState<boolean>(false);

  const { data: referencesData } = getReferences({ entities: [13] });
  const { data: clinicData, isLoading: clinicDataIsLoading } = getClinics();
  const filterTableHeader = new Map([['tableHeader', [13, 11]]]).get('tableHeader');
  const dataLoaded = !!filterTableHeader;

  useEffect(() => {
    setSearchFilter(searchFilter);
  }, [searchFilter]);

  useEffect(() => {
    if (referencesData && referencesData.length > 0) {
      filterControlSetSearchFilter(prev => ({
        ...prev,
        dropDown: { ...prev['dropDown'], timeframe: referencesData.find(ref => ref.isDefault)?.id }
      }));
    }
  }, [referencesData]);

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
                    customMenuItem={{
                      dateRange: {
                        render: childProps => (
                          <MenuItem
                            key={childProps?.key}
                            value={childProps?.value}
                            onClick={() => setOpen(prev => !prev)}
                          >
                            Date Range
                          </MenuItem>
                        )
                      }
                    }}
                  />
                </Grid>
              ))}

              <Grid item sm={4} xs={12}>
                <DropdownNonEntityReferenceData<CheckupUnionFieldType>
                  type='filter'
                  label='Clinic'
                  filterFieldProp='clinicId'
                  handleSearchFilter={handleSearchFilter}
                  searchFilterValue={searchFilter}
                  formControlAttribute={{
                    sx: { display: ability.can('read', 'filter-checkups-by-clinic') ? 'block' : 'none' }
                  }}
                  dropDownNonEntityReferenceAttribute={{
                    data: clinicData && clinicData.length > 0 ? clinicData : [],
                    dataIsloading: clinicDataIsLoading,
                    menuItemTextPath: ['name']
                  }}
                />
              </Grid>

              <Grid item xs={12} sx={{ padding: '0 !important' }}>
                <DateRangeInputSearch
                  boxAttribute={{
                    width: '100%',
                    position: 'absolute'
                  }}
                  reactDatePickerAttribute={{
                    className: 'hidden'
                  }}
                  open={open}
                  setOpen={setOpen}
                  handleDateRangeFilter={handleDateRangeFilter}
                  searchFilterValue={searchFilter}
                />
              </Grid>
            </Grid>
          </CardContent>
        ) : null}

        <Divider />
        <Grid
          container
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

          <Grid item container justifyContent='flex-end' xs={6} spacing={3}>
            <Grid item xs={6}>
              <TextInputSearch
                handleSearchFilter={handleSearchFilter}
                searchFilterValue={searchFilter}
                textFieldAttribute={{ size: 'small', sx: { mb: 2 }, fullWidth: true }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CheckupTableHeader;
