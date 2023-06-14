import { Box, Button, Card, CardActions, CardContent, Divider, Grid, Typography } from '@mui/material';

import CustomAvatar from '@/@core/components/mui/avatar';
import CustomChip from '@/@core/components/mui/chip';
import { PatientsType } from '@/utils/db.type';
import { getInitials } from '@/@core/utils/get-initials';
import moment from 'moment';

interface PatientViewLeftPropsType {
  data: PatientsType;
}

const PatientViewLeft = ({ data }: PatientViewLeftPropsType) => {
  if (data)
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ pt: 15, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <CustomAvatar
                skin='light'
                color='info'
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
                label='Patient'
                color='info'
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
                    Date of Birth:
                  </Typography>
                  <Typography variant='body2'>{moment(data.dateOfBirth).format('L')}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' fontWeight='600' sx={{ mr: 2, color: 'text.primary' }}>
                    Age:
                  </Typography>
                  <Typography variant='body2'>{data.age}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' fontWeight='600' sx={{ mr: 2, color: 'text.primary' }}>
                    Gender:
                  </Typography>
                  <Typography variant='body2'>{data.gender.name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' fontWeight='600' sx={{ mr: 2, color: 'text.primary' }}>
                    Civil Status:
                  </Typography>
                  <Typography variant='body2'>{data.civilStatus.name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' fontWeight='600' sx={{ mr: 2, color: 'text.primary' }}>
                    Occupation:
                  </Typography>
                  <Typography variant='body2'>
                    {data.occupationId && data.occupation ? data.occupation.name : 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' fontWeight='600' sx={{ mr: 2, color: 'text.primary' }}>
                    Contact:
                  </Typography>
                  <Typography variant='body2'>{data.contactNumber ? data.contactNumber : 'N/A'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' fontWeight='600' sx={{ mr: 2, color: 'text.primary' }}>
                    Address:
                  </Typography>
                  <Typography variant='body2'>{data.address}</Typography>
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

export default PatientViewLeft;
