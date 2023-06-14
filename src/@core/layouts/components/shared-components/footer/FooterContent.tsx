// ** MUI Imports
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Typography>
        © {new Date().getFullYear()}, Made by <Link href='http://boredguyscorp.com/'>TheBoredGuys Corp.</Link>
      </Typography>
    </Box>
  );
};

export default FooterContent;
