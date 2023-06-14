import { NestedKey } from '@/utils/helper';
import { z } from 'zod';
import { params } from './common';
import _ from 'lodash';

export const medicationDtoSchema = z.object({
  brandName: z.string().min(1, { message: 'Please enter a brand name.' }),
  dosage: z.string().min(1, { message: 'Please enter a dosage.' }),
  generic: z.string().min(1, { message: 'Please enter a generic name.' })
});

export const patientDtoSchema = z
  .object({
    firstName: z.string().min(1, { message: 'Please enter a first name.' }),
    lastName: z.string().min(1, { message: 'Please enter a last name.' }),
    middleInitial: z.string().max(1, { message: 'Middle initial must be a single character.' }).nullable().optional(),
    address: z.string().min(1, { message: 'Please enter an address.' }),
    dateOfBirth: z
      .date({
        errorMap: (issue, ctx) => {
          if (issue.code === 'invalid_date' || issue.code === 'invalid_type')
            return { message: 'Please enter a valid date of birth.' };
          else return { message: ctx.defaultError };
        }
      })
      .min(new Date('1900-01-01'), { message: 'Too old.' })
      .max(new Date(), { message: 'Too young.' }),
    civilStatusId: z.coerce.number().min(1, { message: 'Please select a civil status.' }),
    age: z.coerce.number().min(1, { message: 'Please enter an age.' }),
    occupationId: z.coerce.number().nullable().optional(),
    genderId: z.coerce.number().min(1, { message: 'Please enter a gender.' }),
    contactNumber: z.string().nullable().optional(),
    familyHistory: z.object({
      diseases: z.array(z.coerce.number()).default([]),
      others: z.string().default('N/A')
    }),
    personalHistory: z.object({
      smoking: z.coerce.number().default(0),
      alcohol: z.coerce.number().default(0),
      currentHealthCondition: z.string().default('N/A'),
      medications: z.array(medicationDtoSchema).default([])
    }),
    pastMedicalHistory: z.object({
      hospitalized: z.string().default('N/A'),
      injuries: z.string().default('N/A'),
      surgeries: z.string().default('N/A'),
      allergies: z.string().default('N/A'),
      measles: z.string().default('N/A'),
      chickenPox: z.string().default('N/A'),
      others: z.string().default('N/A')
    }),
    obGyne: z.object({
      menstrualCycle: z.coerce.date().nullable().optional(),
      days: z.coerce.number().default(0),
      p: z.coerce.number().default(0),
      g: z.coerce.number().default(0)
    })
  })
  .refine(formObj => {
    for (const key in formObj) {
      const val = _.get(formObj, key);

      //dropdown data which has 0 value
      if (!val && val === 0 && key.includes('Id')) {
        _.set(formObj, key, null);
      }
    }

    return formObj;
  });

export const postPatientDtoSchema = z.object({
  params,
  body: patientDtoSchema
});

export type PatientDtoSchemaType = z.infer<typeof patientDtoSchema>;
export type PostPatientDtoSchemaType = z.infer<typeof postPatientDtoSchema>;
export type MedicationDtoSchemaType = z.infer<typeof medicationDtoSchema>;

export type PatientUnionFieldType = NestedKey<PatientDtoSchemaType>;
export type MedicationUnionFieldType = NestedKey<MedicationDtoSchemaType>;
