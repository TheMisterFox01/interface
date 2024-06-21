import { useEffect, useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const TextField = ({
  className = '',
  value = '',
  label = '',
  onChange = () => {},
  onMouseLeave = () => {},
  type = 'text',
  error = false,
  endAdornment = '',
  onKeyPress = () => {},
  onClick = () => {},
  multiline = false,
  rows = 6,
  readonly = false,
  autofocus = false,
  fullwidth = false,
  select = false,
  id = '',
  children = '',
  disabled = false,
  autocomplete = 'off',
}: {
  className?: string;
  value?: string | number;
  label?: string;
  onChange?: (event?: any) => void;
  onMouseLeave?: (event?: any) => void;
  type?: string;
  error?: boolean;
  endAdornment?: string | JSX.Element;
  onKeyPress?: (event?: any) => void;
  onClick?: (event?: any) => void;
  multiline?: boolean;
  rows?: number;
  readonly?: boolean;
  autofocus?: boolean;
  fullwidth?: boolean;
  id?: string;
  select?: boolean;
  children?: any;
  disabled?: boolean;
  autocomplete?: string;
}) => {
  const styles = useStyles();
  const [props, setProps] = useState({});
  const [isError, setIsError] = useState(error);
  const [isFocus, setIsFocus] = useState(false);

  const init = () => {
    let data = {};
    if (id != '') {
      data['id'] = id;
    }
    if (autofocus) {
      data['autofocus'] = true;
    }
    if (readonly || disabled) {
      data['readonly'] = true;
    }
    if (disabled) {
      data['disabled'] = true;
    }
    if (autocomplete !== 'off') {
      data['autocomplete'] = autocomplete;
    }
    setProps(data);
  };

  const checkError = () => {
    setIsError(error);
  };

  const focusIn = () => {
    setIsFocus(true);
  };

  const focusOut = () => {
    setIsFocus(false);
  };

  useEffect(init, [readonly, disabled]);
  useEffect(init, []);
  useEffect(checkError, [error]);

  return (
    <div className={className + ' ' + styles.container + ' ' + (fullwidth ? styles.fullWidth : '')}>
      {endAdornment != '' && <div className={styles.endAdornment}>{endAdornment}</div>}
      <div
        className={
          styles.textField +
          ' ' +
          (isFocus ? styles.focused : '') +
          ' ' +
          (isError ? styles.textFieldErrorColor : styles.textFieldRegularColor) +
          ' ' +
          (props['readonly'] ? styles.readOnly : '')
        }
      >
        <label
          className={styles.label + ' ' + (value === '' ? styles.labelNotShown : styles.labelShown)}
        >
          {label}
        </label>
        {select ? (
          <select
            onChange={onChange}
            onKeyPress={onKeyPress}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            className={styles.select}
            {...props}
          >
            {children}
          </select>
        ) : multiline ? (
          <textarea
            className={styles.textarea}
            rows={rows}
            onChange={onChange}
            onKeyPress={onKeyPress}
            value={value}
          />
        ) : (
          <input
            value={value}
            onChange={onChange}
            onKeyPress={(event) => {
              if (event.key === 'Tab') {
                focusOut();
              }
              onKeyPress(event);
            }}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            onFocus={focusIn}
            onBlur={focusOut}
            className={styles.input}
            type={type}
            {...props}
          />
        )}
      </div>
    </div>
  );
};

export default TextField;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      container: {
        position: 'relative',
      },
      fullWidth: {
        width: '100%',
      },
      label: {
        position: 'absolute',
        left: 0,
        top: 0,
        transition:
          'color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms, transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms, max-width 200ms cubic-bezier(0, 0, 0.2, 1) 0ms',
        background: theme.palette.background.default,
      },
      endAdornment: {
        position: 'absolute',
        top: 0,
        zIndex: 100,
        transform: 'translate(0px, 11px)',
        right: '15px',
        lineHeight: 1.6,
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.default,
        padding: '4px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '34px',
        boxSizing: 'border-box',
        textAlign: 'right',
        fontSize: '14px',
      },
      input: {
        padding: '16px 14px',
        width: '100%',
        boxSizing: 'border-box',
        borderWidth: '0px',
        background: 'none',
        outline: 'none',
        color: theme.palette.text.primary,
        '&:hover, &:visited, &:focus, &:active, &:focus-visible': {
          borderWidth: '0px',
          outline: 'none',
        },
      },
      textarea: {
        resize: 'none',
        padding: '16px 14px',
        width: '100%',
        boxSizing: 'border-box',
        borderWidth: '0px',
        background: 'none',
        outline: 'none',
        color: theme.palette.text.primary,
        '&:hover, &:visited, &:focus, &:active, &:focus-visible': {
          borderWidth: '0px',
          outline: 'none',
        },
      },
      select: {
        padding: '16px 14px',
        width: '100%',
        boxSizing: 'border-box',
        borderWidth: '0px',
        outline: 'none',
        appearance: 'none',
        background: 'transparent',
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'><path d='M3.81 4.38 8 8.57l4.19-4.19 1.52 1.53L8 11.62 2.29 5.91l1.52-1.53z' fill='" +
          theme.palette.text.secondary +
          '\'/></svg>")',
        backgroundRepeat: 'no-repeat',
        backgroundPositionX: 'calc(100% - 8px)',
        backgroundPositionY: '50%',
        paddingRight: '30px',
        color: theme.palette.text.primary,
        '&:hover, &:visited, &:focus, &:active, &:focus-visible': {
          borderWidth: '0px',
          outline: 'none',
        },
        '& > option': {
          background: theme.palette.background.default,
          '&:checked, &:hover': {
            background: theme.palette.primary.main,
          },
        },
      },
      focused: {},
      textField: {
        zIndex: 10,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: '6px',
        padding: '1px',
        position: 'relative',
        '& > $label': {
          paddingLeft: '6px',
          paddingRight: '6px',
          paddingTop: '1px',
          color: theme.palette.text.primary,
        },
        '&:hover, &:visited, &:focus, &:active, &:focus-visible, &$focused': {
          borderWidth: '2px',
          '&:not($textFieldErrorColor)': {
            borderColor: theme.palette.primary.main,
          },
          '&.$textFieldErrorColor': {
            borderColor: theme.palette.text.secondary,
          },
          padding: '0px',
          '&$readOnly': {
            borderWidth: '1px',
            borderColor: theme.palette.text.secondary,
            padding: '1px',
            '& > $label': {
              transform: 'translate(0px, -10px) scale(0.8)',
              color: theme.palette.text.primary,
              paddingTop: '1px',
              paddingLeft: '6px',
            },
          },
          '& > $label': {
            transform: 'translate(0px, -10px) scale(0.8)',
            color: theme.palette.primary.main,
            paddingTop: '0px',
            paddingLeft: '5px',
          },
        },
      },
      readOnly: {
        borderWidth: '1px',
        borderColor: theme.palette.text.secondary,
        padding: '1px',
        '& > $label': {
          color: theme.palette.text.primary,
          paddingTop: '1px',
          paddingLeft: '6px',
        },
      },
      labelShown: {
        transform: 'translate(0px, -10px) scale(0.8)',
      },
      labelNotShown: {
        transform: 'translate(14px, 16px) scale(1)',
      },
      textFieldErrorColor: {
        borderColor: theme.palette.text.secondary,
      },
      textFieldRegularColor: {
        borderColor: theme.palette.text.secondary,
      },
    }),
  { name: 'Textfield' },
);
