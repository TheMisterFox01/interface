import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@material-ui/core/styles';

const CustomFormControlLabel = styled(FormControlLabel)(() => ({
  '& .MuiTypography-root': {
    fontFamily: 'Montserrat, sans-serif',
  },
}));

export default CustomFormControlLabel;
