import React, { useState, useEffect } from 'react';
import CustomForm from '@/components/CustomForm';
import type { FormItemType } from '@/components/CustomForm/interfice';
import { message } from 'antd';

import { getNavList } from '../service';
import type { TableListItem } from '../data';

/**
 * 厂商入驻-厂商名录-编辑表单组件
 */
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

const DirectoryForm = (props: PropsType) => {
  const { disabled, onSubmit, submitFun, isSubmin } = props;

  // 详细类别
  const [typeItems, setTypeItems] = useState([]);

  useEffect(() => {
    (async () => {
      // 组件加载完成立即获取栏目信息
      const navList = await getNavList();
      const parentNav = navList.find((nav: { name: string }) => nav.name === '厂商名录');
      const list = navList
        .filter((nav: { parentId: any }) => nav.parentId === parentNav.id)
        .map((item: { name: any; id: string }) => ({ value: item.id, text: item.name }))
        .reverse();
      setTypeItems(list);
    })();
  }, []);

  useEffect(() => {
    if (isSubmin) {
      if (typeof submitFun === 'function') {
        submitFun(setSubmitFun);
      }
    }
  }, [isSubmin, submitFun]);

  // 表单提交
  const handleFinish = (values: TableListItem) => {
    const Channels: { id: any }[] = [];
    // eslint-disable-next-line no-param-reassign
    values.type = '厂商';
    values.Channels.map((item: any) => Channels.push({ id: item }));
    // eslint-disable-next-line no-param-reassign
    values.Channels = Channels;
    if (onSubmit) {
      onSubmit(values);
    }
  };

  const [info, setInfo] = useState<TableListItem | null>(null);
  const formItemList: FormItemType[] = [
    {
      type: 'input',
      name: 'corporateName',
      label: '单位名称',
      disabled,
      rules: [{ required: true, message: '请填写单位名称' }],
    },
    {
      type: 'input',
      name: 'contacts',
      label: '联系人',
      disabled,
      rules: [{ required: true, message: '请填写联系人' }],
    },
    {
      type: 'input',
      name: 'contactsMobile',
      label: '手机号',
      disabled,
      rules: [{ required: true, message: '请填写手机号' }],
    },
    {
      type: 'select',
      name: 'Channels',
      label: '详细类别',
      disabled,
      mode: 'multiple',
      rules: [{ required: true, message: '请选择详细类别' }],
      items: typeItems,
      onChange: (_: any, formatString: any) => {
        const typeData: any = [];
        formatString.map((item: any) => typeData.push(item.value));
        setInfo({ ...info!, Channels: typeData });
      },
    },
    {
      type: 'input',
      name: 'email',
      label: '邮箱',
      disabled,
      rules: [{ required: true, message: '请填写邮箱' }],
    },
    {
      type: 'input',
      name: 'tel',
      label: '电话',
      disabled,
      rules: [{ required: true, message: '请填写电话' }],
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
      rules: [{ required: true, message: '请填写申请理由' }],
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

export default DirectoryForm;
