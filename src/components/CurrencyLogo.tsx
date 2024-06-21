import btcLogo from 'public/btcLogo.svg';
import ltcLogo from 'public/ltcLogo.svg';
import trcLogo from 'public/trc20Logo.svg';
import ercLogo from 'public/erc20Logo.svg';
import ethLogo from 'public/ethLogo.svg';
import trxLogo from 'public/trxLogo.svg';
import dogeLogo from 'public/dogeLogo.svg';
import dashLogo from 'public/dashLogo.svg';
import xrpLogo from 'public/xrpLogo.svg';
import xmrLogo from 'public/xmrLogo.svg';
import adaLogo from 'public/adaLogo.svg';
import busdLogo from 'public/busdLogo.svg';

import Image from 'next/image';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const logo = {
  BTC: btcLogo,
  LTC: ltcLogo,
  ETH: ethLogo,
  TRX: trxLogo,
  XRP: xrpLogo,
  DOGE: dogeLogo,
  DASH: dashLogo,
  XMR: xmrLogo,
  ADA: adaLogo,
  'USDT.TRC20': trcLogo,
  'USDT.ERC20': ercLogo,
  'BUSD.TRC20': busdLogo,
  USDT_trc20: trcLogo,
  USDT_erc20: ercLogo,
  BUSD_trc20: busdLogo,
};

const subCurrencies = [
  'USDT.TRC20',
  'USDT.ERC20',
  'BUSD.TRC20',
  'USDT_trc20',
  'USDT_erc20',
  'BUSD_trc20',
];

const CurrencyLogo = ({
  currency = '',
  size = 48,
  allWide = false,
  className = '',
}: {
  currency: string;
  size?: number;
  allWide?: boolean;
  className?: string;
}) => {
  const styles = useStyles();
  let height = styles.size48;
  let width = styles.size48;
  switch (size) {
    case 64:
      height = styles.size64;
      width = subCurrencies.includes(currency) || allWide ? styles.width64wide : styles.width64;
      break;
    case 30:
      height = styles.size30;
      width = subCurrencies.includes(currency) || allWide ? styles.width30wide : styles.width30;
      break;
    case 24:
      height = styles.size24;
      width = subCurrencies.includes(currency) || allWide ? styles.width24wide : styles.width24;
      break;
    default:
      height = styles.size48;
      width = subCurrencies.includes(currency) || allWide ? styles.width48wide : styles.width48;
  }

  return (
    <div className={className + ' ' + styles.logo + ' ' + height + ' ' + width}>
      <Image height={size} src={logo[currency] || logo.BTC} />
    </div>
  );
};

export default CurrencyLogo;

const useStyles = makeStyles(
  () =>
    createStyles({
      logo: {
        display: 'flex',
        justifyContent: 'center',
      },
      size64: {
        height: '64px',
        minHeight: '64px',
        maxHeight: '64px',
      },
      size48: {
        height: '48px',
        minHeight: '48px',
        maxHeight: '48px',
      },
      size30: {
        height: '30px',
        minHeight: '30px',
        maxHeight: '30px',
      },
      size24: {
        height: '24px',
        minHeight: '24px',
        maxHeight: '24px',
        minWidth: '24px',
      },
      width64: {
        minWidth: '64px',
        maxWidth: '64px',
        width: '64px',
      },
      width48: {
        minWidth: '48px',
        maxWidth: '48px',
        width: '48px',
      },
      width30: {
        minWidth: '30px',
        maxWidth: '30px',
        width: '30px',
      },
      width24: {
        minWidth: '24px',
        maxWidth: '24px',
        width: '24px',
      },
      width64wide: {
        minWidth: '100px',
        maxWidth: '100px',
        width: '100px',
      },
      width48wide: {
        minWidth: '76px',
        maxWidth: '76px',
        width: '76px',
      },
      width30wide: {
        minWidth: '48px',
        maxWidth: '48px',
        width: '48px',
      },
      width24wide: {
        minWidth: '38px',
        maxWidth: '38px',
        width: '38px',
      },
    }),
  { name: 'CurrencyLogo' },
);
