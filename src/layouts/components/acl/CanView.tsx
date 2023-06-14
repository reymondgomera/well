import React, { useContext } from 'react';
import { AbilityContext } from './Can';

interface Props {
  children: React.ReactNode;
  action: string;
  subject: string;
}

const CanView = ({ children, action, subject }: Props) => {
  const ability = useContext(AbilityContext);
  return ability && ability.can(action, subject) ? <>{children}</> : null;
};

export default CanView;
