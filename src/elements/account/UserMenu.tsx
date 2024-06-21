import { useRouter } from 'next/router';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@material-ui/core/styles';

import { createStyles, makeStyles } from '@material-ui/core/styles';

import { postData, LOGOUT_PATH, getToken } from 'utils';
import store from 'store/store';
import CustomSwitch from 'elements/customComponents/CustomSwitcher';

type UserMenuProps = {
  anchorEl: null | HTMLElement;
  handleCloseUserMenu: () => void;
};

const UserMenu = (props: UserMenuProps): JSX.Element => {
  const style = useStyle();
  const { anchorEl, handleCloseUserMenu } = props;
  const theme = useTheme();
  const router = useRouter();

  const logout = () => {
    handleLogout();
    handleCloseUserMenu();
  };
  const isDarkTheme = theme.palette.type === 'dark';

  const handleChangeTheme = () => {
    store.toggleColorMode();
    handleCloseUserMenu();
  };

  const handleLogout = async () => {
    const token = await getToken();
    await postData(LOGOUT_PATH, {
      token,
    });

    store.clear();
    router.push('/');
  };

  return (
    <Menu
      className={style.content}
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleCloseUserMenu}
    >
      <MenuItem onClick={handleCloseUserMenu}>Account</MenuItem>
      <MenuItem onClick={logout}>Logout</MenuItem>
      <MenuItem onClick={handleChangeTheme}>
        <CustomSwitch checked={isDarkTheme} />
        Dark theme
      </MenuItem>
    </Menu>
  );
};

export default UserMenu;

const useStyle = makeStyles(
  (theme) =>
    createStyles({
      content: {
        '& .MuiPaper-root': {
          background: theme.palette.background.default,
          color: theme.palette.text.primary,
        },
      },
    }),
  { name: 'UserMenu' },
);
