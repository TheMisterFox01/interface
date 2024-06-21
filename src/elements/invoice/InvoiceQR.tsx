import QRCode from 'react-qr-code';

import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';

import { InvoiceData } from './Invoice';

const getQRContent = (data: InvoiceData): string | null => {
  const {
    currency,
    status,
    invoice: { amount },
    wallet: { address, balance },
  } = data;

  switch (currency) {
    case 'BTC':
      return status === 'detected_underpaid'
        ? 'bitcoin:' + address + '?amount=' + (amount - balance)?.toFixed(8)
        : 'bitcoin:' + address + '?amount=' + amount?.toFixed(8);

    case 'LTC':
      return status == 'detected_underpaid'
        ? 'litecoin:' + address + '?amount=' + (amount - balance)?.toFixed(8)
        : 'litecoin:' + address + '?amount=' + amount?.toFixed(8);

    case 'DOGE':
      return status == 'detected_underpaid'
        ? 'dogecoin:' + address + '?amount=' + (amount - balance)?.toFixed(8)
        : 'dogecoin:' + address + '?amount=' + amount?.toFixed(8);

    case 'ETH':
      return status == 'detected_underpaid'
        ? 'ethereum:' + address + '?value=' + (amount - balance)?.toFixed(8)
        : 'ethereum:' + address + '?value=' + amount?.toFixed(8);

    default:
      return null;
  }
};

const InvoiceQR = ({ data }: { data: InvoiceData }): JSX.Element => {
  const styles = useStyles();
  const value = getQRContent(data);
  const theme = useTheme();
  const isLightTheme = theme.palette.type === 'light';
  const fgColor = isLightTheme ? '#212121' : '#ffffff';
  const bgColor = isLightTheme ? '#ffffff' : '#0D0F10';

  return (
    <>
      {value ? (
        <div className={styles.qrCode}>
          <QRCode
            bgColor={bgColor}
            fgColor={fgColor}
            size={140}
            value={value}
            viewBox={`0 0 140 140`}
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default InvoiceQR;

const useStyles = makeStyles(
  () =>
    createStyles({
      qrCode: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: '20px'
      },
    }),
  { name: 'InvoiceQR' },
);
