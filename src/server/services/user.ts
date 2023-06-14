import { TRPCError } from '@trpc/server';
import { Context } from '@/server/context';
import { Prisma as prismaCli } from '@prisma/client';
import { FilterQueryInputType, ParamsInput } from '@/utils/common.type';
import { hash } from 'argon2';
import { PostUserDtoSchemaType } from '../schema/user';
import { RecordDoesExist } from '@/utils/http.message';
import _ from 'lodash';

export type UsersAsyncType = typeof getUsers;

export const getUsers = async (ctx: Context, filterQuery?: FilterQueryInputType) => {
  try {
    return await ctx.prisma.user.findMany({
      ...(filterQuery && filterQuery.ids ? { where: { id: { in: filterQuery.ids } } } : {}),
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (err) {
    throw err;
  }
};

export const postUser = async (ctx: Context, postUserDto: PostUserDtoSchemaType) => {
  try {
    const { params, body } = postUserDto;

    const hashedPassword = await hash(body.password);

    // ** UPDATE data
    if (params.id) {
      let isPasswordMatch = false;

      const user = await ctx.prisma.user.findUnique({
        where: { id: params.id },
        include: {
          profile: {
            include: {
              clinics: true
            }
          }
        }
      });

      if (user) isPasswordMatch = user.password === body.password;

      return {
        data: await ctx.prisma.user.update({
          where: { id: params.id },
          data: {
            ..._.omit(body, ['profile']),
            ...(!isPasswordMatch && { password: hashedPassword }),
            profile: {
              update: {
                roleProfile: body.profile.roleProfile
                  ? JSON.parse(JSON.stringify(body.profile.roleProfile))
                  : undefined,
                clinics: {
                  disconnect: user?.profile?.clinics.length
                    ? user?.profile?.clinics.map(clinic => ({ id: clinic.id }))
                    : [],
                  connect: body.profile.clinics.map(id => ({ id }))
                }
              }
            }
          }
        }),
        message: 'User updated successfully.',
        status: 'success'
      };
    }

    return {
      data: await ctx.prisma.user.create({
        data: {
          ..._.omit(body, ['profile']),
          password: hashedPassword,
          profile: {
            create: {
              roleProfile: body.profile.roleProfile ? JSON.parse(JSON.stringify(body.profile.roleProfile)) : undefined,
              clinics: {
                connect: body.profile.clinics.map(id => ({ id }))
              }
            }
          }
        }
      }),
      message: 'User created successfully.',
      status: 'success'
    };
  } catch (err) {
    if (err instanceof prismaCli.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        throw new RecordDoesExist({
          module: postUserDto.params.module,
          code: 'email or username'
        });
      }
    }
    throw err;
  }
};

export const deleteUser = async (ctx: Context, params: ParamsInput) => {
  try {
    await ctx.prisma.user.delete({ where: { id: params.id } });

    return {
      id: params.id,
      message: 'User deleted successfully.',
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
