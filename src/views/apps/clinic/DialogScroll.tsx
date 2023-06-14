import { Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';

import Icon from '@/@core/components/icon';

import ClinicInfoForm from './ClinicInfoForm';
import { FormPropsType } from '@/utils/common.type';
import { useClinicFormStore } from '@/stores/clinic.store';

const DialogScroll = ({ formId, maxWidth }: FormPropsType) => {
  const { onClosing, showDialog, dialogTitle, isSaving } = useClinicFormStore();

  const handleClose = () => onClosing();

  return (
    <Dialog open={showDialog} scroll='paper' fullWidth maxWidth={maxWidth ? maxWidth : 'md'}>
      <DialogTitle id='scroll-dialog-title'>{dialogTitle} Clinic</DialogTitle>
      <DialogContent dividers>
        <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
          <Icon icon='mdi:close' />
        </IconButton>

        <ClinicInfoForm formId={formId} />

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
