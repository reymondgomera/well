import Grid from '@mui/material/Grid';

import { ClinicsType } from '@/utils/db.type';
import ClinicViewLeft from './ClinicViewLeft';
import ClinicViewRight from './ClinicViewRight';

interface ClinicViewPagePropsType {
  data: ClinicsType;
}

const ClinicViewPage = ({ data }: ClinicViewPagePropsType) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <ClinicViewLeft data={data} />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <ClinicViewRight data={data} />
      </Grid>
    </Grid>
  );
};

export default ClinicViewPage;
