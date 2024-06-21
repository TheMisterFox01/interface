import { useState, useEffect, useCallback } from 'react';

import Table from 'components/table/Table';
import TableBody from 'components/table/TableBody';
import TableCell from 'components/table/TableCell';
import TableContainer from 'components/table/TableContainer';
import TableHead from 'components/table/TableHead';
import TableRow from 'components/table/TableRow';


import CircularProgress from 'components/CircularProgress';
import TablePagination from '@mui/material/TablePagination';

import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';

import { postData, GET_STORE_ACTION_LOG_PATH } from 'utils';
import ButtonProgressWrapper from 'elements/ButtonProgressWrapper';

type Row = {
  date: string;
  information: string;
  action: string;
  severity: number;
};

type Log = {
  storeAction: {
    name: string;
    severity: number;
  };
  storeActionLog: {
    customString: string;
    dateCreated: string;
    id: number;
  };
};

const SEVERITIES = {
  '1': 'red',
  '0': 'gray',
  '-1': 'green',
};

const getRows = (logs: Log[]): Row[] => {
  return logs.map(
    ({ storeAction: { name, severity }, storeActionLog: { dateCreated, customString } }) => {
      return {
        date: dateCreated,
        information: customString,
        action: name,
        severity: SEVERITIES[severity],
      };
    },
  );
};

const StoreLogTable = ({ storeId }: { storeId: string }): JSX.Element => {
  const styles = useStyles();
  const theme = useTheme();
  const [logs, setLogs] = useState<Log[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoadingMoreLoading, setIsLoadingMoreLoading] = useState(false);
  const [isLoadingLogTable, setIsLoadingLogTable] = useState(false);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStoreLog = useCallback(async () => {
    if (logs.length === 0) {
      setIsLoadingLogTable(true);
    }
    setIsLoadingMoreLoading(true);
    const token = localStorage.getItem('bitsidyAccessToken') || '';
    const lasLogIndex = logs.length - 1;

    const lastId = logs[lasLogIndex] ? logs[lasLogIndex].storeActionLog.id : null;

    const response = await postData(GET_STORE_ACTION_LOG_PATH, {
      token,
      lastId,
      count: rowsPerPage,
      storeId,
    });
    const newLogs = response.data;

    setLogs([...logs, ...newLogs]);
    setIsLoadingMoreLoading(false);
    setIsLoadingLogTable(false);
  }, [logs, rowsPerPage]);

  const handleLoadMore = () => {
    getStoreLog().catch((error) => console.log(error));
  };

  useEffect(() => {
    getStoreLog().catch((error) => console.log(error));
  }, []);

  const rows = getRows(logs);

  return (
    <>
      {isLoadingLogTable ? (
        <div className={styles.loadingContainer}>
          <CircularProgress size={48}/>
        </div>
      ) : (
        <div
          className={
            styles.content +
            ' ' +
            (theme.palette.type === 'light' ? styles.tableLight : styles.tableDark)
          }
        >
          <TableContainer className={styles.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={styles.tableCell}>Date</TableCell>
                  <TableCell className={styles.tableCell}>
                    Information
                  </TableCell>
                  <TableCell className={styles.tableCell}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(({ date, information, action, severity }, index) => (
                    <TableRow
                      key={date + index}
                      className={styles.row}
                    >
                      <TableCell className={styles.tableCell}>
                        {date}
                      </TableCell>
                      <TableCell className={styles.tableCell}>
                        {information}
                      </TableCell>
                      <TableCell className={styles.tableCell}>
                        <div className={`${styles.status} ${styles[severity]}`}>{action}</div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              <caption className={styles.caption}>
                <div className={styles.captionRow}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ButtonProgressWrapper
                      clickHandler={handleLoadMore}
                      loading={isLoadingMoreLoading}
                      buttonText="LOAD MORE"
                    />
                  </div>
                  <TablePagination
                    className={styles.colorText}
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    colSpan={3}
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </div>
              </caption>
            </Table>
          </TableContainer>
        </div>
      )}
    </>
  );
};

export default StoreLogTable;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      row: {
        '&:last-child td, &:last-child th': { border: 0 }
      },
      content: {
        maxWidth: '600px',
        width: '100%',
        borderWidth: '1px',
        borderColor: '#e0e0e0',
        borderStyle: 'solid',
        borderRadius: '4px',
        marginBottom: '40px',
      },
      caption: {
        paddingBottom: '0px !important',
        paddingTop: '0px !important',
      },
      captionRow: {
        display: 'flex',
        'justify-content': 'space-between',
      },
      tableContainer: {
        width: '100%',
        marginBottom: '16px',
        color: theme.palette.text.primary,
        ['& .MuiTableCell-root']: {
          fontFamily: 'Montserrat, sans-serif !important',
        },
      },
      tableCell: {
        color: theme.palette.text.primary,
        padding: '5px',
        [theme.breakpoints.up('sm')]: {
          padding: '16px',
        },
      },
      title: {
        color: theme.palette.text.primary,
        textAlign: 'center',
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '35px',
        lineHeight: '37px',
        [theme.breakpoints.up('md')]: {
          fontSize: '50px',
          lineHeight: '61px',
        },
        marginBottom: '30px',
      },
      colorText: {
        color: theme.palette.text.primary,
        '& .MuiTablePagination-selectIcon': { color: theme.palette.text.primary },
        '& .MuiIconButton-root': { color: theme.palette.text.primary },
        '& .MuiIconButton-root.Mui-disabled': { color: '#8e8e8e' },
      },
      status: {
        fontFamily: 'Montserrat, sans-serif',
        borderRadius: '20px',
        padding: '8px 2px',
        width: '138px',
        textAlign: 'center',
        color: '#fff',
        fontSize: '13px',
      },
      green: {
        background: '#2E7D32',
      },
      gray: {
        background: '#808080',
      },
      red: {
        background: '#D32F2F',
      },
      loadMoreButton: {
        height: '28px',
        minWidth: '100px',
        'align-self': 'center',
        background: theme.palette.success.main,
        color: theme.palette.common.white,
      },
      tableLight: {
        borderColor: `#E0E0E0 !important`,
        '& table': {
          borderColor: `#E0E0E0 !important`,
        },
        '& td, & th': {
          borderBottom: `1px solid #E0E0E0 !important`,
        },
      },
      tableDark: {
        borderColor: `#1F2529 !important`,
        '& table': {
          borderColor: `#1F2529 !important`,
        },
        '& td, & th': {
          borderBottom: `1px solid #1F2529 !important`,
        },
      },
      loadingContainer: {
        width: '100%',
        height: '150px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
    }),
  { name: 'StoreLogTable' },
);
