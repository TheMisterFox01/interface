import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import StoreIcon from '@mui/icons-material/Store';
import CircularProgress from 'components/CircularProgress';

import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';

import ThemeSwitcher from '../ThemeSwitcher';
import InvoiceStatusHeader from './InvoiceStatusHeader';
import InvoiceCommonInfo from './InvoiceCommonInfo';
import InvoiceDetails from './InvoiceDetails';
import { postData, GET_INVOICE_DATA_BY_ID_PATH } from 'utils';

type Status =
  | 'wait'
  | 'detected'
  | 'detected_underpaid'
  | 'success'
  | 'underpaid'
  | 'expired'
  | 'fail';

export type InvoiceData = {
  status: Status;
  currency: string;
  hashList: string[];
  invoice: {
    amount: number;
    amountUsd: number;
    callbackFail: string;
    callbackNotify: string;
    callbackSuccess: string;
    customString: string;
    date: string;
    dateUpdated: string;
    email: string;
    expiration: string;
    extendedExpiration: string;
    invoiceId: string;
  };
  store: {
    logoUrl: string;
    darkLogoUrl: string;
    name: string;
    storeUrl: string;
  };
  wallet: {
    address: string;
    balance: number;
  };
};

const Invoice = (): JSX.Element => {
  const styles = useStyles();
  const theme = useTheme();
  const router = useRouter();
  const [underpaidAmount, setUnderpaidAmount] = useState('');
  const [invoiceStatus, setInvoiceStatus] = useState<Status>('wait');
  const [invoiceData, setInvoiceData] = useState<InvoiceData>();
  const [isLoading, setIsLoading] = useState(true);
  const [logoURL, setLogoURL] = useState('');
  const [logoURLDark, setLogoURLDark] = useState('');

  const getInvoice = async () => {
    const response = await postData(
      GET_INVOICE_DATA_BY_ID_PATH,
      {
        invoiceId: router.query.invoice,
      },
      false,
    );

    if (response.result !== 'error') {
      const data = response.data as InvoiceData;
      const {
        wallet: { balance },
        invoice: { amount },
      } = data;

      const newStatus =
        data.status === 'detected' && balance < amount ? 'detected_underpaid' : data.status;
      data.status = newStatus;
      const underpaidAmount =
        newStatus === 'detected_underpaid' ? `${balance?.toFixed(8)} / ${amount?.toFixed(8)}` : '';
      setUnderpaidAmount(underpaidAmount);
      setInvoiceStatus(data.status);

      setInvoiceData(data);

      if (data?.store.logoUrl && data?.store.darkLogoUrl) {
        setLogoURL(data?.store.logoUrl);
        setLogoURLDark(data?.store.darkLogoUrl);
      } else if (data?.store.logoUrl) {
        setLogoURL(data?.store.logoUrl);
        setLogoURLDark(data?.store.logoUrl);
      } else if (data?.store.darkLogoUrl) {
        setLogoURL(data?.store.darkLogoUrl);
        setLogoURLDark(data?.store.darkLogoUrl);
      }
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (router.query.invoice) {
      getInvoice().catch((error) => console.log(error));
      setInterval(() => getInvoice().catch((error) => console.log(error)), 15000);
    }
  }, [router.query.invoice]);

  const defaultIconsColor = theme.palette.type === 'light' ? '#A1A1A1' : '#fff';
  const logoBackground =
    theme.palette.type === 'light'
      ? styles.logoImageBackgroundLight
      : styles.logoImageBackgroundDark;
  const storeLogo = theme.palette.type === 'light' ? logoURL : logoURLDark;

  return (
    <main className={styles.section}>
      <Head>
        <title>Bitsidy - Invoice</title>
      </Head>
      <div className={styles.content}>
        {isLoading ? (
          <div className={styles.loading}>
            <CircularProgress size={48} />
          </div>
        ) : invoiceData ? (
          <>
            <div className={styles.logo}>
              <div className={`${styles.logoImage} ${logoBackground}`}>
                {storeLogo ? (
                  <img height="64" src={storeLogo}></img>
                ) : (
                  <StoreIcon sx={{ fontSize: '64px', color: defaultIconsColor }} />
                )}
              </div>
              <div className={styles.contrastColor}>{invoiceData?.store.name}</div>
            </div>
            <div className={styles.invoiceTitleContainer}>
              <div className={styles.invoiceTitleFor}>Invoice for</div>
              <div className={styles.invoiceTitleEmail}>{invoiceData.invoice.email}</div>
              <div className={styles.invoiceTitleCustomString}>
                {invoiceData.invoice.customString}
              </div>
            </div>
            <InvoiceStatusHeader
              status={invoiceStatus}
              underpaidAmount={underpaidAmount}
              currency={invoiceData.currency}
              walletBalance={invoiceData.wallet.balance}
            />
            <InvoiceCommonInfo data={invoiceData} />
            <InvoiceDetails data={invoiceData} />
          </>
        ) : (
          <div className={styles.unknown}>Unknown invoice</div>
        )}
      </div>
      <div className={styles.bottomContainer}>
        <div className={styles.contrastColor + ' ' + styles.bottom}>POWERED BY BITSIDY.COM</div>
        <ThemeSwitcher colorType="dark" />
      </div>
    </main>
  );
};

export default Invoice;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      unknown: {
        textAlign: 'center',
        color: theme.palette.common.black,
      },
      loading: {
        display: 'flex',
        justifyContent: 'center',
      },
      bottomContainer: {
        marginBottom: '16px',
        textAlign: 'center',
      },
      bottom: {
        fontSize: '12px',
      },
      section: {
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: theme.palette.background.default,
      },
      logo: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        marginBottom: '30px',
      },
      logoImage: {
        margin: '10px 0px',
        justifyContent: 'center',
        padding: '10px',
        borderRadius: '10px',
      },
      logoImageBackgroundLight: {
        boxShadow: 'inset 0px 1000px 0px rgba(0, 0, 0, 0.05)',
      },
      logoImageBackgroundDark: {
        boxShadow: 'inset 0px 1000px 4px rgba(255, 255, 255, 0.05)',
      },
      content: {
        margin: '0 5px',
        maxWidth: '540px',
        width: '100%',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        [theme.breakpoints.down('sm')]: {
          padding: '0px',
        },
      },
      contrastColor: {
        color: theme.palette.text.primary,
      },
      invoiceTitleContainer: {
        marginBottom: '30px',
      },
      invoiceTitleFor: {
        marginBottom: '10px',
        color: theme.palette.text.secondary,
        textAlign: 'center',
      },
      invoiceTitleEmail: {
        marginBottom: '10px',
        color: theme.palette.text.primary,
        textAlign: 'center',
      },
      invoiceTitleCustomString: {
        color: theme.palette.text.primary,
        textAlign: 'center',
      },
    }),
  { name: 'Invoice' },
);
