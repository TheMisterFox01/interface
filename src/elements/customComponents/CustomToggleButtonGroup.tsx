import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled } from '@material-ui/core/styles';

const CustomToggleButtonGroup = styled(ToggleButtonGroup)(() => ({
  '& .MuiToggleButtonGroup-grouped': {
    background: '#D9D9D9',
    '&:nth-child(1)': {
      minWidth: '50px',
      '&.Mui-selected': {
        color: '#fff',
        background: '#2E7D32',
      },
    },
    '&:nth-child(2)': {
      '&.Mui-selected': {
        color: '#fff',
        background: '#D32F2F',
      },
      '&.Mui-disabled': {
        background: '#D9D9D9',
      },
    },
  },
}));

export default CustomToggleButtonGroup;
