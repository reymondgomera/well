import { FilterQueryInputType } from '@/utils/common.type';
import { FilterData, InvalidateQueries, SetQueryDataDeleted } from '@/utils/rq.context';
import { trpc } from '@/utils/trpc';

export const getPatients = (filterQuery?: FilterQueryInputType) => {
  const result = trpc.patient.list.useQuery(
    {},
    {
      staleTime: Infinity,
      select: data => new FilterData(data, filterQuery).filter()
    }
  );

  return result;
};

export const getPatient = ({ id }: FilterQueryInputType) => {
  const { data } = getPatients({ id });
  return data?.find(row => row.id === id);
};

export const postPatient = () => {
  const mutation = trpc.patient.post.useMutation();
  return mutation;
};

export const deletePatient = () => {
  const mutation = trpc.patient.delete.useMutation({
    onSuccess: ({ id }) => {
      SetQueryDataDeleted({
        queryKey: {},
        routerKey: 'patient',
        filterQuery: { id }
      });
    }
  });

  return mutation;
};
