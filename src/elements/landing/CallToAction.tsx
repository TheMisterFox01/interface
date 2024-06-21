import Image from 'next/image';
import { useRouter } from 'next/router';

import Button from 'components/Button';

import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';

import ctaImageLight from 'public/ctaImageLight.png';
import ctaImageDark from 'public/ctaImageDark.png';

const CallToActionText = (): JSX.Element => {
  const styles = useStyles();
  const router = useRouter();

  return (
    <div className={styles.textSection}>
      <div className={styles.title}>
        <div className={styles.titlePartLeft}>Easy Crypto Payments</div>
        <div className={styles.titlePartRight}>Simple Wallet, Zero Hassle</div>
      </div>
      <div className={styles.text}>Start with Bitsidy Today</div>
      <div className={styles.buttonWrapper}>
        <Button
          className={styles.getStartedButton}
          variant="contained"
          size="large"
          onClick={() => router.push('/login')}
        >
          GET STARTED
        </Button>
      </div>
    </div>
  );
};

const CallToAction = (): JSX.Element => {
  const styles = useStyles();
  const theme = useTheme();

  const logo = theme.palette.type === 'light' ? ctaImageLight : ctaImageDark;

  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <CallToActionText />
        <div className={styles.ctaImage}>
          <Image width={700} height={601} src={logo} />
        </div>
      </div>
    </section>
  );
};

export default CallToAction;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      section: {
        display: 'flex',
        justifyContent: 'space-around',
        height: '700px',
        paddingTop: '90px',
        paddingBottom: '110px',
        boxSizing: 'border-box',
        backgroundColor: theme.palette.background.default,
        [theme.breakpoints.down('md')]: {
          height: 'inherit',
        },
      },
      content: {
        padding: '80px 5px 60px',
        display: 'flex',
        position: 'relative',
        [theme.breakpoints.up('lg')]: {
          width: '1200px',
          padding: '0px 25px',
          flexFlow: 'row',
          alignItems: 'flex-start',
        },
        [theme.breakpoints.down('md')]: {
          width: '100%',
          padding: '0px 10px',
          flexFlow: 'column',
          alignItems: 'center',
        },
      },
      ctaImage: {
        position: 'absolute',
        right: '0px',
        marginTop: '-30px',
        [theme.breakpoints.down('md')]: {
          display: 'none',
        },
      },
      textSection: {
        display: 'flex',
        flexFlow: 'column',
        justifyContent: 'space-between',
        textAlign: 'center',
        zIndex: 10,
        color: theme.palette.text.primary,
      },
      title: {
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '48px',
        display: 'flex',
        marginBottom: '60px',
        [theme.breakpoints.down('md')]: {
          flexDirection: 'column',
          fontSize: '34px',
        },
      },
      titlePartLeft: {
        borderRightWidth: '2px',
        borderRightColor: theme.palette.common.black,
        borderRightStyle: 'solid',
        width: '305px',
        fontWeight: 600,
        paddingRight: '30px',
        textAlign: 'left',
        [theme.breakpoints.down('md')]: {
          border: 0,
          paddingRight: '0px',
          paddingBottom: '10px',
          width: '100%',
          textAlign: 'center',
        },
      },
      titlePartRight: {
        width: '460px',
        paddingLeft: '40px',
        textAlign: 'left',
        [theme.breakpoints.down('md')]: {
          border: 0,
          paddingLeft: '0px',
          width: '100%',
          textAlign: 'center',
        },
      },
      text: {
        maxWidth: '550px',
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '24px',
        textAlign: 'left',
        marginBottom: '45px',
        [theme.breakpoints.down('md')]: {
          maxWidth: '100%',
          width: '100%',
          textAlign: 'center',
        },
      },
      getStartedButton: {
        padding: '13px 28px',
        background: theme.palette.primary.main,
        fontSize: '20px',
        color: '#fff',
        fontWeight: 400,
      },
      buttonWrapper: {
        display: 'flex',
        [theme.breakpoints.down('md')]: {
          justifyContent: 'center',
        },
      },
    }),
  { name: 'CallToActionSection' },
);
