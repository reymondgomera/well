import {
  Card,
  CardContent,
  Divider,
  Grid,
  List,
  ListItemText,
  Typography,
  useTheme,
  Paper,
  ListItem,
  ListItemIcon,
  CardHeader,
  Theme
} from '@mui/material';

import CustomAvatar from '@/@core/components/mui/avatar';
import CustomChip from '@/@core/components/mui/chip';
import { getInitials } from '@/@core/utils/get-initials';
import { CheckupsType } from '@/utils/db.type';
import moment from 'moment';
import { ListItemTextData, ListItemTextType } from '@/utils/form.component';
import { ThemeColor } from '@/@core/layouts/types';
import { useEffect, useState } from 'react';
import Icon from '@/@core/components/icon';
import { CheckupDtoSchemaType, DiagnosisDtoSchemaType, TreatmentDtoSchemaType } from '@/server/schema/checkup';
import { getReferences } from '@/server/hooks/reference';

interface CheckupStatusType {
  [key: string]: ThemeColor;
}

interface CheckupViewPagePropsType {
  data: CheckupsType;
}

const checkupStatusObj: CheckupStatusType = {
  pending: 'warning',
  completed: 'success',
  cancelled: 'error'
};

const CheckupViewPage = ({ data }: CheckupViewPagePropsType) => {
  const theme = useTheme();

  const { data: referencesData } = getReferences({ entities: [9] });

  const [vitalSigns, setVitalSigns] = useState<CheckupDtoSchemaType['vitalSigns']>();
  const [diagnoses, setdiagnoses] = useState<DiagnosisDtoSchemaType[]>([]);
  const [treatments, setTreatments] = useState<TreatmentDtoSchemaType[]>([]);

  const CLINIC_PANEL = ['General'] as const;
  const CLINIC_FIELDS: Record<(typeof CLINIC_PANEL)[number], ListItemTextType[]> = {
    General: [
      {
        listItemTextAttribute: {
          primary: 'Code',
          primaryTypographyProps: {
            variant: 'subtitle2',
            fontWeight: 600,
            color: 'text.primary'
          },
          secondary: data.clinic.code
        },
        gridAttribute: { xs: 6 }
      },
      {
        listItemTextAttribute: {
          primary: 'Name',
          primaryTypographyProps: {
            variant: 'subtitle2',
            fontWeight: 600,
            color: 'text.primary'
          },
          secondary: data.clinic.name
        },
        gridAttribute: { xs: 6 }
      },
      {
        listItemTextAttribute: {
          primary: 'Address',
          primaryTypographyProps: {
            variant: 'subtitle2',
            fontWeight: 600,
            color: 'text.primary'
          },
          secondary: data.clinic.address
        },
        gridAttribute: { xs: 12 }
      },
      {
        listItemTextAttribute: {
          primary: 'Contact Number/s',
          primaryTypographyProps: {
            variant: 'subtitle2',
            fontWeight: 600,
            color: 'text.primary'
          },
          secondary: data.clinic.contactNumber.map((c, i) => {
            const lastIndex = data.clinic.contactNumber.length - 1;

            if (i === lastIndex) return c;
            else return `${c} | `;
          })
        },
        gridAttribute: { xs: 12 }
      }
    ]
  };

  const CHECKUP_PANEL = ['General'] as const;
  const CECKPUP_FIEDS: Record<(typeof CHECKUP_PANEL)[number], ListItemTextType[]> = {
    General: [
      {
        listItemTextAttribute: {
          primary: 'T',
          primaryTypographyProps: {
            variant: 'subtitle2',
            fontWeight: 600,
            color: 'text.primary'
          },
          secondary: `${vitalSigns?.t} °C`
        },
        gridAttribute: { xs: 6, sm: 2, md: 1 }
      },
      {
        listItemTextAttribute: {
          primary: 'P',
          primaryTypographyProps: {
            variant: 'subtitle2',
            fontWeight: 600,
            color: 'text.primary'
          },
          secondary: `${vitalSigns?.p} bpm`
        },
        gridAttribute: { xs: 6, sm: 2, md: 1 }
      },
      {
        listItemTextAttribute: {
          primary: 'R',
          primaryTypographyProps: {
            variant: 'subtitle2',
            fontWeight: 600,
            color: 'text.primary'
          },
          secondary: `${vitalSigns?.r} bpm`
        },
        gridAttribute: { xs: 6, sm: 2, md: 1 }
      },
      {
        listItemTextAttribute: {
          primary: 'BP',
          primaryTypographyProps: {
            variant: 'subtitle2',
            fontWeight: 600,
            color: 'text.primary'
          },
          secondary: `${vitalSigns?.bp} mmHg`
        },
        gridAttribute: { xs: 6, sm: 2, md: 1 }
      },
      {
        listItemTextAttribute: {
          primary: 'CBG',
          primaryTypographyProps: {
            variant: 'subtitle2',
            fontWeight: 600,
            color: 'text.primary'
          },
          secondary: `${vitalSigns?.cbg} mg/dL`
        },
        gridAttribute: { xs: 6, sm: 2, md: 1 }
      },
      {
        listItemTextAttribute: {
          primary: 'WT',
          primaryTypographyProps: {
            variant: 'subtitle2',
            fontWeight: 600,
            color: 'text.primary'
          },
          secondary: `${vitalSigns?.wt} kg`
        },
        gridAttribute: { xs: 6, sm: 2, md: 1 }
      },
      {
        listItemTextAttribute: {
          primary: 'HT',
          primaryTypographyProps: {
            variant: 'subtitle2',
            fontWeight: 600,
            color: 'text.primary'
          },
          secondary: `${vitalSigns?.ht} cm`
        },
        gridAttribute: { xs: 6, sm: 2, md: 1 }
      }
    ]
  };

  useEffect(() => {
    setVitalSigns(JSON.parse(JSON.stringify(data.vitalSigns)) as CheckupDtoSchemaType['vitalSigns']);
    setdiagnoses(JSON.parse(JSON.stringify(data.diagnoses)) as DiagnosisDtoSchemaType[]);
    setTreatments(JSON.parse(JSON.stringify(data.treatments)) as TreatmentDtoSchemaType[]);
  }, [data]);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Grid container>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar
                skin='light'
                color='info'
                sx={{ width: 120, height: 120, fontWeight: 600, mb: 4, fontSize: '3rem' }}
              >
                {getInitials(`${data.patient.firstName.toUpperCase()}`)}
              </CustomAvatar>

              <Grid container spacing={2} direction='column' px={6} justifyContent='center'>
                <Grid item>
                  <Typography variant='h6' fontWeight={600} color='text.primary'>
                    {data.patient.firstName} {data.patient.lastName}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant='body2'>
                    {data.patient.age} yrs old • {moment(data.patient.dateOfBirth).format('LL')}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant='body2'>{data.patient.address}</Typography>
                </Grid>
              </Grid>
            </CardContent>

            <Grid
              width='18%'
              container
              alignItems='center'
              sx={{
                height: 'auto',
                py: 5,
                ml: 'auto',
                backgroundColor: (theme: Theme) => theme.palette.primary.light,
                borderRadius: 1,
                display: 'none',
                [theme.breakpoints.up('md')]: {
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }
              }}
            >
              {data.followUp ? (
                <Grid container item px={5} direction='column' alignItems='center' justifyContent='center'>
                  <Typography sx={{ color: '#fff', fontSize: { md: '1rem' } }}>
                    {moment(data.followUp).format('dddd')}
                  </Typography>
                  <Typography
                    variant='h2'
                    sx={{ color: '#fff', fontSize: { md: '3rem', lg: '3.50rem' } }}
                    fontWeight='bold'
                  >
                    {moment(data.followUp).format('DD')}
                  </Typography>
                  <Typography
                    variant='h2'
                    sx={{ color: '#fff', fontSize: { md: '3rem', lg: '3.50rem' } }}
                    textTransform='uppercase'
                    fontWeight='bold'
                  >
                    {moment(data.followUp).format('MMM')}
                  </Typography>
                </Grid>
              ) : (
                <Grid item>
                  <Typography
                    variant='h2'
                    fontWeight='bold'
                    sx={{ color: '#fff', fontSize: { md: '3rem', lg: '3.50rem' } }}
                  >
                    N/A
                  </Typography>
                </Grid>
              )}
              <Typography variant='body2' sx={{ color: '#fff', fontSize: { md: '1rem' } }} textAlign='center'>
                Follow Up
              </Typography>
            </Grid>

            <Grid
              width='100%'
              container
              alignItems='center'
              direction='column'
              sx={{
                py: 5,
                ml: 'auto',
                backgroundColor: (theme: Theme) => theme.palette.primary.light,
                borderRadius: 1,
                display: 'flex',
                [theme.breakpoints.up('md')]: {
                  display: 'none'
                }
              }}
            >
              {data.followUp ? (
                <Grid container item px={5} direction='column' alignItems='center'>
                  <Typography sx={{ color: '#fff' }}>{moment(data.followUp).format('dddd')}</Typography>
                  <Typography variant='h2' sx={{ color: '#fff' }} fontWeight='bold'>
                    {moment(data.followUp).format('DD')}
                  </Typography>
                  <Typography variant='h2' sx={{ color: '#fff' }} textTransform='uppercase' fontWeight='bold'>
                    {moment(data.followUp).format('MMM')}
                  </Typography>
                </Grid>
              ) : (
                <Grid item px={5}>
                  <Typography variant='h2' sx={{ color: '#fff', fontSize: '1.40rem' }} fontWeight='bold'>
                    N/A
                  </Typography>
                </Grid>
              )}
              <Typography variant='body2' sx={{ color: '#fff' }} textAlign='center'>
                Follow Up
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Grid item xs={12} md={9} container spacing={2} direction='column' justifyContent='center'>
              <Grid item>
                <Typography variant='h6' fontWeight='600'>
                  {data.physician.firstName} {data.physician.lastName}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant='body2'>Physician</Typography>
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              md={3}
              container
              spacing={2}
              sx={{ marginTop: 1, [theme.breakpoints.up('sm')]: { marginTop: 0 } }}
              direction='column'
              justifyContent='center'
            >
              <Grid item>
                <ListItemText
                  primary='Date: '
                  sx={{ display: 'flex' }}
                  primaryTypographyProps={{
                    variant: 'subtitle2',
                    fontWeight: 600,
                    paddingRight: 2,
                    color: 'text.primary'
                  }}
                  secondary={moment(data.createdAt).format('LL')}
                />
              </Grid>
              <Grid item>
                <ListItemText
                  primary='Added By: '
                  sx={{ display: 'flex' }}
                  primaryTypographyProps={{
                    variant: 'subtitle2',
                    fontWeight: 600,
                    paddingRight: 3,
                    color: 'text.primary'
                  }}
                  secondary={`${data.receptionist.firstName} ${data.receptionist.lastName}`}
                />
              </Grid>
              <Grid item>
                <ListItemText
                  primary='Status: '
                  sx={{ display: 'flex' }}
                  primaryTypographyProps={{
                    variant: 'subtitle2',
                    fontWeight: 600,
                    paddingRight: 3,
                    color: 'text.primary'
                  }}
                  secondary={
                    <CustomChip
                      skin='light'
                      size='small'
                      label={data.status.name}
                      color={checkupStatusObj[data.status.code.toLowerCase()]}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  }
                  secondaryTypographyProps={{ component: 'span' }}
                />
              </Grid>
            </Grid>
            <Divider sx={{ width: '100%' }} />

            <CardHeader
              title='Clinic'
              titleTypographyProps={{ fontWeight: '600 !important' }}
              sx={{ width: '100%', paddingX: 0 }}
            />

            {CLINIC_FIELDS['General'].map((obj, i) => (
              <ListItemTextData key={i} {...obj} />
            ))}

            <Divider sx={{ width: '100%' }} />

            <CardHeader
              title='Vital Signs'
              titleTypographyProps={{ fontWeight: '600 !important' }}
              sx={{ width: '100%', paddingX: 0 }}
            />
            {CECKPUP_FIEDS['General'].map((obj, i) => (
              <ListItemTextData key={i} {...obj} />
            ))}

            <Divider sx={{ width: '100%' }} />

            <Grid item container xs={12} spacing={6}>
              <Grid item xs={12} md={6}>
                <CardHeader
                  title='Diagnosis'
                  titleTypographyProps={{ fontWeight: '600 !important' }}
                  sx={{ width: '100%', paddingX: 0 }}
                />

                <Paper
                  elevation={3}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    mt: 2,
                    p: 5,
                    backgroundColor: theme => theme.palette.grey[100]
                  }}
                >
                  <List
                    sx={{
                      height: 180,
                      paddingY: 0,
                      overflowY: 'auto'
                    }}
                    dense
                  >
                    {diagnoses &&
                      diagnoses.length > 0 &&
                      diagnoses.map((diagnosis, i) => (
                        <ListItem key={i} sx={{ pl: 0 }}>
                          <ListItemIcon sx={{ mr: 0 }}>
                            <Icon icon='mdi:circle-small' fontSize={30} color='text.primary' />
                          </ListItemIcon>
                          <ListItemText
                            sx={{ m: 0, width: '50%' }}
                            primary={diagnosis.name}
                            primaryTypographyProps={{
                              sx: { fontWeight: 600, color: 'text.primary' }
                            }}
                          />
                        </ListItem>
                      ))}
                  </List>
                </Paper>
              </Grid>

              <Grid item xs={12} sx={{ display: 'block', [theme.breakpoints.up('md')]: { display: 'none' } }}>
                <Divider sx={{ width: '100%', '&.MuiDivider-root': { marginTop: 5 } }} />
              </Grid>

              <Grid item xs={12} md={6}>
                <CardHeader
                  title='Treatment'
                  titleTypographyProps={{ fontWeight: '600 !important' }}
                  sx={{ width: '100%', paddingX: 0 }}
                />

                <Paper
                  elevation={3}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    mt: 2,
                    p: 5,
                    backgroundColor: theme => theme.palette.grey[100]
                  }}
                >
                  <List
                    sx={{
                      height: 180,
                      paddingY: 0,
                      overflowY: 'auto'
                    }}
                    dense
                  >
                    {treatments &&
                      treatments.length > 0 &&
                      treatments.map((treatment, i) => (
                        <ListItem key={i} sx={{ pl: 0 }}>
                          <ListItemIcon sx={{ mr: 0 }}>
                            <Icon icon='mdi:circle-small' fontSize={30} color='text.primary' />
                          </ListItemIcon>
                          <ListItemText
                            sx={{ m: 0, width: '50%' }}
                            primary={`[${treatment.quantity}x]  ${
                              referencesData?.find(medicine => medicine.id === treatment.medicineId)?.name
                            }`}
                            primaryTypographyProps={{ sx: { fontWeight: 600, color: 'text.primary' } }}
                            secondary={treatment.signa}
                          />
                        </ListItem>
                      ))}
                  </List>
                </Paper>
              </Grid>
            </Grid>

            <Divider sx={{ width: '100%', '&.MuiDivider-root': { marginTop: 5 } }} />

            <CardHeader
              title='Dietarty Advise'
              titleTypographyProps={{ fontWeight: '600 !important' }}
              sx={{ width: '100%', paddingX: 0 }}
            />
            <Grid item xs={12} md={9} container spacing={2} direction='column' justifyContent='center'>
              <Grid item>
                <Typography variant='body2'>{data.dietaryAdviseGiven}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CheckupViewPage;
