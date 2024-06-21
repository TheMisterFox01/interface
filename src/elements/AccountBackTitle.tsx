import { PropsWithChildren } from 'react';
import { useRouter } from 'next/router';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import IconButton from 'components/IconButton';
import CircularProgress from 'components/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

type AccountTitleProps = {
  title: string | undefined;
  subTitle: string;
  pathname: any;
  query: any;
  isLoading: boolean;
};

const AccountBackTitle = (props: PropsWithChildren<AccountTitleProps>): JSX.Element => {
  const { title, subTitle, pathname, query, isLoading } = props;
  const styles = useStyles();
  const theme = useTheme();
  const router = useRouter();

  const handleBack = () => {
    router.push(
      {
        pathname: pathname,
        query: query,
      },
      undefined,
      { shallow: true },
    );
  };

  return (
    <div className={styles.storeTitleContainer}>
      <IconButton onClick={handleBack} size="medium">
        <ArrowBackIcon sx={{ color: theme.palette.text.primary }} />
      </IconButton>
      <div className={styles.content}>
        {isLoading ? (
          <CircularProgress size={36} />
        ) : (
          <>
            <div className={styles.storeTitle}>{title}</div>
            <div className={styles.storeSubTitle}>{subTitle}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default AccountBackTitle;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      content: {
        marginLeft: '10px',
      },
      storeTitleContainer: {
        display: 'flex',
        marginBottom: '40px',
        alignItems: 'center',
      },
      storeTitle: {
        fontSize: '24px',
        color: theme.palette.text.primary,
        fontWeight: 400,
        marginBottom: '4px',
      },
      storeSubTitle: {
        color: theme.palette.text.secondary,
        fontSize: '14px',
      },
    }),
  { name: 'AccountTitle' },
);
