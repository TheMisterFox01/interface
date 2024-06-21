import { useCallback, useState, useEffect } from 'react';

import CircularProgress from 'components/CircularProgress';
import Collapse from '@mui/material/Collapse';

import { createStyles, makeStyles } from '@material-ui/core/styles';

import LandingTitle from './LandingTitle';
import LandingSecondTitle from './LandingSecondTitle';

import { getData, CURRENCY_PRICE_PATH } from 'utils';

import CurrencyLogo from 'components/CurrencyLogo';

type Currency = {
  name: string;
  shortName: string;
  price: number;
};

const Assets = (): JSX.Element => {
  const styles = useStyles();
  const [currencies, setCurrencies] = useState([] as Currency[]);

  const getCurrencies = useCallback(async () => {
    const response = await getData(CURRENCY_PRICE_PATH);

    if (response.result === 'success') {
      setCurrencies(response.data.currencyPrices as Currency[]);
    }
  }, []);

  useEffect(() => {
    getCurrencies().catch((error) => console.log(error));
  }, []);

  return (
    <div className={styles.assets}>
      <LandingTitle text="Supported Cryptocurrencies" />
      <LandingSecondTitle text="Effortlessly manage wallets and receive payments in your preferred currencies" />

      {currencies.length === 0 && (
        <div className={styles.loadingContainer}>
          <CircularProgress size={48} />
        </div>
      )}

      <Collapse
        in={currencies.length > 0}
        timeout="auto"
        unmountOnExit
        sx={{ width: '100%', pr: 0 }}
      >
        <div className={styles.currencies}>
          {currencies?.map((row) => {
            return <Currency currency={row} key={row.shortName} />;
          })}
        </div>
      </Collapse>
    </div>
  );
};

type currencyProps = {
  currency: Currency;
};

const Currency = ({ currency }: currencyProps): JSX.Element => {
  const styles = useStyles();
  return (
    <div className={styles.currency}>
      <div className={styles.imageContainer}>
        <CurrencyLogo size={64} allWide={true} currency={currency.shortName} />
      </div>
      <div className={styles.currencyParams}>
        <div className={styles.currencyName}>{currency.name}</div>
        <div className={styles.currencyPrice}>${currency.price}</div>
      </div>
    </div>
  );
};

export default Assets;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      assets: {
        background: theme.palette.background.default,
        paddingBottom: '40px',
        [theme.breakpoints.down('md')]: {
          paddingBottom: '20px',
        },
      },
      imageContainer: {
        width: '100px',
        minWidth: '100px',
        maxWidth: '100px',
        height: '64px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        paddingRight: '10px',
      },
      currencies: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '1120px',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '30px',
        [theme.breakpoints.down('md')]: {
          width: '840px',
        },
        [theme.breakpoints.down('sm')]: {
          width: '280px',
          marginBottom: '40px',
        },
      },
      currency: {
        width: '250px',
        display: 'flex',
        marginBottom: '60px',
        marginLeft: '15px',
        marginRight: '15px',
        [theme.breakpoints.down('md')]: {
          marginRight: '15px',
        },
      },
      currencyParams: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
      },
      currencyName: {
        fontSize: '14px',
        color: theme.palette.text.secondary,
      },
      currencyPrice: {
        fontSize: '16px',
        color: theme.palette.text.primary,
      },
      loadingContainer: {
        width: '100%',
        height: '150px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
    }),
  { name: 'AssetsSection' },
);
