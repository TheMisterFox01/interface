import { useEffect, useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles'

const Checkbox = ({
  label = '',
  checked = false,
  setChecked,
  className = '',
}: {
  label: string;
  checked: boolean;
  setChecked: (checked: boolean) => void;
  className?: string;
}) => {
  const [localChecked, setLocalChecked] = useState(checked);

  useEffect(() => {
    setChecked(localChecked);
  }, [localChecked]);

  const styles = useStyles();

  return (
    <div
      className={className + ' ' + styles.checkboxContainer + ' ' + (localChecked ? styles.checked : '')}
      onClick={() => setLocalChecked(!localChecked)}
    >
      <div className={styles.checkboxLabel}>{label}</div>
      <input className={styles.input} type="checkbox" />
      <div className={styles.checkmark}></div>
    </div>
  );
};

export default Checkbox;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      checkboxContainer: {
        position: 'relative',
        paddingLeft: '35px',
        cursor: 'pointer',
        fontSize: '22px',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        height: '24px',
        minHeight: '24px',
        maxHeight: '24px',
        boxSizing: 'border-box',
        '& $input': {
          position: 'absolute',
          opacity: 0,
          cursor: 'pointer',
          height: 0,
          width: 0,
        },
        '&:hover $input ~ $checkmark': {
          borderColor: theme.palette.primary.main,
          borderWidth: '2px',
          padding: '0px',
          '&:after': {
            left: '7px',
            top: '4px',
          }
        },
        '& $input ~ $checkmark': {
          backgroundColor: 'initial',
          borderColor: theme.palette.text.secondary,
          borderWidth: '1px',
          padding: '1px',
          '&:after': {
            display: 'none'
          }
        },
        '&$checked $input ~ $checkmark': {
          backgroundColor: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
          '&:after': {
            display: 'block'
          }
        },
        '& $checkmark:after': {
          left: '8px',
          top: '5px',
          width: '6px',
          height: '10px',
          borderStyle: 'solid',
          borderColor: 'white',
          borderWidth: '0 2px 2px 0',
          transform: 'rotate(45deg)',
        }
      },
      checkmark: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '22px',
        width: '22px',
        borderRadius: '6px',
        borderStyle: 'solid',
        '&:after': {
          content: '""',
          position: 'absolute',
          display: 'none',
        },
      },
      input: { },
      checked: { },
      checkboxLabel: {
        fontSize: '16px',
        color: theme.palette.text.primary,
      }
    }),
  { name: 'Checkbox' },
);
