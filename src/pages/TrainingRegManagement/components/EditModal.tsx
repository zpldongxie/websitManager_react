import React from 'react';
import { Modal } from 'antd';
import CustomForm from '@/components/CustomForm';
import type { FormItemType } from '@/components/CustomForm/interfice';
import type { TableListItem } from '../data';

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

// 用于引用表单的提交方法
let submitFun: () => void;

type EditModalProps = {
  modalVisible: boolean;
  /**
   * 是否有回填的值
   *
   * @type {(Partial<TableListItem> | undefined)}
   * @memberof EditModalProps
   */
  current?: Partial<TableListItem> | null;
  /**
   * 下拉框中使用到的items，具体跟业务走
   *
   * @type {({ value: string | number; text: string; }[])}
   * @memberof EditModalProps
   */
  trainingItems: { value: string | number; text: string; }[];
  /**
   * 表单验证通过后执行的具体提交方法
   *
   * @memberof EditModalProps
   */
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const EditModal: React.FC<EditModalProps> = (props) => {
  const { modalVisible, current, trainingItems, onSubmit, onCancel } = props;

  const formItems: FormItemType[] = [
    { type: 'input', name: 'id', label: 'id', disabled: true, hidden: true },
    { type: 'select', name: 'TrainingId', label: '培训信息', rules: [{required: true, message: '请选择培训信息'}], items: trainingItems },
    { type: 'input', name: 'name', label: '姓名', rules: [{required: true, message: '请输入姓名'}] },
    { type: 'input', name: 'mobile', label: '手机号', rules: [{required: true, message: '请输入手机号'}] },
    { type: 'input', name: 'email', label: '邮箱', rules: [{required: true, message: '请输入邮箱地址'}] },
    { type: 'input', name: 'comp', label: '单位', rules: [{required: true, message: '请输入单位名称'}] },
  ];

  return (
    <Modal
      destroyOnClose
      title={`${current ? '编辑信息' : '新增'}`}
      visible={modalVisible}
      okText='保存'
      onOk={() => submitFun()}
      onCancel={() => onCancel()}
    >
      <CustomForm
        formLayout={formLayout}
        formItems={formItems}
        values={current}
        onFinish={onSubmit}
        setSubmitFun={(submit: () => void) => {
          submitFun = submit;
        }}
      />
    </Modal>
  );
};

export default EditModal;
