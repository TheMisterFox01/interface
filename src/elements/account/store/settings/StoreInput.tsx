import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';

import { createStyles, makeStyles } from '@material-ui/core/styles';

import { OptionChange, StoreOptions } from './StoreSettings';
import TextField from 'components/TextField';

type StoreInformationInputProps = {
  label: string;
  content: string;
  optionKey: keyof StoreOptions;
  setOptionChange: Dispatch<SetStateAction<OptionChange | undefined>>;
};

const StoreInput = ({
  content,
  label,
  optionKey,
  setOptionChange,
}: StoreInformationInputProps): JSX.Element => {
  const styles = useStyles();
  const [value, setValue] = useState(content);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value;
    if (label === 'Store name' && newValue.length > 30) {
      return;
    }
    if (newValue.length > 200) {
      return;
    }
    setValue(newValue);
    setOptionChange([optionKey, newValue]);
  };

  return (
    <div
      style={{
        width: '320px',
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <TextField
        label={label}
        className={styles.storeInput}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export default StoreInput;


const useStyles = makeStyles(
  () =>
    createStyles({
      storeInput: {
        width: '100%',
        textAlign: 'center',
      },
    }),
  { name: 'StoreInput' },
);
