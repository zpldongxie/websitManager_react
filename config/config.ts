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
          // 登录
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
          // 文章编辑
          path: '/editArticle',
          component: '../layouts/BlankLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              name: 'edit',
              path: '/editArticle/edit',
              component: './ArticleManagement/EditArticle',
            },
          ],
        },
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              // 欢迎页
              path: '/',
              redirect: '/welcome',
              authority: ['admin', 'user'],
            },
            {
              // 欢迎页
              path: '/welcome',
              name: 'welcome',
              icon: 'smile',
              component: './Welcome',
              authority: ['admin', 'user'],
            },
            {
              // 文章管理
              name: 'articleManagement',
              icon: 'ReadOutlined',
              path: '/articleManagement',
              authority: ['admin', 'user'],
              routes: [
                {
                  // 文章列表
                  name: 'list',
                  path: '/articleManagement/list',
                  component: './ArticleManagement',
                  authority: ['admin', 'user'],
                },
                {
                  // 回收站
                  name: 'recycle-bin',
                  path: '/articleManagement/recycleBin',
                  component: './ArticleManagement',
                  authority: ['admin', 'user'],
                },
              ],
            },
            {
              // 资源管理
              name: 'resourcemanagement',
              icon: 'CloudServerOutlined',
              path: '/resourcemanagement',
              component: './ResourceManagement',
              authority: ['admin', 'user'],
            },
            {
              // 会员管理
              name: 'membermanagement',
              icon: 'TeamOutlined',
              path: '/membermanagement',
              authority: ['admin', 'user'],
              routes: [
                {
                  // 单位会员
                  name: 'company',
                  path: '/membermanagement/company',
                  component: './MemberManagement',
                  authority: ['admin', 'user'],
                },
                {
                  // 个人会员
                  name: 'indivic',
                  path: '/membermanagement/indivic',
                  component: './MemberManagement/personalMember',
                  authority: ['admin', 'user'],
                },
              ],
            },
            {
              // 栏目设置
              name: 'channel',
              icon: 'AppstoreOutlined',
              path: '/channel',
              authority: ['admin', 'user'],
              routes: [
                {
                  // 栏目管理
                  name: 'management',
                  path: '/channel/management',
                  component: './ChannelManagement',
                  authority: ['admin', 'user'],
                },
                {
                  // 栏目配置
                  name: 'setting',
                  path: '/channel/setting',
                  component: './ChannelSettingManagement',
                  authority: ['admin', 'user'],
                },
              ],
            },
            {
              // 服务审核
              name: 'serviceRequestManagement',
              icon: 'HeartOutlined',
              path: '/serviceRequestManagement',
              authority: ['admin', 'user'],
              routes: [
                {
                  // 方案咨询
                  name: 'schemeConsultation',
                  path: '/serviceRequestManagement/schemeConsultation',
                  component: './ServiceRequestManagement',
                  authority: ['admin', 'user'],
                },
                {
                  // 方案论证
                  name: 'schemeDemonstration',
                  path: '/serviceRequestManagement/schemeDemonstration',
                  component: './ServiceRequestManagement',
                  authority: ['admin', 'user'],
                },
                {
                  // 方案设计
                  name: 'schemeDesign',
                  path: '/serviceRequestManagement/schemeDesign',
                  component: './ServiceRequestManagement',
                  authority: ['admin', 'user'],
                },
                {
                  // 安全评估
                  name: 'safetyAssessment',
                  path: '/serviceRequestManagement/safetyAssessment',
                  component: './ServiceRequestManagement',
                  authority: ['admin', 'user'],
                },
              ],
            },
            {
              // 培训管理
              name: 'trainingmanagement',
              icon: 'ScheduleOutlined',
              path: '/trainingmanagement',
              authority: ['admin', 'user'],
              routes: [
                {
                  // 培训列表
                  name: 'management',
                  path: '/trainingmanagement/management',
                  component: './TrainingManagement',
                  authority: ['admin', 'user'],
                },
                {
                  // 报名审批
                  name: 'regmanagement',
                  path: '/trainingmanagement/regmanagement',
                  component: './TrainingRegManagement',
                  authority: ['admin', 'user'],
                },
              ],
            },
            {
              // 厂商入驻
              name: 'manufacturer',
              icon: 'ShopOutlined',
              path: '/manufacturer',
              authority: ['admin', 'user'],
              routes: [
                {
                  // 厂商名录
                  name: 'list',
                  path: '/manufacturer/list',
                  component: './manufacturer/list',
                  authority: ['admin', 'user'],
                },
                {
                  // 申请审批
                  name: 'regmanagement',
                  path: '/manufacturer/regmanagement',
                  component: './manufacturer/regmanagement',
                  authority: ['admin', 'user'],
                },
              ],
            },
            {
              // 产品入驻
              name: 'product',
              icon: 'ProfileOutlined',
              path: '/product',
              authority: ['admin', 'user'],
              routes: [
                {
                  // 产品清单
                  name: 'list',
                  path: '/product/list',
                  component: './MemberManagement',
                  authority: ['admin', 'user'],
                },
                {
                  // 申请审批
                  name: 'regmanagement',
                  path: '/product/regmanagement',
                  component: './MemberManagement',
                  authority: ['admin', 'user'],
                },
              ],
            },
            {
              // 网站设置
              name: 'websiteConf',
              icon: 'SettingOutlined',
              path: '/websiteConf',
              authority: ['admin', 'user'],
              routes: [
                {
                  // 基本设置
                  name: 'base',
                  path: '/websiteConf/base',
                  component: './TrainingManagement',
                  authority: ['admin', 'user'],
                },
              ],
            },
            {
              // 系统配置
              path: '/system',
              name: 'system',
              icon: 'ControlOutlined',
              component: './SysConfiguration',
              authority: ['admin'],
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
