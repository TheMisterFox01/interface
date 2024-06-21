import { useState, useEffect } from 'react';

import TableContainer from 'components/table/TableContainer';
import Table from 'components/table/Table';
import TableHead from 'components/table/TableHead';
import TableBody from 'components/table/TableBody';
import TableRow from 'components/table/TableRow';
import TableCell from 'components/table/TableCell';

import CircularProgress from 'components/CircularProgress';
import TransactionsHistoryTableFilters from './TransactionsHistoryTableFilters';
import TransactionLogDialog from '../dialogs/TransactionLogDialog';

import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';

import { createStyles, makeStyles } from '@material-ui/core/styles';

import {
  postData,
  TRANSACTIONS_LOG_PATH,
  getCurrencyName,
  getDaysAgo,
  datePrepare,
  INVOICE_SEVERITIES,
  dateLocalForAPI,
  toCsvSafeString,
  formatDate,
  getToken,
  structuredClone,
} from 'utils';
import CurrencyLogo from 'components/CurrencyLogo';
import { CurrencyPrice } from '../Home';
import Button from 'components/Button';
import { SubUser, getSubUsers } from 'utils/subUsers';
import IconButton from 'components/IconButton';
import Tooltip from 'components/Tooltip';

export type Address = {
  amount: number;
  address: string;
  type: string;
  fee: number;
};

export type Consolidation = {
  amount: number;
  fromAddress: string;
  toAddress: string;
  fee: number;
  hash: string;
  date: string;
};

export type WithdrawRequest = {
  currencyName: string;
  amount: number;
  toAddress: string;
  fee: null;
  feeUnit: string;
  status: string;
  hash: string[];
  dateCreated: string;
  dateUpdated: string;
  comment: null | string;
  freeze: null | boolean;
  burn: null | boolean;
  borrowResources: null | boolean;
  userComment: null | string;
};

export type UserFeeHistory = {
  fromAddress: string;
  amount: number;
  hash: string;
  type: string[];
  date: string;
  comment: null | string;
};

export type LogRow = {
  transactionHistory: TransactionHistory | null;
  withdrawRequest: WithdrawRequest | null;
  consolidation: Consolidation | null;
  userFeeHistory: UserFeeHistory | null;
  subUser?: SubUser | null;
};

export type TransactionHistory = {
  currencyName: string;
  amount: number;
  toAddresses: Address[];
  fromAddresses: Address[];
  fee: number;
  bitsidyFee: number;
  hash: string | string[];
  date: string;
  direction: string;
  context: string[];
  balance: number;
};

type TransactionsHistoryTableProps = {
  isPageReloaded: boolean;
  currencyPrices: CurrencyPrice[];
  subUser?: SubUser | null;
  specialCurrency: string | null;
};

const TransactionsHistoryTable = ({
  isPageReloaded,
  currencyPrices,
  subUser,
  specialCurrency,
}: TransactionsHistoryTableProps): JSX.Element => {
  const defaultRowsPerPage = 10;

  const styles = useStyles();
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [isLoadingLogTable, setIsLoadingLogTable] = useState(false);
  const [openTransactionLogDialog, setOpenTransactionLogDialog] = useState(false);
  const [logRow, setLogRow] = useState<LogRow>({} as LogRow);

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [currency, setCurrency] = useState('All');
  const [direction, setDirection] = useState('All');
  const [context, setContext] = useState('All');
  const [startAmount, setStartAmount] = useState('');
  const [endAmount, setEndAmount] = useState('');

  const getTransactionsData = async (
    data: any,
    subUser: SubUser | null | undefined,
    specialCurrency: string | null,
  ) => {
    let response = await postData(TRANSACTIONS_LOG_PATH, data);
    if (response.result === 'success') {
      let responseData = response.data as LogRow[];
      responseData.forEach((x: LogRow) => (x.subUser = subUser));
      if (specialCurrency != null) {
        responseData = responseData.filter(
          (x) => x.transactionHistory?.currencyName == specialCurrency,
        );
      }
      return responseData;
    }
    return [];
  };

  const getTransactions = async (startDt: Date, endDt: Date) => {
    setIsLoadingLogTable(true);
    setPage(0);

    const token = await getToken();

    const data = {
      token,
      start: dateLocalForAPI(startDt),
      end: dateLocalForAPI(endDt),
    };
    if (currency != 'All' && currency != '') {
      data['currency'] = currency;
    }
    if (direction != 'All' && direction != '') {
      data['direction'] = direction.toLowerCase();
    }
    if (context != 'All' && context != '') {
      data['context'] = context == 'Personal' ? 'main' : context.toLowerCase();
    }
    if (startAmount != '' && startAmount != '0') {
      data['startAmount'] = parseFloat(startAmount);
    }
    if (endAmount != '' && endAmount != '0') {
      data['endAmount'] = parseFloat(endAmount);
    }

    let responseDataPromises = [];

    let logsDataResponse: LogRow[] = [];
    if (subUser == null) {
      responseDataPromises.push(getTransactionsData(structuredClone(data), null, specialCurrency));
    }

    const subUsers = await getSubUsers();
    for (let i = 0; i < subUsers.length; ++i) {
      if (subUser != null && subUsers[i].subUserId != subUser.subUserId) {
        continue;
      }
      data.token = subUsers[i].token;
      responseDataPromises.push(
        getTransactionsData(structuredClone(data), subUsers[i], specialCurrency),
      );
    }

    for (let i = 0; i < responseDataPromises.length; ++i) {
      let responseData = await responseDataPromises[i];
      logsDataResponse = [...logsDataResponse, ...responseData];
    }

    let historyLogs: LogRow[] = (logsDataResponse as LogRow[])
      .filter((row) => row.consolidation == null)
      .filter(
        (row) =>
          row.transactionHistory == null ||
          row.transactionHistory.context.indexOf('invoice_fee') == -1,
      );

    historyLogs.sort((a, b) => {
      const compareDates = (a: string, b: string) => {
        if (a == b) {
          return 0;
        }
        return a < b ? 1 : -1;
      };
      let statuses = ['wait', 'detected'];
      if (a.withdrawRequest != null && b.withdrawRequest != null) {
        const priorityA = statuses.includes(a.withdrawRequest.status);
        const priorityB = statuses.includes(b.withdrawRequest.status);
        if (priorityA && priorityB) {
          return compareDates(a.withdrawRequest.dateCreated, b.withdrawRequest.dateCreated);
        } else if (!priorityA && !priorityB) {
          return compareDates(a.withdrawRequest.dateCreated, b.withdrawRequest.dateCreated);
        } else if (priorityA) {
          return -1;
        } else {
          return 1;
        }
      } else if (a.withdrawRequest != null && b.transactionHistory != null) {
        if (statuses.includes(a.withdrawRequest.status)) {
          return -1;
        }
        return compareDates(a.withdrawRequest.dateCreated, b.transactionHistory.date);
      } else if (a.transactionHistory != null && b.withdrawRequest != null) {
        if (statuses.includes(b.withdrawRequest.status)) {
          return 1;
        }
        return compareDates(a.transactionHistory.date, b.withdrawRequest.dateCreated);
      } else if (a.transactionHistory != null && b.transactionHistory != null) {
        return compareDates(a.transactionHistory.date, b.transactionHistory.date);
      }
      return 0;
    });

    setLogs(historyLogs);

    setIsLoadingLogTable(false);
  };

  const prepareCsv = () => {
    let csv = '';
    csv += toCsvSafeString([
      'Date',
      'Direction',
      'Wallet',
      'Currency',
      'Amount',
      'Balance after',
      'Comment',
      'Account',
    ]);

    let i;
    for (i = 0; i < logs.length; ++i) {
      let [
        walletsAffected,
        direction,
        _,
        balance,
        date,
        currencyName,
        amount,
        userComment,
        account,
      ] = prepareTransactionRow(logs[i]);

      if (balance == '') {
        balance = '-';
      } else {
        balance = parseFloat(balance).toString();
      }

      if (logs[i].withdrawRequest != null) {
        direction += ' ' + logs[i].withdrawRequest!.status;
      }

      csv += toCsvSafeString([
        datePrepare(date),
        direction,
        walletsAffected.join(', '),
        getCurrencyName(currencyName, 'shortName'),
        parseFloat(amount.toFixed(8)).toString(),
        balance,
        userComment,
        account?.username ?? '',
      ]);
    }

    let name = 'bitsidy_';
    if (currency != 'All') {
      name += 'currency-' + currency.toLocaleLowerCase() + '_';
    }
    if (direction != 'All') {
      name += 'direction-' + direction.toLocaleLowerCase() + '_';
    }
    if (context != 'All') {
      name += 'wallet-' + context.toLocaleLowerCase() + '_';
    }
    if (startAmount != '' && startAmount != '0') {
      name += 'amount-from-' + startAmount.toString() + '_';
    }
    if (endAmount != '' && endAmount != '0') {
      name += 'amount-to-' + endAmount.toString() + '_';
    }
    name += 'date-from-' + formatDate(startDate.toISOString()) + '_';
    name += 'date-to-' + formatDate(endDate.toISOString());
    name += '.csv';

    const file = new Blob([csv], { type: 'csv' });
    var a = document.createElement('a'),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  };

  useEffect(() => setRowsPerPage(defaultRowsPerPage), [isLoadingLogTable]);

  useEffect(() => {
    setIsLoadingLogTable(true);
    setLogs({} as LogRow[]);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate());
    setStartDate(weekAgo);

    const dayAfterToday = new Date();
    dayAfterToday.setDate(dayAfterToday.getDate() + 1);
    setEndDate(dayAfterToday);

    getTransactions(weekAgo, dayAfterToday);
    setStartAmount('');
    setEndAmount('');
    setCurrency('All');
    setDirection('All');
    setContext('All');
  }, [isPageReloaded]);

  const showDetails = (row: LogRow) => {
    setLogRow(row);
    setOpenTransactionLogDialog(true);
  };

  const handleLoadMore = () => {
    setRowsPerPage(rowsPerPage + 10);
  };

  const prepareTransactionRow = (
    row: LogRow,
  ): [
    string[],
    string,
    string,
    string,
    string,
    string,
    number,
    string,
    SubUser | null | undefined,
  ] => {
    let walletsAffected: string[] = [];
    let direction = '';
    let directionColorClass = styles.blue;
    let balance = '';
    let date = '';
    let currencyName = '';
    let amount = 0;
    let userComment = '';
    let account = row.subUser;

    if (row.transactionHistory != null) {
      walletsAffected = row.transactionHistory.context ?? [];
      walletsAffected = walletsAffected
        .map((x) => {
          return x.replace('main', 'personal');
        })
        .map((x) => {
          return x.replace('both', 'personal, store');
        });

      direction = row.transactionHistory.direction ?? '';
      direction = direction.replace(',', ', ');
      direction = direction.replace('usdt_account_activation', 'USDT account activation');

      if (row.withdrawRequest != null) {
        directionColorClass = styles[INVOICE_SEVERITIES[row.withdrawRequest.status]];
        userComment = row.withdrawRequest.userComment ?? '';
      }

      balance = row.transactionHistory.balance?.toFixed(8);
      date = row.transactionHistory.date;
      currencyName = row.transactionHistory.currencyName;
      amount = row.transactionHistory.amount;
    } else if (row.withdrawRequest != null) {
      direction = 'send';
      directionColorClass = styles[INVOICE_SEVERITIES[row.withdrawRequest.status]];
      date = row.withdrawRequest.dateCreated;
      currencyName = row.withdrawRequest.currencyName;
      amount = row.withdrawRequest.amount;
    }

    return [
      walletsAffected,
      direction,
      directionColorClass,
      balance,
      date,
      currencyName,
      amount,
      userComment,
      account,
    ];
  };

  return (
    <div className={styles.transactionsHistoryContainer}>
      <div>
        <TransactionsHistoryTableFilters
          startDate={startDate}
          endDate={endDate}
          currency={currency}
          direction={direction}
          context={context}
          startAmount={startAmount}
          endAmount={endAmount}
          setStartDate={(value: Date) => setStartDate(value)}
          setEndDate={(value: Date) => setEndDate(value)}
          setCurrency={(value: string) => setCurrency(value)}
          setDirection={(value: string) => setDirection(value)}
          setContext={(value: string) => setContext(value)}
          setStartAmount={(value: string) => setStartAmount(value)}
          setEndAmount={(value: string) => setEndAmount(value)}
          getTransactions={getTransactions}
          specialCurrency={specialCurrency}
        />
      </div>
      {isLoadingLogTable ? (
        <div className={styles.loadingContainer}>
          <CircularProgress size={48} />
        </div>
      ) : (
        <>
          <div className={styles.content}>
            <TableContainer isSmall={true} className={styles.tableContainer}>
              <Table>
                {logs.length > 0 ? (
                  <TableHead>
                    <TableRow>
                      <TableCell className={styles.tableCell}>Date</TableCell>
                      <TableCell className={styles.tableCell}>Direction</TableCell>
                      <TableCell className={styles.tableCell}>Wallet</TableCell>
                      <TableCell className={styles.tableCell}>Currency</TableCell>
                      <TableCell className={styles.tableCell}>Amount</TableCell>
                      <TableCell className={styles.tableCell}>Balance after</TableCell>
                      <TableCell className={styles.tableCell}></TableCell>
                      <TableCell className={styles.tableCell}></TableCell>
                      <TableCell className={styles.tableCell}></TableCell>
                    </TableRow>
                  </TableHead>
                ) : (
                  <></>
                )}
                <TableBody>
                  {logs.length > 0 ? (
                    logs
                      ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => {
                        let [
                          walletsAffected,
                          direction,
                          directionColorClass,
                          balance,
                          date,
                          currencyName,
                          amount,
                          userComment,
                          subUser,
                        ] = prepareTransactionRow(row);

                        return (
                          <>
                            <TableRow key={index}>
                              <TableCell
                                className={styles.tableCell + ' ' + styles.dateCell}
                                header="Date"
                                valueToCopy={datePrepare(date)}
                                wordBreak={false}
                              >
                                <div>{datePrepare(date)}</div>
                                <div className={styles.subDate}>{getDaysAgo(date)}</div>
                              </TableCell>
                              <TableCell
                                className={styles.tableCell + ' ' + styles.statusCell}
                                header="Direction"
                              >
                                <div className={`${styles.bubble} ${directionColorClass}`}>
                                  {direction}
                                </div>
                              </TableCell>
                              {walletsAffected.length > 0 ? (
                                <TableCell
                                  className={styles.tableCell + ' ' + styles.walletContextCell}
                                  header="Wallet"
                                >
                                  <div className={`${styles.bubble} ${styles.walletContext}`}>
                                    {walletsAffected.join(', ')}
                                  </div>
                                </TableCell>
                              ) : (
                                <TableCell
                                  className={styles.tableCell + ' ' + styles.walletContextCell}
                                  header="Wallet"
                                >
                                  -
                                </TableCell>
                              )}
                              <TableCell header="Currency">
                                <div className={styles.currencyCell}>
                                  <CurrencyLogo size={30} allWide={true} currency={currencyName} />
                                  <div className={styles.currencyName}>
                                    {getCurrencyName(currencyName, 'shortName')}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell
                                className={styles.tableCell}
                                header="Amount"
                                valueToCopy={amount.toFixed(8)}
                              >
                                {parseFloat(amount.toFixed(8))}
                              </TableCell>
                              {balance != '' ? (
                                <TableCell
                                  className={styles.tableCell}
                                  header="Balance after"
                                  valueToCopy={balance}
                                >
                                  {parseFloat(balance)}
                                </TableCell>
                              ) : (
                                <TableCell className={styles.tableCell} header="Balance after">
                                  -
                                </TableCell>
                              )}
                              <TableCell className={styles.tableCell} header="Account">
                                {subUser != null && (
                                  <div className={styles.desktopComment}>
                                    <Tooltip text={subUser.username} placement="left">
                                      <IconButton>
                                        <AccountBalanceWalletOutlinedIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </div>
                                )}
                                <div className={styles.mobileComment}>
                                  {subUser == null ? 'Main account' : userComment}
                                </div>
                              </TableCell>
                              <TableCell className={styles.tableCell} header="Comment">
                                {userComment != '' && (
                                  <div className={styles.desktopComment}>
                                    <Tooltip text={userComment} placement="left">
                                      <IconButton>
                                        <ChatOutlinedIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </div>
                                )}
                                <div className={styles.mobileComment}>
                                  {userComment == '' ? '-' : userComment}
                                </div>
                              </TableCell>
                              <TableCell className={styles.tableCell} header="Details">
                                <div
                                  onClick={() => showDetails(row)}
                                  className={styles.link}
                                  style={{ paddingTop: '5px' }}
                                >
                                  <ReceiptOutlinedIcon className={styles.detailsButton} />
                                </div>
                              </TableCell>
                            </TableRow>
                          </>
                        );
                      })
                  ) : (
                    <div className={styles.nothingFound}>
                      Nothing was found for the specified period
                    </div>
                  )}
                </TableBody>
              </Table>
              <div className={styles.bottomButtons}>
                <div className={styles.downloadCsv}>
                  {logs.length > 0 && (
                    <Button onClick={prepareCsv} variant="outlined">
                      DOWNLOAD CSV
                    </Button>
                  )}
                </div>
                <div className={styles.loadMore}>
                  {rowsPerPage * (page + 1) < logs.length && (
                    <Button onClick={handleLoadMore}>LOAD MORE</Button>
                  )}
                </div>
              </div>
            </TableContainer>
          </div>
        </>
      )}
      <TransactionLogDialog
        openTransactionLogDialog={openTransactionLogDialog}
        setOpenTransactionLogDialog={setOpenTransactionLogDialog}
        logRow={logRow}
        currencyPrices={currencyPrices}
      />
    </div>
  );
};

export default TransactionsHistoryTable;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      nothingFound: {
        textAlign: 'center',
        color: theme.palette.text.primary,
      },
      dateCell: {
        width: '220px',
        maxWidth: '220px',
        minWidth: '220px',
        [theme.breakpoints.down('md')]: {
          width: 'initial',
          maxWidth: 'initial',
          minWidth: 'initial',
        },
      },
      transactionsHistoryContainer: {
        marginBottom: '20px',
      },
      desktopComment: {
        display: 'initial',
        [theme.breakpoints.down('md')]: {
          display: 'none',
        },
      },
      mobileComment: {
        display: 'none',
        [theme.breakpoints.down('md')]: {
          display: 'initial',
        },
      },
      loadMore: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        marginTop: '10px',
        marginBottom: '30px',
        [theme.breakpoints.down('md')]: {
          marginBottom: '20px',
        },
      },
      walletContext: {
        background: theme.palette.custom.purple,
      },
      walletContextCell: {
        width: '140px',
        maxWidth: '140px',
        minWidth: '140px',
        boxSizing: 'content-box',
      },
      currencyName: {
        marginLeft: '10px',
      },
      currencyCell: {
        display: 'flex',
        height: '30px',
        alignItems: 'center',
      },
      addressPreview: {
        [theme.breakpoints.up('lg')]: {
          width: '210px',
          maxWidth: '210px',
          minWidth: '210px',
        },
      },
      section: {
        display: 'flex',
        justifyContent: 'space-evenly',
        flexFlow: 'column',
        alignItems: 'center',
      },
      content: {
        maxWidth: '1440px',
        width: '100%',
        marginBottom: '40px',
      },
      downloadCsv: {
        position: 'absolute',
        [theme.breakpoints.down('md')]: {
          position: 'initial',
          display: 'flex',
          textAlign: 'center',
          justifyContent: 'center',
        },
      },
      bottomButtons: {
        height: '50px',
        [theme.breakpoints.down('md')]: {
          display: 'flex',
          flexDirection: 'column-reverse',
          height: 'initial',
        },
      },
      caption: {
        paddingBottom: '0px !important',
        paddingTop: '0px !important',
        width: '100%',
        [theme.breakpoints.down('md')]: {
          display: 'none',
        },
      },
      captionRow: {
        display: 'flex',
        justifyContent: 'space-between',
      },
      tableContainer: {
        background: theme.palette.background.default,
      },
      tableCell: {
        color: theme.palette.text.primary,
        [theme.breakpoints.down('md')]: {
          paddingLeft: 'inherit',
          paddingRight: 'inherit',
        },
      },
      colorText: {
        color: theme.palette.text.primary,
        '& .MuiTablePagination-selectIcon': { color: theme.palette.text.primary },
        '& .MuiIconButton-root': { color: theme.palette.text.primary },
        '& .MuiIconButton-root.Mui-disabled': { color: '#8e8e8e' },
      },
      bubble: {
        fontFamily: 'Montserrat, sans-serif',
        borderRadius: '40px',
        padding: '8px 10px',
        textAlign: 'center',
        color: theme.palette.background.default,
        fontSize: '14px',
      },
      green: { background: theme.palette.custom.green },
      yellow: { background: theme.palette.custom.yellow },
      gray: { background: theme.palette.custom.gray },
      red: { background: theme.palette.custom.red },
      blue: { background: theme.palette.primary.main },
      loadingContainer: {
        width: '100%',
        height: '150px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      addressContainer: {
        width: '140px',
        maxWidth: '140px',
        minWidth: '140px',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        display: 'block',
        paddingLeft: '5px',
      },
      statusCell: {
        color: 'white !important',
        width: '130px',
        maxWidth: '130px',
        minWidth: '130px',
        boxSizing: 'content-box',
      },
      subDate: {
        fontSize: '14px',
        color: theme.palette.text.secondary,
      },
      link: {
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '14px',
        whiteSpace: 'nowrap',
        lineHeight: 1.6,
        color: theme.palette.primary.main,
        textDecoration: 'underline',
        cursor: 'pointer',
      },
      detailsButton: {
        paddingRight: '20px',
        color: theme.palette.primary.main,
      },
    }),
  { name: 'TransactionsHistoryTable' },
);
