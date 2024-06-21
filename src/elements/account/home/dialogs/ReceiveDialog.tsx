import { SetStateAction, Dispatch, useCallback, useEffect, useState, useContext } from 'react';

import IconButton from 'components/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CircularProgress from 'components/CircularProgress';
import Button from 'components/Button';
import QRCode from 'react-qr-code';

import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';

import { postData, useCopyToClipboard, GET_WALLET_RECEIVE_PATH, getToken } from 'utils';
import CustomDialog from 'elements/customComponents/CustomDialog';
import { WalletRow } from '../Home';
import { SnackbarContext } from 'pages/account/[[...page]]';

type ReceiveDialogProps = {
  openReceiveDialog: boolean;
  setOpenReceiveDialog: Dispatch<SetStateAction<boolean>>;
  currentWalletRow: WalletRow;
};

const ReceiveDialog = (props: ReceiveDialogProps): JSX.Element => {
  const theme = useTheme();
  const styles = useStyles();
  const { openReceiveDialog, setOpenReceiveDialog, currentWalletRow } = props;

  const handleOpenSnackbar = useContext(SnackbarContext);
  const [_value, copy] = useCopyToClipboard();
  const [address, setAddress] = useState('');
  const [isWalletLoading, setIsWalletLoading] = useState(true);

  const getWalletsBalance = useCallback(async () => {
    setIsWalletLoading(true);

    let token = '';
    if (currentWalletRow.subUser != null) {
      token = currentWalletRow.subUser.token;
    } else {
      token = await getToken();
    }

    const response = await postData(GET_WALLET_RECEIVE_PATH, {
      token,
      currencyInternalName: currentWalletRow.name,
    });

    if (response.result === 'success') {
      const data = response.data;
      setAddress(data.receiveAddress);
      setIsWalletLoading(false);
    }
  }, [currentWalletRow]);

  useEffect(() => {
    if (currentWalletRow.name && openReceiveDialog) {
      setAddress('');
      getWalletsBalance().catch((error) => console.log(error));
    }
  }, [openReceiveDialog]);

  const handleClick = () => {
    copy(address).then(handleOpenSnackbar);
  };

  const handleClose = () => {
    setOpenReceiveDialog(false);
  };

  return (
    <CustomDialog
      scroll="body"
      className={styles.dialog}
      open={openReceiveDialog}
      onClose={handleClose}
    >
      <div className={styles.actions}>
        <div className={styles.title}>Receive {currentWalletRow.shortName}</div>
        <div className={styles.subTitle}>Send {currentWalletRow.shortName} to this address</div>
        {isWalletLoading ? (
          <div
            style={{
              height: '41px',
              marginBottom: '30px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress size={24} />
          </div>
        ) : (
          <>
            <div className={styles.actionsContent}>
              <div className={styles.address}>{address}</div>
              <IconButton className={styles.button} onClick={handleClick}>
                <ContentCopyIcon />
              </IconButton>
            </div>
            {address != '' && (
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
                <QRCode
                  bgColor={theme.palette.custom.background}
                  fgColor={theme.palette.custom.black}
                  size={140}
                  value={address}
                  viewBox={`0 0 140 140`}
                />
              </div>
            )}
          </>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
          <Button onClick={handleClose} variant="outlined">
            CLOSE
          </Button>
        </div>
      </div>
    </CustomDialog>
  );
};

export default ReceiveDialog;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
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
      content: {
        textAlign: 'center',
        color: theme.palette.text.primary,
      },
      dialog: {
        backdropFilter: 'blur(3px)',
        '& .MuiBackdrop-root': {
          background: theme.palette.common.white,
          opacity: '0.5 !important',
        },
        '& .MuiPaper-root': {
          width: '560px',
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
        '& > *:not(:last-child)': {
          marginBottom: '30px',
        },
        [theme.breakpoints.down('md')]: {
          padding: '0px',
        },
      },
      actionsContent: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid',
        color: theme.palette.text.primary,
        borderBottomColor: theme.palette.common.black,
      },
      button: {
        color: theme.palette.common.black,
      },
      address: {
        fontFamily: 'DM Mono, sans-serif',
        fontSize: '16px',
        [theme.breakpoints.down('md')]: {
          wordBreak: 'break-all',
        },
      },
    }),
  { name: 'ReceiveDialog' },
);
