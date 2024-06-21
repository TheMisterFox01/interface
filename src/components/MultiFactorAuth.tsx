import React from 'react';
import { useState, useEffect, ChangeEvent } from 'react';
import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import QRCode from 'react-qr-code';

import ButtonProgressWrapper from '../elements/ButtonProgressWrapper';
import CustomDialog from '../elements/customComponents/CustomDialog';
import Button from './Button';
import TextField from './TextField';

export const MultiFactorAuth = ({
  factors,
  action,
  actionType,
  message,
  isOpened,
  handleClose,
  setFactorsCodes,
  continueAction,
  note = '',
  buttonText = '',
}: {
  factors: { [index: string]: string };
  action: string;
  actionType: string;
  message: string;
  isOpened: boolean;
  handleClose: () => void;
  setFactorsCodes: (factors: { [index: string]: string }) => void;
  continueAction: () => void;
  note: string;
  buttonText?: string;
}) => {
  const styles = useStyles();
  const theme = useTheme();
  const isLightTheme = theme.palette.type === 'light';
  const fgColor = isLightTheme ? '#212121' : '#ffffff';
  const bgColor = isLightTheme ? '#ffffff' : '#0D0F10';

  const [subTitle, setSubTitle] = useState('');
  const [requirements, setRequirements] = useState(<div></div>);
  const [actionButtonText, setActionButtonText] = useState('next');
  const [isProcessing, setIsProcessing] = useState(false);

  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showTelegramInput, setShowTelegramInput] = useState(false);
  const [showTelegramCode, setShowTelegramCode] = useState(false);

  const [QRCodeValue, setQRCodeValue] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [OTPCode, setOTPCode] = useState('');
  const [OTPCodeId, setOTPCodeId] = useState('');
  const [telegramCode, setTelegramCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    init();

    if (Object.keys(factors).length == 0) {
      handleClose();
    }
    if (Object.keys(factors).length != 1 && (actionType == 'enable' || actionType == 'disable')) {
      handleClose();
    }

    if (buttonText === '') {
      setActionButtonText(actionType);
    } else {
      setActionButtonText(buttonText);
    }
    setErrorMessage(message);
    setSubTitle(generateSubtitle());
    setRequirements(generateRequirements());
  }, [factors, action, actionType, note]);

  const init = () => {
    setSubTitle('');
    setRequirements(<div></div>);
    setActionButtonText('');
    setIsProcessing(false);
    setShowEmailInput(false);
    setShowOTPInput(false);
    setShowQRCode(false);
    setShowTelegramInput(false);
    setShowTelegramCode(false);
    setQRCodeValue('');
    setEmailCode('');
    setOTPCode('');
    setOTPCodeId('');
    setTelegramCode('');
    setErrorMessage('');
  };

  const generateSubtitle = () => {
    let factorsNames = Object.keys(factors);

    let text = note;
    if (actionType == 'enable' || actionType == 'disable') {
      text = actionType[0].toUpperCase() + actionType.slice(1);
      switch (factorsNames[0]) {
        case 'email':
          text += ' email';
          break;
        case 'otp':
          text += ' one-time password (OTP)';
          break;
        case 'telegram':
          text += ' Telegram';
          break;
      }
      text += ' factor';
      switch (action) {
        case 'send':
          text += ' for send';
          break;
        case 'auth':
          text += ' for auth';
      }
    }
    return text;
  };

  const generateRequirements = () => {
    let factorsNames = Object.keys(factors);

    if (actionType == 'request') {
      let text = '';
      if (factorsNames.length > 1) {
        text = 'Codes sent to';
      } else {
        text = 'Code sent to';
      }
      for (let i = 0; i < factorsNames.length; ++i) {
        switch (factorsNames[i]) {
          case 'email':
            text += ' email,';
            setShowEmailInput(true);
            break;
          case 'otp':
            if (factorsNames.length == 1) {
              text = 'Input one-time password,';
            }
            setOTPCodeId(factors[factorsNames[i]].slice(0, 10));
            setShowOTPInput(true);
            break;
          case 'telegram':
            setShowTelegramInput(true);
            text += ' Telegram,';
            break;
        }
      }
      return <div>{text.slice(0, -1)}</div>;
    }

    let factor = factorsNames[0];
    switch (factor) {
      case 'email':
        setShowEmailInput(true);
        return <div>We sent code to your email</div>;
      case 'otp':
        setShowOTPInput(true);
        setOTPCodeId(factors[factor].slice(0, 10));
        if (actionType == 'enable') {
          setQRCodeValue(factors[factor].slice(10));
          setShowQRCode(true);
          return <div>Scan QR code with any OTP authentificator and input one-time password</div>;
        }
        return <div>Input code from OTP authenticator</div>;
      case 'telegram':
        setShowTelegramInput(true);
        if (actionType == 'enable') {
          setTelegramCode(factors[factor]);
          setShowTelegramCode(true);
          return (
            <div>
              Send next code to our telegram bot
              <br />
              <a href="https://t.me/bitsidybot" target="_blank">
                <div className={styles.botHighlight}>@bitsidybot</div>
              </a>
            </div>
          );
        }
        return <div>We sent code to your telegram account</div>;
    }

    return <div></div>;
  };

  const handleEmailCodeChange = (value: ChangeEvent<HTMLInputElement>) =>
    setEmailCode(value.target.value);

  const handleOTPCodeChange = (value: ChangeEvent<HTMLInputElement>) => {
    setOTPCode(value.target.value);
  };

  const handleTelegramCodeChange = (value: ChangeEvent<HTMLInputElement>) => {
    setTelegramCode(value.target.value);
  };

  const processing = () => {
    let factorsCodes = {};
    if (showEmailInput) {
      if (emailCode.length == 0) {
        setErrorMessage('Email code is empty');
        return;
      }
      factorsCodes['email'] = emailCode;
    }
    if (showOTPInput) {
      if (OTPCode.length == 0) {
        setErrorMessage('OTP code is empty');
        return;
      }
      if (OTPCode.length > 6) {
        factorsCodes['otp'] = OTPCode;
      } else {
        factorsCodes['otp'] = OTPCodeId + Buffer.from(OTPCode).toString('base64');
      }
    }
    if (showTelegramInput) {
      if (telegramCode.length == 0) {
        setErrorMessage('Telegram code is empty');
        return;
      }
      factorsCodes['telegram'] = telegramCode;
    }
    setFactorsCodes(factorsCodes);
    continueAction();
    handleClose();
  };

  return (
    <CustomDialog scroll="body" open={isOpened} onClose={handleClose} className={styles.dialog}>
      <div className={styles.content}>
        <div>
          <div className={styles.title}>Multi-factor Authentication</div>
          <div className={styles.subTitle}>{subTitle}</div>
        </div>
        <div className={styles.requirements}>{requirements}</div>
        {showQRCode && (
          <div className={styles.qrCode}>
            <QRCode
              bgColor={bgColor}
              fgColor={fgColor}
              size={140}
              value={QRCodeValue}
              viewBox={`0 0 140 140`}
            />
          </div>
        )}
        {showEmailInput && (
          <TextField
            id="emailCode"
            label="Code from email"
            fullwidth={true}
            value={emailCode}
            onChange={handleEmailCodeChange}
          />
        )}
        {showTelegramInput &&
          (showTelegramCode ? (
            <TextField
              id="telegramCode"
              label="Code"
              fullwidth={true}
              value={telegramCode}
              readonly={true}
            />
          ) : (
            <TextField
              id="telegramCode"
              label="Code from Telegram bot"
              fullwidth={true}
              value={telegramCode}
              onChange={handleTelegramCodeChange}
            />
          ))}
        {showOTPInput && (
          <TextField
            id="otpCode"
            label="6 digits one-time password"
            fullwidth={true}
            value={OTPCode}
            onChange={handleOTPCodeChange}
          />
        )}
        {message.length != 0 && <div className={styles.message}>{errorMessage}</div>}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={handleClose} variant="outlined" className={styles.closeButton}>
            CLOSE
          </Button>
          {!(showTelegramCode && actionType == 'enable') && (
            <ButtonProgressWrapper
              clickHandler={processing}
              loading={isProcessing}
              buttonText={actionButtonText.toUpperCase()}
            />
          )}
        </div>
      </div>
    </CustomDialog>
  );
};

export const MultiFactorAuthRecovery = ({
  isOpened,
  handleClose,
  recoveryCode,
  action,
  factors,
}: {
  isOpened: boolean;
  handleClose: () => void;
  recoveryCode: string;
  action: string;
  factors: { [index: string]: string };
}) => {
  const styles = useStyles();
  const [factor, setFactor] = useState('');

  useEffect(() => {
    if (Object.keys(factors).length != 1) {
      handleClose();
    }
    setFactor(Object.keys(factors)[0]);
  }, [factors]);
  return (
    <CustomDialog scroll="body" open={isOpened} onClose={handleClose} className={styles.dialog}>
      <div className={styles.content}>
        <div>
          <div className={styles.title}>Multi-factor Authentication</div>
          <div className={styles.subTitle}>Recovery token</div>
        </div>
        <div className={styles.recoveryCodeNote}>
          With recovery token you can disable multi-factor authentication for {action} if you have
          lost access to your {factor} account
        </div>
        <div className={styles.recoveryCode}>{recoveryCode}</div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={handleClose} variant="outlined">
            CLOSE
          </Button>
        </div>
      </div>
    </CustomDialog>
  );
};

const useStyles = makeStyles(
  (theme) =>
    createStyles({
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
      title: {
        display: 'flex',
        justifyContent: 'space-evenly',
        fontWeight: 400,
        fontSize: '24px',
        marginBottom: '10px',
      },
      subTitle: {
        fontSize: '16px',
        textAlign: 'center',
      },
      requirements: {
        fontSize: '16px',
        textAlign: 'center',
        lineHeight: 1.6,
        '& a': {
          textDecoration: 'none',
        },
      },
      recoveryCodeNote: {
        fontSize: '16px',
        lineHeight: 1.6,
      },
      recoveryCode: {
        fontSize: '16px',
        fontWeight: 600,
        textAlign: 'center',
        lineHeight: 1.6,
        '& a': {
          textDecoration: 'none',
        },
      },
      closeButton: {
        marginRight: '20px',
      },
      botHighlight: {
        color: theme.palette.custom.blue,
        fontWeight: 600,
      },
      qrCode: {
        display: 'flex',
        justifyContent: 'center',
      },
      message: {
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        fontWeight: 500,
        color: theme.palette.custom.red,
      },
    }),
  { name: 'MultiFactorAuth' },
);
