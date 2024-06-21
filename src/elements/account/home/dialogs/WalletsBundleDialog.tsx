import { useEffect, useState } from 'react';

import Button from 'components/Button';

import { createStyles, makeStyles } from '@material-ui/core/styles';

import {
  postData,
  SUBUSER_CREATE,
  SUBUSER_RENAME,
  getToken,
  GET_ALL_WALLET_STATUS_PATH,
  getCurrencyName,
} from 'utils';
import CustomDialog from 'elements/customComponents/CustomDialog';
import TextField from 'components/TextField';
import ButtonProgressWrapper from 'elements/ButtonProgressWrapper';
import { Collapse } from '@mui/material';
import { Currency, Wallet } from '../Home';
import CircularProgress from 'components/CircularProgress';
import { SubUser, getSubUsers } from 'utils/subUsers';

const WalletsBundleDialog = ({
  openDialog,
  closeDialog,
  subUser = null,
  reload,
}: {
  openDialog: boolean;
  closeDialog: () => void;
  subUser?: SubUser | null;
  reload: () => void;
}): JSX.Element => {
  const styles = useStyles();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitLoading, setIsInitLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState('');

  const init = async () => {
    setIsInitLoading(true);
    setName('');
    setSelectedCurrency('');
    try {
      if (subUser != null) {
        setName(subUser.username);
      } else {
        setName('');
        const token = await getToken();
        const response = await postData(GET_ALL_WALLET_STATUS_PATH, {
          token,
        });
        if (response.result == 'success') {
          const wallets = response.data as Wallet[];
          wallets.sort((a, b) => (a.currency.internalName < b.currency.internalName ? -1 : 1));
          setCurrencies(wallets.map((x) => x.currency));
          if (wallets.length > 0) {
            setSelectedCurrency(wallets[0].currency.internalName);
          }
        } else {
          setErrorMessage(response.data.message);
        }
      }
    } catch {
    } finally {
      setIsInitLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, [subUser]);

  const handleClick = async () => {
    if (name.length == 0) {
      setErrorMessage('Name too short');
    }
    setErrorMessage('');

    const token = localStorage.getItem('bitsidyAccessToken') || '';

    try {
      setIsLoading(true);

      if (subUser == null) {
        const response = await postData(SUBUSER_CREATE, {
          username: name,
          token,
          currencyInternalName: selectedCurrency,
        });
        if (response.result == 'success') {
          await getSubUsers(true);
          closeDialog();
          reload();
        } else {
          setErrorMessage(response.data.message);
        }
        return;
      }

      const response = await postData(SUBUSER_RENAME, {
        username: name,
        subUserId: subUser.subUserId,
        token,
      });
      if (response.result == 'success') {
        await getSubUsers(true);
        closeDialog();
        reload();
      } else {
        setErrorMessage(response.data.message);
      }
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const clearedValue = value.replace(/[^a-zA-Z1-9 ]/g, '');
    setName(clearedValue);
  };

  const handleClose = () => {
    closeDialog();
  };

  const currencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCurrency(event.target.value);
  };

  return (
    <CustomDialog scroll="body" className={styles.dialog} open={openDialog} onClose={handleClose}>
      <div className={styles.actions}>
        <Collapse in={isInitLoading}>
          <div className={styles.loadingContainer}>
            <CircularProgress size={48} />
          </div>
        </Collapse>
        <Collapse in={!isInitLoading}>
          <div className={`${styles.title} ${styles.row}`}>Wallets</div>
          <div className={`${styles.subTitle} ${styles.row}`}>
            {subUser == null ? 'Create additional wallet' : 'Rename additional wallet'}
          </div>
          {currencies.length > 0 && subUser == null && (
            <TextField
              className={styles.row}
              select={true}
              id="currency"
              label="Currency"
              value={selectedCurrency}
              fullwidth={true}
              onChange={currencyChange}
            >
              {currencies.map((currency) => (
                <option
                  key={currency.internalName}
                  value={currency.internalName}
                  selected={selectedCurrency == currency.internalName ? true : false}
                >
                  {getCurrencyName(currency.internalName, 'displayName')}
                </option>
              ))}
            </TextField>
          )}
          <TextField
            value={name}
            onChange={handleChangeName}
            label="Wallets collection name"
            className={styles.row}
          />
          <Collapse in={typeof errorMessage === 'string' && errorMessage.length > 0}>
            <div className={`${styles.errorTextMessage} ${styles.row}`}>{errorMessage}</div>
          </Collapse>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
            <Button onClick={handleClose} variant="outlined" className={styles.closeButton}>
              CLOSE
            </Button>
            <ButtonProgressWrapper
              clickHandler={handleClick}
              loading={isLoading}
              buttonText="NEXT"
            />
          </div>
        </Collapse>
      </div>
    </CustomDialog>
  );
};

export default WalletsBundleDialog;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      loadingContainer: {
        width: '100%',
        height: '150px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      title: {
        display: 'flex',
        justifyContent: 'space-evenly',
        color: theme.palette.text.primary,
        fontWeight: 400,
        fontSize: '24px',
        fontFamily: 'Montserrat, sans-serif !important',
      },
      subTitle: {
        textAlign: 'center',
      },
      dialog: {
        backdropFilter: 'blur(3px)',
        '& .MuiBackdrop-root': {
          background: theme.palette.common.white,
          opacity: '0.5 !important',
        },
        '& .MuiPaper-root': {
          width: '400px',
          padding: '30px 30px 0px 30px',
          [theme.breakpoints.down('sm')]: {
            width: '100%',
            padding: '20px 20px 30px 20px',
            margin: '0px !important',
          },
          background: theme.palette.background.default,
          color: theme.palette.common.black,
          boxShadow: '0px 9px 46px 8px rgba(0, 0, 0, 0.10), 0px 11px 15px -7px rgba(0, 0, 0, 0.20)',
          '&.MuiDialog-paper': {
            borderRadius: '4px',
          },
        },
      },
      actions: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly !important',
        padding: '0 20px',
        [theme.breakpoints.down('md')]: {
          padding: '0px',
        },
      },
      row: {
        marginBottom: '30px',
      },
      closeButton: {
        marginRight: '20px',
      },
      errorTextMessage: {
        marginBottom: '30px',
        fontWeight: 500,
        color: theme.palette.custom.red,
        textAlign: 'center',
      },
    }),
  { name: 'ReceiveDialog' },
);
