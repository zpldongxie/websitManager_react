import React from 'react';
import { Modal } from 'antd';

type CreateFormProps = {
  title: string;
  modalVisible: boolean;
  onCancel: () => void;
};

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
      bodyStyle={{ maxHeight: '65vh', overflowY: 'auto' }}
    >
      {props.children}
    </Modal>
  );
};

export default CreateForm;
