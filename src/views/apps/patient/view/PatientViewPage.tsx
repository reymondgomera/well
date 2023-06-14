import Grid from '@mui/material/Grid';

import PatientViewLeft from './PatientViewLeft';
import PatientViewRight from './PatientViewRight';
import { PatientsType } from '@/utils/db.type';

interface PatientViewPagePropsType {
  data: PatientsType;
}

const PatientViewPage = ({ data }: PatientViewPagePropsType) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <PatientViewLeft data={data} />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <PatientViewRight data={data} />
      </Grid>
    </Grid>
  );
};

export default PatientViewPage;
