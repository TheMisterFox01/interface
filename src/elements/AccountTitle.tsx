import { PropsWithChildren } from 'react';

import { createStyles, makeStyles } from '@material-ui/core/styles';

type AccountTitleProps = {
  title: string;
  breadcrumbs: string;
};

const AccountTitle = (props: PropsWithChildren<AccountTitleProps>): JSX.Element => {
  const { title, breadcrumbs } = props;
  const styles = useStyles();

  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <div className={styles.breadcrumbs}>
          {title} {breadcrumbs != '' ? '/ ' + breadcrumbs : ''}
        </div>
      </div>
    </div>
  );
};

export default AccountTitle;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      content: {
        display: 'flex',
        justifyContent: 'space-between',
      },
      title: {
        marginBottom: '16px',
        fontSize: '34px',
      },
      header: {
        margin: '30px 0px 30px 0px',
        color: theme.palette.text.primary,
        [theme.breakpoints.down('md')]: {
          margin: '86px 0px 30px 0px',
        },
      },
      breadcrumbs: {
        marginTop: '10px',
        color: theme.palette.text.secondary,
        fontSize: '16px',
        lineHeight: 1.6,
      },
    }),
  { name: 'AccountTitle' },
);
