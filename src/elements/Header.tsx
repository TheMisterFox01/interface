import { useState } from 'react';

import Toolbar from '@material-ui/core/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '../components/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';

import Logo from './Logo';
import LogInButtonGroup from './LogInButtonGroup';
import PagesLinkGroup from './PagesLinkGroup';

const Header = (): JSX.Element => {
  const styles = useStyles();
  const theme = useTheme();
  const matchesLG = useMediaQuery(theme.breakpoints.up('lg'));

  const [isMenuOpen, setIsMenuOpen] = useState(matchesLG);

  const handleOpenMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {matchesLG && (
        <div className={styles.appBar}>
          <Toolbar className={styles.toolbarRoot}>
            <PagesLinkGroup isMobile={false} />
            <LogInButtonGroup />
          </Toolbar>
        </div>
      )}
      {!matchesLG && (
        <div className={styles.appBar + ' ' + (isMenuOpen ? styles.appBarOpened : '')}>
          <Toolbar className={styles.toolbarRoot}>
            <IconButton size="zero">
              {isMenuOpen ? (
                <CloseIcon
                  sx={{ color: theme.palette.common.black, fontSize: '48px' }}
                  onClick={handleOpenMenu}
                />
              ) : (
                <MenuIcon
                  sx={{ color: theme.palette.common.black, fontSize: '48px' }}
                  onClick={handleOpenMenu}
                />
              )}
            </IconButton>
          </Toolbar>
          {isMenuOpen && (
            <div className={styles.openedMenu}>
              <PagesLinkGroup isMobile={true} />
              <LogInButtonGroup />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Header;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      appBar: {
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'column',
      },
      appBarOpened: {
        position: 'fixed',
        zIndex: 100,
      },
      toolbarRoot: {
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexFlow: 'row',
        padding: '25px',
        height: '64px',
        zIndex: 1000,
        [theme.breakpoints.up('lg')]: {
          width: '1200px',
          padding: '25px',
        },
        [theme.breakpoints.down('md')]: {
          width: '100%',
          padding: '10px',
          boxSizing: 'border-box',
          minHeight: '84px',
        },
      },
      openedMenu: {
        height: '100vh',
        width: '100vw',
        background: theme.palette.background.default,
        paddingTop: '80px',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
    }),
  { name: 'Header' },
);
