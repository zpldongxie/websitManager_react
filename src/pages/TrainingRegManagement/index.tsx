import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message, Modal, Select, Switch } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';

import EditModal from './components/EditModal';
import { TableListItem } from './data';
import { queryList, putTrainingReg, removeTrainingReg, getTrainings, setPassed } from './service';

const { confirm } = Modal;

/**
 * 添加/修改 报名
 * @param fields
 */
const handleAddOrUpdate = async (fields: TableListItem) => {
  const label = fields.id ? '修改' : '添加';
  const hide = message.loading(`正在${label}`);
  try {
    // if (fields.id) {
    //   await updateTrainingReg({ ...fields });
    // }
    await putTrainingReg({ ...fields });
    hide();
    message.success(`${label}成功`);
    return true;
  } catch (error) {
    hide();
    const errorMessage = error.data.message;
    switch (errorMessage) {
      case "mobile must be unique":
        message.error(`该手机号已经提交过申请！`);
        break;
      default:
        message.error(`${label}失败请重试！`);
        break;
    }
    return false;
  }
};

/**
 *  删除报名
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeTrainingReg({
      ids: selectedRows.map((row) => row.id!),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

/**
 * 设置审批状态
 *
 * @param {((string | undefined)[])} ids
 * @param {boolean} passed
 */
const handleApproval = async (ids: (string | undefined)[], passed: boolean) => {
  await setPassed({
    ids,
    passed
  })
}

const TableList: React.FC = () => {
  const [editModalVisible, handleModalVisible] = useState<boolean>(false);
  const [trainings, setTrainings] = useState([]);
  const [trainingId, setTrainingId] = useState('');
  const [current, setCurrent] = useState<TableListItem | null>(null);
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    // 获取所有培训名称，用于创建和筛选
    (async () => { setTrainings(await getTrainings()) })()
  }, [])

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '培训信息',
      dataIndex: 'TrainingId',
      hideInTable: true,
      rules: [
        {
          required: true,
          message: '请选择培训信息',
        },
      ],
      renderFormItem: () => {
        return (
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="选择一个培训活动"
            optionFilterProp="children"
            filterOption={(inputValue: string, option: any) =>
              option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
            }
          >
            {
              trainings.map((training: { id: string; title: string }) => (
                <Select.Option key={training.id} value={training.id}>{training.title}</Select.Option>
              ))
            }
          </Select>
        );
      },
    },
    {
      title: '培训信息',
      dataIndex: 'Training',
      hideInTable: !!trainingId, // 过滤条件trainingId存在时，不显示此列
      hideInForm: true,
      hideInSearch: true,
      renderText: (training: { id: string; title: string; }) => training?.title,
    },
    {
      title: '培训类型',
      dataIndex: 'Training',
      hideInForm: true,
      hideInSearch: true,
      hideInTable: !!trainingId, // 过滤条件trainingId存在时，不显示此列
      renderText: (training: {
        id: string;
        title: string;
        Channel: { id: string, name: string; }
      }) => training?.Channel?.name,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      rules: [
        {
          required: true,
          message: '姓名为必填项',
        },
      ],
    },
    {
      title: '手机',
      dataIndex: 'mobile',
      rules: [
        {
          required: true,
          message: '手机为必填项',
        },
      ],
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      rules: [
        {
          required: true,
          message: '邮箱为必填项',
        },
      ],
    },
    {
      title: '公司',
      dataIndex: 'comp',
      rules: [
        {
          required: true,
          message: '公司为必填项',
        },
      ],
      sorter: true,
    },
    {
      title: '报名时间',
      dataIndex: 'createdAt',
      sorter: true,
      valueType: 'dateTime',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '审批',
      dataIndex: 'passed',
      sorter: true,
      hideInForm: true,
      align: 'center',
      render: (passed, record) => {
        return <Switch
          defaultChecked={passed as boolean}
          size="small"
          onChange={(checked: boolean) => {
            handleApproval([record.id], checked)
          }}
        />
      },
      renderFormItem: () => (
        <Select
          placeholder='请选择'
          optionFilterProp='children'
        >
          <Select.Option value={1}>已审批</Select.Option>
          <Select.Option value={0}>未审批</Select.Option>
        </Select>
      )
    },
    {
      title: '签到时间',
      dataIndex: 'signInTime',
      sorter: true,
      valueType: 'dateTime',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record, index, action: any) => (
        <>
          <a
            onClick={() => {
              message.info(`修改： ${record.name}`)
              setCurrent(record);
              handleModalVisible(true)
            }}
          >
            修改
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              confirm({
                title: '确定删除以下报名吗？',
                content: record.name,
                onOk() {
                  (async () => {
                    await handleRemove([record]);
                    action.reload();
                  })()
                },
              });
            }}
          >删除</a>
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={(action, { selectedRows }) => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={async (e) => {
                    switch (e.key) {
                      case 'remove':
                        confirm({
                          title: '确定删除以下报名吗？',
                          content: `批量选中${selectedRows.length}个。`,
                          onOk() {
                            (async () => {
                              await handleRemove(selectedRows);
                              action.reload();
                            })()
                          },
                        });
                        break;
                      case 'approval':
                        confirm({
                          title: '确定批量通过审批吗？',
                          content: `批量选中${selectedRows.length}个。`,
                          onOk() {
                            (async () => {
                              const ids = selectedRows.map(row => row.id);
                              await handleApproval(ids, true);
                              action.reload();
                            })()
                          },
                        });
                        break;
                    
                      default:
                        break;
                    }
                  }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="remove">批量删除</Menu.Item>
                  <Menu.Item key="approval">批量审批</Menu.Item>
                </Menu>
              }
            >
              <Button>
                批量操作 <DownOutlined />
              </Button>
            </Dropdown>
          ),
        ]}
        tableAlertRender={({ selectedRowKeys, selectedRows }) => (
          <div>
            已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 个&nbsp;&nbsp;
            <span>
              已审批 {selectedRows.reduce((pre, item) => pre + (item.passed ? 1 : 0), 0)} 个
            </span>
            <span>
              已签到 {selectedRows.reduce((pre, item) => pre + (item.signInTime ? 1 : 0), 0)} 个
            </span>
          </div>
        )}
        request={(params, sorter, filter) => queryList({ ...params, sorter, filter })}
        columns={columns}
        rowSelection={{}}
        beforeSearchSubmit={(params: Partial<TableListItem>) => {
          // 查询工具栏中的下拉选无法设置boolean，发起查询前需要先做转换
          if(typeof params.passed !== 'undefined'){
            return {
              ...params,
              passed: !!params.passed
            }
          }
          if (typeof params.TrainingId !== 'undefined') {
            setTrainingId(params.TrainingId)
          } else {
            setTrainingId('')
          }
          return params;
        }}
      />
      <EditModal
        modalVisible={editModalVisible}
        current={current}
        trainingItems={
          trainings.map((t: { id: string; title: string; }) => ({ value: t.id, text: t.title }))
        }
        onSubmit={
          async (value: TableListItem) => {
            const success = await handleAddOrUpdate(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
              setCurrent(null);
            }
          }
        }
        onCancel={() => {
          handleModalVisible(false)
          setCurrent(null);
        }}
      />
    </PageHeaderWrapper>
  );
};

export default TableList;