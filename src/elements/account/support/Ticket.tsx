import AccountTitle from 'elements/AccountTitle';
import { useEffect, useState } from 'react';
import {
  CLOSE_TICKET,
  CREATE_TICKET,
  CREATE_TICKET_MESSAGE,
  GET_ALL_TICKET_MESSAGES,
  datePrepare,
  postData,
} from 'utils';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import AccountBackTitle from 'elements/AccountBackTitle';
import TextField from 'components/TextField';
import { useRouter } from 'next/router';
import CircularProgress from 'components/CircularProgress';
import ButtonProgressWrapper from 'elements/ButtonProgressWrapper';
import Button from 'components/Button';

const severities = ['normal', 'high', 'critical'];

type ErrorData = {
  amount: boolean;
  errorText: string;
};

type Message = {
  name: string;
  message: string;
  dateCreated: string;
};

const Ticket = (): JSX.Element => {
  const styles = useStyles();
  const router = useRouter();
  const ticketId = router.query.ticketId as string;

  const [pageTitle, setPageTitle] = useState('');
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketSeverity, setTicketSeverity] = useState(0);
  const [ticketMessage, setTicketMessage] = useState('');
  const [errorData, setErrorData] = useState({} as ErrorData);
  const [messages, setMessages] = useState([] as Message[]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMessagesSending, setIsMessageSending] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      getTicket();
    }
  });

  const getTicket = async () => {
    setIsLoading(true);

    try {
      if (ticketId == null) {
        setPageTitle('New invoice');
        return;
      }

      const token = localStorage.getItem('bitsidyAccessToken') || '';
      let response = await postData(GET_ALL_TICKET_MESSAGES, {
        token,
        ticketId,
      });

      setIsLoaded(true);
      if (response.result == 'success') {
        const title = response?.data?.title ?? 'ticket';
        if (title.length) {
          setPageTitle(title[0].toUpperCase() + title.slice(1));
        } else {
          setPageTitle('Ticket');
        }
        setMessages(response?.data?.messages.reverse() ?? []);
      }
    } finally {
      setIsLoading(false);
      setIsMessageSending(false);
    }
  };

  const handleTicketAction = async (close: boolean = false) => {
    setIsMessageSending(true);
    try {
      const data: ErrorData = {} as ErrorData;
      data.errorText = '';
      setErrorData(data);

      const token = localStorage.getItem('bitsidyAccessToken') || '';
      let path;
      let body;

      if (ticketId == null) {
        path = CREATE_TICKET;
        if (ticketMessage === '') {
          const data: ErrorData = {} as ErrorData;
          data.errorText = 'Fill message field';
          setErrorData(data);
          return;
        }
        body = {
          token,
          title: ticketTitle,
          message: ticketMessage,
          ticketUrgency: ticketSeverity,
        };
      } else if (close === true) {
        path = CLOSE_TICKET;
        body = {
          token,
          ticketId,
        };
      } else {
        path = CREATE_TICKET_MESSAGE;
        if (ticketMessage === '') {
          const data: ErrorData = {} as ErrorData;
          data.errorText = 'Fill message field';
          setErrorData(data);
          return;
        }
        body = {
          token,
          ticketId,
          message: ticketMessage,
        };
      }

      let response = await postData(path, body);
      if (response.result === 'success') {
        if (ticketId == null || close == true) {
          router.push(
            {
              pathname: '/account/support',
            },
            undefined,
            { shallow: true },
          );
        } else {
          getTicket();
        }
      } else {
        const data: ErrorData = {} as ErrorData;
        data.errorText = response.data.message;
        setErrorData(data);
      }
    } finally {
      setIsMessageSending(false);
    }
  };

  return (
    <div className={styles.main}>
      <AccountTitle
        title="Support"
        breadcrumbs={ticketId === null ? 'New ticket' : 'Ticket ' + ticketId}
      />
      <AccountBackTitle
        title={pageTitle}
        subTitle=""
        pathname="support"
        query=""
        isLoading={isLoading}
      />
      {(ticketId == null || ticketId == undefined) && (
        <div className={`${styles.row} ${styles.spacing}`}>
          <TextField
            label="Title"
            value={ticketTitle}
            onChange={(e) => setTicketTitle(e.target.value)}
            className={styles.title}
          />
          <TextField
            label="Severity"
            value={ticketSeverity}
            className={styles.severity}
            select
            onChange={(e) => setTicketSeverity(e.target.value)}
            children={Object.keys(severities).map((key) => (
              <option key={key} value={key}>
                {severities[key]}
              </option>
            ))}
          />
        </div>
      )}
      <div className={styles.spacing}>
        <TextField
          label="Your message"
          value={ticketMessage}
          multiline
          onChange={(e) => setTicketMessage(e.target.value)}
        />
      </div>
      <div className={`${styles.row} ${styles.spacing}`}>
        {ticketId == null ? (
          <ButtonProgressWrapper
            clickHandler={() => handleTicketAction()}
            className={styles.rightMargin}
            loading={isMessagesSending}
            buttonText="OPEN TICKET"
          />
        ) : !isMessagesSending ? (
          <>
            <Button
              variant="outlined"
              onClick={() => handleTicketAction(true)}
              className={styles.rightMargin}
            >
              CLOSE TICKET
            </Button>
            <Button onClick={() => handleTicketAction()} className={styles.rightMargin}>
              REPLY
            </Button>
          </>
        ) : (
          <CircularProgress size={24} />
        )}
        {typeof errorData.errorText === 'string' && errorData.errorText.length > 0 && (
          <div className={styles.errorTextMessage}>{errorData.errorText}</div>
        )}
      </div>
      <div className={styles.messages}>
        {isLoading ? (
          <CircularProgress size={48} />
        ) : (
          messages?.map((row) => {
            return (
              <div className={styles.message}>
                <div className={styles.messageTopRow}>
                  <div
                    className={row.name === 'Bitsidy' ? styles.adminMessage : styles.userMessage}
                  >
                    {row.name}
                  </div>
                  <div className={styles.date}>{datePrepare(row.dateCreated)}</div>
                </div>
                <div className={styles.messageText}>{row.message}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Ticket;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      adminMessage: {
        fontWeight: 500,
        color: theme.palette.custom.blue,
      },
      userMessage: {
        fontWeight: 500,
      },
      date: {
        fontSize: '14px',
        color: theme.palette.custom.gray,
        [theme.breakpoints.down('md')]: {
          marginTop: '10px',
        },
      },
      messages: {
        marginTop: '30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: theme.palette.text.primary,
      },
      message: {
        marginBottom: '30px',
        width: '100%',
      },
      messageText: {
        whiteSpace: 'pre-line',
      },
      messageTopRow: {
        marginBottom: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        [theme.breakpoints.down('md')]: {
          flexDirection: 'column',
        },
      },
      main: {
        background: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        padding: '0 10px',
        [theme.breakpoints.up('lg')]: {
          width: '1200px',
          padding: '0 25px',
        },
        [theme.breakpoints.up('xl')]: {
          padding: '0 65px',
        },
        [theme.breakpoints.down('md')]: {
          boxSizing: 'border-box',
        },
      },
      openTicketContainer: {
        display: 'flex',
        alignItems: 'baseline',
      },
      row: {
        display: 'flex',
        alignItems: 'center',
      },
      spacing: {
        marginBottom: '20px',
      },
      title: {
        marginRight: '20px',
        width: '100%',
      },
      severity: {
        width: '300px',
      },
      errorTextMessage: {
        fontWeight: 500,
        color: theme.palette.custom.red,
        textAlign: 'center',
      },
      rightMargin: {
        marginRight: '20px',
      },
    }),
  { name: 'Ticket' },
);
