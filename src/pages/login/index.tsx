import { ReactNode, useState } from 'react';

import Link from 'next/link';

import {
  Box,
  Checkbox,
  Grid,
  Typography,
  CardContent,
  styled,
  useTheme,
  Card as MuiCard,
  CardProps
} from '@mui/material';
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel';
import { LoadingButton } from '@mui/lab';

import { useForm } from 'react-hook-form';

import themeConfig from 'src/configs/themeConfig';
import BlankLayout from 'src/@core/layouts/BlankLayout';
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustrationsV1';

import { signIn, useSession } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { LoginUserDtoSchemaType, LoginUserFieldType, loginUserDtoSchema } from '@/server/schema/user';
import { toast } from 'react-hot-toast';
import { getHomeRoute } from '..';

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: 450 }
}));

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}));

import React from 'react';
import { FormControlPropsType } from '@/utils/common.type';
import { FormObjectComponent } from '@/utils/form.component';

const LoginPage = () => {
  const theme = useTheme();

  const router = useRouter();
  const { data: session, status } = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<LoginUserDtoSchemaType>({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onChange',
    resolver: zodResolver(loginUserDtoSchema)
  });

  const LOGIN_PANEL = ['General'] as const;
  const LOGIN_FIELDS: Record<(typeof LOGIN_PANEL)[number], FormControlPropsType<LoginUserFieldType>[]> = {
    General: [
      {
        label: 'Email',
        dbField: 'email',
        type: 'textField',
        required: true,
        autoFocus: true,
        extendedProps: {
          gridAttribute: { xs: 12 }
        }
      },
      {
        label: 'Password',
        dbField: 'password',
        type: 'textField',
        required: true,
        extendedProps: {
          gridAttribute: { xs: 12 },
          textFieldAttribute: { type: 'password' }
        }
      }
    ]
  };

  const onSubmit = async (data: LoginUserDtoSchemaType) => {
    setIsLoading(true);
    try {
      const res = await signIn('credentials', {
        ...data,
        redirect: false
      });

      setIsLoading(false);
      if (!res?.error) toast.success('Logged in successfully.');
      else toast.error(res.error);
    } catch (err) {
      console.error(err);
    }
  };

  if (status === 'authenticated') {
    const roleCode = session.user.role.code;
    const chosenClinic = session.user.clinicId;

    if (roleCode !== 'admin' && !chosenClinic) router.push('/choose-clinic');
    else router.replace(getHomeRoute(session.user.role.code));
  }

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ p: theme => `${theme.spacing(13, 7, 6.5)} !important` }}>
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
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ mb: 1.5, fontWeight: 600, letterSpacing: '0.18px' }}>
              {`Welcome to ${themeConfig.templateName}! 👋🏻`}
            </Typography>
            <Typography variant='body2'>Please enter your credentials.</Typography>
          </Box>

          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <Grid container rowGap={3}>
              {LOGIN_FIELDS['General'].map((obj, i) => (
                <Grid item key={obj.dbField} {...obj.extendedProps?.gridAttribute}>
                  <FormObjectComponent key={i} objFieldProp={obj} control={control} errors={errors} />
                </Grid>
              ))}
            </Grid>

            <Box
              sx={{
                mb: 4,
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: 'space-between'
              }}
            >
              <FormControlLabel
                label='Remember Me'
                control={<Checkbox />}
                sx={{
                  '& .MuiFormControlLabel-label': { color: 'text.primary' }
                }}
              />
              <Typography
                variant='body2'
                component={Link}
                href='/pages/auth/forgot-password-v2'
                sx={{ color: 'primary.main', textDecoration: 'none' }}
              >
                Forgot Password?
              </Typography>
            </Box>

            <LoadingButton loading={isLoading} fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7 }}>
              <span>Login</span>
            </LoadingButton>
          </form>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  );
};

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

export default LoginPage;
