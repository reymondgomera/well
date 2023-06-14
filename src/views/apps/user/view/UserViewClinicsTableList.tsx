import { useState } from 'react';

import Link from 'next/link';

import { Grid, Card, IconButton, Typography, Box, Tooltip } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import Icon from 'src/@core/components/icon';

import { ClinicsType, UsersType } from '@/utils/db.type';
import UserViewClinicsTableHeader from './UserViewClinicsTableHeader';

import moment from 'moment';

interface UserViewClinicsTableListPropsType {
  clinicsData: ClinicsType[];
  userData: UsersType;
}

interface CellType {
  row: ClinicsType;
}

const UserViewClinicsTableList = ({ clinicsData, userData }: UserViewClinicsTableListPropsType) => {
  const [paginationModel, setPaginationModel] = useState<{ pageSize: number; page: number }>({ pageSize: 10, page: 0 });

  const columns: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 150,
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
      minWidth: 150,
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
      minWidth: 200,
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
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='View Checkup'>
            <IconButton size='small' component={Link} href={`/apps/user/${userData.id}/clinic/${row.id}`}>
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
          <UserViewClinicsTableHeader />

          <DataGrid
            autoHeight
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
    </Grid>
  );
};

export default UserViewClinicsTableList;
