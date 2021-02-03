/* eslint-disable react-hooks/exhaustive-deps */
import type { FC } from 'react';
import React, { useRef, useState, useEffect } from 'react';
import { DownOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Dropdown, Divider, Menu, Modal, message } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

import { findDOMNode } from 'react-dom';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import moment from 'moment';
import OperationModal from './components/OperationModal';
import type { StateType } from './model';
import type { TrainingDataType, TableListParams } from './data.d';
import { queryList, removeFakeList } from './service';

type TrainingManagementProps = {
  trainingManagement: StateType;
  dispatch: Dispatch;
  loading: boolean;
};

/**
 * 配置列
 *
 * @param {{
 *   data: TrainingDataType;
 * }} {
 *   data: { trainingMethod, Channel, startTime, endTime },
 * }
 */

export const TrainingManagement: FC<TrainingManagementProps> = (props) => {
  // 列表对象引用，可主动执行刷新等操作
  const actionRef = useRef<ActionType>();
  const addBtn = useRef(null);
  const {
    dispatch,
    trainingManagement: { channelList, done },
  } = props;

  // const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<TrainingDataType> | undefined>(undefined);
  const [disabled, setDisabled] = useState<boolean>(false);

  /**
   * 所有查询，包括搜索、排序、翻页，都走这里
   *
   * @param {{
   *     channel_id?: number; page_size: number, page_num: number, filter_str?: string
   *   }}
   */

  useEffect(() => {
    queryList({});
  }, [1]);

  useEffect(() => {
    dispatch({
      type: 'trainingManagement/getChannels',
      payload: '培训',
    });
  }, []);

  useEffect(() => {
    queryList({});
  }, [done === true]);

  const showModal = () => {
    setDisabled(false);
    setVisible(true);
    setCurrent(undefined);
  };

  const showEditModal = (item: TrainingDataType, text: string) => {
    const currentItem = { ...item };
    currentItem.registTimeRange = [
      moment(item.registStartTime, 'YYYY-MM-DD HH:mm'),
      moment(item.registEndTime, 'YYYY-MM-DD HH:mm'),
    ];
    currentItem.timeRange = [
      moment(item.startTime, 'YYYY-MM-DD HH:mm'),
      moment(item.endTime, 'YYYY-MM-DD HH:mm'),
    ];
    setVisible(true);
    setCurrent(currentItem);
    if (text === 'info') {
      setDisabled(true);
    } else if (text === 'info') {
      setDisabled(false);
    }
  };

  const deleteItem = async (ids: string[]) => {
    const res = await removeFakeList(ids);
    if (res.status === 'ok') {
      const action = actionRef.current;
      action?.reload();
      message.info('操作成功');
    }
  };

  const editAndDelete = (currentItem: TrainingDataType) => {
    const ids: any[] = [];
    ids.push(currentItem.id);
    Modal.confirm({
      title: '删除培训',
      content: (
        <div>
          <div>培训标题： {currentItem.title}</div>确定删除该培训吗？
        </div>
      ),
      okText: '确认',
      cancelText: '取消',
      onOk: () => deleteItem(ids),
    });
  };

  const setAddBtnblur = () => {
    if (addBtn.current) {
      // eslint-disable-next-line react/no-find-dom-node
      const addBtnDom = findDOMNode(addBtn.current) as HTMLButtonElement;
      setTimeout(() => addBtnDom.blur(), 0);
    }
  };

  const handleDone = () => {
    setAddBtnblur();

    dispatch({
      type: 'trainingManagement/setDone',
      payload: false,
    });
    // setDone(false);
    const action = actionRef.current;
    action?.reload();
    setVisible(false);
  };

  const handleCancel = () => {
    setAddBtnblur();
    setVisible(false);
  };

  const handleSubmit = (values: TrainingDataType) => {
    const pram = { ...values };
    if (current) pram.id = current.id;

    setAddBtnblur();

    // setDone(true);

    dispatch({
      type: 'trainingManagement/submit',
      payload: pram,
    });
  };

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

  const columns: ProColumns<TrainingDataType>[] = [
    {
      title: '培训标题',
      dataIndex: 'title',
      width: 300,
      ellipsis: true,
      render: (text, record: TrainingDataType) => {
        return (
          <div
            key="edit"
            onClick={(e) => {
              e.preventDefault();
              showEditModal(record, 'info');
            }}
          >
            {record.title}
          </div>
        );
      },
    },
    {
      title: '所属栏目',
      dataIndex: 'Channel',
      width: 180,
      ellipsis: true,
      render: (text, record) => {
        return <div>{record.Channel.name}</div>;
      },
      valueEnum: {
        all: { text: '全部' },
        安全意识培训: { text: '安全意识培训' },
        安全技能培训: { text: '安全技能培训' },
        行业团体培训: { text: '行业团体培训' },
        认证培训: { text: '认证培训' },
      },
    },
    {
      title: '培训形式',
      width: 180,
      dataIndex: 'trainingMethod',
      valueEnum: {
        all: { text: '全部' },
        线上公开: { text: '线上公开' },
        线上私享: { text: '线上私享' },
        线下公开: { text: '线下公开' },
        线下私享: { text: '线下私享' },
      },
    },
    {
      title: '报名时间',
      children: [
        {
          title: '开始时间',
          dataIndex: 'registStartTime',
          key: 'registStartTime',
          align: 'center',
          sorter: true,
          render: (text) => {
            return <div>{moment(text as string).format('YYYY-MM-DD HH:mm')}</div>;
          },
        },
        {
          title: '结束时间',
          dataIndex: 'registEndTime',
          key: 'registEndTime',
          align: 'center',
          sorter: true,
          render: (text) => {
            return <div>{moment(text as string).format('YYYY-MM-DD HH:mm')}</div>;
          },
        },
      ],
    },
    {
      title: '培训时间',
      children: [
        {
          title: '开始时间',
          dataIndex: 'startTime',
          key: 'startTime',
          align: 'center',
          sorter: true,
          render: (text) => {
            return <div>{moment(text as string).format('YYYY-MM-DD HH:mm')}</div>;
          },
        },
        {
          title: '结束时间',
          dataIndex: 'endTime',
          key: 'endTime',
          align: 'center',
          sorter: true,
          render: (text) => {
            return <div>{moment(text as string).format('YYYY-MM-DD HH:mm')}</div>;
          },
        },
      ],
    },
    {
      title: '操作',
      dataIndex: 'option',
      align: 'center',
      width: 300,
      search: false,
      render: (text, record: TrainingDataType) => {
        return (
          <div>
            <a
              key="edit"
              onClick={(e) => {
                e.preventDefault();
                showEditModal(record, 'edit');
              }}
            >
              编辑
            </a>
            <Divider type="vertical" />
            <a
              key="delete"
              onClick={(e) => {
                e.preventDefault();
                editAndDelete(record);
              }}
            >
              删除
            </a>
          </div>
        );
      },
    },
  ];
  return (
    <>
      <PageHeaderWrapper title={false}>
        <div>
          <ProTable<TrainingDataType>
            headerTitle="培训列表"
            columns={columns}
            actionRef={actionRef}
            request={(params, sorter, filter) => {
              const opts: TableListParams = {
                ...params,
                sorter,
                filter,
              };
              return queryList(opts);
            }}
            rowKey="id"
            tableAlertRender={false}
            rowSelection={{}}
            toolBarRender={(action, { selectedRows }) => [
              <Button type="primary" onClick={showModal} ref={addBtn}>
                <PlusOutlined /> 新建
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
          />
        </div>
      </PageHeaderWrapper>

      <OperationModal
        disabled={disabled}
        done={done}
        current={current}
        channelList={channelList}
        visible={visible}
        onDone={handleDone}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default connect(
  ({
    trainingManagement,
    loading,
  }: {
    trainingManagement: StateType;
    loading: {
      models: Record<string, boolean>;
    };
  }) => ({
    trainingManagement,
    loading: loading.models.trainingManagement,
  }),
)(TrainingManagement);
