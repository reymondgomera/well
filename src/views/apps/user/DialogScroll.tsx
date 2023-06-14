import { Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';

import Icon from '@/@core/components/icon';

import UserInfoForm from './UserInfoForm';
import { FormPropsType } from '@/utils/common.type';
import { useUserFormStore } from '@/stores/user.store';

const DialogScroll = ({ formId, maxWidth }: FormPropsType) => {
  const { onClosing, showDialog, dialogTitle, isSaving } = useUserFormStore();

  const handleClose = () => onClosing();

  return (
    <Dialog open={showDialog} scroll='paper' fullWidth maxWidth={maxWidth ? maxWidth : 'md'}>
      <DialogTitle id='scroll-dialog-title'>{dialogTitle} User</DialogTitle>
      <DialogContent dividers>
        <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
          <Icon icon='mdi:close' />
        </IconButton>

        <UserInfoForm formId={formId} />

        <DialogActions
          sx={{
            px: 0,
            pb: 0,
            pt: theme => `${theme.spacing(5)} !important`
          }}
        >
          <Button onClick={handleClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button type='submit' form={formId} disabled={isSaving} variant='contained'>
            Submit
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default DialogScroll;
