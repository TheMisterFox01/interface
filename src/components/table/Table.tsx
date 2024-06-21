import { createStyles, makeStyles } from '@material-ui/core/styles';

const Table = ({ children }: { children: JSX.Element[] | JSX.Element }) => {
  const styles = useStyles()
  return (
    <table className={styles.content}>
      {children}
    </table>
  )
}

export default Table

const useStyles = makeStyles(
  () =>
    createStyles({
      content: {
        width: '100%',
	      borderCollapse: 'collapse'
      },
    }),
  { name: 'Table' },
);
