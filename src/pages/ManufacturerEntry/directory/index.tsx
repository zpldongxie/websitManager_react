import React, { useRef, useState } from 'react';
import { PlusOutlined, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, message, Tooltip, Dropdown, Menu } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';

import { queryList, upEntry, removeFakeList } from './service';
import DirectoryForm from './components/DirectoryForm';
import type { TableListParams, TableListItem } from './data';
import styles from './index.module.less';

/**
 * 厂商入驻-厂商名录
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

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '单位名称',
      dataIndex: 'corporateName',
      ellipsis: true,
      editable: false,
      width: 250,
      key: 'corporateName',
      render: (text, record) => (
        <div
          onClick={() => {
            setVisible(true);
            setDisabled(true);
            setCurrent(record);
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: '联系人',
      dataIndex: 'contacts',
      editable: false,
      search: false,
      key: 'contacts',
      width: 150,
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
        申请中: { text: '申请中', status: 'Processing' },
        初审通过: { text: '初审通过', status: 'Processing' },
        正式入住: { text: '正式入住', status: 'Success' },
        申请驳回: { text: '申请驳回', status: 'Warning' },
        禁用: { text: '禁用', status: 'Error' },
      },
      width: 110,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      align: 'center',
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
          <a
            key="view"
            onClick={() => {
              setVisible(true);
              setDisabled(true);
              setCurrent(record);
            }}
          >
            查看
          </a>
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
        headerTitle="厂商名录"
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
        title={disabled ? '查看信息' : `${isEdit ? '编辑' : '新建'}`}
        width={640}
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
        />
      </Modal>
    </PageHeaderWrapper>
  );
};
export default Index;
