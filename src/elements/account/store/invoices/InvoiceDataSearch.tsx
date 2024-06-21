import { useState, Dispatch, SetStateAction, useCallback, useEffect, ChangeEvent } from 'react';

import IconButton from 'components/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import DatePicker from 'components/DatePicker';
import CircularProgress from 'components/CircularProgress';

import { createStyles, makeStyles } from '@material-ui/core/styles';

import TextField from 'components/TextField';
import { postData, GET_INVOICES_BY_DATE_PATH, dateLocalForAPI } from 'utils';

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

type InvoiceSearchProps = {
  setInvoiceData: Dispatch<SetStateAction<InvoiceData[]>>;
  storeId: string;
  currencies: string[];
};

const InvoiceDateSearch: any = ({
  setInvoiceData,
  storeId,
  currencies,
}: InvoiceSearchProps): JSX.Element => {
  const styles = useStyles();

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [currency, setCurrency] = useState('All');

  useEffect(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    setStartDate(sevenDaysAgo);

    const dayAfterEndDay = new Date();
    dayAfterEndDay.setDate(dayAfterEndDay.getDate() + 1);
    setEndDate(dayAfterEndDay);

    setCurrency(currencies[0]);
  }, [currencies, storeId]);

  useEffect(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    setStartDate(sevenDaysAgo);

    const dayAfterEndDay = new Date();
    dayAfterEndDay.setDate(dayAfterEndDay.getDate() + 1);
    setEndDate(dayAfterEndDay);

    setCurrency(currencies[0]);
  }, []);

  const handleStartDateChange = (newValue: unknown) => {
    const value = newValue as string;
    const newDate = new Date(value.toString().slice(0, 16) + 'UTC');
    setStartDate(newDate);
  };

  const handleEndDateChange = (newValue: unknown) => {
    const value = newValue as string;
    const newDate = new Date(value.toString().slice(0, 16) + 'UTC');
    setEndDate(newDate);
  };

  const searchByDate = useCallback(async () => {
    const token = localStorage.getItem('bitsidyAccessToken') || '';
    let dayAfterEndDay = endDate;
    dayAfterEndDay.setDate(dayAfterEndDay.getDate() + 1);

    const response = await postData(GET_INVOICES_BY_DATE_PATH, {
      token,
      storeId,
      start: dateLocalForAPI(startDate),
      end: dateLocalForAPI(dayAfterEndDay),
    });

    const { data } = response;

    if (data !== 'not found') {
      const invoiceData = data as InvoiceData[];
      let invoiceDataFiltered = data;

      if (currency != 'All' && currency != '') {
        invoiceDataFiltered = invoiceData.filter((x) => x.currency === currency);
      }

      setInvoiceData(invoiceDataFiltered);
    } else {
      setInvoiceData([]);
    }
  }, [startDate, endDate, currency]);

  const handleSearch = () => {
    searchByDate();
  };

  const handleChangeCurrency = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCurrency(value);
  };

  return (
    <div className={styles.invoiceSearchContainer}>
      {currencies.length < 1 ? (
        <CircularProgress size={24} />
      ) : (
        <TextField
          label="Currency"
          className={styles.marginRight16}
          id="standard-select-currency-native"
          select
          value={currency}
          onChange={handleChangeCurrency}
          children={currencies?.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        />
      )}
      <DatePicker
        label="Date range"
        startDate={startDate}
        endDate={endDate}
        setStartDate={handleStartDateChange}
        setEndDate={handleEndDateChange}
      />
      <div>
        <IconButton onClick={handleSearch} className={styles.iconButton}>
          <SearchIcon className={styles.iconButton} />
        </IconButton>
      </div>
    </div>
  );
};

export default InvoiceDateSearch;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      invoiceSearchContainer: {
        display: 'flex',
        alignItems: 'center',
      },
      iconButton: {
        color: theme.palette.primary.main,
      },
      marginRight8: {
        marginRight: '8px',
      },
      marginRight16: {
        marginRight: '16px',
      },
    }),
  { name: 'InvoiceDataSearch' },
);
