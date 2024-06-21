import { createStyles, makeStyles } from '@material-ui/core/styles'

const IconButton = ({
  className = '',
  onClick = () => {},
  children = '',
  size = '',
}: {
  className?: string;
  onClick?: (e?: any) => void;
  children?: any;
  size?: string;
}) => {
  const styles = useStyles();
  let typeClass = styles.default;

  switch (size) {
    case 'large':
      typeClass = styles.large;
      break
    case 'medium':
      typeClass = styles.medium;
      break
    case 'small':
      typeClass = styles.small;
      break
    case 'zero':
      typeClass = styles.zero;
      break
  }

  return (
    <div className={styles.content + ' ' + className + ' ' + typeClass} onClick={onClick}>
      {children}
    </div>
  );
};

export default IconButton;

const useStyles = makeStyles(
  () =>
    createStyles({
      content: {
        cursor: 'pointer',
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        verticalAlign: 'middle',
      },
      large: {
        padding: '12px',
        fontSize: '28px',
      },
      medium: {
        padding: '8px',
        fontSize: '24px',
      },
      small: {
        padding: '5px',
        fontSize: '18px',
      },
      zero: {
        padding: '0px',
        fontSize: '24px',
      },
      default: {
        padding: '8px',
        fontSize: '24px',
      }
    }),
  { name: 'IconButton' },
);
