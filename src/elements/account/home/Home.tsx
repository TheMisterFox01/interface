import { useCallback, useState, useEffect } from 'react';
import Link from 'next/link';

import CircularProgress from 'components/CircularProgress';
import Button from 'components/Button';

import { createStyles, makeStyles } from '@material-ui/core/styles';

import SendDialog from './dialogs/send/SendDialog';
import ReceiveDialog from './dialogs/ReceiveDialog';
import WalletTable from './wallets/WalletTable';
import TransactionsHistoryTable from './history/TransactionsHistoryTable';
import AccountTitle from 'elements/AccountTitle';
import AccountSecondTitle from 'elements/AccountSecondTitle';
import {
  postData,
  GET_ALL_WALLETS_BALANCE_PATH,
  GET_ALL_WALLET_STATUS_PATH,
  getToken,
} from 'utils';

import store from 'store/store';
import FreezeDialog from './dialogs/FreezeDialog';
import DetailsDialog from './dialogs/DetailsDialog';
import { SubUser, getSubUsers } from 'utils/subUsers';
import WalletsBundleDialog from './dialogs/WalletsBundleDialog';

type PriceStats = {
  weekCurrencyAmountChangeInPercents: number | null;
  dayCurrencyAmountChangeInPercents: number | null;
};

type PriceDynamics = {
  date: string;
  averagePrice: number;
};

type PriceDynamicsWithTimestamp = {
  timestamp: number;
  averagePrice: number;
};

type WalletsDataAll = {
  currencies: WalletData[];
  subUserId: string;
  totalAvailableUsd: number;
};

type WalletData = {
  availableAmount: number;
  availableAmountUsd: number;
  lockedAmount: number;
  lockedAmountUsd: number;
  currentPrice: number;
  currency: {
    fullName: string;
    internalName: string;
    name: string;
    shortName: string;
  };
  priceDynamics: PriceDynamics[];
  availableEnergyAmount?: number;
  availableBandwidthAmount?: number;
  totalEnergyAmount?: number;
  totalBandwidthAmount?: number;
  subUser: SubUser | null;
};

export type WalletRow = {
  fullName: string;
  availableAmount: number;
  availableAmountUsd: number;
  name: string;
  shortName: string;
  lockedAmount: number;
  lockedAmountUsd: number;
  priceDynamics: PriceDynamicsWithTimestamp[];
  priceStats: PriceStats;
  currentPrice: number;
  availableEnergyAmount?: number;
  availableBandwidthAmount?: number;
  totalEnergyAmount?: number;
  totalBandwidthAmount?: number;
  subUser?: SubUser | null;
};

export type Wallet = {
  isActive: boolean;
  currency: Currency;
};

export type Currency = {
  internalName: string;
  name: string;
  shortName: string;
};

export type CurrencyPrice = {
  currentPrice: number;
  currency: Currency;
};

const Home = (): JSX.Element => {
  const styles = useStyles();

  const [openSendDialog, setOpenSendDialog] = useState(false);
  const [openReceiveDialog, setOpenReceiveDialog] = useState(false);
  const [openFreezeDialog, setOpenFreezeDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const [walletsData, setWalletsData] = useState<WalletData[]>([]);
  const [isWalletLoading, setIsWalletLoading] = useState(true);

  const [currentWalletRow, setCurrentWalletRow] = useState({} as WalletRow);
  const [isUnfreeze, setIsUnfreeze] = useState(false);

  const [isPageReloaded, setIsPageReloaded] = useState(false);
  const [showWalletSuggestion, setShowWalletSuggestion] = useState(false);

  const [currencyPrices, setCurrencyPrices] = useState<CurrencyPrice[]>([]);

  const [openWalletsBundleDialog, setOpenWalletBundleDialog] = useState(false);
  const [currentDialogBundle, setCurrentDialogBundle] = useState<null | SubUser>(null);

  const editSubUser = (subUser: SubUser) => {
    setCurrentDialogBundle(subUser);
    setOpenWalletBundleDialog(true);
  };

  const addSubUser = () => {
    setCurrentDialogBundle(null);
    setOpenWalletBundleDialog(true);
  };

  const getAllWalletStatus = useCallback(async () => {
    const token = localStorage.getItem('bitsidyAccessToken') || '';

    const response = await postData(GET_ALL_WALLET_STATUS_PATH, {
      token,
    });

    const wallets = response.data as Wallet[];
    wallets.forEach((x) => {
      if (x.isActive === false) {
        setShowWalletSuggestion(true);
      }
    });
  }, []);

  const getWalletsBalance = async () => {
    setIsWalletLoading(true);
    store.setBalance(0);

    const token = await getToken();
    const response = await postData(GET_ALL_WALLETS_BALANCE_PATH, {
      token,
    });

    let aggregatedWalletsData: WalletData[] = [];

    if (response.result === 'success') {
      const subUsers = await getSubUsers();
      const data: WalletsDataAll[] = response.data;
      let walletDataCurrencies: WalletData[];
      let totalAvailableUsd = 0;
      let subUser: SubUser | null = null;

      for (let i = 0; i < data.length; ++i) {
        subUser = null;
        const subUserFiltered = subUsers.filter((x) => x.subUserId === data[i].subUserId);
        if (subUserFiltered.length == 1) {
          subUser = subUserFiltered[0];
        }
        walletDataCurrencies = data[i].currencies;
        walletDataCurrencies.forEach((x) => (x.subUser = subUser));
        aggregatedWalletsData = [...aggregatedWalletsData, ...walletDataCurrencies];
        totalAvailableUsd += data[i].totalAvailableUsd;
      }

      store.setBalance(totalAvailableUsd);

      setCurrencyPrices(
        aggregatedWalletsData.map((row) => {
          return {
            currentPrice: row.currentPrice,
            currency: row.currency,
          } as CurrencyPrice;
        }),
      );

      if (Object.keys(currentWalletRow).length > 0) {
        const preparedData = getTableData(aggregatedWalletsData);
        const currentWallet = preparedData.find((row) => row.name == currentWalletRow.name);
        if (currentWallet != undefined) {
          setCurrentWalletRow(currentWallet);
        }
      }
    }

    aggregatedWalletsData = aggregatedWalletsData.sort((x, y) =>
      x.availableAmountUsd < y.availableAmountUsd ? 1 : -1,
    );
    setWalletsData(aggregatedWalletsData);

    setIsWalletLoading(false);
  };

  useEffect(() => {
    getWalletsBalance().catch((error) => console.log(error));
    getAllWalletStatus().catch((error) => console.log(error));
    return () => {
      setWalletsData([]);
    };
  }, []);

  const preparePriceDynamicsTimestamps = (
    priceDynamics: PriceDynamics[] | null,
  ): PriceDynamicsWithTimestamp[] => {
    if (priceDynamics == null) {
      return [] as PriceDynamicsWithTimestamp[];
    }

    let preparedData: PriceDynamicsWithTimestamp[] = priceDynamics.map((row) => {
      let preparedRow: PriceDynamicsWithTimestamp = {} as PriceDynamicsWithTimestamp;
      let dateRaw: string[] = row.date.split('T');
      let dateParts: string[] = dateRaw[0].split('-');
      let date = new Date(
        parseInt(dateParts[0]),
        parseInt(dateParts[1], 10) - 1,
        parseInt(dateParts[2]),
        0,
        0,
        0,
      );

      preparedRow.averagePrice = row.averagePrice;
      preparedRow.timestamp = date.getTime();

      return preparedRow;
    });

    preparedData.sort((a: PriceDynamicsWithTimestamp, b: PriceDynamicsWithTimestamp) =>
      a.timestamp > b.timestamp ? 1 : -1,
    );

    return preparedData;
  };

  const getPriceStats = (preparedPriceDynamics: PriceDynamicsWithTimestamp[]): PriceStats => {
    if (preparedPriceDynamics.length > 7) {
      preparedPriceDynamics = preparedPriceDynamics.slice(preparedPriceDynamics.length - 7);
    }

    const priceStats = {
      dayCurrencyAmountChangeInPercents: null,
      weekCurrencyAmountChangeInPercents: null,
    } as PriceStats;

    let weekCurrencyAmountChangeInPercents: number | null = null;
    if (preparedPriceDynamics.length === 7) {
      weekCurrencyAmountChangeInPercents =
        (preparedPriceDynamics[preparedPriceDynamics.length - 1].averagePrice * 100) /
        preparedPriceDynamics[0].averagePrice;
    }

    let dayCurrencyAmountChangeInPercents: number | null = null;
    if (preparedPriceDynamics.length > 1) {
      dayCurrencyAmountChangeInPercents =
        (preparedPriceDynamics[preparedPriceDynamics.length - 1].averagePrice * 100) /
        preparedPriceDynamics[preparedPriceDynamics.length - 2].averagePrice;
    }

    if (dayCurrencyAmountChangeInPercents === null) {
      priceStats.dayCurrencyAmountChangeInPercents = dayCurrencyAmountChangeInPercents;
    } else {
      if (isNaN(dayCurrencyAmountChangeInPercents)) {
        priceStats.dayCurrencyAmountChangeInPercents = null;
      } else {
        priceStats.dayCurrencyAmountChangeInPercents = dayCurrencyAmountChangeInPercents - 100;
      }
    }

    if (weekCurrencyAmountChangeInPercents === null) {
      priceStats.weekCurrencyAmountChangeInPercents = weekCurrencyAmountChangeInPercents;
    } else {
      if (isNaN(weekCurrencyAmountChangeInPercents)) {
        priceStats.weekCurrencyAmountChangeInPercents = null;
      } else {
        priceStats.weekCurrencyAmountChangeInPercents = weekCurrencyAmountChangeInPercents - 100;
      }
    }

    return priceStats;
  };

  const getTableData = (data: WalletData[]) => {
    const preparedWalletData: WalletRow[] = [];

    data?.map(
      ({
        availableAmount,
        availableAmountUsd,
        lockedAmount,
        lockedAmountUsd,
        currency,
        priceDynamics,
        currentPrice,
        availableEnergyAmount,
        availableBandwidthAmount,
        totalEnergyAmount,
        totalBandwidthAmount,
        subUser,
      }) => {
        const preparedPriceDynamics = preparePriceDynamicsTimestamps(priceDynamics);
        const priceStats = getPriceStats(preparedPriceDynamics);

        const temp = {
          key: currency.internalName,
          availableAmount: availableAmount,
          availableAmountUsd: availableAmountUsd,
          fullName: currency.name,
          name: currency.internalName,
          shortName: currency.shortName,
          lockedAmount: lockedAmount,
          lockedAmountUsd: lockedAmountUsd,
          priceDynamics: preparedPriceDynamics,
          priceStats: priceStats,
          currentPrice: currentPrice,
          availableEnergyAmount,
          availableBandwidthAmount,
          totalEnergyAmount,
          totalBandwidthAmount,
          subUser,
        };
        preparedWalletData.push(temp);
      },
    );
    return preparedWalletData;
  };

  const pageSoftReload = () => {
    setIsPageReloaded(!isPageReloaded);
    getWalletsBalance().catch((error) => console.log(error));
  };

  const reloadPage = () => {
    pageSoftReload();
  };

  const sortWalletsData = (column: string) => {
    switch (column) {
      case 'amount':
        setWalletsData(
          [...walletsData].sort((x, y) =>
            x.availableAmountUsd == y.availableAmountUsd
              ? 0
              : x.availableAmountUsd < y.availableAmountUsd
              ? 1
              : -1,
          ),
        );
        break;
      case 'currency':
        setWalletsData(
          [...walletsData].sort((x, y) => {
            if (x.currency.shortName == y.currency.shortName) {
              if (x.currency.internalName.length == y.currency.internalName.length) {
                if (x.availableAmountUsd == y.availableAmountUsd) {
                  return 0;
                } else {
                  if (x.availableAmountUsd < y.availableAmountUsd) {
                    return 1;
                  } else {
                    return -1;
                  }
                }
              }
              if (x.currency.internalName.length < y.currency.internalName.length) {
                return -1;
              } else {
                return 1;
              }
            }
            if (x.currency.shortName < y.currency.shortName) {
              return -1;
            } else {
              return 1;
            }
          }),
        );
        break;
    }
  };

  return (
    <div className={styles.content}>
      <AccountTitle title="Home" breadcrumbs="Wallets" />
      <div className={styles.topRow}>
        {isWalletLoading == false && (
          <div className={styles.topButtonsContainer}>
            <Button
              className={styles.reloadButton}
              variant="outlined"
              onClick={pageSoftReload}
              disabled={isWalletLoading}
            >
              RELOAD
            </Button>
            <Button
              className={styles.reloadButton}
              variant="outlined"
              onClick={addSubUser}
              disabled={isWalletLoading}
            >
              ADD ACCOUNT
            </Button>
          </div>
        )}
      </div>
      {isWalletLoading ? (
        <div className={styles.loadingContainer}>
          <CircularProgress size={48} />
        </div>
      ) : walletsData.length === 0 ? (
        <div className={styles.pageName}>
          No wallets. Activate it in your
          <Link href="/account/settings">
            <a className={styles.link}>account settings</a>
          </Link>
        </div>
      ) : (
        <WalletTable
          sortData={(column: string) => sortWalletsData(column)}
          walletsData={getTableData(walletsData)}
          setOpenSendDialog={setOpenSendDialog}
          showDetailsDialog={() => setOpenDetailsDialog(true)}
          setCurrentWalletRow={setCurrentWalletRow}
          editSubUser={editSubUser}
        />
      )}
      {showWalletSuggestion === true && walletsData.length > 0 && (
        <div className={styles.suggestion}>
          You can activate more currencies in your
          <Link href="/account/settings">
            <a className={styles.link}>account settings</a>
          </Link>
        </div>
      )}
      <div style={{ marginTop: '60px' }}>
        <AccountSecondTitle title="Transactions history" description="" />
        <TransactionsHistoryTable
          isPageReloaded={isPageReloaded}
          currencyPrices={currencyPrices}
          subUser={null}
          specialCurrency={null}
        />
      </div>
      <SendDialog
        openSendDialog={openSendDialog}
        setOpenSendDialog={setOpenSendDialog}
        getWalletsBalance={getWalletsBalance}
        setIsPageReloaded={setIsPageReloaded}
        currentWalletRow={currentWalletRow}
      />
      <FreezeDialog
        isOpenedFreezeDialog={openFreezeDialog}
        closeFreezeDialog={() => setOpenFreezeDialog(false)}
        currentWalletRow={currentWalletRow}
        isUnfreeze={isUnfreeze}
        reloadPage={reloadPage}
      />
      <ReceiveDialog
        openReceiveDialog={openReceiveDialog}
        currentWalletRow={currentWalletRow}
        setOpenReceiveDialog={setOpenReceiveDialog}
      />
      <DetailsDialog
        openDetailsDialog={openDetailsDialog}
        closeDialog={() => setOpenDetailsDialog(false)}
        currentWalletRow={currentWalletRow}
        openSendDialog={() => setOpenSendDialog(true)}
        openReceiveDialog={() => setOpenReceiveDialog(true)}
        openFreezeDialog={() => {
          setIsUnfreeze(false);
          setOpenFreezeDialog(true);
        }}
        openUnfreezeDialog={() => {
          setIsUnfreeze(true);
          setOpenFreezeDialog(true);
        }}
        currencyPrices={currencyPrices}
      />
      <WalletsBundleDialog
        openDialog={openWalletsBundleDialog}
        closeDialog={() => setOpenWalletBundleDialog(false)}
        subUser={currentDialogBundle}
        reload={() => pageSoftReload()}
      />
    </div>
  );
};

export default Home;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      content: {
        background: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
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
      wallets: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        [theme.breakpoints.up('md')]: {
          justifyContent: 'flex-start',
        },
      },
      pageName: {
        color: theme.palette.common.black,
        fontSize: '16px',
      },
      loadingContainer: {
        width: '100%',
        height: '150px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      reloadButton: {
        background: 'none',
        borderColor: theme.palette.text.primary,
        color: theme.palette.text.primary,
        fontWeight: 400,
        fontFamily: 'Montserrat, sans-serif !important',
        '&.MuiButtonBase-root:hover': {
          borderColor: theme.palette.text.primary,
        },
      },
      topRow: {
        display: 'flex',
        alignItems: 'baseline',
        [theme.breakpoints.down('md')]: {
          flexDirection: 'column',
        },
      },
      topButtonsContainer: {
        display: 'flex',
        marginBottom: '20px',
        '& > *': {
          marginRight: '20px',
        },
      },
      walletsDisplaySwitchIcon: {
        fontSize: '24px',
        color: theme.palette.text.secondary,
      },
      walletsDisplaySwitchIconActive: {
        color: theme.palette.primary.main,
      },
      suggestion: {
        fontSize: '14px',
        color: theme.palette.text.primary,
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px',
        [theme.breakpoints.down('md')]: {
          textAlign: 'center',
          display: 'block',
          width: '100%',
        },
      },
      link: {
        marginLeft: '4px',
        fontStyle: 'normal',
        fontWeight: 400,
        whiteSpace: 'nowrap',
        color: theme.palette.primary.main,
      },
    }),
  { name: 'Home' },
);
