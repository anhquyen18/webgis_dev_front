const home = [
  {
    path: '/',
    name: 'home-page',
    component: () => import('../layouts/home.vue'),
    meta: { title: 'Home' },
  },
  {
    path: '/account/:accountId',
    name: 'account-page',
    component: () => import('../layouts/account.vue'),
    meta: { title: 'Account' },
    children: [
      {
        path: 'profile',
        name: 'account-profile',
        component: () => import('../pages/account/profile/index.vue'),
      },
      {
        path: 'password',
        name: 'account-password',
        component: () => import('../pages/account/password/index.vue'),
      },
      {
        path: 'users-manager',
        name: 'account-users-manager',
        component: () => import('../pages/account/users-manager/index.vue'),
      },
    ],
  },
  // {
  //   path: '/account-recovery',
  //   name: 'account-recovery',
  //   // component: () => import('../layouts/home.vue'),
  //   children: [
  //     {
  //       path: 'reset-password/:token',
  //       name: 'account-recovery-reset-password',
  //       component: () => import('../pages/account-recovery/reset-password/index.vue'),
  //     },
  //     {
  //       path: 'forgot-password',
  //       name: 'account-recovery-forgot-password',
  //       component: () => import('../pages/account-recovery/forgot-password/index.vue'),
  //     },
  //   ],
  // },
  {
    path: '/reset-password/:token',
    name: 'reset-password-page',
    component: () => import('../pages/reset-password.vue'),
    meta: { title: 'Reset Password' },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password-page',
    component: () => import('../pages/forgot-password.vue'),
    meta: { title: 'Forgot Password' },
  },
  {
    path: '/:catchAll(.*)',
    name: 'error-page',
    component: () => import('../pages/errors/404.vue'),
    meta: { title: 'Page Not Found' },
  },
];

export default home;
