import { TRPCError } from '@trpc/server';
import { Context } from '@/server/context';
import { Prisma as prismaCli } from '@prisma/client';
import { FilterQueryInputType, ParamsInput } from '@/utils/common.type';
import { PostReferenceDtoType } from '../schema/reference';
import { RecordDoesExist } from '@/utils/http.message';

export type ReferencesAsyncType = typeof getReferences;

export const getReferences = async (ctx: Context, filterQuery: FilterQueryInputType) => {
  try {
    const entities = filterQuery?.entities;

    return await ctx.prisma.reference.findMany({
      where: {
        entityId: { in: entities }
      }
    });
  } catch (err) {
    throw err;
  }
};

export const postReference = async (ctx: Context, postReferenceDto: PostReferenceDtoType) => {
  try {
    const { params, body } = postReferenceDto;

    // ** UPDATE data
    if (params.id) {
      return {
        data: await ctx.prisma.reference.update({
          where: { id: params.id },
          data: body
        }),
        message: 'Reference updated successfully.',
        status: 'success'
      };
    }

    return {
      data: await ctx.prisma.reference.create({ data: body }),
      message: 'Reference created successfully.',
      status: 'success'
    };
  } catch (err) {
    if (err instanceof prismaCli.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        throw new RecordDoesExist({
          module: postReferenceDto.params.module,
          code: postReferenceDto.body.code
        });
      }
    }
    throw err;
  }
};

export const deleteReference = async (ctx: Context, params: ParamsInput) => {
  try {
    await ctx.prisma.reference.delete({ where: { id: params.id } });

    return {
      id: params.id,
      message: 'Reference deleted successfully.',
      status: 'success'
    };
  } catch (err) {
    if (err instanceof prismaCli.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Record ID <<${params.id}>> not found.`
        });
      }
    }
    throw err;
  }
};
