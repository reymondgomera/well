import _ from 'lodash';
import { z } from 'zod';
import { params } from './common';
import { NestedKey } from '@/utils/helper';

export const loginUserDtoSchema = z.object({
  email: z.string().min(1, { message: 'Please enter an email.' }).email(),
  password: z.string().min(1, { message: 'Please enter a password' })
});

export const physicianProfileDtoSchema = z.object({
  qualification: z.string().min(1, { message: 'Please enter a qualification.' }),
  specialistIn: z.string().min(1, { message: 'Please enter specializations.' }),
  specializedTreatment: z.string().min(1, { message: 'Please enter specialized treatment.' }),
  address: z.string().min(1, { message: 'Please enter an address.' }),
  languages: z.array(z.coerce.number()).min(1, { message: 'Please select atleast one language.' }),
  contactNumber: z.array(z.string()).min(1, { message: 'Please enter atleast one contact number.' }),
  yearOfExp: z.coerce.number().min(0, { message: 'Please enter years of experience.' }),
  licenseNumber: z.coerce.number().min(1, { message: 'Please enter a license number.' }),
  deaNumber: z.string().min(1, { message: 'Please enter a DEA number.' }),
  ptrNumber: z.coerce.number().min(1, { message: 'Please enter a PTR number.' })
});

export const receptionistProfileDtoSchema = z.object({
  address: z.string().min(1, { message: 'Please enter an address.' }),
  contactNumber: z.string().min(1, { message: 'Please enter a contact number.' })
});

export const profileDtoSchema = z.object({
  roleProfile: z.record(z.any()).nullable().optional(),
  clinics: z.array(z.coerce.number()).min(1, { message: 'Please select atleast one clinic.' })
});

export const userDtoSchema = z
  .object({
    userName: z.string().min(1, { message: 'Please enter a username.' }),
    email: z.string().min(1, { message: 'Please enter an email.' }).email(),
    password: z.string().min(1, { message: 'Please enter a password' }),
    firstName: z.string().min(1, { message: 'Please enter a first name.' }),
    lastName: z.string().min(1, { message: 'Please enter a last name.' }),
    middleInitial: z.string().max(1, { message: 'Middle initial must be a single character.' }).nullable().optional(),
    roleId: z.coerce.number().min(1, { message: 'Please select a role.' }),
    statusId: z.coerce.number().min(1, { message: 'Please select a status.' }),
    departmentId: z.coerce.number().nullable().optional(),
    profile: profileDtoSchema
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

export const postUserDtoSchema = z.object({
  params,
  body: userDtoSchema
});

export type UserDtoSchemaType = z.infer<typeof userDtoSchema>;
export type LoginUserDtoSchemaType = z.infer<typeof loginUserDtoSchema>;
export type PostUserDtoSchemaType = z.infer<typeof postUserDtoSchema>;
export type ProfileDtoSchemaType = z.infer<typeof profileDtoSchema>;
export type PhysicianProfileDtoSchemaType = z.infer<typeof physicianProfileDtoSchema>;
export type ReceptionistProfileDtoSchemaType = z.infer<typeof receptionistProfileDtoSchema>;

export type UserUnionFieldType = NestedKey<UserDtoSchemaType>;
export type LoginUserFieldType = keyof LoginUserDtoSchemaType;
export type ProfileUnionFieldType = keyof ProfileDtoSchemaType;
export type PhysicianProfileUnionFieldType = keyof PhysicianProfileDtoSchemaType;
export type ReceptionistProfileUnionFieldType = keyof ReceptionistProfileDtoSchemaType;
