import React, { FC, useEffect, useState } from 'react';
import moment from 'moment';
import { Modal, Result, Button, Form } from 'antd';
import {FormInput, FormSelect, FormTimeRange, FormTextArea, formInput, formSelect, formTimeRange, formTextArae} from './CustomFormItem';
import { BasicListItemDataType } from '../data';
import styles from '../style.less';
import { FormSelectProps } from './interfice';

interface OperationModalProps {
  done: boolean;
  visible: boolean;
  current: Partial<BasicListItemDataType> | undefined;
  onDone: () => void;
  onSubmit: (values: BasicListItemDataType) => void;
  onCancel: () => void;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const OperationModal: FC<OperationModalProps> = (props) => {
  const [form] = Form.useForm();
  
  const { done, visible, current, onDone, onCancel, onSubmit } = props;

  const [regTimeRange, setRegTimeRange] = useState<[string, string]>(['',''])
  const [timeRange, setTimeRange] = useState<[string, string]>(['','']);

  useEffect(() => {
    if (form && !visible) {
      form.resetFields();
    }
  }, [props.visible]);

  useEffect(() => {
    if (current) {
      form.setFieldsValue({
        ...current,
        createdAt: current.createdAt ? moment(current.createdAt) : null,
      });
    }
  }, [props.current]);

  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  const handleFinish = (values: { [key: string]: any }) => {
    if (onSubmit) {
      onSubmit(values as BasicListItemDataType);
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
          subTitle='一系列的信息描述，很短同样也可以带标点。'
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
      console.log('setRegTimeRange');      
      setRegTimeRange(formatString);
    }
    
    const onTimeChange = (_: any, formatString: [string, string]) => {
      console.log('setTimeRange');      
      setTimeRange(formatString);
    }

    const channelItems = [
      {value: 1, text: '首页'}, 
      {value: 3, text: '关于协会'}
    ];

    const trainingMethodItems = [
      {value: '线上公开', text: '线上公开'},
      {value: '线上私享', text: '线上私享'},
      {value: '线下公开', text: '线下公开'},
      {value: '线下私享', text: '线下私享'},
    ];

    const formItems = [
      {type: 'input', name: 'title', label: '培训标题', requiredMsg: '请输入培训标题'},
      {type: 'input', name: 'subTitle', label: '培训副标题'},
      {type: 'select', name: 'ChannelId', label: '所属栏目', requiredMsg: '请选择所属栏目', items: channelItems, defaultValue: 1},
      {type: 'select', name: 'trainingMethod', label: '培训形式', requiredMsg: '请选择培训形式', items: trainingMethodItems, defaultValue: '线上公开'},
      {type: 'timeRange', name: 'registTimeRange', label: '报名时间', requiredMsg: '请设置报名时间', onChange: onRegTimeChange},
      {type: 'input', name: 'registStartTime', label: '报名开始时间', requiredMsg: '请设置报名开始时间',  value: regTimeRange[0], hidden: true},
      {type: 'input', name: 'registEndTime', label: '报名截止时间', requiredMsg: '请设置报名截止时间',  value: regTimeRange[1], hidden: true},
      {type: 'timeRange', name: 'timeRange', label: '培训时间', requiredMsg: '请设置培训时间', onChange: onTimeChange},
      {type: 'input', name: 'startTime', label: '培训开始时间', requiredMsg: '请设置培训开始时间',  value: timeRange[0], hidden: true},
      {type: 'input', name: 'endTime', label: '培训结束时间', requiredMsg: '请设置培训结束时间',  value: timeRange[1], hidden: true},
      {type: 'textArae', name: 'desc', label: '培训活动描述'},
    ];

    return (
      <Form {...formLayout} form={form} onFinish={handleFinish}>
        {
          formItems.map(formItem => {
            const {type, ...currentProps} = formItem;
            switch(type) {
              case 'input':
                return formInput(currentProps)
              case 'select':
                return formSelect(currentProps as FormSelectProps)
              case 'timeRange':
                return formTimeRange(currentProps)
              case 'textArae':
                return formTextArae(currentProps)
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
