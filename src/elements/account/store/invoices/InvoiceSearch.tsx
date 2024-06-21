import { useState, ChangeEvent, Dispatch, SetStateAction, useCallback } from 'react';

import IconButton from 'components/IconButton';
import SearchIcon from '@mui/icons-material/Search';

import { createStyles, makeStyles } from '@material-ui/core/styles';

import TextField from 'components/TextField';
import { postData, GET_INVOICES_BY_SEARCH_PATH } from 'utils';

type SearchCategoryType = 'hash' | 'email' | 'invoice';

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
  setIsEmptySearchQuery: Dispatch<SetStateAction<boolean>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  storeId: string;
};

const currencies = [
  {
    value: 'email',
    label: 'Email',
  },
  {
    value: 'address',
    label: 'Wallet',
  },
  {
    value: 'invoice',
    label: 'InvoiceId',
  },
  {
    value: 'hash',
    label: 'Hash',
  },
];

const InvoiceSearch = ({
  setInvoiceData,
  setIsEmptySearchQuery,
  setIsLoading,
  storeId,
}: InvoiceSearchProps): JSX.Element => {
  const styles = useStyles();
  const [searchCategory, setSearchCategory] = useState<SearchCategoryType>('email');
  const [searchValue, setSearchValue] = useState('');

  const handleSearchValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;

    setSearchValue(event.target.value);
    setIsEmptySearchQuery(!value);
  };

  const handleCategoryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as SearchCategoryType;
    setSearchCategory(value);
  };

  const searchByCategory = useCallback(async () => {
    if (!!searchValue) {
      setIsLoading(true);
      const token = localStorage.getItem('bitsidyAccessToken') || '';

      const response = await postData(GET_INVOICES_BY_SEARCH_PATH, {
        token,
        storeId,
        category: searchCategory,
        query: searchValue,
      });

      const { data } = response;

      if (data !== 'not found') {
        const invoiceData = data as InvoiceData[];
        setInvoiceData(invoiceData);
      } else {
        setInvoiceData([]);
      }

      setIsLoading(false);
    }
  }, [searchValue, searchCategory]);

  const handleSearch = () => {
    searchByCategory();
  };

  return (
    <div className={styles.invoiceSearchContainer}>
      <TextField
        label="Search field"
        id="standard-select-currency-native"
        select
        className={styles.selectCategory}
        value={searchCategory}
        onChange={handleCategoryChange}
        children={currencies.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      />
      <TextField
        label="Search"
        value={searchValue}
        onChange={handleSearchValueChange}
        className={styles.search}
      />
      <div>
        <IconButton
          onClick={handleSearch}
          className={styles.iconButton}
        >
          <SearchIcon className={styles.iconButton} />
        </IconButton>
      </div>
    </div>
  );
};

export default InvoiceSearch;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      main: {
        background: theme.palette.primary.dark,
        display: 'flex',
        paddingLeft: '5px',
        [theme.breakpoints.up('md')]: {
          paddingLeft: '25px',
        },
        width: '100%',
      },
      invoiceSearchContainer: {
        display: 'flex',
        alignItems: 'center',
        marginRight: '50px',
        [theme.breakpoints.down('md')]: {
          marginRight: '0px',
          marginBottom: '40px',
        },
      },
      iconButton: {
        color: theme.palette.primary.main,
      },
      selectCategory: {
        marginRight: '16px',
        '& .MuiInput-root': {
          height: '100%',
        },
      },
      search: {
        marginRight: '8px'
      }
    }),
  { name: 'InvoiceSearch' },
);
