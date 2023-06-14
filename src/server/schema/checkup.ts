import { NestedKey } from '@/utils/helper';
import { z } from 'zod';
import { params } from './common';

export const diagnosisDtoSchema = z.object({
  name: z.string().min(1, { message: 'Please enter a diagnosis.' })
});

export const treatmentDtoSchema = z.object({
  medicineId: z.coerce.number().min(1, { message: 'Please select a treatment.' }),
  signa: z.string().min(1, { message: 'Please enter a signa.' }),
  quantity: z.coerce.number().min(1, { message: 'Please enter a quantity.' })
});

export const vitalSignsDtoSchema = z.object({
  t: z.coerce.number().min(1, { message: 'Please enter a body temperature (T).' }),
  p: z.coerce.number().min(1, { message: 'Please enter a pulse rate (P).' }),
  r: z.coerce.number().min(1, { message: 'Please enter a respiration rate (R).' }),
  bp: z.string().min(1, { message: 'Please enter a blood pressure (BP).' }),
  wt: z.coerce.number().min(1, { message: 'Please enter a weight (WT).' }),
  ht: z.coerce.number().min(1, { message: 'Please enter a height (HT).' }),
  cbg: z.coerce.number().min(1, { message: 'Please enter capillary blood glucose (CBG).' })
});

export const checkupDtoSchema = z.object({
  clinicId: z.coerce.number().min(1, { message: 'Please enter a clinic id.' }),
  patientId: z.coerce.number().min(1, { message: 'Please enter a patient id.' }),
  physicianId: z.coerce.number().min(1, { message: 'Please select a physician.' }),
  receptionistId: z.coerce.number().min(1, { message: 'please enter a receptionist id.' }),
  vitalSigns: vitalSignsDtoSchema,
  diagnoses: z.array(diagnosisDtoSchema).nullable().optional(),
  treatments: z.array(treatmentDtoSchema).nullable().optional(),
  dietaryAdviseGiven: z.string().default('N/A'),
  followUp: z.date().min(new Date(), { message: 'Invalid follow up date.' }).nullable().optional(),
  statusId: z.coerce.number().min(1, { message: 'Please select a status.' })
});

export const postCheckupDtoSchema = z.object({
  params,
  body: checkupDtoSchema
});

export type CheckupDtoSchemaType = z.infer<typeof checkupDtoSchema>;
export type PostCheckupDtoSchemaType = z.infer<typeof postCheckupDtoSchema>;
export type VitalSignsDtoSchemaType = z.infer<typeof vitalSignsDtoSchema>;
export type DiagnosisDtoSchemaType = z.infer<typeof diagnosisDtoSchema>;
export type TreatmentDtoSchemaType = z.infer<typeof treatmentDtoSchema>;

export type CheckupUnionFieldType = NestedKey<CheckupDtoSchemaType>;
export type VitalSignsUnionFieldType = NestedKey<VitalSignsDtoSchemaType>;
export type DiagnosisUnionFieldType = NestedKey<DiagnosisDtoSchemaType>;
export type TreatmentUnionFieldType = NestedKey<TreatmentDtoSchemaType>;
