import Snackbar from '@mui/material/Snackbar';
import { styled } from '@material-ui/core/styles';

const CustomSnackbar = styled(Snackbar)(({ theme }) => ({
  '& .MuiSnackbar-root': {
    minWidth: 'fit-content',
  },
  '& .MuiSnackbarContent-root': {
    justifyContent: 'space-evenly',
    color: '#fff',
    fontWeight: 500,
    background: theme.palette.primary.main,
  },
}));

export default CustomSnackbar;
