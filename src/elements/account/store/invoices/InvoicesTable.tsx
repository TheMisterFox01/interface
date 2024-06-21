import { useState } from 'react';

import Link from '@material-ui/core/Link';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import TablePagination from '@mui/material/TablePagination';

import TableContainer from 'components/table/TableContainer';
import Table from 'components/table/Table';
import TableHead from 'components/table/TableHead';
import TableBody from 'components/table/TableBody';
import TableRow from 'components/table/TableRow';
import TableCell from 'components/table/TableCell';

import { createStyles, makeStyles } from '@material-ui/core/styles';

import { INVOICE_SEVERITIES, datePrepare } from 'utils';

type TableProps = {
  invoiceData: InvoiceData[];
  storeId: string;
  storeName: string;
};

type InvoiceData = {
  currency: string;
  hashList: string[] | null;
  invoice: {
    amount: number;
    amountUsd: number;
    callbackFail: string;
    callbackNotify: string;
    callbackSuccess: string;
    customString: string;
    date: string;
    dateUpdated: string;
    email: string;
    expiration: number;
    extendedExpiration: number;
    invoiceId: string;
  };
  status: string;
};

interface RowData {
  currency: string;
  invoiceId: string;
  email: string;
  callbackSuccess: string;
  callbackNotify: string;
  callbackFail: string;
  amount: string;
  amountUsd: string;
  customString: string;
  hashList: string[];
  expiration: string;
  extendedExpiration: string;
  date: string;
  dateUpdated: string;
  status: string;
  details: string;
}

const currencies = [
  {
    value: 'invoiceId',
    label: 'Invoice',
  },
  {
    value: 'email',
    label: 'Email',
  },
  {
    value: 'amount',
    label: 'Amount',
  },
  {
    value: 'amountUsd',
    label: '$Amount',
  },
  {
    value: 'status',
    label: 'Status',
  },
  {
    value: 'date',
    label: 'Date created',
  },
  {
    value: 'details',
    label: '',
  },
];

const createRowData = (data: InvoiceData[]): RowData[] =>
  data?.map((invoice) => {
    const {
      currency,
      hashList,
      invoice: {
        amount,
        amountUsd,
        callbackFail,
        callbackNotify,
        callbackSuccess,
        customString,
        date,
        dateUpdated,
        email,
        expiration,
        extendedExpiration,
        invoiceId,
      },
      status,
    } = invoice;

    const splitAmount = String(amount).split('.');
    const decimalPart = splitAmount[1] ? `.${splitAmount[1].slice(0, 8)}` : '';
    const fixedAmount = `${splitAmount[0]}${decimalPart}`;

    return {
      currency,
      invoiceId,
      email,
      callbackSuccess,
      callbackNotify,
      callbackFail,
      amount: `${fixedAmount} ${currency}`,
      amountUsd: `$${amountUsd}`,
      customString,
      hashList: hashList ? hashList : [],
      expiration: `${expiration}`,
      extendedExpiration: `${extendedExpiration}`,
      date,
      dateUpdated,
      status,
      details: invoiceId,
    };
  });

const InvoicesTable = ({ invoiceData, storeId, storeName }: TableProps): JSX.Element => {
  const styles = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getInvoiceUrl = (value: string) => {
    const data = {
      storeId,
      storeName,
      invoiceId: value,
    };
    const query = new URLSearchParams(data);
    return `invoices/invoice?` + query.toString();
  };

  const getDetailsCell = (
    key: string,
    value: string,
    header: string,
    valueToCopy: string,
    cellClass: string,
  ) => (
    <TableCell
      key={key}
      className={styles.tableCell + ' ' + cellClass}
      header={header}
      valueToCopy={valueToCopy}
    >
      <Link href={getInvoiceUrl(value)} target="_blank" rel="noreferrer">
        <ReceiptOutlinedIcon className={styles.detailsButton} />
      </Link>
    </TableCell>
  );

  const getCommonCell = (
    key: string,
    value: string,
    header: string,
    valueToCopy: string,
    cellClass: string,
  ) => (
    <TableCell
      key={key}
      className={styles.tableCell + ' ' + cellClass}
      header={header}
      valueToCopy={valueToCopy}
    >
      <div>{value}</div>
    </TableCell>
  );

  const getStatusCell = (key: string, value: string, severity: string, cellClass: string) => (
    <TableCell key={key} className={styles.tableCell + ' ' + cellClass}>
      <div className={`${styles.status} ${styles[severity]}`}>{value}</div>
    </TableCell>
  );

  const getInvoiceCell = (
    key: string,
    value: string,
    header: string,
    valueToCopy: string,
    cellClass: string,
  ) => (
    <TableCell key={key} className={styles.tableCell} header={header} valueToCopy={valueToCopy}>
      <div>
        <Link
          className={styles.explorerLink + ' ' + cellClass}
          href={`https://bitsidy.com/invoice/${value}`}
          target="_blank"
          rel="noreferrer"
        >
          {value}
        </Link>
      </div>
    </TableCell>
  );

  const rowsData = createRowData(invoiceData);

  return (
    <div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={styles.tableCell}>Invoice</TableCell>
              <TableCell className={styles.tableCell}>Email</TableCell>
              <TableCell className={styles.tableCell}>Amount</TableCell>
              <TableCell className={styles.tableCell}>USD Amount</TableCell>
              <TableCell className={styles.tableCell}>Status</TableCell>
              <TableCell className={styles.tableCell}>Date created</TableCell>
              <TableCell className={styles.tableCell}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rowsData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow key={row.invoiceId + index}>
                  {currencies.map(({ value }) => {
                    const content = row[value];
                    const key = row.invoiceId + value;
                    switch (value) {
                      case 'invoiceId':
                        return getInvoiceCell(key, content, 'Invoice Id', content, styles.breakAll);
                      case 'email':
                        return getCommonCell(key, content, 'Email', content, '');
                      case 'amount':
                        return getCommonCell(key, content, 'Amount', content, '');
                      case 'amountUsd':
                        return getCommonCell(key, content, 'USD Amount', content, '');
                      case 'status':
                        return getStatusCell(key, content, INVOICE_SEVERITIES[content], '');
                      case 'date':
                        return getCommonCell(key, datePrepare(content), 'Date', content, '');
                      case 'details':
                        return getDetailsCell(key, content, 'Details', '', '');
                    }
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        className={styles.colorText}
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        colSpan={3}
        count={rowsData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default InvoicesTable;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      breakAll: {
        wordBreak: 'break-all',
      },
      colorText: {
        color: theme.palette.text.primary,
        '& .MuiTablePagination-selectIcon': { color: theme.palette.text.primary },
        '& .MuiIconButton-root': { color: theme.palette.text.primary },
        '& .MuiIconButton-root.Mui-disabled': { color: '#8e8e8e' },
      },
      tableCell: {
        color: theme.palette.text.primary,
      },
      explorerLink: {
        color: theme.palette.primary.main,
      },
      status: {
        fontFamily: 'Montserrat, sans-serif',
        borderRadius: '20px',
        padding: '8px 2px',
        width: '100px',
        textAlign: 'center',
        fontSize: '13px',
        color: theme.palette.common.white,
      },
      trimmedCell: {
        textOverflow: 'ellipsis',
        display: 'block',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      },
      green: { background: theme.palette.custom.green },
      yellow: { background: theme.palette.custom.yellow },
      gray: { background: theme.palette.custom.gray },
      red: { background: theme.palette.custom.red },
      detailsButton: {
        padding: '0px',
        color: theme.palette.primary.main,
      },
    }),
  { name: 'InvoiceTable' },
);
