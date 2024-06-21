import { useState, useEffect, ChangeEvent } from 'react';

import IconButton from 'components/IconButton';
import SearchIcon from '@mui/icons-material/Search';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import TextField from 'components/TextField';
import DatePicker from 'components/DatePicker';
import { CURRENCIES, getCurrencyName } from 'utils';

type TransactionsHistoryTableFiltersProps = {
  wallets: Wallet[];
  startDate: Date;
  endDate: Date;
  currency: string;
  direction: string;
  context: string;
  startAmount: string;
  endAmount: string;
  setStartDate: (value: Date) => void;
  setEndDate: (value: Date) => void;
  setCurrency: (value: string) => void;
  setDirection: (value: string) => void;
  setContext: (value: string) => void;
  setStartAmount: (value: string) => void;
  setEndAmount: (value: string) => void;
  getTransactions: (dtStart: Date, dtEnd: Date) => void;
  specialCurrency: string | null;
};

type Wallet = {
  isActive: boolean;
  currency: {
    internalName: string;
    name: string;
    shortName: string;
  };
};

const TransactionsHistoryTableFilters: any = ({
  wallets,
  startDate,
  endDate,
  currency,
  direction,
  context,
  startAmount,
  endAmount,
  setStartDate,
  setEndDate,
  setCurrency,
  setDirection,
  setContext,
  setStartAmount,
  setEndAmount,
  getTransactions,
  specialCurrency,
}: TransactionsHistoryTableFiltersProps): JSX.Element => {
  const styles = useStyles();

  const [currencies, setCurrencies] = useState<string[]>([]);

  const directions = ['All', 'Send', 'Receive'];

  const contexts = ['All', 'Personal', 'Store', 'Fee', 'Unknown'];

  useEffect(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate());
    setStartDate(weekAgo);

    const dayAfterToday = new Date();
    dayAfterToday.setDate(dayAfterToday.getDate() + 1);
    setEndDate(dayAfterToday);
  }, []);

  useEffect(() => {
    const temp: string[] = [];
    temp.push('All');
    CURRENCIES.forEach((x) => temp.push(x.internalName));
    setCurrencies(temp);
  }, [wallets]);

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

  const handleSearch = () => {
    getTransactions(startDate, endDate);
  };

  const handleChangeCurrency = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCurrency(value);
  };

  const handleChangeDirection = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setDirection(value);
  };

  const handleChangeContext = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setContext(value);
  };

  const handleChangeStartAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const cleared = value.replace(/[^\d|\.]/g, '');
    const splitted = cleared.split('.');
    if (splitted.length == 1) {
      setStartAmount(splitted[0]);
    } else {
      setStartAmount(splitted[0] + '.' + splitted[1]);
    }
  };

  const handleChangeEndAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const cleared = value.replace(/[^\d|\.]/g, '');
    const splitted = cleared.split('.');
    if (splitted.length == 1) {
      setEndAmount(splitted[0]);
    } else {
      setEndAmount(splitted[0] + '.' + splitted[1]);
    }
  };

  return (
    <div className={styles.searchContainer}>
      {specialCurrency == null && (
        <TextField
          className={styles.searchElement + ' ' + styles.marginRight16}
          label="Currency"
          select
          value={currency}
          onChange={handleChangeCurrency}
          children={currencies?.map((row) => (
            <option key={row} value={row}>
              {getCurrencyName(row, 'displayName')}
            </option>
          ))}
        />
      )}
      <TextField
        className={styles.searchElement + ' ' + styles.marginRight16}
        label="Direction"
        select
        value={direction}
        onChange={handleChangeDirection}
        children={directions?.map((row) => (
          <option key={row} value={row}>
            {row}
          </option>
        ))}
      />
      <TextField
        className={styles.searchElement + ' ' + styles.marginRight16}
        label="Wallet"
        select
        value={context}
        onChange={handleChangeContext}
        children={contexts?.map((row) => (
          <option key={row} value={row}>
            {row}
          </option>
        ))}
      />
      <TextField
        className={styles.searchElement + ' ' + styles.amountFilter + ' ' + styles.marginRight16}
        label="Amount from"
        value={startAmount == null ? '' : startAmount}
        onChange={handleChangeStartAmount}
      />
      <TextField
        className={styles.searchElement + ' ' + styles.amountFilter + ' ' + styles.marginRight16}
        label="Amount to"
        value={endAmount == null ? '' : endAmount}
        onChange={handleChangeEndAmount}
      />
      <DatePicker
        label="Date range"
        className={styles.searchElement}
        startDate={startDate}
        endDate={endDate}
        setStartDate={handleStartDateChange}
        setEndDate={handleEndDateChange}
      />
      <div>
        <IconButton
          onClick={handleSearch}
          className={styles.iconButton + ' ' + styles.searchElement}
        >
          <SearchIcon className={styles.iconButton} />
        </IconButton>
      </div>
    </div>
  );
};

export default TransactionsHistoryTableFilters;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      searchContainer: {
        display: 'flex',
        alignItems: 'center',
        [theme.breakpoints.down('sm')]: {
          display: 'block',
        },
      },
      searchElement: {
        marginBottom: '30px !important',
      },
      amountFilter: {
        width: '150px',
        [theme.breakpoints.down('sm')]: {
          width: 'inherit',
        },
      },
      marginRight16: {
        marginRight: '16px',
      },
      iconButton: {
        color: theme.palette.primary.main,
      },
    }),
  { name: 'TransactionsHistoryTableFilters' },
);
