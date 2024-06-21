import Image from 'next/image';

import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';

import bitsidyLight from 'public/bitsidyLight.svg';
import bitsidyDark from 'public/bitsidyDark.svg';
import logoLight from 'public/logoLight.svg';
import logoDark from 'public/logoDark.svg';

import ThemeSwitcher from './ThemeSwitcher';

const Footer = (): JSX.Element => {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <>
      <div className={styles.footer}>
        <div className={styles.linksContainer}>
          <ul className={styles.linksList}>
            <li className={styles.linksTitle}>About Us</li>
            <li className={styles.linkContainer}>
              <a className={styles.link} href="/termsofuse">
                Terms of Use
              </a>
            </li>
            <li className={styles.linkContainer}>
              <a className={styles.link} href="/privacypolicy">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
        <div className={styles.logoContainer}>
          <div className={styles.topLogo}>
            <Image
              width={50}
              height={55}
              src={theme.palette.type === 'light' ? logoLight : logoDark}
            />
          </div>
          <div className={styles.bottomLogo}>
            <Image
              width={99}
              height={32}
              src={theme.palette.type === 'light' ? bitsidyLight : bitsidyDark}
            />
          </div>
          <div className={styles.copyright}>© 2022-{new Date().getFullYear()}</div>
          <ThemeSwitcher colorType="light" />
        </div>
      </div>
    </>
  );
};

export default Footer;

const useStyles: any = makeStyles(
  (theme) =>
    createStyles({
      logoContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        [theme.breakpoints.up('lg')]: {
          padding: '0px 100px',
        },
      },
      topLogo: {
        display: 'flex',
        marginBottom: '10px',
      },
      bottomLogo: {
        display: 'flex',
      },
      footer: {
        width: '100vw',
        padding: '60px 0px 40px 0px',
        background: theme.palette.secondary.main,
        position: 'static',
        top: 'auto',
        bottom: 0,
        margin: 'initial',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row-reverse',
        [theme.breakpoints.down('md')]: {
          flexDirection: 'column',
        },
      },
      container: {
        maxWidth: '1400px',
      },
      disabled: {},
      linksContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexFlow: 'row',
        [theme.breakpoints.up('lg')]: {
          padding: '0px 100px',
        },
        [theme.breakpoints.down('md')]: {
          flexDirection: 'column',
          width: '100%',
          padding: '0px 10px',
          boxSizing: 'border-box',
          minHeight: '84px',
        },
      },
      copyright: {
        marginTop: '10px',
        color: '#FFFFFF',
      },
      linksList: {
        padding: 0,
        listStyleType: 'none',
        color: '#FFFFFF',
        margin: '0px 0px 60px 0px',
      },
      linksTitle: {
        marginBottom: '20px',
        fontSize: '20px',
        fontWeight: 600,
      },
      link: {
        textDecoration: 'none',
        color: 'inherit',
      },
      linkContainer: {
        marginBottom: '10px',
        '&$disabled': {
          pointerEvents: 'none',
          opacity: 0.5,
        },
      },
    }),
  { name: 'Footer' },
);
