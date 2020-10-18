// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      authority: ['admin', 'user'],
      routes: [
        {
          path: '/editArticle',
          component: '../layouts/BlankLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              name: 'edit',
              path: '/editArticle/edit',
              component: './ContentManagement/EditArticle',
            },
          ],
        },
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/welcome',
              authority: ['admin', 'user'],
            },
            {
              path: '/welcome',
              name: 'welcome',
              icon: 'smile',
              component: './Welcome',
              authority: ['admin', 'user'],
            },
            {
              name: 'contentmanagement',
              path: '/contentmanagement',
              authority: ['admin', 'user'],
              routes: [
                {
                  name: 'list',
                  path: '/contentmanagement/list',
                  component: './ContentManagement',
                  authority: ['admin', 'user'],
                },
                {
                  name: 'review',
                  path: '/contentmanagement/recycleBin',
                  component: './ContentManagement',
                  // authority: ['admin'],
                  authority: [], // 位置预留，暂不显示
                },
                {
                  name: 'recycle-bin',
                  path: '/contentmanagement/recycleBin',
                  component: './ContentManagement',
                  authority: ['admin', 'user'],
                },
              ],
            },
            {
              name: 'resourcemanagement',
              path: '/resourcemanagement',
              component: './ResourceManagement',
              authority: ['admin', 'user'],
            },
            {
              name: 'membermanagement',
              path: '/membermanagement',
              authority: ['admin', 'user'],
              routes: [
                {
                  name: 'company',
                  path: '/membermanagement/company',
                  component: './MemberManagement',
                  authority: ['admin', 'user'],
                },
                {
                  name: 'indivic',
                  path: '/membermanagement/indivic',
                  component: './MemberManagement',
                  authority: ['admin', 'user'],
                },
                {
                  name: 'regmanagement',
                  path: '/membermanagement/regmanagement',
                  component: './MemberManagement',
                  authority: ['admin', 'user'],
                },
              ],
            },
            {
              name: 'trainingmanagement',
              path: '/trainingmanagement',
              authority: ['admin', 'user'],
              routes: [
                {
                  name: 'management',
                  path: '/trainingmanagement/management',
                  component: './TrainingManagement',
                  authority: ['admin', 'user'],
                },
                {
                  name: 'regmanagement',
                  path: '/trainingmanagement/regmanagement',
                  component: './TrainingRegManagement',
                  authority: ['admin', 'user'],
                },
              ],
            },
            {
              path: '/admin',
              name: 'conf',
              authority: ['admin'],
              routes: [
                {
                  path: '/admin/upload',
                  name: 'upload',
                  icon: 'smile',
                  component: './UploadConfiguration',
                  authority: ['admin'],
                },
              ],
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // base: '/background/',
  // publicPath: '/background/',
});
