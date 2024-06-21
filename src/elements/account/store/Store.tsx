import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';

import Button from 'components/Button';

import Slide, { SlideProps } from '@mui/material/Slide';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import StoreIcon from '@mui/icons-material/Store';
import CircularProgress from 'components/CircularProgress';
import { TransitionProps } from '@mui/material/transitions';

import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';

import AccountTitle from 'elements/AccountTitle';
import CustomSnackbar from 'elements/customComponents/CustomSnackbar';
import { postData, GET_STORES_PATH, CREATE_USER_STORE_PATH } from 'utils';
import ConstructionIcon from '@mui/icons-material/Construction';

type StoreData = {
  name: string;
  apiKey: string;
  callbackSuccess: string;
  callbackNotify: string;
  callbackFail: string;
  storeId: string;
  storeUrl: string;
  allowedUnderpaidPercent: number;
  logoUrl: string;
  invoiceExpiration: number;
  invoiceExtendedExpiration: number;
};

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

type StoreCardProps = {
  row: StoreData;
  index: number;
};

const StoreCard = (props: StoreCardProps): JSX.Element => {
  const theme = useTheme();
  const styles = useStyles();
  const router = useRouter();

  const { row, index } = props;

  const handleOpenSettings = () => {
    router.push(
      {
        pathname: 'store/settings',
        query: {
          storeId: row.storeId,
        },
      },
      undefined,
      { shallow: true },
    );
  };

  const handleOpenInvoices = () => {
    router.push(
      {
        pathname: 'store/invoices',
        query: {
          storeId: row.storeId,
          storeName: row.name,
        },
      },
      undefined,
      { shallow: true },
    );
  };

  const defaultIconsColor = theme.palette.type === 'light' ? '#A1A1A1' : '#fff';
  const iconContainer =
    theme.palette.type === 'light' ? styles.imgHighlightLight : styles.imgHighlightDark;

  return (
    <div key={index} className={styles.storeCard}>
      <div className={styles.imgContainer + ' ' + iconContainer}>
        {row.logoUrl == '' ? (
          <StoreIcon sx={{ fontSize: '64px', color: defaultIconsColor }} className={styles.img} />
        ) : (
          <img src={row.logoUrl} className={styles.img}></img>
        )}
      </div>
      <div className={styles.storeName}>{row.name ? row.name : '[New store]'}</div>
      <Button variant="contained" onClick={handleOpenInvoices}>
        INVOICES
      </Button>
      <Button className={styles.settingsButton} variant="outlined" onClick={handleOpenSettings}>
        SETTINGS
      </Button>
    </div>
  );
};

const Store = (): JSX.Element => {
  const styles = useStyles();
  const theme = useTheme();

  const [storesData, setStoresData] = useState([] as StoreData[]);
  const [isStoresLoading, setIsStoresLoading] = useState(true);
  const [isStoreCreating, setIsStoreCreating] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarState, setSnackbarState] = useState<{
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

  const loadUserStores = useCallback(async () => {
    setIsStoresLoading(true);
    const token = localStorage.getItem('bitsidyAccessToken') || '';

    const response = await postData(GET_STORES_PATH, {
      token,
    });

    if (response.result === 'success' && typeof response.data !== 'string') {
      const storesData = response.data as StoreData[];
      setStoresData(storesData);
    }
    setIsStoresLoading(false);
  }, []);

  useEffect(() => {
    loadUserStores();
  }, []);

  const handleOpenSnackbar = () => {
    setSnackbarState({
      ...snackbarState,
      open: true,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbarState({
      ...snackbarState,
      open: false,
    });
  };

  const createStore = useCallback(async () => {
    setIsStoreCreating(true);
    const token = localStorage.getItem('bitsidyAccessToken') || '';

    const response = await postData(CREATE_USER_STORE_PATH, {
      token,
    });

    if (response.result === 'success') {
      loadUserStores();
    } else {
      if ('message' in response.data) {
        setSnackbarMessage(response.data.message);
      } else {
        setSnackbarMessage('Unknown error');
      }
      handleOpenSnackbar();
    }

    setIsStoreCreating(false);
  }, [handleOpenSnackbar]);

  const handleCreateStore = () => {
    createStore().catch((error) => console.log(error));
  };

  const defaultIconsColor = theme.palette.type === 'light' ? '#A1A1A1' : '#fff';

  return (
    <div className={styles.main}>
      <AccountTitle title="Merchant stores" breadcrumbs="" />
      <div className={styles.integrationButtonContainer}>
        <a target="_blank" href="/guides/integration">
          <Button variant="outlined">
            <>
              <ConstructionIcon className={styles.integrationButtonIcon} />
              INTEGRATION GUIDE
            </>
          </Button>
        </a>
      </div>
      <div>
        <div className={styles.hint}>Setup your shop and start receiving crypto payments</div>
        {isStoresLoading ? (
          <div className={styles.storesLoadingContainer}>
            <CircularProgress size={48} />
          </div>
        ) : (
          <div className={styles.storeCards}>
            {storesData?.map((row, index) => (
              <StoreCard row={row} index={index} />
            ))}
            {isStoreCreating ? (
              <div className={styles.createStoreLoadingContainer}>
                <CircularProgress size={48} />
              </div>
            ) : (
              <Button onClick={handleCreateStore} variant="none">
                <div className={styles.storeCard}>
                  <div className={styles.imgContainer}>
                    <AddBoxOutlinedIcon
                      sx={{ fontSize: '64px', color: defaultIconsColor }}
                      className={styles.img}
                    />
                  </div>
                  <div className={styles.storeName} style={{ marginTop: '20px' }}>
                    ADD NEW SHOP
                  </div>
                </div>
              </Button>
            )}
          </div>
        )}
        <CustomSnackbar
          autoHideDuration={3000}
          open={snackbarState.open}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          TransitionComponent={snackbarState.Transition}
          message={snackbarMessage}
          onClose={handleCloseSnackbar}
          key={snackbarState.Transition.name}
        />
      </div>
    </div>
  );
};

export default Store;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      integrationButtonIcon: {
        marginRight: '10px',
        color: theme.palette.text.primary,
      },
      integrationButtonContainer: {
        display: 'flex',
        '& *': {
          textDecoration: 'none',
        },
      },
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
      settingsButton: {
        marginTop: '10px',
      },
      storeCards: {
        display: 'flex',
        flexWrap: 'wrap',
        [theme.breakpoints.down('md')]: {
          justifyContent: 'center',
        },
      },
      storeCard: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0px 20px 60px 20px !important',
        width: '200px',
        boxSizing: 'content-box',
      },
      storeName: {
        marginTop: '20px',
        color: theme.palette.text.primary,
        fontFamily: 'Montserrat, sans-serif',
        fontSize: '16px',
        fontWeight: 400,
        textTransform: 'none',
        lineHeight: '143%',
        textAlign: 'center',
        height: '45px',
        display: 'flex',
        alignItems: 'center',
      },
      hint: {
        margin: '40px 0',
        color: theme.palette.text.primary,
        lineHeight: 1.6,
      },
      createStoreLoadingContainer: {
        width: '176px',
        height: '200px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      storesLoadingContainer: {
        width: '100%',
        height: '200px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      imgContainer: {
        maxWidth: '200px',
        maxHeight: '64px',
        padding: '10px',
        borderRadius: '10px',
        justifyContent: 'center',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
      },
      imgHighlightLight: {
        boxShadow: 'inset 0px 1000px 0px rgba(0, 0, 0, 0.05)',
      },
      imgHighlightDark: {
        boxShadow: 'inset 0px 1000px 0px rgba(255, 255, 255, 0.05)',
      },
      img: {
        maxWidth: '200px',
        maxHeight: '64px',
      },
    }),
  { name: 'Store' },
);
