import AccountTitle from 'elements/AccountTitle';
import { useEffect, useState } from 'react';
import { GET_ALL_TICKETS, postData } from 'utils';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Button from 'components/Button';
import { useRouter } from 'next/router';
import TicketsTable from './TicketsTable';
import CircularProgress from 'components/CircularProgress';

export type Ticket = {
  ticketId: string;
  title: string;
  dateCreated: string;
  dateUpdated: string;
  isActive: boolean;
  urgency: number;
  lastReply: string;
};

const Tickets = (): JSX.Element => {
  const styles = useStyles();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    if (!loaded) {
      getTickets();
    }
  });

  const getTickets = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem('bitsidyAccessToken') || '';
      let response = await postData(GET_ALL_TICKETS, {
        token,
      });

      setLoaded(true);
      if (response.result == 'success') {
        const ticketsUnsorted = (response?.data?.tickets as Ticket[]) ?? [];

        const sortFunc = (a: Ticket, b: Ticket) => (a.dateUpdated < b.dateUpdated ? 1 : -1);

        const ticketsClosed = ticketsUnsorted.filter((x) => x.isActive == false);
        const ticketsOpened = ticketsUnsorted.filter((x) => x.isActive == true);
        const ticketsCritical = ticketsOpened.filter((x) => x.urgency == 2);
        const ticketsHigh = ticketsOpened.filter((x) => x.urgency == 1);
        const ticketsNormal = ticketsOpened.filter((x) => x.urgency == 0);

        ticketsNormal.sort(sortFunc);
        const ticketsSorted = [
          ...ticketsCritical.sort(sortFunc),
          ...ticketsHigh.sort(sortFunc),
          ...ticketsNormal.sort(sortFunc),
          ...ticketsClosed.sort(sortFunc),
        ];
        setTickets(ticketsSorted);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenTicket = (ticketId: string | null = null) => {
    let query = {};
    if (ticketId != null && ticketId != '') {
      query['ticketId'] = ticketId;
    }
    router.push(
      {
        pathname: '/account/support/ticket',
        query,
      },
      undefined,
      { shallow: true },
    );
  };
  return (
    <div className={styles.main}>
      <AccountTitle title="Support" breadcrumbs="Tickets" />
      <div className={styles.openTicketContainer}>
        <Button variant="outlined" onClick={getTickets}>
          RELOAD
        </Button>
        <Button onClick={() => handleOpenTicket()}>CREATE NEW TICKET</Button>
      </div>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <CircularProgress size={48} />
        </div>
      ) : tickets.length > 0 ? (
        <TicketsTable data={tickets} showDetails={handleOpenTicket} />
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Tickets;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
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
        marginBottom: '30px',
        '& > *:not(:last-child)': {
          marginRight: '20px',
        },
      },
      loadingContainer: {
        width: '100%',
        height: '150px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
    }),
  { name: 'Tickets' },
);
