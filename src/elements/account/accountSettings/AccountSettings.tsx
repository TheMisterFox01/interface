import { useState, useCallback, useEffect, ChangeEvent } from 'react';
import { observer } from 'mobx-react';

import Button from 'components/Button';
import LockIcon from '@mui/icons-material/Lock';
import Slide, { SlideProps } from '@mui/material/Slide';
import CircularProgress from 'components/CircularProgress';
import type { TransitionProps } from '@mui/material/transitions';

import { createStyles, makeStyles } from '@material-ui/core/styles';

import TextField from 'components/TextField';
import AccountLogTable from './AccountLogTable';
import CustomSnackbar from 'elements/customComponents/CustomSnackbar';
import CustomSwitcher from 'elements/customComponents/CustomSwitcher';
import CustomFormControlLabel from 'elements/customComponents/CustomFormControlLabel';
import AccountTitle from 'elements/AccountTitle';
import AccountSecondTitle from 'elements/AccountSecondTitle';
import WalletSwitcher from './WalletSwitcher';
import NotificationSwitcher from './NotificationSwitcher';
import { MultiFactorAuth, MultiFactorAuthRecovery } from 'components/MultiFactorAuth';
import ButtonProgressWrapper from 'elements/ButtonProgressWrapper';
import {
  postData,
  sortFunction,
  UPDATE_PASSWORD_PATH,
  GET_USER_SETTINGS_PATH,
  GET_ALL_WALLET_STATUS_PATH,
  UPDATE_WALLET_STATUS_PATH,
  UPDATE_USER_NOTIFICATIONS_PATH,
  CREATE_AUTH_MULTI_FACTOR_PATH,
  ENABLE_AUTH_MULTI_FACTOR_PATH,
  DISABLE_AUTH_MULTI_FACTOR_PATH,
  CREATE_SEND_MULTI_FACTOR_PATH,
  ENABLE_SEND_MULTI_FACTOR_PATH,
  DISABLE_SEND_MULTI_FACTOR_PATH,
} from 'utils';

type WalletChange = {
  currencyInternalName: string;
  isActive: boolean;
};

type NotificationChange = {
  userActionName: string;
  isActive: boolean;
};

type Wallet = {
  isActive: boolean;
  currency: {
    internalName: string;
    name: string;
    shortName: string;
  };
};

type Notification = {
  isActive: boolean;
  userAction: {
    name: string;
  };
};

type UserSettings = {
  email: string;
  userWalletStatuses: Wallet[];
  userOptions: {
    twoFactorAuth: boolean;
    twoFactorSend: boolean;
  };
  userNotifications: Notification[];
};

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

const AccountSettings = (): JSX.Element => {
  const styles = useStyles();
  const [isUpdatePassword, setIsUpdatePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [email, setEmail] = useState('');
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [walletsInitial, setWalletsInitial] = useState<Wallet[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsInitial, setNotificationsInitial] = useState<Notification[]>([]);
  const [isLoadingAccountSettings, setIsLoadingAccountSettings] = useState(false);
  const [saveButtonVisible, setSaveButtonVisible] = useState(false);
  const [isSaveProgressVisible, setIsSaveProgressVisible] = useState(false);

  const [snackbarText, setSnackbarText] = useState('');

  const [walletChange, setWalletChange] = useState<WalletChange | undefined>({} as WalletChange);
  const [notificationChange, setNotificationChange] = useState<NotificationChange | undefined>(
    {} as NotificationChange,
  );

  const [authFactors, setAuthFactors] = useState<string[]>([]);
  const [sendFactors, setSendFactors] = useState<string[]>([]);

  const [preparedFactors, setPreparedFactors] = useState<{ [index: string]: string }>({});
  const [factors, setFactors] = useState<{ [index: string]: string }>({});
  const [factorAction, setFactorAction] = useState('');
  const [factorActionType, setFactorActionType] = useState('');
  const [factorMessage, setFactorMessage] = useState('');
  const [isMultiFactorModalOpened, setIsMultiFactorModalOpened] = useState(false);
  const [factorNote, setFactorNote] = useState('');
  const [factorActionTypePath, setFactorActionTypePath] = useState('');
  const [continueActionCounter, setContinueActionCounter] = useState(0);
  const [recoveryCode, setRecoveryCode] = useState('');
  const [isMultiFactorRecoveryModalOpened, setIsMultiFactorRecoveryModalOpened] = useState(false);

  const [isMultiFactorChangeInProgress, setIsMultiFactorChangeInProgress] = useState(false);

  const init = () => {
    setPreparedFactors({});
    setAuthFactors([]);
    setSendFactors([]);
    setFactors({});
    setFactorAction('');
    setFactorActionType('');
    setFactorMessage('');
    setIsMultiFactorModalOpened(false);
    setFactorNote('');
    setFactorActionTypePath('');
    setRecoveryCode('');
    setIsMultiFactorRecoveryModalOpened(false);
  };

  const getAllWalletStatus = useCallback(async () => {
    const token = localStorage.getItem('bitsidyAccessToken') || '';

    const response = await postData(GET_ALL_WALLET_STATUS_PATH, {
      token,
    });

    const wallets = response.data as Wallet[];

    const sortedWallets = wallets.sort(
      ({ currency: { internalName: a } }, { currency: { internalName: b } }) => sortFunction(a, b),
    );
    setWallets(sortedWallets);
    setWalletsInitial(JSON.parse(JSON.stringify(sortedWallets)));
  }, []);

  const getAllSettings = useCallback(async () => {
    setIsLoadingAccountSettings(true);
    const token = localStorage.getItem('bitsidyAccessToken') || '';

    const response = await postData(GET_USER_SETTINGS_PATH, {
      token,
    });

    if (response.result) {
      const {
        userOptions: { enabledAuthFactors, enabledSendFactors },
      } = response.data;

      const { userWalletStatuses, userNotifications, email } = response.data as UserSettings;

      const sortedWallets = userWalletStatuses.sort(
        ({ currency: { internalName: a } }, { currency: { internalName: b } }) =>
          sortFunction(a, b),
      );

      const sortedNotifications = userNotifications.sort(
        ({ userAction: { name: a } }, { userAction: { name: b } }) => sortFunction(a, b),
      );

      setEmail(email);
      setWallets(sortedWallets);
      setWalletsInitial(JSON.parse(JSON.stringify(sortedWallets)));
      setNotifications(sortedNotifications);
      setNotificationsInitial(JSON.parse(JSON.stringify(sortedNotifications)));

      setAuthFactors(enabledAuthFactors);
      setSendFactors(enabledSendFactors);
    }
    setIsLoadingAccountSettings(false);
  }, []);

  const updatePassword = useCallback(async () => {
    const token = localStorage.getItem('bitsidyAccessToken') || '';
    const response = await postData(UPDATE_PASSWORD_PATH, {
      token,
      source: 0,
      oldPassword,
      newPassword,
    });

    if (response.result === 'success') {
      setSnackbarText('New password is saved.');
      handleOpenSnackbar();
      handleCancel();
    }
  }, [newPassword, oldPassword]);

  const handleChangeFactor = async (
    e: React.MouseEvent<HTMLElement>,
    action: string,
    factor: string,
  ) => {
    e.preventDefault();
    setIsMultiFactorChangeInProgress(true);
    setRecoveryCode('');
    setIsMultiFactorRecoveryModalOpened(false);

    try {
      let actionType = '';
      let path = '';
      let actionTypePath = '';
      switch (action) {
        case 'login':
          path = CREATE_AUTH_MULTI_FACTOR_PATH;
          if (authFactors.includes(factor)) {
            actionType = 'disable';
            actionTypePath = DISABLE_AUTH_MULTI_FACTOR_PATH;
          } else {
            actionType = 'enable';
            actionTypePath = ENABLE_AUTH_MULTI_FACTOR_PATH;
          }
          break;
        case 'send':
          path = CREATE_SEND_MULTI_FACTOR_PATH;
          if (sendFactors.includes(factor)) {
            actionType = 'disable';
            actionTypePath = DISABLE_SEND_MULTI_FACTOR_PATH;
          } else {
            actionType = 'enable';
            actionTypePath = ENABLE_SEND_MULTI_FACTOR_PATH;
          }
          break;
        default:
          return;
      }

      setFactorAction(action);
      setFactorActionType(actionType);
      setFactorActionTypePath(actionTypePath);
      setFactorMessage('');
      setFactorNote('');

      const token = localStorage.getItem('bitsidyAccessToken') || '';
      const response = await postData(path, {
        token,
        factor,
        actionType,
      });

      if (response.result == 'success') {
        let data = {};
        data[factor] = response.data;
        setPreparedFactors(data);
        setIsMultiFactorModalOpened(true);
      }
    } catch {}

    setIsMultiFactorChangeInProgress(false);
  };

  useEffect(() => {
    processingMultiFactor();
  }, [continueActionCounter]);

  const processingMultiFactor = async () => {
    if (factorActionTypePath == '' || Object.keys(factors).length == 0) {
      return;
    }
    setIsMultiFactorChangeInProgress(true);

    try {
      const token = localStorage.getItem('bitsidyAccessToken') || '';
      const factor = Object.keys(preparedFactors)[0];
      const processingResponse = await postData(factorActionTypePath, {
        token,
        twoFactor: factors[factor],
        factor: factor,
      });
      if (processingResponse.result == 'success') {
        if (processingResponse.data != null && factorActionType == 'enable') {
          setRecoveryCode(processingResponse.data);
          setIsMultiFactorRecoveryModalOpened(true);
        }
        const token = localStorage.getItem('bitsidyAccessToken') || '';
        const response = await postData(GET_USER_SETTINGS_PATH, {
          token,
        });
        if (response.result) {
          const {
            userOptions: { enabledAuthFactors, enabledSendFactors },
          } = response.data;
          setAuthFactors(enabledAuthFactors);
          setSendFactors(enabledSendFactors);
        }
      } else {
        if ('message' in processingResponse.data) {
          setSnackbarText(processingResponse.data.message);
          handleOpenSnackbar();
        }
      }
    } catch {}

    setIsMultiFactorChangeInProgress(false);
  };

  useEffect(() => {
    if (walletChange) {
      wallets.map((row) => {
        if (row.currency.internalName === walletChange.currencyInternalName) {
          row.isActive = walletChange.isActive;
          setSaveButtonVisible(true);
        }
      });

      setWalletChange(undefined);
    }
  }, [walletChange]);

  useEffect(() => {
    if (notificationChange) {
      notifications.map((row) => {
        if (row.userAction.name === notificationChange.userActionName) {
          row.isActive = notificationChange.isActive;
          setSaveButtonVisible(true);
        }
      });

      setNotificationChange(undefined);
    }
  }, [notificationChange]);

  useEffect(() => {
    init();
    setWalletChange(undefined);
    getAllWalletStatus().catch((error) => console.log(error));
    getAllSettings().catch((error) => console.log(error));
  }, []);

  const handleChangeNewPassword = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNewPassword(value);
  };

  const handleChangeOldPassword = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setOldPassword(value);
  };

  const handleSavePassword = () => {
    updatePassword().catch((error) => console.log(error));
  };

  const handleCancel = () => {
    setNewPassword('');
    setOldPassword('');
    setIsUpdatePassword(false);
  };

  const handleChangePassword = () => {
    setIsUpdatePassword(true);
  };

  const [snackbarState, setState] = useState<{
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

  const handleOpenSnackbar = () => {
    setState({
      ...snackbarState,
      open: true,
    });
  };

  const handleCloseSnackbar = () => {
    setState({
      ...snackbarState,
      open: false,
    });
  };

  const saveNotifications = async () => {
    const token = localStorage.getItem('bitsidyAccessToken') || '';
    const changes = notifications.map((row) => ({
      userActionName: row.userAction.name,
      isActive: row.isActive,
    }));

    await postData(UPDATE_USER_NOTIFICATIONS_PATH, {
      token,
      notifications: changes,
    });
  };

  const saveWallets = async () => {
    const token = localStorage.getItem('bitsidyAccessToken') || '';
    const changes: WalletChange[] = wallets.map((row) => ({
      currencyInternalName: row.currency.internalName,
      isActive: row.isActive,
    }));

    await postData(UPDATE_WALLET_STATUS_PATH, {
      token,
      walletStatuses: changes,
    });
  };

  const handleSave = async () => {
    setIsSaveProgressVisible(true);

    await Promise.all([
      saveNotifications().catch((error) => console.log(error)),
      saveWallets().catch((error) => console.log(error)),
    ]);

    setIsSaveProgressVisible(false);
    setSaveButtonVisible(false);
    getAllWalletStatus().catch((error) => console.log(error));
  };

  const handleBackChanges = async () => {
    for (let i = 0; i < wallets.length; ++i) {
      for (let j = 0; j < walletsInitial.length; ++j) {
        if (wallets[i].currency.internalName === walletsInitial[j].currency.internalName) {
          wallets[i].isActive = walletsInitial[j].isActive;
          break;
        }
      }
    }

    for (let i = 0; i < notifications.length; ++i) {
      for (let j = 0; j < notificationsInitial.length; ++j) {
        if (notifications[i].userAction.name === notificationsInitial[j].userAction.name) {
          notifications[i].isActive = notificationsInitial[j].isActive;
          break;
        }
      }
    }

    setSaveButtonVisible(false);
  };

  const walletComponents = wallets
    ?.sort((a: Wallet, b: Wallet) => {
      return a.currency.name > b.currency.name ? 1 : -1;
    })
    .map(({ isActive, currency: { name, internalName } }, index) => (
      <div className={styles.switcher}>
        <WalletSwitcher
          key={`${internalName}${index}`}
          internalName={internalName}
          label={`${name} (${internalName})`}
          isActive={isActive}
          setWalletChange={setWalletChange}
        />
      </div>
    ));

  const notificationComponents = notifications?.map(({ isActive, userAction: { name } }, index) => (
    <div className={styles.switcher}>
      <NotificationSwitcher
        key={`${name}${index}`}
        label={name}
        isActive={isActive}
        setNotificationChange={setNotificationChange}
      />
    </div>
  ));

  return (
    <div className={styles.main}>
      <AccountTitle title="Account" breadcrumbs="Settings" />
      <div className={styles.content}>
        <div className={styles.settings}>
          <div className={styles.accountSettings}>
            {isUpdatePassword ? (
              <div className={styles.settingsCard}>
                <AccountSecondTitle title="Change password" description="" />
                <TextField
                  className={styles.passwordInput}
                  value={newPassword}
                  onChange={handleChangeNewPassword}
                  label="New password"
                  type="password"
                />
                <TextField
                  className={styles.passwordInput}
                  value={oldPassword}
                  onChange={handleChangeOldPassword}
                  label="Old password"
                  type="password"
                />
                <div className={styles.changePasswordButtons}>
                  <Button className={styles.closeButton} variant="outlined" onClick={handleCancel}>
                    CANCEL
                  </Button>
                  <Button
                    className={styles.changePassword}
                    variant="outlined"
                    onClick={handleSavePassword}
                  >
                    SAVE
                  </Button>
                </div>
              </div>
            ) : (
              <div className={styles.settingsCard}>
                <AccountSecondTitle title="Personal info" description="" />
                {isLoadingAccountSettings ? (
                  <CircularProgress size={24} />
                ) : (
                  <>
                    <div style={{ paddingBottom: '24px', overflowWrap: 'anywhere' }}>{email}</div>
                    <div>
                      <Button
                        className={styles.changePassword}
                        variant="outlined"
                        onClick={handleChangePassword}
                        startIcon={<LockIcon />}
                      >
                        CHANGE PASSWORD
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className={styles.settingsCard}>
              <AccountSecondTitle
                title="Multi-Factor Authentication"
                description="Enable multi-factor authentication to increase security of your account. Use email, telegram account, and one-time passwords to confirm your identity for important actions"
              />
              {isLoadingAccountSettings ? (
                <CircularProgress size={24} />
              ) : (
                <div className={styles.twoFactorsList}>
                  {isMultiFactorChangeInProgress ? (
                    <CircularProgress size={24} />
                  ) : (
                    <>
                      <div className={styles.multiAuthContainer}>
                        <div className={styles.multiAuthTitle}>When logging into your account</div>
                        <CustomFormControlLabel
                          className={styles.multiAuthFactor}
                          labelPlacement="end"
                          control={
                            <CustomSwitcher
                              checked={authFactors.includes('email')}
                              onClick={(e) => handleChangeFactor(e, 'login', 'email')}
                            />
                          }
                          label="send code to email"
                        />
                        <CustomFormControlLabel
                          className={styles.multiAuthFactor}
                          labelPlacement="end"
                          control={
                            <CustomSwitcher
                              checked={authFactors.includes('telegram')}
                              onClick={(e) => handleChangeFactor(e, 'login', 'telegram')}
                            />
                          }
                          label="send code to telegram"
                        />
                        <CustomFormControlLabel
                          className={styles.multiAuthFactor}
                          labelPlacement="end"
                          control={
                            <CustomSwitcher
                              checked={authFactors.includes('otp')}
                              onClick={(e) => handleChangeFactor(e, 'login', 'otp')}
                            />
                          }
                          label="check one-time password (OTP)"
                        />
                      </div>
                      <div>
                        <div className={styles.multiAuthTitle}>When sending cryptocurrency</div>
                        <CustomFormControlLabel
                          className={styles.multiAuthFactor}
                          labelPlacement="end"
                          control={
                            <CustomSwitcher
                              checked={sendFactors.includes('email')}
                              onClick={(e) => handleChangeFactor(e, 'send', 'email')}
                            />
                          }
                          label="send code to email"
                        />
                        <CustomFormControlLabel
                          className={styles.multiAuthFactor}
                          labelPlacement="end"
                          control={
                            <CustomSwitcher
                              checked={sendFactors.includes('telegram')}
                              onClick={(e) => handleChangeFactor(e, 'send', 'telegram')}
                            />
                          }
                          label="send code to telegram"
                        />
                        <CustomFormControlLabel
                          className={styles.multiAuthFactor}
                          labelPlacement="end"
                          control={
                            <CustomSwitcher
                              checked={sendFactors.includes('otp')}
                              onClick={(e) => handleChangeFactor(e, 'send', 'otp')}
                            />
                          }
                          label="check one-time password (OTP)"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className={styles.settingsCard}>
              <AccountSecondTitle
                title="Email notifications"
                description="Enable/disable email notifications"
              />
              {isLoadingAccountSettings ? (
                <CircularProgress size={24} />
              ) : (
                <>{notificationComponents}</>
              )}
            </div>
          </div>
          <div className={styles.settingsCard} style={{ width: '100%', height: 'fit-content' }}>
            <AccountSecondTitle title="Wallets" description="Activate/deactivate wallets" />
            {isLoadingAccountSettings ? (
              <CircularProgress size={24} />
            ) : (
              <div className={styles.walletsList}>{walletComponents}</div>
            )}
          </div>
        </div>
        <div>
          <AccountSecondTitle title="Logs" description="Attempts login into account" />
          <AccountLogTable />
        </div>
      </div>
      <MultiFactorAuth
        factors={preparedFactors}
        action={factorAction}
        actionType={factorActionType}
        message={factorMessage}
        isOpened={isMultiFactorModalOpened}
        handleClose={() => setIsMultiFactorModalOpened(false)}
        setFactorsCodes={(factors: {}) => setFactors(factors)}
        continueAction={() => setContinueActionCounter(continueActionCounter + 1)}
        note={factorNote}
      />
      <MultiFactorAuthRecovery
        factors={preparedFactors}
        action={factorAction}
        recoveryCode={recoveryCode}
        isOpened={isMultiFactorRecoveryModalOpened}
        handleClose={() => setIsMultiFactorRecoveryModalOpened(false)}
      />
      <CustomSnackbar
        autoHideDuration={2000}
        open={snackbarState.open}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={handleCloseSnackbar}
        TransitionComponent={snackbarState.Transition}
        message={snackbarText}
        key={snackbarState.Transition.name}
      />
      {saveButtonVisible && (
        <div className={styles.saveDialog}>
          <div style={{ width: 'max-content', marginBottom: '16px' }}>
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
      )}
    </div>
  );
};

const AccountSettingsObserver = observer(AccountSettings);

export default AccountSettingsObserver;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      passwordInput: {
        paddingBottom: '16px',
      },
      main: {
        background: theme.palette.background.paper,
        display: 'flex',
        flexDirection: 'column',
        padding: '0 10px',
        width: '100%',
        boxSizing: 'border-box',
        [theme.breakpoints.up('lg')]: {
          width: '1200px',
          padding: '0 25px',
        },
        [theme.breakpoints.up('xl')]: {
          padding: '0 65px',
        },
      },
      header: {
        margin: '95px 0px 24px',
        color: theme.palette.text.primary,
        [theme.breakpoints.up('lg')]: {
          margin: '32px 0px',
        },
      },
      content: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      },
      settings: {
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: '40px',
      },
      wallets: { display: 'flex' },
      accountSettings: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      },
      settingsCard: {
        background: theme.palette.background.default,
        display: 'flex',
        color: theme.palette.text.primary,
        flexDirection: 'column',
        marginRight: '40px',
        marginBottom: '30px',
        maxWidth: '360px',
        [theme.breakpoints.down('sm')]: {
          maxWidth: '100%',
          marginRight: '0px',
          paddingRight: '20px',
        },
      },
      walletsList: {
        height: '100%',
        display: 'flex',
        justifyContent: 'space-evenly',
        flexDirection: 'column',
      },
      twoFactorsList: {
        display: 'flex',
        flexDirection: 'column',
      },
      switcher: {
        [theme.breakpoints.down('sm')]: {
          paddingBottom: '10px',
        },
      },
      changePassword: {
        color: theme.palette.text.primary,
        borderColor: theme.palette.text.primary,
      },
      changePasswordButtons: {
        display: 'flex',
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
      closeButton: {
        marginRight: '20px !important',
      },
      multiAuthContainer: {
        marginBottom: '11px',
      },
      multiAuthTitle: {
        fontWeight: 500,
        marginBottom: '11px',
      },
      multiAuthFactor: {
        marginLeft: 0,
        justifyContent: 'flex-start',
      },
    }),
  { name: 'AccountSettings' },
);
