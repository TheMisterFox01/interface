import { Dispatch, SetStateAction } from 'react';

import Button from 'components/Button';

import TableRow from 'components/table/TableRow';
import TableCell from 'components/table/TableCell';

import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { WalletRow } from 'elements/account/home/Home';
import CurrencyLogo from 'components/CurrencyLogo';
import { getCurrencyName } from 'utils';
import EditIcon from '@mui/icons-material/Edit';
import { SubUser } from 'utils/subUsers';

type WalletTableRowProps = {
  walletRow: WalletRow;
  setOpenSendDialog: Dispatch<SetStateAction<boolean>>;
  showDetailsDialog: () => void;
  setCurrentWalletRow: Dispatch<SetStateAction<WalletRow>>;
  className?: string;
  editSubUser: (subUser: SubUser) => void;
};

const WalletTableRow = (props: WalletTableRowProps): JSX.Element => {
  const { walletRow, setOpenSendDialog, showDetailsDialog, setCurrentWalletRow, editSubUser } =
    props;

  const styles = useStyles();
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickOpenSendDialog = () => {
    setCurrentWalletRow(walletRow);
    setOpenSendDialog(true);
  };

  const handleClickOpenDetailsDialog = () => {
    setCurrentWalletRow(walletRow);
    showDetailsDialog();
  };

  const colorHelper = (amount: number): string => {
    if (amount > 0) {
      return styles.green;
    }
    if (amount < 0) {
      return styles.red;
    }

    return styles.gray;
  };

  const editSubUserHandler = () => {
    editSubUser(walletRow.subUser!);
  };

  return (
    <TableRow className={styles.tableRow}>
      <TableCell className={styles.tableCell}>
        <div className={styles.currencyCell}>
          <CurrencyLogo className={styles.currencyLogo} size={48} currency={walletRow.shortName} />
          <div className={styles.marketLabel}>{getCurrencyName(walletRow.name, 'displayName')}</div>
        </div>
      </TableCell>
      <TableCell header="Account">
        {walletRow.subUser?.username == null ? (
          isPhone ? (
            'Main wallet'
          ) : (
            ''
          )
        ) : (
          <div className={styles.accountContainer}>
            {walletRow.subUser?.username}
            <EditIcon
              fontSize="small"
              onClick={editSubUserHandler}
              className={styles.accountEditIcon}
            />
          </div>
        )}
      </TableCell>
      <TableCell className={styles.tableCell} header="Available amount">
        <div>
          <div>
            <div className={styles.mainText}>
              {walletRow.availableAmount} {walletRow.shortName}
            </div>
            <div className={styles.secondText}>~{walletRow.availableAmountUsd} USD</div>
          </div>
        </div>
      </TableCell>
      <TableCell className={styles.tableCell} header="Market">
        <div className={styles.chartContainer}>
          <div>
            <div className={styles.mainText}>{`1 ${
              walletRow.shortName
            } = ~${walletRow.currentPrice?.toFixed(2)} USD`}</div>
            <div className={styles.chartStats}>
              {walletRow.priceStats.dayCurrencyAmountChangeInPercents !== null && (
                <div
                  className={colorHelper(walletRow.priceStats.dayCurrencyAmountChangeInPercents)}
                >
                  {walletRow.priceStats.dayCurrencyAmountChangeInPercents > 0 ? '+' : ''}
                  {walletRow.priceStats.dayCurrencyAmountChangeInPercents?.toFixed(2)}% day
                </div>
              )}
              {walletRow.priceStats.weekCurrencyAmountChangeInPercents !== null && (
                <div
                  className={colorHelper(walletRow.priceStats.weekCurrencyAmountChangeInPercents)}
                >
                  {walletRow.priceStats.weekCurrencyAmountChangeInPercents > 0 ? '+' : ''}
                  {walletRow.priceStats.weekCurrencyAmountChangeInPercents?.toFixed(2)}% week
                </div>
              )}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className={styles.tableCell + ' ' + styles.buttonContainer}>
        <Button
          className={styles.secondButton}
          variant="outlined"
          onClick={handleClickOpenDetailsDialog}
        >
          SHOW MORE
        </Button>
      </TableCell>
      <TableCell className={styles.tableCell + ' ' + styles.buttonContainer}>
        {walletRow.availableAmount > 0.0 && (
          <Button
            className={styles.sendButton}
            variant="contained"
            onClick={handleClickOpenSendDialog}
          >
            SEND
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

export default WalletTableRow;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      buttonContainer: {
        maxWidth: '150px',
        width: '150px',
      },
      tableCell: {
        height: '92px',
        [theme.breakpoints.down('md')]: {
          height: 'initial',
        },
      },
      currencyCell: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        maxWidth: '120px',
        [theme.breakpoints.down('md')]: {
          flexDirection: 'row',
          maxWidth: 'initial',
        },
      },
      secondButton: {},
      sendButton: {},
      currencyLogo: {
        transitionProperty: 'transform',
        transitionDuration: '0.5s',
        transitionTimingFunction: 'cubic-bezier(0.18, 0.89, 0.32, 1.28)',
        [theme.breakpoints.down('md')]: {
          marginRight: '20px',
        },
      },
      mainText: {
        fontSize: '16px',
        color: theme.palette.text.primary,
        lineHeight: 1.6,
      },
      marketLabel: {
        color: theme.palette.text.secondary,
        fontSize: '14px',
        lineHeight: 1.4,
        opacity: 0,
        maxHeight: '0px',
        transitionProperty: 'opacity, max-height',
        transitionDuration: '0.5s',
        transitionTimingFunction: 'cubic-bezier(0.18, 0.89, 0.32, 1.28)',
        textAlign: 'center',
        [theme.breakpoints.down('md')]: {
          opacity: 1,
          maxHeight: 'initial',
          fontSize: '16px',
          color: theme.palette.text.primary,
        },
      },
      secondText: {
        color: theme.palette.text.secondary,
        fontSize: '14px',
        lineHeight: 1.6,
      },
      tableRow: {
        '&:hover $marketLabel': {
          opacity: 1,
          maxHeight: '20px',
        },
        '&:hover $currencyLogo': {
          transform: 'scale(0.75)',
        },
        [theme.breakpoints.down('md')]: {
          '&:hover $currencyLogo': {
            transform: 'initial',
          },
        },
      },
      chartContainer: {
        display: 'flex',
      },
      chartStats: {
        display: 'flex',
        justifyContent: 'space-around',
        marginRight: '20px',
        '& > *:not(:last-child)': {
          marginRight: '20px',
        },
        '& *': {
          lineHeight: 1.6,
        },
      },
      accountContainer: {
        display: 'flex',
        alignItems: 'center',
      },
      accountEditIcon: {
        color: theme.palette.custom.text.secondary,
        marginLeft: '10px',
        cursor: 'pointer',
      },
      green: { color: theme.palette.custom.green },
      gray: { color: theme.palette.custom.gray },
      red: { color: theme.palette.custom.red },
    }),
  { name: 'WalletTable' },
);
