import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Tabs } from 'antd';

import UploadConfig from './components/UploadConfig';
import EmailConfig from './components/EmailConfig';

import { getConfigList } from './service';
import styles from './index.module.less';
import SyncData from './components/SyncData';

const { TabPane } = Tabs;

const UploadConfiguration = () => {
  const [uploadConfigInfo, setUploadConfigInfo] = useState<any>({}); // 上传配置
  const [emailConfigInfo, setEmailConfigInfo] = useState<any>({}); // 邮件配置
  const [syncInfo, setSyncInfo] = useState<any>({}); // 数据同步配置
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const { search } = window.location;
    if (search && search.substr(1) === 'showMore') {
      setShowMore(true);
    }

    (async () => {
      const res = await getConfigList();
      if (res.status === 'ok') {
        const newUploadConfigInfo = {};
        const newEmailConfigInfo = {};
        const newSyncInfo = {};
        res.data.forEach((conf: ConfigType) => {
          switch (conf.group) {
            case '上传':
              newUploadConfigInfo[conf.name] = conf.value;
              break;
            case '邮箱':
              newEmailConfigInfo[conf.name] = conf.value;
              break;
            case '同步':
              newSyncInfo[conf.name] = conf.value;
              break;
            default:
              break;
          }
        });
        setUploadConfigInfo(newUploadConfigInfo);
        setEmailConfigInfo(newEmailConfigInfo);
        setSyncInfo(newSyncInfo);
      }
    })();
  }, []);

  return (
    <PageContainer title={false}>
      <Tabs className={styles.tabstyle}>
        <TabPane tab="上传配置" key="1">
          <UploadConfig defaultValues={uploadConfigInfo} />
        </TabPane>
        <TabPane tab="邮件配置" key="2">
          <EmailConfig defaultValues={emailConfigInfo} />
        </TabPane>
        {showMore && (
          <TabPane tab="数据同步" key="100">
            <SyncData defaultValues={syncInfo} />
          </TabPane>
        )}
      </Tabs>
    </PageContainer>
  );
};

export default UploadConfiguration;
