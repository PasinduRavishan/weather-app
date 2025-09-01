import { handleAuth, handleLogin, handleLogout } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  login: handleLogin({
    returnTo: '/',
    authorizationParams: {
      screen_hint: 'login',
      mfa_factor: 'email',
    },
  }),
  logout: handleLogout({
    returnTo: '/'
  })
});

// For login/logout, use UI links to /api/auth/login, /api/auth/logout