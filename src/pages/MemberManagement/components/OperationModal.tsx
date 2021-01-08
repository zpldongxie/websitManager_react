import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { Modal, Result, Button } from 'antd';
import CustomForm from '@/components/CustomForm';
import type { TableListItem, PersonalTableListItem } from '../data';

type OperationModalProps = {
  type: string;
  done: boolean;
  visible: boolean;
  current?: Partial<TableListItem> | undefined;
  currentPersonal?: Partial<PersonalTableListItem> | undefined;
  onDone: () => void;
  onSubmit?: (values: TableListItem) => void;
  onSubmitPersonal?: (values: PersonalTableListItem) => void;
  onCancel: () => void;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

let submitFun: () => void;

const OperationModal: FC<OperationModalProps> = (props) => {
  const { type, done, visible, current, currentPersonal, onDone, onCancel, onSubmit, onSubmitPersonal } = props;

  const [expand, setExpand] = useState({})

  useEffect(() => {
    if (!props.visible) {
      setExpand({});
    }
  }, [props.visible]);

  const handleSubmit = () => {
    if (typeof submitFun === 'function')
      submitFun();
  };

  const handleFinish = (values: Record<string, any>) => {
    if (onSubmit || onSubmitPersonal) {
      if (type === "personal") {
        onSubmitPersonal(values as PersonalTableListItem);
      } else {
        onSubmit(values as TableListItem);
      }
    }
  };

  const modalFooter = done
    ? { footer: null, onCancel: onDone }
    : { okText: '保存', onOk: handleSubmit, onCancel };
  const disabled = !!done;
  const memberStatusItems = [
    { value: '申请中', text: '申请中' },
    { value: '初审通过', text: '初审通过' },
    { value: '正式会员', text: '正式会员' },
    { value: '申请驳回', text: '申请驳回' },
    { value: '禁用', text: '禁用' },
  ];

  const getModalContent = () => {
    const formItems = [
      { type: 'input', name: 'corporateName', label: '单位名称', disabled, rules: [{ required: true, message: '请输入单位名称' }] },
      {
        type: 'input', name: 'tel', label: '单位电话', disabled, rules: [
          {
            pattern: new RegExp(/\d{3}-\d{8}|\d{4}-\d{7}/),
            message: '电话格式有误',
          }, { required: true, message: '请输入单位电话' }
        ]
      },
      {
        type: 'input', name: 'email', label: '联系邮箱', disabled, rules: [
          {
            type: 'email',
            message: '邮箱格式有误',
          }, { required: true, message: '请输入联系邮箱' }
        ]
      },
      { type: 'input', name: 'address', label: '联系地址', disabled, rules: [{ required: true, message: '请输入联系地址' }] },
      { type: 'input', name: 'zipCode', label: '单位邮编', disabled, },
      {
        type: 'input', name: 'website', label: '单位网站', disabled, rules: [
          {
            type: 'url',
            message: '网站格式有误',
          },
        ]
      },
      { type: 'input', name: 'legalPerson', label: '法人', disabled, },
      { type: 'input', name: 'industry', label: '所属行业', disabled, },
      { type: 'select', name: 'status', label: '当前状态', disabled, items: memberStatusItems },
      { type: 'input', name: 'contacts', label: '联系人', disabled, rules: [{ required: true, message: '请输入联系人' }] },
      {
        type: 'input', name: 'contactsMobile', label: '联系人手机号', disabled, rules: [
          {
            pattern: new RegExp(/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/),
            message: '电话格式有误',
          }, { required: true, message: '请输入联系人手机号' }]
      },
      { type: 'textArae', name: 'intro', label: '单位简介', disabled, rules: [{ required: true, message: '请输入单位简介' }] },
    ];
    const formItemsPersonal = [
      { type: 'input', name: 'name', label: '姓名', disabled, rules: [{ required: true, message: '请输入姓名' }] },
      {
        type: 'input', name: 'mobile', label: '联系电话', disabled, rules: [
          {
            pattern: new RegExp(/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/),
            message: '电话格式有误',
          }, { required: true, message: '请输入联系电话' }]
      },
      {
        type: 'input', name: 'email', label: '联系邮箱', disabled, rules: [
          {
            type: 'email',
            message: '邮箱格式有误',
          }, { required: true, message: '请输入联系邮箱' }
        ]
      },
      { type: 'input', name: 'address', label: '联系地址', disabled, rules: [{ required: true, message: '请输入联系地址' }] },
      { type: 'input', name: 'zipCode', label: '邮编', disabled, },
      {
        type: 'input', name: 'website', label: '个人网站', disabled, rules: [
          {
            type: 'url',
            message: '网站格式有误',
          },
        ]
      },
      { type: 'select', name: 'status', label: '当前状态', disabled, items: memberStatusItems },
      { type: 'textArae', name: 'intro', label: '个人简介', disabled, rules: [{ required: true, message: '请输入个人简介' }] },
    ];
    const curFormItem = type ? formItemsPersonal : formItems;
    const curValue = type ? currentPersonal : current;
    return (
      <CustomForm
        formLayout={formLayout}
        formItems={curFormItem}
        values={{ ...(curValue || {}), ...expand }}
        onFinish={handleFinish}
        setSubmitFun={(submit: () => void) => { submitFun = submit }}
      />
    );
  };
  const curTitle = currentPersonal || current;
  return (
    <Modal
      title={done ? `查看${type ? '个人' : '企业'}会员` : `${curTitle ? '编辑' : '添加'}${type ? '个人' : '企业'}会员`}
      className='standardListForm'
      width={640}
      bodyStyle={{ padding: '28px 0 0' }}
      destroyOnClose
      visible={visible}
      {...modalFooter}
    >
      {getModalContent()}
    </Modal>
  );
};

export default OperationModal;
