import { Box, Button, Card, CardActions, CardContent, Divider, Grid, Typography } from '@mui/material';

import Icon from '@/@core/components/icon';
import CustomChip from '@/@core/components/mui/chip';
import { ClinicsType } from '@/utils/db.type';
import moment from 'moment';

interface ClinicViewLeftPropsType {
  data: ClinicsType;
}

const ClinicViewLeft = ({ data }: ClinicViewLeftPropsType) => {
  if (data) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ pt: 15, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <Icon icon='mdi:home-city-outline' fontSize={120} />

              <CustomChip
                skin='light'
                size='small'
                label='Clinic'
                color='secondary'
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
                    Code:
                  </Typography>
                  <Typography variant='body2'>{data.code}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' fontWeight='600' sx={{ mr: 2, color: 'text.primary' }}>
                    Name:
                  </Typography>
                  <Typography variant='body2'>{data.name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' fontWeight='600' sx={{ mr: 2, color: 'text.primary' }}>
                    Days Open:
                  </Typography>
                  <Typography variant='body2'>{data.daysOpen}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' fontWeight='600' sx={{ mr: 2, color: 'text.primary' }}>
                    Opening Time:
                  </Typography>
                  <Typography variant='body2'>{moment(data.openingTime).format('LT')}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' fontWeight='600' sx={{ mr: 2, color: 'text.primary' }}>
                    Closing Time:
                  </Typography>
                  <Typography variant='body2'>{moment(data.closingTime).format('LT')}</Typography>
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
                  <Typography variant='body2'>{moment(data.updatedAt).format('L')}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' fontWeight='600' sx={{ mr: 2, color: 'text.primary' }}>
                    Contact Number/s:
                  </Typography>
                  <Typography variant='body2'>{data.contactNumber.toString().replaceAll(',', ', ')}</Typography>
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
  } else return null;
};

export default ClinicViewLeft;
