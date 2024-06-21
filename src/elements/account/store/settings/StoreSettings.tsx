import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

import Slide, { SlideProps } from '@mui/material/Slide';
import CircularProgress from 'components/CircularProgress';
import { TransitionProps } from '@mui/material/transitions';
import Button from 'components/Button';

import { createStyles, makeStyles } from '@material-ui/core/styles';

import StoreLogTable from './StoreLogTable';
import StoreInput from './StoreInput';
import StoreGeneratedInput from './StoreGeneratedInput';
import StoreSwitcher from './StoreSwitcher';
import StoreSlider from './StoreSlider';
import ButtonProgressWrapper from 'elements/ButtonProgressWrapper';
import AccountSecondTitle from 'elements/AccountSecondTitle';
import AccountTitle from 'elements/AccountTitle';
import CustomSnackbar from 'elements/customComponents/CustomSnackbar';
import {
  postData,
  sortFunction,
  GET_STORE_OPTIONS_PATH,
  UPDATE_STORE_OPTIONS_PATH,
  UPDATE_STORE_NOTIFICATIONS_PATH,
} from 'utils';
import AccountBackTitle from 'elements/AccountBackTitle';

export type OptionChange = [keyof StoreOptions, string];
export type NotificationChange = [string, boolean];

export type StoreNotification = {
  isActive: boolean;
  storeAction: {
    name: string;
  };
};

export type StoreOptions = {
  allowedUnderpaidPercent?: string;
  apiKey?: string;
  callbackFail?: string;
  callbackNotify?: string;
  callbackSuccess?: string;
  invoiceExpiration?: string;
  invoiceExtendedExpiration?: string;
  logoUrl?: string;
  name?: string;
  storeId?: string;
  storeUrl?: string;
};

type StoreSettingsType = {
  storeNotifications: StoreNotification[];
  storeOptions: StoreOptions;
};

const optionLabels = {
  name: 'Store name',
  logoUrl: 'Logo URL',
  darkLogoUrl: 'Logo URL for dark theme',
  callbackSuccess: 'Callback success',
  callbackNotify: 'Callback notify',
  callbackFail: 'Callback fail',
  allowedUnderpaidPercent: 'Allowed underpay percent',
  invoiceExpiration: 'Invoice expiration',
  invoiceExtendedExpiration: 'Invoice extended expiration',
  apiKey: 'API key',
  storeId: 'Store ID',
  storeUrl: 'Store URL',
};

const tooltips = {
  allowedUnderpaidPercent:
    "With this parameter client can pay less than invoice amount. We create it because some clients can't pay exactly amount and invoices hangs as underpaid. For example, you have invoice for $50. If you allow underpaid 3% then allowed invoice amount will be $48.5.",
  invoiceExpiration: 'After creating invoice lives this time.',
  invoiceExtendedExpiration:
    'After invoice expiration invoice continues live this time for slow payers.',
};

const getStoreOptionsArray = (options: StoreOptions | undefined) => {
  if (!options) {
    return [];
  }

  return Object.keys(options).map((optionKey) => {
    const key = optionKey as keyof StoreOptions;
    return {
      optionKey: key,
      label: optionLabels[optionKey],
      content: options[optionKey],
    };
  });
};

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

const StoreSettings = (): JSX.Element => {
  const styles = useStyles();
  const router = useRouter();

  let storeId = router.query.storeId as string;

  const [table] = useState(<StoreLogTable storeId={storeId} />);
  const [isLoadingStoreSettings, setIsLoadingStoreSettings] = useState(true);
  const [isSaveProgressVisible, setIsSaveProgressVisible] = useState(false);
  const [saveButtonVisible, setSaveButtonVisible] = useState(false);

  const [storeOptions, setStoreOptions] = useState<StoreOptions>();
  const [storeOptionChanges, setStoreOptionChanges] = useState<StoreOptions>();

  const [notifications, setNotifications] = useState<StoreNotification[]>([]);

  const [optionChange, setOptionChange] = useState<OptionChange>();
  const [notificationChange, setNotificationChange] = useState<NotificationChange>();

  const [storeSliders, setStoreSliders] = useState<(JSX.Element | undefined)[]>([]);
  const [storeOptionsInputs, setStoreOptionsInputs] = useState<(JSX.Element | undefined)[]>([]);
  const [storeGeneratedInputs, setStoreGeneratedInputs] = useState<(JSX.Element | undefined)[]>([]);
  const [snackbarState, setSnackbarState] = useState<{
    open: boolean;
    Transition: React.ComponentType<
      TransitionProps & {
        children: React.ReactElement<any, any>;
      }
    >;
  }>({
    open: false,
    Transition: SlideTransition,
  });

  useEffect(() => {
    if (optionChange) {
      const [key, value] = optionChange;
      // If the current value is equal to the value from the database, remove it from the list of changes.
      if (storeOptionChanges && storeOptions && value == storeOptions[key]) {
        delete storeOptionChanges[key];
        setStoreOptionChanges({ ...storeOptionChanges });
      } else {
        if (storeOptionChanges) {
          setStoreOptionChanges({ ...storeOptionChanges, [key]: value });
        } else {
          setStoreOptionChanges({ [key]: value });
        }
      }
      setSaveButtonVisible(true);
      setOptionChange(undefined);
    }
  }, [optionChange, storeOptionChanges]);

  useEffect(() => {
    if (notificationChange) {
      const [key, value] = notificationChange;

      notifications.map((row) => {
        if (row.storeAction.name === key) {
          row.isActive = value;
          setSaveButtonVisible(true);
        }
      });

      setNotificationChange(undefined);
    }
  }, [notificationChange]);

  useEffect(() => {
    const optionsInputs = getStoreOptionsArray(storeOptions).map(
      ({ label, content, optionKey }) => {
        if (
          optionKey !== 'allowedUnderpaidPercent' &&
          optionKey !== 'invoiceExpiration' &&
          optionKey !== 'invoiceExtendedExpiration' &&
          optionKey !== 'apiKey' &&
          optionKey !== 'storeId'
        ) {
          return (
            <StoreInput
              key={`${optionKey}`}
              optionKey={optionKey}
              label={label}
              content={content}
              setOptionChange={setOptionChange}
            />
          );
        }
      },
    );

    const generatedInputs = getStoreOptionsArray(storeOptions).map(
      ({ label, content, optionKey }) => {
        if (optionKey === 'apiKey' || optionKey === 'storeId') {
          return (
            <StoreGeneratedInput
              key={`${optionKey}`}
              optionKey={optionKey}
              label={label}
              content={content}
              storeId={storeId}
            />
          );
        }
      },
    );

    const sliders = getStoreOptionsArray(storeOptions).map(({ label, content, optionKey }) => {
      if (
        optionKey === 'allowedUnderpaidPercent' ||
        optionKey === 'invoiceExpiration' ||
        optionKey === 'invoiceExtendedExpiration'
      ) {
        return (
          <StoreSlider
            key={optionKey}
            optionKey={optionKey}
            label={label}
            content={content}
            tooltipDescription={tooltips[optionKey]}
            setOptionChange={setOptionChange}
          />
        );
      }
    });
    setStoreGeneratedInputs(generatedInputs);
    setStoreOptionsInputs(optionsInputs);
    setStoreSliders(sliders);
  }, [storeOptions]);

  const getAllSettings = useCallback(async () => {
    const token = localStorage.getItem('bitsidyAccessToken') || '';

    const response = await postData(GET_STORE_OPTIONS_PATH, {
      token,
      storeId,
    });

    return response.data;
  }, []);

  useEffect(() => {
    getStoreSettings().catch((error) => console.log(error));
  }, []);

  const getStoreSettings = async () => {
    setIsLoadingStoreSettings(true);
    const settings = (await getAllSettings()) as StoreSettingsType;

    setStoreOptions(settings.storeOptions);

    /*
     Sort this array because isActive notifications come at the end of the array,
     as a result, this leads to a different order of the list elements.
    */
    const sortedNotifications = settings.storeNotifications.sort(
      ({ storeAction: { name: a } }, { storeAction: { name: b } }) => sortFunction(a, b),
    );

    setNotifications(sortedNotifications);
    setIsLoadingStoreSettings(false);
  };

  const saveNotifications = async () => {
    const token = localStorage.getItem('bitsidyAccessToken') || '';

    const changes = notifications.map((row) => ({
      storeActionName: row.storeAction.name,
      isActive: row.isActive,
    }));

    const response = await postData(UPDATE_STORE_NOTIFICATIONS_PATH, {
      token,
      notifications: changes,
      storeId,
    });

    if (response.result === 'success') {
      return true;
    }

    return false;
  };

  const saveOptions = async () => {
    const token = localStorage.getItem('bitsidyAccessToken') || '';

    if (storeOptionChanges === undefined) {
      return true;
    }

    const response = await postData(UPDATE_STORE_OPTIONS_PATH, {
      token,
      storeOptions: storeOptionChanges,
      storeId,
    });

    if (response.result === 'success') {
      setStoreOptions({ ...storeOptions, ...storeOptionChanges });
      setStoreOptionChanges(undefined);
      return true;
    }

    return false;
  };

  const handleSave = async () => {
    setIsSaveProgressVisible(true);

    const [notificationsResult, optionsResult] = await Promise.all([
      saveNotifications(),
      saveOptions(),
    ]);

    if (notificationsResult === false || optionsResult === false) {
      setIsLoadingStoreSettings(true);
      handleOpenSnackbar();
      setStoreOptions([] as StoreOptions);
      setNotifications([] as StoreNotification[]);
      getStoreSettings().catch((error) => console.log(error));
    }

    setIsSaveProgressVisible(false);
    setSaveButtonVisible(false);
  };

  const handleBackChanges = async () => {
    getStoreSettings().catch((error) => console.log(error));
    setSaveButtonVisible(false);
  };

  const handleOpenSnackbar = () => {
    setSnackbarState({
      ...snackbarState,
      open: true,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbarState({
      ...snackbarState,
      open: false,
    });
  };

  return (
    <div className={styles.main}>
      <AccountTitle
        title="Merchant stores"
        breadcrumbs={'Stores / Store ' + storeId + ' / Settings'}
      />
      <div className={`${styles.content} ${saveButtonVisible ? styles.saveButtonPadding : ''}`}>
        <AccountBackTitle
          title={storeOptions !== undefined && 'name' in storeOptions ? storeOptions.name : ''}
          subTitle="Settings"
          pathname="store"
          query=""
          isLoading={isLoadingStoreSettings}
        />

        <div className={styles.settings}>
          <div key="generatedInputs" className={styles.generatedCard}>
            {isLoadingStoreSettings ? <CircularProgress size={24} /> : <>{storeGeneratedInputs}</>}
          </div>
          <div className={styles.settingsCard}>
            <AccountSecondTitle title="Store" description="Your store information" />
            {isLoadingStoreSettings ? (
              <CircularProgress size={24} />
            ) : (
              <div className={styles.storeInformation}>
                <div className={styles.storeCard}>{storeOptionsInputs}</div>
                <div className={styles.storeCard}>{storeSliders}</div>
              </div>
            )}
          </div>

          <div className={styles.settingsCard} style={{ width: 'max-content !important' }}>
            <AccountSecondTitle
              title="Notifications"
              description="Enable/disable invoices notifications"
            />
            {isLoadingStoreSettings ? (
              <CircularProgress size={24} />
            ) : (
              <>
                {notifications?.map(({ isActive, storeAction: { name } }, index) => (
                  <StoreSwitcher
                    key={`${name}${index}`}
                    label={name}
                    isActive={isActive}
                    setNotificationChange={setNotificationChange}
                  />
                ))}
              </>
            )}
          </div>
          <div className={styles.table}>
            <AccountSecondTitle title="Logs" description="Store settings change log" />
            {table}
          </div>
        </div>
        {saveButtonVisible ? (
          <div className={styles.saveDialog}>
            <div style={{ width: 'max-content', marginBottom: 2 }}>
              Parameters changed. Want to save?
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button onClick={handleBackChanges} className={styles.closeButton} variant="outlined">
                CLOSE
              </Button>
              <ButtonProgressWrapper
                clickHandler={handleSave}
                loading={isSaveProgressVisible}
                buttonText="SAVE"
              />
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      <CustomSnackbar
        autoHideDuration={3000}
        open={snackbarState.open}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={snackbarState.Transition}
        message="Something went wrong. Try again."
        onClose={handleCloseSnackbar}
        key={snackbarState.Transition.name}
      />
    </div>
  );
};
export default StoreSettings;

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
      content: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      },
      saveButtonPadding: {
        paddingBottom: '60px',
      },
      settings: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: '40px',
        [theme.breakpoints.up('md')]: {
          justifyContent: 'flex-start',
        },
      },
      table: {
        width: '100%',
        minWidth: '320px',
      },
      settingsCard: {
        height: 'fit-content',
        display: 'flex',
        color: theme.palette.text.primary,
        flexDirection: 'column',
        marginRight: '40px',
        marginBottom: '30px',
        maxWidth: '360px',
        [theme.breakpoints.up('sm')]: {
          maxWidth: '100%',
          marginRight: '0px',
          paddingRight: '20px',
        },
      },
      generatedCard: {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
      },
      storeInformation: {
        display: 'flex',
        justifyContent: 'space-evenly',
        flexDirection: 'column',
        [theme.breakpoints.up('md')]: {
          flexDirection: 'row',
        },
      },
      storeCard: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        [theme.breakpoints.up('sm')]: {
          marginRight: '40px',
        },
      },
      saveDialog: {
        position: 'fixed',
        minWidth: '290px',
        minHeight: '70px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        padding: '20px',
        background: theme.palette.secondary.light,
        color: theme.palette.text.primary,
        boxShadow:
          '0px 3px 5px rgba(0, 0, 0, 0.2), 0px 6px 10px rgba(0, 0, 0, 0.14), 0px 1px 18px rgba(0, 0, 0, 0.12)',
        borderRadius: '4px',
        bottom: 20,
        left: '50%',
        transform: 'translate(-50%)',
      },
      storeTitle: {
        fontSize: '24px',
        color: theme.palette.text.primary,
        fontWeight: 500,
        marginBottom: '4px',
      },
      closeButton: {
        fontFamily: 'Montserrat, sans-serif',
        background: 'none',
        borderColor: theme.palette.text.primary,
        color: theme.palette.text.primary,
        marginRight: '20px !important',
        '&.MuiButtonBase-root:hover': {
          borderColor: theme.palette.text.primary,
        },
      },
    }),
  { name: 'StoreSettings' },
);
