import React, { useState, useRef } from 'react';
import {
  DownOutlined,
  PlusOutlined,
  createFromIconfontCN,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Menu, Popover, Modal, message, } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { PersonalTableListItem, TableListParams, AuditMemberParams, TableListItem } from './data.d';
import Option from './components/Option';
import OperationModal from './components/OperationModal';
import AuditModal from './components/AuditModal';

import { queryPersonalMemberList, removePersonalMember, upsertPersonalMember, auditPersonalMember } from './service';

import styles from './index.module.less';

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2063431_zeaap9rtglr.js',
});
const delHandler = (ids: string[], action: any) => {
  Modal.confirm({
    title: `确认删除选中的${ids.length}条吗？`,
    content: <div style={{ color: 'red' }}>{'注意，删除后数据将无法恢复。'}</div>,
    icon: <ExclamationCircleOutlined />,
    onOk() {
      (async () => {
        const result = await removePersonalMember(ids);
        if (result.status === 'ok') {
          message.info('删除成功');
          action.reload();
        }
      })();
    },
  });
};

const TableList: React.FC = () => {
  const [currentStatus, setCurrentStatus] = useState<string[] | undefined>(['正式会员', '禁用']);
  const [hoverId, setHoverId] = useState(''); // 鼠标经过id预览图标时对应的会员ID
  const [opVisible, setOpVisible] = useState<boolean>(false);
  const [auditVisible, setAuditVisible] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);
  const [loadingSpin, setLoadingSpin] = useState<boolean>(false);
  const [currentOp, setCurrentOp] = useState<Partial<TableListItem> | undefined>(undefined);
  const [currentAudit, setCurrentAudit] = useState<AuditMemberParams | undefined>(undefined);
  const actionRef = useRef<ActionType>();

  const showModal = () => {
    setOpVisible(true);
    setCurrentOp(undefined);
  };
  const showCheckModal = (item: PersonalTableListItem) => {
    const currentItem = { ...item };
    setDone(true);
    setOpVisible(true);
    setCurrentOp(currentItem);
  };
  const showEditModal = (item: PersonalTableListItem) => {
    const currentItem = { ...item };
    setOpVisible(true);
    setCurrentOp(currentItem);
  };
  const showAuditModal = (item: PersonalTableListItem) => {
    const currentItem = { ...item };
    setAuditVisible(true);
    setCurrentAudit({ id: currentItem.id, status: currentItem.status });
  };
  const handleDone = () => {
    setDone(false);
    setOpVisible(false);
  };

  const handleCancel = () => {
    setOpVisible(false);
    setAuditVisible(false);
  };

  const handleOperationSubmit = async (values: PersonalTableListItem) => {
    const pram = { ...values };
    const result = await upsertPersonalMember(pram);
    if (result.status === "ok") {
      setOpVisible(false);
      const action = actionRef.current;
      action?.reload();
      if (currentOp) {
        message.info('个人会员修改成功');
      } else {
        message.info('个人会员添加成功');
      }
    } else {
      message.error(result.message);
    }
  };
  const handleAuditSubmit = async (values: AuditMemberParams) => {
    const pram = { ...values };
    setLoadingSpin(true);
    const result = await auditPersonalMember(pram);
    if (result.status === "ok") {
      setAuditVisible(false);
      setLoadingSpin(false);
      const action = actionRef.current;
      action?.reload();
      message.info('审核成功');
    } else {
      setAuditVisible(false);
      setLoadingSpin(false);
      message.error('审核失败，请联系管理员或稍后重试。');
    }
  }
  const columns: ProColumns<PersonalTableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      search: false,
      hideInForm: true,
      hideInTable: true,
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
      title: '姓名',
      dataIndex: 'name',
      ellipsis: true,
      width: '5em',
      render: (text, record) => (
        <a onClick={() => {
          showCheckModal(record)
        }}>
          {text}
        </a>
      ),
    },
    {
      title: '联系电话',
      dataIndex: 'mobile',
      width: '7em',
    },
    {
      title: '身份证号',
      dataIndex: 'idNumber',
      search: false,
      width: '10em',
    },
    {
      title: '职业',
      dataIndex: 'profession',
      width: '7em',
      search: false,
    },
    {
      title: '邮箱',
      search: false,
      ellipsis: true,
      dataIndex: 'email',
      width: '9em',
    },
    {
      title: '注册日期',
      dataIndex: 'logonDate',
      search: false,
      sorter: true,
      ellipsis: true,
      width: '8em',
      render: (_, record) => (
        <span>{record && record.logonDate && record.logonDate.split(/T/g)[0]}</span>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      search: false,
      width: '5em',
    },
    {
      title: '个人简介',
      search: false,
      dataIndex: 'intro',
      ellipsis: true,
      width: '7em',
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
            type="personal"
            refreshHandler={() => {
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }}
            editHandler={() => {
              showEditModal(record);
            }}
            auditHandler={() => {
              showAuditModal(record);
            }}
            checkHandler={() => {
              showCheckModal(record);
            }}
          />
        </div>
      ),
      align: 'center',
    },
  ];

  return (
    <>
      <PageHeaderWrapper className={styles.contentListWrapper} title={false}>

        <ProTable<PersonalTableListItem>
          actionRef={actionRef}
          rowKey="id"
          toolbar={{
            menu: {
              type: 'tab',
              items: [
                {
                  label: '个人列表',
                  key: 'official',
                },
                {
                  label: '申请审批',
                  key: 'apply',
                },
              ],
              onChange: (activeKey) => {
                let curStatus: string[] | undefined;
                if (activeKey === "official") {
                  curStatus = ['正式会员', '禁用']
                }
                if (activeKey === "apply") {
                  curStatus = ['申请中', '初审通过', '申请驳回']
                }
                setCurrentStatus(curStatus);
                actionRef.current?.reload();
              },
            },
          }}
          toolBarRender={(action, { selectedRows }) => [
            <>
              <Button
                type="primary"
                onClick={showModal}
              >
                <PlusOutlined /> 新建
                </Button>
            </>,
            selectedRows && selectedRows.length > 0 && (
              <Dropdown
                overlay={
                  <Menu
                    onClick={async (e) => {
                      const ids = selectedRows.map((row) => row.id);
                      switch (e.key) {
                        case 'del':
                          delHandler(ids, action);
                          break;
                        default:
                          // do nothing
                          break;
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
              sorter: Object.keys(sorter).length ? sorter : { status: 'descend' },
              filter,
              status: currentStatus
            };
            return queryPersonalMemberList(opts);
          }}
          columns={columns}
          rowSelection={{}}
        />
      </PageHeaderWrapper>
      <OperationModal
        type="personal"
        visible={opVisible}
        current={currentOp}
        done={done}
        loading={loadingSpin}
        onDone={handleDone}
        onCancel={handleCancel}
        onSubmitPersonal={handleOperationSubmit}
      />
      <AuditModal
        type="personal"
        visible={auditVisible}
        current={currentAudit}
        onCancel={handleCancel}
        onSubmit={handleAuditSubmit}
      />
    </>
  );
};

export default TableList;
