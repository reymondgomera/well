import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';

import Icon from '@/@core/components/icon';
import CheckupInfoForm from './CheckupInfoForm';

import { useCheckupFormStore, useDiagnosisFormStore, useTreatmentFormStore } from '@/stores/checkup.store';
import { FormPropsType } from '@/utils/common.type';

const DialogScroll = ({ formId, maxWidth }: FormPropsType) => {
  const { onClosing, showDialog, dialogTitle, isSaving, setTabsValue } = useCheckupFormStore();

  const { clear: clearDiagnoses } = useDiagnosisFormStore();
  const { clear: clearTreatments } = useTreatmentFormStore();

  const handleClose = () => {
    clearDiagnoses();
    clearTreatments();
    onClosing();
    setTabsValue('1');
  };

  return (
    <Dialog open={showDialog} scroll='paper' fullWidth maxWidth={maxWidth ? maxWidth : 'md'}>
      <DialogTitle id='scroll-dialog-title'>{dialogTitle} Checkup</DialogTitle>
      <DialogContent dividers>
        <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
          <Icon icon='mdi:close' />
        </IconButton>

        <CheckupInfoForm formId={formId} />

        <DialogActions
          sx={{
            px: 0,
            pb: 0,
            pt: theme => `${theme.spacing(5)} !important`
          }}
        >
          <Button variant='outlined' color='secondary' onClick={() => handleClose()}>
            Cancel
          </Button>
          <Button form={formId} variant='contained' disabled={isSaving} type='submit'>
            Submit
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default DialogScroll;
