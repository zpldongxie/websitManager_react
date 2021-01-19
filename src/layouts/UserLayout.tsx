import type { MenuDataItem } from '@ant-design/pro-layout';
import { getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import type { ConnectProps } from 'umi';
import { Link, SelectLang, useIntl, connect } from 'umi';
import React from 'react';
import type { ConnectState } from '@/models/connect';
import background from '../assets/background.png';
import etLogo from '../assets/etLogo.png';
import leftBg from '../assets/leftBg.png';
import styles from './UserLayout.less';

export type UserLayoutProps = {
  breadcrumbNameMap: Record<string, MenuDataItem>;
} & Partial<ConnectProps>

const UserLayout: React.FC<UserLayoutProps> = (props) => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { formatMessage } = useIntl();
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    formatMessage,
    breadcrumb,
    ...props,
  });
  const bgStyle = {
    backgroundImage: `url(${background})`,
  }
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container} style={bgStyle}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.wrapper}>
          <div className={styles.wrapperLeft}>
            <img className={styles.logo} src={etLogo} />
            <img className={styles.leftBg} src={leftBg} />
          </div>
          <div className={styles.wrapperRight}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <span className={styles.title}>云适配网站管理系统</span>
                </Link>
              </div>
              <div className={styles.desc}>欢迎登陆</div>
            </div>
            {children}
            <div className={styles.tip}>温馨提示：推荐您使用Chrome浏览器访问本系统，享受更流畅的体验。</div>
          </div>
        </div>
        <div className={styles.loginfooter}>
          Copyright<span>2021 西安云适配</span><span>版本：V2.0</span>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default connect(({ settings }: ConnectState) => ({ ...settings }))(UserLayout);
