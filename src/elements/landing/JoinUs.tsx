import Image from 'next/image';

import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';

import landingLaptop from 'public/landingLaptop.svg';
import landingPhone from 'public/landingPhone.svg';
import landingLaptopDark from 'public/landingLaptopDark.svg';
import landingPhoneDark from 'public/landingPhoneDark.svg';
import { useRouter } from 'next/router';
import ButtonProgressWrapper from 'elements/ButtonProgressWrapper';

const JoinUs = (): JSX.Element => {
  const styles = useStyles();
  const theme = useTheme();
  const router = useRouter();

  return (
    <div className={styles.joinUs}>
      <div className={styles.joinUsContent}>
        <div className={styles.title}>Join us today</div>
        <div className={styles.subtitle}>It's free</div>
        <ButtonProgressWrapper
          clickHandler={() => {
            router.push('/signup');
          }}
          className={styles.button}
          loading={false}
          buttonText="SIGN UP FOR FREE"
        />
      </div>
      <div className={styles.imageContainer}>
        <div className={styles.image + ' ' + styles.firstImage}>
          <Image
            width={542}
            height={385}
            src={theme.palette.type === 'light' ? landingLaptop : landingLaptopDark}
          />
        </div>
        <div className={styles.image + ' ' + styles.secondImage}>
          <Image
            width={139}
            height={256}
            src={theme.palette.type === 'light' ? landingPhone : landingPhoneDark}
          />
        </div>
      </div>
    </div>
  );
};

export default JoinUs;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      joinUs: {
        background: theme.palette.background.default,
        display: 'flex',
        justifyContent: 'center',
        paddingBottom: '100px',
        [theme.breakpoints.down('md')]: {
          paddingBottom: '80px',
          flexDirection: 'column',
          alignItems: 'center',
        },
      },
      joinUsContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '542px',
        marginBottom: '90px',
        color: theme.palette.text.primary,
        [theme.breakpoints.down('md')]: {
          marginBottom: '60px',
        },
        [theme.breakpoints.between(0, 700)]: {
          width: '100%',
        },
      },
      title: {
        fontSize: '36px',
        fontWeight: 500,
        marginBottom: '10px',
      },
      subtitle: {
        fontSize: '24px',
      },
      imageContainer: {
        width: '542px',
        height: '385px',
        position: 'relative',
        overflow: 'hidden',
        [theme.breakpoints.between(0, 700)]: {
          width: '100%',
        },
      },
      image: {
        position: 'absolute',
      },
      firstImage: {
        height: '385px',
        width: '542px',
        [theme.breakpoints.between(0, 700)]: {
          marginLeft: '80px',
        },
      },
      secondImage: {
        marginTop: '74px',
        marginLeft: '320px',
        [theme.breakpoints.between(0, 700)]: {
          marginTop: '55px',
          marginLeft: '45px',
        },
      },
      button: {
        marginTop: '30px',
      },
    }),
  { name: 'WriteUsSection' },
);
