import { TRPCError } from '@trpc/server';

export class RecordDoesExist extends TRPCError {
  constructor({ ...args }) {
    super({
      code: 'CONFLICT',
      message: `${args.module} <<${args.code}>> already exists`
    });
  }
}
