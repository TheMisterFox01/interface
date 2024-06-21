import { createStyles, makeStyles } from '@material-ui/core/styles';

const Button = ({
  className = '',
  onClick = () => {},
  variant = 'contained',
  children = '',
  backgroundColor = '',
  size = '',
  disabled = false,
  startIcon = '',
  fitContent = false,
}: {
  className?: string;
  onClick?: (e?: any) => void;
  variant?: string;
  children?: any;
  backgroundColor?: string;
  size?: string;
  disabled?: boolean;
  startIcon?: any;
  fitContent?: boolean;
}) => {
  const styles = useStyles();

  let classList: any[] = [];
  classList.push(styles.content);
  classList.push(className);

  if (size === 'large') {
    classList.push(styles.large);
  } else if (size === 'medium') {
    classList.push(styles.medium);
  } else {
    classList.push(styles.small);
  }

  if (disabled) {
    classList.push(styles.disabled);
  }

  if (fitContent) {
    classList.push(styles.fitContent);
  }

  if (variant === 'contained') {
    if (backgroundColor == '') {
      classList.push(styles.contained);
    } else {
      const specialStyles = makeStyles(
        () =>
          createStyles({
            customBackground: {
              backgroundColor: backgroundColor,
              borderColor: backgroundColor,
              borderWidth: '1px',
              borderStyle: 'solid',
            },
          }),
        { name: 'ButtonCustom' },
      )();
      classList.push(specialStyles.customBackground);
    }
  } else if (variant === 'outlined') {
    classList.push(styles.outlined);
  } else if (variant === 'none') {
    classList.push(styles.default);
  }

  return (
    <div className={classList.join(' ')} onClick={onClick}>
      {startIcon != '' && <div className={styles.icon}>{startIcon}</div>} {children}
    </div>
  );
};

export default Button;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      fitContent: {
        width: 'fit-content',
      },
      icon: {
        marginRight: '10px',
      },
      content: {
        cursor: 'pointer',
        borderRadius: '6px',
        minWidth: '64px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Montserrat, sans-serif',
      },
      contained: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.background.default,
        borderWidth: '1px',
        borderColor: theme.palette.primary.main,
        borderStyle: 'solid',
      },
      outlined: {
        color: theme.palette.common.black,
        borderWidth: '1px',
        borderColor: theme.palette.common.black,
        borderStyle: 'solid',
      },
      default: {
        color: theme.palette.common.black,
      },
      large: {
        padding: '20px 28px',
      },
      medium: {
        padding: '17px 16px',
      },
      small: {
        padding: '12px 16px',
      },
      disabled: {
        pointerEvents: 'none',
      },
    }),
  { name: 'Button' },
);
