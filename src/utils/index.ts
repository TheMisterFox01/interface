import { useState } from 'react';

import { PaletteMode } from '@mui/material';

// @ts-ignore
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import md5 from 'md5';
import store from '../store/store';

//const BASE_URL = 'http://127.0.0.1:6503';
const BASE_URL = 'https://api.bitsidy.com';

const MAIN_PATH = '/v1/site';
const USER_PATH = `${MAIN_PATH}/user`;
const STORE_PATH = `${MAIN_PATH}/store`;
const USER_OPTION_PATH = `${USER_PATH}/option`;
const STORE_OPTION_PATH = `${STORE_PATH}/option`;
const INVOICE_STORE_PATH = `${STORE_PATH}/invoice`;
const WALLET_STATUS_PATH = `${USER_OPTION_PATH}/walletstatus`;
const USER_PASSWORD_PATH = `${USER_PATH}/password`;

export const LOGIN_PATH = `${USER_PATH}/login`;
export const LOGOUT_PATH = `${USER_PATH}/logout`;
export const SIGNUP_PATH = `${USER_PATH}/signup`;

export const CREATE_USER_STORE_PATH = `${STORE_PATH}/create`;
export const RECOVERY_USER_PASSWORD = `${USER_PASSWORD_PATH}/recovery/create`;
export const CHECK_PASSWORD_RECOVERY_TOKEN_PATH = `${USER_PASSWORD_PATH}/recovery/get`;

export const GET_AUTHENTICATED_PATH = `${USER_PATH}/get`;
export const GET_STORES_PATH = `${STORE_PATH}/getall`;
export const GET_STORE_OPTIONS_PATH = `${STORE_OPTION_PATH}/getall`;
export const GET_STORE_NOTIFICATION_PATH = `${STORE_OPTION_PATH}/notification/getall`;
export const GET_USER_SETTINGS_PATH = `${USER_OPTION_PATH}/getall`;
export const GET_ALL_WALLET_STATUS_PATH = `${WALLET_STATUS_PATH}/getall`;
export const GET_STORE_ACTION_LOG_PATH = `${STORE_PATH}/action/log/get/batch`;
export const GET_USER_ACTION_LOG_PATH = `${USER_PATH}/action/log/get/batch`;
export const GET_ALL_INVOICES_PATH = `${INVOICE_STORE_PATH}/getall`;
export const GET_INVOICES_BY_DATE_PATH = `${INVOICE_STORE_PATH}/date`;
export const GET_INVOICES_BY_SEARCH_PATH = `${INVOICE_STORE_PATH}/search`;
export const UPDATE_INVOICE_PATH = `${INVOICE_STORE_PATH}/update`;
export const GET_ALL_WALLETS_BALANCE_PATH = `${USER_PATH}/wallet/balance/getall`;
export const GET_INVOICE_DATA_BY_ID_PATH = `${MAIN_PATH}/invoice/get`;
export const GET_WALLET_RECEIVE_PATH = `${USER_PATH}/wallet/receive`;
export const SEND_INVOICE_PATH = `${USER_PATH}/wallet/send`;
export const ESTIMATE_FEE_PATH = `${SEND_INVOICE_PATH}/estimate-fee`;
export const SEND_INOVICE_PRESETS_PATH = `${SEND_INVOICE_PATH}/get`;

export const UPDATE_STORE_OPTIONS_PATH = `${STORE_OPTION_PATH}/update`;
export const UPDATE_STORE_NOTIFICATIONS_PATH = `${STORE_OPTION_PATH}/notification/update`;
export const UPDATE_STORE_STORE_ID_PATH = `${STORE_OPTION_PATH}/storeid/update`;
export const UPDATE_STORE_API_KEY_PATH = `${STORE_OPTION_PATH}/apikey/update`;
export const UPDATE_USER_NOTIFICATIONS_PATH = `${USER_OPTION_PATH}/notification/update`;
export const UPDATE_WALLET_STATUS_PATH = `${WALLET_STATUS_PATH}/update`;
export const UPDATE_USER_OPTION_PATH = `${USER_OPTION_PATH}/update`;
export const UPDATE_PASSWORD_PATH = `${USER_PASSWORD_PATH}/update`;

export const CURRENCY_PRICE_PATH = `${MAIN_PATH}/currency/price/get`;
export const CURRENCY_USD_TO_CRYPTO_CONVERT_PATH = `${MAIN_PATH}/currency/convert/usd`;
export const CURRENCY_CRYPTO_TO_USD_CONVERT_PATH = `${MAIN_PATH}/currency/convert/crypto`;

export const WITHDRAW_LOG_PATH = `${USER_PATH}/withdraw-request/get/batch`;
export const TRANSACTIONS_LOG_PATH = `${USER_PATH}/transaction-history/date`;

export const LANDING_WRITEUS_PATH = `${MAIN_PATH}/main/form/send`;

export const ESTIMATE_FREEZE_PATH = `${MAIN_PATH}/user/wallet/trx/freeze/estimate`;
export const ESTIMATE_UNFREEZE_PATH = `${MAIN_PATH}/user/wallet/trx/unfreeze/estimate`;
export const CREATE_FREEZE_PATH = `${MAIN_PATH}/user/wallet/trx/freeze/create`;
export const CREATE_UNFREEZE_PATH = `${MAIN_PATH}/user/wallet/trx/unfreeze/create`;

export const CREATE_AUTH_MULTI_FACTOR_PATH = `${MAIN_PATH}/user/option/mfa/login/create`;
export const ENABLE_AUTH_MULTI_FACTOR_PATH = `${MAIN_PATH}/user/option/mfa/login/enable`;
export const DISABLE_AUTH_MULTI_FACTOR_PATH = `${MAIN_PATH}/user/option/mfa/login/disable`;

export const CREATE_SEND_MULTI_FACTOR_PATH = `${MAIN_PATH}/user/option/mfa/send/create`;
export const ENABLE_SEND_MULTI_FACTOR_PATH = `${MAIN_PATH}/user/option/mfa/send/enable`;
export const DISABLE_SEND_MULTI_FACTOR_PATH = `${MAIN_PATH}/user/option/mfa/send/disable`;

export const GET_ADDRESS_BOOKMARKS_BY_CURRENCY = `${MAIN_PATH}/user/address-bookmark/get`;
export const CREATE_ADDRESS_BOOKMARK = `${MAIN_PATH}/user/address-bookmark/create`;
export const DELETE_ADDRESS_BOOKMARK = `${MAIN_PATH}/user/address-bookmark/delete`;

export const CREATE_TICKET = `${MAIN_PATH}/ticket/create`;
export const CLOSE_TICKET = `${MAIN_PATH}/ticket/close`;
export const CREATE_TICKET_MESSAGE = `${MAIN_PATH}/ticket/message/create`;
export const GET_ALL_TICKETS = `${MAIN_PATH}/ticket/getall`;
export const GET_ALL_TICKET_MESSAGES = `${MAIN_PATH}/ticket/message/getall`;

export const BITSIDY_FEE_INVOICE = `${MAIN_PATH}/fee/invoice/getall`;
export const BITSIDY_FEE_SEND = `${MAIN_PATH}/fee/send/getall`;

export const SUBUSER_CREATE = `${MAIN_PATH}/user/sub-user/createv2`;
export const SUBUSER_LOGIN = `${MAIN_PATH}/user/sub-user/login`;
export const SUBUSER_RENAME = `${MAIN_PATH}/user/sub-user/rename`;
export const SUBUSER_GETALL = `${MAIN_PATH}/user/sub-user/login-all`;

export const getDesignTokens = (type: PaletteMode) => ({
  breakpoints: {
    values: {
      xs: 0,
      sm: 350,
      md: 900,
      lg: 1280,
      xl: 1680,
    },
  },
  palette: {
    type,
    ...(type === 'light'
      ? {
          custom: {
            blue: '#048BF8',
            white: '#ffffff',
            black: '#212121',
            svgWhite: '%23ffffff',
            svgBlack: '%23212121',
            trueWhite: '#ffffff',
            trueBlack: '#212121',
            gray: '#B7B7B7',
            lightGray: 'rgba(233 233 239 / 50%)',
            green: '#41a546',
            red: '#cb3030',
            yellow: '#EFA537',
            purple: '#935EBC',
            background: '#ffffff',
            opacity: {
              percent50: {
                gray: 'rgba(183, 183, 183, 0.5)',
                green: 'rgba(65, 165, 70, 0.5)',
                red: 'rgba(203, 48, 48, 0.5)',
              },
              percent25: {
                gray: 'rgba(183, 183, 183, 0.25)',
                green: 'rgba(65, 165, 70, 0.25)',
                red: 'rgba(203, 48, 48, 0.25)',
              },
              percent0: {
                gray: 'rgba(183, 183, 183, 0)',
                green: 'rgba(65, 165, 70, 0)',
                red: 'rgba(203, 48, 48, 0)',
              },
            },

            text: {
              secondary: '#808080',
            },
            codeSnippet: {
              green: '#468553',
              blue: '#048BF8',
              orange: '#BB6744',
              yellow: '#D9B207',
              purple: '#D46896',
            },
          },
          primary: {
            main: '#048BF8 !important', // fixed: main blue color
            dark: '#F9F9F9 !important',
          },
          secondary: {
            main: '#048BF8 !important',
            light: '#ffffff !important',
            dark: '#ffffff !important',
          },
          divider: '#ffffff !important',
          common: { white: '#ffffff !important', black: '#212121 !important' }, // fixed
          success: { main: '#0288D1 !important' },
          action: {
            active: '#36a2f9 !important',
          },
          background: {
            default: '#ffffff !important', // fixed
            paper: '#ffffff !important', // fixed
          },
          text: {
            primary: '#212121 !important', // fixed
            secondary: '#808080 !important', // fixed: all grey text for headers and subheaders
            hint: '#000000 !important',
          },
          warning: {
            dark: '#ED6C02',
            light: '#D32F2F',
            main: '#2E7D32',
          },
        }
      : {
          custom: {
            blue: '#048BF8',
            white: '#000000',
            black: '#ffffff',
            svgWhite: '%23000000',
            svgBlack: '%23ffffff',
            trueWhite: '#ffffff',
            trueBlack: '#212121',
            gray: '#B7B7B7',
            lightGray: 'rgb(22, 22, 28)',
            green: '#35C43C',
            red: '#F42828',
            yellow: '#F7A52A',
            purple: '#935EBC',
            background: '#0D0F10',
            opacity: {
              percent50: {
                gray: 'rgba(183, 183, 183, 0.75)',
                green: 'rgba(53, 196, 60, 0.75)',
                red: 'rgba(244, 40, 40, 0.75)',
              },
              percent25: {
                gray: 'rgba(183, 183, 183, 0.35)',
                green: 'rgba(53, 196, 60, 0.35)',
                red: 'rgba(244, 40, 40, 0.35)',
              },
              percent0: {
                gray: 'rgba(183, 183, 183, 0)',
                green: 'rgba(53, 196, 60, 0)',
                red: 'rgba(244, 40, 40, 0)',
              },
            },
            text: {
              secondary: '#808080',
            },
            codeSnippet: {
              green: '#54cf6e',
              blue: '#048BF8',
              orange: '#ef916b',
              yellow: '#D9B207',
              purple: '#D46896',
            },
          },
          primary: {
            main: '#048BF8 !important', // fixed: main blue color
            dark: '#2E3436 !important',
          },
          secondary: {
            main: '#161616 !important',
            light: '#1F2325 !important',
            dark: '#000000 !important',
          },
          success: { main: '#29B6F6 !important' },
          divider: '#272C2D !important',
          common: { white: '#000000 !important', black: '#ffffff !important' }, // fixed
          action: {
            active: '#2d2d2d !important',
          },
          background: {
            default: '#0D0F10 !important', // fixed
            paper: '#0D0F10 !important', // fixed
          },
          text: {
            primary: '#ffffff !important', // fixed
            secondary: '#C2C3C3 !important', // fixed: all grey text for headers and subheaders
            hint: '#29B6F6 !important',
          },
          warning: {
            dark: '#EF6C00',
            light: '#FF0303',
            main: '#00AB09',
          },
        }),
  },
});

type CopiedValue = string | null;
type CopyFn = (text: string) => Promise<boolean>; // Return success

export const useCopyToClipboard = (): [CopiedValue, CopyFn] => {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);

  const copy: CopyFn = async (text) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      setCopiedText(null);
      return false;
    }
  };

  return [copiedText, copy];
};

export const getData = async (url = '') => {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  });

  return response.json();
};

export const postData = async (url = '', data = {}, sendFingerprint = true) => {
  if (sendFingerprint) {
    let fingerprintHash = store.getHash();
    if (fingerprintHash == '') {
      fingerprintHash = await getFingerprintHash();
      store.setHash(fingerprintHash);
    }
    data['fingerprint'] = fingerprintHash;
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data),
  });

  const result: any = await response.json();
  if (
    'result' in result &&
    'data' in result &&
    result['result'] === 'error' &&
    result['data']['message'] === 'User is not recognized'
  ) {
    store.clear();
    const w: Window = window;
    w.location = '/login';
    return;
  }

  return result;
};

const getFingerprintHash = async (): Promise<string> => {
  let fpHashed = '';
  let keys = [
    'screenResolution',
    'availableScreenResolution',
    'plugins',
    'fonts',
    'audio',
    'canvas',
  ];

  try {
    const fp = await FingerprintJS.getPromise((components: any) => components);
    const fpFiltered = fp.filter((x: any) => !keys.includes(x.key));
    //console.log(JSON.stringify(fpFiltered))
    fpHashed = md5(JSON.stringify(fpFiltered));
    if (typeof fpHashed !== 'string') {
      fpHashed = '';
    }
  } catch (e) {
    fpHashed = '';
  }

  return fpHashed;
};

export const sortFunction = (a: string, b: string) => {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }

  return 0;
};

export const getAddressUrlByParams = (currency: string, hash: string) => {
  if (hash === null) {
    return '';
  }

  const EXPLORERS = {
    BTC: 'https://blockchair.com/bitcoin/address/',
    BTC_legacy: 'https://blockchair.com/bitcoin/address/',
    BTC_p2sh: 'https://blockchair.com/bitcoin/address/',
    LTC: 'https://blockchair.com/litecoin/address/',
    LTC_legacy: 'https://blockchair.com/litecoin/address/',
    LTC_p2sh: 'https://blockchair.com/litecoin/address/',
    ETH: 'https://etherscan.io/address/',
    DOGE: 'https://blockchair.com/dogecoin/address/',
    TRX: 'https://tronscan.org/#/address/',
    'USDT.TRC20': 'https://tronscan.org/#/address/',
    'BUSD.TRC20': 'https://tronscan.org/#/address/',
    USDT_trc20: 'https://tronscan.org/#/address/',
    BUSD_trc20: 'https://tronscan.org/#/address/',
  };

  const explorer = EXPLORERS[currency];
  if (explorer === undefined) {
    return '';
  }

  return explorer + hash;
};

export const getTransactionUrlByParams = (currency: string, hash: string) => {
  if (hash === null) {
    return '';
  }

  const EXPLORERS = {
    BTC: 'https://blockchair.com/bitcoin/transaction/',
    BTC_legacy: 'https://blockchair.com/bitcoin/transaction/',
    BTC_p2sh: 'https://blockchair.com/bitcoin/transaction/',
    LTC: 'https://blockchair.com/litecoin/transaction/',
    LTC_legacy: 'https://blockchair.com/litecoin/transaction/',
    LTC_p2sh: 'https://blockchair.com/litecoin/transaction/',
    ETH: 'https://etherscan.io/tx/',
    DOGE: 'https://blockchair.com/dogecoin/transaction/',
    TRX: 'https://tronscan.org/#/transaction/',
    'USDT.TRC20': 'https://tronscan.org/#/transaction/',
    'BUSD.TRC20': 'https://tronscan.org/#/transaction/',
    USDT_trc20: 'https://tronscan.org/#/transaction/',
    BUSD_trc20: 'https://tronscan.org/#/transaction/',
  };

  const explorer = EXPLORERS[currency];
  if (explorer === undefined) {
    return '';
  }

  return explorer + hash;
};

export const INVOICE_SEVERITIES = {
  success: 'green',
  detected: 'yellow',
  wait: 'gray',
  processing: 'gray',
  underpaid: 'red',
  expired: 'red',
  fail: 'red',
};

export const TRANSACTION_SEVERITIES = {
  send: 'blue',
  receive: 'green',
};

export const CURRENCIES = [
  {
    name: 'Litecoin',
    shortName: 'LTC',
    internalName: 'LTC',
    displayName: 'Litecoin',
  },
  {
    name: 'Bitcoin',
    shortName: 'BTC',
    internalName: 'BTC',
    displayName: 'Bitcoin',
  },
  {
    name: 'Litecoin',
    shortName: 'LTC',
    internalName: 'LTC_p2sh',
    displayName: 'Litecoin (p2sh)',
  },
  {
    name: 'Bitcoin',
    shortName: 'BTC',
    internalName: 'BTC_p2sh',
    displayName: 'Bitcoin (p2sh)',
  },
  {
    name: 'Bitcoin',
    shortName: 'BTC',
    internalName: 'BTC_legacy',
    displayName: 'Bitcoin (legacy)',
  },
  {
    name: 'Litecoin',
    shortName: 'LTC',
    internalName: 'LTC_legacy',
    displayName: 'Litecoin (legacy)',
  },
  {
    name: 'Ethereum',
    shortName: 'ETH',
    internalName: 'ETH',
    displayName: 'Ethereum',
  },
  {
    name: 'Dogecoin',
    shortName: 'DOGE',
    internalName: 'DOGE',
    displayName: 'Dogecoin',
  },
  {
    name: 'Tron',
    shortName: 'TRX',
    internalName: 'TRX',
    displayName: 'Tron',
  },
  {
    name: 'USDT-TRON',
    shortName: 'USDT.TRC20',
    internalName: 'USDT_trc20',
    displayName: 'USDT.TRC20',
  },
  {
    name: 'BUSD-TRON',
    shortName: 'BUSD.TRC20',
    internalName: 'BUSD_trc20',
    displayName: 'BUSD.TRC20',
  },
];

export const getCurrencyName = (name: string, type: string = 'name'): string => {
  let temp = [];

  temp = CURRENCIES.filter((x) => x.shortName === name);
  if (temp.length) {
    return temp[0][type];
  }

  temp = CURRENCIES.filter((x) => x.internalName === name);
  if (temp.length) {
    return temp[0][type];
  }

  temp = CURRENCIES.filter((x) => x.name === name);
  if (temp.length) {
    return temp[0][type];
  }

  return name;
};

export const getDaysAgo = (date: string): string => {
  try {
    if (date == undefined) {
      return '';
    }
    const now = new Date();
    const parsedDate = new Date(date + 'Z');
    const diff = new Date(
      Math.abs(
        new Date(now.toDateString()).getTime() - new Date(parsedDate.toDateString()).getTime(),
      ),
    );
    const daysAgo = Math.floor(diff.valueOf() / 1000 / 60 / 60 / 24);
    let daysAgoText = daysAgo + ' days ago';
    if (daysAgo === 1) {
      daysAgoText = daysAgo + ' day ago';
    } else if (daysAgo === 0) {
      daysAgoText = 'today';
    }
    return daysAgoText;
  } catch {
    return '';
  }
};

export const dateLocalForAPI = (date: Date): string => {
  try {
    const dtTrimmed = new Date(trimTimeFromDate(date.toISOString()));
    const dtLocal = new Date(dtTrimmed.getTime() + dtTrimmed.getTimezoneOffset() * 60000);
    return dtLocal.toISOString();
  } catch {
    return trimTimeFromDate(date.toISOString());
  }
};

export const datePrepare = (date: string): string => {
  try {
    return datePrepareLocal(date.split('.')[0].replace('T', ' ') + ' UTC');
  } catch {
    return date;
  }
};

export const trimTimeFromDate = (date: string) => {
  return date.split('T')[0] + 'T00:00:00.000Z';
};

const datePrepareLocal = (date: string): string => {
  const dateTime = new Date(date);
  if (isNaN(dateTime.getTime())) {
    throw new Error('Invalid date');
  }

  const timeZone = (dateTime.getTimezoneOffset() / 60) * -1;
  const dateTimeLocalString = dateTime.toLocaleString('ca');
  const dateTimeParts = dateTimeLocalString.split(' ');
  if (dateTimeParts.length != 2) {
    throw new Error('Invalid date');
  }
  const dateParts = dateTimeParts[0].split('/');
  const timeParts = dateTimeParts[1].split(':');
  if (dateParts.length < 3 || timeParts.length < 3) {
    throw new Error('Invalid date');
  }

  const dateResult =
    dateParts[2] +
    '-' +
    (parseInt(dateParts[1]) > 9 ? dateParts[1] : '0' + dateParts[1]) +
    '-' +
    (parseInt(dateParts[0]) > 9 ? dateParts[0] : '0' + dateParts[0]);
  const timeResult =
    (parseInt(timeParts[0]) > 9 ? timeParts[0] : '0' + timeParts[0]) +
    ':' +
    timeParts[1] +
    ':' +
    timeParts[2];
  const timeZoneResult = 'UTC' + (timeZone == 0 ? '' : timeZone >= 0 ? '+' + timeZone : timeZone);

  return dateResult + ' ' + timeResult + ' ' + timeZoneResult;
};

export const toCsvSafeString = (data: string[]) => {
  const tempData: string[] = [];
  data.forEach((row) => tempData.push('"' + row.replace('"', "'") + '"'));
  return tempData.join(',') + '\n';
};

export const formatDate = (date: string) => {
  try {
    let dt = new Date(date);
    const year = dt.getFullYear();
    const month = dt.getMonth() + 1;
    const day = dt.getDate();
    return `${year}-${month > 9 ? month : '0' + month.toString()}-${
      day > 9 ? day : '0' + day.toString()
    }`;
  } catch {
    return date;
  }
};

export const getToken = async () => {
  const originalToken = localStorage.getItem('bitsidyAccessToken') || '';
  return originalToken;
};

export const structuredClone = (data: any) => {
  return JSON.parse(JSON.stringify(data));
};
