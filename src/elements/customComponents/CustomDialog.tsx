import Dialog from '@mui/material/Dialog';
import { styled } from '@material-ui/core/styles';

const CustomDialog = styled(Dialog)(() => ({
  '& 	.MuiDialog-paper': {
    borderRadius: '16px',
    boxShadow:
      'rgba(0, 0, 0, 0.2) 0px 7px 8px -4px, rgba(0, 0, 0, 0.14) 0px 12px 17px 2px, rgba(0, 0, 0, 0.12) 0px 5px 22px 4px',
  },
  '& .MuiDialog-container': {
    overflow: 'auto',
  },
}));

export default CustomDialog;
