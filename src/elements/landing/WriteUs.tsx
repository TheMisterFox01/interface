import { useState, ChangeEvent, useCallback } from 'react';
import Image from 'next/image';

import Collapse from '@mui/material/Collapse';

import { createStyles, makeStyles } from '@material-ui/core/styles';

import LandingTitle from './LandingTitle';
import LandingSecondTitle from './LandingSecondTitle';
import TextField from 'components/TextField';
import ButtonProgressWrapper from 'elements/ButtonProgressWrapper';
import writeUsImg from 'public/writeUsImg.svg';

import { postData, LANDING_WRITEUS_PATH } from 'utils';

const WriteUs = (): JSX.Element => {
  const styles = useStyles();
  const [isSending, setIsSedning] = useState(false);
  const [isSended, setIsSended] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSend = useCallback(async () => {
    if (!isSending) {
      setIsSedning(true);
      setErrorMessage('');

      const response = await postData(
        LANDING_WRITEUS_PATH,
        {
          email,
          message,
        },
        false,
      );

      if (response.result === 'success') {
        setIsSended(true);
      } else {
        setErrorMessage(response.data.message);
      }

      setIsSedning(false);
    }
  }, [email, message]);

  const sendMessage = () => {
    handleSend().catch((error) => console.log(error));
  };

  const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEmail(value);
  };

  const handleChangeMessage = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setMessage(value);
  };

  return (
    <div className={styles.writeUs}>
      <div className={styles.imageContainer}>
        <div className={styles.image}>
          <Image width={444} height={330} src={writeUsImg} />
        </div>
      </div>
      <div className={styles.writeUsContent}>
        <LandingTitle text="Got Questions?" />
        {isSended ? (
          <LandingSecondTitle text="Your message has been sent." />
        ) : (
          <>
            <LandingSecondTitle text="We're Here to Help – Write to Us!" />
            <div className={styles.textFields}>
              <TextField
                className={styles.textField}
                label="Your email"
                onChange={handleChangeEmail}
                value={email}
              />
              <TextField
                rows={6}
                multiline
                className={styles.textField}
                label="Your message"
                onChange={handleChangeMessage}
                value={message}
              />
            </div>
            <Collapse in={errorMessage.length > 0}>
              <div className={styles.errorTextMessage}>{errorMessage}</div>
            </Collapse>
            <ButtonProgressWrapper
              clickHandler={sendMessage}
              loading={isSending}
              buttonText="SEND"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default WriteUs;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      writeUs: {
        background: theme.palette.background.default,
        display: 'flex',
        justifyContent: 'center',
        paddingBottom: '100px',
        [theme.breakpoints.down('md')]: {
          paddingBottom: '80px',
        },
      },
      writeUsContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '430px',
        maxHeight: '500px',
        width: '350px',
        [theme.breakpoints.down('sm')]: {
          width: '100%',
          padding: '0 10px',
          height: 'initial',
        },
      },
      imageContainer: {
        marginTop: '80px',
        width: '444px',
        position: 'relative',
        [theme.breakpoints.down('sm')]: {
          display: 'none',
        },
      },
      image: {
        position: 'absolute',
        marginLeft: '-110px',
      },
      textFields: {
        display: 'flex',
        flexDirection: 'column',
        [theme.breakpoints.down('sm')]: {
          width: '100%',
        },
      },
      textField: {
        width: '350px',
        marginBottom: '20px',
        [theme.breakpoints.down('sm')]: {
          width: '100%',
        },
      },
      errorTextMessage: {
        marginBottom: '30px',
        fontWeight: 500,
        color: theme.palette.custom.red,
      },
    }),
  { name: 'WriteUsSection' },
);
