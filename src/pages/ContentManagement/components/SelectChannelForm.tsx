import React from 'react';
import { Modal } from 'antd';

interface SelectFormProps {
  modalVisible: boolean;
  onCancel: () => void;
}

const SelectForm: React.FC<SelectFormProps> = (props) => {
  const { modalVisible, onCancel } = props;

  return (
    <Modal
      destroyOnClose
      title="选择栏目"
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      {props.children}
    </Modal>
  );
};

export default SelectForm;
