import Grid from '@mui/material/Grid';

import UserViewLeft from './UserViewLeft';
import UserViewRight from './UserViewRight';
import { UsersType } from '@/utils/db.type';

interface UserViewPagePropsType {
  data: UsersType;
}

const UserViewPage = ({ data }: UserViewPagePropsType) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <UserViewLeft data={data} />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <UserViewRight data={data} />
      </Grid>
    </Grid>
  );
};

export default UserViewPage;
