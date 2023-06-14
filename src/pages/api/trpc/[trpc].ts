import * as trpcNext from '@trpc/server/adapters/next';

import { ServerRouter } from '../../../server/routers';
import { createContext } from '../../../server/context';

export default trpcNext.createNextApiHandler({
  router: ServerRouter,
  createContext
});
