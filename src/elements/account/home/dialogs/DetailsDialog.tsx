import CustomDialog from 'elements/customComponents/CustomDialog';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useEffect } from 'react';
import Button from 'components/Button';

import { CurrencyPrice, WalletRow } from '../Home';
import CurrencyLogo from 'components/CurrencyLogo';
import AccountSecondTitle from 'elements/AccountSecondTitle';
import TransactionsHistoryTable from '../history/TransactionsHistoryTable';

type DetailsDialogProps = {
  openDetailsDialog: boolean;
  closeDialog: () => void;
  currentWalletRow: WalletRow;
  openSendDialog: () => void;
  openReceiveDialog: () => void;
  openFreezeDialog: () => void;
  openUnfreezeDialog: () => void;
  currencyPrices: CurrencyPrice[];
};

const DetailsDialog = (props: DetailsDialogProps) => {
  const styles = useStyles();

  const {
    openDetailsDialog,
    closeDialog,
    currentWalletRow,
    openSendDialog,
    openReceiveDialog,
    openFreezeDialog,
    openUnfreezeDialog,
    currencyPrices,
  } = props;

  const colorHelper = (amount: number): string => {
    if (amount > 0) {
      return styles.green;
    }
    if (amount < 0) {
      return styles.red;
    }

    return styles.gray;
  };

  useEffect(() => {
    if (Object.keys(currentWalletRow).length === 0 && openDetailsDialog === true) {
      closeDialog();
    }
  }, [openDetailsDialog]);

  const handleClickOpenSendDialog = () => {
    openSendDialog();
  };

  const handleClickOpenReceiveDialog = () => {
    openReceiveDialog();
  };

  return (
    <CustomDialog
      fullScreen
      scroll="body"
      className={styles.dialog + ' ' + (false ? styles.locked : '')}
      open={openDetailsDialog}
      onClose={closeDialog}
    >
      <div className={styles.dialogCenter}>
        <div className={styles.dialogContainer}>
          <div className={styles.topRow}>
            <div className={styles.towRowTitle}>
              <div>
                <CurrencyLogo size={48} currency={currentWalletRow.shortName} />
              </div>
              <div className={styles.title}>{currentWalletRow.fullName}</div>
            </div>
            <div className={styles.topRowButtons}>
              {currentWalletRow.availableAmount > 0 && (
                <Button
                  className={styles.sendButton}
                  variant="contained"
                  onClick={handleClickOpenSendDialog}
                >
                  SEND
                </Button>
              )}
              <Button variant="outlined" onClick={handleClickOpenReceiveDialog}>
                RECEIVE
              </Button>
              {currentWalletRow.shortName === 'TRX' && (
                <Button variant="outlined" onClick={openFreezeDialog}>
                  FREEZE
                </Button>
              )}
              {currentWalletRow.shortName === 'TRX' && (
                <Button variant="outlined" onClick={openUnfreezeDialog}>
                  UNFREEZE
                </Button>
              )}
              <Button variant="outlined" onClick={closeDialog}>
                CLOSE
              </Button>
            </div>
          </div>
          <div className={styles.stats}>
            <div>
              {`1 ${currentWalletRow.shortName} = ~${currentWalletRow.currentPrice?.toFixed(
                2,
              )} USD`}
            </div>
            <div className={styles.priceDynamic}>
              {currentWalletRow.priceStats?.dayCurrencyAmountChangeInPercents != null && (
                <div
                  className={colorHelper(
                    currentWalletRow.priceStats.dayCurrencyAmountChangeInPercents,
                  )}
                >
                  {currentWalletRow.priceStats.dayCurrencyAmountChangeInPercents > 0 ? '+' : ''}
                  {currentWalletRow.priceStats.dayCurrencyAmountChangeInPercents?.toFixed(2)}% day
                </div>
              )}
              {currentWalletRow.priceStats?.weekCurrencyAmountChangeInPercents != null && (
                <div
                  className={colorHelper(
                    currentWalletRow.priceStats.weekCurrencyAmountChangeInPercents,
                  )}
                >
                  {currentWalletRow.priceStats.weekCurrencyAmountChangeInPercents > 0 ? '+' : ''}
                  {currentWalletRow.priceStats.weekCurrencyAmountChangeInPercents?.toFixed(2)}% week
                </div>
              )}
            </div>
          </div>
          <div className={styles.amounts}>
            <div>
              <div className={styles.secondText}>Available amount</div>
              <div className={styles.mainText}>
                {currentWalletRow.availableAmount} {currentWalletRow.shortName}
              </div>
              <div className={styles.secondText}>~{currentWalletRow.availableAmountUsd} USD</div>
            </div>
            <div>
              <div className={styles.secondText}>Locked amount</div>
              <div className={styles.mainText}>
                {currentWalletRow.lockedAmount} {currentWalletRow.shortName}
              </div>
              <div className={styles.secondText}>~{currentWalletRow.lockedAmountUsd} USD</div>
            </div>
            {currentWalletRow.shortName === 'TRX' && (
              <div>
                <div className={styles.secondText}>Energy (available/total)</div>
                <div className={styles.mainText}>
                  {currentWalletRow.availableEnergyAmount ?? 0} /{' '}
                  {currentWalletRow.totalEnergyAmount ?? 0}
                </div>
              </div>
            )}
            {currentWalletRow.shortName === 'TRX' && (
              <div>
                <div className={styles.secondText}>Bandwidth (available/total)</div>
                <div className={styles.mainText}>
                  {currentWalletRow.availableBandwidthAmount ?? 0} /{' '}
                  {currentWalletRow.totalBandwidthAmount ?? 0}
                </div>
              </div>
            )}
          </div>
          <AccountSecondTitle title="Transactions history" description="" />
          <TransactionsHistoryTable
            isPageReloaded={false}
            currencyPrices={currencyPrices}
            subUser={currentWalletRow.subUser}
            specialCurrency={currentWalletRow.name}
          />
        </div>
      </div>
    </CustomDialog>
  );
};

export default DetailsDialog;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      priceDynamic: {
        display: 'flex',
        '& > div': {
          marginRight: '20px',
        },
      },
      dialogBody: {},
      amounts: {
        marginBottom: '40px',
        display: 'flex',
        '& > *:not(:last-child)': {
          marginRight: '50px',
        },
        [theme.breakpoints.down('sm')]: {
          flexDirection: 'column',
          '& > *:not(:last-child)': {
            marginRight: '0px',
            marginBottom: '20px',
          },
        },
      },
      secondText: {
        color: theme.palette.text.secondary,
        fontSize: '14px',
        lineHeight: 1.6,
      },
      mainText: {
        color: theme.palette.text.primary,
        lineHeight: 1.6,
      },
      title: {
        color: theme.palette.text.primary,
        fontWeight: 400,
        fontSize: '24px',
        fontFamily: 'Montserrat, sans-serif !important',
        marginLeft: '20px',
      },
      topRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        [theme.breakpoints.down('sm')]: {
          flexDirection: 'column',
          alignItems: 'start',
          '& > *:not(:last-child)': {
            marginRight: '0px',
            marginBottom: '20px',
          },
        },
      },
      topRowButtons: {
        display: 'flex',
        '& > *:not(:last-child)': {
          marginRight: '20px',
        },
        [theme.breakpoints.down('sm')]: {
          flexDirection: 'column',
          '& > *:not(:last-child)': {
            marginRight: '0px',
            marginBottom: '20px',
          },
        },
      },
      towRowTitle: {
        display: 'flex',
        alignItems: 'center',
      },
      stats: {
        display: 'flex',
        color: theme.palette.text.primary,
        marginBottom: '20px',
        '& > *:not(:last-child)': {
          marginRight: '20px',
        },
        [theme.breakpoints.down('md')]: {
          flexDirection: 'column',
          '& > *:not(:last-child)': {
            marginRight: '0px',
            marginBottom: '20px',
          },
        },
      },
      subTitle: {
        textAlign: 'center',
      },
      content: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        '& > *': {
          marginBottom: '30px !important',
        },
      },
      dialogCenter: {
        display: 'flex',
        justifyContent: 'center',
      },
      dialogContainer: {
        overflowX: 'hidden',
        marginTop: '40px',
        width: '100%',
        maxWidth: '100%',
        minWidth: '100%',
        padding: '30px 30px 0px 30px',
        boxSizing: 'border-box',
        [theme.breakpoints.down('sm')]: {
          padding: '20px 20px 0px 20px',
          margin: '0px !important',
        },
        [theme.breakpoints.up('lg')]: {
          width: '1200px',
          minWidth: '1200px',
          maxWidth: '1200px',
          padding: '0 25px',
        },
        [theme.breakpoints.up('xl')]: {
          padding: '0 65px',
        },
        [theme.breakpoints.down('md')]: {
          boxSizing: 'border-box',
        },
      },
      dialog: {
        backdropFilter: 'blur(3px)',
        '& .MuiBackdrop-root': {
          background: theme.palette.background.default,
          opacity: '1 !important',
        },
        '& .MuiPaper-root': {
          overflowX: 'hidden',
          width: '100%',
          maxWidth: '100%',
          minWidth: '100%',
          background: theme.palette.background.default,
          boxShadow: 'none',
          '&.MuiDialog-paper': {
            borderRadius: '4px',
          },
        },
      },
      actions: {
        display: 'flex',
        justifyContent: 'center !important',
        paddingBottom: '40px',
      },
      button: {
        width: 'auto !important',
        background: theme.palette.success.main,
        color: theme.palette.common.white,
      },
      closeButton: {
        width: 'auto !important',
        fontFamily: 'Montserrat, sans-serif !important',
        background: 'none',
        borderColor: theme.palette.text.primary,
        color: theme.palette.text.primary,
        marginRight: '20px !important',
        '&.MuiButtonBase-root:hover': {
          borderColor: theme.palette.text.primary,
        },
      },
      info: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '30px',
        '& > *:not(:last-child)': {
          marginBottom: '10px',
        },
      },
      infoRow: {
        width: '75%',
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
          width: '100%',
        },
      },
      errorTextMessage: {
        marginBottom: '30px',
        fontWeight: 500,
        color: theme.palette.custom.red,
        textAlign: 'center',
      },
      sendButton: {
        padding: '8px 12px !important',
        fontFamily: 'Montserrat, sans-serif  !important',
        background: theme.palette.primary.main,
        color: '#ffffff',
        fontWeight: 400,
        '&.MuiButtonBase-root:hover': {
          background: theme.palette.primary.main,
        },
      },
      locked: {
        '& fieldset': {
          pointerEvents: 'none',
        },
        '& input': {
          pointerEvents: 'none',
        },
        '& .MuiInputBase-root': {
          pointerEvents: 'none',
        },
        '& $sendButton': {
          pointerEvents: 'none',
        },
      },
      row: {
        display: 'flex',
        justifyContent: 'space-between',
      },
      amountHelper: {
        display: 'flex',
        fontSize: '14px',
        marginTop: '5px',
        marginLeft: '12px',
        color: theme.palette.text.secondary,
      },
      amountHelperWarning: {
        display: 'flex',
        fontSize: '14px',
        marginTop: '5px',
        marginLeft: '12px',
        color: '#D32F2F',
      },
      amount: {
        width: '200px',
        marginRight: '10px !important',
        [theme.breakpoints.down('sm')]: {
          width: '100%',
        },
      },
      feePresets: {
        marginRight: '20px !important',
      },
      loadingContainer: {
        width: '100%',
        height: '150px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      loadingLinearContainer: {
        width: '100%',
        position: 'absolute',
        marginLeft: '-20px',
        top: 0,
      },
      actionsContent: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: theme.palette.text.primary,
      },
      topContainer: {
        display: 'flex',
        justifyContent: 'center',
        height: '48px',
        marginBottom: '30px',
      },
      topImage: {
        marginRight: '20px',
      },
      topText: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
      },
      walletText: {
        display: 'flex',
        flexDirection: 'column',
      },
      walletMainText: {
        color: theme.palette.text.primary,
        marginBottom: '4px',
      },
      walletSecondText: {
        color: theme.palette.text.secondary,
        fontSize: '14px',
      },
      green: { color: theme.palette.custom.green },
      gray: { color: theme.palette.custom.gray },
      red: { color: theme.palette.custom.red },
    }),
  { name: 'DetailsDialog' },
);
