import { Context } from '@/server/context';
import { FilterQueryInputType } from '@/utils/common.type';
import _ from 'lodash';
import moment from 'moment';

export const getDashboardStatistics = async (ctx: Context, filterQuery?: FilterQueryInputType) => {
  const NOW = moment();
  const THIS_MONTH = NOW.clone().startOf('month');
  const PREVIOUS_MONTH = THIS_MONTH.clone().subtract(1, 'month');
  const NEXT_MONTH = THIS_MONTH.clone().add(1, 'month');

  try {
    const [
      totalReferences,
      totalUser,
      totalPhysician,
      totalReceptionist,
      totalPatient,
      totalPatientThisMonth,
      totalPatientPreviousMonth,
      totalClinic,
      totalCheckup,
      totalCheckupPerClinic
    ] = await Promise.all([
      ctx.prisma.reference.count(),
      ctx.prisma.user.count(),
      ctx.prisma.user.count({ where: { roleId: 14 } }),
      ctx.prisma.user.count({ where: { roleId: 15 } }),
      ctx.prisma.patient.count(),
      ctx.prisma.patient.count({
        where: { createdAt: { gte: THIS_MONTH.toDate(), lt: NEXT_MONTH.toDate() } }
      }),
      ctx.prisma.patient.count({
        where: { createdAt: { gte: PREVIOUS_MONTH.toDate(), lt: THIS_MONTH.toDate() } }
      }),
      ctx.prisma.clinic.count(),
      ctx.prisma.checkup.count(),
      ctx.prisma.checkup.groupBy({
        by: ['clinicId'],
        _count: { clinicId: true }
      })
    ]);

    return {
      reference: { total: totalReferences },
      user: { total: totalUser, totalPhysician, totalReceptionist },
      patient: {
        total: totalPatient,
        thisMonthTotal: totalPatientThisMonth,
        previousMonthTotal: totalPatientPreviousMonth
      },
      clinic: { total: totalClinic },
      checkup: { total: totalCheckup, totalCheckupPerClinic }
    };
  } catch (err) {
    throw err;
  }
};
