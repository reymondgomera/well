import { Dialog } from '@mui/material';

import { FormPropsType } from '@/utils/common.type';
import { usePatientFormStore } from '@/stores/patient.store';
import PatientInfoForm from './PatientInfoForm';

const DialogScroll = ({ formId, maxWidth }: FormPropsType) => {
  const { showDialog } = usePatientFormStore();
  return (
    <Dialog open={showDialog} scroll='paper' fullWidth maxWidth={maxWidth ? maxWidth : 'md'}>
      <PatientInfoForm formId={formId} />
    </Dialog>
  );
};

export default DialogScroll;
