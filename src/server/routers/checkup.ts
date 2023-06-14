import { router, protectedProcedure } from '../trpc';
import { filterQuery, params } from '../schema/common';
import { deleteCheckup, getCheckups, postCheckup } from '../services/checkup';
import { postCheckupDtoSchema } from '../schema/checkup';

export const checkupRouter = router({
  list: protectedProcedure.input(filterQuery).query(({ ctx }) => getCheckups(ctx)),
  post: protectedProcedure.input(postCheckupDtoSchema).mutation(({ ctx, input }) => postCheckup(ctx, input)),
  delete: protectedProcedure.input(params).mutation(({ ctx, input }) => deleteCheckup(ctx, input))
});
