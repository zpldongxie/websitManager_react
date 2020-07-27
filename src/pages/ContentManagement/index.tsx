import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message, Switch, Input } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';

import SelectChannels from '@/components/SelectChannels';
import CreateForm from './components/CreateForm';
// import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem } from './data.d';
import { queryContentList } from './service';

import styles from './index.module.less';

/**
 * 添加节点
 * @param fields
 */
// const handleAdd = async (fields: TableListItem) => {
//   const hide = message.loading('正在添加');
//   try {
//     await addRule({ ...fields });
//     hide();
//     message.success('添加成功');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('添加失败请重试！');
//     return false;
//   }
// };

/**
 * 更新节点
 * @param fields
 */
// const handleUpdate = async (fields: FormValueType) => {
//   const hide = message.loading('正在配置');
//   try {
//     await updateRule({
//       name: fields.name,
//       desc: fields.desc,
//       key: fields.key,
//     });
//     hide();

//     message.success('配置成功');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('配置失败请重试！');
//     return false;
//   }
// };

/**
 *  删除节点
 * @param selectedRows
 */
// const handleRemove = async (selectedRows: TableListItem[]) => {
//   const hide = message.loading('正在删除');
//   if (!selectedRows) return true;
//   try {
//     await removeRule({
//       key: selectedRows.map((row) => row.key),
//     });
//     hide();
//     message.success('删除成功，即将刷新');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('删除失败，请重试');
//     return false;
//   }
// };

const TableList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [showChannels, setShowChannels] = useState(false);
  const [channelId, setChannelId] = useState("-1");
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true
    },
    {
      title: '标题',
      dataIndex: 'title',
      ellipsis: true,
    },
    {
      title: '发布时间',
      dataIndex: 'conDate',
      sorter: true,
      valueType: 'dateTime',
      hideInForm: true,
      hideInSearch: true
    },
    {
      title: '发布状态',
      dataIndex: 'pubStatus',
      valueEnum: {
        '草稿': { text: '草稿', status: 'Default' },
        '已发布': { text: '已发布', status: 'Success' },
      },
      // 当前后台暂时不支持
      // filters: [
      //   {
      //     text: '已发布',
      //     value: '已发布'
      //   },
      //   {
      //     text: '草稿',
      //     value: '草稿'
      //   }
      // ]
    },
    {
      title: '审核状态',
      dataIndex: 'approvalStatus',
      sorter: true,
      hideInForm: true,
      hideInSearch: true,
      hideInTable: true
    },
    {
      title: '头条',
      dataIndex: 'isHead',
      sorter: true,
      hideInSearch: true,
      align: 'center',
      render: (text) => {
        return <Switch checked={!!text} size="small" />
      }
    },
    {
      title: '推荐',
      dataIndex: 'isRecom',
      sorter: true,
      hideInSearch: true,
      align: 'center',
      render: (text) => {
        return <Switch defaultChecked={!!text} size="small" />
      }
    },
    {
      title: '所属栏目',
      dataIndex: 'channels',
      render: (_, record) => {
        const { channels = [] } = record;
        const names: string[] = [];
        const ids: string[] = [];
        channels.forEach(c => {
          names.push(c.name);
          ids.push(c.id);
        });
        return <div title={ids.join(',')} style={{ cursor: 'default' }}>{names.join(',')}</div>
      },
      order: 2,
      renderFormItem: (item, { defaultRender, ...rest }) => {
        return <Input {...rest} placeholder="请选择" />;
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Option
          id={record.id}
          pubStatus={record.pubStatus}
        />
      ),
      align: 'center',
    },
  ];

  return (
    <PageHeaderWrapper className={styles.contentListWrapper}>
      <ProTable<TableListItem>
        headerTitle="文章管理"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={(action, { selectedRows }) => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={async (e) => {
                    if (e.key === 'remove') {
                      // await handleRemove(selectedRows);
                      action.reload();
                    }
                  }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="pub">批量发布</Menu.Item>
                  <Menu.Item key="unPub">批量撤稿</Menu.Item>
                  <Menu.Item key="moveTo">批量移动</Menu.Item>
                  <Menu.Item key="del">批量删除</Menu.Item>
                </Menu>
              }
            >
              <Button>
                批量操作 <DownOutlined />
              </Button>
            </Dropdown>
          ),
        ]}
        tableAlertRender={({ selectedRowKeys }) => (
          <div>
            已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
          </div>
        )}
        request={(params, sorter, filter) => queryContentList({ ...params, sorter, filter, channelId })}
        columns={columns}
        rowSelection={{}}
      />
      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProTable<TableListItem, TableListItem>
          // onSubmit={async (value) => {
          //   const success = await handleAdd(value);
          //   if (success) {
          //     handleModalVisible(false);
          //     if (actionRef.current) {
          //       actionRef.current.reload();
          //     }
          //   }
          // }}
          rowKey="key"
          type="form"
          columns={columns}
          rowSelection={{}}
        />
      </CreateForm>
      <SelectChannels show={showChannels} />
    </PageHeaderWrapper>
  );
};

interface OptionProps {
  id: number;
  pubStatus: string;
}

/**
 * 操作列
 *
 * @param {{pubStatus: string}} optionProps
 * @returns
 */
const Option = (optionProps: OptionProps) => {
  const {
    id,
    pubStatus
  } = optionProps;
  if (pubStatus === '已发布') {
    return (
      <>
        <a
          onClick={() => {
            message.info(id)
          }}
        >
          详情
      </a>
        <Divider type="vertical" />
        <a
          onClick={() => {
          }}
        >
          撤稿
      </a>
      </>
    )
  }
  return (
    <>
      <a
        onClick={() => {
        }}
      >
        编辑
      </a>
      <Divider type="vertical" />
      <a
        onClick={() => {
        }}
      >
        发布
      </a>
      <Divider type="vertical" />
      <a
        onClick={() => {
        }}
      >
        删除
      </a>
    </>
  )
}

export default TableList;
