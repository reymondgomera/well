import { FilterQueryInputType } from '@/utils/common.type';
import { FilterData, SetQueryDataDeleted } from '@/utils/rq.context';
import { trpc } from '@/utils/trpc';

export const getCheckups = (filterQuery?: FilterQueryInputType) => {
  const result = trpc.checkup.list.useQuery(
    {},
    {
      staleTime: Infinity,
      select: data => new FilterData(data, filterQuery).filter()
    }
  );

  return result;
};

export const getCheckup = ({ id }: FilterQueryInputType) => {
  const { data } = getCheckups({ id });
  return data?.find(row => row.id === id);
};

export const postCheckup = () => {
  const mutation = trpc.checkup.post.useMutation();
  return mutation;
};

export const deleteCheckup = () => {
  const mutation = trpc.checkup.delete.useMutation({
    onSuccess: ({ id }) => {
      SetQueryDataDeleted({
        queryKey: {},
        routerKey: 'checkup',
        filterQuery: { id }
      });
    }
  });

  return mutation;
};
