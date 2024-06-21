import { ChangeEvent, Dispatch, SetStateAction } from 'react';

import CustomSwitcher from 'elements/customComponents/CustomSwitcher';
import CustomFormControlLabel from 'elements/customComponents/CustomFormControlLabel';

type WalletChange = {
  currencyInternalName: string;
  isActive: boolean;
};

type StoreSwitcherProps = {
  label: string;
  internalName: string;
  isActive: boolean;
  setWalletChange: Dispatch<SetStateAction<WalletChange | undefined>>;
};

const WalletSwitcher = ({
  label,
  internalName,
  isActive,
  setWalletChange,
}: StoreSwitcherProps): JSX.Element => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    event.preventDefault();
    setWalletChange({
      currencyInternalName: internalName,
      isActive: checked,
    } as WalletChange);
  };

  return (
    <CustomFormControlLabel
      sx={{ ml: 0, justifyContent: 'flex-start' }}
      labelPlacement="end"
      control={<CustomSwitcher checked={isActive} onChange={handleChange}/>}
      label={label}
    />
  );
};

export default WalletSwitcher;
