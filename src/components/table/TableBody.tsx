import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const TableBody = ({
  children,
  plates = false,
}: {
  children: JSX.Element | any;
  plates?: boolean;
}) => {
  const styles = useStyles();
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.between('xs', 1280));
  if (isPhone) {
    return (
      <tbody className={plates ? styles.platesContentMobile : styles.contentMobile}>
        {children}
      </tbody>
    );
  } else {
    return <tbody className={plates ? styles.platesContent : styles.content}>{children}</tbody>;
  }
};

export default TableBody;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      platesContentMobile: {
        '& > tr': {
          backgroundColor: theme.palette.custom.lightGray,
        },
      },
      contentMobile: {
        '& > tr:nth-child(odd)': {
          backgroundColor:
            theme.palette.type === 'light'
              ? theme.palette.custom.lightGray
              : theme.palette.custom.lightGray,
        },
      },
      platesContent: {
        '& > tr > td': {
          backgroundColor: theme.palette.custom.lightGray,
        },
        '& td:first-child': {
          borderTopLeftRadius: '6px',
          borderBottomLeftRadius: '6px',
        },
        '& td:last-child': {
          borderTopRightRadius: '6px',
          borderBottomRightRadius: '6px',
        },
      },
      content: {
        '& > tr:nth-child(odd) > td': {
          backgroundColor:
            theme.palette.type === 'light'
              ? theme.palette.custom.lightGray
              : theme.palette.custom.lightGray,
        },
        '& td:first-child': {
          borderTopLeftRadius: '6px',
          borderBottomLeftRadius: '6px',
        },
        '& td:last-child': {
          borderTopRightRadius: '6px',
          borderBottomRightRadius: '6px',
        },
      },
    }),
  { name: 'TableBody' },
);
