import { useEffect, FormEvent } from 'react';

import { Box, Divider, Grid, Typography } from '@mui/material';

import { useForm, SubmitHandler, UseFormHandleSubmit } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { FormControlPropsType, FormPropsType } from '@/utils/common.type';
import {
  physicianProfileDtoSchema,
  PhysicianProfileDtoSchemaType,
  PhysicianProfileUnionFieldType,
  receptionistProfileDtoSchema,
  ReceptionistProfileDtoSchemaType,
  ReceptionistProfileUnionFieldType,
  userDtoSchema,
  UserDtoSchemaType,
  UserUnionFieldType
} from '@/server/schema/user';
import { getUser, postUser } from '@/server/hooks/user';
import { errorUtil } from '@/utils/helper';
import { CleaveInput, FormObjectComponent } from '@/utils/form.component';
import { useUserFormStore } from '@/stores/user.store';
import { getReferences } from '@/server/hooks/reference';
import { getClinics } from '@/server/hooks/clinic';

const UserInfoForm = ({ formId }: FormPropsType) => {
  const { id, onClosing, onSaving } = useUserFormStore();

  const userData = getUser({ id });
  const { data: referencesData } = getReferences({ entities: [6, 8] });
  const { data: clinicData, isLoading: clinicDataIsLoading } = getClinics();

  const defaultValues = {
    firstName: '',
    lastName: '',
    middleInitial: '',
    userName: '',
    email: '',
    password: '',
    departmentId: 0,
    roleId: 0,
    statusId: 0,
    profile: {
      roleProfile: {},
      clinics: []
    }
  };

  const { mutate: postUserMutate, isLoading: postUserIsLoading } = postUser();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors }
  } = useForm<UserDtoSchemaType>({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(userDtoSchema)
  });

  const {
    control: physicianProfileControl,
    handleSubmit: physicianProfileHandleSubmit,
    reset: physicianProfileReset,
    setValue: physicianProfileSetValue,
    getValues: physicianProfileGetValues,
    formState: { errors: physicianProfileErrors }
  } = useForm<PhysicianProfileDtoSchemaType>({
    defaultValues: {
      qualification: '',
      specialistIn: '',
      specializedTreatment: '',
      languages: [],
      yearOfExp: 0,
      licenseNumber: 0,
      deaNumber: '',
      ptrNumber: 0,
      address: '',
      contactNumber: []
    },
    mode: 'onChange',
    resolver: zodResolver(physicianProfileDtoSchema)
  });

  const {
    control: receptionistProfileControl,
    handleSubmit: receptionistProfileHandleSubmit,
    reset: receptionistProfileReset,
    setValue: receptionistProfileSetValue,
    getValues: receptionistProfileGetValues,
    formState: { errors: receptionistProfileErrors }
  } = useForm<ReceptionistProfileDtoSchemaType>({
    defaultValues: {
      address: '',
      contactNumber: ''
    },
    mode: 'onChange',
    resolver: zodResolver(receptionistProfileDtoSchema)
  });

  const USER_PANEL = ['General'] as const;
  const USER_FIELDS: Record<(typeof USER_PANEL)[number], FormControlPropsType<UserUnionFieldType>[]> = {
    General: [
      {
        label: 'First Name',
        dbField: 'firstName',
        type: 'textField',
        required: true,
        extendedProps: { gridAttribute: { xs: 12, md: 5 } }
      },
      {
        label: 'Last Name',
        dbField: 'lastName',
        type: 'textField',
        required: true,
        extendedProps: { gridAttribute: { xs: 12, md: 5 } }
      },
      {
        label: 'Middle Initial',
        dbField: 'middleInitial',
        type: 'textField',
        required: true,
        extendedProps: { gridAttribute: { xs: 12, md: 2 } }
      },
      {
        label: 'User Name',
        dbField: 'userName',
        type: 'textField',
        required: true,
        extendedProps: { gridAttribute: { xs: 12 } }
      },
      {
        label: 'Email',
        dbField: 'email',
        type: 'textField',
        required: true,
        extendedProps: { gridAttribute: { xs: 12 } }
      },
      {
        label: 'Password',
        dbField: 'password',
        type: 'textField',
        required: true,
        extendedProps: {
          gridAttribute: { xs: 12 },
          textFieldAttribute: { type: 'password' }
        }
      },
      {
        label: 'Roles',
        dbField: 'roleId',
        type: 'dropDown',
        entityId: 6,
        extendedProps: { gridAttribute: { xs: 12, md: 6 } }
      },
      {
        label: 'Department',
        dbField: 'departmentId',
        type: 'dropDown',
        entityId: 7,
        extendedProps: { gridAttribute: { xs: 12, md: 6 } }
      },
      {
        label: 'Clinic',
        dbField: 'profile.clinics',
        type: 'dropDownNonEntityReference',
        required: true,
        extendedProps: {
          gridAttribute: { xs: 12 },
          dropDownAttribute: {
            multiple: true
          },
          dropDownNonEntityReferenceAttribute: {
            data: clinicData && clinicData.length > 0 ? clinicData : [],
            dataIsloading: clinicDataIsLoading,
            menuItemTextPath: ['name']
          }
        }
      }
    ]
  };

  const PHYSICIAN_PROFILE_PANEL = ['General'] as const;
  const PHYSICIAN_PROFILE_FIELDS: Record<
    (typeof PHYSICIAN_PROFILE_PANEL)[number],
    FormControlPropsType<PhysicianProfileUnionFieldType>[]
  > = {
    General: [
      {
        label: 'Qualification',
        dbField: 'qualification',
        type: 'textField',
        required: true,
        extendedProps: { gridAttribute: { xs: 12, md: 6 } }
      },
      {
        label: 'Specialist In',
        dbField: 'specialistIn',
        type: 'textField',
        required: true,
        extendedProps: { gridAttribute: { xs: 12, md: 6 } }
      },
      {
        label: 'Specialized Treatment',
        dbField: 'specializedTreatment',
        type: 'textField',
        required: true,
        extendedProps: { gridAttribute: { xs: 12, md: 6 } }
      },
      {
        label: 'Years of Experience',
        dbField: 'yearOfExp',
        type: 'textField',
        required: true,
        extendedProps: {
          gridAttribute: { xs: 12, md: 6 },
          textFieldAttribute: { type: 'number', inputProps: { min: 0 } }
        }
      },
      {
        label: 'License Number',
        dbField: 'licenseNumber',
        type: 'textField',
        extendedProps: {
          gridAttribute: { xs: 12, md: 6 },
          textFieldAttribute: { type: 'number', inputProps: { min: 0 } }
        }
      },
      {
        label: 'DEA Number',
        dbField: 'deaNumber',
        type: 'textField',
        extendedProps: {
          gridAttribute: { xs: 12, md: 6 },
          textFieldAttribute: {
            InputProps: {
              inputComponent: CleaveInput
            },
            inputProps: {
              options: { delimiter: '-', blocks: [4, 3, 5], uppercase: true }
            }
          }
        }
      },
      {
        label: 'PTR Number',
        dbField: 'ptrNumber',
        type: 'textField',
        extendedProps: {
          gridAttribute: { xs: 12, md: 6 },
          textFieldAttribute: { type: 'number', inputProps: { min: 0 } }
        }
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
        label: 'Contact Number',
        dbField: 'contactNumber',
        type: 'auto-complete',
        required: true,
        extendedProps: {
          autoCompleteAttribute: {
            fullWidth: true,
            freeSolo: true,
            multiple: true,
            options: [],
            renderInput: params => null
          },
          customInputComponent: CleaveInput,
          cleaveOptions: { phone: true, phoneRegionCode: 'PH' },
          gridAttribute: { xs: 12 }
        }
      },
      {
        label: 'Languages',
        dbField: 'languages',
        type: 'dropDown',
        entityId: 14,
        required: true,
        extendedProps: {
          dropDownAttribute: {
            multiple: true
          },
          gridAttribute: { xs: 12 }
        }
      }
    ]
  };

  const RECEPTIONIST_PROFILE_PANEL = ['General'] as const;
  const RECEPTIONIST_PROFILE_FIELDS: Record<
    (typeof RECEPTIONIST_PROFILE_PANEL)[number],
    FormControlPropsType<ReceptionistProfileUnionFieldType>[]
  > = {
    General: [
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
        label: 'Contact Number',
        dbField: 'contactNumber',
        type: 'textField',
        extendedProps: {
          gridAttribute: { xs: 12 },
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
    ]
  };

  const handleClose = () => {
    onClosing();
    reset();
    physicianProfileReset();
    receptionistProfileReset();
  };

  const onSubmit: SubmitHandler<UserDtoSchemaType> = data => {
    postUserMutate(
      { params: { id, module: 'User' }, body: data },
      {
        onSuccess: data => {
          toast.success(data.message);
          handleClose();
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

  const physicianProfileOnSubmit: SubmitHandler<PhysicianProfileDtoSchemaType> = data => {
    setValue('profile.roleProfile', data);
    handleSubmit(onSubmit)();
  };

  const receptionistProfileOnSubmit: SubmitHandler<ReceptionistProfileDtoSchemaType> = data => {
    setValue('profile.roleProfile', data);
    handleSubmit(onSubmit)();
  };

  type UserFormSubmit = {
    event: FormEvent<HTMLFormElement>;
    role: number;
    handleSubmit: UseFormHandleSubmit<UserDtoSchemaType>;
    physicianProfileHandleSubmit: UseFormHandleSubmit<PhysicianProfileDtoSchemaType>;
  };

  const userFormSubmit = ({ event, role, handleSubmit, physicianProfileHandleSubmit }: UserFormSubmit) => {
    event.preventDefault();

    switch (role) {
      case 14:
        physicianProfileHandleSubmit(physicianProfileOnSubmit)();
        return;
      case 15:
        receptionistProfileHandleSubmit(receptionistProfileOnSubmit)();
        return;
    }

    handleSubmit(onSubmit)();
  };

  useEffect(() => {
    if (referencesData && referencesData?.length > 0 && !id) {
      setValue('roleId', referencesData.filter(ref => ref.entityId === 6).find(ref => ref.isDefault)!.id);
      setValue('statusId', referencesData.filter(ref => ref.entityId === 8).find(ref => ref.isDefault)!.id);
    }
  }, [referencesData]);

  useEffect(() => {
    if (id && userData) {
      const { profile, ...data } = userData;

      if (profile) {
        switch (userData.roleId) {
          case 14:
            physicianProfileReset(JSON.parse(JSON.stringify(profile?.roleProfile)));
            break;
          case 15:
            receptionistProfileReset(JSON.parse(JSON.stringify(profile?.roleProfile)));
        }
      }

      reset({ ...data, profile: { clinics: profile?.clinics.map(clinic => clinic.id) } });
    }
  }, [id]);

  useEffect(() => {
    if (getValues('roleId') !== 12 && !userData) reset(formValues => ({ ...formValues, profile: { clinics: [] } }));
    if (getValues('roleId') === 12 && clinicData) {
      reset(formValues => ({ ...formValues, profile: { clinics: clinicData.map(clinic => clinic.id) } }));
    }
  }, [watch('roleId')]);

  useEffect(() => {
    onSaving(postUserIsLoading);
  }, [postUserIsLoading]);

  const renderProfileInfoForm = () => {
    switch (watch('roleId')) {
      case 14:
        return (
          <Grid item container spacing={6} xs={12}>
            <Grid item xs={12}>
              <Divider sx={{ width: '100%' }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h6' color='text.primary' fontWeight='600'>
                Physician Profile
              </Typography>
            </Grid>
            {PHYSICIAN_PROFILE_FIELDS['General'].map((obj, i) => (
              <Grid item key={obj.dbField} {...obj.extendedProps?.gridAttribute}>
                <FormObjectComponent
                  key={i}
                  objFieldProp={obj}
                  control={physicianProfileControl}
                  errors={physicianProfileErrors}
                  getValues={physicianProfileGetValues}
                  setValue={physicianProfileSetValue}
                />
              </Grid>
            ))}
          </Grid>
        );

      case 15:
        return (
          <Grid item container spacing={6} xs={12}>
            <Grid item xs={12}>
              <Divider sx={{ width: '100%' }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h6' color='text.primary' fontWeight='600'>
                Receptionist Profile
              </Typography>
            </Grid>
            {RECEPTIONIST_PROFILE_FIELDS['General'].map((obj, i) => (
              <Grid item key={obj.dbField} {...obj.extendedProps?.gridAttribute}>
                <FormObjectComponent
                  key={i}
                  objFieldProp={obj}
                  control={receptionistProfileControl}
                  errors={receptionistProfileErrors}
                  getValues={receptionistProfileGetValues}
                  setValue={receptionistProfileSetValue}
                />
              </Grid>
            ))}
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <form
        id={formId}
        onSubmit={e => userFormSubmit({ event: e, role: watch('roleId'), handleSubmit, physicianProfileHandleSubmit })}
      >
        <Grid container spacing={6}>
          <Grid item container spacing={6} xs={12}>
            {USER_FIELDS['General'].map((obj, i) => (
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

          {renderProfileInfoForm()}
        </Grid>
      </form>
    </Box>
  );
};

export default UserInfoForm;
