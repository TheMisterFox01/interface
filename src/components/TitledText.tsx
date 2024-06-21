import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from 'components/IconButton';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useCopyToClipboard } from 'utils';
import { useContext } from 'react';
import { SnackbarContext } from 'pages/account/[[...page]]';

const TitledText = ({
  className = '',
  title = '',
  text = '',
  subText = '',
  valueToCopy = '',
  linkToOpen = '',
}: {
  className?: string;
  title?: string;
  text?: any;
  subText?: string;
  valueToCopy?: string;
  linkToOpen?: string;
}) => {
  const theme = useTheme();
  const styles = useStyles();
  const isPhone = useMediaQuery(theme.breakpoints.down('sm'));
  const handleOpenSnackbar = useContext(SnackbarContext);

  const [_value, copy] = useCopyToClipboard();

  const handleCopyClick = () => {
    copy(valueToCopy).then(handleOpenSnackbar);
  };

  return (
    <div className={`${styles.container} ${className}`}>
      {title !== '' && <div className={styles.label}>{title}</div>}
      <div className={styles.content}>
        <div className={styles.data}>
          <div className={styles.regular}>{text}</div>
          {subText !== '' && <div className={styles.subText}>{subText}</div>}
        </div>
        {((isPhone && valueToCopy != '') || linkToOpen != '') && (
          <div className={styles.control}>
            {linkToOpen != '' && (
              <a href={linkToOpen} target="_blank">
                <IconButton className={styles.openIcon} size="medium">
                  <OpenInNewIcon />
                </IconButton>
              </a>
            )}
            {isPhone && valueToCopy != '' && (
              <IconButton className={styles.copyIcon} onClick={handleCopyClick} size="medium">
                <ContentCopyIcon />
              </IconButton>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TitledText;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      container: {
        display: 'flex',
        flexDirection: 'column',
      },
      content: {
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
          justifyContent: 'space-between',
        },
      },
      data: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      },
      copyIcon: {
        color: theme.palette.custom.black,
      },
      openIcon: {
        color: theme.palette.custom.blue,
      },
      label: {
        fontSize: '14px',
        color: theme.palette.custom.text.secondary,
        lineHeight: 1.6,
      },
      subText: {
        fontSize: '14px',
        color: theme.palette.custom.text.secondary,
        lineHeight: 1.6,
      },
      regular: {
        fontSize: '16px',
        lineHeight: 1.6,
        wordBreak: 'break-all',
      },
      small: {
        fontSize: '14px',
      },
      control: {
        display: 'flex',
        height: '22px',
        alignItems: 'center',
        [theme.breakpoints.down('sm')]: {
          maxWidth: '100px',
          minWidth: '100px',
          width: '100px',
          justifyContent: 'flex-end',
        },
      },
    }),
  { name: 'TitledText' },
);
