import ToggleButton from '@mui/material/ToggleButton';
import { styled } from '@material-ui/core/styles';

const CustomToggleButton = styled(ToggleButton)(() => ({
  '&.MuiButtonBase-root': {
    '&.MuiToggleButton-root': {
      '&.Mui-selected': {
        backgroundColor: 'red',
      },
      '&.Mui-disabled': {
        color: 'red',
      },
    },
  },
}));

export default CustomToggleButton;
