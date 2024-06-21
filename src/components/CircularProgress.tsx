import { createStyles, makeStyles } from '@material-ui/core/styles';

const CircularProgress = ({
  size = 36,
  onButton = false,
}: {
  size?: number;
  onButton?: boolean;
}) => {
  const styles = makeStyles(
    (theme) =>
      createStyles({
        loadingContainer: {
          width: size + 'px',
          height: size + 'px',
          minWidth: size + 'px',
          minHeight: size + 'px',
          maxWidth: size + 'px',
          maxHeight: size + 'px',
        },
        loading: {
          animation: '$rotation 1.4s linear infinite',
          width: size + 'px',
          height: size + 'px',
        },
        circle: {
          stroke: onButton ? theme.palette.background.default : theme.palette.primary.main,
          animation: '$animation 1.4s ease-in-out infinite',
        },
        '@keyframes animation': {
          '0%': {
            strokeDasharray: '1px,200px',
            strokeDashoffset: 0,
          },
          '50%': {
            strokeDasharray: '100px, 200px',
            strokeDashoffset: '-15px',
          },
          '100%': {
            strokeDasharray: '100px, 200px',
            strokeDashoffset: '-125px',
          },
        },
        '@keyframes rotation': {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
      }),
    { name: 'CircularProgress' },
  )();

  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loading}>
        <svg viewBox={`${size / 2} ${size / 2} ${size} ${size}`}>
          <circle
            cx={size}
            cy={size}
            r={(5 * size) / 12}
            fill="none"
            strokeWidth={size / 10}
            className={styles.circle}
          ></circle>
        </svg>
      </div>
    </div>
  );
};

export default CircularProgress;
