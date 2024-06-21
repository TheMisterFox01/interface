import Link from 'next/link';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';

import logoDark from '../public/logoDark.svg';
import logoText from '../public/logoText.svg';

import Image from 'next/image';

const Logo = (): JSX.Element => {
  const styles = useStyles();
  const theme = useTheme();
  return (
    <Link href="/">
      <div className={styles.logoContainer}>
        <div className={styles.logoImage}>
          <Image width={50} height={54} src={logoDark} />
        </div>
        {theme.palette.type === 'light' && (
          <div className={styles.text}>
            <Image width={150} src={logoText} />
          </div>
        )}
        {theme.palette.type === 'dark' && (
          <div className={styles.text + ' ' + styles.darkText}>
            <Image width={150} src={logoText} />
          </div>
        )}
      </div>
    </Link>
  );
};

export default Logo;

const useStyles = makeStyles(
  () =>
    createStyles({
      logoImage: {
        marginRight: '12px',
      },
      text: {
        display: 'flex',
        alignItems: 'center',
      },
      darkText: {
        filter: 'brightness(100)',
      },
      logoContainer: {
        display: 'flex',
        cursor: 'pointer'
      },
    }),
  { name: 'Logo' },
);
