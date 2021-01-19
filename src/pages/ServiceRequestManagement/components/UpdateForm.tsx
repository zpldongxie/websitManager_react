/** !
 * @description: 服务信息编辑表单
 * @author: zpl
 * @Date: 2021-01-08 15:08:31
 * @LastEditTime: 2021-01-08 15:08:33
 * @LastEditors: zpl
 */
import React from 'react';
import CustomForm from '@/components/CustomForm';
import { Button, Col, Row, Space } from 'antd';
import type { FormItemType } from '@/components/CustomForm/interfice';
import type { TableListItem } from '../data';

const formLayout = {
  labelCol: { flex: '7em' },
  wrapperCol: { flex: 'auto' },
};

// 服务状态
const serviceStatus = [
  { value: '申请中', text: '申请中' },
  { value: '接受申请', text: '接受申请' },
  { value: '拒绝申请', text: '拒绝申请' },
  { value: '服务中', text: '服务中' },
  { value: '服务完成', text: '服务完成' },
];

const getFormItems = (): FormItemType[] => [
  { type: 'input', name: 'id', label: 'id', hidden: true },
  {
    type: 'input',
    name: 'corporateName',
    label: '公司名称',
    rules: [{ required: true, message: '请输入公司名称' }],
  },
  {
    type: 'group',
    key: 'group1',
    groupItems: [
      {
        type: 'input',
        name: 'tel',
        label: '座机',
        rules: [{ required: true, message: '请输入公司座机号' }],
      },
      {
        type: 'input',
        name: 'email',
        label: '邮箱',
        rules: [{ required: true, message: '请输入邮箱' }],
      },
    ],
  },
  {
    type: 'group',
    key: 'group2',
    groupItems: [
      { type: 'input', name: 'address', label: '地址' },
      { type: 'input', name: 'zipCode', label: '邮编' },
    ],
  },
  { type: 'input', name: 'website', label: '公司网站' },
  {
    type: 'group',
    key: 'group3',
    groupItems: [
      {
        type: 'input',
        name: 'contacts',
        label: '联系人',
        rules: [{ required: true, message: '请输入联系人姓名' }],
      },
      {
        type: 'input',
        name: 'contactsMobile',
        label: '手机号',
        rules: [{ required: true, message: '请输入联系人手机' }],
      },
    ],
  },
  { type: 'input', name: 'demandType', label: '需求类型', hidden: true },
  {
    type: 'textArae',
    name: 'requestDesc',
    label: '需求描述',
    rules: [{ required: true, message: '请输入需求描述' }],
  },
  {
    type: 'group',
    key: 'group4',
    groupItems: [
      {
        type: 'select',
        name: 'status',
        label: '服务状态',
        rules: [{ required: true, message: '请设置服务状态' }],
        items: serviceStatus,
      },
      {
        type: 'input',
        name: 'rejectReason',
        label: '拒绝原因',
        placeholder: '如果服务状态为拒绝，建议填写拒绝原因',
      },
    ],
  },
  {
    type: 'input',
    name: 'serviceDesc',
    label: '服务描述',
    placeholder: '服务描述，管理员选填，便于事后追溯',
  },
  {
    type: 'group',
    key: 'group5',
    groupItems: [
      { type: 'input', name: 'createdAt', label: '申请时间', placeholder: '-', disabled: true },
      { type: 'input', name: 'updatedAt', label: '最近处理时间', placeholder: '-', disabled: true },
      // { type: 'empty'}
    ],
  },
];

let submitFun: () => void;

type PropsType = {
  current?: Partial<TableListItem> | null;
  onSubmit: (values: TableListItem) => void;
  onCancel?: () => void;
};

const UpdateForm = (props: PropsType) => {
  const { current, onSubmit, onCancel } = props;

  const handleSubmit = () => {
    if (typeof submitFun === 'function') submitFun();
  };
  const handleFinish = (values: Record<string, any>) => {
    // 创建时间和更新时间由接口自动维护
    const { createdAt, updatedAt, ...params } = values;
    if (onSubmit) {
      onSubmit(params as TableListItem);
    }
  };

  return (
    <>
      <CustomForm
        formLayout={formLayout}
        formItems={getFormItems()}
        values={current || {}}
        onFinish={handleFinish}
        setSubmitFun={(submit: () => void) => {
          submitFun = submit;
        }}
      />
      <Row justify="end">
        <Col>
          <Space>
            <Button onClick={onCancel}>取消</Button>
            <Button type="primary" onClick={handleSubmit}>
              确定
            </Button>
          </Space>
        </Col>
      </Row>
    </>
  );
};

export default UpdateForm;
