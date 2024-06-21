import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useEffect, useState, ChangeEvent } from 'react';

import Button from 'components/Button';
import CustomDialog from 'elements/customComponents/CustomDialog';
import CurrencyLogo from 'components/CurrencyLogo';
import TextField from 'components/TextField';
import CircularProgress from 'components/CircularProgress';
import ButtonProgressWrapper from 'elements/ButtonProgressWrapper';
import IconButton from 'components/IconButton';
import {
  GET_ADDRESS_BOOKMARKS_BY_CURRENCY,
  CREATE_ADDRESS_BOOKMARK,
  DELETE_ADDRESS_BOOKMARK,
  postData,
  getCurrencyName,
  datePrepare,
} from 'utils';

import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

type AddressBookmarkDialogProps = {
  isOpened: boolean;
  handleClose: () => void;
  currencyName: string;
  setWallet: (wallet: string) => void;
};

type ErrorData = {
  amount: boolean;
  errorText: string;
};

type Bookmark = {
  addressBookmarkId: string;
  currencyInternalName: string;
  address: string;
  comment: string;
  date: string;
};

const AddressBookmarkDialog = (props: AddressBookmarkDialogProps) => {
  const { isOpened, handleClose, currencyName, setWallet } = props;
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [isButtonLoading, setIsButtonLoading] = useState(true);
  const [addBookmark, setAddBookmark] = useState(false);
  const [newWallet, setNewWallet] = useState('');
  const [note, setNote] = useState('');
  const [errorData, setErrorData] = useState({} as ErrorData);

  const styles = useStyles();

  const init = () => {
    setIsContentLoading(true);
    setIsButtonLoading(false);
    setAddBookmark(false);
    setNewWallet('');
    setNote('');
    setErrorData({} as ErrorData);
  };

  const getBookmarks = async () => {
    setIsContentLoading(true);

    try {
      setAddBookmark(false);

      const token = localStorage.getItem('bitsidyAccessToken') || '';

      const currencyInternalName = getCurrencyName(currencyName, 'internalName');
      let response = await postData(GET_ADDRESS_BOOKMARKS_BY_CURRENCY, {
        token,
        currencyName: currencyInternalName,
      });

      if (response.result == 'success') {
        setBookmarks(response.data.addressBookmarks ?? []);
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
      setIsContentLoading(false);
    }
  };

  const saveBookmark = async () => {
    setIsButtonLoading(true);

    try {
      const token = localStorage.getItem('bitsidyAccessToken') || '';

      const currencyInternalName = getCurrencyName(currencyName, 'internalName');
      let response = await postData(CREATE_ADDRESS_BOOKMARK, {
        token,
        currencyInternalName,
        address: newWallet,
        comment: note,
      });

      if (response.result == 'success') {
        setAddBookmark(false);
        getBookmarks();
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
      setIsButtonLoading(false);
    }
  };

  const removeBookmark = async (addressBookmarkId: string) => {
    setIsContentLoading(true);

    try {
      const token = localStorage.getItem('bitsidyAccessToken') || '';

      let response = await postData(DELETE_ADDRESS_BOOKMARK, {
        token,
        addressBookmarkId,
      });

      if (response.result == 'success') {
        getBookmarks();
      } else {
        const error = response.data;
        const data: ErrorData = {} as ErrorData;

        if (error.message) {
          data.errorText = error.message;
        } else {
          data.errorText = 'Unknown error';
        }

        setErrorData(data);
        setIsContentLoading(false);
      }
    } catch {
      setIsContentLoading(false);
    }
  };

  useEffect(() => {
    if (isOpened == true) {
      init();
      getBookmarks();
    }
  }, [isOpened]);

  const closeButton = () => {
    if (addBookmark) {
      setAddBookmark(false);
    } else {
      handleClose();
    }
  };

  const addButton = () => {
    if (addBookmark) {
      saveBookmark();
    } else {
      setAddBookmark(true);
    }
  };

  const handleChangeWallet = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNewWallet(value);
  };

  const handleChangeNote = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNote(value);
  };

  const handleSelectWallet = (wallet: string) => {
    setWallet(wallet);
    handleClose();
  };

  return (
    <CustomDialog
      scroll="body"
      className={styles.dialog + ' ' + (false ? styles.locked : '')}
      open={isOpened}
      onClose={handleClose}
    >
      <div className={styles.topRow}>
        <div className={styles.towRowTitle}>
          <div>
            <CurrencyLogo size={48} currency={currencyName} />
          </div>
          <div className={styles.title}>
            {addBookmark ? 'Add Address Bookmark' : 'Address Bookmarks'}
          </div>
        </div>
      </div>
      {isContentLoading ? (
        <div className={styles.loading}>
          <CircularProgress size={36} />
        </div>
      ) : addBookmark ? (
        <div>
          <div className={styles.row}>
            <TextField
              id="Wallet"
              label="Wallet"
              fullwidth={true}
              value={newWallet}
              onChange={handleChangeWallet}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                }
              }}
            />
          </div>
          <div className={styles.row}>
            <TextField
              id="Note"
              label="Note"
              fullwidth={true}
              value={note}
              onChange={handleChangeNote}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                }
              }}
            />
          </div>
        </div>
      ) : (
        <div className={styles.bookmarks}>
          {bookmarks.length > 0 ? (
            bookmarks?.map((row) => {
              return (
                <div className={styles.bookmarkRow}>
                  <IconButton
                    onClick={() => removeBookmark(row.addressBookmarkId)}
                    className={styles.removeBookmark}
                  >
                    <CloseIcon fontSize="medium" />
                  </IconButton>
                  <div className={styles.bookmarkText}>
                    <div className={styles.bookmarkMainText}>{row.comment}</div>
                    <div className={styles.bookmarkSecondText}>{row.address}</div>
                    <div className={styles.bookmarkSecondText}>Added {datePrepare(row.date)}</div>
                  </div>
                  <IconButton
                    onClick={() => handleSelectWallet(row.address)}
                    className={styles.addBookmark}
                  >
                    <ArrowForwardIcon fontSize="medium" />
                  </IconButton>
                </div>
              );
            })
          ) : (
            <div className={styles.bookmarksEmpty}>Address bookmarks list is empty</div>
          )}
        </div>
      )}

      <Collapse in={typeof errorData.errorText === 'string' && errorData.errorText.length > 0}>
        <div className={styles.errorTextMessage}>{errorData.errorText}</div>
      </Collapse>

      <div className={styles.actions}>
        <Button className={styles.closeButton} variant="outlined" onClick={closeButton}>
          CLOSE
        </Button>
        <ButtonProgressWrapper
          clickHandler={addButton}
          loading={isButtonLoading}
          buttonText="ADD NEW WALLET"
        />
      </div>
    </CustomDialog>
  );
};

export default AddressBookmarkDialog;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      title: {
        color: theme.palette.text.primary,
        fontWeight: 400,
        fontSize: '24px',
        fontFamily: 'Montserrat, sans-serif !important',
        marginLeft: '20px',
      },
      topRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '30px',
        [theme.breakpoints.down('sm')]: {
          flexDirection: 'column',
          alignItems: 'start',
          '& > *:not(:last-child)': {
            marginRight: '0px',
            marginBottom: '20px',
          },
        },
      },
      towRowTitle: {
        display: 'flex',
        alignItems: 'center',
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
          background: theme.palette.common.white,
          opacity: '0.5 !important',
        },
        '& .MuiPaper-root': {
          width: '450px',
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
        marginRight: '20px',
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
      loading: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '30px',
      },
      errorTextMessage: {
        marginBottom: '30px',
        fontWeight: 500,
        color: theme.palette.custom.red,
        textAlign: 'center',
      },
      sendButton: {
        padding: '8px 12px !important',
        fontFamily: 'Montserrat, sans-serif  !important',
        background: theme.palette.primary.main,
        color: '#ffffff',
        fontWeight: 400,
        '&.MuiButtonBase-root:hover': {
          background: theme.palette.primary.main,
        },
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
      },
      row: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '30px',
      },
      bookmarks: {
        marginBottom: '15px',
      },
      bookmarkRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
        cursor: 'pointer',
      },
      bookmarkText: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      },
      bookmarkMainText: {
        color: theme.palette.text.primary,
        cursor: 'pointer',
        fontSize: '16px',
        marginBottom: '4px',
        wordBreak: 'break-all',
      },
      bookmarkSecondText: {
        fontSize: '12px',
        color: theme.palette.text.secondary,
        cursor: 'pointer',
        wordBreak: 'break-all',
        marginBottom: '3px',
      },
      addBookmark: {
        '&:not(:hover)': {
          color: theme.palette.text.primary,
        },
        '&:hover': {
          color: theme.palette.custom.blue,
        },
      },
      removeBookmark: {
        marginRight: '10px',
        '&:not(:hover)': {
          color: theme.palette.text.primary,
        },
        '&:hover': {
          color: theme.palette.custom.blue,
        },
      },
      bookmarksEmpty: {
        display: 'flex',
        marginBottom: '30px',
        justifyContent: 'center',
        textAlign: 'center',
      },
    }),
  { name: 'AddressBookmarkDialog' },
);
