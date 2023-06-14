import { router, protectedProcedure } from '@/server/trpc';
import { filterQuery } from '../schema/common';
import { getEntities } from '../services/entity';

export const entityRouter = router({
  list: protectedProcedure.input(filterQuery).query(({ ctx }) => getEntities(ctx))
});
