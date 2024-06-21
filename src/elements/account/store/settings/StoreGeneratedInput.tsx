import { useState } from 'react';
import { useRouter } from 'next/router';

import Button from 'components/Button';

import { createStyles, makeStyles } from '@material-ui/core/styles';

import { StoreOptions } from './StoreSettings';
import TextField from 'components/TextField';
import { postData, UPDATE_STORE_STORE_ID_PATH, UPDATE_STORE_API_KEY_PATH } from 'utils';

type StoreGeneratedInputProps = {
  label: string;
  content: string;
  optionKey: keyof StoreOptions;
  storeId: string;
};

const path = {
  storeId: UPDATE_STORE_STORE_ID_PATH,
  apiKey: UPDATE_STORE_API_KEY_PATH,
};

const StoreGeneratedInput = ({
  content,
  label,
  optionKey,
  storeId,
}: StoreGeneratedInputProps): JSX.Element => {
  const router = useRouter();
  const styles = useStyles();
  const [value, setValue] = useState(content);
  const generateNewValue = async () => {
    const token = localStorage.getItem('bitsidyAccessToken') || '';

    const response = await postData(path[optionKey], {
      token,
      storeId,
    });

    const newValue = response.data;
    setValue(newValue);

    if (optionKey === 'storeId') {
      router.push('/account/store');
    }
  };

  return (
    <div className={styles.content}>
      <TextField
        readonly={true}
        className={styles.generatedInput}
        label={label}
        value={value}
      />
      <div style={{ display: 'flex', alignItems: 'end' }}>
        <Button
          className={styles.generateNew}
          variant="outlined"
          onClick={generateNewValue}
          size="medium"
        >
          generate&nbsp;new
        </Button>
      </div>
    </div>
  );
};

export default StoreGeneratedInput;


const useStyles = makeStyles(
  (theme) =>
    createStyles({
      content: {
        marginBottom: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        [theme.breakpoints.up('md')]: {
          flexWrap: 'wrap',
        },
        [theme.breakpoints.down('md')]: {
          mb: '60px',
        },
        [theme.breakpoints.up('lg')]: {
          flexWrap: 'nowrap',
        },
      },
      generateNew: {
        marginTop: '20px',
        [theme.breakpoints.up('lg')]: {
          marginTop: 0,
        },
      },
      generatedInput: {
        marginRight: '20px',
        width: '100%',
        minWidth: '320px',
      },
    }),
  { name: 'StoreSettings' },
);
