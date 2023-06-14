import { ReactNode, useEffect, useState } from 'react';

import {
  Box,
  Grid,
  Button,
  Typography,
  CardContent,
  styled,
  useTheme,
  Card as MuiCard,
  CardProps
} from '@mui/material';

import Icon from 'src/@core/components/icon';
import themeConfig from 'src/configs/themeConfig';
import BlankLayout from 'src/@core/layouts/BlankLayout';
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustrationsV1';

import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import { SubmitHandler, useForm } from 'react-hook-form';

import { FormControlPropsType } from '@/utils/common.type';
import { ChooseClinicDtoSchemaType, ChooseClinicUnionFieldType, chooseClinicDtoSchema } from '@/server/schema/clinic';
import { ClinicsType, UsersType } from '@/utils/db.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormObjectComponent } from '@/utils/form.component';
import { getHomeRoute } from '..';

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: 450 }
}));

const ChooseClinicPage: NextPage = () => {
  const theme = useTheme();

  const router = useRouter();
  const { data: session, status, update } = useSession();

  const [clinicsData, setClinicsData] = useState<Omit<ClinicsType, 'profile'>[]>();

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors }
  } = useForm<ChooseClinicDtoSchemaType>({
    defaultValues: {
      clinicId: 0
    },
    mode: 'onChange',
    resolver: zodResolver(chooseClinicDtoSchema)
  });

  useEffect(() => {
    if (session && session.user) {
      if (session.user.role.code !== 'admin') {
        const profile = session.user.profile;
        const clinics = profile?.clinics;

        setClinicsData(clinics ? clinics : []);
      }
    }
  }, [session]);

  const CHOOSE_CLINIC_PANEL = ['General'] as const;
  const CHOOSE_CLINIC_FIELD: Record<
    (typeof CHOOSE_CLINIC_PANEL)[number],
    FormControlPropsType<ChooseClinicUnionFieldType>[]
  > = {
    General: [
      {
        label: 'Clinic',
        dbField: 'clinicId',
        type: 'dropDownNonEntityReference',
        required: true,
        extendedProps: {
          gridAttribute: { xs: 12 },
          dropDownNonEntityReferenceAttribute: {
            data: clinicsData && clinicsData.length > 0 ? clinicsData : [],
            dataIsloading: status === 'loading',
            menuItemTextPath: ['name']
          }
        }
      }
    ]
  };

  useEffect(() => {
    if (session && session.user && session.user.clinicId) router.push(getHomeRoute(session.user.role.code));
  }, [session?.user.clinicId]);

  const onSubmit: SubmitHandler<ChooseClinicDtoSchemaType> = data => update({ clinicId: data.clinicId });

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ p: theme => `${theme.spacing(15.5, 7, 8)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={47} fill='none' height={26} viewBox='0 0 268 150' xmlns='http://www.w3.org/2000/svg'>
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fill={theme.palette.primary.main}
                transform='matrix(-0.865206 0.501417 0.498585 0.866841 195.571 0)'
              />
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fillOpacity='0.4'
                fill='url(#paint0_linear_7821_79167)'
                transform='matrix(-0.865206 0.501417 0.498585 0.866841 196.084 0)'
              />
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fill={theme.palette.primary.main}
                transform='matrix(0.865206 0.501417 -0.498585 0.866841 173.147 0)'
              />
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fill={theme.palette.primary.main}
                transform='matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)'
              />
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fillOpacity='0.4'
                fill='url(#paint1_linear_7821_79167)'
                transform='matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)'
              />
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fill={theme.palette.primary.main}
                transform='matrix(0.865206 0.501417 -0.498585 0.866841 71.7728 0)'
              />
              <defs>
                <linearGradient
                  y1='0'
                  x1='25.1443'
                  x2='25.1443'
                  y2='143.953'
                  id='paint0_linear_7821_79167'
                  gradientUnits='userSpaceOnUse'
                >
                  <stop />
                  <stop offset='1' stopOpacity='0' />
                </linearGradient>
                <linearGradient
                  y1='0'
                  x1='25.1443'
                  x2='25.1443'
                  y2='143.953'
                  id='paint1_linear_7821_79167'
                  gradientUnits='userSpaceOnUse'
                >
                  <stop />
                  <stop offset='1' stopOpacity='0' />
                </linearGradient>
              </defs>
            </svg>
            <Typography variant='h6' sx={{ ml: 2, lineHeight: 1, fontWeight: 700, fontSize: '1.5rem !important' }}>
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Box sx={{ mb: 6.5 }}>
            <Box display='flex' alignItems='flex-end' sx={{ mb: 1.5 }}>
              <Typography variant='h5' sx={{ letterSpacing: '0.18px', fontWeight: 600, mr: 3 }}>
                Choose a Clinic
              </Typography>
              <Icon icon='mdi:home-city-outline' fontSize={32} />
            </Box>
            <Typography variant='body2'>Please select your preferred clinic.</Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={6} sx={{ mb: 4 }}>
              {CHOOSE_CLINIC_FIELD['General'].map((obj, i) => (
                <Grid item key={obj.dbField} {...obj.extendedProps?.gridAttribute}>
                  <FormObjectComponent
                    key={i}
                    objFieldProp={obj}
                    control={control}
                    errors={errors}
                    getValues={getValues}
                    setValue={setValue}
                  />
                </Grid>
              ))}
            </Grid>

            <Button fullWidth size='large' type='submit' variant='contained'>
              Proceed
            </Button>
          </form>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 image={`/images/pages/auth-v1-forgot-password-mask-${theme.palette.mode}.png`} />
    </Box>
  );
};

ChooseClinicPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;
ChooseClinicPage.acl = {
  action: 'read',
  subject: 'choose-clinic'
};

export default ChooseClinicPage;
