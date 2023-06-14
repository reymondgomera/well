import { router, protectedProcedure } from '@/server/trpc';
import { getDashboardStatistics } from '../services/dashboard';
import { filterQuery } from '../schema/common';

export const dashboardRouter = router({
  list: protectedProcedure.input(filterQuery).query(({ ctx, input }) => getDashboardStatistics(ctx, input))
});
