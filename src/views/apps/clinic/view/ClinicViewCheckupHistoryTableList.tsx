import { useState } from 'react';

import Link from 'next/link';

import { Grid, Card, IconButton, Typography, Box, Tooltip } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import CustomChip from '@/@core/components/mui/chip';
import Icon from 'src/@core/components/icon';
import { ThemeColor } from '@/@core/layouts/types';

import moment from 'moment';

import { ClinicsType, CheckupsType } from '@/utils/db.type';
import ClinicViewCheckupHistoryTableHeader from './ClinicViewCheckupHistoryTableHeader';

interface CheckupStatusType {
  [key: string]: ThemeColor;
}

interface CellType {
  row: CheckupsType;
}

interface ClinicViewCheckupHistoryTableListPropsType {
  clinicData: ClinicsType;
  ClinicCheckupsData: CheckupsType[];
}

const checkupStatusObj: CheckupStatusType = {
  pending: 'warning',
  completed: 'success',
  cancelled: 'error'
};

const ClinicViewCheckupHistoryTableList = ({
  clinicData,
  ClinicCheckupsData
}: ClinicViewCheckupHistoryTableListPropsType) => {
  const [paginationModel, setPaginationModel] = useState<{ pageSize: number; page: number }>({ pageSize: 10, page: 0 });

  const columns: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 150,
      headerName: 'Date',
      field: 'createdAt',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {moment(row.createdAt).format('LL')}
          </Typography>
        );
      }
    },
    {
      flex: 0.1,
      minWidth: 200,
      headerName: 'Patient',
      field: 'patient',
      renderCell: ({ row }: CellType) => {
        const {
          patient: { firstName, lastName }
        } = row;

        return (
          <Typography noWrap variant='body2'>
            {firstName} {lastName}
          </Typography>
        );
      }
    },
    {
      flex: 0.1,
      minWidth: 200,
      headerName: 'Physician',
      field: 'physician',
      renderCell: ({ row }: CellType) => {
        const {
          physician: { firstName, lastName }
        } = row;

        return (
          <Typography noWrap variant='body2'>
            {firstName} {lastName}
          </Typography>
        );
      }
    },
    {
      flex: 0.08,
      minWidth: 120,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }: CellType) => {
        return row && row.status ? (
          <CustomChip
            skin='light'
            size='small'
            label={row.status.name}
            color={checkupStatusObj[row.status.code.toLowerCase()]}
            sx={{ textTransform: 'capitalize' }}
          />
        ) : null;
      }
    },
    {
      flex: 0.08,
      minWidth: 90,
      headerName: 'Actions',
      field: 'actions',
      description: 'Actions to perform',
      sortable: false,
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='View Checkup'>
            <IconButton size='small' component={Link} href={`/apps/clinic/${clinicData.id}/checkup/${row.id}`}>
              <Icon icon='mdi:eye-outline' fontSize={20} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <ClinicViewCheckupHistoryTableHeader />

          <DataGrid
            autoHeight
            rows={ClinicCheckupsData && ClinicCheckupsData.length > 0 ? ClinicCheckupsData : []}
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
    </Grid>
  );
};

export default ClinicViewCheckupHistoryTableList;
