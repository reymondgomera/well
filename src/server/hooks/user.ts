import { FilterQueryInputType, ParamsInput } from '@/utils/common.type';
import { FilterData, SetQueryDataDeleted } from '@/utils/rq.context';
import { trpc } from '@/utils/trpc';

export const getUsers = (filterQuery?: FilterQueryInputType, params?: ParamsInput) => {
  const result = trpc.user.list.useQuery(
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

export const getUser = ({ id }: FilterQueryInputType) => {
  const { data } = getUsers({ id });
  return data?.find(row => row.id === id);
};

export const postUser = () => {
  const mutation = trpc.user.post.useMutation();
  return mutation;
};

export const deleteUser = () => {
  const mutation = trpc.user.delete.useMutation({
    onSuccess: ({ id }) => {
      SetQueryDataDeleted({
        queryKey: {},
        routerKey: 'user',
        filterQuery: { id }
      });
    }
  });

  return mutation;
};
