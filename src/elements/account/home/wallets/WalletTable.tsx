import { Dispatch, SetStateAction } from 'react';

import TableContainer from 'components/table/TableContainer';
import Table from 'components/table/Table';
import TableBody from 'components/table/TableBody';

import { createStyles, makeStyles } from '@material-ui/core/styles';

import { WalletRow } from 'elements/account/home/Home';
import WalletTableRow from './WalletRow';
import TableHead from 'components/table/TableHead';
import TableRow from 'components/table/TableRow';
import TableCell from 'components/table/TableCell';

import SortIcon from '@mui/icons-material/Sort';
import { SubUser } from 'utils/subUsers';

type WalletTableProps = {
  walletsData: WalletRow[];
  setOpenSendDialog: Dispatch<SetStateAction<boolean>>;
  showDetailsDialog: () => void;
  setCurrentWalletRow: Dispatch<SetStateAction<WalletRow>>;
  sortData: (column: string) => void;
  editSubUser: (subUser: SubUser) => void;
};

const WalletTable = (props: WalletTableProps): JSX.Element => {
  const {
    walletsData,
    setOpenSendDialog,
    showDetailsDialog,
    setCurrentWalletRow,
    sortData,
    editSubUser,
  } = props;

  const styles = useStyles();

  return (
    <div className={styles.content}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={styles.tableCell}>
                <div className={styles.headSorting}>
                  Currency{' '}
                  <SortIcon
                    fontSize="small"
                    className={styles.sortingIcon}
                    onClick={() => sortData('currency')}
                  />
                </div>
              </TableCell>
              <TableCell className={styles.tableCell}>Account</TableCell>
              <TableCell className={styles.tableCell}>
                <div className={styles.headSorting}>
                  Available amount
                  <SortIcon
                    fontSize="small"
                    className={styles.sortingIcon}
                    onClick={() => sortData('amount')}
                  />
                </div>
              </TableCell>
              <TableCell className={styles.tableCell}>Market</TableCell>
              <TableCell className={styles.tableCell}></TableCell>
              <TableCell className={styles.tableCell}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody plates={false}>
            {walletsData.map((row) => {
              return (
                <WalletTableRow
                  walletRow={row}
                  setOpenSendDialog={setOpenSendDialog}
                  showDetailsDialog={showDetailsDialog}
                  setCurrentWalletRow={setCurrentWalletRow}
                  editSubUser={editSubUser}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default WalletTable;

const useStyles = () => {
  const styles = makeStyles(
    () =>
      createStyles({
        sortingIcon: {
          marginLeft: '10px',
          cursor: 'pointer',
        },
        headSorting: {
          display: 'flex',
          alignItems: 'center',
        },
        content: {
          overflow: 'hidden',
        },
        tableCell: {},
        rowSpacer: {
          height: '10px',
        },
      }),
    { name: 'WalletTable' },
  );
  return styles();
};
