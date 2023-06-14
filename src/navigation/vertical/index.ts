import { VerticalNavItemsType } from 'src/@core/layouts/types';

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      path: '/apps/dashboard',
      icon: 'mdi:home-outline',
      action: 'read',
      subject: 'dashboard'
    },
    {
      title: 'Reference',
      path: '/apps/reference',
      icon: 'mdi:list-box-outline',
      action: 'read',
      subject: 'reference'
    },
    {
      title: 'User',
      path: '/apps/user',
      icon: 'mdi:account-outline',
      action: 'read',
      subject: 'user'
    },
    {
      title: 'Clinic',
      path: '/apps/clinic',
      icon: 'mdi:home-city-outline',
      action: 'read',
      subject: 'clinic'
    },
    {
      title: 'Patient',
      path: '/apps/patient',
      icon: 'mdi:patient-outline',
      action: 'read',
      subject: 'patient'
    },
    {
      title: 'Checkup',
      path: '/apps/checkup',
      icon: 'tabler:checkup-list',
      action: 'read',
      subject: 'checkup-vital-signs'
    },
    {
      title: 'Physician',
      icon: 'mdi:account-outline',
      action: 'read',
      subject: 'physician',
      children: [
        {
          title: 'checkup',
          path: '/apps/physician/checkup',
          action: 'read',
          subject: 'checkup'
        }
      ]
    }
    // {
    //   title: 'Appointment',
    //   path: '/appointment',
    //   action: 'read',
    //   subject: 'appointment',
    //   icon: 'mdi:calendar-today-outline'
    // }
  ];
};

export default navigation;
