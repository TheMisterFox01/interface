import TableContainer from 'components/table/TableContainer';
import Table from 'components/table/Table';
import TableHead from 'components/table/TableHead';
import TableBody from 'components/table/TableBody';
import TableRow from 'components/table/TableRow';
import TableCell from 'components/table/TableCell';
import type { Ticket } from './Tickets';
import { useEffect, useState } from 'react';
import { datePrepare, getDaysAgo } from 'utils';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import Button from 'components/Button';

const TicketsTable = ({
  data,
  showDetails,
}: {
  data: Ticket[];
  showDetails: (ticketId: string | null) => void;
}) => {
  const styles = useStyles();

  const rowsPerPage = 10;
  const severities = ['normal', 'high', 'critical'];

  const [ticketsData, setTicketsData] = useState<Ticket[]>([]);
  const [page, setPage] = useState(0);
  const [rowsVisible, setRowsVisible] = useState(rowsPerPage);

  useEffect(() => {
    setTicketsData(data);
  }, [data]);

  useEffect(() => {
    setRowsVisible(page * rowsPerPage + rowsPerPage);
  }, [page]);

  return (
    <div className={styles.content}>
      <TableContainer isSmall={true} className={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={styles.tableCell}>Subject</TableCell>
              <TableCell className={styles.tableCell}>Last Reply</TableCell>
              <TableCell className={styles.tableCell}>Last Replied By</TableCell>
              <TableCell className={styles.tableCell}>Severity</TableCell>
              <TableCell className={styles.tableCell}>Status</TableCell>
              <TableCell className={styles.tableCell}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ticketsData.length > 0 &&
              ticketsData?.slice(0, rowsVisible).map((row, index) => {
                return (
                  <>
                    <TableRow key={index}>
                      <TableCell className={styles.tableCell} header="Subject">
                        <div className={styles.subject}>{row.title}</div>
                      </TableCell>
                      <TableCell
                        className={styles.tableCell + ' ' + styles.dateCell}
                        header="Last Reply"
                        valueToCopy={datePrepare(row.dateUpdated)}
                        wordBreak={true}
                      >
                        <div>{datePrepare(row.dateUpdated)}</div>
                        <div className={styles.subDate}>{getDaysAgo(row.dateUpdated)}</div>
                      </TableCell>
                      <TableCell
                        className={styles.tableCell + ' ' + styles.lastReplyBy}
                        header="Last Reply"
                        valueToCopy={datePrepare(row.dateUpdated)}
                        wordBreak={true}
                      >
                        <div className={row.lastReply == 'Bitsidy' ? styles.bitsidyReplied : ''}>
                          {row.lastReply == 'Bitsidy' ? 'Bitsidy' : 'You'}
                        </div>
                      </TableCell>
                      <TableCell
                        className={styles.tableCell + ' ' + styles.statusCell}
                        header="Severity"
                      >
                        <div className={`${styles.bubble} ${styles[severities[row.urgency]]}`}>
                          {severities[row.urgency]}
                        </div>
                      </TableCell>
                      <TableCell
                        className={styles.tableCell + ' ' + styles.statusCell}
                        header="Status"
                      >
                        <div
                          className={`${styles.bubble} ${
                            row.isActive ? styles.open : styles.close
                          }`}
                        >
                          {row.isActive ? 'open' : 'closed'}
                        </div>
                      </TableCell>
                      <TableCell className={styles.tableCell} header="Details">
                        <div
                          onClick={() => showDetails(row.ticketId)}
                          className={styles.link}
                          style={{ paddingTop: '5px' }}
                        >
                          <ReceiptOutlinedIcon className={styles.detailsButton} />
                        </div>
                      </TableCell>
                    </TableRow>
                  </>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      {rowsVisible < data.length && (
        <div className={styles.loadMoreButton}>
          <Button onClick={() => setPage(page + 1)}>LOAD MORE</Button>
        </div>
      )}
    </div>
  );
};

export default TicketsTable;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      loadMore: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
      },
      open: {
        background: theme.palette.custom.blue,
      },
      close: {
        background: theme.palette.custom.gray,
      },
      normal: {
        background: theme.palette.custom.blue,
      },
      high: {
        background: theme.palette.custom.yellow,
      },
      critical: {
        background: theme.palette.custom.red,
      },
      dateCell: {
        width: '240px',
        [theme.breakpoints.down('md')]: {
          width: 'initial',
        },
      },
      lastReplyBy: {
        width: '160px',
        [theme.breakpoints.down('md')]: {
          width: 'initial',
        },
      },
      bitsidyReplied: {
        color: theme.palette.custom.blue,
        fontWeight: 600,
      },
      subject: {
        textOverflow: 'ellipsis',
        width: '310px',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        [theme.breakpoints.down('md')]: {
          width: 'initial',
          whiteSpace: 'initial',
        },
      },
      content: {
        maxWidth: '1440px',
        width: '100%',
        marginBottom: '40px',
      },
      tableContainer: {
        background: theme.palette.background.default,
      },
      tableCell: {
        color: theme.palette.text.primary,
        paddingRight: '25px',
        paddingLeft: '25px',
        [theme.breakpoints.down('md')]: {
          paddingLeft: 'inherit',
          paddingRight: 'inherit',
        },
      },
      bubble: {
        fontFamily: 'Montserrat, sans-serif',
        borderRadius: '20px',
        padding: '8px 10px',
        textAlign: 'center',
        color: theme.palette.background.default,
        fontSize: '14px',
      },
      statusCell: {
        color: 'white !important',
        width: '130px',
        maxWidth: '130px',
        minWidth: '130px',
        boxSizing: 'content-box',
      },
      subDate: {
        fontSize: '14px',
        color: theme.palette.text.secondary,
      },
      link: {
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '14px',
        whiteSpace: 'nowrap',
        lineHeight: 1.6,
        color: theme.palette.primary.main,
        textDecoration: 'underline',
        cursor: 'pointer',
      },
      detailsButton: {
        paddingRight: '20px',
        color: theme.palette.primary.main,
      },
      loadMoreButton: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '30px',
      },
    }),
  { name: 'TicketsTable' },
);
