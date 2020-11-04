import React, { useState, useRef } from 'react';
import { DownOutlined, PlusOutlined, createFromIconfontCN, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Switch, Popover, Modal, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';

import ContentPreview from '@/components/ContentPreview';
import ChannelSelector from '@/components/ChannelSelector';
import { values } from 'lodash';
import { FormInstance } from 'antd/lib/form';
import { TableListItem, TableListParams } from './data.d';
import Option from './components/Option';

import { queryList, remove, setIsHead, setIsRecom, setPub } from './service';

import styles from './index.module.less';

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2063431_zeaap9rtglr.js',
});

const pubHandler = async (ids: string[], action: any) => {
  try {
    const result = await setPub(ids, '已发布');
    if (result.status === 'ok') {
      message.info('发布成功');
      action.reload();
    } else {
      message.error('发布失败，请联系管理员或稍后重试。');
    }
  } catch (err) {
    message.error('发布失败，请联系管理员或稍后重试。');
  }
}

const unPubHandler = async (ids: string[], action: any) => {
  try {
    const result = await setPub(ids, '草稿');
    if (result.status === 'ok') {
      message.info('撤稿成功');
      action.reload();
    } else {
      message.error('撤稿失败，请联系管理员或稍后重试。');
    }
  } catch (err) {
    message.error('撤稿失败，请联系管理员或稍后重试。');
  }
}

const delHandler = (ids: string[], action: any, isRecycleBin: boolean) => {
  Modal.confirm({
    title: `确认删除选中的${ids.length}条吗？`,
    content: <div style={{ color: 'red' }}>{isRecycleBin && '注意，删除后数据将无法恢复。'}</div>,
    icon: <ExclamationCircleOutlined />,
    onOk() {
      (async () => {
        const result = isRecycleBin ?
          await remove(ids) :
          await setPub(ids, '已删除');
        if (result.status === 'ok') {
          message.info('删除成功');
          action.reload();
        }
      })()
    }
  });
};

const unDelHandler = async (ids: string[], action: any) => {
  try {
    const result = await setPub(ids, '草稿');
    if (result.status === 'ok') {
      message.info('恢复成功');
      action.reload();
    } else {
      message.error('恢复失败，请联系管理员或稍后重试。');
    }
  } catch (err) {
    message.error('恢复失败，请联系管理员或稍后重试。');
  }
}

const TableList: React.FC<{}> = () => {
  const [hoverId, setHoverId] = useState(''); // 鼠标经过id预览图标时对应的文章ID
  const [previewId, setPreviewId] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const actionRef = useRef<ActionType>();
  const isRecycleBin = window.location.pathname.includes('recycleBin'); // 回收站

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      search: false,
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
      render: (text, record) => (
        <a onClick={() => {setPreviewId(record.id); setPreviewVisible(true);}}>{text}</a>
      )
    },
    {
      title: '发布时间',
      dataIndex: 'conDate',
      sorter: true,
      valueType: 'dateTime',
      hideInForm: true,
      search: false,
    },
    {
      title: '发布状态',
      dataIndex: 'pubStatus',
      valueEnum: {
        草稿: { text: '草稿', status: 'Default' },
        已发布: { text: '已发布', status: 'Success' },
        已删除: { text: '已删除', status: 'Error' },
      },
      filters: isRecycleBin ? false : [
        {
          text: '已发布',
          value: '已发布',
        },
        {
          text: '草稿',
          value: '草稿',
        },
      ],
      search: !isRecycleBin
    },
    {
      title: '审核状态',
      dataIndex: 'approvalStatus',
      sorter: true,
      hideInForm: true,
      search: false,
      hideInTable: true,
    },
    {
      title: '头条',
      dataIndex: 'isHead',
      defaultSortOrder: 'descend',
      sorter: true,
      search: false,
      align: 'center',
      render: (text, record) => {
        return <Switch
          defaultChecked={!!text}
          size="small"
          disabled={isRecycleBin}
          onChange={async (checked: boolean) => {
            try {
              const result = await setIsHead([record.id], checked)
              if (result.status !== 'ok') {
                message.error('设置失败，请联系管理员或稍后再试。');
              }
            } catch (err) {
              message.error('设置失败，请联系管理员或稍后再试。');
            }
          }}
        />;
      },
    },
    {
      title: '推荐',
      dataIndex: 'isRecom',
      sorter: true,
      search: false,
      align: 'center',
      render: (text, record) => {
        return <Switch
          defaultChecked={!!text}
          size="small"
          disabled={isRecycleBin}
          onChange={async (checked: boolean) => {
            try {
              const result = await setIsRecom([record.id], checked)
              if (result.status !== 'ok') {
                message.error('设置失败，请联系管理员或稍后再试。');
              }
            } catch (err) {
              message.error('设置失败，请联系管理员或稍后再试。');
            }
          }}
        />;
      },
    },
    {
      title: '所属栏目',
      dataIndex: 'Channels',
      ellipsis: true,
      render: (_, record) => {
        const { Channels = [] } = record;
        const names: string[] = [];
        const ids: string[] = [];
        Channels.forEach((c) => {
          names.push(c.name);
          ids.push(c.id);
        });
        return (
          <Popover className={styles.channelCol} content={names.join(', ')}>
            {names.join(',')}
          </Popover>
        );
      },
      order: 1,
      renderFormItem: () => {
        return (
          <ChannelSelector multiple={false} />
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <div className={styles.optionCol}>
          <Option
            id={record.id}
            pubStatus={record.pubStatus}
            refreshHandler={() => {
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }}
          />
        </div>
      ),
      align: 'center',
    },
  ];

  return (
    <PageHeaderWrapper className={styles.contentListWrapper}  title={false}>
      <ContentPreview id={previewId} visiable={previewVisible} hiddenHandler={()=>{setPreviewVisible(false)}} />
      <ProTable<TableListItem>
        headerTitle="文章管理"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={(action, { selectedRows }) => [
          <>
            {
              !isRecycleBin && <Button
                type="primary"
                onClick={() => {
                  window.open('/editArticle/edit');
                }}
              >
                <PlusOutlined /> 新建
              </Button>
            }
          </>,
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={async (e) => {
                    const ids = selectedRows.map(row => row.id);
                    switch (e.key) {
                      case 'pub':
                        pubHandler(ids, action);
                        break;
                      case 'unPub':
                        unPubHandler(ids, action);
                        break;
                      case 'moveTo':
                        break;
                      case 'del':
                        delHandler(ids, action, isRecycleBin);
                        break;
                      case 'unDel':
                        unDelHandler(ids, action);
                        break;
                      default:
                        // do nothing
                    }
                  }}
                  selectedKeys={[]}
                >
                  {!isRecycleBin && <Menu.Item key="pub">批量发布</Menu.Item>}
                  {!isRecycleBin && <Menu.Item key="unPub">批量撤稿</Menu.Item>}
                  {!isRecycleBin && <Menu.Item key="moveTo">批量移动</Menu.Item>}
                  {isRecycleBin && <Menu.Item key="unDel">批量恢复</Menu.Item>}
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
        tableAlertRender={false}
        // tableAlertRender={({ selectedRowKeys }) => (
        //   <div>
        //     已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
        //   </div>
        // )}
        request={(params, sorter, filter) => {
          const opts: TableListParams = {
            ...params,
            sorter: Object.keys(sorter).length ? sorter : { isHead: 'descend' },
            filter,
          };
          if (isRecycleBin) opts.pubStatus = '已删除';
          return queryList(opts);
        }
        }
        beforeSearchSubmit={(params: any) => {
          const { Channels = null } = params;
          const channelId = Channels;
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
