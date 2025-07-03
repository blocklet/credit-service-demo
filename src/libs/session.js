/* eslint-disable object-curly-newline */
import { createAuthServiceSessionContext } from '@arcblock/did-connect/lib/Session';
import { useContext } from 'react';

const { SessionProvider, SessionContext, SessionConsumer, withSession } = createAuthServiceSessionContext();

function useSessionContext() {
  // get session info, see more: https://www.arcblock.io/docs/blocklet-developer/blocklet-sdk#session
  const info = useContext(SessionContext);
  return info;
}

export { SessionProvider, SessionContext, SessionConsumer, useSessionContext, withSession };
