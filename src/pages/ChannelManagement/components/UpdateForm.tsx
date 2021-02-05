/** !
 * @description: 服务信息编辑表单
 * @author: zpl
 * @Date: 2021-01-08 15:08:31
 * @LastEditTime: 2021-01-08 15:08:33
 * @LastEditors: zpl
 */
import React, { useEffect, useState } from 'react';
import CustomForm from '@/components/CustomForm';
import { Button, Col, message, Row, Space } from 'antd';
import pinyin from 'pinyin';

import { queryAllTypes } from '../service';

import type { FormItemType } from '@/components/CustomForm/interfice';
import type { ChannelType, ChannelTypeType } from '@/utils/data';
import ChannelSelector from '@/components/ChannelSelector';

const formLayout = {
  labelCol: { flex: '7em' },
  wrapperCol: { flex: 'auto' },
};

// 显示状态
const showStatusItems = [
  { value: 0, text: '不显示' },
  { value: 1, text: '全部显示' },
  { value: 2, text: '仅主菜单显示' },
  { value: 3, text: '仅侧边菜单显示' },
  { value: 4, text: '单独显示' },
];

let submitFun: () => void;

type PropsType = {
  infoEdit?: boolean;
  current?: ChannelType | null;
  onSubmit: (values: ChannelType) => void;
  onCancel?: () => void;
};

const UpdateForm = (props: PropsType) => {
  const { infoEdit = false, current, onSubmit, onCancel } = props;
  const [info, setInfo] = useState<ChannelType | null>(null);
  const [channelTypeItems, setChannelTypeItems] = useState<{ value: string; text: string }[]>([]); // 所有类型数据
  const [currentType, setCurrentType] = useState('文章列表'); // 当前类型，用于组件显示控制

  // 获取栏目类型下拉框数据
  useEffect(() => {
    (async () => {
      const types: ChannelTypeType[] = await queryAllTypes();
      setChannelTypeItems(
        types
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((type) => ({
            value: type.id!,
            text: type.name,
          })),
      );
    })();
  }, []);

  // 初始化栏目类型
  useEffect(() => {
    const newInfo = current || {
      name: '',
      enName: '',
      ChannelTypeId: channelTypeItems.find((type) => type.text === '文章列表')?.value || '',
      parentId: '',
      keyWord: '',
      url: '',
      descStr: '',
      showStatus: 1,
      settingExtend: true,
    };
    setInfo(newInfo);
  }, [channelTypeItems, current]);

  // 类型变化时触发
  useEffect(() => {
    const curr = channelTypeItems.find((type) => type.value === info?.ChannelTypeId);
    setCurrentType(curr?.text || '文章列表');
  }, [channelTypeItems, info?.ChannelTypeId]);

  const formItemList: FormItemType[] = [
    { type: 'input', name: 'id', label: 'id', hidden: true },
    {
      type: 'group',
      key: 'group1',
      groupItems: [
        {
          type: 'input',
          name: 'name',
          label: '栏目标题',
          rules: [{ required: true, message: '请输入栏目标题' }],
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            const py =
              value === '首页'
                ? 'index'
                : pinyin(value, {
                    style: pinyin.STYLE_FIRST_LETTER, // 设置拼音风格
                  }).join('');
            setInfo({ ...info!, name: value, enName: py });
          },
          disabled: !infoEdit,
        },
        { type: 'input', name: 'enName', label: '英文名', disabled: true },
      ],
    },
    {
      type: 'group',
      key: 'group2',
      groupItems: [
        {
          type: 'select',
          name: 'ChannelTypeId',
          label: '栏目类型',
          items: channelTypeItems,
          onChange: (value: string) => {
            setInfo({ ...info!, ChannelTypeId: value });
          },
          rules: [{ required: true, message: '请选择栏目类型' }],
          disabled: !infoEdit,
        },
        {
          type: 'custom',
          name: 'parentId',
          label: '父栏目',
          children: (
            <ChannelSelector
              disabled={!infoEdit}
              multiple={false}
              onChange={(value: string) => {
                setInfo({ ...info!, parentId: value === '' ? null : value });
              }}
            />
          ),
        },
      ],
    },
    {
      type: 'group',
      key: 'group3',
      groupItems: [
        {
          type: 'input',
          name: 'keyWord',
          label: '关键字',
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            setInfo({ ...info!, keyWord: value });
          },
          disabled: !infoEdit,
        },
      ],
    },
    {
      type: 'input',
      name: 'url',
      label: '链接',
      disabled: !infoEdit,
      hidden: currentType !== '外部链接',
    },
    {
      type: 'textArae',
      name: 'descStr',
      label: '描述',
      disabled: !infoEdit,
    },
    {
      type: 'group',
      key: 'group4',
      groupItems: [
        {
          type: 'select',
          name: 'showStatus',
          label: '显示状态',
          rules: [{ required: true, message: '请设置显示状态' }],
          items: showStatusItems,
          disabled: !infoEdit,
          onChange: (_: any, formatString: any) => {
            setInfo({ ...info!, showStatus: formatString.value });
          },
          span: 12,
        },
        {
          type: 'empty',
          span: 5,
        },
        {
          type: 'switch',
          name: 'settingExtend',
          label: '是否继承设置',
          disabled: !infoEdit,
          span: 7,
        },
      ],
    },
  ];

  const handleSubmit = () => {
    if (typeof submitFun === 'function') submitFun();
  };
  const handleFinish = (values: ChannelType) => {
    if (onSubmit) {
      onSubmit(values);
    }
  };

  return (
    <>
      <CustomForm
        formLayout={formLayout}
        formItems={formItemList}
        // formItems={getFormItems(infoEdit)}
        values={{ ...info }}
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
          borderBottom: '1px solid #ddd',
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
