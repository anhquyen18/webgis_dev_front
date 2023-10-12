const home = [
  {
    path: '/',
    name: 'home-page',
    component: () => import('../layouts/home.vue'),
    children: [
      //   {
      // path: 'home',
      // name: 'home-page',
      // component: () => import('../pages/home.vue'),
      // import ("../pages/home.vue")
      // import ("../components/category.vue")
      //   },
      // {
      //     path: "sign-in",
      //     name: "sign-in-page",
      //     component: () =>
      //         import ("../pages/home.vue")
      // },
    ],
  },
  {
    path: '/account/:accountId',
    name: 'account-page',
    component: () => import('../layouts/account.vue'),
    children: [
      {
        path: 'profile',
        name: 'account-profile',
        component: () => import('../pages/account/account-profile/index.vue'),
      },
      {
        path: 'password',
        name: 'account-password',
        component: () => import('../pages/account/password/index.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)',
    name: 'error-page',
    component: () => import('../pages/errors/404.vue'),
  },
];

export default home;
