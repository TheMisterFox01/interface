import { PropsWithChildren } from 'react';

import { createStyles, makeStyles } from '@material-ui/core/styles';

type LandingTitleProps = {
  text: string;
};

const LandingTitle = (props: PropsWithChildren<LandingTitleProps>): JSX.Element => {
  const { text } = props;
  const styles = useStyles();

  return (
    <div className={styles.content}>
      <div className={styles.text}>
        {text}
      </div>
    </div>
  );
};

export default LandingTitle;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      content: {
        display: 'flex',
        justifyContent: 'center',
        paddingBottom: '40px'
      },
      text: {
        fontSize: '24px',
        color: theme.palette.text.primary,
        textAlign: 'center'
      },
    }),
  { name: 'LandingTitle' },
);
