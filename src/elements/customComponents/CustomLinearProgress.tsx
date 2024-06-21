import LinearProgress from '@mui/material/LinearProgress';
import { styled } from '@material-ui/core/styles';

const CustomLinearProgress = styled(LinearProgress)(({ theme }) => ({
  '&.MuiLinearProgress-root': {
    backgroundColor: 'initial',
  },
  '& .MuiLinearProgress-bar': {
    backgroundColor: theme.palette.primary.main,
  },
}));

export default CustomLinearProgress;
