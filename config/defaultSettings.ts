import { Settings as ProSettings } from '@ant-design/pro-layout';

type DefaultSettings = ProSettings & {
  versoin: string;
  pwa: boolean;
};

const proSettings: DefaultSettings = {
  navTheme: 'dark',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  menu: {
    locale: true,
  },
  title: '云适配网站管理系统',
  versoin: '3.0.0',
  pwa: false,
  iconfontUrl: '',
};

export type { DefaultSettings };

export default proSettings;
