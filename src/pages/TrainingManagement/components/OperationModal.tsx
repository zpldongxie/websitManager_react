import React, { FC, useState, useEffect } from 'react';
import { Modal, Result, Button } from 'antd';
import CustomForm from '@/components/CustomForm';
import { TrainingDataType } from '../data.d';
import styles from '../style.less';

interface OperationModalProps {
  done: boolean;
  visible: boolean;
  current: Partial<TrainingDataType> | undefined;
  channelList: { id: string; name: string; }[];
  onDone: () => void;
  onSubmit: (values: TrainingDataType) => void;
  onCancel: () => void;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

let submitFun: () => void;

const OperationModal: FC<OperationModalProps> = (props) => {
  const { done, visible, current, channelList = [], onDone, onCancel, onSubmit } = props;

  const [expand, setExpand] = useState({})

  useEffect(() => {
    if (!props.visible) {
      setExpand({});
    }
  }, [props.visible]);

  const handleSubmit = () => {
    if (typeof submitFun === 'function')
      submitFun();
  };

  const handleFinish = (values: { [key: string]: any }) => {
    if (onSubmit) {
      onSubmit(values as TrainingDataType);
    }
  };

  const modalFooter = done
    ? { footer: null, onCancel: onDone }
    : { okText: '保存', onOk: handleSubmit, onCancel };

  const getModalContent = () => {
    if (done) {
      return (
        <Result
          status='success'
          title='操作成功'
          // subTitle='一系列的信息描述，很短同样也可以带标点。'
          extra={
            <Button type='primary' onClick={onDone}>
              知道了
            </Button>
          }
          className={styles.formResult}
        />
      );
    }

    const onRegTimeChange = (_: any, formatString: [string, string]) => {
      setExpand({
        registStartTime: new Date(formatString[0]),
        registEndTime: new Date(formatString[1]),
      });
    }

    const onTimeChange = (_: any, formatString: [string, string]) => {
      setExpand({
        startTime: new Date(formatString[0]),
        endTime: new Date(formatString[1]),
      });
    }

    const channelItems = channelList.map(channel => ({ value: channel.id, text: channel.name }));

    const trainingMethodItems = [
      { value: '线上公开', text: '线上公开' },
      { value: '线上私享', text: '线上私享' },
      { value: '线下公开', text: '线下公开' },
      { value: '线下私享', text: '线下私享' },
    ];

    const formItems = [
      { type: 'input', name: 'title', label: '培训标题', rules: [{ required: true, message: '请输入培训标题' }] },
      { type: 'input', name: 'subTitle', label: '培训副标题' },
      { type: 'select', name: 'ChannelId', label: '所属栏目', rules: [{ required: true, message: '请选择所属栏目' }], items: channelItems },
      { type: 'select', name: 'trainingMethod', label: '培训形式', rules: [{ required: true, message: '请选择培训形式' }], items: trainingMethodItems },
      { type: 'timeRange', name: 'registTimeRange', label: '报名时间', rules: [{ required: true, message: '请设置报名时间' }], onChange: onRegTimeChange },
      { type: 'input', name: 'registStartTime', label: '报名开始时间', rules: [{ required: true, message: '请设置报名开始时间' }], hidden: true },
      { type: 'input', name: 'registEndTime', label: '报名截止时间', rules: [{ required: true, message: '请设置报名截止时间' }], hidden: true },
      { type: 'timeRange', name: 'timeRange', label: '培训时间', rules: [{ required: true, message: '请设置培训时间' }], onChange: onTimeChange },
      { type: 'input', name: 'startTime', label: '培训开始时间', rules: [{ required: true, message: '请设置培训开始时间' }], hidden: true },
      { type: 'input', name: 'endTime', label: '培训结束时间', rules: [{ required: true, message: '请设置培训结束时间' }], hidden: true },
      { type: 'textArae', name: 'desc', label: '培训活动描述' },
    ];

    return (
      <CustomForm 
      formLayout={formLayout} 
      formItems={formItems} 
      values={{ ...(current || {}), ...expand }} 
      onFinish={handleFinish} 
      setSubmitFun={(submit: () => void)=>{submitFun = submit}}
      />
    );
  };

  return (
    <Modal
      title={done ? null : `${current ? '编辑' : '添加'}培训`}
      className={styles.standardListForm}
      width={640}
      bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
      destroyOnClose
      visible={visible}
      {...modalFooter}
    >
      {getModalContent()}
    </Modal>
  );
};

export default OperationModal;
