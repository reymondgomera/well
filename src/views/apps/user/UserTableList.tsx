import { MouseEvent, useEffect, useState } from 'react';

import Link from 'next/link';

import { Menu, Grid, Card, Box, MenuItem, IconButton, Typography, Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import CustomChip from 'src/@core/components/mui/chip';
import CustomAvatar from 'src/@core/components/mui/avatar';
import Icon from 'src/@core/components/icon';
import { getInitials } from 'src/@core/utils/get-initials';
import { ThemeColor } from 'src/@core/layouts/types';

import toast from 'react-hot-toast';

import { deleteUser, getUsers } from '@/server/hooks/user';
import { UsersType } from '@/utils/db.type';
import { useUserFormStore } from '@/stores/user.store';
import UserTableHeader from './UserTableHeader';
import DialogScroll from './DialogScroll';
import { supabase } from '@/utils/supabase';
import { InvalidateQueries } from '@/utils/rq.context';

interface UserRoleType {
  [key: string]: { icon: string; color: string };
}

interface UserStatusType {
  [key: string]: ThemeColor;
}

interface CellType {
  row: UsersType;
}

const userRoleObj: UserRoleType = {
  admin: { icon: 'mdi:laptop', color: 'error.main' },
  user: { icon: 'mdi:account-outline', color: 'primary.main' },
  physician: { icon: 'mdi:doctor', color: 'warning.main' },
  receptionist: { icon: 'uil:user-md', color: 'success.main' }
};

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

const RowOptions = ({ id }: { id: number }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const rowOptionsOpen = Boolean(anchorEl);

  const { onEdit } = useUserFormStore();
  const { mutate: deleteUserMutate } = deleteUser();

  const handleRowOptionsClick = (e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleRowOptionsClose = () => setAnchorEl(null);

  const handleEdit = (id: number) => onEdit(id);
  const handleDelete = (id: number) => {
    deleteUserMutate(
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
          href={`/apps/user/${id}`}
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

const UserTableList = () => {
  const { showDialog, searchFilter } = useUserFormStore();

  const { data: usersData, status: usersDataStatus } = getUsers({ searchFilter });

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
                href={`/apps/user/${row.id}`}
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
      flex: 0.15,
      minWidth: 150,
      field: 'role.code',
      headerName: 'Role',
      renderCell: ({ row }: CellType) => {
        return row && row.role ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              '& svg': { mr: 3, color: userRoleObj[row.role.code].color }
            }}
          >
            <Icon icon={userRoleObj[row.role.code].icon} fontSize={20} />
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.role.name}
            </Typography>
          </Box>
        ) : null;
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'department',
      headerName: 'Department',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='subtitle1' sx={{ textTransform: 'capitalize' }}>
            {row.department?.name}
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
      renderCell: ({ row }: CellType) => <RowOptions id={row.id} />
    }
  ];

  useEffect(() => {
    const channel = supabase
      .channel('user-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'User' }, payload => {
        InvalidateQueries({ queryKey: {}, routerKey: 'user' });
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
          <UserTableHeader />

          <DataGrid
            autoHeight
            loading={usersDataStatus === 'loading'}
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

      {showDialog ? <DialogScroll formId='user-form-dialog' /> : null}
    </Grid>
  );
};

export default UserTableList;
