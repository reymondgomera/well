import { useEffect, SyntheticEvent, useContext, FC } from 'react';

import {
  Box,
  FormHelperText,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tab,
  Paper,
  Breakpoint,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  InputAdornment
} from '@mui/material';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import isDeepEqual from 'fast-deep-equal/react';
import toast from 'react-hot-toast';

import { FormControlPropsType, FormPropsType } from '@/utils/common.type';
import {
  checkupDtoSchema,
  CheckupDtoSchemaType,
  CheckupUnionFieldType,
  diagnosisDtoSchema,
  DiagnosisDtoSchemaType,
  DiagnosisUnionFieldType,
  treatmentDtoSchema,
  TreatmentDtoSchemaType,
  TreatmentUnionFieldType
} from '@/server/schema/checkup';

import { getCheckup, postCheckup } from '@/server/hooks/checkup';
import { errorUtil, parseJSONWithDates } from '@/utils/helper';
import { FormObjectComponent } from '@/utils/form.component';
import { useCheckupFormStore, useDiagnosisFormStore, useTreatmentFormStore } from '@/stores/checkup.store';
import { useSession } from 'next-auth/react';
import { getReferences } from '@/server/hooks/reference';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { AbilityContext } from '@/layouts/components/acl/Can';
import Icon from '@/@core/components/icon';
import moment from 'moment';
import { getPatient } from '@/server/hooks/patient';
import { getClinic } from '@/server/hooks/clinic';
import { isEmpty } from 'lodash';

interface PatientGenderType {
  [key: string]: { icon: string; color: string };
}

const patientGenderObj: PatientGenderType = {
  male: { icon: 'mdi:gender-male', color: 'info.main' },
  female: { icon: 'mdi:gender-female', color: 'error.light' }
};

const CheckupInfoForm = ({ formId }: FormPropsType) => {
  const ability = useContext(AbilityContext);

  const { id, patientId, onClosing, onSaving, tabsValue, setTabsValue, tabsIsError, setTabsIsError } =
    useCheckupFormStore();

  const { data: session, status } = useSession();

  const checkupData = getCheckup({ id });
  const clinicData = getClinic({ id: session?.user.clinicId });
  const patientData = getPatient({ id: patientId });
  const { data: referencesData } = getReferences({ entities: [11, 9] });

  const { mutate: postCheckupMutate, isLoading: postCheckupIsLoading } = postCheckup();

  const defaultValues = {
    patientId: patientId,
    physicianId: 0,
    receptionistId: session?.user.id,
    clinicId: session?.user.clinicId,
    vitalSigns: {
      t: 0,
      p: 0,
      r: 0,
      bp: '',
      wt: 0,
      ht: 0,
      cbg: 0
    },
    diagnoses: null,
    treatments: null,
    dietaryAdviseGiven: 'N/A',
    followUp: null,
    statusId: 0
  };

  const {
    data: diagnoses,
    showDialog: showDialogDiagnosis,
    add: addDiagnosis,
    onEdit: onEditDiagnosis,
    remove: removeDiagnosis,
    clear: clearDiagnoses,
    replaceAll: replaceAllDiagnoses
  } = useDiagnosisFormStore();

  const {
    data: treatments,
    showDialog: showDialogTreatment,
    add: addTreatment,
    onEdit: onEditTreatment,
    remove: removeTreatment,
    clear: clearTreatments,
    replaceAll: replaceAllTreatments
  } = useTreatmentFormStore();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    setError,
    formState: { errors }
  } = useForm<CheckupDtoSchemaType>({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(checkupDtoSchema)
  });

  const {
    control: diagnosisControl,
    handleSubmit: diagnosisHandleSubmit,
    reset: diagnosisReset,
    formState: { errors: diagnosisErrors }
  } = useForm<DiagnosisDtoSchemaType>({
    defaultValues: {
      name: ''
    },
    mode: 'onChange',
    resolver: zodResolver(diagnosisDtoSchema)
  });

  const {
    control: treatmentControl,
    handleSubmit: treatmentHandleSubmit,
    reset: TreatmentReset,
    formState: { errors: treatmentErrors }
  } = useForm<TreatmentDtoSchemaType>({
    defaultValues: {
      medicineId: 0,
      signa: '',
      quantity: 0
    },
    mode: 'onChange',
    resolver: zodResolver(treatmentDtoSchema)
  });

  const CHECKUP_HEADER_PANEL = ['General'] as const;
  const CHECKUP_HEADER_FIELDS: Record<
    (typeof CHECKUP_HEADER_PANEL)[number],
    FormControlPropsType<CheckupUnionFieldType>[]
  > = {
    General: [
      {
        label: 'Physician',
        dbField: 'physicianId',
        type: 'dropDownNonEntityReference',
        required: true,
        extendedProps: {
          gridAttribute: { xs: 5, mt: 5, ml: 'auto' },
          dropDownAttribute: {
            disabled:
              ability.cannot('update', 'checkup-vital-signs') ||
              (id !== 0 && checkupData?.receptionistId !== session?.user.id)
          },
          dropDownNonEntityReferenceAttribute: {
            data:
              clinicData && clinicData.profile.length > 0
                ? clinicData.profile
                    .filter(({ user: { role } }) => role.code !== 'admin' && role.code === 'physician')
                    .map(p => p.user)
                : [],
            dataIsloading: status === 'loading',
            menuItemTextPath: ['lastName', 'firstName']
          }
        }
      }
    ]
  };

  const CHECKUP_PANELS = ['vitalSigns', 'dietaryAdviseFollowup'] as const;
  const CHECKUP_FIELDS: Record<(typeof CHECKUP_PANELS)[number], FormControlPropsType<CheckupUnionFieldType>[]> = {
    vitalSigns: [
      {
        label: 'T',
        dbField: 'vitalSigns.t',
        type: 'textField',
        required: true,
        extendedProps: {
          gridAttribute: { xs: 12, md: 6, lg: 4 },
          textFieldAttribute: {
            type: 'number',
            disabled: ability.cannot('update', 'checkup-vital-signs'),
            inputProps: { min: 0, step: '0.01' },
            InputProps: {
              endAdornment: <InputAdornment position='end'>°C</InputAdornment>
            }
          }
        }
      },
      {
        label: 'BP',
        dbField: 'vitalSigns.bp',
        type: 'textField',
        required: true,
        extendedProps: {
          gridAttribute: { xs: 12, md: 6, lg: 4 },
          textFieldAttribute: {
            disabled: ability.cannot('update', 'checkup-vital-signs'),
            InputProps: {
              endAdornment: <InputAdornment position='end'>mmHg</InputAdornment>
            }
          }
        }
      },
      {
        label: 'CBG',
        dbField: 'vitalSigns.cbg',
        type: 'textField',
        required: true,
        extendedProps: {
          gridAttribute: { xs: 12, md: 6, lg: 4 },
          textFieldAttribute: {
            type: 'number',
            disabled: ability.cannot('update', 'checkup-vital-signs'),
            inputProps: { min: 0, step: '0.01' },
            InputProps: {
              endAdornment: <InputAdornment position='end'>mg/dL</InputAdornment>
            }
          }
        }
      },
      {
        label: 'P',
        dbField: 'vitalSigns.p',
        type: 'textField',
        required: true,
        extendedProps: {
          gridAttribute: { xs: 12, md: 6, lg: 4 },
          textFieldAttribute: {
            type: 'number',
            disabled: ability.cannot('update', 'checkup-vital-signs'),
            inputProps: { min: 0, step: '0.01' },
            InputProps: {
              endAdornment: <InputAdornment position='end'>bpm</InputAdornment>
            }
          }
        }
      },
      {
        label: 'WT',
        dbField: 'vitalSigns.wt',
        type: 'textField',
        required: true,
        extendedProps: {
          gridAttribute: { xs: 12, md: 6, lg: 4 },
          textFieldAttribute: {
            type: 'number',
            disabled: ability.cannot('update', 'checkup-vital-signs'),
            inputProps: { min: 0, step: '0.01' },
            InputProps: {
              endAdornment: <InputAdornment position='end'>kg</InputAdornment>
            }
          }
        }
      },
      {
        label: 'HT',
        dbField: 'vitalSigns.ht',
        type: 'textField',
        required: true,
        extendedProps: {
          gridAttribute: { xs: 12, md: 6, lg: 4 },
          textFieldAttribute: {
            type: 'number',
            disabled: ability.cannot('update', 'checkup-vital-signs'),
            inputProps: { min: 0, step: '0.01' },
            InputProps: {
              endAdornment: <InputAdornment position='end'>cm</InputAdornment>
            }
          }
        }
      },
      {
        label: 'R',
        dbField: 'vitalSigns.r',
        type: 'textField',
        required: true,
        extendedProps: {
          gridAttribute: { xs: 12, md: 6, lg: 4 },
          textFieldAttribute: {
            type: 'number',
            disabled: ability.cannot('update', 'checkup-vital-signs'),
            inputProps: { min: 0, step: '0.01' },
            InputProps: {
              endAdornment: <InputAdornment position='end'>bpm</InputAdornment>
            }
          }
        }
      }
    ],
    dietaryAdviseFollowup: [
      {
        label: 'Dietary Advise Given',
        dbField: 'dietaryAdviseGiven',
        type: 'textField',
        extendedProps: {
          textFieldAttribute: { multiline: true, rows: 5 },
          gridAttribute: { xs: 12 }
        }
      },
      {
        label: 'Follow Up',
        dbField: 'followUp',
        type: 'datePicker',
        extendedProps: {
          gridAttribute: { xs: 4 },
          reactDatePickerAttribute: { minDate: moment(new Date()).add(1, 'day').toDate() }
        }
      }
    ]
  };

  const DIAGNOSIS_PANEL = ['diagnosis'] as const;
  const DIAGNOSIS_FIELDS: Record<(typeof DIAGNOSIS_PANEL)[number], FormControlPropsType<DiagnosisUnionFieldType>[]> = {
    diagnosis: [
      {
        label: 'Diagnosis',
        dbField: 'name',
        type: 'textField',
        autoFocus: true,
        required: true,
        extendedProps: {
          gridAttribute: { flex: 3 }
        }
      }
    ]
  };

  const TREATMENT_PANEL = ['treatment'] as const;
  const TREATMENT_FIELDS: Record<(typeof TREATMENT_PANEL)[number], FormControlPropsType<TreatmentUnionFieldType>[]> = {
    treatment: [
      {
        label: 'Treatment',
        dbField: 'medicineId',
        required: true,
        type: 'dropDown',
        entityId: 9,
        extendedProps: { gridAttribute: { xs: 12 } }
      },
      {
        label: 'Signa',
        dbField: 'signa',
        type: 'textField',
        required: true,
        extendedProps: { gridAttribute: { xs: 10 } }
      },
      {
        label: 'Quantity',
        dbField: 'quantity',
        type: 'textField',
        required: true,
        extendedProps: {
          textFieldAttribute: { type: 'number', inputProps: { min: 1 } },
          gridAttribute: { xs: 2 }
        }
      }
    ]
  };

  const handleClose = () => {
    reset();
    clearDiagnoses();
    clearTreatments();
    onClosing();
    setTabsValue('1');
  };

  const diagnosisOnSubmit: SubmitHandler<DiagnosisDtoSchemaType> = (data: DiagnosisDtoSchemaType) => {
    addDiagnosis(data);
    diagnosisReset();
  };

  const treatmentOnSubmit: SubmitHandler<TreatmentDtoSchemaType> = (data: TreatmentDtoSchemaType) => {
    addTreatment(data);
    TreatmentReset();
  };

  const onSubmit: SubmitHandler<CheckupDtoSchemaType> = (data: CheckupDtoSchemaType) => {
    if (id && ability.can('create', 'checkup')) {
      if (diagnoses.length < 1 || treatments.length < 1) {
        if (diagnoses.length < 1)
          setError('diagnoses', { type: 'custom', message: 'Please enter atleast one diagnosis.' });
        if (treatments.length < 1)
          setError('treatments', { type: 'custom', message: 'Please enter atleast one treatment.' });
        return;
      }
    }

    postCheckupMutate(
      {
        params: { id, module: 'Checkup' },
        body: data
      },
      {
        onSuccess: data => {
          handleClose();
          toast.success(data.message);
        },
        onError: err => {
          const { status, message } = errorUtil(err);

          if (status === 'CONFLICT' || status === 'ERROR') {
            handleClose();
            toast.error(message);
          }
        }
      }
    );
  };

  const renderTabs = () => {
    const tabs = [
      <Tab key='1' value='1' label='VITAL SIGNS' />,
      <Tab key='2' value='2' label='CC/DIAGNOSIS' />,
      <Tab key='3 ' value='3' label='TREATMENT' />,
      <Tab key='4' value='4' label='DIETARY ADVISE & FOLLOW UP' />
    ];
    return tabs.map(tab => tab);
  };

  useEffect(() => {
    setValue('diagnoses', diagnoses);
  }, [isDeepEqual(getValues('diagnoses'), diagnoses)]);

  useEffect(() => {
    setValue('treatments', treatments);
  }, [isDeepEqual(getValues('treatments'), treatments)]);

  useEffect(() => {
    if (referencesData && referencesData.length > 0 && !id) {
      setValue('statusId', referencesData.filter(ref => ref.entityId === 11).find(ref => ref.isDefault)!.id);
    }
  }, [referencesData]);

  useEffect(() => {
    onSaving(postCheckupIsLoading);
  }, [postCheckupIsLoading]);

  useEffect(() => {
    if (id && checkupData) {
      const { patient, physician, receptionist, status, createdAt, ...data } = checkupData;

      const JSONWithDatesData = parseJSONWithDates(JSON.stringify(data));
      reset({
        ...JSONWithDatesData,
        ...(ability.can('create', 'checkup') && {
          statusId: referencesData?.filter(ref => ref.entityId === 11).find(ref => ref.code === 'completed')?.id
        })
      });
      replaceAllDiagnoses(JSONWithDatesData.diagnoses);
      replaceAllTreatments(JSONWithDatesData.treatments);
    }
  }, [id, checkupData, referencesData]);

  return (
    <Box>
      <form id={formId} onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item>
            {patientData && (
              <ListItemText
                primary={`${patientData.firstName} ${patientData?.lastName}`}
                primaryTypographyProps={{
                  fontWeight: 600,
                  variant: 'h6',
                  color: 'text.primary'
                }}
                secondary={
                  <Box
                    component='span'
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      '& svg': { color: patientGenderObj[patientData.gender.code].color }
                    }}
                  >
                    <Icon icon={patientGenderObj[patientData.gender.code].icon} fontSize={25} /> &nbsp;
                    {patientData?.gender.name} • {patientData?.age} yrs old •{' '}
                    {moment(patientData?.dateOfBirth).format('LL')}
                  </Box>
                }
              />
            )}

            {checkupData && (
              <ListItemText
                primary={`${checkupData.patient?.firstName} ${checkupData.patient?.lastName}`}
                primaryTypographyProps={{
                  fontWeight: 600,
                  variant: 'h6',
                  color: 'text.primary'
                }}
                secondary={
                  <Box
                    component='span'
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      '& svg': { color: patientGenderObj[checkupData.patient.gender.code].color }
                    }}
                  >
                    <Icon icon={patientGenderObj[checkupData.patient.gender.code].icon} fontSize={25} /> &nbsp;
                    {checkupData.patient.gender.name} • {checkupData.patient.age} yrs old •{' '}
                    {moment(checkupData.patient?.dateOfBirth).format('LL')}
                  </Box>
                }
              />
            )}
          </Grid>

          {CHECKUP_HEADER_FIELDS['General'].map((obj, i) => (
            <Grid item key={obj.dbField} {...obj.extendedProps?.gridAttribute}>
              <FormObjectComponent
                key={i}
                objFieldProp={obj}
                control={control}
                errors={errors}
                getValues={getValues}
                setValue={setValue}
              />
            </Grid>
          ))}

          <Grid item xs={12} mt={3}>
            <TabContext value={tabsValue}>
              <TabList
                sx={{ ...(!isEmpty(errors) && { color: theme => theme.palette.error.main }) }}
                textColor={!isEmpty(errors) ? 'inherit' : undefined}
                TabIndicatorProps={{
                  ...(!isEmpty(errors) && { sx: { backgroundColor: theme => theme.palette.error.main } })
                }}
                onChange={(e: SyntheticEvent<Element>, newValue: string) => setTabsValue(newValue)}
              >
                {ability && ability.can('create', 'checkup-vital-signs') && <Tab value='1' label='VITAL SIGNS' />}
                {ability && ability.can('create', 'checkup') && renderTabs()}
              </TabList>

              <TabPanel value='1' sx={{ pb: 0, px: 0 }}>
                <Grid item container spacing={5} mt={1}>
                  {CHECKUP_FIELDS['vitalSigns'].map((obj, i) => (
                    <Grid item key={obj.dbField} {...obj.extendedProps?.gridAttribute}>
                      <FormObjectComponent key={i} objFieldProp={obj} control={control} errors={errors} />
                    </Grid>
                  ))}
                </Grid>
              </TabPanel>

              {ability && ability.can('create', 'checkup') && (
                <>
                  <TabPanel value='2' sx={{ pb: 0, px: 0 }}>
                    <Grid container mt={1}>
                      {DIAGNOSIS_FIELDS['diagnosis'].map((obj, i) => (
                        <Grid item key={obj.dbField} {...obj.extendedProps?.gridAttribute}>
                          <FormObjectComponent
                            key={i}
                            objFieldProp={obj}
                            control={diagnosisControl}
                            errors={diagnosisErrors}
                          />
                        </Grid>
                      ))}

                      <Grid item>
                        <IconButton
                          form='form-diagnosis-normal'
                          color='primary'
                          onClick={diagnosisHandleSubmit(diagnosisOnSubmit)}
                        >
                          <Icon icon='mdi:plus-circle' fontSize={45} />
                        </IconButton>
                      </Grid>
                    </Grid>

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
                            <ListItem
                              key={i}
                              sx={{ px: 1 }}
                              secondaryAction={
                                <Grid item>
                                  <IconButton type='button' color='secondary' onClick={() => onEditDiagnosis(i)}>
                                    <Icon icon='mdi:pencil-outline' fontSize={20} />
                                  </IconButton>
                                  <IconButton type='button' color='secondary' onClick={() => removeDiagnosis(i)}>
                                    <Icon icon='mdi:delete-outline' fontSize={20} />
                                  </IconButton>
                                </Grid>
                              }
                            >
                              <ListItemText
                                sx={{ m: 0, width: '50%' }}
                                primary={diagnosis.name}
                                primaryTypographyProps={{ sx: { fontWeight: 600, color: 'text.primary' } }}
                              />
                            </ListItem>
                          ))}
                      </List>
                    </Paper>

                    <FormHelperText sx={{ color: 'error.main', marginTop: 1, marginX: 4 }}>
                      {diagnoses.length < 1 && errors['diagnoses']?.message}
                    </FormHelperText>
                  </TabPanel>

                  <TabPanel value='3' sx={{ pb: 0, px: 0 }}>
                    <Grid container mt={1} alignItems='center'>
                      <Grid item container spacing={2} flex={3}>
                        {TREATMENT_FIELDS['treatment'].map((obj, i) => (
                          <Grid item key={obj.dbField} {...obj.extendedProps?.gridAttribute}>
                            <FormObjectComponent
                              key={i}
                              objFieldProp={obj}
                              control={treatmentControl}
                              errors={treatmentErrors}
                            />
                          </Grid>
                        ))}
                      </Grid>

                      <Grid item>
                        <IconButton
                          form='form-treatment-normal'
                          type='submit'
                          color='primary'
                          onClick={treatmentHandleSubmit(treatmentOnSubmit)}
                        >
                          <Icon icon='mdi:plus-circle' fontSize={45} />
                        </IconButton>
                      </Grid>
                    </Grid>

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
                            <ListItem
                              key={i}
                              sx={{ px: 1 }}
                              secondaryAction={
                                <Grid item>
                                  <IconButton type='button' color='secondary' onClick={() => onEditTreatment(i)}>
                                    <Icon icon='mdi:pencil-outline' fontSize={20} />
                                  </IconButton>
                                  <IconButton type='button' color='secondary' onClick={() => removeTreatment(i)}>
                                    <Icon icon='mdi:delete-outline' fontSize={20} />
                                  </IconButton>
                                </Grid>
                              }
                            >
                              <ListItemText
                                sx={{ m: 0, width: '50%' }}
                                primary={`[${treatment.quantity}x] ${
                                  referencesData
                                    ?.filter(ref => ref.entityId === 9)
                                    .find(medicine => medicine.id === treatment.medicineId)?.name
                                }`}
                                primaryTypographyProps={{ sx: { fontWeight: 600, color: 'text.primary' } }}
                                secondary={treatment.signa}
                              />
                            </ListItem>
                          ))}
                      </List>
                    </Paper>

                    <FormHelperText sx={{ color: 'error.main', marginTop: 1, marginX: 4 }}>
                      {treatments.length < 1 && errors['treatments']?.message}
                    </FormHelperText>
                  </TabPanel>

                  <TabPanel value='4' sx={{ pb: 0, px: 0 }}>
                    <Grid container rowGap={2}>
                      {CHECKUP_FIELDS['dietaryAdviseFollowup'].map((obj, i) => (
                        <Grid item key={obj.dbField} {...obj.extendedProps?.gridAttribute}>
                          <FormObjectComponent key={i} objFieldProp={obj} control={control} errors={errors} />
                        </Grid>
                      ))}
                    </Grid>
                  </TabPanel>
                </>
              )}
            </TabContext>
          </Grid>
        </Grid>
      </form>

      {showDialogDiagnosis ? <EditDiagnosisDialog /> : null}
      {showDialogTreatment ? <EditTreatmentDialog /> : null}
    </Box>
  );
};

// Dialogs
type PropsType = {
  maxWidth?: Breakpoint;
};

const EditDiagnosisDialog: FC<PropsType> = ({ maxWidth }) => {
  const { id, data: diagnoses, dialogTitle, showDialog, edit, onClosing } = useDiagnosisFormStore();

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<DiagnosisDtoSchemaType>({
    defaultValues: { name: '' },
    mode: 'onChange',
    resolver: zodResolver(diagnosisDtoSchema)
  });

  const DIAGNOSIS_PANEL = ['diagnosis'] as const;
  const DIAGNOSIS_FIELD: Record<(typeof DIAGNOSIS_PANEL)[number], FormControlPropsType<DiagnosisUnionFieldType>[]> = {
    diagnosis: [
      {
        label: 'Diagnosis',
        dbField: 'name',
        type: 'textField',
        autoFocus: true,
        required: true,
        extendedProps: { gridAttribute: { xs: 12 } }
      }
    ]
  };

  const editDiagnosisOnSubmit: SubmitHandler<DiagnosisDtoSchemaType> = data => {
    edit(id, data);
    onClosing();
  };

  const handleClose = () => {
    onClosing();
    reset();
  };

  useEffect(() => {
    reset({ ...diagnoses.at(id) });
  }, [id]);

  return (
    <Dialog open={showDialog} maxWidth={maxWidth ? maxWidth : 'md'} fullWidth>
      <form onSubmit={handleSubmit(editDiagnosisOnSubmit)}>
        <DialogTitle textAlign='center'>{dialogTitle} Diagnosis</DialogTitle>
        <DialogContent dividers>
          <Grid container alignItems='center'>
            {DIAGNOSIS_FIELD['diagnosis'].map((obj, i) => (
              <Grid item key={obj.dbField} {...obj.extendedProps?.gridAttribute}>
                <FormObjectComponent key={i} objFieldProp={obj} control={control} errors={errors} />
              </Grid>
            ))}
          </Grid>

          <DialogActions
            sx={{
              px: 0,
              pb: 0,
              pt: theme => `${theme.spacing(5)} !important`
            }}
          >
            <Button variant='outlined' color='secondary' onClick={() => handleClose()}>
              Cancel
            </Button>
            <Button type='submit' variant='contained'>
              Submit
            </Button>
          </DialogActions>
        </DialogContent>
      </form>
    </Dialog>
  );
};

const EditTreatmentDialog: FC<PropsType> = ({ maxWidth }) => {
  const { id, data: treatments, dialogTitle, showDialog, edit, onClosing } = useTreatmentFormStore();

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<TreatmentDtoSchemaType>({
    defaultValues: { medicineId: 0, signa: '' },
    mode: 'onChange',
    resolver: zodResolver(treatmentDtoSchema)
  });

  const TREATMENT_PANEL = ['treatment'] as const;
  const TREATMENT_FIELDS: Record<(typeof TREATMENT_PANEL)[number], FormControlPropsType<TreatmentUnionFieldType>[]> = {
    treatment: [
      {
        label: 'Treatment',
        dbField: 'medicineId',
        required: true,
        type: 'dropDown',
        entityId: 9,
        extendedProps: { gridAttribute: { xs: 12 } }
      },
      {
        label: 'Signa',
        dbField: 'signa',
        type: 'textField',
        required: true,
        extendedProps: { gridAttribute: { xs: 10 } }
      },
      {
        label: 'Quantity',
        dbField: 'quantity',
        type: 'textField',
        required: true,
        extendedProps: {
          textFieldAttribute: { type: 'number', inputProps: { min: 1 } },
          gridAttribute: { xs: 2 }
        }
      }
    ]
  };

  const editTreatmentOnSubmit: SubmitHandler<TreatmentDtoSchemaType> = data => {
    edit(id, data);
    onClosing();
  };

  const handleClose = () => {
    onClosing();
    reset();
  };

  useEffect(() => {
    reset({ ...treatments.at(id) });
  }, [id]);

  return (
    <Dialog open={showDialog} maxWidth={maxWidth ? maxWidth : 'md'} fullWidth>
      <form onSubmit={handleSubmit(editTreatmentOnSubmit)}>
        <DialogContent>
          <DialogTitle textAlign='center'>{dialogTitle} Diagnosis</DialogTitle>

          <Grid container alignItems='center'>
            <Grid item container spacing={2} flex={3}>
              {TREATMENT_FIELDS['treatment'].map((obj, i) => (
                <Grid item key={obj.dbField} {...obj.extendedProps?.gridAttribute}>
                  <FormObjectComponent key={i} objFieldProp={obj} control={control} errors={errors} />
                </Grid>
              ))}
            </Grid>
          </Grid>

          <DialogActions
            sx={{
              px: 0,
              pb: 0,
              pt: theme => `${theme.spacing(5)} !important`
            }}
          >
            <Button variant='outlined' color='secondary' onClick={() => handleClose()}>
              Cancel
            </Button>
            <Button type='submit' variant='contained'>
              Submit
            </Button>
          </DialogActions>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default CheckupInfoForm;
