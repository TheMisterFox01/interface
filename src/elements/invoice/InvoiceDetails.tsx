import { useState } from 'react';

import Link from '@material-ui/core/Link';

import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import InvoiceExpirationTimer from './InvoiceExpirationTimer';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Collapse from '@mui/material/Collapse';

import { datePrepare, getAddressUrlByParams } from 'utils';
import { InvoiceData } from './Invoice';

const InvoiceDetails = ({ data }: { data: InvoiceData }): JSX.Element => {
  const theme = useTheme();
  const styles = useStyles();
  const rate = String(data.invoice.amountUsd / data.invoice.amount);
  const pointIndex = rate.indexOf('.');
  const clippedRate = rate.slice(0, pointIndex + 3);
  const [isVisible, setIsVisible] = useState(false);

  const handleClick = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className={styles.content}>
      {['success', 'underpaid', 'expired', 'fail'].includes(data.status) === false && (
        <div className={styles.expireContent}>
          <ScheduleOutlinedIcon color="primary" sx={{ mr: '6px', color: '#048BF8' }} />
          <InvoiceExpirationTimer expirationDate={data.invoice.expiration} />
          <div className={styles.expire}>until expire</div>
        </div>
      )}
      <div className={styles.infoBoxTitle} onClick={handleClick}>
        Details
        <ArrowDropDownIcon sx={{ color: theme.palette.common.black }} />
      </div>
      <Collapse in={isVisible}>
        <div className={styles.infoBox}>
          <div className={styles.infoName}>Amount {data.currency}</div>
          <div className={styles.info}>{data.invoice.amount}</div>
        </div>
        <div className={styles.infoBox}>
          <div className={styles.infoName}>Rate</div>
          <div className={styles.info}>{`1 ${data.currency} = $${clippedRate}`}</div>
        </div>
        <div className={styles.infoBox}>
          <div className={styles.infoName}>Invoice ID</div>
          <div className={styles.info}>{data.invoice.invoiceId}</div>
        </div>
        <div className={styles.infoBox}>
          <div className={styles.infoName}>Date created</div>
          <div className={styles.info}>{datePrepare(data.invoice.date)}</div>
        </div>
        <div className={styles.infoBox}>
          <div className={styles.infoName}>Account email</div>
          <div className={styles.info}>{data.invoice.email}</div>
        </div>
        <div className={styles.infoBox}>
          <div className={styles.infoName}>Payment information</div>
          <div className={styles.info}>
            {data.invoice.customString ? data.invoice.customString : '-'}
          </div>
        </div>
        <div className={styles.infoBox}>
          <div className={styles.infoName}>Address</div>
          <div className={styles.info}>
            <Link
              className={styles.explorerLink}
              href={getAddressUrlByParams(data.currency, data.wallet.address)}
              target="_blank"
              rel="noreferrer"
            >
              To explorer
            </Link>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default InvoiceDetails;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      expire: {
        marginLeft: '6px',
        color: theme.palette.text.secondary,
      },
      expireContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
      },
      content: {
        padding: '8px 16px',
      },
      infoBoxTitle: {
        color: theme.palette.text.primary,
        marginBottom: '18px',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
      },
      infoBox: {
        color: theme.palette.text.primary,
        marginBottom: '18px',
      },
      infoName: {
        color: '#666666',
        fontSize: '14px',
        marginBottom: '4px',
      },
      info: {
        fontSize: '16px',
        wordBreak: 'break-all',
        '&::-webkit-scrollbar': {
          width: '0px',
          height: '0px',
        },
      },
      explorerLink: {
        color: theme.palette.primary.main,
      },
    }),
  { name: 'InvoiceDetails' },
);
