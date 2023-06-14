import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useSettings } from 'src/@core/hooks/useSettings';

import SidebarLeft from './SidebarLeft';
import ReferenceTableList from './ReferenceTableList';
import DialogScroll from './DialogScroll';
import { useReferenceFormStore } from '@/stores/reference.store';

const ReferenceLayout = () => {
  const theme = useTheme();
  const { skin } = useSettings().settings;

  const { entityId, showDialog } = useReferenceFormStore();

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: 500,
        display: 'flex',
        borderRadius: 1,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: skin === 'bordered' ? 0 : 6,
        ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` }),
        backgroundColor: 'rgb(255, 255, 255)'
      }}
    >
      <SidebarLeft />

      {entityId ? <ReferenceTableList /> : null}

      {entityId && showDialog ? <DialogScroll formId='reference-form-dialog' /> : null}
    </Box>
  );
};

export default ReferenceLayout;
