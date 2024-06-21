import Switch from '@mui/material/Switch';
import { styled } from '@material-ui/core/styles';

const CustomSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase': {
    color: '#FAFAFA',
    '&.Mui-checked': {
      color: theme.palette.primary.main,
      '& + .MuiSwitch-track': {
        backgroundColor: '#9BD1FC',
      },
    },
  },
  '&.MuiSwitch-root': {
    '& .MuiSwitch-track': {
      backgroundColor: '#9E9E9E',
      opacity: 1,
    },
  },
}));

export default CustomSwitch;
