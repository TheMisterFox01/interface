import { ChangeEvent, SetStateAction, Dispatch } from 'react';

import CustomSwitcher from 'elements/customComponents/CustomSwitcher';
import CustomFormControlLabel from 'elements/customComponents/CustomFormControlLabel';

type NotificationChange = {
  userActionName: string;
  isActive: boolean;
};

type StoreSwitcherProps = {
  label: string;
  isActive: boolean;
  setNotificationChange: Dispatch<SetStateAction<NotificationChange | undefined>>;
};

const NotificationSwitcher = ({
  label,
  isActive,
  setNotificationChange,
}: StoreSwitcherProps): JSX.Element => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    event.preventDefault();
    setNotificationChange({
      userActionName: label,
      isActive: checked,
    } as NotificationChange);
  };

  return (
    <CustomFormControlLabel
      sx={{ ml: 0, justifyContent: 'flex-start' }}
      labelPlacement="end"
      control={<CustomSwitcher checked={isActive} onChange={handleChange} />}
      label={label}
    />
  );
};

export default NotificationSwitcher;
