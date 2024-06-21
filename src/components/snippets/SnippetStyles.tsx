import { createStyles, makeStyles } from '@material-ui/core/styles';

const SnippetsStyles = makeStyles((theme) =>
  createStyles({
    rows: {
      left: '37px',
      top: '0px',
      position: 'absolute',
      fontSize: '14px',
      fontFamily: 'Courier New',
      fontWeight: 400,
      lineHeight: 1.4,
      wordWrap: 'break-word',
      '& > p': {
        display: 'inline-block',
        margin: '0'
      },
    },
    snippetContainer: {
      position: 'relative',
      width: '100%',
      '& *': {
        wordBreak: 'keep-all',
        minWidth: 'max-content',
      },
    },
    snippetScrollable: {
      width: '100%',
      position: 'relative',
      overflowX: 'auto',
    },
    text: {
      color: theme.palette.text.primary,
    },
    green: {
      color: theme.palette.custom.codeSnippet.green,
    },
    blue: {
      color: theme.palette.custom.codeSnippet.blue,
    },
    orange: {
      color: theme.palette.custom.codeSnippet.orange,
    },
    yellow: {
      color: theme.palette.custom.codeSnippet.yellow,
    },
    purple: {
      color: theme.palette.custom.codeSnippet.purple,
    },
  }),
);

export default SnippetsStyles;
