import { useState, ChangeEvent } from 'react';
import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';

import CircularProgress from 'components/CircularProgress';
import TextField from 'components/TextField';
import IconButton from 'components/IconButton';

import { postData, ESTIMATE_FEE_PATH, getToken } from 'utils';
import { ErrorData } from './SendDialog';
import { SubUser } from 'utils/subUsers';

const SendDialogAmounts = ({
  amount,
  setAmount,
  usdForOneCrypto,
  convertUsdToCrypto,
  walletAddress,
  currencyName,
  currencyShort,
  fee,
  feeType,
  setIsLoading,
  errorData,
  setErrorData,
  subUser = null,
}: {
  amount: number | string;
  setAmount: (v: any) => void;
  usdForOneCrypto: number;
  convertUsdToCrypto: (v: any) => void;
  walletAddress: string;
  currencyName: string;
  currencyShort: string;
  fee: number | string;
  feeType: string;
  setIsLoading: (b: boolean) => void;
  errorData: ErrorData;
  setErrorData: (e: ErrorData) => void;
  subUser?: SubUser | null;
}) => {
  const styles = useStyles();
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.between('xs', 'md'));

  const [amountUsd, setAmountUsd] = useState<string | number>('');
  const [isUseAllLoading, setIsUseAllLoading] = useState(false);

  const convertCryptoToUsd = async (value: number, precision: number = 2) => {
    const amountLocal = Number((value * usdForOneCrypto).toFixed(precision));
    if (amountLocal === 0) {
      setAmountUsd(0);
    } else {
      let parts = amountLocal.toString().split('.');
      if (parts.length > 1 && parts[1].length > precision) {
        setAmountUsd(amountLocal?.toFixed(precision));
      } else {
        setAmountUsd(amountLocal);
      }
    }
  };

  const handleChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const firsDotIndex = value.indexOf('.');
    const lastDotIndex = value.indexOf('.', firsDotIndex);
    const lastCharacter = value[value.length - 1];
    const oneDotCondition = lastDotIndex === -1 && lastCharacter === '.';
    if (!Number.isNaN(Number(value)) || oneDotCondition) {
      setAmount(value);
      convertCryptoToUsd(Number(value));
    }
  };

  const handleChangeAmountUsd = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const firsDotIndex = value.indexOf('.');
    const lastDotIndex = value.indexOf('.', firsDotIndex);
    const lastCharacter = value[value.length - 1];
    const oneDotCondition = lastDotIndex === -1 && lastCharacter === '.';
    if (!Number.isNaN(Number(value)) || oneDotCondition) {
      setAmountUsd(value);
      convertUsdToCrypto(Number(value));
    }
  };

  const handleSetAllWalletAmount = async () => {
    const data: ErrorData = {} as ErrorData;
    data.errorText = 'Something went wrong';

    setIsLoading(true);
    setIsUseAllLoading(true);
    try {
      if (walletAddress === '') {
        data.errorText = 'Fill valid wallet address';
        setErrorData(data);
        return;
      }

      let token = '';
      if (subUser != null) {
        token = subUser.token;
      } else {
        token = await getToken();
      }

      let body: any = {
        token,
        currencyName: currencyName,
        amount: 999999999999,
        toAddress: walletAddress,
      };
      if (currencyName === 'USDT_trc20') {
        body['freeze'] = feeType === 'energy';
        body['burn'] = feeType === 'burn';
        body['borrowResources'] = feeType === 'borrow';
      } else {
        body['fee'] = fee;
      }

      const response = await postData(ESTIMATE_FEE_PATH, body);
      if (
        response.result === 'success' &&
        'maximumAllowedAmount' in response.data &&
        response.data.maximumAllowedAmount !== 0
      ) {
        setAmount(response.data.maximumAllowedAmount);
        convertCryptoToUsd(response.data.maximumAllowedAmount);
        data.errorText = '';
      } else if (response.result === 'error' && 'message' in response.data) {
        data.errorText = response.data.message;
      }
    } catch {
    } finally {
      setIsLoading(false);
      setIsUseAllLoading(false);
    }

    setErrorData(data);
  };

  return (
    <div className={styles.row}>
      <div className={styles.sideInfo + ' ' + styles.sideInfoLeft}></div>

      <div className={styles.amountInputs}>
        <TextField
          className={styles.amount}
          id="amount"
          label="Amount"
          value={amount}
          onChange={handleChangeAmount}
          error={errorData.amount === true}
          endAdornment={currencyShort}
        />
        <div className={styles.equalSign}>=</div>
        <TextField
          className={styles.usdAmount}
          id="amountUsd"
          label="Amount USD"
          value={amountUsd}
          onChange={handleChangeAmountUsd}
          error={errorData.amount === true}
          endAdornment="USD"
        />
      </div>

      <div className={styles.sideInfo}>
        {isUseAllLoading ? (
          <CircularProgress size={24} />
        ) : (
          <>
            {isPhone ? (
              <IconButton className={styles.icon} onClick={handleSetAllWalletAmount}>
                <AllInclusiveIcon fontSize="medium" />
              </IconButton>
            ) : (
              <div className={styles.useAllButton} onClick={handleSetAllWalletAmount}>
                USE MAX
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SendDialogAmounts;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      sideInfoLeft: {},
      sideInfo: {
        width: '100px',
        minWidth: '100px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        [theme.breakpoints.down('sm')]: {
          '&$sideInfoLeft': {
            display: 'none',
          },
          width: '24px',
          minWidth: '24px',
          maxWidth: '24px',
          marginLeft: '20px',
        },
      },
      amount: {
        width: '50%',
        marginRight: '10px !important',
        minWidth: '210px',
        [theme.breakpoints.down('sm')]: {
          width: '100%',
          minWidth: '100%',
          marginRight: '0px !important',
        },
      },
      usdAmount: {
        width: '50%',
        marginLeft: '10px !important',
        minWidth: '210px',
        [theme.breakpoints.down('sm')]: {
          width: '100%',
          minWidth: '100%',
          marginLeft: '0px !important',
        },
      },
      row: {
        display: 'flex',
        justifyContent: 'space-between',
      },
      equalSign: {
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.text.primary,
        [theme.breakpoints.down('sm')]: {
          width: '100%',
          marginTop: '5px',
          marginBottom: '5px',
          justifyContent: 'center',
        },
      },
      useAllButton: {
        fontWeight: 600,
        fontSize: '14px',
        color: theme.palette.primary.main,
        textDecoration: 'underline',
        cursor: 'pointer',
      },
      amountInputs: {
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
          flexDirection: 'column',
          width: '100%',
        },
      },
      icon: {
        color: theme.palette.custom.blue,
      },
    }),
  { name: 'SendDialogAmounts' },
);
