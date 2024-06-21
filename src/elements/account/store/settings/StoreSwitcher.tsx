import { Dispatch, SetStateAction, ChangeEvent } from 'react';

import CustomFormControlLabel from 'elements/customComponents/CustomFormControlLabel';
import CustomSwitch from 'elements/customComponents/CustomSwitcher';
import type { NotificationChange } from './StoreSettings';

type StoreSwitcherProps = {
  label: string;
  isActive: boolean;
  setNotificationChange: Dispatch<SetStateAction<NotificationChange | undefined>>;
};

const StoreSwitcher = (props: StoreSwitcherProps): JSX.Element => {
  const { label, isActive, setNotificationChange } = props;

  const handleChange = (_: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setNotificationChange([label, checked]);
  };

  return (
    <CustomFormControlLabel
      labelPlacement="end"
      sx={{
        ml: 0,
        justifyContent: 'flex-start',
      }}
      control={<CustomSwitch checked={isActive} onChange={handleChange} />}
      label={label}
    />
  );
};

export default StoreSwitcher;
