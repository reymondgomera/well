import { TRPCError } from '@trpc/server';
import { Context } from '@/server/context';
import { Prisma as prismaCli } from '@prisma/client';
import { ParamsInput } from '@/utils/common.type';
import { PostCheckupDtoSchemaType } from '../schema/checkup';
import { RecordDoesExist } from '@/utils/http.message';

export type CheckupsAsyncType = typeof getCheckups;

export const getCheckups = async (ctx: Context) => {
  try {
    return await ctx.prisma.checkup.findMany({
      include: {
        clinic: true,
        patient: {
          select: {
            firstName: true,
            lastName: true,
            middleInitial: true,
            address: true,
            age: true,
            dateOfBirth: true,
            gender: {
              select: {
                id: true,
                code: true,
                name: true
              }
            }
          }
        },
        receptionist: {
          select: {
            firstName: true,
            lastName: true,
            middleInitial: true,
            profile: {
              include: {
                clinics: true
              }
            }
          }
        },
        physician: {
          select: {
            firstName: true,
            lastName: true,
            middleInitial: true,
            profile: {
              include: {
                clinics: true
              }
            }
          }
        },
        status: {
          select: {
            id: true,
            code: true,
            name: true
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

export const postCheckup = async (ctx: Context, postCheckupDto: PostCheckupDtoSchemaType) => {
  try {
    const { params, body } = postCheckupDto;

    // ** UPDATE data
    if (params.id) {
      return {
        data: await ctx.prisma.checkup.update({
          where: { id: params.id },
          data: JSON.parse(JSON.stringify(body)),
          include: {
            clinic: true,
            patient: {
              select: {
                firstName: true,
                lastName: true,
                middleInitial: true,
                address: true,
                age: true,
                dateOfBirth: true,
                gender: {
                  select: {
                    id: true,
                    code: true,
                    name: true
                  }
                }
              }
            },
            receptionist: {
              select: {
                firstName: true,
                lastName: true,
                middleInitial: true,
                profile: {
                  include: {
                    clinics: true
                  }
                }
              }
            },
            physician: {
              select: {
                firstName: true,
                lastName: true,
                middleInitial: true,
                profile: {
                  include: {
                    clinics: true
                  }
                }
              }
            },
            status: {
              select: {
                id: true,
                code: true,
                name: true
              }
            }
          }
        }),
        message: 'Checkup updated successfully.',
        status: 'success'
      };
    }

    return {
      data: await ctx.prisma.checkup.create({
        data: JSON.parse(JSON.stringify(body)),
        include: {
          clinic: true,
          patient: {
            select: {
              firstName: true,
              lastName: true,
              middleInitial: true,
              address: true,
              age: true,
              dateOfBirth: true,
              gender: {
                select: {
                  id: true,
                  code: true,
                  name: true
                }
              }
            }
          },
          receptionist: {
            select: {
              firstName: true,
              lastName: true,
              middleInitial: true,
              profile: {
                include: {
                  clinics: true
                }
              }
            }
          },
          physician: {
            select: {
              firstName: true,
              lastName: true,
              middleInitial: true,
              profile: {
                include: {
                  clinics: true
                }
              }
            }
          },
          status: {
            select: {
              id: true,
              code: true,
              name: true
            }
          }
        }
      }),
      message: 'Checkup added successfully.',
      status: 'success'
    };
  } catch (err) {
    if (err instanceof prismaCli.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        throw new RecordDoesExist({
          module: postCheckupDto.params.module,
          code: `PATIENT ID: ${postCheckupDto.body.patientId}`
        });
      }
    }
    throw err;
  }
};

export const deleteCheckup = async (ctx: Context, params: ParamsInput) => {
  try {
    await ctx.prisma.checkup.delete({ where: { id: params.id } });

    return {
      id: params.id,
      message: 'Checkup deleted successfully.',
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
