import { SetStateAction, Dispatch, useState, ChangeEvent, useCallback, useEffect } from 'react';

import Button from 'components/Button';
import CircularProgress from 'components/CircularProgress';
import Collapse from '@mui/material/Collapse';
import IconButton from 'components/IconButton';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import Tooltip from 'components/Tooltip';
import { MultiFactorAuth } from 'components/MultiFactorAuth';

import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import CustomDialog from 'elements/customComponents/CustomDialog';
import TextField from 'components/TextField';
import ButtonProgressWrapper from 'elements/ButtonProgressWrapper';
import CustomLinearProgress from 'elements/customComponents/CustomLinearProgress';
import {
  postData,
  SEND_INVOICE_PATH,
  ESTIMATE_FEE_PATH,
  SEND_INOVICE_PRESETS_PATH,
  CURRENCY_USD_TO_CRYPTO_CONVERT_PATH,
  CURRENCY_CRYPTO_TO_USD_CONVERT_PATH,
  getToken,
} from 'utils';

import { WalletRow } from '../../Home';
import CurrencyLogo from 'components/CurrencyLogo';
import AddressBookmarkDialog from '../AddressBookmarkDialog';
import SendDialogDetails from './SendDialogDetails';
import SendDialogUsdtSwitch from './SendDialogUsdtSwitch';
import SendDialogAmounts from './SendDialogAmounts';

type SendDialogProps = {
  openSendDialog: boolean;
  setOpenSendDialog: Dispatch<SetStateAction<boolean>>;
  getWalletsBalance: () => void;
  setIsPageReloaded: Dispatch<SetStateAction<boolean>>;
  currentWalletRow: WalletRow;
};

export type ErrorData = {
  amount: boolean;
  errorText: string;
};

const defaultPreset = {
  value: 'custom',
  label: 'Custom',
};

const feeSelectPresets: HTMLOptionElement[] = [];

const feePresetsLabels = {
  minimum: 'Slow transaction',
  average: 'Regular transaction',
  maximum: 'Fast transaction',
};

let waitCheckingStop = false;
let currentWallet = '';

const SendDialog = (props: SendDialogProps): JSX.Element => {
  const styles = useStyles();
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    openSendDialog,
    setOpenSendDialog,
    getWalletsBalance,
    setIsPageReloaded,
    currentWalletRow,
  } = props;

  const [walletAddress, setWalletAddress] = useState('');

  const [amount, setAmount] = useState<string | number>('');
  const [cryptoForOneUsd, setCryptoForOneUsd] = useState(0);
  const [usdForOneCrypto, setUsdForOneCrypto] = useState(0);
  const [fee, setFee] = useState<string | number>(1);

  const [isInitLoading, setIsInitLoading] = useState(true);
  const [isFeeCustom, setIsFeeCustom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendLocked, setIsSendLocked] = useState(true);

  const [errorData, setErrorData] = useState({} as ErrorData);

  const [feePreset, setFeePreset] = useState('');
  const [feeUnits, setFeeUnits] = useState('');
  const [feePresets, setFeePresets] = useState('');

  const [spendingAmount, setSpendingAmount] = useState(0);
  const [spendAmount, setSpendAmount] = useState(0);
  const [blockchainFee, setBlockchainFee] = useState(0);
  const [isFeeEstimateLoading, setIsFeeEstimateLoading] = useState(false);

  const [feeType, setFeeType] = useState('borrow');
  const [energyFee, setEnergyFee] = useState(0);
  const [burnFee, setBurnFee] = useState(0);
  const [borrowFee, setBorrowFee] = useState(0);
  const [bitsidyFee, setBitsidyFee] = useState(0);
  const [transactionsAmount, setTransactionsAmount] = useState<number | null>(null);
  const [change, setChange] = useState(0);

  const [preparedFactors, setPreparedFactors] = useState<{ [index: string]: string }>({});
  const [factorsCodes, setFactorsCodes] = useState<{ [index: string]: string }>({});
  const [isMultiFactorModalOpened, setIsMultiFactorModalOpened] = useState(false);
  const [multiFactorMessage, setMultiFactorMessage] = useState('');
  const [multiFactorNote, setMultiFactorNote] = useState('');
  const [continueActionCounter, setContinueActionCounter] = useState(0);

  const [isAddressBookmarksOpened, setIsAddressBookmarksOpened] = useState(false);
  const [userComment, setUserComment] = useState('');

  const handleClose = () => {
    waitCheckingStop = true;
    currentWallet = '';
    setOpenSendDialog(false);
  };

  const init = () => {
    setIsInitLoading(true);
    setIsFeeCustom(false);
    setIsLoading(false);
    setIsSendLocked(true);

    setErrorData({} as ErrorData);
    setWalletAddress('');
    setAmount('');
    setFee(1);
    setSpendingAmount(0);
    setSpendAmount(0);
    setBlockchainFee(0);

    setFeeType('borrow');
    setEnergyFee(0);
    setBurnFee(0);
    setBorrowFee(0);
    setBitsidyFee(0);
    setTransactionsAmount(null);
    setChange(0);

    setPreparedFactors({});
    setIsMultiFactorModalOpened(false);
    setMultiFactorMessage('');
    setMultiFactorNote('');

    setUserComment('');
  };

  const getFeePresets = useCallback(async () => {
    init();

    if (currentWalletRow.name === '') {
      setIsInitLoading(false);
      return;
    }

    let token = '';
    if (currentWalletRow.subUser != null) {
      token = currentWalletRow.subUser.token;
    } else {
      token = await getToken();
    }
    const currencyName = currentWalletRow.name;

    waitCheckingStop = false;
    let response;
    while (true) {
      response = await postData(SEND_INOVICE_PRESETS_PATH, {
        token,
        currencyName,
      });

      if (response.result === 'success' && response.data === 'wait') {
        await new Promise((r) => setTimeout(r, 3000));
        if (waitCheckingStop || currentWallet != currencyName) {
          return;
        }
        continue;
      }
      break;
    }

    if (response.result === 'success') {
      if (response.data === null && (currencyName === 'USDT_trc20' || currencyName === 'TRX')) {
        setFeeUnits('');
        setIsInitLoading(false);
        return;
      }

      if (response.data !== null && response.data.feeUnit !== null) {
        setFeeUnits(response.data.feeUnit);
      } else {
        setFeeUnits('');
      }
      while (feeSelectPresets.length > 0) {
        feeSelectPresets.pop();
      }

      let defaultFeeValue = 'custom';
      if (response.data !== null && response.data.feeSuggestion !== null) {
        setFeePresets(response.data.feeSuggestion);
        Object.keys(response.data.feeSuggestion)
          .reverse()
          .map((x) => {
            if (x in feePresetsLabels) {
              feeSelectPresets.unshift({
                value: x,
                label: feePresetsLabels[x],
              } as HTMLOptionElement);
            }
          });
        setIsFeeCustom(false);
        const average = feeSelectPresets.filter((row) => row.value == 'average');
        defaultFeeValue = feeSelectPresets[0].value;
        if (average.length === 1) {
          defaultFeeValue = average[0].value;
        }
        setFee(response.data.feeSuggestion[defaultFeeValue]);
      } else {
        setIsFeeCustom(true);
        setFee(1);
      }
      feeSelectPresets.push(defaultPreset as HTMLOptionElement);
      setFeePreset(defaultFeeValue);
    }

    setIsInitLoading(false);
  }, [currentWalletRow]);

  useEffect(() => {
    if (openSendDialog) {
      currentWallet = currentWalletRow.name;
      getFeePresets().catch((error) => console.log(error));
      getCryptoForOneUsd().catch((error) => console.log(error));
      getUsdForOneCrypto().catch((error) => console.log(error));
    }
  }, [openSendDialog]);

  useEffect(() => {
    setSpendingAmount(0);
    setSpendAmount(0);
    setBlockchainFee(0);
  }, [currentWalletRow, walletAddress, amount, fee]);

  const estimateFee = async () => {
    let token = '';
    if (currentWalletRow.subUser != null) {
      token = currentWalletRow.subUser.token;
    } else {
      token = await getToken();
    }

    if (amount === 0 || amount === '' || currentWalletRow.name === '' || walletAddress === '') {
      const data: ErrorData = {} as ErrorData;
      data.errorText = 'Fill all fields';

      setErrorData(data);
      return;
    }

    if (isLoading) {
      return;
    }
    setIsLoading(true);
    setErrorData({} as ErrorData);
    setSpendingAmount(0);
    setSpendAmount(0);
    setBlockchainFee(0);
    setIsSendLocked(true);
    setIsFeeEstimateLoading(true);
    setPreparedFactors({});
    setFactorsCodes({});
    setIsMultiFactorModalOpened(false);
    setMultiFactorMessage('');
    setMultiFactorNote('');
    setTransactionsAmount(0);
    setChange(0);

    try {
      let body: any = {
        token,
        currencyName: currentWalletRow.name,
        amount,
        toAddress: walletAddress,
      };
      if (currentWalletRow.name === 'USDT_trc20') {
        body['freeze'] = feeType === 'energy';
        body['burn'] = feeType === 'burn';
        body['borrowResources'] = feeType === 'borrow';
      } else {
        body['fee'] = fee;
      }

      const response = await postData(ESTIMATE_FEE_PATH, body);
      if (response.result === 'success') {
        if ('maximumAllowedAmount' in response.data && response.data.maximumAllowedAmount !== 0) {
          const data: ErrorData = {} as ErrorData;
          data.amount = true;

          if ('message' in response.data) {
            data.errorText = response.data.message;
          } else {
            data.errorText = `Not enough funds. Maximum allowed ${response.data.maximumAllowedAmount} ${currentWalletRow.shortName}`;
          }
          setErrorData(data);
        } else {
          if ('transactionsAmount' in response.data) {
            setTransactionsAmount(response.data.transactionsAmount);
          } else {
            setTransactionsAmount(null);
          }

          let bitsidyFee = 0;
          if ('bitsidyFee' in response.data) {
            setBitsidyFee(Number(response.data.bitsidyFee));
            bitsidyFee = response.data.bitsidyFee;
          } else {
            setBitsidyFee(0);
          }

          if (currentWalletRow.name === 'USDT_trc20') {
            setSpendingAmount(Number(amount));
            setEnergyFee(Number(response.data.energyFee));
            setBurnFee(Number(response.data.bandwidthFee));
            setBorrowFee(Number(response.data.borrowedResourcesFee));
            if (feeType === 'borrow') {
              let amountToSpend = 0;
              amountToSpend += Number(amount) || 0;
              amountToSpend += Number(response.data.borrowedResourcesFee) || 0;
              amountToSpend += Number(bitsidyFee) || 0;
              setSpendAmount(parseFloat(amountToSpend?.toFixed(8)));
            } else {
              setSpendAmount(0);
            }
          } else if (currentWalletRow.name === 'TRX') {
            setSpendingAmount(Number(amount));
            setBurnFee(Number(response.data.fee));
            let amountToSpend = 0;
            amountToSpend += Number(amount) || 0;
            amountToSpend += Number(response.data.fee) || 0;
            amountToSpend += Number(bitsidyFee) || 0;
            setSpendAmount(parseFloat(amountToSpend?.toFixed(8)));
          } else {
            let bitsidyFee = 0;
            if ('bitsidyFee' in response.data) {
              bitsidyFee = response.data.bitsidyFee;
            }
            if ('change' in response.data) {
              setChange(response.data.change);
            }
            setSpendingAmount(Number(amount));
            let amountToSpend = 0;
            amountToSpend += Number(amount) || 0;
            amountToSpend += Number(response.data.fee) || 0;
            amountToSpend += Number(bitsidyFee) || 0;
            setSpendAmount(parseFloat(amountToSpend?.toFixed(8)));
            setBlockchainFee(Number(response.data.fee));
          }
        }
      } else {
        const error = response.data;
        const data: ErrorData = {} as ErrorData;

        if (error.message) {
          data.errorText = error.message;
        } else {
          data.errorText = 'Unknown error';
        }

        switch (error.argument) {
          case 'amount':
            data.amount = true;
            break;
        }

        setErrorData(data);
      }
    } finally {
      setIsLoading(false);
      setIsSendLocked(false);
      setIsFeeEstimateLoading(false);
    }
  };

  const getCryptoForOneUsd = async () => {
    let token = '';
    if (currentWalletRow.subUser != null) {
      token = currentWalletRow.subUser.token;
    } else {
      token = await getToken();
    }

    const response = await postData(CURRENCY_USD_TO_CRYPTO_CONVERT_PATH, {
      token,
      amount: 1,
      currencyName: currentWalletRow.shortName,
    });

    if (response.result === 'success') {
      setCryptoForOneUsd(response.data);
    }
  };

  const getUsdForOneCrypto = async () => {
    let token = '';
    if (currentWalletRow.subUser != null) {
      token = currentWalletRow.subUser.token;
    } else {
      token = await getToken();
    }

    const response = await postData(CURRENCY_CRYPTO_TO_USD_CONVERT_PATH, {
      token,
      amount: 1,
      currencyName: currentWalletRow.shortName,
    });

    if (response.result === 'success') {
      setUsdForOneCrypto(response.data);
    }
  };

  const convertUsdToCrypto = async (value: number) => {
    const amount = value * cryptoForOneUsd;
    if (amount === 0) {
      setAmount(0);
    } else {
      let parts = amount.toString().split('.');
      if (parts.length > 1 && parts[1].length > 9) {
        setAmount(amount?.toFixed(8));
      } else {
        setAmount(amount);
      }
    }
  };

  const handleChangeToAddress = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/(\r\n|\n|\r| )/gm, '');
    if (walletAddress === value) {
      return;
    }
    setWalletAddress(value);
  };

  const handleChangeFee = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const firsDotIndex = value.indexOf('.');
    const lastDotIndex = value.indexOf('.', firsDotIndex);
    const lastCharacter = value[value.length - 1];
    const oneDotCondition = lastDotIndex === -1 && lastCharacter === '.';
    if (!Number.isNaN(Number(value)) || oneDotCondition) {
      setFee(value);
    }
  };

  useEffect(() => {
    if (continueActionCounter == 0) {
      return;
    }
    handleSend();
  }, [continueActionCounter]);

  const sendInvoice = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      let token = '';
      if (currentWalletRow.subUser != null) {
        token = currentWalletRow.subUser.token;
      } else {
        token = await getToken();
      }

      let body = {
        token,
        currencyInternalName: currentWalletRow.name,
        currencyName: currentWalletRow.name,
        amount,
        toAddress: walletAddress,
      };
      if (currentWalletRow.name === 'USDT_trc20') {
        body['freeze'] = feeType === 'energy';
        body['burn'] = feeType === 'burn';
        body['borrowResources'] = feeType === 'borrow';
      } else if (currentWalletRow.name !== 'TRX') {
        body['fee'] = fee;
      }
      if (Object.keys(factorsCodes).length != 0) {
        body['factors'] = factorsCodes;
      }
      if (userComment != '') {
        body['userComment'] = userComment.substring(0, 500);
      }

      let response = await postData(SEND_INVOICE_PATH, body);

      if (response.result === 'success') {
        if ('isFactorsSent' in response.data) {
          if (response.data.isFactorsSent == false || response.data.additionalInformation == null) {
            const data: ErrorData = {} as ErrorData;
            data.errorText = response.data.message;
            setErrorData(data);
            setPreparedFactors({});
            setFactorsCodes({});
            setIsMultiFactorModalOpened(false);
            setMultiFactorMessage('');
            setMultiFactorNote('');
            return;
          }
          let note = 'Sending ' + amount + ' ' + currentWalletRow.name + ' to ' + walletAddress;
          let factors = response.data.requiredFactors;
          let preparedFactors = {};
          let additionalInfo = response.data.additionalInformation;
          for (let i = 0; i < factors.length; ++i) {
            preparedFactors[factors[i]] = additionalInfo[factors[i]] ?? '';
          }

          setPreparedFactors(preparedFactors);
          setMultiFactorMessage(response.data.message);
          setMultiFactorNote(note);
          setFactorsCodes({});
          setIsMultiFactorModalOpened(true);
          return;
        }

        setOpenSendDialog(false);
        getWalletsBalance();
        setIsPageReloaded(false);
        setIsPageReloaded(true);
      } else {
        const error = response.data;
        const data: ErrorData = {} as ErrorData;
        data.errorText = error.message;

        switch (error.argument) {
          case 'amount':
            data.amount = true;
            break;
        }

        setErrorData(data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (currentWalletRow.name && walletAddress && amount && fee && !isLoading && !isSendLocked) {
      sendInvoice().catch((error) => console.log(error));
    }
  };

  const handleFeeValueToNumber = () => setFee(Number(fee));

  const handleChangeUserComment = (event: React.ChangeEvent<HTMLInputElement>) =>
    setUserComment(event.target.value);

  const feePresetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFeePreset(event.target.value);
    if (event.target.value === 'custom') {
      setIsFeeCustom(true);
    } else {
      setIsFeeCustom(false);
      setFee(feePresets[event.target.value]);
    }
  };

  const changeType = (type: string) => {
    if (currentWalletRow.totalEnergyAmount === 0 && type === 'energy') {
      return;
    }
    setFeeType(type);
    setSpendingAmount(0);
    setEnergyFee(0);
    setBurnFee(0);
    setBorrowFee(0);
    setBitsidyFee(0);
    setTransactionsAmount(null);
    setSpendAmount(0);
    setBlockchainFee(0);
  };

  return (
    <CustomDialog
      scroll="body"
      className={styles.dialog + ' ' + (isLoading ? styles.locked : '')}
      open={openSendDialog}
    >
      <div className={styles.title}>Send {currentWalletRow.shortName}</div>

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

      {['BTC', 'LTC', 'DOGE', 'DASH', 'USDT.TRC20', 'TRX', 'ETH'].includes(
        currentWalletRow.shortName,
      ) === true ? (
        <>
          <Collapse in={isInitLoading}>
            <div className={styles.loadingContainer}>
              <CircularProgress size={48} />
            </div>
          </Collapse>
          <Collapse in={!isInitLoading}>
            <div className={styles.content} style={{ paddingTop: 0, paddingBottom: 0 }}>
              <div className={styles.row}>
                <div className={styles.sideInfo + ' ' + styles.sideInfoLeft}></div>
                <TextField
                  id="Wallet"
                  label="Wallet"
                  className={styles.walletInput}
                  fullwidth={true}
                  value={walletAddress}
                  multiline
                  rows={isPhone ? 2 : 1}
                  onChange={handleChangeToAddress}
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                    }
                  }}
                />
                <div className={styles.sideInfo}>
                  <Tooltip text="Select saved wallet" placement="left">
                    <IconButton
                      className={styles.bookmarksIcon}
                      onClick={() => setIsAddressBookmarksOpened(true)}
                    >
                      <BookmarksIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
              <div>
                <SendDialogAmounts
                  amount={amount}
                  setAmount={(v) => setAmount(v)}
                  usdForOneCrypto={usdForOneCrypto}
                  convertUsdToCrypto={convertUsdToCrypto}
                  walletAddress={walletAddress}
                  currencyName={currentWalletRow.name}
                  currencyShort={currentWalletRow.shortName}
                  fee={fee}
                  feeType={feeType}
                  setIsLoading={(b) => setIsLoading(b)}
                  errorData={errorData}
                  setErrorData={(e) => setErrorData(e)}
                  subUser={currentWalletRow.subUser}
                />
              </div>
              <div className={styles.row}>
                <div className={styles.sideInfo + ' ' + styles.sideInfoLeft}></div>

                <TextField
                  id="Comment"
                  label="Comment"
                  className={styles.walletInput}
                  fullwidth={true}
                  value={userComment}
                  onChange={handleChangeUserComment}
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                    }
                  }}
                />
                <div className={styles.sideInfo}>
                  <Tooltip
                    text="You will see this comment in the transaction history"
                    placement="left"
                  >
                    <IconButton>
                      <LiveHelpIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
              {currentWalletRow.name === 'USDT_trc20' && (
                <SendDialogUsdtSwitch
                  feeType={feeType}
                  totalEnergyAmount={currentWalletRow.totalEnergyAmount ?? 0}
                  changeType={(v: string) => changeType(v)}
                />
              )}
              {currentWalletRow.name !== 'USDT_trc20' && currentWalletRow.name !== 'TRX' && (
                <div className={styles.row}>
                  <div className={styles.sideInfo + ' ' + styles.sideInfoLeft}></div>

                  <div className={styles.feePresetsRow}>
                    <TextField
                      className={styles.feePresets}
                      select={true}
                      id="fee-presets"
                      label="Fee presets"
                      value={feePreset}
                      fullwidth={true}
                      onChange={feePresetChange}
                    >
                      {feeSelectPresets.map((option: HTMLOptionElement) => (
                        <option
                          key={option.value}
                          value={option.value}
                          selected={feePreset == option.value ? true : false}
                        >
                          {option.label}
                        </option>
                      ))}
                    </TextField>
                    <TextField
                      className={styles.feePreset}
                      disabled={!isFeeCustom}
                      value={fee}
                      id="fee"
                      label="Fee"
                      fullwidth={true}
                      endAdornment={<div className={styles.feeUnits}>{feeUnits}</div>}
                      onChange={handleChangeFee}
                      onMouseLeave={handleFeeValueToNumber}
                    />
                  </div>
                  <div className={styles.sideInfo}>
                    <Tooltip
                      text="Custom fee preset is recommended for advanced users only. By choosing a custom fee, you risk overpaying or your transaction never being confirmed."
                      placement="left"
                    >
                      <IconButton>
                        <LiveHelpIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              )}
            </div>

            <Collapse in={isFeeEstimateLoading}>
              <div className={styles.loadingLinearContainer}>
                <CustomLinearProgress color="primary" />
              </div>
            </Collapse>

            <SendDialogDetails
              isVisible={!isFeeEstimateLoading && spendingAmount > 0}
              currencyName={currentWalletRow.name}
              currencyShort={currentWalletRow.shortName}
              spendAmount={spendAmount}
              spendingAmount={spendingAmount}
              fee={(() => {
                if (currentWalletRow.name === 'USDT_trc20') {
                  if (feeType === 'energy') {
                    return energyFee;
                  }
                  if (feeType === 'borrow') {
                    return borrowFee;
                  }
                  return burnFee;
                } else if (currentWalletRow.name === 'TRX') {
                  return burnFee;
                }
                return blockchainFee;
              })()}
              feeType={feeType}
              bitsidyFee={bitsidyFee}
              transactionsAmount={transactionsAmount}
              usdForOneCrypto={usdForOneCrypto}
              change={change}
            />

            <Collapse
              in={typeof errorData.errorText === 'string' && errorData.errorText.length > 0}
            >
              <div className={styles.errorTextMessage}>{errorData.errorText}</div>
            </Collapse>

            <div className={styles.actions}>
              <Button className={styles.closeButton} variant="outlined" onClick={handleClose}>
                CLOSE
              </Button>
              {spendingAmount === 0 ? (
                <div>
                  <ButtonProgressWrapper
                    clickHandler={estimateFee}
                    loading={isLoading}
                    buttonText="NEXT"
                  />
                </div>
              ) : (
                <div className={styles.sendButton}>
                  <ButtonProgressWrapper
                    clickHandler={handleSend}
                    loading={isLoading}
                    buttonText="SEND"
                    backgroundColor={theme.palette.custom.green + ' !important'}
                  />
                </div>
              )}
            </div>
            <MultiFactorAuth
              factors={preparedFactors}
              action="send"
              actionType="request"
              message={multiFactorMessage}
              isOpened={isMultiFactorModalOpened}
              handleClose={() => setIsMultiFactorModalOpened(false)}
              setFactorsCodes={(factors) => setFactorsCodes(factors)}
              continueAction={() => setContinueActionCounter(continueActionCounter + 1)}
              note={multiFactorNote}
              buttonText={'Confirm'}
            />
            <AddressBookmarkDialog
              isOpened={isAddressBookmarksOpened}
              handleClose={() => setIsAddressBookmarksOpened(false)}
              currencyName={currentWalletRow.shortName}
              setWallet={(wallet: string) => setWalletAddress(wallet)}
            />
          </Collapse>
        </>
      ) : (
        <>
          <div style={{ textAlign: 'center' }}>Coming soon</div>
          <div className={styles.actions}>
            <Button className={styles.closeButton} variant="outlined" onClick={handleClose}>
              CLOSE
            </Button>
          </div>
        </>
      )}
    </CustomDialog>
  );
};

export default SendDialog;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      feeUnits: {
        width: '75px',
      },
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
      bookmarksIcon: {
        color: theme.palette.custom.blue,
      },
      notEnough: {
        marginLeft: '4px',
        color: theme.palette.primary.main,
        textDecoration: 'underline',
        cursor: 'pointer',
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
          background: theme.palette.background.default,
          opacity: '1 !important',
        },
        '& .MuiPaper-root': {
          overflowX: 'hidden',
          width: '730px',
          maxWidth: '730px',
          minWidth: '630px',
          padding: '30px 30px 0px 30px',
          boxSizing: 'border-box',
          [theme.breakpoints.down('sm')]: {
            width: '100%',
            maxWidth: '100%',
            minWidth: '100%',
            padding: '20px 20px 0px 20px',
            margin: '0px !important',
          },
          background: theme.palette.background.default,
          color: theme.palette.background.default,
          boxShadow: 'none',
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
        width: 'auto !important',
        marginRight: '20px',
        fontFamily: 'Montserrat, sans-serif !important',
        background: 'none',
        borderColor: theme.palette.text.primary,
        color: theme.palette.text.primary,
        '&.MuiButtonBase-root:hover': {
          borderColor: theme.palette.text.primary,
        },
      },
      errorTextMessage: {
        marginBottom: '30px',
        fontWeight: 500,
        color: theme.palette.custom.red,
        textAlign: 'center',
      },
      sendButton: {},
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
        '& $closeButton': {
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
        justifyContent: 'center',
        fontSize: '16px',
        marginBottom: '30px',
        color: theme.palette.custom.blue,
      },
      walletInput: {
        lineHeight: 1.4,
      },
      feePresetsRow: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        [theme.breakpoints.down('sm')]: {
          flexDirection: 'column',
          width: '100%',
        },
      },
      feePresets: {
        marginRight: '20px !important',
        width: '50%',
        [theme.breakpoints.down('sm')]: {
          width: '100%',
          marginRight: '0px !important',
          marginBottom: '30px !important',
        },
      },
      feePreset: {
        width: '50%',
        [theme.breakpoints.down('sm')]: {
          width: '100%',
        },
      },
      loadingContainer: {
        width: '100%',
        height: '150px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      loadingLinearContainer: {
        width: '100%',
        position: 'absolute',
        marginLeft: '-20px',
        top: 0,
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
  { name: 'SendDialog' },
);
