import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

import Button from 'components/Button';
import CircularProgress from 'components/CircularProgress';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';

import AccountTitle from 'elements/AccountTitle';
import AccountSecondTitle from 'elements/AccountSecondTitle';
import AccountBackTitle from 'elements/AccountBackTitle';
import {
  postData,
  GET_INVOICES_BY_SEARCH_PATH,
  UPDATE_INVOICE_PATH,
  getAddressUrlByParams,
  INVOICE_SEVERITIES,
  datePrepare,
} from 'utils';
import EditInvoiceDialog from './EditInvoiceDialog';

type InvoiceData = {
  currency: string;
  hashList: string[] | null;
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
    expiration: number;
    extendedExpiration: number;
    invoiceId: string;
  };
  status: string;
};

type invoiceKey = {
  value: string;
  label: string;
};

const invoiceKeys: invoiceKey[] = [
  {
    value: 'invoiceId',
    label: 'Invoice',
  },
  {
    value: 'email',
    label: 'Email',
  },
  {
    value: 'currency',
    label: 'Currency',
  },
  {
    value: 'amount',
    label: 'Amount',
  },
  {
    value: 'amountUsd',
    label: 'Amount USD',
  },
  {
    value: 'customString',
    label: 'Custom string',
  },
  {
    value: 'status',
    label: 'Status',
  },
  {
    value: 'expiration',
    label: 'Expiration',
  },
  {
    value: 'extendedExpiration',
    label: 'Extended expiration',
  },
  {
    value: 'date',
    label: 'Date created',
  },
  {
    value: 'dateUpdated',
    label: 'Date updated',
  },
  {
    value: 'callbackNotify',
    label: 'Callback notify',
  },
  {
    value: 'callbackSuccess',
    label: 'Callback success',
  },
  {
    value: 'callbackFail',
    label: 'Callback fail',
  },
];

const Invoice = (): JSX.Element => {
  const styles = useStyles();
  const router = useRouter();

  let storeId = router.query.storeId as string;
  let storeName = router.query.storeName as string;
  let invoiceId = router.query.invoiceId as string;

  const [invoiceData, setInvoiceData] = useState<InvoiceData>({} as InvoiceData);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenEditInvoiceDialog, setIsOpenEditInvoiceDialog] = useState(false);
  const [amount, setAmount] = useState(0);
  const [amountUsd, setAmountUsd] = useState(0);
  const [currency, setCurrency] = useState('');

  const getInvoice = useCallback(async () => {
    setIsLoading(true);
    const token = localStorage.getItem('bitsidyAccessToken') || '';

    const response = await postData(GET_INVOICES_BY_SEARCH_PATH, {
      token,
      category: 'invoice',
      query: invoiceId,
      storeId,
    });

    const { data } = response;
    if (data !== 'not found' && data.length > 0) {
      const invoiceData = data[0] as InvoiceData;
      setAmount(invoiceData.invoice.amount);
      setAmountUsd(invoiceData.invoice.amountUsd);
      setCurrency(invoiceData.currency);
      setInvoiceData(invoiceData);
    } else {
      setInvoiceData({} as InvoiceData);
    }
    setIsLoading(false);
  }, [invoiceId]);

  useEffect(() => {
    getInvoice().catch((error: any) => console.log(error));
  }, [setInvoiceData, invoiceId]);

  const recheckInvoice = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('bitsidyAccessToken') || '';

    const response = await postData(UPDATE_INVOICE_PATH, {
      token,
      invoiceId,
      status: 'wait',
      dateUpdated: new Date().toISOString(),
      storeId,
    });

    if (response.result === 'success') {
      getInvoice().catch((error: any) => console.log(error));
    } else {
      setIsLoading(false);
    }
  };

  const getRowDataByValue = (row: invoiceKey) => {
    switch (row.value) {
      case 'currency':
        return invoiceData[row.value];
      case 'hashList':
        return invoiceData['hashList']?.map((hash, index) => {
          return <div key={index}>{hash}</div>;
        });
      case 'status':
        return (
          <div className={`${styles.status} ${styles[INVOICE_SEVERITIES[invoiceData[row.value]]]}`}>
            {invoiceData[row.value]}
          </div>
        );
      case 'expiration':
      case 'extendedExpiration':
      case 'date':
      case 'dateUpdated':
        const date = invoiceData['invoice'][row.value] as string;
        return datePrepare(date);
      default:
        return invoiceData['invoice'][row.value];
    }
  };

  return (
    <div className={styles.main}>
      <AccountTitle
        title="Merchant stores"
        breadcrumbs={'Store ' + storeId + ' / Invoice ' + invoiceId}
      />
      <div>
        <AccountBackTitle
          title={storeName}
          subTitle="Invoice details"
          pathname="store/invoices"
          query={{
            storeId,
            storeName,
          }}
          isLoading={isLoading}
        />
        <div style={{ display: 'flex', padding: 0, marginBottom: '20px' }}>
          {invoiceData.status !== 'success' && (
            <>
              {isLoading ? (
                <CircularProgress size={24} />
              ) : (
                <Button
                  variant="outlined"
                  className={styles.outlinedButton + ' ' + styles.recheckButton}
                  onClick={recheckInvoice}
                >
                  RECHECK
                </Button>
              )}
              {!isLoading && amount > 0 && (
                <Button
                  variant="outlined"
                  className={styles.outlinedButton}
                  onClick={() => setIsOpenEditInvoiceDialog(true)}
                >
                  EDIT
                </Button>
              )}
            </>
          )}
        </div>
        <div className={styles.invoiceColumns}>
          <div className={styles.invoiceColumn}>
            <AccountSecondTitle title="Common information" description="Invoice information" />
            {isLoading ? (
              <CircularProgress size={24} />
            ) : (
              Object.keys(invoiceData).length > 0 &&
              invoiceKeys.map((row) => {
                return (
                  <div key={row.value} className={styles.invoiceRow}>
                    <div className={styles.invoiceLabel}>{row.label}</div>
                    <div className={styles.invoiceValue}>{getRowDataByValue(row)}</div>
                  </div>
                );
              })
            )}
          </div>
          <div className={styles.invoiceColumn}>
            <AccountSecondTitle title="Address" description="" />
            {isLoading ? (
              <CircularProgress size={24} />
            ) : (
              Object.keys(invoiceData).length > 0 &&
              invoiceData['hashList']?.map((hash, index) => {
                return (
                  <div key={index}>
                    <Link
                      className={styles.link}
                      href={getAddressUrlByParams(invoiceData['currency'], hash)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      To explorer
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      <EditInvoiceDialog
        storeId={storeId}
        invoiceId={invoiceId}
        currency={currency}
        amount={amount}
        amountUsd={amountUsd}
        isOpenEditInvoiceDialog={isOpenEditInvoiceDialog}
        setIsOpenEditInvoiceDialog={setIsOpenEditInvoiceDialog}
        getInvoice={getInvoice}
      />
    </div>
  );
};

export default Invoice;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      main: {
        background: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        padding: '0 10px',
        [theme.breakpoints.up('lg')]: {
          width: '1200px',
          padding: '0 25px',
        },
        [theme.breakpoints.up('xl')]: {
          padding: '0 65px',
        },
        [theme.breakpoints.down('md')]: {
          boxSizing: 'border-box',
        },
      },
      invoiceColumns: {
        display: 'flex',
        [theme.breakpoints.down('md')]: {
          flexDirection: 'column-reverse',
        },
      },
      invoiceColumn: {
        width: '50%',
        marginBottom: '40px',
      },
      invoiceRow: {
        marginBottom: '20px',
      },
      recheckButton: {
        marginRight: '20px',
      },
      invoiceLabel: {
        fontSize: '14px',
        color: theme.palette.text.secondary,
        marginBottom: '5px',
      },
      invoiceValue: {
        fontSize: '16px',
        color: theme.palette.text.primary,
      },
      link: {
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '16px',
        whiteSpace: 'nowrap',
        marginBottom: '10px',
        lineHeight: '140%',
        color: theme.palette.primary.main,
      },
      status: {
        fontFamily: 'Montserrat, sans-serif',
        borderRadius: '20px',
        padding: '8px 2px',
        width: '100px',
        textAlign: 'center',
        color: '#fff',
      },
      outlinedButton: {
        marginTop: '10px',
      },
      green: { background: theme.palette.custom.green },
      yellow: { background: theme.palette.custom.yellow },
      gray: { background: theme.palette.custom.gray },
      red: { background: theme.palette.custom.red },
    }),
  { name: 'InvoicePage' },
);
