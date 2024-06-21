import { createStyles, makeStyles } from '@material-ui/core/styles';
import Collapse from '@mui/material/Collapse';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import IconButton from 'components/IconButton';
import Tooltip from 'components/Tooltip';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';

const SendDialogDetails = ({
  isVisible,
  currencyName,
  currencyShort,
  spendAmount,
  spendingAmount,
  fee,
  feeType,
  bitsidyFee,
  transactionsAmount,
  usdForOneCrypto,
  change,
}: {
  isVisible: boolean;
  currencyName: string;
  currencyShort: string;
  spendAmount: number;
  spendingAmount: number;
  fee: number;
  feeType: string;
  bitsidyFee: number;
  transactionsAmount: number | null;
  usdForOneCrypto: number;
  change: number;
}): JSX.Element => {
  const styles = useStyles();

  return (
    <Collapse in={isVisible}>
      <div className={styles.info}>
        {spendAmount !== null && spendAmount !== 0 && (
          <div className={styles.infoRow}>
            <div className={styles.infoLabel}>You spend</div>
            <div className={styles.infoValue}>
              {spendAmount} {currencyShort}
            </div>
            <div className={styles.infoSubtext}>
              ~{(spendAmount * usdForOneCrypto).toFixed(2)} USD
            </div>
          </div>
        )}
        {spendAmount !== null && spendAmount !== 0 && (
          <div className={styles.descriptionIconContainer}>
            <div className={styles.icon}>
              <ArrowDownwardIcon fontSize="medium" />
            </div>
          </div>
        )}
        <div className={styles.descriptionRow}>
          <div className={styles.infoRow}>
            <div className={styles.infoLabel}>You're sending</div>
            <div className={styles.infoValue}>
              {spendingAmount} {currencyShort}
            </div>
            <div className={styles.infoSubtext}>
              ~{(spendingAmount * usdForOneCrypto).toFixed(2)} USD
            </div>
          </div>
          {currencyName !== 'USDT_trc20' && currencyName !== 'TRX' && (
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>Blockchain fee</div>
              <div className={styles.infoValue}>
                {fee} {currencyShort}
              </div>
              <div className={styles.infoSubtext}>~{(fee * usdForOneCrypto).toFixed(2)} USD</div>
            </div>
          )}
          {currencyName === 'USDT_trc20' && (
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>
                {feeType === 'energy'
                  ? 'Energy fee'
                  : feeType === 'borrow'
                  ? 'Borrowed fee'
                  : 'TRX fee'}
              </div>
              <div className={styles.infoValue}>
                {feeType === 'energy'
                  ? fee
                  : feeType === 'borrow'
                  ? fee + ' ' + currencyShort
                  : fee + ' TRX'}
              </div>
              {feeType === 'borrow' && (
                <div className={styles.infoSubtext}>~{(fee * usdForOneCrypto).toFixed(2)} USD</div>
              )}
            </div>
          )}
          {bitsidyFee !== null && bitsidyFee !== 0 && (
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>Bitsidy fee</div>
              <div className={styles.infoValue}>{bitsidyFee + ' ' + currencyShort}</div>
              <div className={styles.infoSubtext}>
                ~{(bitsidyFee * usdForOneCrypto).toFixed(2)} USD
              </div>
            </div>
          )}
          {currencyName === 'TRX' && (
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>TRX fee</div>
              <div className={styles.infoValue}>{fee} TRX</div>
            </div>
          )}
          {transactionsAmount !== null && transactionsAmount !== 0 && (
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>Transactions</div>
              <div className={styles.infoValue}>{transactionsAmount}</div>
            </div>
          )}
          {change !== null && change !== 0 && (
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>
                Change
                <Tooltip
                  text={`Change is the ${currencyName} returned to your wallet after this transaction. It becomes available once confirmed on the network. Prior to confirmation, it is not accessible for new transactions.`}
                >
                  <IconButton size="zero" className={styles.labelIcon}>
                    <LiveHelpIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </div>
              <div className={styles.infoValue}>{change + ' ' + currencyShort}</div>
              <div className={styles.infoSubtext}>~{(change * usdForOneCrypto).toFixed(2)} USD</div>
            </div>
          )}
        </div>
      </div>
    </Collapse>
  );
};

export default SendDialogDetails;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      labelIcon: {
        padding: '0px 8px',
      },
      descriptionIconContainer: {
        display: 'flex',
        marginRight: '30px',
      },
      icon: {
        color: theme.palette.custom.blue,
        padding: '8px',
      },
      descriptionRow: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        [theme.breakpoints.down('sm')]: {
          flexWrap: 'nowrap',
          flexDirection: 'column',
        },
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
          marginBottom: '15px',
        },
      },
      infoRow: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: '140px',
        marginLeft: '20px',
        marginRight: '20px',
        marginBottom: '20px',
        [theme.breakpoints.down('sm')]: {
          '&:not(:last-child)': {
            marginBottom: '15px',
          },
        },
      },
      infoLabel: {
        color: theme.palette.text.secondary,
        lineHeight: 1.6,
        fontSize: '14px',
      },
      infoValue: {
        color: theme.palette.text.primary,
        lineHeight: 1.6,
      },
      infoSubtext: {
        color: theme.palette.text.secondary,
        lineHeight: 1.6,
        fontSize: '14px',
      },
      row: {
        display: 'flex',
        justifyContent: 'space-between',
      },
    }),
  { name: 'SendDialogDetails' },
);
