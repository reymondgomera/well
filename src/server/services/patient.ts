import { TRPCError } from '@trpc/server';
import { Context } from '@/server/context';
import { Prisma as prismaCli } from '@prisma/client';
import { PostPatientDtoSchemaType } from '../schema/patient';
import { ParamsInput } from '@/utils/common.type';
import { RecordDoesExist } from '@/utils/http.message';

export type PatientsAsyncType = typeof getPatients;

export const getPatients = async (ctx: Context) => {
  try {
    return await ctx.prisma.patient.findMany({
      include: {
        civilStatus: true,
        gender: true,
        occupation: true,
        checkups: {
          include: {
            clinic: true,
            status: true,
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
            }
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
export const postPatient = async (ctx: Context, postPatientDto: PostPatientDtoSchemaType) => {
  try {
    const { params, body } = postPatientDto;

    // ** UPDATE data
    if (params.id) {
      return {
        data: await ctx.prisma.patient.update({
          where: { id: params.id },
          data: JSON.parse(JSON.stringify(body)),
          include: {
            civilStatus: true,
            gender: true,
            occupation: true
          }
        }),
        message: 'Patient updated successfully.',
        status: 'success'
      };
    }

    return {
      data: await ctx.prisma.patient.create({
        data: JSON.parse(JSON.stringify(body)),
        include: {
          civilStatus: true,
          gender: true,
          occupation: true
        }
      }),
      message: 'Patient added successfully.',
      status: 'success'
    };
  } catch (err) {
    if (err instanceof prismaCli.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        throw new RecordDoesExist({
          module: postPatientDto.params.module,
          code: postPatientDto.body.firstName + ' ' + postPatientDto.body.lastName
        });
      }
    }
    throw err;
  }
};

export const deletePatient = async (ctx: Context, params: ParamsInput) => {
  try {
    await ctx.prisma.patient.delete({ where: { id: params.id } });

    return {
      id: params.id,
      message: 'Patient deleted successfully.',
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
