import { trpc } from '@/utils/trpc';
import { FilterQueryInputType } from '@/utils/common.type';
import { getEntities } from './entity';
import { FilterData, InvalidateQueries, SetQueryDataDeleted } from '@/utils/rq.context';

export const getDependencyData = (filterQuery: FilterQueryInputType) => {
  const entities = getEntities();
  const references = getReferences(filterQuery);

  return { entities, references };
};

export const getReferences = ({ entities, ...filterQuery }: FilterQueryInputType) => {
  const result = trpc.reference.list.useQuery(entities ? { entities } : {}, {
    select: data => new FilterData(data, filterQuery).filter(),
    enabled: !!entities,
    staleTime: Infinity
  });
  return result;
};

export const getReference = ({ id, entities }: FilterQueryInputType) => {
  const { data } = getReferences({ entities });
  return data?.find(row => row.id === id);
};

export const postReference = ({ entities }: FilterQueryInputType) => {
  const mutation = trpc.reference.post.useMutation();
  return mutation;
};

export const deleteReference = ({ entities }: FilterQueryInputType) => {
  const mutation = trpc.reference.delete.useMutation({
    onSuccess: ({ id }) => {
      SetQueryDataDeleted({
        queryKey: { entities },
        routerKey: 'reference',
        filterQuery: { id }
      });
    }
  });

  return mutation;
};
