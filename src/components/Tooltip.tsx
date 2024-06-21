import { createStyles, makeStyles } from '@material-ui/core/styles'

const Tooltip = ({
  children,
  text,
  placement = 'center'
}: {
  children: any;
  text: string;
  placement?: string
}) => {
  const styles = useStyles();

  let placementClass = styles.placementCenter;
  switch (placement) {
    case 'left':
      placementClass = styles.placementLeft;
      break;
    case 'right':
      placementClass = styles.placementRight;
      break;
  }

  return (
    <div className={styles.container}>
      <div className={styles.childrenContainer}>
       {children}
      </div>
      <div className={styles.tipBox + ' ' + placementClass}>
        <div className={styles.tip}>
          {text}
        </div>
      </div>
    </div>
  )
}

export default Tooltip

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      container: {
        verticalAlign: 'middle',
        display: 'inline-flex',
        cursor: 'pointer',
        '&:hover $tipBox': {
          opacity: 1,
        }
      },
      tipBox: {
        height: '0px',
        width: '0px',
        zIndex: 1000,
        opacity: 0,
        transition: 'all 0.25s',
        pointerEvents: 'none',
        position: 'relative',
        display: 'flex',
        [theme.breakpoints.between('xs', 'sm')]: {
          position: 'absolute',
          left: '0',
          display: 'block',
        }
      },
      placementLeft: {
        justifyContent: 'end',
      },
      placementRight: {
        justifyContent: 'start',
      },
      placementCenter: {
        justifyContent: 'center',
      },
      tip: {
        boxSizing: 'border-box',
        position: 'absolute',
        borderRadius: '6px',
        width: 'max-content',
        padding: '20px',
        zIndex: 1000,
        color: theme.palette.text.primary,
        background: theme.palette.background.default,
        marginTop: '30px',
        boxShadow: theme.palette.type === 'light' ? '0px 6px 15px -2px #ccc, 0px 0px 0px 1px #ccc' : '0px 6px 15px -2px #222, 0px 0px 0px 1px #222',
        marginLeft: '-18px',
        maxWidth: '350px',
        [theme.breakpoints.between('xs', 'sm')]: {
          position: 'absolute',
          marginLeft: '0px',
          maxWidth: '100vw',
        }
      },
      childrenContainer: {
        display: 'flex',
        color: theme.palette.primary.main,
      }
    }),
  { name: 'Tooltip' },
);
