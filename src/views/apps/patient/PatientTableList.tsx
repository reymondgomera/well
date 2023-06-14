import { MouseEvent, useEffect, useState } from 'react';

import Link from 'next/link';

import { Menu, Grid, Card, Box, MenuItem, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import Icon from 'src/@core/components/icon';

import toast from 'react-hot-toast';
import moment from 'moment';

import { deletePatient, getPatients } from '@/server/hooks/patient';
import { PatientsType } from '@/utils/db.type';
import PatientTableHeader from './PatientTableHeader';
import PatientDialogScroll from './DialogScroll';
import CheckupDialogScroll from '@/views/apps/checkup/DialogScroll';
import { usePatientFormStore } from '@/stores/patient.store';
import { useCheckupFormStore } from '@/stores/checkup.store';
import CanView from '@/layouts/components/acl/CanView';
import { supabase } from '@/utils/supabase';
import { InvalidateQueries } from '@/utils/rq.context';

interface PatientGenderType {
  [key: string]: { icon: string; color: string };
}

interface CellType {
  row: PatientsType;
}

const patientGenderObj: PatientGenderType = {
  male: { icon: 'mdi:gender-male', color: 'info.main' },
  female: { icon: 'mdi:gender-female', color: 'error.light' }
};

const RowOptions = ({ id }: { id: number }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const rowOptionsOpen = Boolean(anchorEl);

  const { onEdit } = usePatientFormStore();
  const { onAdd } = useCheckupFormStore();
  const { mutate: deletePatientMutate } = deletePatient();

  const handleRowOptionsClick = (e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleRowOptionsClose = () => setAnchorEl(null);

  const handleEdit = (id: number) => onEdit(id);
  const handleDelete = (id: number) => {
    deletePatientMutate(
      { id, module: 'Patient' },
      {
        onSuccess: data => toast.success(data.message),
        onError: err => toast.error(`Error deleting: ${err}`)
      }
    );
  };
  const handleCheckup = (id: number) => onAdd(id);

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
          href={`/apps/patient/${id}`}
        >
          <Icon icon='mdi:eye-outline' fontSize={20} />
          View
        </MenuItem>
        <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={() => handleEdit(id)}>
          <Icon icon='mdi:pencil-outline' fontSize={20} />
          Edit
        </MenuItem>
        <CanView action='create' subject='checkup-vital-signs'>
          <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={() => handleCheckup(id)}>
            <Icon icon='tabler:checkup-list' fontSize={20} />
            CheckUp
          </MenuItem>
        </CanView>
        <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={() => handleDelete(id)}>
          <Icon icon='mdi:delete-outline' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};

const PatientTableList = () => {
  const { showDialog: patientFormshowDialog, searchFilter } = usePatientFormStore();
  const { showDialog: checkupFormShowDialog } = useCheckupFormStore();

  const { data: patientData, status: patientDataStatus } = getPatients({
    searchFilter
  });

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
      minWidth: 220,
      field: 'fullname',
      headerName: 'Patient',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.lastName}, {row.firstName}
          </Typography>
        );
      }
    },
    {
      flex: 0.08,
      minWidth: 100,
      field: 'gender',
      headerName: 'Gender',
      renderCell: ({ row }: CellType) => {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              '& svg': {
                mr: 3,
                color: patientGenderObj[row.gender.code].color
              }
            }}
          >
            <Icon icon={patientGenderObj[row.gender.code].icon} fontSize={25} />
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.gender.name}
            </Typography>
          </Box>
        );
      }
    },
    {
      flex: 0.05,
      minWidth: 50,
      field: 'age',
      headerName: 'Age',
      description: "Patient's age",
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.age}
          </Typography>
        );
      }
    },
    {
      flex: 0.08,
      minWidth: 100,
      field: 'birthDate',
      headerName: 'Date of Birth',
      description: "Patient's date of birth",
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {moment(row.dateOfBirth).format('L')}
          </Typography>
        );
      }
    },
    {
      flex: 0.08,
      minWidth: 100,
      field: 'civilStatus',
      headerName: 'Civil Status',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.civilStatus.name}
          </Typography>
        );
      }
    },
    {
      flex: 0.08,
      minWidth: 150,
      field: 'occupation',
      headerName: 'Occupation',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.occupation?.name}
          </Typography>
        );
      }
    },
    {
      flex: 0.08,
      minWidth: 100,
      field: 'contactNumber',
      headerName: 'Contact Number',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.contactNumber}
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
      .channel('patient-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Patient' }, payload => {
        InvalidateQueries({ queryKey: {}, routerKey: 'patient' });
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
          <PatientTableHeader />

          <DataGrid
            autoHeight
            loading={patientDataStatus === 'loading'}
            rows={patientData && patientData.length > 0 ? patientData : []}
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

      {patientFormshowDialog ? <PatientDialogScroll formId='patient-form-dialog' maxWidth='lg' /> : null}
      {checkupFormShowDialog ? <CheckupDialogScroll formId='checkup-form-dialog' maxWidth='lg' /> : null}
    </Grid>
  );
};

export default PatientTableList;
