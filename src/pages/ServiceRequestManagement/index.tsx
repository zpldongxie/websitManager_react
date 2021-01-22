import React, { useState, useRef, useEffect } from 'react';
import { DownOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Popover, Modal, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

import type { ServiceStatus, TableListItem, TableListParams } from './data.d';
import Option from './components/Option';

import { queryList, upsert, remove } from './service';

import styles from './index.module.less';
import UpdateForm from './components/UpdateForm';
import Audit from './components/Audit';

const TableList: React.FC = () => {
  const [demandType, setDemandType] = useState('方案咨询');
  // 模态框
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  // 模态框加载内容类型，info为编辑查看界面，audit为审核界面
  const [modalType, setModalType] = useState<'info' | 'audit'>('info');
  // 模态框中的信息是否可编辑
  const [infoEdit, setInfoEdit] = useState(false);
  // 当前信息，用于回填表单
  const [current, setCurrent] = useState<TableListItem | null>(null);
  // 列表对象引用，可主动执行刷新等操作
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    const enName = window.location.pathname.split('/')[2];
    switch (enName) {
      case 'schemeConsultation':
        setDemandType('方案咨询');
        break;
      case 'schemeDemonstration':
        setDemandType('方案论证');
        break;
      case 'schemeDesign':
        setDemandType('方案设计');
        break;
      case 'safetyAssessment':
        setDemandType('安全评估');
        break;
      default:
        break;
    }
  }, []);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      search: false,
      width: '3em',
      hideInTable: true,
    },
    {
      title: '公司名称',
      dataIndex: 'corporateName',
      ellipsis: true,
      render: (text, record) => (
        <a
          onClick={() => {
            setModalType('info');
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
      search: false,
      // width: '15em',
    },
    {
      title: '需求描述',
      dataIndex: 'requestDesc',
      search: false,
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
        接受申请: { text: '接受申请', status: 'Processing' },
        拒绝申请: { text: '拒绝申请', status: 'Error' },
        服务中: { text: '服务中', status: 'Processing' },
        服务完成: { text: '服务完成', status: 'Success' },
      },
      render: (dom, item) => {
        if (item.status === '拒绝申请') {
          return (
            <Popover title="拒绝原因" content={item.rejectReason}>
              <div>{dom}</div>
            </Popover>
          );
        }
        return dom;
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
      search: false,
      // width: '15em',
    },
    {
      hideInTable: true,
      title: '服务描述',
      dataIndex: 'serviceDesc',
      search: false,
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
            editHandler={() => {
              setModalType('info');
              setInfoEdit(true);
              setCurrent(record);
              setModalVisible(true);
            }}
            auditHandler={() => {
              setModalType('audit');
              setCurrent(record);
              setModalVisible(true);
            }}
          />
        </div>
      ),
      align: 'center',
    },
  ];

  /**
   * 实时设置模态框标题
   *
   * @return {*}
   */
  const getModelTitle = () => {
    if (modalType === 'audit') return '审核';
    if (infoEdit) return '编辑信息';
    return '查看信息';
  };

  const handleAdd = async (value: TableListItem) => {
    const res = await upsert({ ...value, demandType });
    if (res.status === 'ok') {
      setModalVisible(false);
      const action = actionRef.current;
      action?.reload();
      message.info('操作成功');
    } else {
      message.warn(res.message);
    }
  };

  const delHandler = (ids: string[], action: any) => {
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

  return (
    <PageHeaderWrapper className={styles.contentListWrapper} title={false}>
      <ProTable<TableListItem>
        headerTitle={demandType}
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
        request={(params, sorter, filter) => {
          const opts: TableListParams = {
            ...params,
            demandType,
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
      <Modal
        title={getModelTitle()}
        destroyOnClose
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        maskClosable={false}
        width={modalType === 'info' ? 800 : 600}
        bodyStyle={{
          maxHeight: '65vh',
          overflowY: 'auto',
          height: modalType === 'info' ? '100vh' : 'auto',
        }}
      >
        {modalType === 'info' && (
          <UpdateForm
            infoEdit={infoEdit}
            current={current}
            onSubmit={handleAdd}
            onCancel={() => setModalVisible(false)}
          />
        )}
        {modalType === 'audit' && (
          <Audit
            info={current}
            onSuccess={(s: ServiceStatus) => {
              const action = actionRef.current;
              action?.reload();
              setCurrent({ ...current!, status: s });
            }}
            onCancel={() => setModalVisible(false)}
          />
        )}
      </Modal>
    </PageHeaderWrapper>
  );
};

export default TableList;
