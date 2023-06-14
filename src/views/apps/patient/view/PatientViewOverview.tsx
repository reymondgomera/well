import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  useTheme
} from '@mui/material';

import type { PatientsType } from '@/utils/db.type';
import { ListItemTextData, ListItemTextType } from '@/utils/form.component';

import { useEffect, useState } from 'react';
import { PatientDtoSchemaType } from '@/server/schema/patient';
import Icon from '@/@core/components/icon';
import { ReferencesEntityType } from '@/utils/db.type';
import moment from 'moment';

interface PatientViewOverviewPropsType {
  patientData: PatientsType;
  referencesData: ReferencesEntityType[];
}

const PatientViewOverview = ({ patientData, referencesData }: PatientViewOverviewPropsType) => {
  const theme = useTheme();

  const [familyHistory, setFamilyHistory] = useState<PatientDtoSchemaType['familyHistory']>({
    diseases: [],
    others: ''
  });
  const [personalHistory, setPersonalHistory] = useState<PatientDtoSchemaType['personalHistory']>({
    alcohol: 0,
    smoking: 0,
    currentHealthCondition: '',
    medications: []
  });
  const [pastMedicalHistory, setPastMedicalHistory] = useState<PatientDtoSchemaType['pastMedicalHistory']>({
    hospitalized: '',
    injuries: '',
    surgeries: '',
    allergies: '',
    measles: '',
    chickenPox: '',
    others: ''
  });
  const [obGyne, setObGyne] = useState<PatientDtoSchemaType['obGyne']>({ menstrualCycle: null, days: 0, p: 0, g: 0 });

  const PATIENT_PANELS = ['FamilyHistory', 'PersonalHistory', 'PastMedicalHistory', 'Obgyne'] as const;
  const CARD_PANELS: Record<(typeof PATIENT_PANELS)[number], ListItemTextType[]> = {
    FamilyHistory: referencesData!
      ?.filter(ref => ref.entityId === 10)
      .map(
        disease =>
          ({
            listItemTextAttribute: {
              primary: familyHistory.diseases.includes(disease.id) ? (
                <Icon icon='material-symbols:check-circle' style={{ color: theme.palette.success.main }} />
              ) : (
                <Icon icon='gridicons:cross-circle' style={{ color: theme.palette.error.main }} />
              ),
              primaryTypographyProps: {
                sx: { mr: 2, display: 'inline', verticalAlign: 'middle' }
              },
              secondary: disease.name,
              secondaryTypographyProps: {
                sx: { display: 'inline', verticalAlign: 'middle' }
              }
            },
            gridAttribute: { xs: 6, sm: 4, md: 3 }
          } as ListItemTextType)
      )
      .concat([
        {
          listItemTextAttribute: {
            primary: 'Others',
            primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
            secondary: familyHistory.others
          },
          gridAttribute: { xs: 12 }
        }
      ]),
    PersonalHistory: [
      {
        listItemTextAttribute: {
          primary: (
            <Typography variant='subtitle2' color='text.primary' fontWeight='600'>
              Smoking
              <Typography variant='caption' ml={1}>
                (No. of sticks per day)
              </Typography>
            </Typography>
          ),
          primaryTypographyProps: { variant: 'subtitle2', color: 'text.primary' },
          secondary: personalHistory.smoking ? personalHistory.smoking : 0
        },
        gridAttribute: { xs: 4 }
      },
      {
        listItemTextAttribute: {
          primary: (
            <Typography variant='subtitle2' color='text.primary' fontWeight='600'>
              Alcohol
              <Typography variant='caption' ml={1}>
                (No. of years)
              </Typography>
            </Typography>
          ),
          primaryTypographyProps: { variant: 'subtitle2', color: 'text.primary' },
          secondary: personalHistory.alcohol ? personalHistory.alcohol : 0
        },
        gridAttribute: { xs: 4 }
      },
      {
        listItemTextAttribute: {
          primary: 'Present Health Condition',
          primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
          secondary: personalHistory.currentHealthCondition ? personalHistory.currentHealthCondition : 'N/A'
        },
        gridAttribute: { xs: 4 }
      }
    ],
    PastMedicalHistory: [
      {
        listItemTextAttribute: {
          primary: 'Have you ever been hospitalized? If yes, when and Why?',
          primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
          secondary: pastMedicalHistory.hospitalized ? pastMedicalHistory.hospitalized : 'N/A'
        },
        gridAttribute: { xs: 12 }
      },
      {
        listItemTextAttribute: {
          primary: 'Have you had any serious injuries and/or broken bones? If yes, please specify.',
          primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
          secondary: pastMedicalHistory.injuries ? pastMedicalHistory.injuries : 'N/A'
        },
        gridAttribute: { xs: 12 }
      },
      {
        listItemTextAttribute: {
          primary: 'Have you undergone any surgeries? If yes, please specify and when?',
          primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
          secondary: pastMedicalHistory.surgeries ? pastMedicalHistory.surgeries : 'N/A'
        },
        gridAttribute: { xs: 12 }
      },
      {
        listItemTextAttribute: {
          primary: 'Do you have any allergies? If yes, please specify.',
          primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
          secondary: pastMedicalHistory.allergies ? pastMedicalHistory.allergies : 'N/A'
        },
        gridAttribute: { xs: 12 }
      },
      {
        listItemTextAttribute: {
          primary: 'Have you had measles?',
          primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
          secondary: pastMedicalHistory.measles ? pastMedicalHistory.measles : 'N/A'
        },
        gridAttribute: { xs: 12 }
      },
      {
        listItemTextAttribute: {
          primary: 'Have you had chicken pox?',
          primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
          secondary: pastMedicalHistory.chickenPox ? pastMedicalHistory.chickenPox : 'N/A'
        },
        gridAttribute: { xs: 12 }
      },
      {
        listItemTextAttribute: {
          primary: 'Others',
          primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
          secondary: pastMedicalHistory.others ? pastMedicalHistory.others : 'N/A'
        },
        gridAttribute: { xs: 12 }
      }
    ],
    Obgyne: [
      {
        listItemTextAttribute: {
          primary: 'Menstrual Cycle',
          primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
          secondary: obGyne.menstrualCycle ? moment(obGyne.menstrualCycle).format('L') : 'N/A'
        },
        gridAttribute: { xs: 6 }
      },
      {
        listItemTextAttribute: {
          primary: 'Days',
          primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
          secondary: obGyne.days ? obGyne.days : 0
        },
        gridAttribute: { xs: 6 }
      },
      {
        listItemTextAttribute: {
          primary: (
            <Typography variant='subtitle2' color='text.primary' fontWeight='600'>
              OB Score:
              <Typography variant='caption' ml={1}>
                G (Gravida)
              </Typography>
            </Typography>
          ),
          secondary: obGyne.g ? obGyne.g : 0
        },
        gridAttribute: { xs: 6 }
      },
      {
        listItemTextAttribute: {
          primary: (
            <Typography variant='subtitle2' color='text.primary' fontWeight='600'>
              OB Score:
              <Typography variant='caption' ml={1}>
                P (Para)
              </Typography>
            </Typography>
          ),
          secondary: obGyne.p ? obGyne.p : 0
        },
        gridAttribute: { xs: 6 }
      }
    ]
  };

  useEffect(() => {
    setFamilyHistory(JSON.parse(JSON.stringify(patientData.familyHistory)) as PatientDtoSchemaType['familyHistory']);
    setPersonalHistory(
      JSON.parse(JSON.stringify(patientData.personalHistory)) as PatientDtoSchemaType['personalHistory']
    );
    setPastMedicalHistory(
      JSON.parse(JSON.stringify(patientData.pastMedicalHistory)) as PatientDtoSchemaType['pastMedicalHistory']
    );
    setObGyne(JSON.parse(JSON.stringify(patientData.obGyne)) as PatientDtoSchemaType['obGyne']);
  }, [patientData]);

  return (
    <Grid container spacing={6} width='100%'>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Family History' titleTypographyProps={{ fontWeight: '600 !important' }} />
          <CardContent>
            <Grid container>
              {CARD_PANELS['FamilyHistory'].map((obj, i) => (
                <ListItemTextData key={i} {...obj} />
              ))}
            </Grid>
            <Divider sx={{ width: '100%' }} />
          </CardContent>

          <CardHeader title='Personal History' titleTypographyProps={{ fontWeight: '600 !important' }} />
          <CardContent>
            <Grid container>
              {CARD_PANELS['PersonalHistory'].map((obj, i) => (
                <ListItemTextData key={i} {...obj} />
              ))}

              <Grid item xs={12} mt={5}>
                <Typography variant='subtitle2' color='text.primary' fontWeight='600'>
                  List of medications taken regularly
                  <Typography variant='caption' ml={1}>
                    (dosage, generic and brand name)
                  </Typography>
                </Typography>
                <Box display='flex' width='100%'>
                  <Paper
                    elevation={3}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                      height: 200,
                      mt: 2,
                      p: 5,
                      backgroundColor: theme => theme.palette.grey[100]
                    }}
                  >
                    <List
                      sx={{
                        height: 180,
                        overflowY: 'auto'
                      }}
                      dense
                    >
                      {personalHistory.medications &&
                        personalHistory.medications.length > 0 &&
                        personalHistory.medications.map((medication, i) => (
                          <ListItem key={i} sx={{ px: 1 }}>
                            <ListItemText
                              sx={{ m: 0, width: '50%' }}
                              primary={medication.brandName}
                              primaryTypographyProps={{ sx: { fontWeight: 600, color: 'text.primary' } }}
                              secondary={medication.generic}
                            />
                            <ListItemText
                              primary={medication.dosage}
                              primaryTypographyProps={{ align: 'right', variant: 'body2' }}
                            />
                          </ListItem>
                        ))}
                    </List>
                  </Paper>
                </Box>
              </Grid>
            </Grid>
            <Divider sx={{ width: '100%', '&.MuiDivider-root': { marginTop: 5 } }} />
          </CardContent>

          <CardHeader title='Past Medical History' titleTypographyProps={{ fontWeight: '600 !important' }} />
          <CardContent>
            <Grid container>
              {CARD_PANELS['PastMedicalHistory'].map((obj, i) => (
                <ListItemTextData key={i} {...obj} />
              ))}
            </Grid>
            <Divider sx={{ width: '100%' }} />
          </CardContent>

          <CardHeader title='Obstetrics & Gynecology' titleTypographyProps={{ fontWeight: '600 !important' }} />
          <CardContent>
            <Grid container>
              {CARD_PANELS['Obgyne'].map((obj, i) => (
                <ListItemTextData key={i} {...obj} />
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default PatientViewOverview;
