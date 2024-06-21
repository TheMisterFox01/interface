import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import Image from 'next/image';
import { useState, ChangeEvent, useEffect } from 'react';
import Button from 'components/Button';
import Collapse from '@mui/material/Collapse';

import CustomDialog from 'elements/customComponents/CustomDialog';
import TextField from 'components/TextField';
import ButtonProgressWrapper from 'elements/ButtonProgressWrapper';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import bandwidthIcon from 'public/bandwidth.svg';
import energyIcon from 'public/energy.svg';
import { WalletRow } from '../Home';
import {
  postData,
  ESTIMATE_FREEZE_PATH,
  ESTIMATE_UNFREEZE_PATH,
  CREATE_FREEZE_PATH,
  CREATE_UNFREEZE_PATH,
} from 'utils';
import CurrencyLogo from 'components/CurrencyLogo';

type ErrorData = {
  amount: boolean;
  errorText: string;
};

type FreezeDialogProps = {
  isOpenedFreezeDialog: boolean;
  closeFreezeDialog: () => void;
  currentWalletRow: WalletRow;
  isUnfreeze: boolean;
  reloadPage: () => void;
};

const FreezeDialog = (props: FreezeDialogProps) => {
  const styles = useStyles();
  const theme = useTheme();

  const [isSending, setIsSending] = useState(false);
  const [isEnergy, setIsEnergy] = useState(true);
  const [errorData, setErrorData] = useState({} as ErrorData);
  const [amount, setAmount] = useState('');
  const [trxFinalAmount, setTrxFinalAmount] = useState(0);
  const [resourceFinalAmount, setResourceFinalAmount] = useState(0);
  const [amountType, setAmountType] = useState('TRX');
  const [maximumAmount, setMaximumAmount] = useState(0);
  const [maximumAmountText, setMaximumAmountText] = useState('');

  const { isOpenedFreezeDialog, closeFreezeDialog, currentWalletRow, isUnfreeze, reloadPage } =
    props;

  useEffect(() => {
    setIsSending(false);
    setIsEnergy(true);
    setErrorData({} as ErrorData);
    setAmount('');
    setTrxFinalAmount(0);
    setResourceFinalAmount(0);
    setAmountType('TRX');
    setMaximumAmount(0);
    setMaximumAmountText('');
  }, [isOpenedFreezeDialog]);

  async function estimate() {
    if (isSending) {
      return;
    }

    setIsSending(true);
    setTrxFinalAmount(0);
    setMaximumAmount(0);
    setMaximumAmountText('');
    try {
      const token = localStorage.getItem('bitsidyAccessToken') || '';

      if (amount === '' || amount === '0') {
        const data: ErrorData = {} as ErrorData;
        data.errorText = 'Fill amount field';
        setErrorData(data);
        return;
      }
      setErrorData({} as ErrorData);

      let body: any = {
        token,
        resource: isEnergy ? 'ENERGY' : 'BANDWIDTH',
      };
      if (amountType === 'TRX') {
        body['amountTrx'] = amount;
      } else {
        body['amountResource'] = parseInt(amount)?.toFixed(0);
      }

      const response = await postData(
        isUnfreeze ? ESTIMATE_UNFREEZE_PATH : ESTIMATE_FREEZE_PATH,
        body,
      );
      if (response.result === 'success') {
        if (
          'maximumAllowedAmountTrx' in response.data &&
          response.data.maximumAllowedAmountTrx > 0
        ) {
          setMaximumAmount(response.data.maximumAllowedAmountTrx);
          setMaximumAmountText('TRX');
        } else if (
          'maximumAllowedAmountResource' in response.data &&
          response.data.maximumAllowedAmountResource > 0
        ) {
          setMaximumAmount(response.data.maximumAllowedAmountResource);
          setMaximumAmountText(isEnergy ? 'energy' : 'bandwidth');
        } else {
          setTrxFinalAmount(response.data.amountTrx);
          setResourceFinalAmount(response.data.amountResource);
        }
      } else {
        const error = response.data;
        const data: ErrorData = {} as ErrorData;

        if (error.message) {
          data.errorText = error.message;
        } else {
          data.errorText = 'Unknown error';
        }

        setErrorData(data);
      }
    } finally {
      setIsSending(false);
    }
  }

  function handleSetMaxAmount() {
    switch (maximumAmountText) {
      case 'TRX':
        setAmountType('TRX');
        setAmount(maximumAmount?.toFixed(6));
        break;
      case 'energy':
        setAmountType('ENERGY');
        setAmount(maximumAmount?.toFixed(0));
        break;
      case 'bandwidth':
        setAmountType('BANDWIDTH');
        setAmount(maximumAmount?.toFixed(0));
        break;
    }
    setMaximumAmount(0);
    setMaximumAmountText('');
  }

  async function send() {
    if (isSending) {
      return;
    }

    setIsSending(true);
    try {
      const token = localStorage.getItem('bitsidyAccessToken') || '';

      if (amount === '' || amount === '0') {
        const data: ErrorData = {} as ErrorData;
        data.errorText = 'Fill amount field';
        setErrorData(data);
        return;
      }
      setErrorData({} as ErrorData);

      let body: any = {
        token,
        resource: isEnergy ? 'ENERGY' : 'BANDWIDTH',
        amountTrx: trxFinalAmount,
      };

      const response = await postData(isUnfreeze ? CREATE_UNFREEZE_PATH : CREATE_FREEZE_PATH, body);

      if (response.result === 'success') {
        reloadPage();
        closeFreezeDialog();
      } else {
        const error = response.data;
        const data: ErrorData = {} as ErrorData;

        if (error.message) {
          data.errorText = error.message;
        } else {
          data.errorText = 'Unknown error';
        }

        setErrorData(data);
      }
    } finally {
      setIsSending(false);
    }
  }

  function changeResource(isEnergy: boolean) {
    setIsEnergy(isEnergy);
    setAmountType('TRX');
    setTrxFinalAmount(0);
    setResourceFinalAmount(0);
  }

  function handleChangeAmountType(event: ChangeEvent<HTMLInputElement>) {
    setTrxFinalAmount(0);
    setResourceFinalAmount(0);
    setAmountType(event.target.value);
    if (event.target.value !== 'TRX') {
      let value = parseInt(amount);
      setAmount(isNaN(value) ? '0' : value?.toFixed(0));
    }
  }

  return (
    <CustomDialog
      scroll="body"
      className={styles.dialog + ' ' + (isSending ? styles.locked : '')}
      open={isOpenedFreezeDialog}
      onClose={closeFreezeDialog}
    >
      <div className={styles.title}>{isUnfreeze ? 'Unfreeze' : 'Freeze'} TRX</div>

      <div className={styles.topContainer}>
        <div className={styles.topImage}>
          <CurrencyLogo size={48} currency={currentWalletRow.shortName} />
        </div>
        <div className={styles.topText}>
          <div className={styles.walletText}>
            <div className={styles.walletMainText}>
              {currentWalletRow.availableAmount} {currentWalletRow.shortName}
            </div>
            <div className={styles.walletSecondText}>
              ~{currentWalletRow.availableAmountUsd} USD
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }} className={styles.noteContainer}>
        <div className={styles.note}>
          <InfoOutlinedIcon className={styles.contrastColor} sx={{ mr: 2 }} />
          <div
            style={{ fontSize: '14px', lineHeight: 1.6, letterSpacing: '0.15px' }}
            className={styles.contrastColor}
          >
            {isUnfreeze
              ? "Please note that you cannot cancel an unfreeze request after it's broadcasted, and your funds will be available only after 14 days"
              : 'Please note that unfreeze will take 14 days'}
            , calculate it accordingly
          </div>
        </div>
      </div>

      <div className={styles.row}>
        <div
          className={styles.switch + ' ' + (isEnergy ? styles.switchActive : '')}
          onClick={() => changeResource(true)}
        >
          <div className={styles.switchRow}>
            <Image height={24} src={energyIcon} />
            <div className={styles.switchTitle}>Energy</div>
          </div>
          {isUnfreeze ? (
            <div className={styles.switchDesc}>
              {(currentWalletRow.totalEnergyAmount ?? 0) -
                (currentWalletRow.availableEnergyAmount ?? 0)}{' '}
              available to unfreeze
            </div>
          ) : (
            <div className={styles.switchDesc}>Freeze TRX to get energy</div>
          )}
        </div>
        <div
          className={styles.switch + ' ' + (isEnergy ? '' : styles.switchActive)}
          onClick={() => changeResource(false)}
        >
          <div className={styles.switchRow}>
            <Image height={24} src={bandwidthIcon} />
            <div className={styles.switchTitle}>Bandwidth</div>
          </div>
          {isUnfreeze ? (
            <div className={styles.switchDesc}>
              {(currentWalletRow.totalBandwidthAmount ?? 0) -
                (currentWalletRow.availableBandwidthAmount ?? 0)}{' '}
              available to unfreeze
            </div>
          ) : (
            <div className={styles.switchDesc}>Freeze TRX to get bandwidth</div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex' }}>
          <TextField
            className={styles.amount + ' ' + styles.amountInput}
            id="amount"
            label="Amount"
            fullwidth={true}
            value={amount}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              let value = event.target.value;
              if (amountType === 'TRX') {
                if (isNaN(parseFloat(value))) {
                  setAmount('');
                } else {
                  if (value.split('.').length > 2) {
                    value = value.split('.')[0] + '.' + value.split('.')[1];
                  }
                  setAmount(value);
                }
              } else {
                setAmount(parseInt(value)?.toFixed(0));
              }
              setTrxFinalAmount(0);
              setResourceFinalAmount(0);
            }}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
              }
            }}
          />
          <TextField
            label="Currency"
            className={styles.currencyInput}
            id="standard-select-currency-native"
            select={true}
            value={amountType}
            onChange={handleChangeAmountType}
            children={
              <>
                <option key="TRX" value="TRX">
                  TRX
                </option>
                {isEnergy ? (
                  <option key="ENERGY" value="ENERGY">
                    ENERGY
                  </option>
                ) : (
                  <option key="BANDWIDTH" value="BANDWIDTH">
                    BANDWIDTH
                  </option>
                )}
              </>
            }
          />
        </div>
        <Collapse in={maximumAmount > 0}>
          <div className={styles.amountHelperWarning}>
            <div className={styles.notEnough} onClick={handleSetMaxAmount}>
              Not enough funds. Use maximum {maximumAmount} {maximumAmountText}
            </div>
          </div>
        </Collapse>
      </div>

      {trxFinalAmount > 0 && (
        <div>
          <div className={styles.info}>
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>
                {isUnfreeze ? "You're receiving" : "You're sending"}
              </div>
              <div className={styles.infoValue}>{trxFinalAmount} TRX</div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>
                {isUnfreeze
                  ? isEnergy
                    ? 'Energy sending'
                    : 'Bandwidth sending'
                  : isEnergy
                  ? 'Energy receiving'
                  : 'Bandwidth receiving'}
              </div>
              <div className={styles.infoValue}>{resourceFinalAmount}</div>
            </div>
          </div>
        </div>
      )}

      {typeof errorData.errorText === 'string' && errorData.errorText.length > 0 && (
        <div className={styles.errorTextMessage}>{errorData.errorText}</div>
      )}

      <div className={styles.actions}>
        <Button className={styles.closeButton} variant="outlined" onClick={closeFreezeDialog}>
          CLOSE
        </Button>
        {trxFinalAmount == 0 ? (
          <div>
            <ButtonProgressWrapper clickHandler={estimate} loading={isSending} buttonText="NEXT" />
          </div>
        ) : (
          <div className={styles.sendButton}>
            <ButtonProgressWrapper
              clickHandler={send}
              loading={isSending}
              buttonText={isUnfreeze ? 'UNFREEZE' : 'FREEZE'}
              backgroundColor={theme.palette.custom.green + ' !important'}
            />
          </div>
        )}
      </div>
    </CustomDialog>
  );
};

export default FreezeDialog;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      notEnough: {
        marginLeft: '4px',
        color: theme.palette.primary.main,
        textDecoration: 'underline',
        cursor: 'pointer',
      },
      noteContainer: {
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
          display: 'block',
        },
      },
      note: {
        width: '100%',
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
          paddingBottom: '20px',
        },
      },
      contrastColor: {
        color: theme.palette.common.black,
      },
      switch: {
        padding: '10px',
        borderColor: '#C4C4C4',
        borderRadius: '4px',
        borderWidth: '1px',
        borderStyle: 'solid',
        width: '50%',
        cursor: 'pointer',
        marginBottom: '30px',
        '&:first-child': {
          marginRight: '10px',
        },
        '&:last-child': {
          marginLeft: '10px',
        },
      },
      switchActive: {
        borderColor: theme.palette.primary.main,
        borderWidth: '2px !important',
        padding: '9px',
      },
      switchRow: {
        display: 'flex',
        alignItems: 'center',
      },
      switchTitle: {
        color: theme.palette.text.primary,
        fontWeight: 500,
        fontSize: '16px',
        marginLeft: '10px',
      },
      switchDesc: {
        color: theme.palette.text.secondary,
        fontSize: '14px',
        marginTop: '5px',
      },
      title: {
        display: 'flex',
        justifyContent: 'space-evenly',
        color: theme.palette.text.primary,
        fontWeight: 400,
        fontSize: '24px',
        fontFamily: 'Montserrat, sans-serif !important',
        marginBottom: '30px',
      },
      sendButton: {},
      content: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        '& > *': {
          marginBottom: '30px !important',
        },
      },
      dialog: {
        backdropFilter: 'blur(3px)',
        '& .MuiBackdrop-root': {
          background: theme.palette.common.white,
          opacity: '0.5 !important',
        },
        '& .MuiPaper-root': {
          overflowX: 'hidden',
          width: '450px',
          padding: '30px 30px 0px 30px',
          boxSizing: 'border-box',
          [theme.breakpoints.down('sm')]: {
            width: '100%',
            padding: '20px 20px 0px 20px',
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
        justifyContent: 'center !important',
        paddingBottom: '40px',
      },
      button: {
        width: 'auto !important',
        background: theme.palette.success.main,
        color: theme.palette.common.white,
      },
      closeButton: {
        marginRight: '20px !important',
      },
      info: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '30px',
        '& > *:not(:last-child)': {
          marginBottom: '10px',
        },
      },
      infoRow: {
        width: '85%',
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
          width: '100%',
        },
      },
      infoLabel: {
        width: '60%',
        color: theme.palette.text.secondary,
        lineHeight: 1.6,
      },
      infoValue: {
        width: '40%',
        textAlign: 'right',
        color: theme.palette.text.primary,
        lineHeight: 1.6,
      },
      errorTextMessage: {
        marginBottom: '30px',
        fontWeight: 500,
        color: theme.palette.custom.red,
        textAlign: 'center',
      },
      locked: {
        '& fieldset': {
          pointerEvents: 'none',
        },
        '& input': {
          pointerEvents: 'none',
        },
        '& .MuiInputBase-root': {
          pointerEvents: 'none',
        },
        '& $sendButton': {
          pointerEvents: 'none',
        },
        '& $switch': {
          pointerEvents: 'none',
        },
      },
      row: {
        display: 'flex',
        justifyContent: 'space-between',
      },
      amountHelper: {
        display: 'flex',
        fontSize: '14px',
        marginTop: '5px',
        marginLeft: '12px',
        color: theme.palette.text.secondary,
      },
      amountHelperWarning: {
        display: 'flex',
        fontSize: '14px',
        marginTop: '5px',
        marginLeft: '12px',
        color: '#D32F2F',
      },
      amount: {
        width: '100%',
      },
      amountInput: {
        marginRight: '20px',
      },
      currencyInput: {
        minWidth: '145px',
      },
      topContainer: {
        display: 'flex',
        justifyContent: 'center',
        height: '48px',
        marginBottom: '30px',
      },
      topImage: {
        marginRight: '20px',
      },
      topText: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
      },
      walletText: {
        display: 'flex',
        flexDirection: 'column',
      },
      walletMainText: {
        color: theme.palette.text.primary,
        marginBottom: '4px',
      },
      walletSecondText: {
        color: theme.palette.text.secondary,
        fontSize: '14px',
      },
    }),
  { name: 'FreezeDialog' },
);
