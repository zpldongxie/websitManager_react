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
import type { PersonalTableListItem, TableListParams } from './data.d';
import Option from './components/Option';
import OperationModal from './components/OperationModal';

import { queryPersonalMemberList, removePersonalMember, upsertPersonalMember } from './service';

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
  const [visible, setVisible] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<PersonalTableListItem> | undefined>(undefined);
  const actionRef = useRef<ActionType>();

  const showModal = () => {
    setVisible(true);
    setCurrent(undefined);
  };
  const showEditModal = (item: PersonalTableListItem) => {
    const currentItem = { ...item };
    setVisible(true);
    setCurrent(currentItem);
  };

  const handleDone = () => {
    setDone(false);
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSubmit = async (values: PersonalTableListItem) => {
    const pram = { ...values };
    const result = await upsertPersonalMember(pram);
    if (result.status === "ok") {
      setVisible(false);
      const action = actionRef.current;
      action?.reload();
      if (current) {
        message.info('个人会员修改成功');
      } else {
        message.info('个人会员添加成功');
      }
    } else {
      message.error(result.msg);
    }
  };
  const columns: ProColumns<PersonalTableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      search: false,
      hideInForm: true,
      hideInTable:true,
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
          setDone(true);
          setVisible(true);
          setCurrent(record);
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
      width: '10em',
    },
    {
      title: '职业',
      dataIndex: 'profession',
      width: '7em',
    },
    {
      title: '邮箱',
      search: false,
      dataIndex: 'email',
      width: '9em',
    },
    {
      title: '注册日期',
      dataIndex: 'logonData',
      search: false,
      sorter: true,
      ellipsis: true,
      width: '8em',
      render: (text) => (
        <span onClick={() => {
        }}>{text && text.props.title && text.props.title.split(/T/g)[0]}</span>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      search: false,
      width: '5em',
    },
    {
      title: '备注',
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
        visible={visible}
        currentPersonal={current}
        done={done}
        onDone={handleDone}
        onCancel={handleCancel}
        onSubmitPersonal={handleSubmit}
      />
    </>
  );
};

export default TableList;
