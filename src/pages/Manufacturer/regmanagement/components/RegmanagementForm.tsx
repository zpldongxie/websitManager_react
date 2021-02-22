import React, { useState, useEffect } from 'react';
import CustomForm from '@/components/CustomForm';
import type { FormItemType } from '@/components/CustomForm/interfice';
import type { TableListItem } from '../data';
import { message } from 'antd';

type PropsType = {
  disabled?: boolean;
  current?: TableListItem | null;
  onSubmit: (values: TableListItem) => void;
  onCancel?: () => void;
  submitFun?: any;
  isSubmin?: boolean;
};
const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};
let setSubmitFun: () => void;

const RegmanagementForm = (props: PropsType) => {
  const { disabled, onSubmit, submitFun, isSubmin } = props;

  useEffect(() => {
    if (isSubmin) {
      if (typeof submitFun === 'function') {
        submitFun(setSubmitFun);
      }
    }
  }, [isSubmin, submitFun]);

  // 表单提交
  const handleFinish = (values: TableListItem) => {
    if (onSubmit) {
      onSubmit(values);
    }
  };

  // 详细类别
  const typeItems = [
    { value: 0, text: '厂商' },
    { value: 1, text: '产品' },
  ];
  const [info, setInfo] = useState<TableListItem | null>(null);
  const formItemList: FormItemType[] = [
    {
      type: 'input',
      name: 'corporateName',
      label: '单位名称',
      disabled,
      rules: [{ required: true, message: '请设置显示状态' }],
    },
    {
      type: 'input',
      name: 'contacts',
      label: '联系人',
      disabled,
      rules: [{ required: true, message: '请设置显示状态' }],
    },
    {
      type: 'input',
      name: 'contactsMobile',
      label: '手机号',
      disabled,
      rules: [{ required: true, message: '请设置显示状态' }],
    },
    {
      type: 'select',
      name: 'type',
      label: '详细类别',
      disabled,
      rules: [{ required: true, message: '请设置显示状态' }],
      items: typeItems,
      onChange: (_: any, formatString: any) => {
        setInfo({ ...info!, type: formatString.value });
      },
    },
    {
      type: 'input',
      name: 'email',
      label: '邮箱',
      disabled,
      rules: [{ required: true, message: '请设置显示状态' }],
    },
    {
      type: 'input',
      name: 'address',
      label: '地址',
      disabled,
    },
    {
      type: 'input',
      name: 'zipCode',
      label: '邮编',
      disabled,
    },
    {
      type: 'input',
      name: 'website',
      label: '官方网站',
      disabled,
    },
    {
      type: 'textArea',
      name: 'descStr',
      label: '申请理由',
      disabled,
    },
  ];
  return (
    <div>
      <CustomForm
        formLayout={formLayout} // 表单布局
        formItems={formItemList} // 表单字段
        values={{ ...info }} // 表单字段的内容
        onFinish={handleFinish} // 表单提交
        onFinishFailed={({ errorFields }) => {
          // 提交失败的回调
          const msg = errorFields[0].errors[0] || '请正确填写表单';
          message.warn(msg);
        }}
        setSubmitFun={(submit: () => void) => {
          // 调用表单提交功能
          setSubmitFun = submit;
        }}
      />
    </div>
  );
};

export default RegmanagementForm;
