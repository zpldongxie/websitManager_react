/* eslint-disable no-param-reassign */
import type { FC } from 'react';
import React, { useState, useContext, useEffect } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import type { ChannelSettingType } from '@/utils/data';
import { Divider, message, Popconfirm } from 'antd';
import myContext from '../myContext';
import { deleteChannelSetting } from '../service';

type TableProps = {
  type?: 'pic' | 'url' | 'desc' | 'video' | undefined;
  groupName?: string;
  curDataSource?: ChannelSettingType[];
  channel: string;
  onSubmit?: (values: ChannelSettingType) => void;
}



const EditableTable: FC<TableProps> = (props) => {
  const { type, groupName, channel, curDataSource = [], onSubmit, } = props;

  const { siteData, settingExtend, refreshData } = useContext(myContext);

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<ChannelSettingType[] | undefined>([]);
  const handleDelete = async (id: any) => {
    const idArray = [id];
    const result = await deleteChannelSetting(idArray);
    if (result.success) {
      refreshData!();
      message.info('数据删除成功');
    }
  }
  useEffect(() => {
    // 开启继承的时候，需要把全站配置拼接进来
    if (channel !== 'site' && settingExtend) {
      // 从全站配置中找对应类型
      const siteType = siteData?.find((item) => item.type === type);
      if (siteType) {
        // 从全站配置查找对应的分组
        const siteGroup = siteType.list.find((item) => item.groupName === groupName);
        if (siteGroup) {
          const ids = curDataSource.map((item) => item.id);
          const siteTempData = siteGroup.dataResource.filter((item) => !ids.includes(item.id));
          const newData = curDataSource.concat(siteTempData);
          setDataSource(newData)
        } else {
          setDataSource(curDataSource);
        }
      } else {
        setDataSource(curDataSource);
      }
    } else {
      setDataSource(curDataSource)
    }
  }, [channel, curDataSource, groupName, settingExtend, siteData, type])

  const columns: ProColumns<ChannelSettingType>[] = [
    {
      title: '排序值',
      dataIndex: 'orderIndex',
      width: 80,
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: '20%',
      formItemProps: (form, { rowIndex }) => {
        return {
          rules: rowIndex > 2 ? [{ required: true, message: '此项为必填项' }] : [],
        };
      },
    },
    {
      title: '栏目ID',
      dataIndex: channel,
      hideInTable: true,
    },
    {
      title: '组名',
      dataIndex: groupName,
      hideInTable: true,
    },
    {
      title: '文本内容',
      dataIndex: 'descStr',
      hideInTable: type !== 'desc',
    },
    {
      title: '图片地址',
      dataIndex: 'pic',
      hideInTable: type !== 'pic',
    },
    {
      title: type === 'video' ? '视频地址' : '链接',
      dataIndex: 'link',
      hideInTable: type === 'desc',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 150,
      render: (text, record, _, action) => {
        if (record?.disabled && channel !== 'site') {
          return <>
            <a
              style={{
                color: 'rgba(0,0,0,.25)',
                cursor: 'not-allowed',
              }}
            >
              全站配置不可操作
            </a>
          </>
        }
        return <>
          <a
            key="editable"
            onClick={() => {
              action.startEditable?.(record.id!);
            }}
          >
            编辑
        </a>
          <Divider type="vertical" />
          <Popconfirm
            title="删除之后，数据不可恢复，确定要删除吗?"
            onConfirm={async () => {
              try {
                if (record.id) {
                  const idArray = [record.id];
                  const result = await deleteChannelSetting(idArray);
                  if (result.success) {
                    refreshData!();
                    message.info('删除成功');
                  } else {
                    message.error('删除失败，请联系管理员或稍后重试。');
                  }
                }
              } catch (err) {
                message.error('删除失败，请联系管理员或稍后重试。');
              }
            }}
            okText="Yes"
            cancelText="No"
            placement="topLeft"
          >
            <a href="#">删除</a>
          </Popconfirm>
        </>
      }
    },
  ];
  return (
    <EditableProTable<ChannelSettingType>
      rowKey="id"
      columns={columns}
      value={dataSource}
      onChange={setDataSource}
      editable={{
        type: 'single',
        editableKeys,
        onSave: async (_, record) => {
          record.type = type!;
          record.group = groupName;
          if (channel !== 'site') {
            record.Channel = {
              id: channel
            }
          };
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          onSubmit && onSubmit(record);
        },
        onChange: setEditableRowKeys,
        actionRender: (row, config, defaultDom) => [defaultDom.save, defaultDom.cancel],
      }}
    />
  );
};
export default EditableTable;