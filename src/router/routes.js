
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Error404.vue') },
      { path: 'error', component: () => import('pages/Error404.vue') },
    ]
  },
  {
    path: '/',
    component: () => import('layouts/AccountLayout.vue'),
    children: [
      { path: 'account', component: () => import('pages/Index.vue') },
    ]
  },
  {
    path: '/popup',
    component: () => import('layouts/PopupLayout.vue'),
    children: [
      { path: 'account', component: () => import('pages/popup/Index.vue') },
    ]
  },
  {
    path: '/popup',
    component: () => import('layouts/BrowserPopupLayout.vue'),
    children: [
      { path: 'login', component: () => import('pages/popup/Login.vue') },
      { path: 'operation', component: () => import('pages/popup/Operation.vue') },
    ]
  },

  {
    path: '/',
    component: () => import('layouts/InitializeLayout.vue'),
    children: [
      { path: 'initialize', component: () => import('pages/Initialize.vue') },
      { path: 'login', component: () => import('pages/Login.vue') },
      { path: 'import', component: () => import('pages/Import.vue') },
      { path: 'create', component: () => import('pages/Create.vue') },
      { path: 'generate', component: () => import('pages/Generate.vue') },
      { path: 'confirm', component: () => import('pages/Confirm.vue') },
    ]
  },

  {
    // code from:
    // https://quasar.dev/quasar-cli/developing-browser-extensions/types-of-bex#Dev-Tools%2C-Options-and-Popup
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'options', component: () => import('pages/Index.vue') },
      { path: 'sidebar', component: () => import('pages/Index.vue') },
      { path: 'devtools', component: () => import('pages/Index.vue') }
    ]
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
