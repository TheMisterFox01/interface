import { ChangeEvent, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import Collapse from '@mui/material/Collapse';
import CircularProgress from 'components/CircularProgress';

import { createStyles, makeStyles } from '@material-ui/core/styles';

import ThemeSwitcher from 'elements/ThemeSwitcher';
import Header from 'elements/Header';
import ButtonProgressWrapper from 'elements/ButtonProgressWrapper';
import TextField from 'components/TextField';

import { CHECK_PASSWORD_RECOVERY_TOKEN_PATH, UPDATE_PASSWORD_PATH, postData } from 'utils';

type ErrorData = {
  errorText: string;
};

const PasswordRecovery = (): JSX.Element => {
  const styles = useStyles();
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isTokenChecked, setIsTokenChecked] = useState(false);
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorData, setErrorData] = useState({} as ErrorData);

  const checkToken = useCallback(async () => {
    if (router.query.recoveryToken) {
      try {
        setLoading(true);
        setErrorData({} as ErrorData);

        const response = await postData(CHECK_PASSWORD_RECOVERY_TOKEN_PATH, {
          token: router.query.recoveryToken,
        });

        if (response.result === 'success') {
          setIsTokenChecked(true);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
  }, [router.query.recoveryToken]);

  const changePassword = useCallback(async () => {
    if (!loading) {
      try {
        setLoading(true);
        setErrorData({} as ErrorData);

        const response = await postData(UPDATE_PASSWORD_PATH, {
          newPassword,
          token: router.query.recoveryToken,
          source: 1,
        });

        if (response.result === 'success') {
          setIsPasswordChanged(true);
          setTimeout(() => router.push('/login'), 10000);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
  }, [newPassword, router.query.recoveryToken]);

  useEffect(() => {
    checkToken().catch((error) => console.log(error));
  }, [router.query.recoveryToken]);

  const handleClick = () => {
    if (newPassword === confirmPassword) {
      changePassword().catch((error) => console.log(error));
    } else {
      const data: ErrorData = {} as ErrorData;
      data.errorText = 'Passwords are different';
      setErrorData(data);
    }
  };

  const handleChangeNewPassword = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNewPassword(value);
  };

  const handleChangeConfirmPassword = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setConfirmPassword(value);
  };

  return (
    <main className={styles.section}>
      <Header />
      <div className={styles.content}>
        <div className={styles.title}>Forgot password</div>
        {loading && !isTokenChecked ? (
          <CircularProgress size={24} />
        ) : !isTokenChecked ? (
          <div className={styles.subTitle}>Wrong URL.</div>
        ) : isTokenChecked && !isPasswordChanged ? (
          <>
            <TextField
              className={styles.textField}
              value={newPassword}
              onChange={handleChangeNewPassword}
              label="New password"
              type="password"
            />
            <TextField
              className={styles.textField}
              value={confirmPassword}
              onChange={handleChangeConfirmPassword}
              label="Confirm new password"
              type="password"
            />
            <Collapse
              in={typeof errorData.errorText === 'string' && errorData.errorText.length > 0}
            >
              <div className={styles.errorTextMessage}>{errorData.errorText}</div>
            </Collapse>
            <ButtonProgressWrapper clickHandler={handleClick} loading={loading} buttonText="NEXT" />
          </>
        ) : (
          <div className={styles.subTitle}>
            Password updated successfully, you will be automatically redirected to login in 10
            seconds
          </div>
        )}
        <div className={styles.linksContainer}>
          <Link href="/login">
            <a className={styles.link}>Log in</a>
          </Link>
          <ThemeSwitcher colorType="dark" />
        </div>
      </div>
    </main>
  );
};

export default PasswordRecovery;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      section: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: theme.palette.background.paper,
      },
      content: {
        margin: '0 5px',
        padding: '16px',
        display: 'flex',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
        backgroundColor: theme.palette.background.paper,
      },
      linksContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '30px',
      },
      link: {
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '14px',
        whiteSpace: 'nowrap',
        marginBottom: '10px',
        lineHeight: 1.6,
        color: theme.palette.primary.main,
      },
      button: {
        background: theme.palette.primary.main,
        color: 'white',
      },
      title: {
        fontFamily: 'Montserrat, sans-serif',
        fontSize: '48px',
        marginBottom: '50px',
        color: theme.palette.common.black,
        textAlign: 'center',
      },
      subTitle: {
        fontFamily: 'Montserrat, sans-serif',
        fontSize: '16px',
        textAlign: 'center',
        marginBottom: '30px',
        color: theme.palette.common.black,
      },
      textField: {
        marginBottom: '30px',
        width: '300px',
      },
      errorTextMessage: {
        marginBottom: '30px',
        fontWeight: 500,
        color: theme.palette.custom.red,
      },
      '& .MuiCheckbox-root': {
        color: theme.palette.common.black,
        background: 'red',
      },
    }),
  { name: 'PasswordRecovery' },
);
