import { useState, useEffect, useCallback } from 'react';

import TableContainer from 'components/table/TableContainer';
import Table from 'components/table/Table';
import TableHead from 'components/table/TableHead';
import TableBody from 'components/table/TableBody';
import TableRow from 'components/table/TableRow';
import TableCell from 'components/table/TableCell';

import CircularProgress from 'components/CircularProgress';

import TablePagination from '@mui/material/TablePagination';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import { postData, GET_USER_ACTION_LOG_PATH } from 'utils';
import ButtonProgressWrapper from 'elements/ButtonProgressWrapper';

type Row = {
  date: string;
  ip: string;
  location: string;
  action: string;
  severity: number;
};

type Log = {
  userAction: {
    name: string;
    severity: number;
  };
  userActionLog: {
    location: string;
    dateCreated: string;
    ip: string;
    id: number;
  };
};

const getRows = (logs: Log[]): Row[] => {
  return logs.map(
    ({ userAction: { name, severity }, userActionLog: { dateCreated, location, ip } }) => {
      const severities = {
        '1': 'red',
        '0': 'gray',
        '-1': 'green',
      };

      return {
        date: dateCreated,
        ip,
        location,
        action: name,
        severity: severities[severity],
      };
    },
  );
};

const AccountLogTable = (): JSX.Element => {
  const styles = useStyles();
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
    const lastId = logs[lasLogIndex] ? logs[lasLogIndex].userActionLog.id : null;

    const response = await postData(GET_USER_ACTION_LOG_PATH, {
      token,
      lastId,
      count: rowsPerPage,
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
        <div>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>
                    IP
                  </TableCell>
                  <TableCell>
                    Location
                  </TableCell>
                  <TableCell>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(({ date, ip, location, action, severity }, index) => (
                    <TableRow
                      key={date + index}
                    >
                      <TableCell>
                        {date?.split('.')[0].replace('T', ' ') + ' UTC+0'}
                      </TableCell>
                      <TableCell>
                        {ip}
                      </TableCell>
                      <TableCell>
                        {location}
                      </TableCell>
                      <TableCell>
                        <div className={`${styles.status} ${styles[severity]}`}>{action}</div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              <div className={styles.caption}>
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
              </div>
            </Table>
          </TableContainer>
        </div>
      )}
    </>
  );
};

export default AccountLogTable;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      caption: {
        paddingBottom: '0px !important',
        paddingTop: '0px !important',
      },
      captionRow: {
        display: 'flex',
        'justify-content': 'space-between',
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
        color: theme.palette.common.white,
        fontSize: '13px',
      },
      green: { background: theme.palette.custom.green },
      yellow: { background: theme.palette.custom.yellow },
      gray: { background: theme.palette.custom.gray },
      red: { background: theme.palette.custom.red },
      loadingContainer: {
        width: '100%',
        height: '150px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
    }),
  { name: 'AccountLogTable' },
);
