import { AbilityBuilder, Ability } from '@casl/ability';

export type Subjects = string;
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
export type AppAbility = Ability<[Actions, Subjects]> | undefined;

export const AppAbility = Ability as any;

export type ACLObj = {
  action: Actions;
  subject: Subjects;
};

const defineRulesFor = (role: string, subject: string) => {
  const { can, rules } = new AbilityBuilder(AppAbility);

  /**
   *  mange - represents any action
   *  all - represents any subject
   */

  switch (role) {
    case 'admin':
      can('manage', 'all');
      break;
    case 'user':
      can('read', 'dashboard');
      can('read', 'choose-clinic');
      break;
    case 'receptionist':
      can(['read', 'create', 'update'], ['patient', 'checkup-vital-signs']);
      can('read', 'checkup');
      can('read', 'choose-clinic');
      break;
    case 'physician':
      can('read', ['physician', 'checkup']);
      can(['read', 'create', 'update'], ['checkup']);
      can(['read', 'update'], 'appointment');
      can('read', 'choose-clinic');

      break;
    default:
      can(['read', 'create', 'update', 'delete'], subject);
      break;
  }

  return rules;
};

export const buildAbilityFor = (role: string, subject: string): AppAbility => {
  return new AppAbility(defineRulesFor(role, subject), {
    //@ts-ignore
    detectSubjectType: object => object!.type
  });
};

export const defaultACLObj: ACLObj = {
  action: 'manage',
  subject: 'all'
};

export default defineRulesFor;
