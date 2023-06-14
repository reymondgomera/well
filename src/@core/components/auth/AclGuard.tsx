// ** React Imports
import { ReactNode, useEffect, useState } from 'react';

// ** Next Import
import { useRouter } from 'next/router';

// ** Types
import type { ACLObj, AppAbility } from 'src/configs/acl';

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can';

// ** Config Import
import { buildAbilityFor } from 'src/configs/acl';

// ** Component Import
import NotAuthorized from 'src/pages/401';
import BlankLayout from 'src/@core/layouts/BlankLayout';
import { useSession } from 'next-auth/react';
import Spinner from '../spinner';

interface AclGuardProps {
  children: ReactNode;
  aclAbilities: ACLObj;
}

const AclGuard = (props: AclGuardProps) => {
  // ** Props
  const { aclAbilities, children } = props;

  const router = useRouter();
  const [ability, setAbility] = useState<AppAbility | undefined>(undefined);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!session) setAbility(undefined);
  }, [session]);

  // If user is not logged in or its an error page, render the page without checking access
  if (router.route === '/404' || router.route === '/500' || router.route === '/login' || router.route === '/') {
    return <>{children}</>;
  }

  // User is logged in, build ability for the user based on his role
  if (status === 'authenticated' && session.user && session.user.role && !ability) {
    setAbility(buildAbilityFor(session.user.role.code, aclAbilities.subject));
  }

  // Check the access of current user and render pages
  if (ability && ability.can(aclAbilities.action, aclAbilities.subject)) {
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>;
  }

  // only reder it if there is session and user,  render Not Authorized component if the current user has limited access
  if (session && session.user) {
    return (
      <>
        <BlankLayout>
          <NotAuthorized />
        </BlankLayout>
      </>
    );
  } else return <Spinner />;
};

export default AclGuard;
