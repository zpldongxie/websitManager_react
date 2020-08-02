import React, { FC, useEffect } from 'react';
import { Modal, Result, Button, Form } from 'antd';
import {FormInput, FormSelect, FormTimeRange, FormTextArea} from './CustomFormItem';
import { TrainingDataType } from '../data.d';
import styles from '../style.less';
import { FormSelectProps } from './interfice';

interface OperationModalProps {
  done: boolean;
  visible: boolean;
  current: Partial<TrainingDataType> | undefined;
  channelList: {id: string; name: string;}[];
  onDone: () => void;
  onSubmit: (values: TrainingDataType) => void;
  onCancel: () => void;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const OperationModal: FC<OperationModalProps> = (props) => {
  const [form] = Form.useForm();
  
  const { done, visible, current, channelList=[], onDone, onCancel, onSubmit } = props;

  useEffect(() => {
    if (form && !visible) {
      form.resetFields();
    }
  }, [props.visible]);

  useEffect(() => {
    if (current) {
      form.setFieldsValue({
        ...current,
      });
    }
  }, [props.current]);

  const handleSubmit = () => {
    if (!form) return;
    form.submit();
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
      form.setFieldsValue({
        registStartTime: new Date(formatString[0]),
        registEndTime: new Date(formatString[1]),
      })
    }
    
    const onTimeChange = (_: any, formatString: [string, string]) => {
      form.setFieldsValue({
        startTime: new Date(formatString[0]),
        endTime: new Date(formatString[1]),
      })
    }

    const channelItems = channelList.map(channel => ({value: channel.id, text: channel.name}));

    const trainingMethodItems = [
      {value: '线上公开', text: '线上公开'},
      {value: '线上私享', text: '线上私享'},
      {value: '线下公开', text: '线下公开'},
      {value: '线下私享', text: '线下私享'},
    ];

    const formItems = [
      {type: 'input', name: 'title', label: '培训标题', requiredMsg: '请输入培训标题'},
      {type: 'input', name: 'subTitle', label: '培训副标题'},
      {type: 'select', name: 'ChannelId', label: '所属栏目', requiredMsg: '请选择所属栏目', items: channelItems},
      {type: 'select', name: 'trainingMethod', label: '培训形式', requiredMsg: '请选择培训形式', items: trainingMethodItems},
      {type: 'timeRange', name: 'registTimeRange', label: '报名时间', requiredMsg: '请设置报名时间', onChange: onRegTimeChange},
      {type: 'input', name: 'registStartTime', label: '报名开始时间', requiredMsg: '请设置报名开始时间',  hidden: true},
      {type: 'input', name: 'registEndTime', label: '报名截止时间', requiredMsg: '请设置报名截止时间',  hidden: true},
      {type: 'timeRange', name: 'timeRange', label: '培训时间', requiredMsg: '请设置培训时间', onChange: onTimeChange},
      {type: 'input', name: 'startTime', label: '培训开始时间', requiredMsg: '请设置培训开始时间',  hidden: true},
      {type: 'input', name: 'endTime', label: '培训结束时间', requiredMsg: '请设置培训结束时间',  hidden: true},
      {type: 'textArae', name: 'desc', label: '培训活动描述'},
    ];

    return (
      <Form {...formLayout} form={form} onFinish={handleFinish}>
        {
          formItems.map(formItem => {
            const {type, ...currentProps} = formItem;
            switch(type) {
              case 'input':
                return <FormInput {...currentProps} key={formItem.label} />
                // return formInput(currentProps)
              case 'select':
                return <FormSelect {...currentProps as FormSelectProps} key={formItem.label} />
                // return formSelect(currentProps as FormSelectProps)
              case 'timeRange':
                return <FormTimeRange {...currentProps} key={formItem.label} />
                // return formTimeRange(currentProps)
              case 'textArae':
                return <FormTextArea {...currentProps} key={formItem.label} />
                // return formTextArae(currentProps)
              default: 
                return ''
            }            
          })
        }
      </Form>
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
