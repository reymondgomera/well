import { z } from 'zod';
import { commonDataDtoSchema, params } from './common';

export const createReferenceDtoSchema = commonDataDtoSchema;
export const postReferenceDtoSchema = z.object({
  params,
  body: createReferenceDtoSchema.extend({ entityId: z.number().positive() })
});

export type CreateReferenceDtoType = z.infer<typeof createReferenceDtoSchema>;
export type PostReferenceDtoType = z.infer<typeof postReferenceDtoSchema>;

export type ReferenceUnionFieldType = keyof CreateReferenceDtoType;
