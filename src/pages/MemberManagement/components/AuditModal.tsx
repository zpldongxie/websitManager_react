import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import CustomForm from '@/components/CustomForm';
import type { FormItemType } from '@/components/CustomForm/interfice';
import type { AuditMemberParams } from '../data';

type OperationModalProps = {
  type?: string;
  visible: boolean;
  current?: AuditMemberParams;
  onSubmit?: (values: AuditMemberParams) => void;
  onCancel: () => void;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

let submitFun: () => void;

const AuditModal: FC<OperationModalProps> = (props) => {
  const { visible, current, onCancel, onSubmit, } = props;

  const [expand, setExpand] = useState({})
  const [rejectStatus, setRejectStatus] = useState<boolean>(true);

  useEffect(() => {
    if (!props.visible) {
      setExpand({});
    }
    if (current && current.status) {
      if (current.status === '申请驳回') {
        setRejectStatus(false);
      } else {
        setRejectStatus(true);
      }
    }
  }, [current, props.visible]);

  const handleSubmit = () => {
    if (typeof submitFun === 'function')
      submitFun();
  };

  const handleFinish = (values: Record<string, any>) => {
    if (onSubmit) {
      onSubmit(values as AuditMemberParams);
    }
  };

  const modalFooter = { okText: '保存', onOk: handleSubmit, onCancel };
  const memberStatusItems = [
    { value: '申请中', text: '申请中' },
    { value: '初审通过', text: '初审通过' },
    { value: '正式会员', text: '正式会员' },
    { value: '申请驳回', text: '申请驳回' },
    { value: '禁用', text: '禁用' },
  ];
  const changeValue = (value: string) => {
    if (current) {
      if (value === "申请驳回") {
        current.status = value;
        setRejectStatus(false);
      } else {
        current.status = value;
        setRejectStatus(true);
      }
    }
  }
  const getModalContent = () => {
    const getFormItems = (): FormItemType[] => [
      { type: 'input', name: 'id', label: 'id', disabled: true, hidden: true },
      { type: 'select', name: 'status', label: '状态', items: memberStatusItems, onChange: changeValue },
      { type: 'textArae', name: 'rejectDesc', label: '驳回原因', hidden: rejectStatus },
    ];
    return (
      <CustomForm
        formLayout={formLayout}
        formItems={getFormItems()}
        values={{ ...(current), ...expand }}
        onFinish={handleFinish}
        setSubmitFun={(submit: () => void) => { submitFun = submit }}
      />
    );
  };
  return (
    <Modal
      title={`审核`}
      width={540}
      bodyStyle={{ padding: '28px 0 0' }}
      destroyOnClose
      visible={visible}
      {...modalFooter}
    >
      {getModalContent()}
    </Modal>
  );
};

export default AuditModal;
