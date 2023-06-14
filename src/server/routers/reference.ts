import { router, protectedProcedure, publicProcedure } from '@/server/trpc';
import { filterQuery, params } from '../schema/common';
import { deleteReference, getReferences, postReference } from '../services/reference';
import { postReferenceDtoSchema } from '../schema/reference';

export const referenceRouter = router({
  list: publicProcedure.input(filterQuery).query(({ ctx, input }) => getReferences(ctx, input)),
  post: protectedProcedure.input(postReferenceDtoSchema).mutation(({ ctx, input }) => postReference(ctx, input)),
  delete: protectedProcedure.input(params).mutation(({ ctx, input }) => deleteReference(ctx, input))
});
