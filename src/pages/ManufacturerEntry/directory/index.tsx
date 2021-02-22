import React, { useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Modal } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';

import { queryList } from './service';
import DirectoryForm from './components/DirectoryForm';
import type { TableListParams, TableListItem } from './data';

/**
 * 厂商入驻-厂商名录
 */

type GithubIssueItem = {
  url: string;
  id: number;
  number: number;
  title: string;
  labels: {
    name: string;
    color: string;
  }[];
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  logonDate?: string;
};
const Index: React.FC = () => {
  const actionRef = useRef<ActionType>();
  // 控制弹框的开关
  const [visible, setVisible] = useState<boolean>(false);
  // 在useEffect中控制提交的开关
  const [isSubmin, setIsSubmin] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleSubmit = (submitFun: any) => {
    if (typeof submitFun === 'function') {
      submitFun();
    }
  };
  const onOK = () => {
    setIsSubmin(true);
  };
  const onSubmit = async (value: TableListItem) => {
    console.log('value', value);
    setVisible(false);
    setIsSubmin(false);
    setDisabled(false);
    // const res = await upsert(value);
    // if (res.status === 'ok') {
    //   setModalVisible(false);
    //   const action = actionRef.current;
    //   action?.reload();
    //   message.info('操作成功');
    // } else {
    //   message.warn(res.message);
    // }
  };
  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '单位名称',
      dataIndex: 'corporateName',
      ellipsis: true,
      editable: false,
      width: 250,
      render: (text) => (
        <div
          onClick={() => {
            setVisible(true);
            setDisabled(true);
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
      width: 150,
    },
    {
      title: '手机号',
      dataIndex: 'contactsMobile',
      editable: false,
      width: 160,
    },
    {
      title: '详细类别',
      dataIndex: 'type',
      search: false,
      editable: false,
    },
    {
      title: '入驻时间',
      dataIndex: 'logonDate',
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
      align: 'center',
      render: () => (
        <div>
          <a
            key="editable"
            onClick={() => {
              setVisible(true);
              setIsEdit(true);
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
            }}
          >
            查看
          </a>
          <Divider type="vertical" />
          <a>删除</a>
        </div>
      ),
    },
  ];
  return (
    <PageHeaderWrapper title={false}>
      <ProTable<GithubIssueItem>
        headerTitle="厂商名录"
        columns={columns}
        actionRef={actionRef}
        toolBarRender={() => [
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
        ]}
        request={(params, sorter, filter) => {
          const opts: TableListParams = {
            ...params,
            sorter: Object.keys(sorter).length ? sorter : { createdAt: 'descend' },
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
          pageSize: 5,
        }}
        rowSelection={{}}
      />
      <Modal
        visible={visible}
        title={disabled ? '查看信息' : `${isEdit ? '编辑' : '新建'}`}
        width={640}
        onCancel={() => {
          setVisible(false);
          setIsSubmin(false);
          setDisabled(false);
          setIsEdit(false);
        }}
        footer={
          <div>
            <Button
              key="back"
              onClick={() => {
                setVisible(false);
                setIsSubmin(false);
                setDisabled(false);
                setIsEdit(false);
              }}
            >
              取消
            </Button>
            <Button key="submit" type="primary" onClick={onOK}>
              保存
            </Button>
          </div>
        }
      >
        <DirectoryForm
          submitFun={handleSubmit}
          onSubmit={onSubmit}
          isSubmin={isSubmin}
          disabled={disabled}
        />
      </Modal>
    </PageHeaderWrapper>
  );
};
export default Index;
