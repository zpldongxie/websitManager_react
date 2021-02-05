/** !
 * @description: 栏目选择面板
 * @author: zpl
 * @Date: 2020-11-03 18:33:12
 * @LastEditTime: 2020-11-03 18:40:38
 * @LastEditors: zpl
 */
import React, { useEffect, useState } from 'react';
import { TreeSelect } from 'antd';
import { TreeNode } from 'antd/lib/tree-select';
import { convertChannelsToTree } from '@/utils/utils';
import { queryChannels } from './service';
import type { ChannelType, TreeNodeType } from '@/utils/data';

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
  value?: any;
  multiple?: boolean;
  disabled?: boolean;
  onChange?: (value: any) => void;
}

const ChannelSelector = (props: PropsTypes) => {
  const {
    multiple = true,
    value,
    disabled = false,
    onChange = (v: any) => {
      // eslint-disable-next-line no-console
      console.log(v);
    },
  } = props;
  const [channels, setChannels] = useState<TreeNodeType[]>([]);
  const [currentValue, setCurrentValue] = useState(value);
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

  useEffect(() => {
    if (channels.length) {
      setCurrentValue(value);
    } else {
      setCurrentValue('');
    }
  }, [value, channels]);

  return (
    <TreeSelect
      // defaultValue={}
      value={currentValue}
      disabled={disabled}
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
      onChange={(v) => {
        setCurrentValue(v);
        onChange(v);
      }}
    >
      {renderTreeNode(channels)}
    </TreeSelect>
  );
};

export default ChannelSelector;
