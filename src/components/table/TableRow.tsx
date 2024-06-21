import React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles'

const TableRow = ({ children, className = '' }: { children: JSX.Element[] | JSX.Element | string | any, className?: string }) => {
  const theme = useTheme();
  const styles = useStyles();
  const isPhone = useMediaQuery(theme.breakpoints.between('xs', 1280));

  if (isPhone) {
    return <tr className={className + ' ' + styles.mobile}>{children}</tr>;
  }
  return <tr className={className + ' ' + styles.desktop}>{children}</tr>;
};

export default TableRow;

const useStyles = makeStyles(
  () =>
    createStyles({
      desktop: {
        '& > td:first-child': {
          paddingLeft: '16px',
        },
        '& > td:last-child': {
          paddingRight: '16px',
        }
      },
      mobile: {
        padding: '8px',
        borderRadius: '10px',
        display: 'block',
      },
    }),
  { name: 'TableRow' },
);
