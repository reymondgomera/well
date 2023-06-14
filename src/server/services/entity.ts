import { Context } from '@/server/context';

export type EntitiesAsyncType = typeof getEntities;

export const getEntities = async (ctx: Context) => {
  try {
    return await ctx.prisma.entity.findMany({
      include: {
        parent: {
          select: {
            id: true,
            code: true,
            name: true
          }
        }
      }
    });
  } catch (err) {
    throw err;
  }
};
