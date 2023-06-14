import { useState } from 'react';

import Link from 'next/link';

import { Grid, Card, IconButton, Typography, Box, Tooltip } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import CustomChip from 'src/@core/components/mui/chip';
import CustomAvatar from 'src/@core/components/mui/avatar';
import Icon from 'src/@core/components/icon';
import { getInitials } from 'src/@core/utils/get-initials';
import { ThemeColor } from 'src/@core/layouts/types';

import { ClinicsType, UsersType } from '@/utils/db.type';
import ClinicViewUsersTableHeader from './ClinicViewUsersTableHeader';

interface UserStatusType {
  [key: string]: ThemeColor;
}

interface CellType {
  row: UsersType;
}

interface ClinicViewUsersTableListPropsType {
  clinicData: ClinicsType;
  usersData: UsersType[];
}

const userStatusObj: UserStatusType = {
  active: 'success',
  blocked: 'error',
  deactivated: 'secondary'
};

// ** renders client column
const renderClient = (row: UsersType) => {
  if (row.avatars?.length) {
    return <CustomAvatar src={row.avatars} sx={{ mr: 3, width: 34, height: 34 }} />;
  } else {
    return (
      <CustomAvatar skin='light' color={row.avatarColor} sx={{ mr: 3, width: 42, height: 42, fontSize: '1rem' }}>
        {getInitials(`${row.firstName.toUpperCase()}`)}
      </CustomAvatar>
    );
  }
};

const ClinicViewUsersTableList = ({ clinicData, usersData }: ClinicViewUsersTableListPropsType) => {
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
      minWidth: 230,
      field: 'fullName',
      headerName: 'User',
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row)}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'column'
              }}
            >
              <Typography
                noWrap
                component={Link}
                variant='subtitle2'
                href={`/apps/clinic/${clinicData.id}/user/${row.id}`}
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  textDecoration: 'none',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {row.firstName} {row.lastName}
              </Typography>
              <Typography noWrap variant='caption'>
                {`@${row.userName}`}
              </Typography>
            </Box>
          </Box>
        );
      }
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'email',
      headerName: 'Email',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography variant='body2' noWrap>
            {row.email}
          </Typography>
        );
      }
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }: CellType) => {
        return row && row.status ? (
          <CustomChip
            skin='light'
            size='small'
            label={row.status.name}
            color={userStatusObj[row.status.code.toLowerCase()]}
            sx={{ textTransform: 'capitalize' }}
          />
        ) : null;
      }
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='View Checkup'>
            <IconButton size='small' component={Link} href={`/apps/clinic/${clinicData.id}/user/${row.id}`}>
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
          <ClinicViewUsersTableHeader />

          <DataGrid
            autoHeight
            rows={usersData && usersData.length > 0 ? usersData : []}
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

export default ClinicViewUsersTableList;
