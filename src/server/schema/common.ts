import { z } from 'zod';

export const params = z.object({
  id: z.number().optional(),
  ids: z.array(z.number()).optional(),
  module: z.string().optional()
});

export const commonDataDtoSchema = z.object({
  code: z.string().min(1, { message: 'Please enter code.' }),
  name: z.string().min(1, { message: 'Please enter name.' })
});

export const filterQuery = z.object({
  id: z.number().optional(),
  limit: z.number().default(1).optional(),
  page: z.number().default(10).optional(),
  entityId: z.number().optional(),
  entities: z.array(z.number()).optional(),
  searchValue: z.array(z.number()).optional()
});
