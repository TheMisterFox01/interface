import { PropsWithChildren } from 'react';

import { createStyles, makeStyles } from '@material-ui/core/styles';

type LandingSecondTitleProps = {
  text: string;
};

const LandingSecondTitle = (props: PropsWithChildren<LandingSecondTitleProps>): JSX.Element => {
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

export default LandingSecondTitle;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      content: {
        display: 'flex',
        justifyContent: 'center',
        paddingBottom: '30px'
      },
      text: {
        fontSize: '16px',
        color: theme.palette.text.primary,
        textAlign: 'center'
      }
    }),
  { name: 'LandingSecondTitle' },
);
