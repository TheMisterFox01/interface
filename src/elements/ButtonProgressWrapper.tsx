import { PropsWithChildren } from 'react';

import Button from '../components/Button';
import CircularProgress from '../components/CircularProgress';

import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';

type ButtonProgressWrapperProps = {
  clickHandler: (e: React.MouseEvent<HTMLButtonElement>) => void;
  loading: boolean;
  buttonText: string;
  backgroundColor?: string | null | undefined;
  className?: string;
  variant?: string;
};

const ButtonProgressWrapper = (
  props: PropsWithChildren<ButtonProgressWrapperProps>,
): JSX.Element => {
  const {
    clickHandler,
    loading,
    buttonText,
    backgroundColor,
    className = '',
    variant = 'contained',
  } = props;
  const theme = useTheme();

  let buttonBackgroundColor: string;
  if (backgroundColor === null || backgroundColor === undefined) {
    if (variant == 'contained') {
      buttonBackgroundColor = theme.palette.primary.main;
    } else {
      buttonBackgroundColor = theme.palette.background.default;
    }
  } else {
    buttonBackgroundColor = backgroundColor;
  }

  const useStyles = makeStyles(
    () =>
      createStyles({
        button: {
          display: 'flex',
          alignItems: 'center',
          minHeight: '48px',
          boxSizing: 'border-box',
          color: 'white',
          fontFamily: '"Montserrat", sans-serif',
          backgroundColor: buttonBackgroundColor,
          borderColor: buttonBackgroundColor,
          '&:hover': {
            backgroundColor: buttonBackgroundColor,
            borderColor: buttonBackgroundColor,
          },
        },
        hidden: {
          opacity: 0,
        },
        content: {
          position: 'relative',
          minWidth: '96px',
          fontFamily: '"Montserrat", sans-serif',
        },
        text: {
          fontFamily: '"Montserrat", sans-serif',
        },
      }),
    { name: 'ButtonProgressWrapper' },
  );

  const styles = useStyles();

  return (
    <div className={`${styles.content} ${className}`}>
      <Button className={styles.button} onClick={clickHandler} variant={variant}>
        {loading ? (
          <CircularProgress size={24} onButton={true} />
        ) : (
          <div className={styles.text + ' ' + (loading ? styles.hidden : '')}>{buttonText}</div>
        )}
      </Button>
    </div>
  );
};

export default ButtonProgressWrapper;
