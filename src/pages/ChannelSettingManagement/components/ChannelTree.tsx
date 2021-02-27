import type { FC } from 'react';
import React,{useContext} from 'react';
import { Tree } from 'antd';
import type { TreeNodeType, ChannelSettingList } from '@/utils/data';
import myContext from '../myContext';

type treeProps = {
  list: TreeNodeType[];
  selectedKey: string;
  settingDataSync: (type: string, settingExtend: boolean, id: string, values?: ChannelSettingList[]) => void;
}
const ChannelTree: FC<treeProps> = (props) => {
  const { list, selectedKey, settingDataSync, } = props;
  const { setChannelKey } = useContext(myContext);
  const handleSelect = (selectedKeys: any, info: any) => {
    if (!info.selected) {
      setChannelKey!(info.node.key)
      return false;
    }
    if (selectedKeys[0] === 'site' || selectedKeys.length === 0) {
      settingDataSync('site', true, 'site');
    } else {
      settingDataSync('normal', info.node.settingExtend, selectedKeys[0], info.node.ChannelSettingList);
    }
    return true;
  };
  return (
    <Tree treeData={list} selectedKeys={[selectedKey]} onSelect={handleSelect} />
  );
};

export default ChannelTree; 
