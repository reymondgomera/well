import { router, protectedProcedure } from '../trpc';
import { filterQuery, params } from '../schema/common';
import { deletePatient, getPatients, postPatient } from '../services/patient';
import { postPatientDtoSchema } from '../schema/patient';

export const patientRouter = router({
  list: protectedProcedure.input(filterQuery).query(({ ctx }) => getPatients(ctx)),
  post: protectedProcedure.input(postPatientDtoSchema).mutation(({ ctx, input }) => postPatient(ctx, input)),
  delete: protectedProcedure.input(params).mutation(({ ctx, input }) => deletePatient(ctx, input))
});
