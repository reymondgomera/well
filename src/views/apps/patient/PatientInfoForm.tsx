import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Divider,
  Grid,
  IconButton,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Paper,
  ListItemText,
  List,
  ListItem,
  useTheme,
  DialogTitle
} from '@mui/material';

import { toast } from 'react-hot-toast';
import { useForm, SubmitHandler } from 'react-hook-form';
import { AgeFromDate } from 'age-calculator';
import moment from 'moment';
import { zodResolver } from '@hookform/resolvers/zod';

import StepperWrapper from '@/@core/styles/mui/stepper';
import StepperCustomDot from '@/views/forms/form-wizard/StepperCustomDot';
import Icon from '@/@core/components/icon';

import {
  MedicationDtoSchemaType,
  MedicationUnionFieldType,
  patientDtoSchema,
  PatientDtoSchemaType,
  PatientUnionFieldType
} from '@/server/schema/patient';
import { FormControlPropsType, FormPropsType } from '@/utils/common.type';
import { errorUtil, parseJSONWithDates } from '@/utils/helper';
import { CleaveInput, FormObjectComponent, ListItemTextData, ListItemTextType } from '@/utils/form.component';
import { getReferences } from '@/server/hooks/reference';
import { useMedicationFormStore, usePatientFormStore } from '@/stores/patient.store';
import { getPatient, postPatient } from '@/server/hooks/patient';
import { medicationDtoSchema } from '@/server/schema/patient';

const PatientInfoForm = ({ formId }: FormPropsType) => {
  const theme = useTheme();
  const { data: referencesData } = getReferences({ entities: [1, 2, 3, 10] });

  const { id, onClosing, onSaving, isSaving, dialogTitle, steps, activeStep, setActiveStep } = usePatientFormStore();

  const { medications, add, remove, clear, replaceAll } = useMedicationFormStore();
  const { mutate: postPatientMutate, isLoading: postPatientIsLoading } = postPatient();
  const patientData = getPatient({ id });

  const defaultValues = {
    firstName: '',
    lastName: '',
    middleInitial: '',
    address: '',
    dateOfBirth: new Date(''),
    civilStatusId: 0,
    age: 0,
    occupationId: 0,
    genderId: 0,
    contactNumber: 'N/A',
    familyHistory: {
      diseases: [],
      others: 'N/A'
    },
    personalHistory: {
      smoking: 0,
      alcohol: 0,
      currentHealthCondition: 'N/A',
      medications: []
    },
    pastMedicalHistory: {
      hospitalized: 'N/A',
      injuries: 'N/A',
      surgeries: 'N/A',
      allergies: 'N/A',
      measles: 'N/A',
      chickenPox: 'N/A',
      others: 'N/A'
    },
    obGyne: {
      menstrualCycle: null,
      days: 0,
      p: 0,
      g: 0
    }
  };

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors }
  } = useForm<PatientDtoSchemaType>({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(patientDtoSchema)
  });

  const {
    control: medicationControl,
    handleSubmit: medicationHandleSubmit,
    reset: medicationReset,
    formState: { errors: medicationErrors }
  } = useForm<MedicationDtoSchemaType>({
    defaultValues: {
      brandName: '',
      dosage: '',
      generic: ''
    },
    mode: 'onChange',
    resolver: zodResolver(medicationDtoSchema)
  });

  const PATIENT_PANELS = [
    'PersonalInformation',
    'FamilyHistory',
    'PersonalHistory',
    'PastMedicalHistory',
    'Obgyne'
  ] as const;

  const PATIENT_FIELDS: Record<(typeof PATIENT_PANELS)[number], FormControlPropsType<PatientUnionFieldType>[]> = {
    PersonalInformation: [
      {
        label: 'First Name',
        dbField: 'firstName',
        type: 'textField',
        required: true,
        extendedProps: { gridAttribute: { xs: 5 } }
      },
      {
        label: 'Last Name',
        dbField: 'lastName',
        type: 'textField',
        required: true,
        extendedProps: { gridAttribute: { xs: 5 } }
      },
      {
        label: 'Middle Initial',
        dbField: 'middleInitial',
        type: 'textField',
        required: true,
        extendedProps: { gridAttribute: { xs: 2 } }
      },
      {
        label: 'Address',
        dbField: 'address',
        type: 'textField',
        required: true,
        extendedProps: {
          gridAttribute: { xs: 12 },
          textFieldAttribute: { multiline: true, rows: 3 }
        }
      },
      {
        label: 'Date of Birth',
        dbField: 'dateOfBirth',
        type: 'datePicker',
        required: true,
        extendedProps: {
          gridAttribute: { xs: 12, md: 6, lg: 5 },
          reactDatePickerAttribute: {
            maxDate: new Date(),
            popperPlacement: 'bottom-start',
            placeholderText: 'MM/DD/YYYY',
            isClearable: true
          }
        }
      },
      {
        label: 'Age',
        dbField: 'age',
        type: 'textField',
        disabledErrors: true,
        extendedProps: {
          gridAttribute: { xs: 12, md: 6, lg: 2 },
          textFieldAttribute: {
            disabled: true,
            type: 'number',
            inputProps: { min: 0 }
          }
        }
      },
      {
        label: 'Civil Status',
        dbField: 'civilStatusId',
        type: 'dropDown',
        required: true,
        entityId: 3,
        extendedProps: {
          gridAttribute: { xs: 12, md: 6, lg: 5 }
        }
      },
      {
        label: 'Occupation',
        dbField: 'occupationId',
        type: 'dropDown',
        entityId: 2,
        extendedProps: {
          gridAttribute: { xs: 12, md: 6, lg: 5 }
        }
      },
      {
        label: 'Gender',
        dbField: 'genderId',
        type: 'dropDown',
        required: true,
        entityId: 1,
        extendedProps: {
          gridAttribute: { xs: 12, md: 6, lg: 2 }
        }
      },
      {
        label: 'Contact Number',
        dbField: 'contactNumber',
        type: 'textField',
        extendedProps: {
          gridAttribute: { xs: 12, md: 6, lg: 5 },
          textFieldAttribute: {
            InputProps: {
              inputComponent: CleaveInput
            },
            inputProps: {
              options: { phone: true, phoneRegionCode: 'PH' }
            }
          }
        }
      }
    ],
    FamilyHistory: [
      {
        label: 'Diseases',
        dbField: 'familyHistory.diseases',
        type: 'multi-checkbox',
        entityId: 10,
        extendedProps: {
          gridAttribute: { xs: 6, md: 4, lg: 3 }
        }
      },
      {
        label: 'Other',
        dbField: 'familyHistory.others',
        type: 'textField',
        extendedProps: {
          gridAttribute: { xs: 12 },
          textFieldAttribute: { multiline: true, rows: 5 }
        }
      }
    ],
    PersonalHistory: [
      {
        label: 'Smoking: (No. of sticks per day)',
        dbField: 'personalHistory.smoking',
        type: 'textField',
        extendedProps: {
          gridAttribute: { xs: 12 },
          textFieldAttribute: { type: 'number', inputProps: { min: 0 } }
        }
      },
      {
        label: 'Alcohol: (No. of years)',
        dbField: 'personalHistory.alcohol',
        type: 'textField',
        extendedProps: {
          gridAttribute: { xs: 12 },
          textFieldAttribute: { type: 'number', inputProps: { min: 0 } }
        }
      },
      {
        label: 'Present Health Condition',
        dbField: 'personalHistory.currentHealthCondition',
        type: 'textField',
        extendedProps: {
          gridAttribute: { xs: 12 }
        }
      }
    ],
    PastMedicalHistory: [
      {
        label: 'Have you ever been hospitalized? If yes, when and Why?',
        dbField: 'pastMedicalHistory.hospitalized',
        type: 'textField',
        extendedProps: {
          gridAttribute: {
            xs: 12,
            md: 6
          }
        }
      },
      {
        label: 'Have you had any serious injuries and/or broken bones? If yes, please specify.',
        dbField: 'pastMedicalHistory.injuries',
        type: 'textField',
        extendedProps: {
          gridAttribute: {
            xs: 12,
            md: 6
          }
        }
      },
      {
        label: 'Have you undergone any surgeries? If yes, please specify and when?',
        dbField: 'pastMedicalHistory.surgeries',
        type: 'textField',
        extendedProps: {
          gridAttribute: {
            xs: 12,
            md: 6
          }
        }
      },
      {
        label: 'Do you have any allergies? If yes, please specify.',
        dbField: 'pastMedicalHistory.allergies',
        type: 'textField',
        extendedProps: {
          gridAttribute: {
            xs: 12,
            md: 6
          }
        }
      },
      {
        label: 'Have you had measles?',
        dbField: 'pastMedicalHistory.measles',
        type: 'textField',
        extendedProps: {
          gridAttribute: {
            xs: 12,
            md: 6
          }
        }
      },
      {
        label: 'Have you had chicken pox?',
        dbField: 'pastMedicalHistory.chickenPox',
        type: 'textField',
        extendedProps: {
          gridAttribute: {
            xs: 12,
            md: 6
          }
        }
      },
      {
        label: 'Others',
        dbField: 'pastMedicalHistory.others',
        type: 'textField',
        extendedProps: {
          gridAttribute: {
            xs: 12
          },
          textFieldAttribute: { multiline: true, rows: 3 }
        }
      }
    ],
    Obgyne: [
      {
        label: 'Menstrual Cycle',
        dbField: 'obGyne.menstrualCycle',
        type: 'datePicker',
        required: true,
        extendedProps: { gridAttribute: { xs: 12, md: 6 } }
      },
      {
        label: 'Days',
        dbField: 'obGyne.days',
        type: 'textField',
        extendedProps: {
          gridAttribute: {
            xs: 12,
            md: 6
          },
          textFieldAttribute: { type: 'number', inputProps: { min: 0 } }
        }
      },
      {
        label: 'G (Gravida)',
        dbField: 'obGyne.g',
        type: 'textField',
        extendedProps: {
          gridAttribute: {
            xs: 12,
            md: 6
          },
          textFieldAttribute: { type: 'number', inputProps: { min: 0 } }
        }
      },
      {
        label: 'P (Para)',
        dbField: 'obGyne.p',
        type: 'textField',
        extendedProps: {
          gridAttribute: {
            xs: 12,
            md: 6
          },
          textFieldAttribute: { type: 'number', inputProps: { min: 0 } }
        }
      }
    ]
  };

  const REVIEW_PANELS: Record<(typeof PATIENT_PANELS)[number], ListItemTextType[]> = {
    PersonalInformation: [
      {
        listItemTextAttribute: {
          primary: 'First Name',
          primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
          secondary: getValues('firstName')
        },
        gridAttribute: { xs: 6, sm: 4, md: 3, lg: 2 }
      },
      {
        listItemTextAttribute: {
          primary: 'Last Name',
          primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
          secondary: getValues('lastName')
        },
        gridAttribute: { xs: 6, sm: 4, md: 3, lg: 2 }
      },
      {
        listItemTextAttribute: {
          primary: 'Middle Initial',
          primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
          secondary: getValues('middleInitial')
        },
        gridAttribute: { xs: 6, sm: 4, md: 3, lg: 2 }
      },
      {
        listItemTextAttribute: {
          primary: 'Date of Birth',
          primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
          secondary: moment(getValues('dateOfBirth')).format('L')
        },
        gridAttribute: { xs: 6, sm: 4, md: 3, lg: 2 }
      },
      {
        listItemTextAttribute: {
          primary: 'Age',
          primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
          secondary: getValues('age')
        },
        gridAttribute: { xs: 6, sm: 4, md: 3, lg: 2 }
      },
      {
        listItemTextAttribute: {
          primary: 'Gender',
          primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
          secondary: referencesData?.find(ref => ref.id === getValues('genderId'))?.name
        },
        gridAttribute: { xs: 6, sm: 4, md: 3, lg: 2 }
      },
      {
        listItemTextAttribute: {
          primary: 'Civil Status',
          primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
          secondary: referencesData?.find(ref => ref.id === getValues('civilStatusId'))?.name
        },
        gridAttribute: { xs: 6, sm: 4, md: 3, lg: 2 }
      },
      {
        listItemTextAttribute: {
          primary: 'Occupation',
          primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
          secondary:
            getValues('occupationId') !== 0
              ? referencesData?.find(ref => ref.id === getValues('occupationId'))?.name
              : 'N/A'
        },
        gridAttribute: { xs: 6, sm: 4, md: 3, lg: 2 }
      },
      {
        listItemTextAttribute: {
          primary: 'Contact Number',
          primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
          secondary: getValues('contactNumber')
        },
        gridAttribute: { xs: 6, sm: 4, md: 3, lg: 2 }
      },
      {
        listItemTextAttribute: {
          primary: 'Address',
          primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
          secondary: getValues('address')
        },
        gridAttribute: { xs: 12 }
      }
    ],
    FamilyHistory: referencesData!
      ?.filter(ref => ref.entityId === 10)
      .map(
        disease =>
          ({
            listItemTextAttribute: {
              primary: getValues('familyHistory.diseases').includes(disease.id) ? (
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
            secondary: getValues('familyHistory.others')
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
          primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
          secondary: getValues('personalHistory.smoking') ? getValues('personalHistory.smoking') : 0
        },
        gridAttribute: { xs: 4, lg: 2 }
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
          primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
          secondary: getValues('personalHistory.alcohol') ? getValues('personalHistory.alcohol') : 0
        },
        gridAttribute: { xs: 4, lg: 2 }
      },
      {
        listItemTextAttribute: {
          primary: 'Present Health Condition',
          primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
          secondary: getValues('personalHistory.currentHealthCondition')
            ? getValues('personalHistory.currentHealthCondition')
            : 'N/A'
        },
        gridAttribute: { xs: 4, lg: 2 }
      }
    ],
    PastMedicalHistory: [
      {
        listItemTextAttribute: {
          primary: 'Have you ever been hospitalized? If yes, when and Why?',
          primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
          secondary: getValues('pastMedicalHistory.hospitalized') ? getValues('pastMedicalHistory.hospitalized') : 'N/A'
        },
        gridAttribute: { xs: 12 }
      },
      {
        listItemTextAttribute: {
          primary: 'Have you had any serious injuries and/or broken bones? If yes, please specify.',
          primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
          secondary: getValues('pastMedicalHistory.injuries') ? getValues('pastMedicalHistory.injuries') : 'N/A'
        },
        gridAttribute: { xs: 12 }
      },
      {
        listItemTextAttribute: {
          primary: 'Have you undergone any surgeries? If yes, please specify and when?',
          primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
          secondary: getValues('pastMedicalHistory.surgeries') ? getValues('pastMedicalHistory.surgeries') : 'N/A'
        },
        gridAttribute: { xs: 12 }
      },
      {
        listItemTextAttribute: {
          primary: 'Do you have any allergies? If yes, please specify.',
          primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
          secondary: getValues('pastMedicalHistory.allergies') ? getValues('pastMedicalHistory.allergies') : 'N/A'
        },
        gridAttribute: { xs: 12 }
      },
      {
        listItemTextAttribute: {
          primary: 'Have you had measles?',
          primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
          secondary: getValues('pastMedicalHistory.measles') ? getValues('pastMedicalHistory.measles') : 'N/A'
        },
        gridAttribute: { xs: 12 }
      },
      {
        listItemTextAttribute: {
          primary: 'Have you had chicken pox?',
          primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
          secondary: getValues('pastMedicalHistory.chickenPox') ? getValues('pastMedicalHistory.chickenPox') : 'N/A'
        },
        gridAttribute: { xs: 12 }
      },
      {
        listItemTextAttribute: {
          primary: 'Others',
          primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
          secondary: getValues('pastMedicalHistory.others') ? getValues('pastMedicalHistory.others') : 'N/A'
        },
        gridAttribute: { xs: 12 }
      }
    ],
    Obgyne: [
      {
        listItemTextAttribute: {
          primary: 'Menstrual Cycle',
          primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
          secondary: getValues('obGyne.menstrualCycle') ? moment(getValues('obGyne.menstrualCycle')).format('L') : 'N/A'
        },
        gridAttribute: { xs: 6 }
      },
      {
        listItemTextAttribute: {
          primary: 'Days',
          primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
          secondary: getValues('obGyne.days') ? getValues('obGyne.days') : 0
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
          primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
          secondary: getValues('obGyne.g') ? getValues('obGyne.g') : 0
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
          primaryTypographyProps: { fontWeight: 600, variant: 'subtitle2', color: 'text.primary' },
          secondary: getValues('obGyne.p') ? getValues('obGyne.p') : 0
        },
        gridAttribute: { xs: 6 }
      }
    ]
  };

  const MEDICATION_PANEL = ['Medications'] as const;

  const MEDICATION_FIELDS: Record<(typeof MEDICATION_PANEL)[number], FormControlPropsType<MedicationUnionFieldType>[]> =
    {
      Medications: [
        {
          label: 'Brand Name',
          dbField: 'brandName',
          type: 'textField',
          required: true,
          extendedProps: {
            gridAttribute: { xs: 4 }
          }
        },
        {
          label: 'Generic',
          dbField: 'generic',
          type: 'textField',
          required: true,
          extendedProps: {
            gridAttribute: { xs: 3 }
          }
        },
        {
          label: 'Dosage',
          dbField: 'dosage',
          type: 'textField',
          required: true,
          extendedProps: {
            gridAttribute: { xs: 3 }
          }
        }
      ]
    };

  const handleNext = () => setActiveStep(activeStep + 1);
  const handleBack = () => setActiveStep(activeStep - 1);
  const handleClose = () => {
    onClosing();
    setActiveStep(0);
    clear();
    reset();
  };

  const medicationOnSubmit: SubmitHandler<MedicationDtoSchemaType> = (data: MedicationDtoSchemaType) => {
    medicationReset();
    add(data);
  };

  const onSubmit: SubmitHandler<PatientDtoSchemaType> = data => {
    postPatientMutate(
      { params: { id, module: 'Patient' }, body: data },
      {
        onSuccess: data => {
          setActiveStep(steps.length);
          reset();
          medicationReset();
          clear();
          toast.success(data.message);
        },
        onError: err => {
          const { status, message } = errorUtil(err);

          if (status === 'CONFLICT') toast.error(message);
          if (status === 'ERROR') {
            handleClose();
            toast.error(message);
          }
        }
      }
    );
  };

  const getLabelPropsError = (i: number) => {
    const labelProps: { error?: boolean } = {};

    if (i === activeStep) {
      labelProps.error = false;
      if (
        (errors.firstName ||
          errors.lastName ||
          errors.middleInitial ||
          errors.address ||
          errors.dateOfBirth ||
          errors.age ||
          errors.civilStatusId ||
          errors.occupationId ||
          errors.genderId) &&
        activeStep === 0
      ) {
        labelProps.error = true;
      } else {
        labelProps.error = false;
      }
    }

    return labelProps;
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <form key={0} id='form-step-0' onSubmit={handleSubmit(handleNext)} style={{ width: '100%' }}>
            <Grid container spacing={5}>
              {PATIENT_FIELDS['PersonalInformation'].map((obj, i) => (
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
            </Grid>
          </form>
        );

      case 1:
        return (
          <form key={1} id='form-step-1' onSubmit={handleSubmit(handleNext)} style={{ width: '100%' }}>
            <Grid container spacing={5}>
              {PATIENT_FIELDS['FamilyHistory'].map((obj, i) =>
                obj.type === 'multi-checkbox' ? (
                  <FormObjectComponent
                    key={i}
                    objFieldProp={obj}
                    control={control}
                    errors={errors}
                    getValues={getValues}
                    setValue={setValue}
                  />
                ) : (
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
                )
              )}
            </Grid>
          </form>
        );

      case 2:
        return (
          <form key={2} id='form-step-2' onSubmit={handleSubmit(handleNext)} style={{ width: '100%' }}>
            <Grid container spacing={6}>
              <Grid container item spacing={5} xs={12} md={6}>
                {PATIENT_FIELDS['PersonalHistory'].map((obj, i) => (
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
              </Grid>
              <Grid container item spacing={5} xs={12} md={6} alignItems='start'>
                <Grid item xs={12}>
                  <Typography variant='subtitle2' color='text.primary' fontWeight='600'>
                    Medication Taken Regularly
                  </Typography>
                </Grid>
                {MEDICATION_FIELDS['Medications'].map((obj, i) => (
                  <Grid item key={obj.dbField} {...obj.extendedProps?.gridAttribute}>
                    <FormObjectComponent
                      key={i}
                      objFieldProp={obj}
                      control={medicationControl}
                      errors={medicationErrors}
                    />
                  </Grid>
                ))}

                <Grid item xs={1} sx={{ p: 0 }}>
                  <IconButton color='primary' onClick={medicationHandleSubmit(medicationOnSubmit)}>
                    <Icon icon='material-symbols:add-circle' fontSize={45} />
                  </IconButton>
                </Grid>

                <Box display='flex' width='100%'>
                  <Paper
                    elevation={3}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                      height: 200,
                      mt: 2,
                      ml: 5,
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
                      {medications &&
                        medications.length > 0 &&
                        medications.map((medication, i) => (
                          <ListItem
                            key={i}
                            sx={{ px: 1 }}
                            secondaryAction={
                              <IconButton type='button' color='secondary' onClick={() => remove(i)}>
                                <Icon icon='mdi:delete-outline' fontSize={20} />
                              </IconButton>
                            }
                          >
                            <ListItemText
                              sx={{ m: 0, width: '50%' }}
                              primary={medication.brandName}
                              primaryTypographyProps={{
                                sx: { fontWeight: 600, color: 'text.primary' }
                              }}
                              secondary={medication.generic}
                            />
                            <ListItemText primary={medication.dosage} />
                          </ListItem>
                        ))}
                    </List>
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </form>
        );

      case 3:
        return (
          <form key={3} id='form-step-3' onSubmit={handleSubmit(handleNext)} style={{ width: '100%' }}>
            <Grid container spacing={5}>
              {PATIENT_FIELDS['PastMedicalHistory'].map((obj, i) => (
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
            </Grid>
          </form>
        );

      case 4:
        return (
          <form key={0} id='form-step-4' onSubmit={handleSubmit(handleNext)} style={{ width: '100%' }}>
            <Grid container spacing={5}>
              {PATIENT_FIELDS['Obgyne'].map((obj, i) => (
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
            </Grid>
          </form>
        );

      case 5:
        return (
          <>
            <Typography fontWeight='600'>{steps[0]}</Typography>
            <Divider sx={{ width: '100%' }} />
            <Grid container>
              {REVIEW_PANELS['PersonalInformation'].map((obj, i) => (
                <ListItemTextData key={i} {...obj} />
              ))}
            </Grid>
            <Typography fontWeight='600' mt={5}>
              {steps[1]}
            </Typography>
            <Divider sx={{ width: '100%' }} />
            <Grid container>
              {REVIEW_PANELS['FamilyHistory'].map((obj, i) => (
                <ListItemTextData key={i} {...obj} />
              ))}
            </Grid>
            <Typography fontWeight='600' mt={5}>
              {steps[2]}
            </Typography>
            <Divider sx={{ width: '100%' }} />
            <Grid container>
              {REVIEW_PANELS['PersonalHistory'].map((obj, i) => (
                <ListItemTextData key={i} {...obj} />
              ))}
              <Grid item xs={12} md={12} lg={6}>
                <Typography color='text.primary' fontWeight='600'>
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
                      {medications &&
                        medications.length > 0 &&
                        medications.map((medication, i) => (
                          <ListItem key={i} sx={{ px: 1 }}>
                            <ListItemText
                              sx={{ m: 0, width: '50%' }}
                              primary={medication.brandName}
                              primaryTypographyProps={{
                                sx: { fontWeight: 600, color: 'text.primary' }
                              }}
                              secondary={medication.generic}
                              secondaryTypographyProps={{ variant: 'body2' }}
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
            <Typography fontWeight='600' mt={5}>
              {steps[3]}
            </Typography>
            <Divider sx={{ width: '100%' }} />
            <Grid container>
              {REVIEW_PANELS['PastMedicalHistory'].map((obj, i) => (
                <ListItemTextData key={i} {...obj} />
              ))}
            </Grid>
            <Typography fontWeight='600' mt={5}>
              {steps[4]}
            </Typography>
            <Divider sx={{ width: '100%' }} />
            <Grid container>
              {REVIEW_PANELS['Obgyne'].map((obj, i) => (
                <ListItemTextData key={i} {...obj} />
              ))}
            </Grid>
          </>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    if (id && patientData) {
      const { occupation, gender, civilStatus, createdAt, updatedAt, ...data } = patientData;

      // solution tp problem - Prisma return Prisma.JsonValue type which is not match to my zod type or which ts can't infer the value type
      const JSONWithDatesData = parseJSONWithDates(JSON.stringify(data)) as PatientDtoSchemaType; // cast it to your desired type to have auto-complete
      reset(JSONWithDatesData);
      replaceAll(JSONWithDatesData.personalHistory.medications);
    }
  }, [id, patientData]);

  useEffect(() => {
    if (moment(getValues('dateOfBirth')).isValid()) setValue('age', new AgeFromDate(getValues('dateOfBirth')).age);
  }, [watch('dateOfBirth')]);

  useEffect(() => {
    setValue('personalHistory.medications', medications);
  }, [medications]);

  useEffect(() => {
    onSaving(postPatientIsLoading);
  }, [postPatientIsLoading]);

  const renderContent = () => {
    if (activeStep === steps.length) {
      return (
        <>
          <Typography variant='h5' textAlign='center' component='h2' fontWeight='600'>
            ACTION COMPLETED!
          </Typography>
          <Typography variant='subtitle2' textAlign='center'>
            Click "Again" button to add another patient health record.
          </Typography>
          <Grid container>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'end' }}>
              <Button onClick={() => handleClose()} sx={{ mr: 3 }}>
                Close
              </Button>

              <Button variant='contained' onClick={() => setActiveStep(0)}>
                Again
              </Button>
            </Grid>
          </Grid>
        </>
      );
    } else {
      return (
        <Grid container>
          <Grid item xs={12}>
            <Typography
              sx={{
                fontWeight: 600,
                color: theme.palette.primary.main,
                mb: 5
              }}
            >
              {steps[activeStep]}{' '}
              {steps[activeStep] === steps[steps.length - 1] && (
                <Typography variant='caption' ml={1}>
                  (All steps are completed! Please review all the details below.)
                </Typography>
              )}
            </Typography>
          </Grid>
          {getStepContent(activeStep)}
          <DialogActions
            sx={{
              display: 'flex',
              justifyContent: !id ? 'flex-end' : activeStep < 5 ? 'space-between' : 'flex-end',
              width: '100%',
              px: 0,
              pb: 0,
              pt: theme => `${theme.spacing(5)} !important`
            }}
          >
            {id && activeStep < 5 ? (
              <Box>
                <Button
                  form={`form-step-${activeStep}`}
                  variant='contained'
                  type='submit'
                  disabled={isSaving}
                  onClick={() => setActiveStep(5)}
                >
                  Edit
                </Button>
              </Box>
            ) : null}
            <Box>
              {activeStep === 0 ? (
                <Button onClick={() => handleClose()} sx={{ mr: 3 }}>
                  Cancel
                </Button>
              ) : (
                <Button onClick={handleBack} sx={{ mr: 3 }}>
                  Previous
                </Button>
              )}
              {activeStep === steps.length - 1 ? (
                <Button
                  form={`form-step-${activeStep}`}
                  variant='contained'
                  type='submit'
                  disabled={isSaving}
                  onClick={handleSubmit(onSubmit)}
                >
                  Submit
                </Button>
              ) : (
                <Button form={`form-step-${activeStep}`} variant='contained' type='submit' disabled={isSaving}>
                  Next
                </Button>
              )}
            </Box>
          </DialogActions>
        </Grid>
      );
    }
  };

  return (
    <>
      <DialogTitle textAlign='center'>
        <Box textAlign='left'>{dialogTitle} Patient Health Record</Box>
        <Divider style={{ margin: 0, paddingTop: 20 }} />
        <Box pt={5}>
          <StepperWrapper>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((title, i) => {
                return (
                  <Step key={i}>
                    <StepLabel {...getLabelPropsError(i)} StepIconComponent={StepperCustomDot}>
                      <Box className='step-label'>
                        <Box width={120}>
                          <Typography className='step-title'>{title}</Typography>
                        </Box>
                      </Box>
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </StepperWrapper>
        </Box>
      </DialogTitle>
      <DialogContent>
        <IconButton
          size='small'
          onClick={() => handleClose()}
          sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
        >
          <Icon icon='mdi:close' />
        </IconButton>
        <Box sx={{ mt: 5, px: 5 }}>{renderContent()}</Box>
      </DialogContent>
    </>
  );
};

export default PatientInfoForm;
