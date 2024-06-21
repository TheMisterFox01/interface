import { SetStateAction, Dispatch, useCallback, useEffect, ChangeEvent, useState } from 'react';
import { observer } from 'mobx-react';

import Button from 'components/Button';

import { createStyles, makeStyles } from '@material-ui/core/styles';

import TextField from 'components/TextField';
import ButtonProgressWrapper from 'elements/ButtonProgressWrapper';
import CustomDialog from 'elements/customComponents/CustomDialog';
import { postData, UPDATE_INVOICE_PATH } from 'utils';

type EditInvoiceDialogProps = {
  invoiceId: string;
  storeId: string;
  currency: string;
  amount: number;
  amountUsd: number;
  isOpenEditInvoiceDialog: boolean;
  setIsOpenEditInvoiceDialog: Dispatch<SetStateAction<boolean>>;
  getInvoice: () => Promise<void>;
};

const EditInvoiceDialog = (props: EditInvoiceDialogProps): JSX.Element => {
  const {
    invoiceId,
    storeId,
    currency,
    amount,
    amountUsd,
    isOpenEditInvoiceDialog,
    setIsOpenEditInvoiceDialog,
    getInvoice,
  } = props;
  const styles = useStyles();

  const [amountInput, setAmountInput] = useState(0);
  const [amountUsdInput, setAmountUsdInput] = useState(0);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setIsSending(false);
    setAmountInput(amount);
    setAmountUsdInput(amountUsd);
  }, [amount, amountUsd]);

  const editInvoice = useCallback(async () => {
    setIsSending(true);
    const token = localStorage.getItem('bitsidyAccessToken') || '';

    const response = await postData(UPDATE_INVOICE_PATH, {
      token,
      invoiceId,
      storeId,
      amount: amountInput,
      amountUsd: amountUsdInput,
      status: 'wait',
      dateUpdated: new Date().toISOString(),
    });

    if (response.result === 'success') {
      setIsOpenEditInvoiceDialog(false);
      getInvoice().catch((error: any) => console.log(error));
    }
    setIsSending(false);
  }, [amountInput, amountUsdInput]);

  const handleSend = () => editInvoice().catch((error) => console.log(error));
  const handleClose = () => setIsOpenEditInvoiceDialog(false);

  const handleChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setAmountInput(parseFloat(value));
  };

  const handleChangeAmountUsd = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setAmountUsdInput(parseFloat(value));
  };

  return (
    <CustomDialog
      scroll="body"
      className={styles.dialog}
      open={isOpenEditInvoiceDialog}
      onClose={handleClose}
    >
      <div className={styles.actions}>
        <div className={styles.title}>Edit Invoice Amounts</div>
        <div className={styles.actionsContent}>
          <TextField
            autofocus={true}
            fullwidth={true}
            id="amount"
            label="Amount"
            value={amountInput}
            onChange={handleChangeAmount}
            endAdornment={currency}
          />
        </div>
        <div className={styles.actionsContent}>
          <TextField
            autofocus={true}
            fullwidth={true}
            id="amount"
            label="Amount USD"
            value={amountUsdInput}
            onChange={handleChangeAmountUsd}
            endAdornment="USD"
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={handleClose} className={styles.closeButton} variant="outlined">
            CLOSE
          </Button>
          <ButtonProgressWrapper
            clickHandler={handleSend}
            loading={isSending}
            buttonText="EDIT AND RECHECK"
          />
        </div>
      </div>
    </CustomDialog>
  );
};

export default observer(EditInvoiceDialog);

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
        textAlign: 'center',
      },
      content: {
        textAlign: 'center',
        color: theme.palette.text.primary,
      },
      dialog: {
        '& .MuiBackdrop-root': {
          background: theme.palette.common.white,
          opacity: '0.75 !important',
        },
        '& .MuiPaper-root': {
          width: '400px',
          [theme.breakpoints.down('sm')]: {
            width: '100%',
            margin: '0px !important',
          },
          padding: '20px 20px 30px 20px',
          background: theme.palette.background.default,
          color: theme.palette.common.black,
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
        color: theme.palette.text.primary,
      },
      closeButton: {
        marginRight: '20px !important',
      },
    }),
  { name: 'EditInvoiceDialog' },
);
