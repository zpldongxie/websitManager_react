import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { Modal, Spin } from 'antd';
import CustomForm from '@/components/CustomForm';
import type { TableListItem, PersonalTableListItem } from '../data';
import type { FormItemType } from '@/components/CustomForm/interfice';

type OperationModalProps = {
  type?: string;
  done: boolean;
  visible: boolean;
  loading: boolean;
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
  const { type, done, visible, loading, current, currentPersonal, onDone, onCancel, onSubmit, onSubmitPersonal } = props;

  const [expand, setExpand] = useState({});
  const [loadingSpin, setLoadingSpin] = useState<boolean>(false);

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
    if (type === "personal" && onSubmitPersonal) {
      onSubmitPersonal(values as PersonalTableListItem);
    } else if (onSubmit) {
      onSubmit(values as TableListItem);
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
  const idTypeItems = [
    { value: '身份证', text: '身份证' },
  ];
  const getModalContent = () => {
    const formItems = (): FormItemType[] => [
      { type: 'input', name: 'id', label: 'id', disabled: true, hidden: true },
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
    const formItemsPersonal = (): FormItemType[] => [
      { type: 'input', name: 'id', label: 'id', disabled: true, hidden: true },
      { type: 'input', name: 'name', label: '姓名', disabled, rules: [{ required: true, message: '请输入姓名' }] },
      {
        type: 'radio', name: 'sex', label: '性别', disabled, items: [
          { value: '男', text: '男' },
          { value: '女', text: '女' }
        ]
      },
      { type: 'select', name: 'idType', label: '证件类型', disabled, defaultValue: "身份证", items: idTypeItems },
      {
        type: 'input', name: 'idNumber', label: '身份证号码', disabled, rules: [{
          required: true,
          message: '请填写身份证号码',
        },
        {
          // eslint-disable-next-line max-len
          pattern: new RegExp(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/),
          message: '身份证号码格式有误',
        },]
      },
      {
        type: 'input', name: 'mobile', label: '手机号码', disabled, rules: [
          {
            pattern: new RegExp(/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/),
            message: '手机号码格式有误',
          }, { required: true, message: '请输入手机号码' }]
      },
      {
        type: 'input', name: 'email', label: '邮箱', disabled, rules: [
          {
            type: 'email',
            message: '邮箱格式有误',
          }, { required: true, message: '请输入邮箱' }
        ]
      },
      { type: 'input', name: 'homeAddress', label: '联系地址', disabled, rules: [{ required: true, message: '请输入联系地址' }] },
      { type: 'input', name: 'zipCode', label: '邮编', disabled, },
      { type: 'input', name: 'profession', label: '职业', disabled, },
      { type: 'select', name: 'status', label: '当前状态', disabled, items: memberStatusItems },
      {
        type: 'input', name: 'website', label: '个人网站', disabled, rules: [
          {
            type: 'url',
            message: '网站格式有误',
          },
        ]
      },
      { type: 'textArae', name: 'intro', label: '个人简介', disabled, rules: [{ required: true, message: '请输入个人简介' }] },
    ];
    const curFormItem = type ? formItemsPersonal() : formItems();
    const curValue = type ? currentPersonal : current;
    const defaultValues = type ? { sex: '男', status: '申请中', idType: '身份证' } : { status: '申请中' };
    return (
      <CustomForm
        formLayout={formLayout}
        formItems={curFormItem}
        values={{ ...(curValue || defaultValues), ...expand }}
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
      <Spin spinning={loading} tip="数据提交中...">
        {getModalContent()}
      </Spin>
    </Modal>
  );
};

export default OperationModal;
