/** !
 * @description: 栏目选择面板
 * @author: zpl
 * @Date: 2020-11-03 18:33:12
 * @LastEditTime: 2020-11-03 18:40:38
 * @LastEditors: zpl
 */
import React, { useEffect, useState } from 'react'
import { TreeSelect } from 'antd'
import { TreeNode } from 'antd/lib/tree-select';
import { ChannelType, TreeNodeType } from '@/utils/data';
import { convertChannelsToTree } from '@/utils/utils';
import { queryChannels } from './service';

/**
 * 渲染栏目树节点
 *
 * @param {TreeNodeType[]} chs
 * @return {*}
 */
const renderTreeNode = (chs: TreeNodeType[]) => {
  return chs.map((channel) => (
    <TreeNode key={channel.value} value={channel.value!} title={channel.label}>
      {channel.children && channel.children.length ? renderTreeNode(channel.children) : ''}
    </TreeNode>
  ));
};

interface PropsTypes {
  multiple?: boolean;
  onChange?: (value: any) => void;
}

const ChannelSelector = (props: PropsTypes) => {
  const {
    multiple = true,
    onChange = (value: any) => {
      // eslint-disable-next-line no-console
      console.log(value);
    }
  } = props;
  const [channels, setChannels] = useState<TreeNodeType[]>([]);
  useEffect(() => {
    (async () => {
      // 组件加载完成立即获取栏目信息
      const channelList: ChannelType[] = await queryChannels();
      // 更新栏目组件
      const cns: TreeNodeType[] = [];
      convertChannelsToTree(channelList, cns, null);
      setChannels(cns);
    })();
  }, []);
  
  return (
    <TreeSelect
      showSearch
      style={{ width: '100%' }}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder="请选择"
      filterTreeNode={(inputValue: string, treeNode: any) => {
        return treeNode && treeNode.title && (treeNode.title as string).includes(inputValue);
      }}
      allowClear
      multiple={multiple}
      treeDefaultExpandAll
      onChange={(value) => {
        onChange(value);
      }}
    >
      {renderTreeNode(channels)}
    </TreeSelect>
  )
}

export default ChannelSelector
