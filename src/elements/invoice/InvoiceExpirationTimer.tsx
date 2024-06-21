import { useState, useEffect } from 'react';

import { createStyles, makeStyles } from '@material-ui/core/styles';

type InvoiceExpirationTimerProps = {
  expirationDate: string;
};

const getExpirationTime = (dateString: string) => {
  const now = new Date();
  const dateEnd = new Date(`${dateString}Z`);
  const diff = dateEnd.valueOf() - now.valueOf();

  if (diff <= 0) {
    return [0, 0, 0];
  }

  const hours = Math.floor(diff / 3.6e6);
  const minutes = Math.floor((diff % 3.6e6) / 6e4);
  const seconds = Math.floor((diff % 6e4) / 1000);

  return [hours, minutes, seconds];
};

const formatTime = (value: number) => {
  return value < 10 ? `0${value}` : value;
};

const InvoiceExpirationTimer = ({ expirationDate }: InvoiceExpirationTimerProps): JSX.Element => {
  const [over, setOver] = useState(false);
  const [[h, m, s], setTime] = useState(getExpirationTime(expirationDate));

  const styles = useStyles();
  const tick = () => {
    if ((h === 0 && m === 0 && s === 0) || h < 0 || m < 0 || s < 0) {
      setOver(true);
    } else if (m === 0 && s === 0) {
      setTime([h - 1, 59, 59]);
    } else if (s == 0) {
      setTime([h, m - 1, 59]);
    } else {
      setTime([h, m, s - 1]);
    }
  };

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);
    return () => clearInterval(timerID);
  });

  return (
    <div className={styles.content}>
      {over ? "Time's up!" : `${formatTime(h)}:${formatTime(m)}:${formatTime(s)}`}
    </div>
  );
};

export default InvoiceExpirationTimer;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      content: {
        color: theme.palette.text.primary
      },
    }),
  { name: 'InvoiceExpirationTimer' },
);
