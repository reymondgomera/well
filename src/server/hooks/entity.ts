import { trpc } from '@/utils/trpc';
import { FilterQueryInputType } from '@/utils/common.type';

export const getEntities = () => {
  const result = trpc.entity.list.useQuery({}, { staleTime: Infinity });
  return result;
};

export const getEntity = ({ id }: FilterQueryInputType) => {
  const { data } = getEntities();
  return data?.find(row => row.id === id);
};
