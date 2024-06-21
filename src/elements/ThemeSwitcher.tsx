import IconButton from '../components/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import { useTheme, createStyles, makeStyles } from '@material-ui/core/styles';

import store from '../store/store';

const ThemeSwitcher = (props: Record<string, unknown>) => {
  const { colorType } = props;
  const theme = useTheme();
  const styles = useStyles();
  const themeSwitcherStyle = colorType === 'light' ? styles.themeSwitcherLight : styles.themeSwitcherDark;
  return (
    <IconButton className={styles.content} onClick={() => store.toggleColorMode()}>
      {theme.palette.type === 'dark' ? (
        <Brightness7Icon className={themeSwitcherStyle} />
      ) : (
        <Brightness4Icon className={themeSwitcherStyle} />
      )}
    </IconButton>
  );
};

export default ThemeSwitcher;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      content: {
        marginLeft: '8px',
        marginRight: '8px'
      },
      themeSwitcherLight: {
        color: '#fff',
      },
      themeSwitcherDark: {
        color: theme.palette.text.primary,
      },
    }),
  { name: 'ThemeSwitcher' },
);
