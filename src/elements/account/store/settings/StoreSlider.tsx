import { Dispatch, SetStateAction, useState } from 'react';

import Slider from '@mui/material/Slider';
import { Typography } from '@mui/material';
import Tooltip from 'components/Tooltip';
import IconButton from 'components/IconButton';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';

import { createStyles, makeStyles } from '@material-ui/core/styles';

import { StoreOptions, OptionChange } from './StoreSettings';

type StoreSliderProps = {
  label: string;
  content: number;
  tooltipDescription: string;
  optionKey: keyof StoreOptions;
  setOptionChange: Dispatch<SetStateAction<OptionChange | undefined>>;
};

const marksByType = {
  allowedUnderpaidPercent: [
    {
      value: 0,
      label: '0',
    },
    {
      value: 50,
      label: '50',
    },
  ],
  invoiceExpiration: [
    {
      value: 0,
      label: '0',
    },
    {
      value: 24,
      label: '24',
    },
  ],
  invoiceExtendedExpiration: [
    {
      value: 0,
      label: '0',
    },
    {
      value: 48,
      label: '48',
    },
  ],
};

const maxByType = {
  allowedUnderpaidPercent: 50,
  invoiceExpiration: 24,
  invoiceExtendedExpiration: 48,
};

const marks = [
  {
    value: 0,
    label: '0',
  },
  {
    value: 100,
    label: '100',
  },
];

const hourLabelFormat = (value: number) => `${value} hours`;
const percentLabelFormat = (value: number) => `${value}%`;

const StoreSlider = ({
  label,
  content,
  optionKey,
  setOptionChange,
  tooltipDescription,
}: StoreSliderProps): JSX.Element => {
  const styles = useStyles();
  const [value, setValue] = useState(content);
  const valueLabelFormat =
    optionKey === 'allowedUnderpaidPercent' ? percentLabelFormat : hourLabelFormat;
  const currentMarks = optionKey in marksByType ? marksByType[optionKey] : marks;
  const currentMax = optionKey in maxByType ? maxByType[optionKey] : 100;

  const handleChange = (_event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setValue(newValue);
      setOptionChange([optionKey, String(newValue)]);
    }
  };

  return (
    <div className={styles.content}>
      <Typography className={styles.label} gutterBottom>
        {label}
        <Tooltip text={tooltipDescription}>
          <IconButton>
            <LiveHelpIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Typography>

      <Slider
        className={styles.slider}
        valueLabelDisplay="on"
        value={value}
        onChange={handleChange}
        valueLabelFormat={valueLabelFormat}
        step={1}
        marks={currentMarks}
        max={currentMax}
      />
    </div>
  );
};

export default StoreSlider;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      content: {
        width: '320px',
      },
      slider: {
        color: theme.palette.primary.main,
        '& .MuiSlider-track': {
          border: 'none',
        },
        '& .MuiSlider-thumb': {
          backgroundColor: theme.palette.primary.main,
        },
        '& .MuiSlider-markLabel': {
          fontFamily: 'Montserrat, sans-serif',
        },
        '& .MuiSlider-valueLabel': {
          fontFamily: 'Montserrat, sans-serif',
        },
      },
      label: {
        marginBottom: '40px !important',
        fontFamily: 'Montserrat, sans-serif',
      },
    }),
  { name: 'StoreSlider' },
);
