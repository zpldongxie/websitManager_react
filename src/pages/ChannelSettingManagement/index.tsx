import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import { Content } from 'antd/lib/layout/layout';
import ChannelTree from './components/ChannelTree';
import SettingTabs from './components/SettingTabs';
import type { ChannelType, TreeNodeType, ChannelSettingList } from '@/utils/data';
import { convertChannelsToTree, convertSiteSetting, findItemFromTree } from '@/utils/utils';
import myContext from "./myContext";

import styles from './index.module.less';

import { queryAllSetting, queryAll } from './service';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const ChannelSetting = () => {
  const [channels, setChannels] = useState<TreeNodeType[]>([]);
  const [resourceData, setResourceData] = useState<ChannelSettingList[]>([]);
  const [siteData, setSiteData] = useState<ChannelSettingList[]>([]);
  const [settingExtend, setSettingExtend] = useState<boolean>(false);
  const [channelKey, setChannelKey] = useState<string>('site');

  /**
   * 点击复用按钮
   * @param id 
   * @param status 
   */
  const changeChannelSettingExtend = (id: string, status: boolean) => {
    const newChannels = [...channels];
    const current = findItemFromTree(newChannels, 'id', id);
    if (current) {
      current.settingExtend = status;
      setChannels(newChannels);
      setSettingExtend(status);
    }
  }

  /**
   * 获取树状组件数据
   */
  const getChannels = async () => {
    const result = await queryAll();
    // 组件加载完成立即获取栏目信息
    const channelList: ChannelType[] = result.data;
    // 更新栏目组件
    const cns: TreeNodeType[] = [];
    convertChannelsToTree(channelList, cns, null);
    const site = {
      enName: "siteSetting",
      id: "site",
      key: "site",
      label: "全站配置",
      name: "全站配置",
      showStatus: 1,
      title: "全站配置",
    };
    cns.unshift(site);
    return cns;
  };

  /**
   * 获取全站配置
   */
  const getSiteSetting = async () => {
    const result = await queryAllSetting();
    if (result.success) {
      convertSiteSetting(result.data);
      setSiteData(result.data.ChannelSettingList);
      setResourceData(result.data.ChannelSettingList);
    };
  };

  /**
   * 点击树状组件节点
   * @param type 
   * @param siteExtend 
   * @param id 
   * @param data 
   */
  const settingDataSync = (type: string, siteExtend: boolean, id: string, data?: ChannelSettingList[]) => {
    const newData = type === 'site' ? siteData : [...data!];
    setSettingExtend(siteExtend);
    setChannelKey(id);
    setResourceData(newData);
  };

  const refreshData = () => {
    getChannels().then(result => {
      setChannels(result);
      if (channelKey !== 'site') {
        const current = findItemFromTree(result, 'id', channelKey);
        setResourceData(current!.ChannelSettingList);
      } else {
        getSiteSetting();
      }
    })
  };
  useEffect(() => {
    getChannels().then(result => {
      setChannels(result);
    });
    getSiteSetting();
  }, []);

  return (
    <PageHeaderWrapper className={styles.channelSettingWrapper} title={false}>
      <Layout style={{ flexDirection: 'row' }}>
        <myContext.Provider value={{ siteData, resourceData, settingExtend, refreshData, setChannelKey }}>
          <Sider>
            <ChannelTree list={channels} selectedKey={channelKey} settingDataSync={settingDataSync} />
          </Sider>
          <Content>
            <SettingTabs onSettingExtendChange={changeChannelSettingExtend} channel={channelKey} />
          </Content>
        </myContext.Provider>
      </Layout>
    </PageHeaderWrapper>
  );
};

export default ChannelSetting;
