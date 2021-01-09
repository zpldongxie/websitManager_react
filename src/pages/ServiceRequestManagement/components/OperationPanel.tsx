import React from 'react';
import { Modal } from 'antd';

interface CreateFormProps {
  title: string;
  modalVisible: boolean;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { title, modalVisible, onCancel } = props;

  return (
    <Modal
      title={title}
      destroyOnClose
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
      width={800}
    >
      {props.children}
    </Modal>
  );
};

export default CreateForm;
