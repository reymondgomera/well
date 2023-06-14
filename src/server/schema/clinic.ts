import { z } from 'zod';
import { params } from './common';
import { NestedKey } from '@/utils/helper';

export const chooseClinicDtoSchema = z.object({
  clinicId: z.coerce.number().min(1, { message: 'Please select a clinic.' })
});

export const clinicDtoSchema = z.object({
  code: z.string().min(1, { message: 'Please enter a code.' }),
  name: z.string().min(1, { message: 'Please enter a name.' }),
  address: z.string().min(1, { message: 'Please enter an address.' }),
  contactNumber: z.array(z.string()).min(1, { message: 'Please enter atleast one contact number.' }),
  daysOpen: z.string().min(1, { message: 'Please enter the days when the clinic opens.' }),
  openingTime: z.date({
    errorMap: (issue, ctx) => {
      if (issue.code === 'invalid_date' || issue.code === 'invalid_type')
        return { message: 'Please enter a valid opening time.' };
      else return { message: ctx.defaultError };
    }
  }),
  closingTime: z.date({
    errorMap: (issue, ctx) => {
      if (issue.code === 'invalid_date' || issue.code === 'invalid_type')
        return { message: 'Please enter a valid closing time.' };
      else return { message: ctx.defaultError };
    }
  })
});

export const postClinicDtoSchema = z.object({
  params,
  body: clinicDtoSchema
});

export type ClinicDtoSchemaType = z.infer<typeof clinicDtoSchema>;
export type PostClinicDtoSchemaType = z.infer<typeof postClinicDtoSchema>;
export type ChooseClinicDtoSchemaType = z.infer<typeof chooseClinicDtoSchema>;

export type ClinicUnionFieldType = NestedKey<ClinicDtoSchemaType>;
export type ChooseClinicUnionFieldType = NestedKey<ChooseClinicDtoSchemaType>;
