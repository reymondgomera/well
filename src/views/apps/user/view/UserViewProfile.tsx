import { Card, CardContent, CardHeader, Grid, Typography } from '@mui/material';

import { UsersType } from '@/utils/db.type';
import { ListItemTextData, ListItemTextType } from '@/utils/form.component';
import { getReferences } from '@/server/hooks/reference';
import { useEffect, useState } from 'react';
import { PhysicianProfileDtoSchemaType, ReceptionistProfileDtoSchemaType } from '@/server/schema/user';

interface UserViewProfilePropsType {
  userData: UsersType;
}

const UserViewProfile = ({ userData }: UserViewProfilePropsType) => {
  const { data: referencesData } = getReferences({ entities: [14] });

  const [physicianProfile, setPhysicianProfile] = useState<PhysicianProfileDtoSchemaType>();
  const [receptionistProfile, setReceptionistProfile] = useState<ReceptionistProfileDtoSchemaType>();

  const USER_PROFILE_PANELS = ['Physician', 'Receptionist'] as const;
  const USER_PROFILE_FIELDS: Partial<Record<(typeof USER_PROFILE_PANELS)[number], ListItemTextType[]>> = {
    ...(userData.role.code === 'physician' && {
      Physician: [
        {
          listItemTextAttribute: {
            primary: 'Qualification',
            primaryTypographyProps: {
              variant: 'subtitle2',
              fontWeight: 600,
              color: 'text.primary'
            },
            secondary: physicianProfile?.qualification
          },
          gridAttribute: { xs: 12, md: 6, lg: 4 }
        },
        {
          listItemTextAttribute: {
            primary: 'Specialist In',
            primaryTypographyProps: {
              variant: 'subtitle2',
              fontWeight: 600,
              color: 'text.primary'
            },
            secondary: physicianProfile?.specialistIn
          },
          gridAttribute: { xs: 12, md: 6, lg: 4 }
        },
        {
          listItemTextAttribute: {
            primary: 'Specialized Treatment',
            primaryTypographyProps: {
              variant: 'subtitle2',
              fontWeight: 600,
              color: 'text.primary'
            },
            secondary: physicianProfile?.specializedTreatment
          },
          gridAttribute: { xs: 12, md: 6, lg: 4 }
        },
        {
          listItemTextAttribute: {
            primary: 'Years of Experience',
            primaryTypographyProps: {
              variant: 'subtitle2',
              fontWeight: 600,
              color: 'text.primary'
            },
            secondary: physicianProfile?.yearOfExp
          },
          gridAttribute: { xs: 12, md: 6, lg: 4 }
        },
        {
          listItemTextAttribute: {
            primary: 'license Number',
            primaryTypographyProps: {
              variant: 'subtitle2',
              fontWeight: 600,
              color: 'text.primary'
            },
            secondary: physicianProfile?.licenseNumber
          },
          gridAttribute: { xs: 12, md: 6, lg: 4 }
        },
        {
          listItemTextAttribute: {
            primary: 'DEA Number',
            primaryTypographyProps: {
              variant: 'subtitle2',
              fontWeight: 600,
              color: 'text.primary'
            },
            secondary: physicianProfile?.deaNumber
          },
          gridAttribute: { xs: 12, md: 6, lg: 4 }
        },
        {
          listItemTextAttribute: {
            primary: 'PTR Number',
            primaryTypographyProps: {
              variant: 'subtitle2',
              fontWeight: 600,
              color: 'text.primary'
            },
            secondary: physicianProfile?.ptrNumber
          },
          gridAttribute: { xs: 12, md: 6, lg: 4 }
        },
        {
          listItemTextAttribute: {
            primary: 'Address',
            primaryTypographyProps: {
              variant: 'subtitle2',
              fontWeight: 600,
              color: 'text.primary'
            },
            secondary: physicianProfile?.address
          },
          gridAttribute: { xs: 12 }
        },
        {
          listItemTextAttribute: {
            primary: 'Contact Number/s',
            primaryTypographyProps: {
              variant: 'subtitle2',
              fontWeight: 600,
              color: 'text.primary'
            },
            secondary: physicianProfile?.contactNumber.toString().replaceAll(',', ', ')
          },
          gridAttribute: { xs: 12 }
        },
        {
          listItemTextAttribute: {
            primary: 'Language/s',
            primaryTypographyProps: {
              variant: 'subtitle2',
              fontWeight: 600,
              color: 'text.primary'
            },
            secondary: referencesData
              ?.filter(r => physicianProfile?.languages.includes(r.id))
              .map(r => r.name)
              .toString()
              .replaceAll(',', ', ')
          },
          gridAttribute: { xs: 12 }
        }
      ]
    }),
    ...(userData.role.code === 'receptionist' && {
      Receptionist: [
        {
          listItemTextAttribute: {
            primary: 'Address',
            primaryTypographyProps: {
              variant: 'subtitle2',
              fontWeight: 600,
              color: 'text.primary'
            },
            secondary: receptionistProfile?.address
          },
          gridAttribute: { xs: 12 }
        },
        {
          listItemTextAttribute: {
            primary: 'Contact Number',
            primaryTypographyProps: {
              variant: 'subtitle2',
              fontWeight: 600,
              color: 'text.primary'
            },
            secondary: receptionistProfile?.contactNumber
          },
          gridAttribute: { xs: 12 }
        }
      ]
    })
  };

  useEffect(() => {
    if (userData) {
      switch (userData.role.code) {
        case 'physician':
          setPhysicianProfile(
            JSON.parse(JSON.stringify(userData.profile?.roleProfile)) as PhysicianProfileDtoSchemaType
          );
          break;
        case 'receptionist':
          setReceptionistProfile(
            JSON.parse(JSON.stringify(userData.profile?.roleProfile)) as ReceptionistProfileDtoSchemaType
          );
          break;
      }
    }
  }, [userData]);

  const renderProfile = () => {
    if (USER_PROFILE_FIELDS.Physician) {
      return (
        <>
          <CardHeader title='Physician Profile' titleTypographyProps={{ fontWeight: '600 !important' }} />
          <CardContent>
            <Grid container>
              {USER_PROFILE_FIELDS['Physician'].map((obj, i) => (
                <ListItemTextData key={i} {...obj} />
              ))}
            </Grid>
          </CardContent>
        </>
      );
    } else if (USER_PROFILE_FIELDS.Receptionist) {
      return (
        <>
          <CardHeader title='Receptionist Profile' titleTypographyProps={{ fontWeight: '600 !important' }} />
          <CardContent>
            <Grid container>
              {USER_PROFILE_FIELDS['Receptionist'].map((obj, i) => (
                <ListItemTextData key={i} {...obj} />
              ))}
            </Grid>
          </CardContent>
        </>
      );
    } else
      return (
        <CardContent>
          <Typography variant='h6' textAlign='center'>
            N/A
          </Typography>
        </CardContent>
      );
  };

  return (
    <Grid container spacing={6} width='100%'>
      <Grid item xs={12}>
        <Card>{renderProfile()}</Card>
      </Grid>
    </Grid>
  );
};

export default UserViewProfile;
