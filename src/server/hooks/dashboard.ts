import { trpc } from '@/utils/trpc';

export const getDashboardStatistics = () => {
  const result = trpc.dashboard.list.useQuery({}, { staleTime: Infinity });
  return result;
};
