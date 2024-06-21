import { useState, useRef } from 'react';

import ListItemButton from '@mui/material/ListItemButton';
import LanguageIcon from '@mui/icons-material/Language';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ListItemText from '@mui/material/ListItemText';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';

import UserMenu from './UserMenu';
import AccountBalance from './AccountBalance';

const SupportMenu = ({
  userEmail,
  className,
}: {
  userEmail: string;
  className: string;
}): JSX.Element => {
  const styles = useStyles();
  const theme = useTheme();

  const menuItemRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (): void => {
    setAnchorEl(menuItemRef.current);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div className={className + ' ' + styles.content}>
        <AccountBalance isWhite={ theme.palette.type !== 'light' } isForPhone={false} />
        <ListItemButton className={styles.menuButton + ' ' + styles.menuButtonDisabled}>
          <div className={styles.center}>
            <NotificationsIcon sx={{ color: 'inherit' }} />
            <ArrowDropDownIcon sx={{ color: 'inherit', mx: '5px' }} />
          </div>
        </ListItemButton>
        <ListItemButton className={styles.menuButton + ' ' + styles.menuButtonDisabled}>
          <div className={styles.center}>
            <LanguageIcon sx={{ color: 'inherit' }} />
            <ListItemText
              sx={{ ml: '14px' }}
              className={styles.userMenuText}
              primary="English/USD"
            />
            <ArrowDropDownIcon sx={{ color: 'inherit', mx: '5px' }} />
          </div>
        </ListItemButton>
        <ListItemButton
          ref={menuItemRef}
          className={styles.menuButton}
          onClick={handleOpenUserMenu}
        >
          <div className={styles.center}>
            <AccountCircleOutlinedIcon sx={{ color: 'inherit' }} />
            <ListItemText sx={{ ml: '14px' }} className={styles.userMenuText} primary={userEmail} />
            <ArrowDropDownIcon sx={{ color: 'inherit', mx: '5px' }} />
          </div>
        </ListItemButton>
      </div>
      <UserMenu anchorEl={anchorEl} handleCloseUserMenu={handleCloseUserMenu} />
    </>
  );
};

export default SupportMenu;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      content: {
        background: (theme.palette.type === 'light' ? (theme.palette.custom.trueWhite  + ' !important') : theme.palette.secondary.main)
      },
      center: {
        display: 'flex',
        alignItems: 'center'
      },
      menuButton: {
        display: 'flex',
        justifyContent: 'flex-start',
        width: 'max-content',
        height: '48px',
        maxHeight: '48px',
        minHeight: '48px',
        paddingLeft: '10px !important',
        paddingRight: '10px !important',
      },
      userMenuText: {
        width: 'min-content',
        color: 'inherit',
        fontSize: '16px',
        display: 'flex',
        '& .MuiListItemText-primary': {
          fontWeight: '400',
          fontFamily: 'Montserrat, sans-serif',
        },
      },
      menuButtonDisabled: {
        opacity: 0.5,
        pointerEvents: 'none',
      },
    }),
  { name: 'SupportMenu' },
);
