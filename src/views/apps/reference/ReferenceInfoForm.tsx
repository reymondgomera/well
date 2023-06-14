import { Box, Grid } from '@mui/material';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { FormControlPropsType, FormPropsType } from '@/utils/common.type';
import { createReferenceDtoSchema, CreateReferenceDtoType, ReferenceUnionFieldType } from '@/server/schema/reference';
import { getReference, postReference } from '@/server/hooks/reference';
import { errorUtil } from '@/utils/helper';
import { FormObjectComponent } from '@/utils/form.component';
import { useReferenceFormStore } from '@/stores/reference.store';
import { getEntity } from '@/server/hooks/entity';
import { useEffect } from 'react';

const ReferenceInfoForm = ({ formId }: FormPropsType) => {
  const { id, entityId, onClosing, onSaving } = useReferenceFormStore();

  const entityData = getEntity({ id: entityId });
  const referenceData = getReference({ entities: [entityId], id });
  const { mutate: postReferenceMutate, isLoading: postReferenceIsLoading } = postReference({ entities: [entityId] });

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm<CreateReferenceDtoType>({
    defaultValues: {
      code: '',
      name: ''
    },
    mode: 'onChange',
    resolver: zodResolver(createReferenceDtoSchema)
  });

  const REFERENCE_PANEL = ['General'] as const;
  const REFERENCE_FIELDS: Record<(typeof REFERENCE_PANEL)[number], FormControlPropsType<ReferenceUnionFieldType>[]> = {
    General: [
      {
        label: 'Code',
        dbField: 'code',
        type: 'textField',
        required: true,
        extendedProps: {
          gridAttribute: { xs: 12, sm: 12 }
        }
      },
      {
        label: 'Name',
        dbField: 'name',
        type: 'textField',
        required: true,
        extendedProps: {
          gridAttribute: { xs: 12, sm: 12 }
        }
      }
    ]
  };

  const onSubmit: SubmitHandler<CreateReferenceDtoType> = data => {
    const body = { ...data, entityId };

    postReferenceMutate(
      { params: { id, module: entityData?.name }, body },
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

  const handleClose = () => {
    onClosing();
    reset();
  };

  useEffect(() => {
    if (id && referenceData) reset(referenceData);
  }, [id]);

  useEffect(() => {
    onSaving(postReferenceIsLoading);
  }, [postReferenceIsLoading]);

  return (
    <Box>
      <form id={formId} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={6}>
          {REFERENCE_FIELDS['General'].map((obj, i) => (
            <Grid item key={obj.dbField} {...obj.extendedProps?.gridAttribute}>
              <FormObjectComponent key={i} objFieldProp={obj} control={control} errors={errors} />
            </Grid>
          ))}
        </Grid>
      </form>
    </Box>
  );
};

export default ReferenceInfoForm;
