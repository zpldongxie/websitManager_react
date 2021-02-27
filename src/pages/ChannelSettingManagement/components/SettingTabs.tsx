/* eslint-disable react/no-array-index-key */
import type { FC} from 'react';
import React, { useContext } from 'react';
import { Switch, Tabs } from 'antd';

import SettingGroup from './SettingGroup';
import { updateSettingExtend } from '../service';

import myContext from "../myContext";

const { TabPane } = Tabs;

type TabProps = {
  channel: string;
  onSettingExtendChange: (id: string, status: boolean) => void;
}


const SettingTabs: FC<TabProps> = (props) => {
  const { channel, onSettingExtendChange } = props;

  const { resourceData, settingExtend } = useContext(myContext);

  /**
   * 更新复用状态
   */
  const handleSites = async () => {
    const { success } = await updateSettingExtend(channel, !settingExtend);
    if (success) {
      onSettingExtendChange(channel, !settingExtend);
    }
  }

  const operations = <>{channel === 'site' ? <></> : <><span>复用全站配置：</span><Switch checked={settingExtend} onClick={handleSites} /> </>}</>;
  return (
    <Tabs defaultActiveKey="1" tabBarExtraContent={operations}>
      {
        resourceData?.map((item, index) => (
          <TabPane tab={item.tabName} key={index * 1 + 1}>
            <SettingGroup type={item.type} channel={channel} list={item.list} />
          </TabPane>
        ))
      }
    </Tabs>
  );
};

export default SettingTabs;
