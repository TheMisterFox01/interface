import { useRouter } from 'next/router';

import Button from '../components/Button';
import { Stack } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { createStyles, makeStyles } from '@material-ui/core/styles';

const LogInButtonGroup = (): JSX.Element => {
  const styles = useStyles();
  const router = useRouter();
  return (
    <Stack direction="row" alignItems="center" spacing={2} className={styles.loginButtonsMobile}>
      <Button
        variant="outlined"
        className={`${styles.button}`}
        onClick={() => {
          router.push('/login');
        }}
      >
        LOG IN
      </Button>
      <Button
        variant="contained"
        className={`${styles.button}`}
        onClick={() => {
          router.push('/signup');
        }}
      >
        SIGN UP <ArrowForwardIcon fontSize="small" className={styles.icon} />
      </Button>
    </Stack>
  );
};

export default LogInButtonGroup;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      button: {
        fontWeight: 500,
        fontSize: '15px',
      },
      icon: {
        marginLeft: '8px',
      },
      loginButtonsMobile: {
        [theme.breakpoints.down('md')]: {
          marginTop: '40px',
        },
      },
    }),
  { name: 'LogInButtonGroup' },
);
