import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { Modal, Spin } from 'antd';
import CustomForm from '@/components/CustomForm';
import type { TableListItem, PersonalTableListItem, MemberStatus } from '../data';
import type { FormItemType } from '@/components/CustomForm/interfice';

import { queryMemberTypes } from '../service';

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
  labelCol: { flex: '7em' },
  wrapperCol: { flex: 'auto' },
};


let submitFun: () => void;

const OperationModal: FC<OperationModalProps> = (props) => {
  const { type, done, visible, loading, current, currentPersonal, onDone, onCancel, onSubmit, onSubmitPersonal } = props;

  const [expand, setExpand] = useState({});
  const [status] = useState<MemberStatus>(current?.status || '申请中');
  const [memberTypes, setMemberTypes] = useState<{ value: any; text: any; }[] | undefined>(undefined);
  const [MemberTypeId, setMemberTypeId] = useState<string | undefined>(current?.MemberTypeId || undefined);
  const [MemberIndvicId, setMemberIndvicId] = useState<string | undefined>(current?.MemberTypeId || undefined);
  const curmemberTypes: React.SetStateAction<{ value: any; text: any; }[] | undefined> = [];
  const getMemberTypes = async () => {
    const result = await queryMemberTypes();
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < result.length; i++) {
      if (result[i].name !== "个人会员") {
        curmemberTypes.push({
          value: result[i].id,
          text: result[i].name,
        })
        if (result[i].name === "单位会员") {
          setMemberTypeId(result[i].id)
        }
      } else {
        setMemberIndvicId(result[i].id)
      }
    }
    setMemberTypes(curmemberTypes);
  }
  useEffect(() => {
    if (!props.visible) {
      setExpand({});
    }
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    memberTypes === undefined ? getMemberTypes() : '';
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
  const idTypeItems = [
    { value: '身份证', text: '身份证' },
  ];
  const getModalContent = () => {
    const formItems = (): FormItemType[] => [
      { type: 'input', name: 'id', label: 'id', disabled: true, hidden: true },
      { type: 'input', name: 'status', label: '会员状态', disabled: true, hidden: true },
      { type: 'input', name: 'corporateName', label: '单位名称', disabled, rules: [{ required: true, message: '请输入单位名称' }] },
      {
        type: 'group',
        key: 'group1',
        groupItems: [
          {
            type: 'select', name: 'MemberTypeId', label: '会员等级', disabled, items: memberTypes,
          },
          { type: 'input', name: 'contacts', label: '联系人', disabled, rules: [{ required: true, message: '请输入联系人' }] },
        ],
      },
      {
        type: 'group',
        key: 'group2',
        groupItems: [
          {
            type: 'input', name: 'contactsMobile', label: '手机号', disabled, rules: [
              {
                pattern: new RegExp(/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/),
                message: '电话格式有误',
              }, { required: true, message: '请输入手机号' }]
          },
          {
            type: 'input', name: 'email', label: '联系邮箱', disabled, rules: [
              {
                type: 'email',
                message: '联系邮箱格式有误',
              }, { required: true, message: '请输入联系邮箱' }
            ]
          },
        ],
      },
      {
        type: 'group',
        key: 'group3',
        groupItems: [
          {
            type: 'input', name: 'tel', label: '单位电话', disabled, rules: [
              {
                pattern: new RegExp(/\d{3}-\d{8}|\d{4}-\d{7}/),
                message: '电话格式有误',
              }, { required: true, message: '请输入单位电话' }
            ]
          },
          { type: 'input', name: 'zipCode', label: '单位邮编', disabled, },
        ],
      },
      { type: 'input', name: 'address', label: '联系地址', disabled, rules: [{ required: true, message: '请输入联系地址' }] },
      {
        type: 'input', name: 'website', label: '单位网站', disabled, rules: [
          {
            type: 'url',
            message: '网站格式有误',
          },
        ]
      },
      { type: 'textArae', name: 'intro', label: '单位简介', disabled, rules: [{ required: true, message: '请输入单位简介' }] },
    ];
    const formItemsPersonal = (): FormItemType[] => [
      { type: 'input', name: 'id', label: 'id', disabled: true, hidden: true },
      { type: 'input', name: 'MemberTypeId', label: '会员等级ID', disabled: true, hidden: true },
      { type: 'input', name: 'status', label: '会员状态', disabled: true, hidden: true },
      {
        type: 'group',
        key: 'group1',
        groupItems: [

          { type: 'input', name: 'name', label: '姓名', disabled, rules: [{ required: true, message: '请输入姓名' }] },
          {
            type: 'radio', name: 'sex', label: '性别', disabled, items: [
              { value: '男', text: '男' },
              { value: '女', text: '女' }
            ]
          },
        ],
      },
      {
        type: 'group',
        key: 'group2',
        groupItems: [
          { type: 'input', name: 'profession', label: '职业', disabled, },
          {
            type: 'input', name: 'mobile', label: '手机号', disabled, rules: [
              {
                pattern: new RegExp(/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/),
                message: '手机号码格式有误',
              }, { required: true, message: '请输入手机号' }]
          },
        ],
      },
      {
        type: 'group',
        key: 'group3',
        groupItems: [
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
        ],
      },
      {
        type: 'group',
        key: 'group4',
        groupItems: [
          {
            type: 'input', name: 'email', label: '联系邮箱', disabled, rules: [
              {
                type: 'email',
                message: '邮箱格式有误',
              }, { required: true, message: '请输入联系邮箱' }
            ]
          },
          {
            type: 'input', name: 'website', label: '个人网站', disabled, rules: [
              {
                type: 'url',
                message: '网站格式有误',
              },
            ]
          },
        ],
      },
      { type: 'textArae', name: 'intro', label: '个人介绍', disabled, rules: [{ required: true, message: '请输入个人介绍' }] },
    ];
    const curFormItem = type ? formItemsPersonal() : formItems();
    const curValue = type ? currentPersonal : current;
    const defaultValues = type ? { sex: '男', status: '申请中', idType: '身份证', MemberTypeId: MemberIndvicId } : { status, MemberTypeId };
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
      title={done ? `查看信息` : `${curTitle ? '编辑信息' : '新增'}`}
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
