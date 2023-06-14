import { FilterQueryInputType, ParamsInput } from '@/utils/common.type';
import { FilterData, InvalidateQueries, SetQueryDataDeleted } from '@/utils/rq.context';
import { trpc } from '@/utils/trpc';

export const getClinics = (filterQuery?: FilterQueryInputType, params?: ParamsInput) => {
  const result = trpc.clinic.list.useQuery(
    {
      ...(params && params.ids && { ids: params.ids })
    },
    {
      staleTime: Infinity,
      select: data => new FilterData(data, filterQuery).filter()
    }
  );

  return result;
};

export const getClinic = ({ id }: FilterQueryInputType) => {
  const { data } = getClinics({ id });
  return data?.find(row => row.id === id);
};

export const postClinic = () => {
  const mutation = trpc.clinic.post.useMutation();
  return mutation;
};

export const deleteClinic = () => {
  const mutation = trpc.clinic.delete.useMutation({
    onSuccess: ({ id }) => {
      SetQueryDataDeleted({
        queryKey: {},
        routerKey: 'clinic',
        filterQuery: { id }
      });
    }
  });

  return mutation;
};
