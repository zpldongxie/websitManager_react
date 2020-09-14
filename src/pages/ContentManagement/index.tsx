import { DownOutlined, PlusOutlined, createFromIconfontCN, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Switch, Popover, Cascader, Modal } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { CascaderOptionType } from 'antd/lib/cascader';

import { convertChannelsToTree } from '@/utils/utils';
import { ChannelType } from '@/utils/data';
import { TableListItem } from './data.d';
import Option from './components/Option';

import { queryList, queryChannels, remove } from './service';

import styles from './index.module.less';

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2063431_zeaap9rtglr.js',
});

const removeHandler = (selectedRows: {id: string}[], action: any) => {
  Modal.confirm({
    title: `确认删除选中的${selectedRows.length}条吗？`,
    icon: <ExclamationCircleOutlined />,
    onOk() {
      (async () => {
        const result = await remove(selectedRows.map(row => row.id));
        if (result.status === 'ok') {
          action.reload();
        }
      })()
    }
  });
};

const TableList: React.FC<{}> = () => {
  const [channels, setChannels] = useState<CascaderOptionType[]>([]);
  const [hoverId, setHoverId] = useState('');
  const actionRef = useRef<ActionType>();

  const filterChannels = (inputValue: string, path: CascaderOptionType[]) => {
    return path.some(
      (option) => (option?.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
    );
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
      render: (id) => (
        <Popover content={id} title="id">
          <IconFont
            onMouseOver={() => {
              setHoverId(id as string);
            }}
            onMouseLeave={() => {
              setHoverId('');
            }}
            type={hoverId === id ? 'iconyanjing' : 'iconyanjing_bi'}
          />
        </Popover>
      ),
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
      hideInSearch: true,
    },
    {
      title: '发布状态',
      dataIndex: 'pubStatus',
      valueEnum: {
        草稿: { text: '草稿', status: 'Default' },
        已发布: { text: '已发布', status: 'Success' },
      },
      filters: [
        {
          text: '已发布',
          value: '已发布',
        },
        {
          text: '草稿',
          value: '草稿',
        },
      ],
    },
    {
      title: '审核状态',
      dataIndex: 'approvalStatus',
      sorter: true,
      hideInForm: true,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '头条',
      dataIndex: 'isHead',
      defaultSortOrder: 'descend',
      sorter: true,
      hideInSearch: true,
      align: 'center',
      render: (text) => {
        return <Switch checked={!!text} size="small" />;
      },
    },
    {
      title: '推荐',
      dataIndex: 'isRecom',
      sorter: true,
      hideInSearch: true,
      align: 'center',
      render: (text) => {
        return <Switch defaultChecked={!!text} size="small" />;
      },
    },
    {
      title: '所属栏目',
      dataIndex: 'Channels',
      render: (_, record) => {
        const { Channels = [] } = record;
        const names: string[] = [];
        const ids: string[] = [];
        Channels.forEach((c) => {
          names.push(c.name);
          ids.push(c.id);
        });
        return (
          <div title={ids.join(',')} style={{ cursor: 'default' }}>
            {names.join(',')}
          </div>
        );
      },
      order: 1,
      renderFormItem: () => {
        return (
          <Cascader
            options={channels}
            showSearch={{ filter: filterChannels }}
            placeholder="请选择"
          />
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => <Option
        id={record.id}
        pubStatus={record.pubStatus}
        onSuccess={() => {
          if (actionRef.current) {
            actionRef.current.reload();
          }
        }}
      />,
      align: 'center',
    },
  ];

  useEffect(() => {
    (async () => {
      // 组件加载完成立即获取栏目信息
      const channelList: ChannelType[] = await queryChannels();
      // 更新栏目组件
      const cns: CascaderOptionType[] = [];
      convertChannelsToTree(channelList, cns, null);
      setChannels(cns);
    })();
  }, []);

  return (
    <PageHeaderWrapper className={styles.contentListWrapper}>
      <ProTable<TableListItem>
        headerTitle="文章管理"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={(action, { selectedRows }) => [
          <Button
            type="primary"
            onClick={() => {
              window.open('/editArticle/edit');
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={async (e) => {
                    if (e.key === 'del') {
                      removeHandler(selectedRows, action);                      
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
        request={(params, sorter, filter) =>
          queryList({
            ...params,
            sorter: Object.keys(sorter).length ? sorter : { isHead: 'descend' },
            filter,
          })
        }
        beforeSearchSubmit={(params: any) => {
          const { Channels = [] } = params;
          const channelId = Channels.length ? Channels[Channels.length - 1] : null;
          const newParams = { ...params, channelId };
          delete newParams.Channels;
          return newParams;
        }}
        columns={columns}
        rowSelection={{}}
      />
    </PageHeaderWrapper>
  );
};

export default TableList;
