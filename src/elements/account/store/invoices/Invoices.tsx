import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import CircularProgress from 'components/CircularProgress';

import { createStyles, makeStyles } from '@material-ui/core/styles';

import InvoiceSearch from './InvoiceSearch';
import InvoiceDataSearch from './InvoiceDataSearch';
import InvoicesTable from './InvoicesTable';
import {
  GET_INVOICES_BY_DATE_PATH,
  postData,
  sortFunction,
  GET_ALL_WALLET_STATUS_PATH,
  dateLocalForAPI,
} from 'utils';
import AccountTitle from 'elements/AccountTitle';
import AccountBackTitle from 'elements/AccountBackTitle';

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

type Wallet = {
  isActive: boolean;
  currency: {
    internalName: string;
    name: string;
    shortName: string;
  };
};

const Invoices = (): JSX.Element => {
  const styles = useStyles();
  const router = useRouter();

  let storeId = router.query.storeId as string;
  let storeName = router.query.storeName as string;

  const [invoiceData, setInvoiceData] = useState<InvoiceData[]>([]);
  const [isEmptySearchQuery, setIsEmptySearchQuery] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [currencies, setCurrencies] = useState<string[]>([]);

  const getInvoices = useCallback(async () => {
    setIsLoading(true);
    const token = localStorage.getItem('bitsidyAccessToken') || '';

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dayAfterEndDay = new Date();
    dayAfterEndDay.setDate(dayAfterEndDay.getDate() + 1);

    const response = await postData(GET_INVOICES_BY_DATE_PATH, {
      token,
      storeId,
      start: dateLocalForAPI(sevenDaysAgo),
      end: dateLocalForAPI(dayAfterEndDay),
    });

    if (response.data === 'not found') {
      response.data = [];
    }
    const data = response.data as InvoiceData[];
    setInvoiceData(data);

    setIsLoading(false);
  }, []);

  const getAllWalletStatus = useCallback(async () => {
    const token = localStorage.getItem('bitsidyAccessToken') || '';

    const response = await postData(GET_ALL_WALLET_STATUS_PATH, {
      token,
    });

    const wallets = response.data as Wallet[];
    const temp: string[] = ['All'];

    wallets.forEach((x) => {
      if (!temp.includes(x.currency.shortName)) {
        temp.push(x.currency.shortName);
      }
    });

    temp.sort((a, b) => sortFunction(a, b));
    setCurrencies(temp);
  }, []);

  useEffect(() => {
    if (isEmptySearchQuery) {
      getInvoices().catch((error) => console.log(error));
      getAllWalletStatus().catch((error) => console.log(error));
    }
  }, [isEmptySearchQuery]);

  return (
    <div className={styles.main}>
      <AccountTitle title="Merchant stores" breadcrumbs={'Store ' + storeId + ' / Invoices'} />
      <div className={styles.content}>
        <AccountBackTitle
          title={storeName}
          subTitle="Invoices"
          pathname="store"
          query=""
          isLoading={isLoading}
        />
        <div>
          <div className={styles.searchContainer}>
            <InvoiceSearch
              setInvoiceData={setInvoiceData}
              setIsEmptySearchQuery={setIsEmptySearchQuery}
              setIsLoading={setIsLoading}
              storeId={storeId}
            />
            <InvoiceDataSearch
              setInvoiceData={setInvoiceData}
              storeId={storeId}
              currencies={currencies}
            />
          </div>
        </div>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <CircularProgress size={48} />
          </div>
        ) : (
          <InvoicesTable invoiceData={invoiceData} storeId={storeId} storeName={storeName} />
        )}
      </div>
    </div>
  );
};

export default Invoices;

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
      content: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      },
      invoices: {
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: '40px',
      },
      searchContainer: {
        display: 'flex',
        marginBottom: '40px',
        [theme.breakpoints.down('md')]: {
          flexDirection: 'column',
        },
      },
      loadingContainer: {
        width: '100%',
        height: '150px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
    }),
  { name: 'Invoices' },
);
