import { useState, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import useMediaQuery from '@mui/material/useMediaQuery';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import IconButton from 'components/IconButton';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';

import SupportMenu from './SupportMenu';
import AccountBalance from './AccountBalance';
import bitsidyDark from 'public/bitsidyDark.svg';
import bitsidyBlack from 'public/bitsidyBlack.svg';
import logoDark from 'public/logoDark.svg';

type AccountMenuProps = {
  userEmail: string;
  current: string;
};

type ListItemsProps = {
  current: string;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
  isPhone: boolean;
  styles: any;
};

const ListItems = (props: ListItemsProps): JSX.Element => {
  const { current, setIsMenuOpen, isPhone, styles } = props;
  const router = useRouter();
  const theme = useTheme();

  const handleOpenPage = async (path: string) => {
    setIsMenuOpen(false);

    if (isPhone) {
      // wait until menu close
      await new Promise((r) => setTimeout(r, 210));
    }

    router.push(path);
  };

  const itemColor =
    theme.palette.type === 'light'
      ? theme.palette.custom.trueBlack
      : theme.palette.custom.trueWhite;
  const itemActiveColor =
    theme.palette.type === 'light' ? theme.palette.custom.blue : theme.palette.custom.trueWhite;
  const itemBackgroundActiveColor =
    theme.palette.type === 'light' ? theme.palette.custom.trueWhite : theme.palette.action.active;

  return (
    <>
      <ListItemButton
        className={styles.menuButton}
        sx={{ background: current === 'account' ? itemBackgroundActiveColor : 'inherit' }}
        onClick={() => handleOpenPage('/account')}
      >
        <ListItemText
          className={styles.menuText}
          primary={
            <div className={styles.listItemInner}>
              <div className={styles.listItemInnerIcon}>
                <AccountBalanceWalletOutlinedIcon
                  sx={{ color: current === 'account' ? itemActiveColor : itemColor }}
                />
              </div>
              <div style={{ color: current === 'account' ? itemActiveColor : itemColor }}>Home</div>
            </div>
          }
        />
      </ListItemButton>

      <ListItemButton
        className={styles.menuButton}
        sx={{ background: current === 'store' ? itemBackgroundActiveColor : 'inherit' }}
        onClick={() => handleOpenPage('/account/store')}
      >
        <ListItemText
          className={styles.menuText}
          primary={
            <div className={styles.listItemInner}>
              <div className={styles.listItemInnerIcon}>
                <StoreOutlinedIcon
                  sx={{ color: current === 'store' ? itemActiveColor : itemColor }}
                />
              </div>
              <div style={{ color: current === 'store' ? itemActiveColor : itemColor }}>Stores</div>
            </div>
          }
        />
      </ListItemButton>

      <ListItemButton
        className={styles.menuButton}
        sx={{ background: current === 'support' ? itemBackgroundActiveColor : 'inherit' }}
        onClick={() => handleOpenPage('/account/support')}
      >
        <ListItemText
          className={styles.menuText}
          primary={
            <div className={styles.listItemInner}>
              <div className={styles.listItemInnerIcon}>
                <HelpOutlineOutlinedIcon
                  sx={{ color: current === 'support' ? itemActiveColor : itemColor }}
                />
              </div>
              <div style={{ color: current === 'support' ? itemActiveColor : itemColor }}>
                Support
              </div>
            </div>
          }
        />
      </ListItemButton>

      <ListItemButton
        className={styles.menuButton}
        sx={{ background: current === 'settings' ? itemBackgroundActiveColor : 'inherit' }}
        onClick={() => handleOpenPage('/account/settings')}
      >
        <ListItemText
          className={styles.menuText}
          primary={
            <div className={styles.listItemInner}>
              <div className={styles.listItemInnerIcon}>
                <SettingsOutlinedIcon
                  sx={{ color: current === 'settings' ? itemActiveColor : itemColor }}
                />
              </div>
              <div style={{ color: current === 'settings' ? itemActiveColor : itemColor }}>
                Account
              </div>
            </div>
          }
        />
      </ListItemButton>
    </>
  );
};

const AccountMenu = (props: AccountMenuProps): JSX.Element => {
  const { current, userEmail } = props;
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.between('xs', 'md'));
  const isSmallDesktop = useMediaQuery(theme.breakpoints.between('lg', 'lg'));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up('xl'));

  const styles = useStyles();
  const [isMenuOpen, setIsMenuOpen] = useState(isLargeDesktop);

  const handleOpenMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const logo = logoDark;
  const contentBackground =
    theme.palette.type === 'light'
      ? theme.palette.custom.trueWhite + ' !important'
      : theme.palette.secondary.main;
  const itemColor =
    theme.palette.type === 'light'
      ? theme.palette.custom.trueBlack
      : theme.palette.custom.trueWhite;

  return (
    <>
      <div
        className={
          styles.container +
          ' ' +
          (isPhone ? styles.mobileContent : styles.content) +
          ' ' +
          (isMenuOpen ? styles.menuOpened : '') +
          ' ' +
          (isMenuOpen || isSmallDesktop || isLargeDesktop
            ? styles.menuOpenedCollapse
            : styles.menuClosedCollapse)
        }
      >
        <div className={styles.manuCollapseWrapper}>
          <List
            component="nav"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              minWidth: '200px',
            }}
            subheader={
              isLargeDesktop || isSmallDesktop ? (
                <div className={styles.menuHeaderContainer}>
                  <div>
                    <div className={styles.desktopMenuLogoContainer}>
                      <div className={styles.desktopMenuLogoPosition}>
                        <Link href="/">
                          <Image
                            width={55}
                            height={50}
                            className={styles.desktopMenuLogo + ' ' + styles.linkPointer}
                            src={logo}
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className={styles.menuHeader}>
                    <div style={{ display: 'flex' }}>
                      <Link href="/">
                        <Image
                          width={99}
                          height={32}
                          src={theme.palette.type === 'light' ? bitsidyBlack : bitsidyDark}
                          className={styles.linkPointer}
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <ListSubheader
                  sx={{ px: '10px', background: contentBackground }}
                  component="div"
                  className={styles.mobileMenuHeader}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 0',
                    }}
                  >
                    <IconButton size="zero" onClick={handleOpenMenu}>
                      <CloseIcon sx={{ color: itemColor, fontSize: '48px' }} />
                    </IconButton>
                    <AccountBalance isWhite={theme.palette.type !== 'light'} isForPhone={true} />
                    <Link href="/">
                      <Image width={40} height={44} src={logo} className={styles.linkPointer} />
                    </Link>
                  </div>
                </ListSubheader>
              )
            }
          >
            <div
              style={{
                display: 'flex',
                height: '100%',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 0,
                width: '100%',
              }}
            >
              <div>
                {isSmallDesktop && (
                  <div
                    className={styles.menuText + ' ' + styles.smallDesktopClose}
                    onClick={handleOpenMenu}
                  >
                    <div className={styles.listItemInner}>
                      <div className={styles.listItemInnerIcon}>
                        {isMenuOpen ? (
                          <KeyboardArrowLeftIcon sx={{ color: itemColor, fontSize: '24px' }} />
                        ) : (
                          <KeyboardArrowRightIcon sx={{ color: itemColor, fontSize: '24px' }} />
                        )}
                      </div>
                      <div className={styles.smallDesktopCloseText} style={{ color: itemColor }}>
                        Hide
                      </div>
                    </div>
                  </div>
                )}
                <List
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    width: '100%',
                  }}
                >
                  <ListItems
                    current={current}
                    setIsMenuOpen={setIsMenuOpen}
                    isPhone={isPhone}
                    styles={styles}
                  />
                </List>
              </div>
              {isPhone ? (
                <ListItem
                  sx={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    pl: '12px',
                    width: '100%',
                    color: itemColor,
                  }}
                >
                  <SupportMenu userEmail={userEmail} className={''} />
                </ListItem>
              ) : (
                <></>
              )}
            </div>
          </List>
        </div>
      </div>

      {isPhone ? (
        <div className={styles.mobileMenuHider}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 10px 10px 10px',
            }}
          >
            <IconButton size="zero" onClick={handleOpenMenu}>
              <MenuIcon sx={{ color: itemColor, fontSize: '48px', padding: '0px !important' }} />
            </IconButton>
            <AccountBalance isWhite={theme.palette.type !== 'light'} isForPhone={true} />
            <Link href="/">
              <Image width={40} height={44} src={logo} className={styles.linkPointer} />
            </Link>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default AccountMenu;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      container: {
        backgroundColor:
          theme.palette.type === 'light'
            ? theme.palette.custom.trueWhite + ' !important'
            : theme.palette.custom.lightGray,
      },
      content: {
        display: 'flex',
        minHeight: '100vh',
        height: '100%',
        justifyContent: 'space-between',
        maxWidth: '200px',
        position: 'fixed',
        left: 0,
        zIndex: 999,
        [theme.breakpoints.between('lg', 'lg')]: {
          maxWidth: '40px',
          overflow: 'hidden',
          transition: 'all 0.2s ease-in-out',
          '&$menuOpened': {
            maxWidth: '200px',
            '& $menuText': {
              paddingLeft: '30px',
            },
            '& $desktopMenuLogo': {
              maxWidth: '55px !important',
              maxHeight: '50px !important',
              minWidth: '55px !important',
              minHeight: '50px !important',
            },
            '& $desktopMenuLogoPosition': {
              marginLeft: '75px !important',
              transition: 'all 0.2s ease-in-out',
            },
          },
          '& $menuText': {
            paddingLeft: '8px',
            transition: 'all 0.2s ease-in-out',
          },
          '& $desktopMenuLogo': {
            maxWidth: '36px !important',
            maxHeight: '36px !important',
            minWidth: '36px !important',
            minHeight: '36px !important',
            transition: 'all 0.2s ease-in-out',
          },
          '& $desktopMenuLogoContainer': {
            display: 'block',
          },
          '& $desktopMenuLogoPosition': {
            marginLeft: '2px !important',
            transition: 'all 0.2s ease-in-out',
          },
        },
      },
      mobileContent: {
        background:
          theme.palette.type === 'light'
            ? theme.palette.custom.trueWhite + ' !important'
            : theme.palette.secondary.main,
        display: 'flex',
        minHeight: '100vh',
        height: '100%',
        justifyContent: 'space-between',
        position: 'fixed',
        overflow: 'hidden',
        left: 0,
        zIndex: 999,
        '& .MuiCollapse-wrapperInner': {
          width: '100vw',
        },
      },
      menuOpened: {},
      smallDesktopCloseText: {
        fontWeight: 600,
      },
      desktopMenuLogoContainer: {
        marginBottom: '10px',
        display: 'flex',
        justifyContent: 'center',
      },
      desktopMenuLogoPosition: {},
      desktopMenuLogo: {
        maxWidth: '55px !important',
        maxHeight: '50px !important',
        minWidth: '55px !important',
        minHeight: '50px !important',
        margin: '0px !important',
      },
      smallDesktopClose: {
        height: '38px',
        padding: '8px 0px',
        boxSizing: 'border-box',
        marginBottom: '10px',
        cursor: 'pointer',
      },
      menuHeader: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      },
      menuHeaderContainer: {
        padding: '25px 0px 30px 0px',
      },
      mobileMenuHeader: {
        width: '100%',
      },
      menuText: {
        color: '#ffffff',
        fontSize: '16px',
        paddingLeft: '30px',
        '& .MuiListItemText-primary': {
          fontWeight: '600',
          fontFamily: 'Montserrat, sans-serif',
        },
      },
      menuButton: {
        display: 'flex',
        justifyContent: 'flex-start',
        width: '100%',
        height: '54px',
        maxHeight: '54px',
        minHeight: '54px',
        paddingLeft: '0px !important',
        paddingRight: '0px !important',
      },
      icon: {
        color: '#707070',
      },
      mobileMenuHider: {
        zIndex: 100,
        position: 'fixed',
        width: '100%',
        background:
          theme.palette.type === 'light'
            ? theme.palette.custom.trueWhite + ' !important'
            : theme.palette.secondary.main,
        '&.MuiButtonBase-root:hover': {
          background: '#0372CC',
        },
      },
      active: {
        backgroundColor: theme.palette.action.active,
      },
      listItemInner: {
        display: 'flex',
        alignItems: 'center',
      },
      listItemInnerIcon: {
        marginRight: '10px',
        display: 'flex',
        alignItems: 'center',
      },
      menuOpenedCollapse: {
        height: '100vh',
        minHeight: '100vh',
        transition: 'all 0.2s ease-in-out',
      },
      menuClosedCollapse: {
        height: '0vh',
        minHeight: '0vh',
        transition: 'all 0.2s ease-in-out',
      },
      manuCollapseWrapper: {
        display: 'flex',
        height: '100vh',
        width: '100vw',
      },
      linkPointer: {
        cursor: 'pointer',
      },
    }),
  { name: 'AccountMenu' },
);
