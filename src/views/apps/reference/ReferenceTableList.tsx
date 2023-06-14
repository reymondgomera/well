import { MouseEvent, useEffect, useState } from 'react';

import { Menu, Grid, MenuItem, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import Icon from 'src/@core/components/icon';

import { deleteReference, getReferences } from '@/server/hooks/reference';
import { ReferencesEntityType } from '@/utils/db.type';
import { useReferenceFormStore } from '@/stores/reference.store';
import moment from 'moment';
import { toast } from 'react-hot-toast';
import ReferenceTableHeader from './ReferenceTableHeader';
import { supabase } from '@/utils/supabase';
import { InvalidateQueries } from '@/utils/rq.context';

interface CellType {
  row: ReferencesEntityType;
}

const RowOptions = ({ id }: { id: number }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const rowOptionsOpen = Boolean(anchorEl);

  const { onEdit, entityId } = useReferenceFormStore();
  const { mutate: deleteReferenceMutate, isLoading: deleteReferenceIsLoading } = deleteReference({
    entities: [entityId]
  });

  const handleRowOptionsClick = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleRowOptionsClose = () => setAnchorEl(null);

  const handleEdit = (id: number) => onEdit(id);
  const handleDelete = (id: number) => {
    deleteReferenceMutate(
      { id, module: 'Reference' },
      {
        onSuccess: data => toast.success(data.message),
        onError: err => toast.error(`Error deleting: ${err}`)
      }
    );
  };

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='mdi:dots-vertical' />
      </IconButton>

      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={() => handleEdit(id)}>
          <Icon icon='mdi:pencil-outline' fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={() => handleDelete(id)}>
          <Icon icon='mdi:delete-outline' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};

const ReferenceTableList = () => {
  const { entityId, searchFilter } = useReferenceFormStore();

  const { data: referencesData, status: referencesDataStatus } = getReferences({ entities: [entityId], searchFilter });

  const [paginationModel, setPaginationModel] = useState<{
    pageSize: number;
    page: number;
  }>({
    pageSize: 10,
    page: 0
  });

  const columns: GridColDef[] = [
    {
      flex: 0.2,
      minWidth: 250,
      field: 'createdAt',
      headerName: 'Date',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography variant='body2' noWrap>
            {moment(row.createdAt).format('LL')}
          </Typography>
        );
      }
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'code',
      headerName: 'Code',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography variant='body2' noWrap>
            {row.code}
          </Typography>
        );
      }
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'name',
      headerName: 'Name',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography variant='body2' noWrap>
            {row.name}
          </Typography>
        );
      }
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => <RowOptions id={row.id} />
    }
  ];

  useEffect(() => {
    const channel = supabase
      .channel('reference-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Reference' }, payload => {
        InvalidateQueries({ queryKey: {}, routerKey: 'reference' });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ReferenceTableHeader />

        <DataGrid
          autoHeight
          loading={referencesDataStatus === 'loading'}
          // @ts-ignore
          rows={referencesData && referencesData.length > 0 ? referencesData : []}
          columns={columns}
          disableRowSelectionOnClick
          initialState={{
            pagination: {
              paginationModel: { pageSize: paginationModel.pageSize }
            }
          }}
          pageSizeOptions={[10, 15, 20]}
          onPaginationModelChange={setPaginationModel}
          sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
        />
      </Grid>
    </Grid>
  );
};

export default ReferenceTableList;
