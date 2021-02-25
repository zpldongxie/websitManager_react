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
  labelCol: { flex: '7em' },
  wrapperCol: { span: 24 },
};
let setSubmitFun: () => void;

const statusItems = [
  { value: '申请中', text: '申请中' },
  { value: '初审通过', text: '初审通过' },
  { value: '正式入驻', text: '正式入驻' },
  { value: '申请驳回', text: '申请驳回' },
  { value: '禁用', text: '禁用' },
];

const DirectoryForm = (props: PropsType) => {
  const { disabled, onSubmit, submitFun, isSubmin, current } = props;
  const [info, setInfo] = useState<TableListItem | null | undefined>(null);
  const [isShowReject, setIsShowReject] = useState('');
  useEffect(() => {
    const ChannelName: any[] = [];
    if (current) {
      const currents = { ...current };
      // eslint-disable-next-line array-callback-return
      currents.Channels.map((item: { id: any }) => {
        ChannelName.push(item.id);
      });

      currents.Channels = ChannelName;
      setInfo(currents);
    }
  }, [current]);

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
    if (current) {
      // eslint-disable-next-line no-param-reassign
      values.id = current.id;
    }
    const Channels: { id: any }[] = [];
    values.Channels.map((item: any) => Channels.push({ id: item }));
    // eslint-disable-next-line no-param-reassign
    values.Channels = Channels;
    // eslint-disable-next-line no-param-reassign
    values.type = '厂商';
    if (onSubmit) {
      onSubmit(values);
    }
  };

  const formItemList: FormItemType[] = [
    {
      type: 'group',
      key: 'group1',
      groupItems: [
        {
          type: 'input',
          name: 'corporateName',
          label: '单位名称',
          disabled,
          rules: [{ required: true, message: '请填写单位名称' }],
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            const newInfo = info ? { ...info, corporateName: value } : null;
            setInfo(newInfo);
          },
        },
        {
          type: 'input',
          name: 'contacts',
          label: '联系人',
          disabled,
          rules: [{ required: true, message: '请填写联系人' }],
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            const newInfo = info ? { ...info, contacts: value } : null;
            setInfo(newInfo);
          },
        },
      ],
    },
    {
      type: 'group',
      key: 'group2',
      groupItems: [
        {
          type: 'input',
          name: 'contactsMobile',
          label: '手机号',
          disabled,
          rules: [{ required: true, message: '请填写手机号' }],
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            const newInfo = info ? { ...info, contactsMobile: value } : null;
            setInfo(newInfo);
          },
        },
        {
          type: 'input',
          name: 'tel',
          label: '电话',
          disabled,
          rules: [{ required: true, message: '请填写电话' }],
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            const newInfo = info ? { ...info, tel: value } : null;
            setInfo(newInfo);
          },
        },
      ],
    },
    {
      type: 'group',
      key: 'group3',
      groupItems: [
        {
          type: 'input',
          name: 'email',
          label: '邮箱',
          disabled,
          rules: [{ required: true, message: '请填写邮箱' }],
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            const newInfo = info ? { ...info, email: value } : null;
            setInfo(newInfo);
          },
        },
        {
          type: 'input',
          name: 'website',
          label: '官方网站',
          disabled,
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            const newInfo = info ? { ...info, website: value } : null;
            setInfo(newInfo);
          },
        },
      ],
    },
    {
      type: 'group',
      key: 'group4',
      groupItems: [
        {
          type: 'input',
          name: 'address',
          label: '地址',
          disabled,
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            const newInfo = info ? { ...info, address: value } : null;
            setInfo(newInfo);
          },
        },
        {
          type: 'input',
          name: 'zipCode',
          label: '邮编',
          disabled,
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            const newInfo = info ? { ...info, zipCode: value } : null;
            setInfo(newInfo);
          },
        },
      ],
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
      type: 'textArea',
      name: 'descStr',
      label: '申请描述',
      disabled,
      rules: [{ required: true, message: '请填写申请描述' }],
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const newInfo = info ? { ...info, descStr: value } : null;
        setInfo(newInfo);
      },
    },
    {
      type: 'group',
      key: 'group5',
      groupItems: [
        {
          type: 'select',
          name: 'status',
          label: '状态',
          disabled,
          rules: [{ required: true, message: '请选择状态' }],
          items: statusItems,
          onChange: (_: any, formatString: any) => {
            setIsShowReject(formatString.value);
            setInfo({ ...info!, status: formatString.value });
          },
        },
        isShowReject === '申请驳回'
          ? {
              type: 'input',
              name: 'rejectDesc',
              label: '驳回原因',
              rules: [{ required: true, message: '请填写驳回原因' }],
              disabled,
              onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                const { value } = event.target;
                const newInfo = info ? { ...info, rejectDesc: value } : null;
                setInfo(newInfo);
              },
            }
          : {},
      ],
    },
  ];
  return (
    <div>
      <CustomForm
        formLayout={formLayout} // 表单布局
        formItems={formItemList} // 表单字段
        values={info} // 表单字段的内容
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
