import { useEffect } from 'react';

import Icon from 'src/@core/components/icon';

import { Box, Button } from '@mui/material';

import { useClinicFormStore } from '@/stores/clinic.store';
import { useFilterControlChange } from '@/utils/helper';
import { TextInputSearch } from '@/utils/form.component';

const UserViewClinicsTableHeader = () => {
  const { searchFilter, handleSearchFilter } = useFilterControlChange();
  const { setSearchFilter } = useClinicFormStore();

  useEffect(() => {
    setSearchFilter(searchFilter);
  }, [searchFilter]);

  return (
    <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <Button
          sx={{ mb: 2 }}
          color='secondary'
          variant='outlined'
          startIcon={<Icon icon='mdi:export-variant' fontSize={20} />}
        >
          Export
        </Button>
      </Box>
      <TextInputSearch
        handleSearchFilter={handleSearchFilter}
        searchFilterValue={searchFilter}
        textFieldAttribute={{ size: 'small', sx: { mb: 2 } }}
      />
    </Box>
  );
};

export default UserViewClinicsTableHeader;
