import React, { FC, useRef, useState, useEffect } from 'react';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Dropdown,
  Input,
  List,
  Menu,
  Modal,
  Progress,
} from 'antd';

import { findDOMNode } from 'react-dom';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, Dispatch } from 'umi';
import moment from 'moment';
import { PaginationConfig } from 'antd/lib/pagination/Pagination';
import OperationModal from './components/OperationModal';
import { StateType } from './model';
import { TrainingDataType } from './data.d';
import styles from './style.less';

const { Search } = Input;

interface TrainingManagementProps {
  trainingManagement: StateType;
  dispatch: Dispatch;
  loading: boolean;
}

/**
 * 配置列
 *
 * @param {{
 *   data: TrainingDataType;
 * }} {
 *   data: { trainingMethod, Channel, startTime, endTime },
 * }
 */
const ListContent = ({
  data: { id, trainingMethod, Channel, startTime, endTime },
}: {
  data: TrainingDataType;
}) => (
    <div className={styles.listContent}>
      <div className={styles.listContentItem}>
        <span>文章关键词</span>
        <p>{id}</p>
      </div>
      <div className={styles.listContentItem}>
        <span>培训方式</span>
        <p>{trainingMethod}</p>
      </div>
      <div className={styles.listContentItem}>
        <span>培训类型</span>
        <p>{Channel.name}</p>
      </div>
      <div className={styles.listContentItem}>
        <span>开始时间</span>
        <p>{moment(startTime).format('YYYY-MM-DD HH:mm')}</p>
      </div>
      <div className={styles.listContentItem}>
        <span>结束时间</span>
        <p>{moment(endTime).format('YYYY-MM-DD HH:mm')}</p>
      </div>
      <div className={`${styles.listContentItem} ${styles.center}`}>
        <Progress type="circle" percent={50} width={50} />
        <div>签到百分比</div>
      </div>
    </div>
  );

export const TrainingManagement: FC<TrainingManagementProps> = (props) => {
  const addBtn = useRef(null);
  const {
    loading,
    dispatch,
    trainingManagement: {
      pageNum,
      pageSize,
      total,
      list,
      filter,
      channelList,
      done
    },
  } = props;

  // const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<TrainingDataType> | undefined>(undefined);

  /**
   * 所有查询，包括搜索、排序、翻页，都走这里
   *
   * @param {{
   *     channel_id?: number; page_size: number, page_num: number, filter_str?: string
   *   }} 
   */
  type QueryPram = {
    channel_id?: number;
    page_size?: number;
    page_num?: number;
    filter_str?: string;
  };
  const queryList = (
    {
      channel_id,
      page_size = pageSize,
      page_num = pageNum,
      filter_str = filter,
    }: QueryPram) => {
    dispatch({
      type: 'trainingManagement/fetch',
      payload: {
        ChannelId: channel_id,
        pageNum: page_num,
        pageSize: page_size,
        filter: filter_str
      },
    });
  }

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

  const paginationProps: PaginationConfig = {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize,
    total,
    onChange: (page: number, size?: number) => {
      queryList({ page_size: size || pageSize, page_num: page })
    },
    onShowSizeChange: (page: number, size: number) => {
      dispatch({
        type: 'trainingManagement/pageChange',
        payload: {
          pageNum: page,
          pageSize: size
        },
      });
    }
  };

  const showModal = () => {
    setVisible(true);
    setCurrent(undefined);
  };

  const showEditModal = (item: TrainingDataType) => {
    const currentItem = { ...item };
    currentItem.registTimeRange = [
      moment(item.registStartTime, 'YYYY-MM-DD HH:mm'),
      moment(item.registEndTime, 'YYYY-MM-DD HH:mm')
    ]
    currentItem.timeRange = [
      moment(item.startTime, 'YYYY-MM-DD HH:mm'),
      moment(item.endTime, 'YYYY-MM-DD HH:mm')
    ]
    setVisible(true);
    setCurrent(currentItem);
  };

  const deleteItem = (id: string) => {
    dispatch({
      type: 'trainingManagement/submit',
      payload: { id },
    });
  };

  const editAndDelete = (key: string, currentItem: TrainingDataType) => {
    if (key === 'edit') showEditModal(currentItem);
    else if (key === 'delete') {
      Modal.confirm({
        title: '删除培训',
        content: <div><div>培训标题： {currentItem.title}</div>确定删除该培训吗？</div>,
        okText: '确认',
        cancelText: '取消',
        onOk: () => deleteItem(currentItem.id || ''),
      });
    }
  };

  const extraContent = (
    <div className={styles.extraContent}>
      <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={(val: string) => {
        queryList({ filter_str: val })
      }} />
    </div>
  );

  const MoreBtn: React.FC<{
    item: TrainingDataType;
  }> = ({ item }) => (
    <Dropdown
      overlay={
        <Menu onClick={({ key }) => editAndDelete(key as string, item)}>
          <Menu.Item key="edit">编辑</Menu.Item>
          <Menu.Item key="delete">删除</Menu.Item>
        </Menu>
      }
    >
      <a>
        更多 <DownOutlined />
      </a>
    </Dropdown>
  );

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

  return (
    <div>
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="培训列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              onClick={showModal}
              ref={addBtn}
            >
              <PlusOutlined />
              添加
            </Button>

            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <a
                      key="edit"
                      onClick={(e) => {
                        e.preventDefault();
                        showEditModal(item);
                      }}
                    >
                      编辑
                    </a>,
                    <MoreBtn key="more" item={item} />,
                  ]}
                >
                  <List.Item.Meta
                    title={<a href=''>{item.title}</a>}
                    description={item.subTitle}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageHeaderWrapper>

      <OperationModal
        done={done}
        current={current}
        channelList={channelList}
        visible={visible}
        onDone={handleDone}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default connect(
  ({
    trainingManagement,
    loading,
  }: {
    trainingManagement: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    trainingManagement,
    loading: loading.models.trainingManagement,
  }),
)(TrainingManagement);
