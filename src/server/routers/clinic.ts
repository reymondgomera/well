import { router, protectedProcedure } from '../trpc';
import { filterQuery, params } from '../schema/common';
import { deleteClinic, getClinics, postClinic } from '../services/clinic';
import { postClinicDtoSchema } from '../schema/clinic';

export const clinicRouter = router({
  list: protectedProcedure.input(filterQuery.merge(params)).query(({ ctx, input }) => getClinics(ctx, input)),
  post: protectedProcedure.input(postClinicDtoSchema).mutation(({ ctx, input }) => postClinic(ctx, input)),
  delete: protectedProcedure.input(params).mutation(({ ctx, input }) => deleteClinic(ctx, input))
});
