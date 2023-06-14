import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import superjson from 'superjson';
import { devtoolsLink } from 'trpc-client-devtools-link';
import { ServerRouter } from '@/server/routers';
import { QueryClient } from '@tanstack/react-query';

const getBaseUrl = () => {
  if (typeof window !== 'undefined')
    // browser should use relative path
    return '';
  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;
  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_IsNTERNAL_HOSTNAME}:${process.env.PORT}`;
  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const trpc = createTRPCNext<ServerRouter>({
  config({ ctx }) {
    return {
      transformer: superjson,
      links: [
        devtoolsLink({
          enabled: process.env.NODE_ENV === 'development' // devtools only for development
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`
        })
      ]
    };
  },
  ssr: false
});

export const queryClient = new QueryClient();
