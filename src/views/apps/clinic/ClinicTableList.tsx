import { MouseEvent, useEffect, useState } from 'react';

import Link from 'next/link';

import { Menu, Grid, Card, MenuItem, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import Icon from 'src/@core/components/icon';

import toast from 'react-hot-toast';
import moment from 'moment';

import { deleteClinic, getClinics } from '@/server/hooks/clinic';
import { ClinicsType } from '@/utils/db.type';
import ClinicTableHeader from './ClinicTableHeader';
import DialogScroll from './DialogScroll';
import { useClinicFormStore } from '@/stores/clinic.store';
import { supabase } from '@/utils/supabase';
import { InvalidateQueries } from '@/utils/rq.context';

interface CellType {
  row: ClinicsType;
}

const RowOptions = ({ id }: { id: number }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const rowOptionsOpen = Boolean(anchorEl);

  const { onEdit } = useClinicFormStore();
  const { mutate: deleteClinicMutate } = deleteClinic();

  const handleRowOptionsClick = (e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleRowOptionsClose = () => setAnchorEl(null);

  const handleEdit = (id: number) => onEdit(id);
  const handleDelete = (id: number) => {
    deleteClinicMutate(
      { id },
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
        <MenuItem
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          onClick={handleRowOptionsClose}
          href={`/apps/clinic/${id}`}
        >
          <Icon icon='mdi:eye-outline' fontSize={20} />
          View
        </MenuItem>
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

const ClinicTableList = () => {
  const { showDialog, searchFilter } = useClinicFormStore();

  const { data: clinicsData, status: clinicsDataStatus } = getClinics({ searchFilter });

  const [paginationModel, setPaginationModel] = useState<{
    pageSize: number;
    page: number;
  }>({
    pageSize: 10,
    page: 0
  });

  const columns: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 200,
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
      flex: 0.1,
      minWidth: 200,
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
      minWidth: 150,
      field: 'daysOpen',
      headerName: 'Days Open',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography variant='body2' noWrap>
            {row.daysOpen}
          </Typography>
        );
      }
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: 'openingClosingTime',
      headerName: 'Business Hours',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography variant='body2' noWrap>
            {`${moment(row.openingTime).format('LT')} - ${moment(row.closingTime).format('LT')}`}
          </Typography>
        );
      }
    },
    {
      minWidth: 90,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => <RowOptions id={row.id} />
    }
  ];

  useEffect(() => {
    const channel = supabase
      .channel('clinic-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Clinic' }, payload => {
        InvalidateQueries({ queryKey: {}, routerKey: 'clinic' });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <ClinicTableHeader />

          <DataGrid
            autoHeight
            loading={clinicsDataStatus === 'loading'}
            rows={clinicsData && clinicsData.length > 0 ? clinicsData : []}
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
        </Card>
      </Grid>

      {showDialog ? <DialogScroll formId='clinic-form-dialog' /> : null}
    </Grid>
  );
};

export default ClinicTableList;
