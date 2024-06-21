import { PropsWithChildren } from 'react';

// The component is not used yet, left for the future, you may need to pass the theme through props.
type MainProps = PropsWithChildren<Record<string, unknown>>;

const Main = ({ children }: MainProps): JSX.Element => <main>{children}</main>;

export default Main;
