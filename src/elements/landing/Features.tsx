import Image from 'next/image';

import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';

import LandingTitle from './LandingTitle';
import LandingSecondTitle from './LandingSecondTitle';

import sendIcon from 'public/sendIcon.svg';
//import shopIcon from 'public/shopIcon.svg';
import tuneIcon from 'public/tuneIcon.svg';
import worldIcon from 'public/worldIcon.svg';
import supportIcon from 'public/supportIcon.svg';

const Features = (): JSX.Element => {
  const styles = useStyles();
  return (
    <div className={styles.features}>
      <LandingTitle text="Your Reliable Home in the Crypto World" />
      <LandingSecondTitle text="With Us, You Can:" />
      <div className={styles.featuresList}>
        <Feature icon={sendIcon} text="Send and Receive Crypto Easily" />
        {/*<Feature icon={shopIcon} text="Receive crypto payments in easy way" />*/}
        <Feature
          icon={tuneIcon}
          text="Set Up Your Shop Just the Way You Want with Flexible Settings"
        />
        <Feature icon={worldIcon} text="Operate Globally Without Any Restrictions" />
        <Feature icon={supportIcon} text="Enjoy Friendly Support Ready to Help You with Anything" />
      </div>
    </div>
  );
};

type featureProps = {
  icon: string;
  text: string;
};

const Feature = (props: featureProps): JSX.Element => {
  const styles = useStyles();
  const theme = useTheme();
  const { icon, text } = props;

  return (
    <div className={styles.feature}>
      <div className={styles.imageContainer}>
        <Image
          height={36}
          src={icon}
          className={theme.palette.type === 'light' ? '' : styles.darkImage}
        />
      </div>
      <div className={styles.featureText}>{text}</div>
    </div>
  );
};

export default Features;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      features: {
        background: theme.palette.background.default,
        paddingBottom: '40px',
        [theme.breakpoints.down('md')]: {
          paddingBottom: '20px',
        },
      },
      featureText: {
        lineHeight: 1.6,
      },
      featuresList: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '800px',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '30px',
        [theme.breakpoints.down('sm')]: {
          width: 'initial',
        },
      },
      feature: {
        width: '260px',
        marginBottom: '60px',
        marginLeft: '50px',
        marginRight: '50px',
        color: theme.palette.text.primary,
      },
      imageContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px',
      },
      darkImage: {
        filter: 'brightness(100)',
      },
    }),
  { name: 'FeaturesSection' },
);
