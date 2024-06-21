import { PropsWithChildren } from 'react';

import { createStyles, makeStyles } from '@material-ui/core/styles';

type AccountSecondTitleProps = {
  title: string;
  description: string;
};

const AccountSecondTitle = (props: PropsWithChildren<AccountSecondTitleProps>): JSX.Element => {
  const { title, description } = props;
  const styles = useStyles();

  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
      </div>
    </div>
  );
};

export default AccountSecondTitle;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      content: {
        display: 'flex',
        justifyContent: 'space-between',
      },
      title: {
        marginBottom: '16px',
        fontSize: '24px',
      },
      header: {
        marginBottom: '30px',
        color: theme.palette.text.primary,
      },
      description: {
        color: theme.palette.text.secondary,
        fontSize: '16px',
        lineHeight: 1.6,
      },
    }),
  { name: 'AccountSecondTitle' },
);
