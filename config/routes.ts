export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user/login',
        component: './user/Login',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'home',
    locale: 'menu.home',
    icon: 'home',
    path: '/welcome',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    locale: 'menu.admin',
    access: 'canAdmin',
    icon: 'crown',
    component: './Admin',
    routes: [
      {
        access: 'canAdminSubPage',
        name: 'subPage',
        locale: 'menu.admin.sub-page',
        path: '/admin/sub-page',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/list',
    name: '列表',
    locale: 'menu.list',
    icon: 'table',
    component: './TableList',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
