import { useState } from 'react';
import Link from '@material-ui/core/Link';

import IconButton from 'components/IconButton';
import Slide, { SlideProps } from '@mui/material/Slide';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { TransitionProps } from '@mui/material/transitions';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';

import CustomSnackbar from 'elements/customComponents/CustomSnackbar';
import { InvoiceData } from './Invoice';
import { useCopyToClipboard } from 'utils';
import { getAddressUrlByParams } from 'utils';

import InvoiceQR from './InvoiceQR';

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

const InvoiceCommonInfo = ({ data }: { data: InvoiceData }): JSX.Element => {
  const styles = useStyles();
  const theme = useTheme();
  const [_value, copy] = useCopyToClipboard();
  const [snackbarState, setState] = useState<{
    open: boolean;
    Transition: React.ComponentType<
      TransitionProps & {
        children: React.ReactElement<any, any>;
      }
    >;
  }>({
    open: false,
    Transition: SlideTransition,
  });

  const handleOpenSnackbar = () => {
    setState({
      ...snackbarState,
      open: true,
    });
  };

  const handleCloseSnackbar = () => {
    setState({
      ...snackbarState,
      open: false,
    });
  };

  const handleClickAmount = () => {
    copy(String(data.invoice.amount)).then(() => handleOpenSnackbar());
  };

  const handleClickWallet = () => {
    copy(data.wallet.address).then(() => handleOpenSnackbar());
  };

  const copyAmount = () => {
    copy(String(data.invoice.amount - data.wallet.balance)).then(() => handleOpenSnackbar());
  };

  return (
    <>
      <div className={styles.content}>
        {data.status === 'detected_underpaid' && (
          <>
            <div className={`${styles.copiedFieldTitle} ${styles.orange} ${styles.mb6}`}>
              Send additional
            </div>
            <div className={styles.copiedField + ' ' + styles.additionalAmountContainer}>
              <div className={styles.orange + ' ' + styles.additionalAmount}>
                {(data.invoice.amount - data.wallet.balance)?.toFixed(8)} {data.currency}
              </div>
              <IconButton className={styles.button} onClick={copyAmount}>
                <ContentCopyIcon />
              </IconButton>
            </div>
          </>
        )}

        <div className={styles.copiedFieldTitle + ' ' + styles.mb6}>Invoice amount</div>
        <div className={styles.copiedField + ' ' + styles.amountContainer}>
          <div className={styles.contrastColor + ' ' + styles.amount}>
            {data.invoice.amount}
            <div className={styles.currency}>{data.currency}</div>
          </div>
          <IconButton className={styles.button} onClick={handleClickAmount}>
            <ContentCopyIcon />
          </IconButton>
        </div>

        <div className={styles.copiedFieldTitle + ' ' + styles.mb6}>Address</div>
        <div className={styles.walletAddressRow}>
          <div className={styles.copiedField + ' ' + styles.walletAddressContainer}>
            <div className={styles.contrastColor + ' ' + styles.walletAddress}>
              {data && data.wallet.address}
            </div>
            <IconButton className={styles.button} onClick={handleClickWallet}>
              <ContentCopyIcon />
            </IconButton>
          </div>
          <div className={styles.walletAddressIcon}>
            <Link
              href={getAddressUrlByParams(data.currency, data.wallet.address)}
              target="_blank"
              rel="noreferrer"
            >
              <OpenInNewIcon sx={{ color: theme.palette.common.black }} />
            </Link>
          </div>
        </div>

        <div className={styles.noteContainer}>
          <div className={styles.note}>
            <InfoOutlinedIcon className={styles.contrastColor + ' ' + styles.noteIcon} />
            <div className={styles.contrastColor + ' ' + styles.noteText}>
              Send the exact amount you see on this page, or your payment will fail. If you're using
              Binance or other service which doesn't add transaction fee to the final amount,
              calculate it accordingly
            </div>
          </div>
          <div>
            <InvoiceQR data={data!} />
          </div>
        </div>
      </div>
      <CustomSnackbar
        autoHideDuration={2000}
        open={snackbarState.open}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={handleCloseSnackbar}
        TransitionComponent={snackbarState.Transition}
        message="Saved to clipboard!"
        key={snackbarState.Transition.name}
      />
    </>
  );
};

export default InvoiceCommonInfo;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      content: {
        padding: '0px 16px',
      },
      additionalAmountContainer: {
        marginBottom: '20px',
        padding: '8px',
      },
      additionalAmount: {
        wordBreak: 'break-all',
      },
      amountContainer: {
        marginBottom: '20px',
        padding: '8px',
      },
      amount: {
        display: 'flex',
        wordBreak: 'break-all',
      },
      currency: {
        marginLeft: '6px',
        userSelect: 'none',
      },
      walletAddressIcon: {
        marginLeft: '12px',
      },
      walletAddress: {
        wordBreak: 'break-all',
        lineHeight: 1.6,
      },
      walletAddressContainer: {
        padding: '8px',
        width: '100%',
      },
      walletAddressRow: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
      },
      mb6: {
        marginBottom: '6px',
      },
      button: {
        color: theme.palette.common.black,
      },
      copiedField: {
        display: 'flex',
        fontFamily: 'DM Mono, sans-serif',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid #c4c4c4',
        borderRadius: '4px',
      },
      copiedFieldTitle: {
        fontSize: '14px',
        lineHeight: 1.6,
        color: '#666666',
      },
      noteContainer: {
        display: 'flex',
        marginBottom: '30px',
        [theme.breakpoints.down('sm')]: {
          display: 'block',
        },
      },
      note: {
        width: '100%',
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
          paddingBottom: '20px',
        },
      },
      noteText: {
        fontSize: '14px',
        lineHeight: 1.6,
        letterSpacing: '0.15px',
      },
      noteIcon: {
        marginRight: '16px',
      },
      orange: {
        color: theme.palette.custom.yellow,
        fontWeight: 700,
      },
      contrastColor: {
        color: theme.palette.common.black,
      },
    }),
  { name: 'InvoiceTable' },
);
