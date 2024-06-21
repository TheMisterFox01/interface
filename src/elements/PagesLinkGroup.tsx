import { Stack } from '@mui/material';

import PageLink from './PageLink';

const PagesLinkGroup = (props: Record<string, unknown>): JSX.Element => {
  const { isMobile } = props;

  return (
    <Stack spacing={3} alignItems="center" direction={isMobile ? 'column' : 'row'} m={2}>
      <PageLink href="/" disabled={false}>
        HOME
      </PageLink>
    </Stack>
  );
};

export default PagesLinkGroup;
