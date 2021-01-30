/** !
 * @description: 服务信息编辑表单
 * @author: zpl
 * @Date: 2021-01-08 15:08:31
 * @LastEditTime: 2021-01-08 15:08:33
 * @LastEditors: zpl
 */
import React, { useState } from 'react';
import CustomForm from '@/components/CustomForm';
import { Button, Col, message, Row, Space } from 'antd';
import type { FormItemType } from '@/components/CustomForm/interfice';
import type { ServiceStatus, TableListItem } from '../data';

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

let submitFun: () => void;

type PropsType = {
  infoEdit?: boolean;
  current?: Partial<TableListItem> | null;
  onSubmit: (values: TableListItem) => void;
  onCancel?: () => void;
};

const UpdateForm = (props: PropsType) => {
  const { infoEdit = false, current, onSubmit, onCancel } = props;
  const [status, setStatus] = useState<ServiceStatus>(current?.status || '申请中');

  const formItemList: FormItemType[] = [
    { type: 'input', name: 'id', label: 'id', hidden: true },
    {
      type: 'input',
      name: 'corporateName',
      label: '单位名称',
      rules: [{ required: true, message: '请输入单位名称' }],
      disabled: !infoEdit,
    },
    {
      type: 'group',
      key: 'group3',
      groupItems: [
        {
          type: 'input',
          name: 'contacts',
          label: '联系人',
          rules: [{ required: true, message: '请输入联系人姓名' }],
          disabled: !infoEdit,
        },
        {
          type: 'input',
          name: 'contactsMobile',
          label: '手机号',
          rules: [
            {
              pattern: new RegExp(/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/),
              message: '电话格式有误',
            },
            { required: true, message: '请输入联系人手机' }
          ],
          disabled: !infoEdit,
        },
      ],
    },
    {
      type: 'group',
      key: 'group1',
      groupItems: [
        {
          type: 'input',
          name: 'tel',
          label: '单位电话',
          rules: [
            {
              pattern: new RegExp(/\d{3}-\d{8}|\d{4}-\d{7}/),
              message: '电话格式有误',
            },
            { required: true, message: '请输入单位电话号' }],
          disabled: !infoEdit,
        },
        {
          type: 'input',
          name: 'email',
          label: '联系邮箱',
          rules: [{ required: true, message: '请输入联系邮箱' }],
          disabled: !infoEdit,
        },
      ],
    },
    {
      type: 'group',
      key: 'group2',
      groupItems: [
        { type: 'input', name: 'address', label: '联系地址', disabled: !infoEdit },
        { type: 'input', name: 'zipCode', label: '单位邮编', disabled: !infoEdit },
      ],
    },
    { type: 'input', name: 'website', label: '单位网站', disabled: !infoEdit },
    { type: 'input', name: 'demandType', label: '需求类型', hidden: true },
    {
      type: 'textArae',
      name: 'requestDesc',
      label: '需求描述',
      rules: [{ required: true, message: '请输入需求描述' }],
      disabled: !infoEdit,
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
          disabled: !infoEdit,
          onChange: (_: any, formatString: any) => {
            setStatus(formatString.key);
          },
        },
        {
          type: 'input',
          name: 'rejectReason',
          label: '拒绝原因',
          rules: [{ required: status === '拒绝申请', message: '请输入拒绝原因' }],
          disabled: !infoEdit,
        },
      ],
    },
    {
      type: 'input',
      name: 'serviceDesc',
      label: '服务描述',
      placeholder: '服务描述，管理员选填，便于事后追溯',
      disabled: !infoEdit,
    },
    {
      type: 'group',
      key: 'group5',
      groupItems: [
        { type: 'input', name: 'createdAt', label: '申请时间', placeholder: '-', disabled: true, hidden: true, },
        {
          type: 'input',
          name: 'updatedAt',
          label: '更新时间',
          placeholder: '-',
          disabled: true,
          hidden: true,
        },
        // { type: 'empty'}
      ],
    },
  ];

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
        formItems={formItemList}
        // formItems={getFormItems(infoEdit)}
        values={current || { status }}
        onFinish={handleFinish}
        onFinishFailed={({ errorFields }) => {
          const msg = errorFields[0].errors[0] || '请正确填写表单';
          message.warn(msg);
        }}
        setSubmitFun={(submit: () => void) => {
          submitFun = submit;
        }}
        style={{
          overflowY: 'auto',
          height: 'calc(100% - 3rem)',
          marginBottom: '1rem',
          padding: '0.5rem',
        }}
      />
      {infoEdit && (
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
      )}
    </>
  );
};

export default UpdateForm;
