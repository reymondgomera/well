import { Context } from './context';
import { TRPCError, initTRPC } from '@trpc/server';
import superjson from 'superjson';

const t = initTRPC.context<Context>().create({ transformer: superjson });

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user }
    }
  });
});

// router
export const router = t.router;

// procedure
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
