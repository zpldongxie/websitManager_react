import React, { useState, useRef, useCallback } from 'react';
import { DndProvider, useDrag, useDrop, createDndContext } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DownOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Modal, message, Button, Divider, Dropdown, Menu } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

import { convertChannelsToTree } from '@/utils/utils';
import { queryAll, upsert, remove, setShowStatus, moveChannel } from './service';
import type { ChannelType, ChannelTypeType } from '@/utils/data';
import type { TableListItem } from './data.d';

import styles from './index.module.less';
import UpdateForm from './components/UpdateForm';
import ShowStatus from './components/ShowStatus';

import type { TreeNodeType } from '@/utils/data';
import type { SelectValue } from 'antd/lib/select';

const RNDContext = createDndContext(HTML5Backend);
const type = 'DragableBodyRow';

type DBRProps = {
  index: string;
  moveRow: (dragId: string, hoverId: string) => void;
  className: string;
  style?: React.CSSProperties;
};
const DragableBodyRow = ({ index, moveRow, className, style, ...restProps }: DBRProps) => {
  const ref = React.useRef<HTMLTableRowElement>(null);
  const [{ isOver, dropClassName }, drop] = useDrop<
    { index: string; type: string },
    void,
    { isOver?: undefined; dropClassName?: undefined } | { isOver: boolean; dropClassName: string }
  >({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {};

      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: ' drop-over-downward',
      };
    },
    drop: (item) => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    item: { type, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));
  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move', ...style }}
      {...restProps}
    />
  );
};

const TableList: React.FC = () => {
  const [sorterMode, setSorterMode] = useState<'排序模式' | '嵌套模式'>('排序模式');
  // 模态框
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  // 模态框中的信息是否可编辑
  const [infoEdit, setInfoEdit] = useState(false);
  // 当前信息，用于回填表单
  const [current, setCurrent] = useState<TableListItem | null>(null);
  // 列表对象引用，可主动执行刷新等操作
  const actionRef = useRef<ActionType>();

  const manager = useRef(RNDContext);
  const components = {
    body: {
      row: DragableBodyRow,
    },
  };
  const moveRow = useCallback(
    async (dragId, hoverId) => {
      const res = await moveChannel(dragId, hoverId, sorterMode);
      if (res.status === 'ok') {
        const action = actionRef.current;
        action?.reload();
        // message.info('操作成功');
      } else {
        message.warn(res.message);
      }
    },
    [sorterMode],
  );

  /**
   * 实时设置模态框标题
   *
   * @return {*}
   */
  const getModelTitle = () => {
    if (infoEdit) {
      if (current) {
        return '编辑信息';
      }
      return '新增';
    }
    return '查看信息';
  };

  const handleAdd = async (value: ChannelType) => {
    const res = await upsert(value);
    if (res.status === 'ok') {
      setModalVisible(false);
      const action = actionRef.current;
      action?.reload();
      message.info('操作成功');
    } else {
      message.warn(res.message);
    }
  };

  const delHandler = (ids: string[]) => {
    Modal.confirm({
      title: `确定删除吗？`,
      content: <div style={{ color: 'red' }}>注意，删除后数据将无法恢复。</div>,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        (async () => {
          const result = await remove(ids);
          if (result.status === 'ok') {
            const action = actionRef.current;
            action?.reload();
            message.info('删除成功');
          } else {
            result.message =
              result.message.split(':')[0] === 'Cannot delete or update a parent row'
                ? '请先删除子栏目'
                : result.message;
            message.error(`删除失败：${result.message}`);
          }
        })();
      },
    });
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      search: false,
      hideInTable: true,
    },
    {
      title: '栏目标题',
      dataIndex: 'name',
      ellipsis: true,
      width: '30em',
      render: (text, record) => (
        <a
          onClick={() => {
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
      title: '英文名',
      dataIndex: 'enName',
      search: false,
    },
    {
      title: '类型',
      dataIndex: 'ChannelType',
      search: false,
      render: (dom) => {
        return (dom as ChannelTypeType).name;
      },
    },
    {
      hideInTable: true,
      title: '关键字',
      dataIndex: 'keyWord',
      search: false,
    },
    {
      title: '描述',
      dataIndex: 'descStr',
      search: false,
    },
    {
      title: '显示状态',
      dataIndex: 'showStatus',
      search: false,
      align: 'center',
      render: (status, record) => {
        return (
          <ShowStatus
            defaultValue={status as number}
            handleChange={async (value: SelectValue) => {
              const res = await setShowStatus(record.id!, value as number);
              if (res.status === 'ok') {
                const action = actionRef.current;
                action?.reload();
                message.success('设置成功');
              } else {
                message.error('设置失败，请联系管理员');
              }
            }}
          />
        );
      },
      filters: [
        { value: 0, text: '不显示' },
        { value: 1, text: '全部显示' },
        { value: 2, text: '仅主菜单显示' },
        { value: 3, text: '仅侧边菜单显示' },
        { value: 4, text: '单独显示' },
      ],
    },
    {
      title: '链接',
      dataIndex: 'url',
      hideInTable: true,
      search: false,
    },
    {
      title: '排序值',
      dataIndex: 'orderIndex',
      hideInTable: true,
      search: false,
    },
    {
      title: '是否继承设置',
      dataIndex: 'settingExtend',
      hideInTable: true,
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: '15em',
      render: (_, record) => (
        <div className={styles.optionCol}>
          <a
            onClick={() => {
              setInfoEdit(true);
              setCurrent(record);
              setModalVisible(true);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              delHandler([record.id]);
            }}
          >
            删除
          </a>
        </div>
      ),
      align: 'center',
    },
  ];

  return (
    <PageHeaderWrapper className={styles.contentListWrapper} title={false}>
      <DndProvider manager={manager.current.dragDropManager!}>
        <ProTable<TableListItem>
          headerTitle="栏目管理"
          actionRef={actionRef}
          rowKey="id"
          className={sorterMode === '排序模式' ? 'sort-table' : 'insert-table'}
          components={components}
          onRow={(record) => {
            return {
              index: record.id,
              moveRow,
            } as React.HTMLAttributes<HTMLElement>;
          }}
          search={false}
          tableAlertRender={false}
          pagination={false}
          toolBarRender={() => [
            <Button
              type="primary"
              onClick={() => {
                setInfoEdit(true);
                setCurrent(null);
                setModalVisible(true);
              }}
            >
              <PlusOutlined /> 新建
            </Button>,
            <Dropdown
              overlay={
                <Menu
                  onClick={(e) => {
                    switch (e.key) {
                      case '排序模式':
                        setSorterMode('排序模式');
                        break;
                      case '嵌套模式':
                        setSorterMode('嵌套模式');
                        break;
                      default:
                      // do nothing
                    }
                  }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="排序模式">排序模式</Menu.Item>
                  <Menu.Item key="嵌套模式">嵌套模式</Menu.Item>
                </Menu>
              }
            >
              <Button>
                {sorterMode} <DownOutlined />
              </Button>
            </Dropdown>,
          ]}
          request={(_params, _sorter, filter) => {
            return queryAll(filter);
          }}
          postData={(data: ChannelType[]) => {
            const returnData: TreeNodeType[] = [];
            convertChannelsToTree(data, returnData, null);
            return returnData;
          }}
          columns={columns}
        />
      </DndProvider>
      <Modal
        title={getModelTitle()}
        destroyOnClose
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        maskClosable={false}
        width="40rem"
        bodyStyle={{
          overflowY: 'auto',
          height: 'auto',
        }}
      >
        <UpdateForm
          infoEdit={infoEdit}
          current={current as ChannelType}
          onSubmit={handleAdd}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>
    </PageHeaderWrapper>
  );
};

export default TableList;
