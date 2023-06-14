import { SyntheticEvent, useCallback, useState } from 'react';

import { Box, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { TreeItem, TreeView, TreeItemProps } from '@mui/lab';

import Icon from 'src/@core/components/icon';

import { getEntities } from '@/server/hooks/entity';
import { useReferenceFormStore } from '@/stores/reference.store';

type StyledTreeItemProps = TreeItemProps & {
  labelText: string;
  labelIcon: string;
  labelInfo?: string;
};

// Styled TreeItem component
const StyledTreeItemRoot = styled(TreeItem)<TreeItemProps>(({ theme }) => ({
  '&:hover > .MuiTreeItem-content:not(.Mui-selected)': {
    backgroundColor: theme.palette.action.hover
  },
  '& .MuiTreeItem-content': {
    paddingRight: theme.spacing(3),
    borderTopRightRadius: theme.spacing(3),
    borderBottomRightRadius: theme.spacing(3),
    fontWeight: theme.typography.fontWeightMedium
  },
  '& .MuiTreeItem-label': {
    fontWeight: 'inherit',
    paddingRight: theme.spacing(3)
  },
  '& .MuiTreeItem-group': {
    marginLeft: 0,
    '& .MuiTreeItem-content': {
      paddingLeft: theme.spacing(4),
      fontWeight: theme.typography.fontWeightRegular,
      fontSize: theme.typography.subtitle1
    }
  }
}));

const StyledTreeItem = (props: StyledTreeItemProps) => {
  // ** Props
  const { labelText, labelIcon, labelInfo, ...other } = props;

  return (
    <StyledTreeItemRoot
      {...other}
      label={
        <Box sx={{ py: 1, display: 'flex', alignItems: 'center', '& svg': { mr: 1 } }}>
          <Icon icon={labelIcon} color='inherit' />
          <Typography variant='body2' sx={{ flexGrow: 1, fontWeight: 'inherit', fontSize: 'inherit' }}>
            {labelText}
          </Typography>
          {labelInfo ? (
            <Typography variant='caption' color='inherit'>
              {labelInfo}
            </Typography>
          ) : null}
        </Box>
      }
    />
  );
};

const TreeViewReference = () => {
  const { setEntityId } = useReferenceFormStore();

  const ExpandIcon = <Icon icon={'mdi:chevron-right'} />;

  const [value, setValue] = useState<string>('');

  const handleFilter = useCallback((val: string) => {
    setValue(val);
  }, []);

  const { data: entitiesData } = getEntities();

  const handleSelect = (event: SyntheticEvent, nodeIds: string) => {
    setEntityId(+nodeIds);
  };

  return (
    <>
      <TreeView
        sx={{
          backgroundColor: 'rgb(255, 255, 255)',
          width: 300,
          display: 'block',
          position: 'static',
          borderRight: '1px solid rgba(76, 78, 100, 0.12)',
          zIndex: 1,
          marginRight: 0.1
        }}
        defaultExpanded={['0']}
        defaultExpandIcon={ExpandIcon}
        defaultCollapseIcon={<Icon icon='mdi:chevron-down' />}
        onNodeSelect={handleSelect}
      >
        <TextField
          fullWidth
          size='small'
          placeholder='Search'
          sx={{ padding: 4, mt: 1, mb: 1 }}
          value={value}
          onChange={e => handleFilter(e.target.value)}
        />

        {entitiesData
          ?.filter(row => row.isParent === true)
          .map(parent => {
            const childCount = entitiesData?.filter(
              row => row.parent?.id === parent.id && row.code.toLowerCase().includes(value.toLowerCase())
            );

            if (childCount.length > 0) {
              return (
                <StyledTreeItem
                  key={parent.code}
                  nodeId={parent.code}
                  labelText={parent.name}
                  labelIcon='mdi:account-supervisor-outline'
                >
                  {entitiesData
                    ?.filter(
                      child =>
                        child.parent?.id === parent.id &&
                        child.isShow === true &&
                        child.isParent === false &&
                        child.code.toLowerCase().includes(value.toLowerCase())
                    )
                    .map(child => (
                      <StyledTreeItem
                        key={child.code}
                        nodeId={child.id!.toString()}
                        labelText={child.name}
                        labelIcon='mdi:account-supervisor-outline'
                      />
                    ))}
                </StyledTreeItem>
              );
            }
          })}
      </TreeView>
    </>
  );
};

export default TreeViewReference;
