import React, { useState, useRef, useEffect } from 'react';
import {
  DownOutlined,
  PlusOutlined,
  createFromIconfontCN,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Menu, Popover, Modal, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { TableListItem, TableListParams, AuditMemberParams } from './data.d';
import Option from './components/Option';
import OperationModal from './components/OperationModal';
import AuditModal from './components/AuditModal';

import { queryCompanyMemberList, removeCompanyMember, upsertCompanyMember, auditCompanyMember, queryMemberTypes } from './service';

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
        const result = await removeCompanyMember(ids);
        if (result.status === 'ok') {
          message.info('删除成功');
          action.reload();
        }
      })();
    },
  });
};
let memberTypeValues: { id: any; name: any; }[] = [];
const getMemberTypes = async () => {
  const result = await queryMemberTypes();
  memberTypeValues = result;
}
const TableList: React.FC = () => {
  const [currentStatus, setCurrentStatus] = useState<string | undefined>('official');
  const [hoverId, setHoverId] = useState(''); // 鼠标经过id预览图标时对应的会员ID
  const [opVisible, setOpVisible] = useState<boolean>(false);
  const [auditVisible, setAuditVisible] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);
  const [loadingSpin, setLoadingSpin] = useState<boolean>(false);
  const [currentOp, setCurrentOp] = useState<Partial<TableListItem> | undefined>(undefined);
  const [currentAudit, setCurrentAudit] = useState<AuditMemberParams | undefined>(undefined);
  const actionRef = useRef<ActionType>();
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    memberTypeValues.length === 0 ? getMemberTypes() : '';
  });
  const showModal = () => {
    setOpVisible(true);
    setCurrentOp(undefined);
  };
  const showCheckModal = (item: TableListItem) => {
    const currentItem = { ...item };
    setDone(true);
    setOpVisible(true);
    setCurrentOp(currentItem);
  };
  const showEditModal = (item: TableListItem) => {
    const currentItem = { ...item };
    setOpVisible(true);
    setCurrentOp(currentItem);
  };
  const showAuditModal = (item: TableListItem) => {
    const currentItem = { ...item };
    setAuditVisible(true);
    setCurrentAudit({ id: currentItem.id, status: currentItem.status, rejectDesc: currentItem.rejectDesc });
  };
  const handleDone = () => {
    setDone(false);
    setOpVisible(false);
  };

  const handleCancel = () => {
    setOpVisible(false);
    setAuditVisible(false);
  };

  const handleOperationSubmit = async (values: TableListItem) => {
    const pram = { ...values };
    setLoadingSpin(true);
    const result = await upsertCompanyMember(pram);
    if (result.status === "ok") {
      // setOpVisible(false);
      setLoadingSpin(false);
      const action = actionRef.current;
      action?.reload();
      if (currentOp) {
        message.info('企业会员修改成功');
      } else {
        message.info('企业会员添加成功');
      }
    } else {
      setLoadingSpin(false);
      message.error(result.message);
    }
  };
  const handleAuditSubmit = async (values: AuditMemberParams) => {

    const pram = { ...values };
    const result = await auditCompanyMember(pram);
    if (result.status === "ok") {
      // setAuditVisible(false);
      const action = actionRef.current;
      action?.reload();
      message.info('审核成功');
    } else if (result.message.indexOf('邮件') > -1) {
      // setAuditVisible(false);
      const action = actionRef.current;
      action?.reload();
      message.warn('审核成功，邮件发送失败，请检查邮箱地址是否有效');
    } else {
      message.error('审核失败，请联系管理员或稍后重试。');
    }
  }
  const columns: ProColumns<TableListItem>[] = [
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
      title: '单位名称',
      dataIndex: 'corporateName',
      ellipsis: true,
      width: '7em',
      render: (text, record) => (
        <a onClick={() => {
          showCheckModal(record)
        }}>
          {text}
        </a>
      ),
    },
    {
      title: '联系人',
      dataIndex: 'contacts',
      hideInForm: true,
      search: false,
      hideInTable: false,
      width: '5em',
    },
    {
      title: '手机号',
      dataIndex: 'contactsMobile',
      defaultSortOrder: 'descend',
      align: 'center',
      width: '7em'
    },
    {
      title: '会员等级',
      dataIndex: 'MemberType',
      sorter: true,
      align: 'center',
      width: '7em',
      valueType: 'select',
      valueEnum: {
        副理事长单位: { text: '副理事长单位' },
        理事单位: { text: '理事单位' },
        单位会员: { text: '单位会员' },
      },
      render: (_, record) => (
        <span>{record.MemberType?.name}</span>
      ),
      search: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        transform: (_: any, __: string, object: any) => {
          // eslint-disable-next-line func-names
          const data = memberTypeValues.filter(function (item) {
            return item.name === _;
          });
          return {
            MemberTypeId:data[0].id
          }
        }
      },
    },
    {
      title: '所属行业',
      dataIndex: 'industry',
      sorter: true,
      search: false,
      hideInTable: true,
      align: 'center',
      width: '10em',
    },
    {
      title: '座机',
      dataIndex: 'tel',
      search: false,
      hideInTable: true,
      width: '7em',
    },
    {
      title: '邮箱',
      search: false,
      hideInTable: currentStatus !== "official",
      dataIndex: 'email',
      width: '7em',
      ellipsis: true,
    },
    {
      title: '入会日期',
      dataIndex: 'logonDate',
      search: false,
      hideInTable: currentStatus !== "official",
      sorter: true,
      ellipsis: true,
      width: '8em',
      render: (_, record) => (
        <span>{record.logonDate?.split(/T/g)[0]}</span>
      )
    },
    {
      title: '申请日期',
      dataIndex: 'createdAt',
      search: false,
      hideInTable: currentStatus === "official",
      sorter: true,
      ellipsis: true,
      width: '8em',
      render: (_, record) => (
        <span>{record.createdAt?.split(/T/g)[0]}</span>
      )
    },
    {
      title: '更新日期',
      dataIndex: 'updatedAt',
      search: false,
      hideInTable: currentStatus === "official",
      sorter: true,
      ellipsis: true,
      width: '8em',
      render: (_, record) => (
        <span>{record.updatedAt?.split(/T/g)[0]}  {record.updatedAt?.substring(11, 16)}</span>
      )
    },
    {
      title: '发件状态',
      dataIndex: 'sendEmailStatus',
      search: false,
      hideInTable: currentStatus === "official",
      sorter: true,
      ellipsis: true,
      width: '8em',
      render: (_, record) => (
        <span>{record.sendEmailStatus?.split(/T/g)[0]}  {record.sendEmailStatus?.substring(11, 16)}</span>
      )
    },
    {
      title: currentStatus === "official" ? '状态' : '审核状态',
      dataIndex: 'status',
      width: '7em',
      valueEnum: {
        申请中: { text: '申请中', status: 'Default' },
        初审通过: { text: '初审通过', status: 'Processing' },
        申请驳回: { text: '已驳回', status: 'Error' },
        正式会员: { text: '已入会', status: 'Success' },
        禁用: { text: '已禁用', status: 'Error' },
      },
      render: (dom, item) => {
        if (item.status === '申请驳回') {
          return (
            <Popover title="驳回原因" content={item.rejectDesc}>
              <div>{dom}</div>
            </Popover>
          );
        }
        return dom;
      },
      filters: currentStatus === "official" ? [{
        text: '正式会员',
        value: '正式会员',
      },
      {
        text: '禁用',
        value: '禁用',
      },] : [
          {
            text: '申请中',
            value: '申请中',
          },
          {
            text: '初审通过',
            value: '初审通过',
          },
          {
            text: '申请驳回',
            value: '申请驳回',
          },
        ],
      search: false,
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

        <ProTable<TableListItem>
          actionRef={actionRef}
          rowKey="id"
          toolbar={{
            menu: {
              type: 'tab',
              items: [
                {
                  label: '单位列表',
                  key: 'official',
                },
                {
                  label: '申请审批',
                  key: 'apply',
                },
              ],
              onChange: (activeKey) => {
                setCurrentStatus(activeKey?.toString());
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
              status: currentStatus === "official" ? ['正式会员', '禁用'] : ['申请中', '初审通过', '申请驳回']
            };
            return queryCompanyMemberList(opts);
          }}
          columns={columns}
          rowSelection={{}}
        />
      </PageHeaderWrapper>

      <OperationModal
        visible={opVisible}
        current={currentOp}
        done={done}
        loading={loadingSpin}
        onDone={handleDone}
        onCancel={handleCancel}
        onSubmit={handleOperationSubmit}
      />
      <AuditModal
        visible={auditVisible}
        current={currentAudit}
        onCancel={handleCancel}
        onSubmit={handleAuditSubmit}
      />
    </>
  );
};

export default TableList;
