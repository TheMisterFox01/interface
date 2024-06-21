import { useTheme, makeStyles, createStyles } from '@material-ui/core/styles';

type Status =
  | 'wait'
  | 'detected'
  | 'detected_underpaid'
  | 'success'
  | 'underpaid'
  | 'expired'
  | 'fail'
  | '';

type InvoiceHeaderProps = {
  status: Status;
  underpaidAmount?: string;
  currency: string;
  walletBalance: number;
};

const InvoiceStatusHeader = ({ status, underpaidAmount, currency }: InvoiceHeaderProps): JSX.Element => {
  const theme = useTheme();

  const getHeaderSettings = (status: Status, underpaidAmount = '') => {
    switch (status) {
      case 'success':
        return { content: 'Payment completed', color: theme.palette.custom.green };
      case 'expired':
        return { content: 'Expired', color: theme.palette.custom.red };
      case 'fail':
        return { content: 'Fail', color: theme.palette.custom.red  };
      case 'underpaid':
        return { content: 'Underpaid', color: theme.palette.custom.red };
      case 'detected':
        return { content: `Received, waiting for confirmation`, color: theme.palette.primary.main };
      case 'detected_underpaid':
        return { content: `Underpaid ${underpaidAmount} ${currency}`, color: theme.palette.custom.yellow };
      case 'wait':
        return { content: `Waiting for the payment`, color: theme.palette.primary.main };
      default:
        return { content: null, color: '' };
    }
  };

  const { content, color } = getHeaderSettings(status, underpaidAmount);

  const useStyles = makeStyles(
    () =>
      createStyles({
        content: {
          color: color,
          marginBottom: '30px',
          fontWeight: 700,
          textAlign: 'center',
        },
        status: {
          position: 'absolute',
          top: 0,
          left: 0,
          height: '4px',
          width: '100%',
          background: color
        },
      }),
    { name: 'InvoiceStatusHeader' },
  );
  const styles = useStyles();

  return content ? (
    <>
      <div className={styles.content}>
        {content}
      </div>
      <div className={styles.status}></div>
    </>
  ) : (
    <></>
  );
};

export default InvoiceStatusHeader;


