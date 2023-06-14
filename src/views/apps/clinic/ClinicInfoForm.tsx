import { Box, Grid } from '@mui/material';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { FormControlPropsType, FormPropsType } from '@/utils/common.type';
import { clinicDtoSchema, ClinicDtoSchemaType, ClinicUnionFieldType } from '@/server/schema/clinic';
import { getClinic, postClinic } from '@/server/hooks/clinic';
import { errorUtil } from '@/utils/helper';
import { CleaveInput, FormObjectComponent } from '@/utils/form.component';
import { useClinicFormStore } from '@/stores/clinic.store';
import { useEffect } from 'react';

const ClinicInfoForm = ({ formId }: FormPropsType) => {
  const { id, onClosing, onSaving } = useClinicFormStore();

  const clinicData = getClinic({ id });
  const { mutate: postClinicMutate, isLoading: postClinicIsLoading } = postClinic();

  const defaultValues = {
    code: '',
    name: '',
    address: '',
    contactNumber: [],
    daysOpen: '',
    openingTime: new Date(''),
    closingTime: new Date('')
  };

  const {
    control,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors }
  } = useForm<ClinicDtoSchemaType>({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(clinicDtoSchema)
  });

  const CLINIC_PANEL = ['General'] as const;
  const CLINIC_FIELDS: Record<(typeof CLINIC_PANEL)[number], FormControlPropsType<ClinicUnionFieldType>[]> = {
    General: [
      {
        label: 'Code',
        dbField: 'code',
        type: 'textField',
        required: true,
        extendedProps: { gridAttribute: { xs: 12, lg: 6 } }
      },
      {
        label: 'Name',
        dbField: 'name',
        type: 'textField',
        required: true,
        extendedProps: { gridAttribute: { xs: 12, lg: 6 } }
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
        label: 'Days Open (e.g. MON-SAT)',
        dbField: 'daysOpen',
        type: 'textField',
        required: true,
        extendedProps: {
          gridAttribute: { xs: 12, md: 4, lg: 4 },
          textFieldAttribute: {
            InputProps: {
              inputComponent: CleaveInput
            },
            inputProps: {
              onKeyPress: e => {
                const pattern = /^[A-Za-z,-]+$/;
                const charCode = e.which || e.keyCode;
                const charTyped = String.fromCharCode(charCode);
                if (!pattern.test(charTyped)) {
                  e.preventDefault();
                }
              },
              options: { uppercase: true, numericOnly: false }
            }
          }
        }
      },
      {
        label: 'Opening Time',
        dbField: 'openingTime',
        type: 'datePicker',
        required: true,
        extendedProps: {
          gridAttribute: { xs: 12, md: 4, lg: 4 },
          reactDatePickerAttribute: {
            showTimeSelect: true,
            showTimeSelectOnly: true,
            timeIntervals: 30,
            dateFormat: 'h:mm aa'
          }
        }
      },
      {
        label: 'Closing Time',
        dbField: 'closingTime',
        type: 'datePicker',
        required: true,
        extendedProps: {
          gridAttribute: { xs: 12, md: 4, lg: 4 },
          reactDatePickerAttribute: {
            showTimeSelect: true,
            showTimeSelectOnly: true,
            timeIntervals: 30,
            dateFormat: 'h:mm aa'
          }
        }
      }
    ]
  };

  const handleClose = () => {
    onClosing();
    reset();
  };

  const onSubmit: SubmitHandler<ClinicDtoSchemaType> = data => {
    postClinicMutate(
      { params: { id, module: 'Clinic' }, body: data },
      {
        onSuccess: data => {
          toast.success(data.message);
          handleClose();
        },
        onError: err => {
          const { status, message } = errorUtil(err);

          if (status === 'CONFLICT') setError('code', { message });
          if (status === 'ERROR') {
            handleClose();
            toast.error(message);
          }
        }
      }
    );
  };

  useEffect(() => {
    if (id && clinicData) reset(clinicData);
  }, [id]);

  useEffect(() => {
    onSaving(postClinicIsLoading);
  }, [postClinicIsLoading]);

  return (
    <Box>
      <form id={formId} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={6}>
          {CLINIC_FIELDS['General'].map((obj, i) => (
            <Grid item key={obj.dbField} {...obj.extendedProps?.gridAttribute}>
              <FormObjectComponent key={i} objFieldProp={obj} control={control} errors={errors} />
            </Grid>
          ))}
        </Grid>
      </form>
    </Box>
  );
};

export default ClinicInfoForm;
