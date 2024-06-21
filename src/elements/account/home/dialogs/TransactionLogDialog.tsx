import { SetStateAction, Dispatch, useEffect, useState } from 'react';

import Button from 'components/Button';

import { createStyles, makeStyles } from '@material-ui/core/styles';

import CustomDialog from 'elements/customComponents/CustomDialog';
import { LogRow } from 'elements/account/home/history/TransactionsHistoryTable';

import {
  INVOICE_SEVERITIES,
  datePrepare,
  getAddressUrlByParams,
  getCurrencyName,
  getDaysAgo,
  getTransactionUrlByParams,
} from 'utils';
import CurrencyLogo from 'components/CurrencyLogo';
import TitledText from 'components/TitledText';
import { CurrencyPrice } from '../Home';

type TransactionLogDialogProps = {
  openTransactionLogDialog: boolean;
  setOpenTransactionLogDialog: Dispatch<SetStateAction<boolean>>;
  logRow: LogRow;
  currencyPrices: CurrencyPrice[];
};

const TransactionLogDialog = (props: TransactionLogDialogProps): JSX.Element => {
  const styles = useStyles();
  const { setOpenTransactionLogDialog, openTransactionLogDialog, logRow, currencyPrices } = props;
  const [walletsAffected, setWalletsAffected] = useState<string[]>([]);
  const [currencyShortName, setCurrencyShortName] = useState('');
  const [currencyInternalName, setCurrencyInternalName] = useState('');
  const [currencyFullName, setCurrencyFullName] = useState('');
  const [direction, setDirection] = useState('');
  const [walletLength, setWalletLength] = useState(0);
  const [logRowDetails, setLogRowDetails] = useState<LogRow>({} as LogRow);

  const handleClose = () => {
    setOpenTransactionLogDialog(false);
  };

  useEffect(() => {
    if (Object.keys(logRow).length == 0) {
      handleClose();
      return;
    }

    let walletsAffected: string[] = [];
    let direction = 'send';
    let currencyName = '';

    if (logRow.transactionHistory != null) {
      walletsAffected = logRow.transactionHistory.context ?? [];
      walletsAffected = walletsAffected
        .map((x) => {
          return x.replace('main', 'personal');
        })
        .map((x) => {
          return x.replace('both', 'personal, store');
        });

      direction = logRow.transactionHistory.direction ?? '';
      direction = direction.replace(',', ', ');
      direction = direction.replace('usdt_account_activation', 'USDT account activation');

      if (logRow.transactionHistory.fromAddresses.length > 0) {
        setWalletLength(logRow.transactionHistory.fromAddresses[0].address.length);
      } else if (logRow.transactionHistory.toAddresses.length > 0) {
        setWalletLength(logRow.transactionHistory.toAddresses[0].address.length);
      } else {
        setWalletLength(0);
      }
      currencyName = logRow.transactionHistory.currencyName;
    } else if (logRow.withdrawRequest != null) {
      currencyName = logRow.withdrawRequest.currencyName;
    } else {
      handleClose();
    }
    setWalletsAffected(walletsAffected);
    setDirection(direction);

    setCurrencyShortName(getCurrencyName(currencyName, 'shortName'));
    setCurrencyInternalName(getCurrencyName(currencyName, 'internalName'));
    setCurrencyFullName(getCurrencyName(currencyName));

    setLogRowDetails(logRow);
  }, [logRow]);

  const convertToUsdString = (amount: number, currencyName: string) => {
    try {
      let currency = currencyPrices.filter((row) => row.currency.internalName === currencyName);
      let num = amount * currency[0].currentPrice;
      if (!isNaN(num) && num !== undefined && num !== null) {
        return `~${num.toFixed(2)} USD`;
      }
    } catch {
      return '-';
    }
  };

  const hashesHelper = (hash: string | string[], currencyName: string) => {
    if (typeof hash === 'string') {
      return hash !== '' && hash.length > walletLength ? (
        <TitledText
          title="Transaction hash"
          text={hash}
          valueToCopy={hash}
          linkToOpen={getTransactionUrlByParams(currencyName, hash)}
        />
      ) : (
        <TitledText title="Transaction hash" text="-" />
      );
    }

    hash = hash.filter((row) => row != '' && row.length > walletLength);

    if (hash.length <= 1) {
      return hash.length != 0 && hash[0] !== '' && hash[0].length > walletLength ? (
        <TitledText
          title="Transaction hash"
          text={hash[0]}
          valueToCopy={hash[0]}
          linkToOpen={getTransactionUrlByParams(currencyName, hash[0])}
        />
      ) : (
        <TitledText title="Transaction hash" text="-" />
      );
    }

    if (hash.length > 1) {
      return (
        <>
          <div className={styles.transactionsTitle}>Transaction hashes</div>
          {(hash as string[]).map((row) => {
            return row !== '' && hash[0].length > walletLength ? (
              <TitledText
                text={row}
                valueToCopy={row}
                linkToOpen={getTransactionUrlByParams(currencyName, row)}
              />
            ) : (
              '-'
            );
          })}
        </>
      );
    } else {
      return <div></div>;
    }
  };

  return (
    <CustomDialog
      scroll="body"
      className={styles.dialog}
      open={openTransactionLogDialog}
      onClose={handleClose}
    >
      <div className={styles.actions}>
        <div className={styles.header}>
          <div className={styles.title}>
            <div>Transaction information</div>
          </div>
          <div className={styles.buttons}>
            <Button onClick={handleClose} variant="outlined">
              CLOSE
            </Button>
          </div>
        </div>
        <div className={styles.topRowInfo}>
          <div className={styles.currencyContainer}>
            <CurrencyLogo size={64} allWide={true} currency={currencyShortName} />
            <div className={styles.currencyName}>{currencyFullName}</div>
          </div>
          <div className={styles.bubbles}>
            {logRowDetails.withdrawRequest != null ? (
              <div
                className={`${styles.bubble} ${
                  styles[INVOICE_SEVERITIES[logRowDetails.withdrawRequest.status]]
                }`}
              >
                {direction}
              </div>
            ) : (
              <div className={`${styles.bubble} ${styles.direction}`}>{direction}</div>
            )}
            {walletsAffected.length > 0 && (
              <div className={`${styles.bubble} ${styles.walletContext}`}>
                {walletsAffected.join(', ')}
              </div>
            )}
          </div>
        </div>
        {logRowDetails.transactionHistory != null && (
          <>
            <div className={styles.coreInfoRow}>
              <TitledText
                title="Amount"
                text={`${logRowDetails.transactionHistory.amount} ${currencyShortName}`}
                subText={convertToUsdString(
                  logRowDetails.transactionHistory.amount,
                  currencyInternalName,
                )}
                valueToCopy={`${logRowDetails.transactionHistory.amount}`}
              />
              <TitledText
                title="Fee"
                text={`${logRowDetails.transactionHistory.fee} ${currencyShortName}`}
                subText={convertToUsdString(
                  logRowDetails.transactionHistory.fee,
                  currencyInternalName,
                )}
                valueToCopy={`${logRowDetails.transactionHistory.fee}`}
              />
              <TitledText
                title="Bitsidy fee"
                text={`${logRowDetails.transactionHistory.bitsidyFee} ${currencyShortName}`}
                subText={convertToUsdString(
                  logRowDetails.transactionHistory.bitsidyFee,
                  currencyInternalName,
                )}
                valueToCopy={`${logRowDetails.transactionHistory.bitsidyFee}`}
              />
              <TitledText
                title="Balance after"
                text={`${logRowDetails.transactionHistory.balance} ${currencyShortName}`}
                subText={convertToUsdString(
                  logRowDetails.transactionHistory.balance,
                  currencyInternalName,
                )}
                valueToCopy={`${logRowDetails.transactionHistory.balance}`}
              />
              <TitledText
                title="Date"
                text={datePrepare(logRowDetails.transactionHistory.date)}
                subText={getDaysAgo(logRowDetails.transactionHistory.date)}
                valueToCopy={logRowDetails.transactionHistory.date}
              />
            </div>
            <div className={styles.fromToAddresses}>
              <div className={styles.fromToAddressesColumn}>
                <div className={styles.fromToAddressesTitle}>From addresses</div>
                {logRowDetails.transactionHistory.fromAddresses.length
                  ? logRowDetails.transactionHistory.fromAddresses.map((row) => {
                      return (
                        <TitledText
                          title=""
                          text={row.address}
                          subText={`${row.amount} ${currencyShortName}`}
                          valueToCopy={row.address}
                          linkToOpen={getAddressUrlByParams(
                            logRowDetails.transactionHistory?.currencyName ?? '',
                            row.address,
                          )}
                        />
                      );
                    })
                  : '-'}
              </div>
              <div className={styles.fromToAddressesColumn}>
                <div className={styles.fromToAddressesTitle}>To addresses</div>
                {logRowDetails.transactionHistory.toAddresses.length
                  ? logRowDetails.transactionHistory.toAddresses.map((row) => {
                      return (
                        <TitledText
                          title=""
                          text={row.address}
                          subText={`${row.amount} ${currencyShortName}`}
                          valueToCopy={row.address}
                          linkToOpen={getAddressUrlByParams(
                            logRowDetails.transactionHistory?.currencyName ?? '',
                            row.address,
                          )}
                        />
                      );
                    })
                  : '-'}
              </div>
            </div>
            <div className={styles.transactionsColumn}>
              {hashesHelper(
                logRowDetails.transactionHistory.hash,
                logRowDetails.transactionHistory.currencyName,
              )}
            </div>
          </>
        )}

        {logRowDetails.withdrawRequest != null && (
          <>
            <div className={styles.topRowInfo}>
              <div className={styles.title}>
                <div>
                  <div className={styles.subTitle}>Withdraw Request Data</div>
                  <div className={styles.subTitleNote}>Data you entered in the send form</div>
                </div>
              </div>
              <div className={styles.bubbles}>
                {logRowDetails.withdrawRequest.burn != null &&
                  logRowDetails.withdrawRequest.burn != false && (
                    <div className={`${styles.bubble} ${styles.direction}`}>burn</div>
                  )}
                {logRowDetails.withdrawRequest.freeze != null &&
                  logRowDetails.withdrawRequest.freeze != false && (
                    <div className={`${styles.bubble} ${styles.direction}`}>freeze</div>
                  )}
                {logRowDetails.withdrawRequest.borrowResources != null &&
                  logRowDetails.withdrawRequest.borrowResources != false && (
                    <div className={`${styles.bubble} ${styles.direction}`}>borrow resources</div>
                  )}
                <div
                  className={`${styles.bubble} ${
                    styles[INVOICE_SEVERITIES[logRowDetails.withdrawRequest.status]]
                  }`}
                >
                  {logRowDetails.withdrawRequest.status}
                </div>
              </div>
            </div>
            <div className={styles.hiddenData}>
              <div className={styles.coreInfoRow}>
                <TitledText
                  title="Amount"
                  text={`${logRowDetails.withdrawRequest.amount} ${currencyShortName}`}
                  subText={convertToUsdString(
                    logRowDetails.withdrawRequest.amount,
                    currencyInternalName,
                  )}
                  valueToCopy={`${logRowDetails.withdrawRequest.amount}`}
                />
                {logRowDetails.withdrawRequest.fee != null && (
                  <TitledText
                    title="Fee"
                    text={`${logRowDetails.withdrawRequest.fee} ${logRowDetails.withdrawRequest.feeUnit}`}
                    valueToCopy={`${logRowDetails.withdrawRequest.fee}`}
                  />
                )}
                <TitledText
                  title="Date"
                  text={datePrepare(logRowDetails.withdrawRequest.dateCreated)}
                  subText={getDaysAgo(logRowDetails.withdrawRequest.dateCreated)}
                  valueToCopy={logRowDetails.withdrawRequest.dateCreated}
                />
              </div>
            </div>
          </>
        )}
        <div className={styles.buttons}>
          <Button onClick={handleClose} variant="outlined">
            CLOSE
          </Button>
        </div>
      </div>
    </CustomDialog>
  );
};

export default TransactionLogDialog;

const useStyles = () => {
  const styles = makeStyles(
    (theme) =>
      createStyles({
        subTitle: {
          marginBottom: '4px',
          marginRight: '20px',
          [theme.breakpoints.down('sm')]: {
            marginRight: '0px',
          },
        },
        subTitleNote: {
          fontSize: '14px',
          color: theme.palette.text.secondary,
        },
        hiddenData: {
          '& > *': {
            marginBottom: '30px',
          },
        },
        buttons: {
          display: 'flex',
          justifyContent: 'center',
        },
        advancedInfo: {
          marginRight: '20px',
        },
        titleIcon: {
          paddingRight: '10px',
          color: theme.palette.primary.main,
        },
        header: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            '& > *:not(:last-child)': {
              marginBottom: '20px',
            },
          },
        },
        title: {
          display: 'flex',
          alignItems: 'center',
          color: theme.palette.text.primary,
          fontWeight: 400,
          fontSize: '24px',
          fontFamily: 'Montserrat, sans-serif !important',
        },
        content: {
          textAlign: 'center',
          color: theme.palette.text.primary,
        },
        dialog: {
          backdropFilter: 'blur(3px)',
          '& .MuiBackdrop-root': {
            background: theme.palette.common.white,
            opacity: '0.5 !important',
          },
          '& .MuiPaper-root': {
            width: '880px',
            minWidth: '880px',
            maxWidth: '880px',
            boxSizing: 'border-box',
            padding: '30px 30px 40px 30px',
            [theme.breakpoints.down('sm')]: {
              width: '100%',
              minWidth: '100%',
              maxWidth: '100%',
              padding: '20px 20px 30px 20px',
              margin: '0px !important',
            },
            background: theme.palette.background.default,
            color: theme.palette.common.black,
            boxShadow:
              '0px 9px 46px 8px rgba(0, 0, 0, 0.10), 0px 11px 15px -7px rgba(0, 0, 0, 0.20)',
            '&.MuiDialog-paper': {
              borderRadius: '4px',
            },
          },
        },
        actions: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly !important',
          '& > *:not(:last-child)': {
            marginBottom: '30px',
            [theme.breakpoints.down('sm')]: {
              marginBottom: '20px',
            },
          },
          [theme.breakpoints.down('sm')]: {
            padding: '0px',
          },
        },
        currencyName: {
          fontSize: '24px',
        },
        currencyContainer: {
          display: 'flex',
          alignItems: 'center',
          marginRight: '20px',
          [theme.breakpoints.down('sm')]: {
            marginRight: '40px',
          },
        },
        button: {
          color: theme.palette.common.black,
        },
        bubble: {
          fontFamily: 'Montserrat, sans-serif',
          borderRadius: '20px',
          padding: '8px 10px',
          textAlign: 'center',
          minWidth: '120px',
          color: theme.palette.background.default,
          fontSize: '14px',
        },
        bubbles: {
          display: 'flex',
          alignItems: 'center',
          '& $bubble': {
            marginLeft: '10px',
            marginRight: '10px',
          },
        },
        direction: {
          background: theme.palette.custom.blue,
        },
        feeType: {
          background: theme.palette.custom.blue,
        },
        walletContext: {
          background: theme.palette.custom.purple,
        },
        topRowInfo: {
          display: 'flex',
          alignItems: 'center',
          [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            '& > *:not(:last-child)': {
              marginBottom: '20px',
            },
          },
        },
        coreInfoRow: {
          display: 'flex',
          flexWrap: 'wrap',
          marginBottom: '10px !important',
          '& > *': {
            marginRight: '20px',
            marginBottom: '20px',
          },
          [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            '& > *': {
              marginRight: '0px',
              marginBottom: '20px',
            },
          },
        },
        fromToAddresses: {
          display: 'flex',
          justifyContent: 'space-between',
          [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            '& > *:not(:last-child)': {
              marginBottom: '20px',
            },
          },
        },
        fromToAddressesColumn: {
          width: '50%',
          '& > *:not(:last-child)': {
            marginBottom: '15px',
          },
          [theme.breakpoints.down('sm')]: {
            width: '100%',
          },
        },
        fromToAddressesTitle: {
          fontWeight: 500,
          marginBottom: '20px',
        },
        transactionsColumn: {
          '& > *:not(:last-child)': {
            marginBottom: '15px',
          },
        },
        transactionsTitle: {
          fontWeight: 500,
          marginBottom: '20px',
        },
        green: { background: theme.palette.custom.green },
        yellow: { background: theme.palette.custom.yellow },
        gray: { background: theme.palette.custom.gray },
        red: { background: theme.palette.custom.red },
      }),
    { name: 'TransactionLogDialog' },
  );
  return styles();
};
