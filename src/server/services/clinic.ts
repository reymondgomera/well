import { TRPCError } from '@trpc/server';
import { Context } from '@/server/context';
import { Prisma as prismaCli } from '@prisma/client';
import { FilterQueryInputType, ParamsInput } from '@/utils/common.type';
import { PostClinicDtoSchemaType } from '../schema/clinic';
import { RecordDoesExist } from '@/utils/http.message';

export type ClinicAsyncType = typeof getClinics;

export const getClinics = async (ctx: Context, filterQuery?: FilterQueryInputType) => {
  try {
    return await ctx.prisma.clinic.findMany({
      ...(filterQuery && filterQuery.ids ? { where: { id: { in: filterQuery.ids } } } : {}),
      include: {
        profile: {
          include: {
            user: {
              select: {
                id: true,
                userName: true,
                firstName: true,
                lastName: true,
                middleInitial: true,
                status: true,
                department: true,
                role: true
              }
            }
          }
        }
      }
    });
  } catch (err) {
    throw err;
  }
};

export const postClinic = async (ctx: Context, postClinicDto: PostClinicDtoSchemaType) => {
  try {
    const { params, body } = postClinicDto;

    const adminUsers = await ctx.prisma.user.findMany({
      where: {
        role: {
          code: {
            equals: 'admin'
          }
        }
      },
      include: {
        role: {
          select: {
            id: true,
            code: true,
            name: true
          }
        },
        department: {
          select: {
            id: true,
            code: true,
            name: true
          }
        },
        status: {
          select: {
            id: true,
            code: true,
            name: true
          }
        },
        profile: {
          include: {
            clinics: true
          }
        }
      }
    });

    // ** UPDATE data
    if (params.id) {
      return {
        data: await ctx.prisma.clinic.update({
          where: { id: params.id },
          data: body,
          include: {
            profile: {
              include: {
                user: {
                  select: {
                    id: true,
                    userName: true,
                    firstName: true,
                    lastName: true,
                    middleInitial: true,
                    status: true,
                    department: true
                  }
                }
              }
            }
          }
        }),
        message: 'Clinic updated successfully.',
        status: 'success'
      };
    }

    return {
      data: await ctx.prisma.clinic.create({
        data: { ...body, profile: { connect: adminUsers.map(user => ({ userId: user.id })) } },
        include: {
          profile: {
            include: {
              user: {
                select: {
                  id: true,
                  userName: true,
                  firstName: true,
                  lastName: true,
                  middleInitial: true,
                  status: true,
                  department: true
                }
              }
            }
          }
        }
      }),
      message: 'Clinic created successfully.',
      status: 'success'
    };
  } catch (err) {
    if (err instanceof prismaCli.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        throw new RecordDoesExist({
          module: postClinicDto.params.module,
          code: postClinicDto.body.code
        });
      }
    }
    throw err;
  }
};

export const deleteClinic = async (ctx: Context, params: ParamsInput) => {
  try {
    await ctx.prisma.clinic.delete({ where: { id: params.id } });

    return {
      id: params.id,
      message: 'Clinic deleted successfully.',
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
