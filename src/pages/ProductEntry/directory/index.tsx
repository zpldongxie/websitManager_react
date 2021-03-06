import React, { useRef, useState } from 'react';
import {
  PlusOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Button, Divider, Modal, message, Tooltip, Dropdown, Menu, Popconfirm } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';

import { queryList, upEntry, removeFakeList, upEntryAudit } from './service';
import DirectoryForm from './components/DirectoryForm';
import type { TableListParams, TableListItem } from './data';
import styles from './index.module.less';

/**
 * 产品入驻-产品清单
 */

const Index: React.FC = () => {
  const actionRef = useRef<ActionType>();
  // 控制弹框的开关
  const [visible, setVisible] = useState<boolean>(false);
  // 在子组件的useEffect中控制提交的开关
  const [isSubmin, setIsSubmin] = useState<boolean>(false);
  // 查询时不可编辑
  const [disabled, setDisabled] = useState<boolean>(false);
  // 判断是否是修改
  const [isEdit, setIsEdit] = useState<boolean>(false);
  // 编辑时的数据回填
  const [current, setCurrent] = useState<TableListItem>();

  const handleSubmit = (submitFun: any) => {
    if (typeof submitFun === 'function') {
      submitFun();
    }
  };

  // 保存
  const onSubmit = async (value: TableListItem) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const res = await upEntry(value);
    if (res.status === 'ok') {
      setVisible(false);
      setIsSubmin(false);
      setDisabled(false);
      setCurrent(undefined);
      const action = actionRef.current;
      action?.reload();
      message.info('操作成功');
    } else if (res.status === 'error' && Array.isArray(res.message)) {
      setIsSubmin(false);
      message.warn(`${res.message[0].keyword}${res.message[0].message}`);
    } else {
      setIsSubmin(false);
      message.warn(res.message);
    }
  };

  // 单个删除
  const editAndDelete = (currentItem: TableListItem) => {
    const ids: any[] = [];
    ids.push(currentItem.id);
    Modal.confirm({
      title: '删除单位',
      content: (
        <div>
          <div>单位名称： {currentItem.corporateName}</div>确定删除该单位吗？
        </div>
      ),
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const res = await removeFakeList(ids);
        if (res.status === 'ok') {
          const action = actionRef.current;
          action?.reload();
          message.info('操作成功');
        }
      },
    });
  };

  // 批量删除
  const delHandler = (ids: string[], action: any) => {
    Modal.confirm({
      title: `确认删除选中的${ids.length}条吗？`,
      content: <div style={{ color: 'red' }}>注意，删除后数据将无法恢复。</div>,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        (async () => {
          const result = await removeFakeList(ids);
          if (result.status === 'ok') {
            message.info('删除成功');
            action.reload();
          }
        })();
      },
    });
  };

  // 审核
  const examine = async (value: any) => {
    const item = { ...value };
    if (value.status === '正式入驻') {
      item.text = '禁用';
    } else if (value.status === '禁用') {
      item.text = '正式入驻';
    }
    const result = await upEntryAudit({ status: item.text, id: item.id });
    if (result.status === 'ok') {
      const action = actionRef.current;
      action?.reload();
      message.info('操作成功');
    }
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '单位名称',
      dataIndex: 'corporateName',
      ellipsis: true,
      editable: false,
      width: 250,
      key: 'corporateName',
      render: (text, record) => (
        <a
          onClick={() => {
            setVisible(true);
            setDisabled(true);
            setCurrent(record);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: '联系人',
      dataIndex: 'contacts',
      editable: false,
      key: 'contacts',
      width: 100,
    },
    {
      title: '手机号',
      dataIndex: 'contactsMobile',
      editable: false,
      key: 'contactsMobile',
      width: 160,
    },
    {
      title: '详细类别',
      dataIndex: 'Channels',
      search: false,
      key: 'Channels',
      editable: false,
      ellipsis: true,
      render: (text, row) => {
        const names: string[] = [];
        row.Channels?.map((item: { name: any }) => names.push(item.name));
        return (
          <Tooltip title={names.join('，')}>
            <div className={styles.ellips}>{names.join('，')}</div>
          </Tooltip>
        );
      },
    },
    {
      title: '入驻时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      search: false,
      editable: false,
      sorter: true,
      width: 200,
      render: (text) => {
        return <div>{moment(text as string).format('YYYY-MM-DD HH:mm')}</div>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      search: false,
      editable: false,
      filters: true,
      valueEnum: {
        正式入驻: { text: '正式入驻', status: 'Success' },
        禁用: { text: '禁用', status: 'Error' },
      },
      width: 110,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      align: 'center',
      width: 300,
      render: (text, record) => (
        <div>
          <a
            key="editable"
            onClick={() => {
              setVisible(true);
              setIsEdit(true);
              setCurrent(record);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          {record.status === '禁用' ? (
            <Popconfirm
              title="确定启用该单位吗？"
              icon={<QuestionCircleOutlined style={{ color: '#87d068' }} />}
              onConfirm={() => {
                examine(record);
              }}
            >
              <a>启用</a>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="确定禁用该单位吗？"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              onConfirm={() => {
                examine(record);
              }}
            >
              <a>禁用</a>
            </Popconfirm>
          )}
          <Divider type="vertical" />
          <a
            onClick={() => {
              editAndDelete(record);
            }}
          >
            删除
          </a>
        </div>
      ),
    },
  ];
  return (
    <PageHeaderWrapper title={false}>
      <ProTable<TableListItem>
        headerTitle="产品清单"
        columns={columns}
        tableAlertRender={false}
        actionRef={actionRef}
        toolBarRender={(action, { selectedRows }) => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setVisible(true);
            }}
          >
            新建
          </Button>,
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={async (e) => {
                    const ids = selectedRows.map((row) => row.id!);
                    switch (e.key) {
                      case 'del':
                        delHandler(ids, action);
                        break;
                      default:
                      // do nothing
                    }
                  }}
                  selectedKeys={[]}
                >
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
        request={(params, sorter, filter) => {
          const opts: TableListParams = {
            ...params,
            sorter,
            filter,
            type: '产品'
          };
          return queryList(opts);
        }}
        editable={{
          type: 'multiple',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
                created_at: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        pagination={{
          pageSize: 10,
        }}
        rowSelection={{}}
      />
      <Modal
        visible={visible}
        title={disabled ? '查看信息' : `${isEdit ? '编辑' : '新增'}`}
        width="45vw"
        destroyOnClose
        onCancel={() => {
          setVisible(false);
          setIsSubmin(false);
          setDisabled(false);
          setIsEdit(false);
          setCurrent(undefined);
        }}
        footer={
          disabled ? null : (
            <div>
              <Button
                key="back"
                onClick={() => {
                  setVisible(false);
                  setIsSubmin(false);
                  setDisabled(false);
                  setIsEdit(false);
                  setCurrent(undefined);
                }}
              >
                取消
              </Button>
              <Button
                key="submit"
                type="primary"
                onClick={() => {
                  setIsSubmin(true);
                }}
              >
                保存
              </Button>
            </div>
          )
        }
      >
        <DirectoryForm
          submitFun={handleSubmit}
          onSubmit={onSubmit}
          isSubmin={isSubmin}
          disabled={disabled}
          current={current}
          isEdit={isEdit}
        />
      </Modal>
    </PageHeaderWrapper>
  );
};
export default Index;
