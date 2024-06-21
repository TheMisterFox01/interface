import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from 'components/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useCopyToClipboard } from 'utils';
import { useContext } from 'react';
import { SnackbarContext } from 'pages/account/[[...page]]';

const TableCell = ({
  children = '',
  isHeader = false,
  className = '',
  header = '',
  smallOnDesktop = true,
  valueToCopy = '',
  wordBreak = false,
}: {
  children?: JSX.Element[] | JSX.Element | string | any;
  isHeader?: boolean;
  className?: string;
  header?: string;
  smallOnDesktop?: boolean;
  valueToCopy?: string;
  wordBreak?: boolean;
}) => {
  const theme = useTheme();
  const styles = useStyles();
  const isPhone = useMediaQuery(theme.breakpoints.between('xs', 1280));
  const handleOpenSnackbar = useContext(SnackbarContext);

  const [_value, copy] = useCopyToClipboard();

  const handleClick = () => {
    copy(valueToCopy).then(handleOpenSnackbar);
  };

  if (isPhone) {
    let classList = [];
    classList.push(className);
    classList.push(isHeader ? styles.mobileTh : styles.mobileTd);
    classList.push(wordBreak ? styles.breakWords : styles.keepWords);

    return isHeader ? (
      <th className={classList.join(' ')}>
        <div>
          <div className={styles.label}>{header}</div>
          <div>{children}</div>
        </div>
      </th>
    ) : (
      <td className={classList.join(' ')}>
        <div>
          <div className={styles.label}>{header}</div>
          <div>{children}</div>
        </div>
        {valueToCopy != '' && (
          <IconButton className={styles.copyIcon} onClick={handleClick} size="medium">
            <ContentCopyIcon />
          </IconButton>
        )}
      </td>
    );
  }

  let classList = [];
  classList.push(className);
  classList.push(isHeader ? styles.th : styles.td);
  classList.push(smallOnDesktop ? styles.small : styles.regular);
  classList.push(wordBreak ? styles.breakWords : styles.keepWords);

  return isHeader ? (
    <th className={classList.join(' ')}>
      <div>
        <div>{children}</div>
      </div>
    </th>
  ) : (
    <td className={classList.join(' ')}>
      <div>
        <div>{children}</div>
      </div>
    </td>
  );
};

export default TableCell;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      copyIcon: {
        color: theme.palette.common.black,
      },
      label: {
        fontSize: '14px',
        marginBottom: '5px',
        color: theme.palette.custom.gray,
      },
      td: {
        color: theme.palette.text.primary,
        padding: '12px 8px',
        boxSizing: 'border-box',
      },
      mobileTd: {
        color: theme.palette.text.primary,
        fontSize: '16px',
        padding: '8px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      th: {
        color: theme.palette.text.primary,
        fontSize: '16px',
        padding: '8px',
        boxSizing: 'border-box',
      },
      mobileTh: {
        color: theme.palette.text.primary,
        fontSize: '16px',
        padding: '8px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      regular: {
        fontSize: '16px',
      },
      small: {
        fontSize: '14px',
      },
      breakWords: {
        wordBreak: 'break-all',
      },
      keepWords: {
        wordBreak: 'keep-all',
      },
    }),
  { name: 'TableCell' },
);
