import { Box, Button, Card, CardActions, CardContent, Divider, Grid, Typography } from '@mui/material';

import CustomAvatar from '@/@core/components/mui/avatar';
import CustomChip from '@/@core/components/mui/chip';
import { UsersType } from '@/utils/db.type';
import { getInitials } from '@/@core/utils/get-initials';
import moment from 'moment';
import { ThemeColor } from '@/@core/layouts/types';

interface UserViewLeftPropsType {
  data: UsersType;
}

interface UserRoleType {
  [key: string]: { color: string };
}

interface UserStatusType {
  [key: string]: ThemeColor;
}

const userRoleObj: UserRoleType = {
  admin: { color: 'error' },
  user: { color: 'primary' },
  physician: { color: 'warning' },
  receptionist: { color: 'success' }
};

const userStatusObj: UserStatusType = {
  active: 'success',
  blocked: 'error',
  deactivated: 'secondary'
};

const UserViewLeft = ({ data }: UserViewLeftPropsType) => {
  if (data)
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ pt: 15, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <CustomAvatar
                skin='light'
                color='primary'
                sx={{ width: 120, height: 120, fontWeight: 600, mb: 4, fontSize: '3rem' }}
              >
                {getInitials(`${data.firstName.toUpperCase()}`)}
              </CustomAvatar>

              <Typography variant='h6' fontWeight='600' sx={{ mb: 2 }}>
                {data.firstName} {data.lastName}
              </Typography>

              <CustomChip
                skin='light'
                size='small'
                label={data.role.name}
                color={userRoleObj[data.role.code].color as ThemeColor}
                sx={{
                  height: 20,
                  fontWeight: 600,
                  borderRadius: '5px',
                  fontSize: '0.875rem',
                  textTransform: 'capitalize',
                  '& .MuiChip-label': { mt: -0.25 }
                }}
              />
            </CardContent>

            <CardContent>
              <Typography variant='h6' fontWeight='600'>
                Details
              </Typography>
              <Divider sx={{ mt: theme => `${theme.spacing(4)} !important` }} />

              <Box sx={{ pt: 2, pb: 1 }}>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' fontWeight='600' sx={{ mr: 2, color: 'text.primary' }}>
                    First Name:
                  </Typography>
                  <Typography variant='body2'>{data.firstName}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' fontWeight='600' sx={{ mr: 2, color: 'text.primary' }}>
                    Last Name:
                  </Typography>
                  <Typography variant='body2'>{data.lastName}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' fontWeight='600' sx={{ mr: 2, color: 'text.primary' }}>
                    Middle Initial:
                  </Typography>
                  <Typography variant='body2'>{data.middleInitial ? data.middleInitial : 'N/A'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' fontWeight='600' sx={{ mr: 2, color: 'text.primary' }}>
                    Username:
                  </Typography>
                  <Typography variant='body2'>{data.userName}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' fontWeight='600' sx={{ mr: 2, color: 'text.primary' }}>
                    Email:
                  </Typography>
                  <Typography variant='body2'>{data.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' fontWeight='600' sx={{ mr: 2, color: 'text.primary' }}>
                    Role:
                  </Typography>
                  <Typography variant='body2'>{data.role.name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' fontWeight='600' sx={{ mr: 2, color: 'text.primary' }}>
                    Department:
                  </Typography>
                  <Typography variant='body2'>{data.departmentId ? data.department?.name : 'N/A'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' fontWeight='600' sx={{ mr: 2, color: 'text.primary' }}>
                    Created At:
                  </Typography>
                  <Typography variant='body2'>{moment(data.createdAt).format('L')}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' fontWeight='600' sx={{ mr: 2, color: 'text.primary' }}>
                    Updated At:
                  </Typography>
                  <Typography variant='body2'> {moment(data.updatedAt).format('L')}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' fontWeight='600' sx={{ mr: 2, color: 'text.primary' }}>
                    Status:
                  </Typography>

                  <CustomChip
                    skin='light'
                    size='small'
                    label={data.status.name}
                    color={userStatusObj[data.status.code]}
                    sx={{
                      height: 20,
                      fontWeight: 600,
                      borderRadius: '5px',
                      fontSize: '0.875rem',
                      textTransform: 'capitalize',
                      '& .MuiChip-label': { mt: -0.25 }
                    }}
                  />
                </Box>
              </Box>
            </CardContent>

            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button color='success' variant='contained'>
                Print
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    );
  else return null;
};

export default UserViewLeft;
