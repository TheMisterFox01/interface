import { PropsWithChildren } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { createStyles, makeStyles } from '@material-ui/core/styles';

export default ({ href, children, disabled }: PropsWithChildren<{href: string, disabled: boolean}>): JSX.Element => {
  const styles = useStyles();
  const { pathname } = useRouter();
  const activePageColor = pathname === href ? styles.activePage : '';
  return (
    <Link href={href}>
      <a className={`${styles.link} ${activePageColor} ${disabled === true ? styles.disabled : ''}`}>{children}</a>
    </Link>
  );
};

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      link: {
        textDecoration: 'none',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '24px',
        whiteSpace: 'nowrap',
        color: theme.palette.common.black,
      },
      disabled: {
        opacity: 0.5,
        pointerEvents: 'none',
      },
      activePage: {
        color: theme.palette.primary.main,
      },
    }),
  { name: 'PagesLinkGroup' },
);
