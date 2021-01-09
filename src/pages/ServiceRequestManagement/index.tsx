import React, { useState, useRef } from 'react';
import {
  DownOutlined,
  PlusOutlined,
  createFromIconfontCN,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Menu, Popover, Modal, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';

import StepPanel from '@/components/StepPanel';
import { TableListItem, TableListParams } from './data.d';
import Option from './components/Option';

import { queryList, remove } from './service';

import styles from './index.module.less';
import OperationPanel from './components/OperationPanel';
import UpdateForm from './components/UpdateForm';

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2063431_zeaap9rtglr.js',
});

const handleAdd = (value: TableListItem) => {
  return value;
};

const delHandler = (ids: number[], action: any) => {
  Modal.confirm({
    title: `确认删除选中的${ids.length}条吗？`,
    content: <div style={{ color: 'red' }}>注意，删除后数据将无法恢复。</div>,
    icon: <ExclamationCircleOutlined />,
    onOk() {
      (async () => {
        const result = await remove(ids);
        if (result.status === 'ok') {
          message.info('删除成功');
          action.reload();
        }
      })();
    },
  });
};

const TableList: React.FC<{}> = () => {
  // 模态框
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  // 模态框类型，info为单独显示申请信息，setp为按审核步骤显示
  const [modalType, setModalType] = useState<'info' | 'step'>('info');
  // 模态框中的信息是否可编辑
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [infoEdit, setInfoEdit] = useState(false);
  const [current, setCurrent] = useState<TableListItem | null>(null);
  // 鼠标经过id预览图标时对应的文章ID
  const [hoverId, setHoverId] = useState('');
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      search: false,
      width: '3em',
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
      title: '公司名称',
      dataIndex: 'corporateName',
      // ellipsis: true,
      render: (text, record) => (
        <a
          onClick={() => {
            setModalType('step');
            setInfoEdit(false);
            setCurrent(record);
            setModalVisible(true);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      hideInTable: true,
      title: '座机',
      dataIndex: 'tel',
      search: false,
      // width: '15em',
    },
    {
      hideInTable: true,
      title: '邮箱',
      dataIndex: 'email',
      search: false,
      // width: '15em',
    },
    {
      hideInTable: true,
      title: '地址',
      dataIndex: 'address',
      search: false,
      // width: '15em',
    },
    {
      hideInTable: true,
      title: '邮编',
      dataIndex: 'zipCode',
      search: false,
      // width: '15em',
    },
    {
      hideInTable: true,
      title: '企业网站',
      dataIndex: 'website',
      search: false,
      // width: '15em',
    },
    {
      title: '联系人',
      dataIndex: 'contacts',
      // width: '15em',
    },
    {
      title: '手机号',
      dataIndex: 'contactsMobile',
      // width: '15em',
    },
    {
      hideInTable: true,
      title: '需求类型',
      dataIndex: 'demandType',
      // width: '15em',
    },
    {
      title: '需求描述',
      dataIndex: 'requestDesc',
      // width: '15em',
    },
    {
      title: '审批时间',
      dataIndex: 'updatedAt',
      sorter: true,
      valueType: 'dateTime',
      search: false,
      // width: '15em',
    },
    {
      title: '申请时间',
      dataIndex: 'createdAt',
      sorter: true,
      valueType: 'dateTime',
      search: false,
      // width: '15em',
    },
    {
      title: '状态',
      dataIndex: 'status',
      // width: '7em',
      valueEnum: {
        申请中: { text: '申请中', status: 'Default' },
        接受申请: { text: '接受申请', status: 'Success' },
        拒绝申请: { text: '拒绝申请', status: 'Error' },
        服务中: { text: '服务中', status: 'Error' },
        服务完成: { text: '服务完成', status: 'Error' },
      },
      filters: [
        {
          text: '申请中',
          value: '申请中',
        },
        {
          text: '接受申请',
          value: '接受申请',
        },
        {
          text: '拒绝申请',
          value: '拒绝申请',
        },
        {
          text: '服务中',
          value: '服务中',
        },
        {
          text: '服务完成',
          value: '服务完成',
        },
      ],
      search: { transform: (_: any, __: string, object: any) => object },
    },
    {
      hideInTable: true,
      title: '拒绝原因',
      dataIndex: 'rejectReason',
      // width: '15em',
    },
    {
      hideInTable: true,
      title: '服务描述',
      dataIndex: 'serviceDesc',
      // width: '15em',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: '15em',
      render: (_, record) => (
        <div className={styles.optionCol}>
          <Option
            id={record.id}
            status={record.status}
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
    <PageHeaderWrapper className={styles.contentListWrapper} title={false}>
      <ProTable<TableListItem>
        headerTitle="文章管理"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={(action, { selectedRows }) => [
          <>
            <Button
              type="primary"
              onClick={() => {
                setModalType('info');
                setInfoEdit(true);
                setCurrent(null);
                setModalVisible(true);
              }}
            >
              <PlusOutlined /> 新建
            </Button>
          </>,
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
                  <Menu.Item key="apply">批量审核</Menu.Item>
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
            sorter: Object.keys(sorter).length ? sorter : { createdAt: 'descend' },
            filter,
          };
          return queryList(opts);
        }}
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
      <OperationPanel
        title={modalType === 'info' ? '编辑信息' : '查询审核'}
        onCancel={() => setModalVisible(false)}
        modalVisible={modalVisible}
      >
        {modalType === 'info' && (
          <UpdateForm
            current={current}
            onSubmit={handleAdd}
            onCancel={() => setModalVisible(false)}
          />
        )}
        {modalType === 'step' && <StepPanel steps={['申请信息', '审核']} />}
      </OperationPanel>
    </PageHeaderWrapper>
  );
};

export default TableList;
