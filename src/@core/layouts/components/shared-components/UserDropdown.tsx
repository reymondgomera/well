import { useState, SyntheticEvent, Fragment } from 'react';

import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';

import { Box, Menu, MenuItem, Badge, Avatar, Divider, styled, Typography } from '@mui/material';

import Icon from 'src/@core/components/icon';
import CustomChip from 'src/@core/components/mui/chip';

import { toast } from 'react-hot-toast';

import { Settings } from 'src/@core/context/settingsContext';
import { getClinic } from '@/server/hooks/clinic';

interface Props {
  settings: Settings;
}

const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}));

const UserDropdown = (props: Props) => {
  const { settings } = props;
  const { direction } = settings;

  const { data: session, status } = useSession();
  const clinicData = getClinic({ id: session?.user.clinicId });
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = (url?: string) => {
    if (url) {
      router.push(url);
    }
    setAnchorEl(null);
  };

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      mr: 2,
      fontSize: '1.375rem',
      color: 'text.primary'
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    handleDropdownClose('/login');
    toast.success('Logged out successfully.');
  };

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        <Avatar
          alt={status === 'loading' ? 'Loading...' : session?.user.userName}
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          src='/images/avatars/1.png'
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, mt: 4 } }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: direction === 'ltr' ? 'right' : 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: direction === 'ltr' ? 'right' : 'left'
        }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
            >
              <Avatar
                alt={status === 'loading' ? 'Loading...' : session?.user.userName}
                src='/images/avatars/1.png'
                sx={{ width: '2.5rem', height: '2.5rem' }}
              />
            </Badge>
            <Box
              sx={{
                display: 'flex',
                ml: 3,
                alignItems: 'flex-start',
                flexDirection: 'column'
              }}
            >
              <Typography sx={{ fontWeight: 600 }}>
                {status === 'loading' ? 'Loading...' : session?.user.userName}
              </Typography>
              <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                {status === 'loading' ? 'Loading...' : session?.user.role.name}
              </Typography>
              {clinicData && (
                <CustomChip label={clinicData.code} skin='light' color='primary' size='small' sx={{ mt: 1.5 }} />
              )}
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: '0 !important' }} />
        <MenuItem onClick={handleLogout} sx={{ p: 0 }}>
          <Box sx={styles}>
            <Icon icon='mdi:logout-variant' />
            Logout
          </Box>
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

export default UserDropdown;
