import { ChangeEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import type { NextPage } from 'next';
import Head from 'next/head';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import Collapse from '@mui/material/Collapse';

import ThemeSwitcher from '../elements/ThemeSwitcher';
import Header from '../elements/Header';
import ButtonProgressWrapper from '../elements/ButtonProgressWrapper';
import TextField from '../components/TextField';
import { postData, LOGIN_PATH } from '../utils';
import { MultiFactorAuth } from '../components/MultiFactorAuth';

import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import store from '../store/store';

type ErrorData = {
  email: boolean;
  password: boolean;
  errorText: string;
};

const LogIn: NextPage = () => {
  const styles = useStyles();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorData, setErrorData] = useState({} as ErrorData);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [preparedFactors, setPreparedFactors] = useState<{ [index: string]: string }>({});
  const [factorsCodes, setFactorsCodes] = useState<{ [index: string]: string }>({});
  const [isMultiFactorModalOpened, setIsMultiFactorModalOpened] = useState(false);
  const [multiFactorMessage, setMultiFactorMessage] = useState('');
  const [continueActionCounter, setContinueActionCounter] = useState(0);

  /*const getAuthenticate = useCallback(async () => {
    const token = localStorage.getItem('bitsidyAccessToken') || '';

    const response = await postData(GET_AUTHENTICATED_PATH, {
      token,
    });

    if (response.result === 'success') {
      router.push('/account');
    }
  }, []);

  useEffect(() => {
    getAuthenticate().catch((error) => console.log(error));
  }, []);*/

  const handleLogin = async () => {
    if (!loading) {
      try {
        setLoading(true);
        setErrorData({} as ErrorData);

        let body = {
          email: email.trim(),
          password: password.trim(),
        };
        if (Object.keys(factorsCodes).length != 0) {
          body['factors'] = factorsCodes;
        }

        const response = await postData(LOGIN_PATH, body);

        if (response.result === 'success') {
          if ('isFactorsSent' in response.data && response.data['isFactorsSent'] == true) {
            let factors = response.data.requiredFactors;
            let additionalInfo = response.data.additionalInformation;
            let preparedFactors = {};
            for (let i = 0; i < factors.length; ++i) {
              preparedFactors[factors[i]] = additionalInfo[factors[i]] ?? '';
            }
            setPreparedFactors(preparedFactors);
            setMultiFactorMessage(response.data.message);
            setIsMultiFactorModalOpened(true);
          } else if ('message' in response.data && response.data['message'] != '') {
            setPreparedFactors({});
            setFactorsCodes({});
            setMultiFactorMessage('');
            const data: ErrorData = {} as ErrorData;
            data.errorText = response.data['message'];
            setErrorData(data);
          } else {
            const data = response.data;
            store.clear();
            localStorage.setItem('bitsidyAccessToken', data.token);
            router.push('/account');
          }
        } else if (response.result === 'error') {
          const error = response.data;
          const data: ErrorData = {} as ErrorData;
          data.errorText = error.message;

          switch (error.argument) {
            case 'email':
              data.email = true;
              break;
            case 'password':
              data.password = true;
              break;
            case 'email/password':
              data.email = true;
              data.password = true;
              break;
          }

          setErrorData(data);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (email.trim() !== '' && password.trim() !== '') {
      handleLogin();
    }
  }, [continueActionCounter]);

  const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEmail(value);
  };

  const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPassword(value);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <main className={styles.section}>
      <Head>
        <title>Login</title>
      </Head>
      <Header />
      <div className={`${styles.content}`}>
        <div className={styles.title}>Log In</div>
        <TextField
          className={styles.textField}
          value={email}
          onChange={handleChangeEmail}
          label="Email"
          autocomplete="username"
          type="email"
          error={errorData.email === true}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              handleLogin();
            }
          }}
        />
        <TextField
          className={styles.textField}
          value={password}
          onChange={handleChangePassword}
          label="Password"
          type={isPasswordVisible ? 'text' : 'password'}
          error={errorData.password === true}
          endAdornment={
            isPasswordVisible ? (
              <VisibilityOffIcon onClick={togglePasswordVisibility} />
            ) : (
              <RemoveRedEyeIcon onClick={togglePasswordVisibility} />
            )
          }
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              handleLogin();
            }
          }}
        />
        <Collapse in={typeof errorData.errorText === 'string' && errorData.errorText.length > 0}>
          <div className={styles.errorTextMessage}>{errorData.errorText}</div>
        </Collapse>
        <ButtonProgressWrapper clickHandler={handleLogin} loading={loading} buttonText="LOG IN" />
        <div className={styles.linksContainer}>
          <Link href="/signup">
            <a className={styles.link}>Create account</a>
          </Link>
          <Link href="/forgot_password">
            <a className={styles.link}>Forgot password?</a>
          </Link>
          <ThemeSwitcher colorType="dark" />
        </div>
      </div>
    </main>
  );
};

export default LogIn;

const useStyles = makeStyles((theme) =>
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
      lineHeight: '140%',
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
      marginBottom: '30px !important',
      width: '300px',
    },
    errorTextMessage: {
      marginBottom: '30px',
      fontWeight: 500,
    },
    agreement: {
      marginBottom: '30px',
      color: theme.palette.common.black,
    },
    hidden: {
      opacity: 0,
    },
  }),
);
