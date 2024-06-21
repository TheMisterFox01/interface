import { observer } from 'mobx-react';

import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import useMediaQuery from '@mui/material/useMediaQuery';

import store from 'store/store';

const AccountBalance = ({
  isWhite,
  isForPhone,
}: {
  isWhite: boolean;
  isForPhone: boolean;
}): JSX.Element => {
  const theme = useTheme();

  const useStyles = makeStyles(
    () =>
      createStyles({
        accountBalance: {
          color: (isWhite ? theme.palette.custom.trueWhite : theme.palette.custom.trueBlack) + ' !important'
        },
        menuButton: {
          display: 'flex',
          justifyContent: 'flex-start',
          width: 'max-content',
          height: '48px',
          maxHeight: '48px',
          minHeight: '48px',
          paddingLeft: '10px !important',
          paddingRight: '10px !important',
        },
        userMenuText: {
          width: 'min-content',
          fontSize: '16px',
          display: 'flex',
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 400,
        },
        userMenuPhoneText: {
          fontSize: '18px',
          fontWeight: 500,
          width: 'min-content',
          display: 'flex',
          fontFamily: 'Montserrat, sans-serif',
        },
      }),
    { name: 'AccountBalance' },
  );
  const styles = useStyles();

  const isPhone = useMediaQuery(theme.breakpoints.between('xs', 'md'));

  const AccountBalanceObserver = observer(({ store }: any) =>
    store.commonBalance > 0 && isPhone === isForPhone ? (
      <div className={styles.menuButton + ' ' + styles.accountBalance}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <AccountBalanceWalletOutlinedIcon sx={{ color: 'inherit' }} />
          <div className={isForPhone ? styles.userMenuPhoneText : styles.userMenuText}>
            <div style={{ marginLeft: '14px' }}>{store.commonBalance?.toFixed(2)}</div>
            <div style={{ marginLeft: '5px' }}>USD</div>
          </div>
        </div>
      </div>
    ) : (
      <div></div>
    ),
  );

  return <AccountBalanceObserver store={store} />;
};

export default AccountBalance;

