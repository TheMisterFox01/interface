import { createStyles, makeStyles } from '@material-ui/core/styles';

const TableContainer = ({
  children,
  className = '',
  isSmall = false,
}: {
  children: JSX.Element | JSX.Element[];
  className?: string;
  isSmall?: boolean;
}) => {
  const styles = useStyles();
  let classList = [];
  classList.push(className);
  classList.push(styles.content);
  classList.push(isSmall ? styles.small : styles.regular);
  return <div className={classList.join(' ')}>{children}</div>;
};

export default TableContainer;

const useStyles = makeStyles(
  () =>
    createStyles({
      content: {
        width: '100%',
      },
      small: {
        fontSize: '14px',
      },
      regular: {
        fontSize: '16px',
      },
    }),
  { name: 'TableContainer' },
);
