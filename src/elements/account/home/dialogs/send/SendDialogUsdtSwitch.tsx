import { useState } from 'react';
import Image from 'next/image';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import logoDark from 'public/logoDark.svg';
import energyIcon from 'public/energy.svg';
import burnIcon from 'public/burn.svg';

const SendDialogUsdtSwitch = ({
  feeType,
  totalEnergyAmount,
  changeType,
}: {
  feeType: string;
  totalEnergyAmount: number;
  changeType: (v: string) => void;
}) => {
  const styles = useStyles();
  const [showUSDTAdditionalOptions, setShowUSDTAdditionalOptions] = useState(false);

  return (
    <div className={styles.switches}>
      <div className={styles.switchesRow}>
        <div
          className={
            styles.switch +
            ' ' +
            styles.wideSwitch +
            ' ' +
            (feeType === 'borrow' ? styles.switchActive : '')
          }
          onClick={() => changeType('borrow')}
        >
          <div className={styles.switchRow}>
            <Image width={24} height={24} src={logoDark} />
            <div className={styles.switchTitle}>Borrow resources</div>
          </div>
          <div className={styles.switchDesc}>Borrow bitsidy resources as transaction fee</div>
        </div>
        {showUSDTAdditionalOptions && (
          <div
            className={
              styles.switch +
              ' ' +
              (feeType === 'energy' ? styles.switchActive : '') +
              ' ' +
              (totalEnergyAmount === 0 ? styles.inactive : '')
            }
            onClick={() => (totalEnergyAmount === 0 ? '' : changeType('energy'))}
          >
            <div className={styles.switchRow}>
              <Image height={24} src={energyIcon} />
              <div className={styles.switchTitle}>Energy</div>
            </div>
            <div className={styles.switchDesc}>Spend Energy as transaction fee</div>
          </div>
        )}
        {showUSDTAdditionalOptions && (
          <div
            className={styles.switch + ' ' + (feeType === 'burn' ? styles.switchActive : '')}
            onClick={() => changeType('burn')}
          >
            <div className={styles.switchRow}>
              <Image height={24} src={burnIcon} />
              <div className={styles.switchTitle}>Burn</div>
            </div>
            <div className={styles.switchDesc}>Spend TRX as transaction fee</div>
          </div>
        )}
      </div>
      {!showUSDTAdditionalOptions && (
        <div
          className={styles.showAdditionalOptions}
          onClick={() => setShowUSDTAdditionalOptions(true)}
        >
          Show more options
        </div>
      )}
    </div>
  );
};

export default SendDialogUsdtSwitch;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      showAdditionalOptions: {
        display: 'flex',
        color: theme.palette.primary.main,
        textDecoration: 'underline',
        cursor: 'pointer',
        justifyContent: 'center',
      },
      bookmarksIcon: {
        color: theme.palette.custom.blue,
      },
      inactive: {
        opacity: 0.5,
        cursor: 'initial',
      },
      switches: {
        '& > *:not(:last-child)': {
          marginBottom: '20px',
        },
      },
      switchesRow: {
        display: 'flex',
        justifyContent: 'center',
        '& > *:not(:last-child)': {
          marginRight: '20px',
        },
        [theme.breakpoints.down('sm')]: {
          flexDirection: 'column',
          alignItems: 'center',
          '& > *:not(:last-child)': {
            marginRight: '0px',
            marginBottom: '20px',
          },
        },
      },
      switch: {
        padding: '10px',
        borderColor: '#C4C4C4',
        borderRadius: '4px',
        borderWidth: '1px',
        borderStyle: 'solid',
        cursor: 'pointer',
        minWidth: '155px',
        maxWidth: '200px',
        boxSizing: 'border-box',
      },
      wideSwitch: {
        width: '200px',
        minWidth: '200px',
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
    }),
  { name: 'SendDialogUsdtSwitch' },
);
